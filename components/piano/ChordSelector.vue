<template>
  <div class="h-70 flex gap-2 flex-col">
    <UTabs :items="items" class="w-full" color="neutral" variant="link">
      <template #major-chords>
        <PianoMajorChords />
      </template>
      <template #minor-chords>
        <PianoMinorChords />
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items = ref<TabsItem[]>([
  {
    label: 'Acordes mayores',
    icon: 'entypo:note',
    slot: 'major-chords'
  },
  {
    label: 'Acordes menores',
    icon: 'entypo:note',
    slot: 'minor-chords'
  }
])
</script>