<template>
  <ToggleGroup
    type="single"
    :model-value="String(pianoStore.state.selectedNote.id)"
    class="w-full grid grid-cols-6 md:flex md:flex-wrap gap-1 p-1.5 rounded-xl bg-ink-900/40 border border-white/5 backdrop-blur"
    @update:model-value="onSelect"
  >
    <ToggleGroupItem
      v-for="noteItem in note.noteList.value"
      :key="noteItem.id"
      :value="String(noteItem.id)"
      class="font-display tracking-wide h-12 md:h-9 md:px-4 flex flex-col items-center justify-center leading-none data-[state=on]:bg-gradient-to-b data-[state=on]:from-aqua-400/15 data-[state=on]:to-aqua-500/5 data-[state=on]:text-aqua-100 data-[state=on]:ring-1 data-[state=on]:ring-aqua-400/30"
    >
      <template v-if="isDouble(noteItem.name)">
        <span class="text-[13px] md:text-sm">{{ doubleParts(noteItem.name).top }}</span>
        <span class="text-[10px] md:hidden text-paper/50 mt-0.5">{{ doubleParts(noteItem.name).bottom }}</span>
        <span class="hidden md:inline text-sm">{{ doubleParts(noteItem.name).inline }}</span>
      </template>
      <span v-else class="text-sm">{{ noteItem.name }}</span>
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'

const pianoStore = usePianoStore()
const note = useNotes()

function isDouble(name: string) {
  return name.includes(' / ')
}

function doubleParts(name: string) {
  const [top, bottom] = name.split(' / ')
  return { top, bottom, inline: name }
}

function onSelect(value: string | string[] | undefined) {
  if (typeof value !== 'string' || !value) return
  const found = note.noteList.value.find(n => String(n.id) === value)
  if (found) pianoStore.state.selectedNote = found
}
</script>
