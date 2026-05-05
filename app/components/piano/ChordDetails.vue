<template>
  <div class="flex flex-col gap-3">
    <ChordSection
      v-if="currentChord?.fundamental"
      :title="`${selectedNote?.name} ${chords?.prefix}`"
      :formula="chords?.guide.fundamental"
      title-style="hero"
      :octaves="currentChord.fundamental"
    />
    <ChordSection
      v-if="currentChord?.firstInversion"
      title="Primera inversión"
      :formula="chords?.guide.firstInversion"
      :octaves="currentChord.firstInversion"
    />
    <ChordSection
      v-if="currentChord?.secondInversion"
      title="Segunda inversión"
      :formula="chords?.guide.secondInversion"
      :octaves="currentChord.secondInversion"
    />
    <ChordSection
      v-if="currentChord?.thirdInversion"
      title="Tercera inversión"
      :formula="chords?.guide.thirdInversion"
      :octaves="currentChord.thirdInversion"
    />
  </div>
</template>

<script lang="ts" setup>
import ChordSection from './ChordSection.vue'

const pianoStore = usePianoStore()

const chords = computed(() => pianoStore.compute.selectedChords)
const selectedNote = computed(() => pianoStore.state.selectedNote)

const currentChord = computed(() => {
  const note = pianoStore.state.selectedNote
  const currentChords = chords.value
  if (!note || !currentChords) return

  return currentChords.chords.find(chord => chord.id === note.id)
})
</script>
