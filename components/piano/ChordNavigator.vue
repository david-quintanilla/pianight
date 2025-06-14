<template>
  <div class="flex gap-2 flex-col">
    <UTabs
      :items="chordTypes"
      class="w-full"
      color="neutral"
      variant="pill"
      size="xl"
      orientation="vertical"
      :ui="{ list: 'gap-2', trigger: 'w-full' }"
      @update:model-value="selectChord"
    />
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const notes = useNotes()
const pianoStore = usePianoStore()

const chordTypes = computed<TabsItem[]>(() => {
  return notes.chordTypes.map(chord => ({
    ...chord,
    icon: 'entypo:note',
    slot: chord.prefix
  }))
})

function selectChord (chordIndex: string | number) {
  pianoStore.actions.updateChords(chordTypes.value[Number(chordIndex)])
}

selectChord(0)
</script>