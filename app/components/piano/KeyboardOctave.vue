<template>
  <div class="h-32 flex gap-1 flex-col">
    <div class="flex h-full gap-1">
      <PianoWhiteNote
        v-for="note in notes"
        :key="note.id"
        :note="note.name"
        :is-selected="isWhiteSelected(note)"
        :clickable="!!props.octave"
        :is-middle-c="(props.octave === 4 || props.centerC) && note.letter === 'C'"
        @click="onWhiteClick(note)"
      >
        <PianoBlackNote
          v-if="note.blackNote"
          :notes="note.blackNote.name"
          :is-selected="isBlackSelected(note)"
          :clickable="!!props.octave"
          @click="onBlackClick(note)"
        />
      </PianoWhiteNote>
    </div>
    <span class="h-px bg-gradient-to-r from-transparent via-aqua-400/20 to-transparent" />
  </div>
</template>

<script lang="ts" setup>
type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'

interface Note {
  id: number
  letter: Letter
  name: string
  blackNote?: {
    id: number
    letter: Letter
    name: string[]
  }
}

interface Props {
  /** IDs internos 1-12 (modo legacy de acordes). Ignorado si se usa selectedMidis. */
  selectedNotes?: number[]
  /** MIDIs absolutos de las teclas activas. Requiere `octave` para renderizar. */
  selectedMidis?: number[]
  /** Octava real (ej: 4). Si se pasa, las teclas son clickeables y emiten eventos. */
  octave?: number
  /** Forzar el punto del DO central aunque no se sepa la octava (modo legacy). */
  centerC?: boolean
}

const props = withDefaults(defineProps<Props>(), { centerC: false })

const emit = defineEmits<{
  'toggle-white': [payload: { letter: Letter, octave: number, midi: number }]
  'toggle-black': [payload: { letter: Letter, octave: number, midi: number }]
}>()

const i18n = useI18n()

const SEMITONES: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

const notes = computed<Note[]>(() => [
  {
    id: 1,
    letter: 'C',
    name: i18n.t('note.c'),
    blackNote: {
      id: 2,
      letter: 'C',
      name: [
        `${i18n.t('note.c')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.d')}${i18n.t('note.bemol')}`
      ]
    }
  },
  {
    id: 3,
    letter: 'D',
    name: i18n.t('note.d'),
    blackNote: {
      id: 4,
      letter: 'D',
      name: [
        `${i18n.t('note.d')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.e')}${i18n.t('note.bemol')}`
      ]
    }
  },
  { id: 5, letter: 'E', name: i18n.t('note.e') },
  {
    id: 6,
    letter: 'F',
    name: i18n.t('note.f'),
    blackNote: {
      id: 7,
      letter: 'F',
      name: [
        `${i18n.t('note.f')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.g')}${i18n.t('note.bemol')}`
      ]
    }
  },
  {
    id: 8,
    letter: 'G',
    name: i18n.t('note.g'),
    blackNote: {
      id: 9,
      letter: 'G',
      name: [
        `${i18n.t('note.g')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.a')}${i18n.t('note.bemol')}`
      ]
    }
  },
  {
    id: 10,
    letter: 'A',
    name: i18n.t('note.a'),
    blackNote: {
      id: 11,
      letter: 'A',
      name: [
        `${i18n.t('note.a')}${i18n.t('note.sostenido')}`,
        `${i18n.t('note.b')}${i18n.t('note.bemol')}`
      ]
    }
  },
  { id: 12, letter: 'B', name: i18n.t('note.b') }
])

function whiteMidi(letter: Letter): number {
  if (props.octave === undefined) return -1
  return (props.octave + 1) * 12 + SEMITONES[letter]
}

function blackMidi(letter: Letter): number {
  return whiteMidi(letter) + 1
}

function isWhiteSelected(note: Note): boolean {
  if (props.selectedMidis && props.octave !== undefined) {
    return props.selectedMidis.includes(whiteMidi(note.letter))
  }
  return props.selectedNotes ? props.selectedNotes.includes(note.id) : false
}

function isBlackSelected(note: Note): boolean {
  if (!note.blackNote) return false
  if (props.selectedMidis && props.octave !== undefined) {
    return props.selectedMidis.includes(blackMidi(note.letter))
  }
  return props.selectedNotes ? props.selectedNotes.includes(note.blackNote.id) : false
}

function onWhiteClick(note: Note) {
  if (props.octave === undefined) return
  emit('toggle-white', {
    letter: note.letter,
    octave: props.octave,
    midi: whiteMidi(note.letter)
  })
}

function onBlackClick(note: Note) {
  if (props.octave === undefined || !note.blackNote) return
  emit('toggle-black', {
    letter: note.letter,
    octave: props.octave,
    midi: blackMidi(note.letter)
  })
}
</script>
