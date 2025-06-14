<template>
  <div class="flex gap-2 flex-col">
    <UTabs
      v-model="pianoStore.state.selectChordIndex"
      :items="pianoStore.compute.chordTypes"
      class="w-full"
      color="neutral"
      variant="pill"
      size="xl"
      orientation="vertical"
      :ui="{ list: 'gap-2', trigger: 'w-full' }"
    />
  </div>
</template>

<script setup lang="ts">
const pianoStore = usePianoStore()
</script>