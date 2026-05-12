interface DriveSession {
  accessToken: string
  expiresAt: number
  email: string | null
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline'

interface State {
  session: DriveSession | null
  folderId: string | null
  fileMap: Record<string, string>
  syncStatus: SyncStatus
  lastSyncedAt: number | null
}

export const useDriveStore = defineStore('driveStore', () => {
  const state: State = reactive({
    session: null,
    folderId: null,
    fileMap: {},
    syncStatus: 'idle',
    lastSyncedAt: null
  })

  const isConnected = computed(() => {
    if (!state.session) return false
    return state.session.expiresAt > Date.now()
  })

  const email = computed(() => state.session?.email ?? null)

  function setSession(session: DriveSession | null) {
    state.session = session
  }

  function setFolderId(id: string | null) {
    state.folderId = id
  }

  function setFileId(songId: string, fileId: string) {
    state.fileMap[songId] = fileId
  }

  function removeFileId(songId: string) {
    delete state.fileMap[songId]
  }

  function setSyncStatus(status: SyncStatus) {
    state.syncStatus = status
    if (status === 'synced') state.lastSyncedAt = Date.now()
  }

  function clear() {
    state.session = null
    state.folderId = null
    state.fileMap = {}
    state.syncStatus = 'idle'
    state.lastSyncedAt = null
  }

  return {
    state,
    isConnected,
    email,
    setSession,
    setFolderId,
    setFileId,
    removeFileId,
    setSyncStatus,
    clear
  }
}, {
  persist: {
    key: 'pianight-drive'
  }
})
