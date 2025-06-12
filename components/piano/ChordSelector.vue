<template>
  <div class="h-70 flex gap-2 flex-col">
    <p class="font-bold">
      Acordes mayores - major / maj
    </p>
    <p>
      Formula: 1 + 4 + 3
    </p>
    <UButtonGroup>
      <UButton
        v-for="chord in chordList"
        :key="chord.id"
        variant="outline"
        :label="chord.name"
        @click="pianoStore.state.selectedChord = chord"
      />
    </UButtonGroup>
    <p class="flex justify-center text-9xl font-extrabold">
      {{ pianoStore.state.selectedChord?.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
const pianoStore = usePianoStore()
const i18n = useI18n()

const chordList = [
  {
    id: 1,
    name: i18n.t('note.c'),
    octaves: {
      2: { notes: [1, 5, 8] }
    }
  },
  {
    id: 2,
    name: i18n.t('note.d'),
    octaves: {
      2: { notes: [3, 7, 10] }
    }
  },
  {
    id: 3,
    name: i18n.t('note.e'),
    octaves: {
      2: { notes: [5, 9, 12] }
    }
  },
  {
    id: 4,
    name: i18n.t('note.f'),
    octaves: {
      2: { notes: [6, 10] },
      3: { notes: [1] }
    }
  },
  {
    id: 5,
    name: i18n.t('note.g'),
    octaves: {
      2: { notes: [8, 12] },
      3: { notes: [3] }
    }
  },
  {
    id: 6,
    name: i18n.t('note.a'),
    octaves: {
      2: { notes: [10] },
      3: { notes: [2, 5] }
    }
  },
  {
    id: 7,
    name: i18n.t('note.b'),
    octaves: {
      2: { notes: [12] },
      3: { notes: [4, 7] }
    }
  },
]
</script>