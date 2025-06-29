<template>
  <div class="flex gap-2 items-center">
    <UButtonGroup orientation="horizontal">
      <UButton
        v-for="noteItem in note.noteList.value"
        :key="noteItem.id"
        color="neutral"
        size="md"
        variant="outline"
        :label="noteItem.name"
        class="h-8 flex justify-center px-5"
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