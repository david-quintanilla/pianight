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
        class="w-30 h-10 flex justify-center"
        :class="{ 'bg-white text-black hover:bg-white':  noteItem.id === pianoStore.state.selectedNote.id }"
        @click="pianoStore.state.selectedNote = noteItem"
      />
    </UButtonGroup>
  </div>
</template>

<script setup lang="ts">
const pianoStore = usePianoStore()
const note = useNotes()
</script>