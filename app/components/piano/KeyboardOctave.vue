<template>
  <div class="h-40 flex gap-1 flex-col">
    <div class="flex h-full gap-1">
      <PianoWhiteNote
        v-for="note in notes"
        :key="note.id"
        :note="note.name"
        :is-selected="props.selectedNotes ? props.selectedNotes.includes(note.id) : false"
      >
        <PianoBlackNote
          v-if="note.blackNote"
          :notes="note.blackNote.name"
          :is-selected="props.selectedNotes ? props.selectedNotes.includes(note.blackNote.id) : false"
        />
      </PianoWhiteNote>
    </div>
    <p class="flex border-1 border-t-0 border-cyan-500 justify-center font-extrabold text-1xl">
      Octava
    </p>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  selectedNotes?: number[]
}

interface Note {
  id: number
  name: string
  blackNote?: {
    id: number
    name: string[]
  }
}

const props = defineProps<Props>()
const i18n = useI18n()

const notes: Note[] = reactive([
  {
    id: 1,
    name: i18n.t('note.c'),
    blackNote: {
      id: 2,
      name: [
        `${i18n.t('note.c')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.d')}${i18n.t('note.bemol')}`
      ]
    }
  },
  {
    id: 3,
    name: i18n.t('note.d'),
    blackNote: {
      id: 4,
      name: [
        `${i18n.t('note.d')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.e')}${i18n.t('note.bemol')}`
      ]
    }
  },
  {
    id: 5,
    name: i18n.t('note.e')
  },
  {
    id: 6,
    name: i18n.t('note.f'),
    blackNote: {
      id: 7,
      name: [
        `${i18n.t('note.f')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.g')}${i18n.t('note.bemol')}`
      ]
    }
  },
  {
    id: 8,
    name: i18n.t('note.g'),
    blackNote: {
      id: 9,
      name: [
        `${i18n.t('note.g')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.a')}${i18n.t('note.bemol')}`
      ]
    }
  },
  {
    id: 10,
    name: i18n.t('note.a'),
    blackNote: {
      id: 11,
      name: [
        `${i18n.t('note.a')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.b')}${i18n.t('note.bemol')}`
      ]
    }
  },
  {
    id: 12,
    name: i18n.t('note.b'),
  }
])
</script>