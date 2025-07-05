import majChords from './notes/maj.chords'
import mChords from './notes/m.chords'
import augChords from './notes/aug.chords'
import dimChords from './notes/dim.chords'
import sus2Chords from './notes/sus2.chords'
import sus4Chords from './notes/sus4.chords'
import _7Chords from './notes/7.chords'
import m7Chords from './notes/m7.chords'
import maj7Chords from './notes/maj7.chords'
import mMaj7Chords from './notes/mMaj7.chords'

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
      chords: majChords,
      guide: {
        fundamental: '1 + 4 + 3',
        firstInversion: '1 + 3 + 5',
        secondInversion: '1 + 5 + 4'
      }
    },
    {
      label: 'm',
      prefix: 'm',
      chords: mChords,
      guide: {
        fundamental: '1 + 3 + 4',
        firstInversion: '1 + 4 + 5',
        secondInversion: '1 + 5 + 3'
      }
    },
    {
      label: 'aug, +',
      prefix: 'aug',
      chords: augChords,
      guide: {
        fundamental: '1 + 4 + 4',
        firstInversion: '1 + 4 + 4',
        secondInversion: '1 + 4 + 4'
      }
    },
    {
      label: 'dim, °',
      prefix: 'dim',
      chords: dimChords,
      guide: {
        fundamental: '1 + 3 + 3',
        firstInversion: '1 + 3 + 6',
        secondInversion: '1 + 6 + 3'
      }
    },
    {
      label: 'sus2',
      prefix: 'sus2',
      chords: sus2Chords,
      guide: {
        fundamental: '1 + 2 + 5',
        firstInversion: '1 + 5 + 5',
        secondInversion: '1 + 5 + 2'
      }
    },
    {
      label: 'sus4',
      prefix: 'sus4',
      chords: sus4Chords,
      guide: {
        fundamental: '1 + 5 + 2',
        firstInversion: '1 + 2 + 5',
        secondInversion: '1 + 5 + 5'
      }
    },
    {
      label: '7',
      prefix: '7',
      chords: _7Chords,
      guide: {
        fundamental: '1 + 4 + 3 + 3',
        firstInversion: '1 + 3 + 3 + 2',
        secondInversion: '1 + 3 + 2 + 4'
      }
    },
    {
      label: 'm7',
      prefix: 'm7',
      chords: m7Chords,
      guide: {
        fundamental: '1 + 3 + 4 + 3',
        firstInversion: '1 + 4 + 3 + 2',
        secondInversion: '1 + 3 + 2 + 3'
      }
    },
    {
      label: 'maj7',
      prefix: 'maj7',
      chords: maj7Chords,
      guide: {
        fundamental: '1 + 4 + 3 + 4',
        firstInversion: '1 + 3 + 4 + 1',
        secondInversion: '1 + 4 + 1 + 4'
      }
    },
    {
      label: 'mMaj7',
      prefix: 'mMaj7',
      chords: mMaj7Chords,
      guide: {
        fundamental: '1 + 3 + 4 + 4',
        firstInversion: '1 + 4 + 4 + 1',
        secondInversion: '1 + 4 + 1 + 3'
      }
    }
  ]

  return {
    chordTypes,
    noteList
  }
}