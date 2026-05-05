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

interface ChordType {
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
  selectedNote: Note
  selectChordIndex: number
}

interface Compute {
  selectedChords: ComputedRef<ChordType>
  chordTypes: ComputedRef<ChordType[]>
}

export const usePianoStore = defineStore('pianoStore', () => {
  const notes = useNotes()

  const state: State = reactive({
    selectChordIndex: 0,
    selectedNote: notes.noteList.value[0]
  })

  const compute: Compute = {
    selectedChords: computed(() => {
      return compute.chordTypes.value[state.selectChordIndex] as ChordType
    }),

    chordTypes: computed<ChordType[]>(() => {
      return notes.chordTypes
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
