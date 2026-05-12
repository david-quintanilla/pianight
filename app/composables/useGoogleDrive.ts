import type { Song } from '~/stores/builder.store'

interface TokenResponse {
  access_token: string
  expires_in: number
  scope: string
  error?: string
}

interface DriveFile {
  id: string
  name: string
  modifiedTime: string
}

interface DriveSongMeta extends DriveFile {
  title: string
  songId: string | null
}

const DRIVE_API = 'https://www.googleapis.com/drive/v3'
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3'
const FOLDER_NAME = 'Pianight App'
const LEGACY_FOLDER_NAMES = ['Pianight']
const FOLDER_MIME = 'application/vnd.google-apps.folder'
const FILE_MIME = 'application/json'
const SCOPE = 'https://www.googleapis.com/auth/drive.file openid email'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (resp: TokenResponse) => void
            error_callback?: (err: { type: string, message?: string }) => void
          }) => { requestAccessToken: (overrides?: { prompt?: string }) => void }
          revoke: (token: string, cb?: () => void) => void
        }
      }
    }
  }
}

let folderPromise: Promise<string> | null = null

export function useGoogleDrive() {
  const driveStore = useDriveStore()
  const config = useRuntimeConfig()
  const clientId = config.public.googleClientId as string

  function waitForGoogle(timeout = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      const tick = () => {
        if (window.google?.accounts?.oauth2) return resolve()
        if (Date.now() - start > timeout) return reject(new Error('Google Identity Services no cargó'))
        setTimeout(tick, 50)
      }
      tick()
    })
  }

  async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const session = driveStore.state.session
    if (!session || session.expiresAt <= Date.now()) throw new Error('NO_SESSION')
    const headers = new Headers(init.headers)
    headers.set('Authorization', `Bearer ${session.accessToken}`)
    const res = await fetch(path, { ...init, headers })
    if (res.status === 401) {
      driveStore.clear()
      throw new Error('NO_SESSION')
    }
    return res
  }

  async function fetchEmail(accessToken: string): Promise<string | null> {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (!res.ok) return null
      const data = await res.json() as { email?: string }
      return data.email ?? null
    } catch {
      return null
    }
  }

  async function connect(): Promise<void> {
    if (!clientId) throw new Error('GOOGLE_CLIENT_ID missing')
    await waitForGoogle()

    return new Promise((resolve, reject) => {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPE,
        callback: async (resp) => {
          if (resp.error) return reject(new Error(resp.error))
          const email = await fetchEmail(resp.access_token)
          driveStore.setSession({
            accessToken: resp.access_token,
            expiresAt: Date.now() + (resp.expires_in - 60) * 1000,
            email
          })
          resolve()
        },
        error_callback: (err) => reject(new Error(err.message ?? err.type))
      })
      client.requestAccessToken({ prompt: 'consent' })
    })
  }

  function disconnect() {
    const token = driveStore.state.session?.accessToken
    if (token && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(token)
    }
    folderPromise = null
    driveStore.clear()
  }

  async function ensureFolder(): Promise<string> {
    if (driveStore.state.folderId) return driveStore.state.folderId
    if (folderPromise) return folderPromise

    folderPromise = (async () => {
      const names = [FOLDER_NAME, ...LEGACY_FOLDER_NAMES]
      const nameClause = names.map(n => `name='${n}'`).join(' or ')
      const q = encodeURIComponent(`(${nameClause}) and mimeType='${FOLDER_MIME}' and trashed=false`)
      const findRes = await authFetch(`${DRIVE_API}/files?q=${q}&fields=files(id,name,createdTime)&spaces=drive&orderBy=createdTime`)
      const found = await findRes.json() as { files?: { id: string, name: string }[] }

      let id: string
      if (found.files && found.files.length > 0) {
        id = found.files[0]!.id
        if (found.files[0]!.name !== FOLDER_NAME) {
          await authFetch(`${DRIVE_API}/files/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: FOLDER_NAME })
          })
        }
        for (let i = 1; i < found.files.length; i++) {
          const dup = found.files[i]!.id
          try {
            const childrenRes = await authFetch(`${DRIVE_API}/files?q=${encodeURIComponent(`'${dup}' in parents and trashed=false`)}&fields=files(id)`)
            const children = await childrenRes.json() as { files?: { id: string }[] }
            for (const child of children.files ?? []) {
              await authFetch(`${DRIVE_API}/files/${child.id}?addParents=${id}&removeParents=${dup}`, { method: 'PATCH' })
            }
            await authFetch(`${DRIVE_API}/files/${dup}`, { method: 'DELETE' })
          } catch (e) {
            console.warn('Could not merge duplicate folder', dup, e)
          }
        }
      } else {
        const createRes = await authFetch(`${DRIVE_API}/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: FOLDER_NAME, mimeType: FOLDER_MIME })
        })
        const created = await createRes.json() as { id: string }
        id = created.id
      }

      driveStore.setFolderId(id)
      return id
    })()

    try {
      return await folderPromise
    } finally {
      folderPromise = null
    }
  }

  function buildMultipart(metadata: object, content: string): { body: string, boundary: string } {
    const boundary = '----pianight-' + Math.random().toString(36).slice(2)
    const body =
      `--${boundary}\r\n` +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) + '\r\n' +
      `--${boundary}\r\n` +
      `Content-Type: ${FILE_MIME}\r\n\r\n` +
      content + '\r\n' +
      `--${boundary}--`
    return { body, boundary }
  }

  async function findFileBySongId(folderId: string, songId: string): Promise<string | null> {
    const q = encodeURIComponent(
      `'${folderId}' in parents and trashed=false and appProperties has { key='songId' and value='${songId}' }`
    )
    const res = await authFetch(`${DRIVE_API}/files?q=${q}&fields=files(id,createdTime)&orderBy=createdTime`)
    if (!res.ok) return null
    const data = await res.json() as { files?: { id: string }[] }
    if (!data.files || data.files.length === 0) return null

    const keep = data.files[0]!.id
    for (let i = 1; i < data.files.length; i++) {
      try {
        await authFetch(`${DRIVE_API}/files/${data.files[i]!.id}`, { method: 'DELETE' })
      } catch (e) {
        console.warn('Could not delete duplicate file', e)
      }
    }
    return keep
  }

  async function saveSong(song: Song, existingFileId: string | null): Promise<string> {
    const folderId = await ensureFolder()
    let fileId = existingFileId

    if (fileId) {
      const checkRes = await authFetch(`${DRIVE_API}/files/${fileId}?fields=id,trashed`)
      if (!checkRes.ok) fileId = null
      else {
        const data = await checkRes.json() as { trashed?: boolean }
        if (data.trashed) fileId = null
      }
    }

    if (!fileId) {
      fileId = await findFileBySongId(folderId, song.id)
    }

    const fileName = `${song.title || 'Untitled'}.json`
    const metadata: Record<string, unknown> = {
      name: fileName,
      mimeType: FILE_MIME,
      appProperties: { songId: song.id }
    }
    if (!fileId) metadata.parents = [folderId]

    const { body, boundary } = buildMultipart(metadata, JSON.stringify(song, null, 2))
    const url = fileId
      ? `${DRIVE_UPLOAD}/files/${fileId}?uploadType=multipart`
      : `${DRIVE_UPLOAD}/files?uploadType=multipart`
    const method = fileId ? 'PATCH' : 'POST'

    const res = await authFetch(url, {
      method,
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body
    })
    if (!res.ok) throw new Error('SAVE_FAILED')
    const data = await res.json() as { id: string }
    return data.id
  }

  async function listSongs(): Promise<DriveSongMeta[]> {
    const folderId = await ensureFolder()
    const q = encodeURIComponent(`'${folderId}' in parents and trashed=false and mimeType='${FILE_MIME}'`)
    const res = await authFetch(`${DRIVE_API}/files?q=${q}&fields=files(id,name,modifiedTime,appProperties)&orderBy=modifiedTime desc`)
    if (!res.ok) throw new Error('LIST_FAILED')
    type ListedFile = DriveFile & { appProperties?: { songId?: string } }
    const data = await res.json() as { files?: ListedFile[] }
    const allFiles: ListedFile[] = data.files ?? []

    const bySongId = new Map<string, ListedFile>()
    const noSongId: ListedFile[] = []
    for (const f of allFiles) {
      const sid = f.appProperties?.songId
      if (!sid) {
        noSongId.push(f)
        continue
      }
      const prev = bySongId.get(sid)
      if (!prev) {
        bySongId.set(sid, f)
      } else {
        const older = new Date(prev.modifiedTime) < new Date(f.modifiedTime) ? prev : f
        try {
          await authFetch(`${DRIVE_API}/files/${older.id}`, { method: 'DELETE' })
        } catch (e) {
          console.warn('Could not delete duplicate', e)
        }
        bySongId.set(sid, older === prev ? f : prev)
      }
    }

    const merged = [...bySongId.values(), ...noSongId]
    merged.sort((a, b) => new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime())

    return merged.map(f => ({
      id: f.id,
      name: f.name,
      modifiedTime: f.modifiedTime,
      songId: f.appProperties?.songId ?? null,
      title: f.name.replace(/\.json$/, '')
    }))
  }

  async function loadSong(fileId: string): Promise<Song> {
    const res = await authFetch(`${DRIVE_API}/files/${fileId}?alt=media`)
    if (!res.ok) throw new Error('LOAD_FAILED')
    return await res.json() as Song
  }

  async function deleteSong(fileId: string): Promise<void> {
    const res = await authFetch(`${DRIVE_API}/files/${fileId}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 404) throw new Error('DELETE_FAILED')
  }

  return { connect, disconnect, saveSong, listSongs, loadSong, deleteSong, ensureFolder }
}
