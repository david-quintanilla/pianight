<template>
  <div class="flex gap-2 flex-col">
    <UTabs
      v-model="pianoStore.state.selectChordIndex"
      :items="pianoStore.compute.chordTypes"
      color="neutral"
      variant="pill"
      size="md"
      :ui="{ list: '', trigger: 'flex px-4' }"
    />
  </div>
</template>

<script setup lang="ts">
const pianoStore = usePianoStore()
</script>