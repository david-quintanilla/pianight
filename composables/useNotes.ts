import MajorChords from "./notes/major.chords"

interface Note {
  id: number
  name: string
}

export function useNotes () {
  const i18n = useI18n()

  const noteList = computed<Note[]>(() => [
    {
      id: 1,
      name: i18n.t('note.c')
    },
    {
      id: 2,
      name: i18n.t('note.d')
    },
    {
      id: 3,
      name: i18n.t('note.e')
    },
    {
      id: 4,
      name: i18n.t('note.f')
    },
    {
      id: 5,
      name: i18n.t('note.g')
    },
    {
      id: 6,
      name: i18n.t('note.a')
    },
    {
      id: 7,
      name: i18n.t('note.b')
    },
  ])

  const chordTypes = [
    {
      label: 'maj',
      prefix: 'maj',
      chords: MajorChords
    },
    {
      label: 'm',
      prefix: 'm',
      chords: []
    },
    {
      label: 'aug, +',
      prefix: 'aug',
      chords: []
    },
    {
      label: 'dim, °',
      prefix: 'dim',
      chords: []
    },
    {
      label: '7',
      prefix: '7',
      chords: []
    },
    {
      label: 'm7',
      prefix: 'm7',
      chords: []
    },
    {
      label: 'maj7',
      prefix: 'maj7',
      chords: []
    },
    {
      label: 'mMaj7',
      prefix: 'mMaj7',
      chords: []
    },
    {
      label: 'sus2',
      prefix: 'sus2',
      chords: []
    },
    {
      label: 'sus4',
      prefix: 'sus4',
      chords: []
    },
  ]

  return {
    chordTypes,
    noteList
  }
}