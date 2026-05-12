<template>
  <div class="flex items-center gap-1.5 px-2 py-1 text-[11px] text-paper/50">
    <component :is="icon" :size="12" :class="iconClass" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { Check, CloudOff, Loader2, TriangleAlert } from 'lucide-vue-next'

const drive = useDriveStore()
const { t } = useI18n()

const icon = computed(() => {
  switch (drive.state.syncStatus) {
    case 'syncing': return Loader2
    case 'synced': return Check
    case 'error': return TriangleAlert
    case 'offline': return CloudOff
    default: return Check
  }
})

const iconClass = computed(() => {
  switch (drive.state.syncStatus) {
    case 'syncing': return 'animate-spin text-paper/50'
    case 'synced': return 'text-aqua-300'
    case 'error': return 'text-rose-300'
    case 'offline': return 'text-paper/30'
    default: return ''
  }
})

const label = computed(() => {
  switch (drive.state.syncStatus) {
    case 'syncing': return t('drive.status-syncing')
    case 'synced': return t('drive.status-synced')
    case 'error': return t('drive.status-error')
    case 'offline': return t('drive.status-offline')
    default: return ''
  }
})
</script>
