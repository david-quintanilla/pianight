import MajorChords from "./notes/major.chords"
import MinorChords from "./notes/minor.chords"

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
      name: `${i18n.t('note.c')}${i18n.t('note.sostenido')} / ${i18n.t('note.d')}${i18n.t('note.bemol')}`
    },
    {
      id: 3,
      name: i18n.t('note.d')
    },
    {
      id: 4,
      name: `${i18n.t('note.d')}${i18n.t('note.sostenido')} / ${i18n.t('note.e')}${i18n.t('note.bemol')}`
    },
    {
      id: 5,
      name: i18n.t('note.e')
    },
    {
      id: 6,
      name: i18n.t('note.f')
    },
    {
      id: 7,
      name: `${i18n.t('note.f')}${i18n.t('note.sostenido')} / ${i18n.t('note.g')}${i18n.t('note.bemol')}`
    },
    {
      id: 8,
      name: i18n.t('note.g')
    },
    {
      id: 9,
      name: `${i18n.t('note.g')}${i18n.t('note.sostenido')} / ${i18n.t('note.a')}${i18n.t('note.bemol')}`
    },
    {
      id: 10,
      name: i18n.t('note.a')
    },
    {
      id: 11,
      name: `${i18n.t('note.a')}${i18n.t('note.sostenido')} / ${i18n.t('note.b')}${i18n.t('note.bemol')}`
    },
    {
      id: 12,
      name: i18n.t('note.b')
    },
  ])

  const chordTypes = [
    {
      label: 'maj',
      prefix: 'maj',
      chords: MajorChords,
      guide: {
        fundamental: '1 + 4 + 3',
        firstInversion: '1 + 3 + 5',
        secondInversion: '1 + 5 + 4'
      }
    },
    {
      label: 'm',
      prefix: 'm',
      chords: MinorChords,
      guide: {
        fundamental: '1 + 3 + 4',
        firstInversion: '1 + 4 + 5',
        secondInversion: '1 + 5 + 3'
      }
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
      label: 'sus2',
      prefix: 'sus2',
      chords: []
    },
    {
      label: 'sus4',
      prefix: 'sus4',
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
    }
  ]

  return {
    chordTypes,
    noteList
  }
}