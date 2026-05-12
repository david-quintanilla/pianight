<template>
  <div>
    <Button
      v-if="!drive.isConnected"
      variant="outline"
      size="sm"
      :disabled="connecting"
      @click="onConnect"
    >
      <Cloud :size="14" />
      {{ connecting ? $t('drive.connecting') : $t('drive.connect') }}
    </Button>

    <Sheet v-else v-model:open="open">
      <SheetTrigger as-child>
        <Button variant="outline" size="sm">
          <Cloud :size="14" />
          {{ $t('drive.menu') }}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" class="w-full sm:max-w-md flex flex-col">
        <SheetHeader class="border-b border-white/5 pb-4">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full bg-aqua-400/10 flex items-center justify-center text-aqua-300">
              <Cloud :size="18" />
            </div>
            <div class="min-w-0 flex-1">
              <SheetTitle class="text-left">{{ $t('drive.title') }}</SheetTitle>
              <SheetDescription class="text-left truncate text-[11px]">
                {{ drive.email ?? '' }}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          <a
            v-if="folderUrl"
            :href="folderUrl"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-between gap-2 rounded-md border border-white/5 bg-ink-900/40 hover:bg-ink-900/70 px-3 py-2 text-xs text-paper/70 hover:text-paper transition"
          >
            <span class="flex items-center gap-2">
              <FolderOpen :size="14" />
              {{ $t('drive.open-folder') }}
            </span>
            <ExternalLink :size="12" class="text-paper/30" />
          </a>

          <div class="flex items-center justify-between">
            <h4 class="text-[11px] uppercase tracking-[0.18em] text-paper/40">
              {{ $t('drive.your-songs') }}
              <span v-if="files.length > 0" class="text-paper/30 normal-case tracking-normal ml-1">({{ files.length }})</span>
            </h4>
            <Button variant="ghost" size="icon" :disabled="loadingList" @click="refresh">
              <RefreshCw :size="14" :class="loadingList ? 'animate-spin' : ''" />
            </Button>
          </div>

          <div v-if="error" class="rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-200">
            {{ error }}
          </div>

          <div v-if="loadingList && files.length === 0" class="text-xs text-paper/40">
            {{ $t('drive.loading') }}
          </div>

          <ul v-else-if="files.length > 0" class="flex flex-col gap-1.5">
            <li
              v-for="file in files"
              :key="file.id"
              :class="[
                'group flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition',
                isCurrent(file.id)
                  ? 'border-aqua-400/30 bg-aqua-400/5'
                  : 'border-white/5 bg-ink-900/40 hover:bg-ink-900/70'
              ]"
            >
              <button
                class="flex-1 text-left min-w-0"
                :disabled="loadingFileId === file.id || isCurrent(file.id)"
                @click="onLoad(file.id)"
              >
                <span class="flex items-center gap-2">
                  <span class="font-display text-paper/90 truncate">{{ file.title }}</span>
                  <span
                    v-if="isCurrent(file.id)"
                    class="text-[9px] uppercase tracking-wider text-aqua-300 bg-aqua-400/10 px-1.5 py-0.5 rounded shrink-0"
                  >
                    {{ $t('drive.current') }}
                  </span>
                </span>
                <span class="block text-[10px] text-paper/40 mt-0.5">
                  {{ formatDate(file.modifiedTime) }}
                </span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                class="opacity-0 group-hover:opacity-100 text-paper/40 hover:text-rose-300"
                :disabled="loadingFileId === file.id"
                @click="onDelete(file.id)"
              >
                <Trash2 :size="14" />
              </Button>
            </li>
          </ul>

          <div v-else class="rounded-md border border-white/5 bg-ink-900/30 p-6 text-xs text-paper/50 text-center">
            {{ $t('drive.empty') }}
          </div>
        </div>

        <div class="border-t border-white/5 px-6 py-3 flex items-center justify-between">
          <p class="text-[10px] text-paper/30 leading-snug">
            {{ $t('drive.auto-sync-hint') }}
          </p>
          <Button variant="ghost" size="sm" class="text-paper/50 hover:text-rose-300 shrink-0" @click="onDisconnect">
            <LogOut :size="14" />
            {{ $t('drive.disconnect') }}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Cloud, ExternalLink, FolderOpen, LogOut, RefreshCw, Trash2 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { syncNow } from '~/composables/useDriveSync'

interface DriveSongMeta {
  id: string
  name: string
  title: string
  modifiedTime: string
  songId: string | null
}

const builder = useBuilderStore()
const drive = useDriveStore()
const { connect, disconnect, listSongs, loadSong, deleteSong } = useGoogleDrive()
const { t, locale } = useI18n()

const open = ref(false)
const connecting = ref(false)
const loadingList = ref(false)
const loadingFileId = ref<string | null>(null)
const files = ref<DriveSongMeta[]>([])
const error = ref<string | null>(null)

const folderUrl = computed(() => {
  return drive.state.folderId
    ? `https://drive.google.com/drive/folders/${drive.state.folderId}`
    : null
})

function isCurrent(fileId: string): boolean {
  const songId = builder.currentSong?.id
  if (!songId) return false
  return drive.state.fileMap[songId] === fileId
}

async function onConnect() {
  error.value = null
  connecting.value = true
  try {
    await connect()
    open.value = true
  } catch (e) {
    error.value = t('drive.error-connect')
    console.error(e)
  } finally {
    connecting.value = false
  }
}

function onDisconnect() {
  disconnect()
  files.value = []
  open.value = false
}

async function refresh() {
  error.value = null
  loadingList.value = true
  try {
    files.value = await listSongs()
    for (const f of files.value) {
      if (f.songId) drive.setFileId(f.songId, f.id)
    }
  } catch (e) {
    error.value = t('drive.error-list')
    console.error(e)
  } finally {
    loadingList.value = false
  }
}

async function onLoad(fileId: string) {
  error.value = null
  loadingFileId.value = fileId
  try {
    const song = await loadSong(fileId)
    const existing = builder.state.songs.find(s => s.id === song.id)
    if (!existing) {
      builder.state.songs.unshift(song)
    } else {
      Object.assign(existing, song)
    }
    drive.setFileId(song.id, fileId)
    builder.selectSong(song.id)
    open.value = false
  } catch (e) {
    error.value = t('drive.error-load')
    console.error(e)
  } finally {
    loadingFileId.value = null
  }
}

async function onDelete(fileId: string) {
  if (!confirm(t('drive.confirm-delete'))) return
  error.value = null
  loadingFileId.value = fileId
  try {
    await deleteSong(fileId)
    files.value = files.value.filter(f => f.id !== fileId)
    for (const [songId, id] of Object.entries(drive.state.fileMap)) {
      if (id === fileId) drive.removeFileId(songId)
    }
  } catch (e) {
    error.value = t('drive.error-delete')
    console.error(e)
  } finally {
    loadingFileId.value = null
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(locale.value, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return iso
  }
}

watch(open, async (v) => {
  if (v && drive.isConnected) {
    await syncNow()
    await refresh()
  }
})
</script>
