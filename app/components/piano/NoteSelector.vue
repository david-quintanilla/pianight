<template>
  <ToggleGroup
    type="single"
    :model-value="String(pianoStore.state.selectedNote.id)"
    class="flex-wrap gap-1 px-2 py-1.5 rounded-xl bg-ink-900/40 border border-white/5 backdrop-blur"
    @update:model-value="onSelect"
  >
    <ToggleGroupItem
      v-for="noteItem in note.noteList.value"
      :key="noteItem.id"
      :value="String(noteItem.id)"
      class="font-display text-sm tracking-wide px-4 data-[state=on]:bg-gradient-to-b data-[state=on]:from-aqua-400/15 data-[state=on]:to-aqua-500/5 data-[state=on]:text-aqua-100 data-[state=on]:ring-1 data-[state=on]:ring-aqua-400/30"
    >
      {{ noteItem.name }}
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'

const pianoStore = usePianoStore()
const note = useNotes()

function onSelect(value: string | string[] | undefined) {
  if (typeof value !== 'string' || !value) return
  const found = note.noteList.value.find(n => String(n.id) === value)
  if (found) pianoStore.state.selectedNote = found
}
</script>
