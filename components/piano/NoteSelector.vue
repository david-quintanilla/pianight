<template>
  <div class="flex gap-2 justify-between items-center">
    <UButtonGroup orientation="vertical">
      <UButton
        v-for="noteItem in note.noteList.value"
        :key="noteItem.id"
        color="neutral"
        size="xl"
        variant="soft"
        :label="noteItem.name"
        class="w-15 h-10 flex justify-center"
        @click="pianoStore.state.selectedNote = noteItem"
      />
    </UButtonGroup>
  </div>
</template>

<script setup lang="ts">
const pianoStore = usePianoStore()
const note = useNotes()

pianoStore.state.selectedNote = note.noteList.value[0]
</script>