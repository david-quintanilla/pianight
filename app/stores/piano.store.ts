import type { TabsItem } from '@nuxt/ui'

interface OctaveAssigment {
  firstOctave: number[]
  secondOctave: number[]
  thirdOctave: number[]
}

interface Chord {
  id: number
  fundamental: OctaveAssigment
  firstInversion: OctaveAssigment
  secondInversion: OctaveAssigment
  thirdInversion: OctaveAssigment
}

interface Note {
  id: number
  name: string
}

interface Chords {
  label: string
  prefix: string
  chords: Chord[]
  guide: {
    fundamental: string
    firstInversion: string
    secondInversion: string
    thirdInversion: string
  }
}

interface State {
  selectedNote: Note,
  selectChordIndex: number
}

interface Compute {
  selectedChords: ComputedRef<Chords>
  chordTypes: ComputedRef<TabsItem[]>
}

export const usePianoStore = defineStore('pianoStore', () => {
  const notes = useNotes()

  const state: State = reactive({
    selectChordIndex: 0,
    selectedNote: notes.noteList.value[0],
    selectedChords: null
  })

  const compute: Compute = {
    selectedChords: computed(() => {
      return compute.chordTypes.value[state.selectChordIndex] as Chords
    }),

    chordTypes: computed<TabsItem[]>(() => {
      return notes.chordTypes.map(chord => ({
        ...chord,
        icon: 'entypo:note',
        slot: chord.prefix
      }))
    })
  }

  return {
    state,
    compute
  }
}, {
  persist: {
    key: 'pianight'
  }
})