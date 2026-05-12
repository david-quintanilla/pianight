const DEBOUNCE_MS = 2000

const driveSyncGlobal = {
  installed: false,
  timer: null as ReturnType<typeof setTimeout> | null,
  inflight: null as Promise<void> | null,
  pending: false,
  lastSerialized: ''
}

let flushFn: (() => Promise<void>) | null = null

export function syncNow(): Promise<void> {
  if (driveSyncGlobal.timer) {
    clearTimeout(driveSyncGlobal.timer)
    driveSyncGlobal.timer = null
  }
  return flushFn ? flushFn() : Promise.resolve()
}

export function useDriveSync() {
  if (driveSyncGlobal.installed) return
  driveSyncGlobal.installed = true

  const builder = useBuilderStore()
  const drive = useDriveStore()
  const { saveSong } = useGoogleDrive()

  async function doFlush(): Promise<void> {
    driveSyncGlobal.timer = null
    const song = builder.currentSong
    if (!song || !drive.isConnected) return

    drive.setSyncStatus('syncing')
    try {
      const existing = drive.state.fileMap[song.id] ?? null
      const fileId = await saveSong(song, existing)
      drive.setFileId(song.id, fileId)
      drive.setSyncStatus('synced')
    } catch (e) {
      drive.setSyncStatus('error')
      console.error('Drive sync failed', e)
    }
  }

  async function flush(): Promise<void> {
    if (driveSyncGlobal.inflight) {
      driveSyncGlobal.pending = true
      await driveSyncGlobal.inflight
      if (driveSyncGlobal.pending) {
        driveSyncGlobal.pending = false
        return flush()
      }
      return
    }

    driveSyncGlobal.inflight = doFlush().finally(() => {
      driveSyncGlobal.inflight = null
    })
    return driveSyncGlobal.inflight
  }

  flushFn = flush

  function schedule() {
    if (!drive.isConnected) {
      drive.setSyncStatus('offline')
      return
    }
    if (!builder.currentSong) return

    if (driveSyncGlobal.timer) clearTimeout(driveSyncGlobal.timer)
    drive.setSyncStatus('syncing')
    driveSyncGlobal.timer = setTimeout(() => { flush() }, DEBOUNCE_MS)
  }

  watch(
    () => builder.currentSong && JSON.stringify(builder.currentSong),
    (serialized) => {
      if (!serialized) {
        drive.setSyncStatus(drive.isConnected ? 'idle' : 'offline')
        return
      }
      if (serialized === driveSyncGlobal.lastSerialized) return
      const isFirst = driveSyncGlobal.lastSerialized === ''
      driveSyncGlobal.lastSerialized = serialized

      if (isFirst) {
        const song = builder.currentSong
        const needsFirstUpload = drive.isConnected && song && !drive.state.fileMap[song.id]
        if (needsFirstUpload) {
          schedule()
        } else {
          drive.setSyncStatus(drive.isConnected ? 'synced' : 'offline')
        }
        return
      }
      schedule()
    },
    { immediate: true }
  )

  watch(
    () => drive.isConnected,
    (connected) => {
      if (connected && builder.currentSong) {
        schedule()
      } else if (!connected) {
        drive.setSyncStatus('offline')
      }
    }
  )
}
