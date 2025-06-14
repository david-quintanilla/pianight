<template>
  <div class="flex flex-col gap-4">
    <div v-if="currentChord?.fundamental">
      <p class="flex justify-center text-2xl font-extrabold gap-2 items-center pb-1">
        {{ selectedNote?.name }} {{ chords?.prefix }}
        <UBadge color="neutral">
          {{ chords?.guide.fundamental }}
        </UBadge>
      </p>

      <div class="flex justify-center gap-1">
        <PianoKeyboardOctave :selected-notes="currentChord.fundamental.firstOctave" />
        <PianoKeyboardOctave :selected-notes="currentChord.fundamental.secondOctave" />
        <PianoKeyboardOctave :selected-notes="currentChord.fundamental.thirdOctave" />
      </div>
    </div>

    <div v-if="currentChord?.firstInversion">
      <p class="flex justify-center text-2xl font-extrabold gap-2 items-center pb-1">
        Primera inversión
        <UBadge color="neutral">
          {{ chords?.guide.firstInversion }}
        </UBadge>
      </p>
      <div class="flex justify-center gap-1">
        <PianoKeyboardOctave :selected-notes="currentChord.firstInversion.firstOctave" />
        <PianoKeyboardOctave :selected-notes="currentChord.firstInversion.secondOctave" />
        <PianoKeyboardOctave :selected-notes="currentChord.firstInversion.thirdOctave" />
      </div>
    </div>

    <div v-if="currentChord?.secondInversion">
      <p class="flex justify-center items-center text-2xl font-extrabold gap-2 pb-1">
        Segunda inversión
        <UBadge color="neutral">
          {{ chords?.guide.secondInversion }}
        </UBadge>
      </p>
      <div class="flex justify-center gap-1">
        <PianoKeyboardOctave :selected-notes="currentChord.secondInversion.firstOctave" />
        <PianoKeyboardOctave :selected-notes="currentChord.secondInversion.secondOctave" />
        <PianoKeyboardOctave :selected-notes="currentChord.secondInversion.thirdOctave" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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