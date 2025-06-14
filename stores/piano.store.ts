type Octave = 'firstOctave' | 'secondOctave' | 'thirdOctave'
type ChordState = 'fundamental' | 'firstInversion' | 'secondInversion'
type OctaveAssigment = {
  [octave in Octave]: number[]
}

interface Chord extends Record<ChordState, OctaveAssigment> {
  id: number
}

interface Note {
  id: number
  name: string
}

interface Chords {
  label: string
  prefix: string
  chords: Chord[]
}

interface State {
  selectedNote: null | Note,
  selectedChords: Chords | null
}

interface Actions {
  updateChords: (chords: unknown) => void
}

export const usePianoStore = defineStore('pianoStore', () => {
  const state: State = reactive({
    selectedNote: null,
    selectedChords: null
  })

  const actions: Actions = {
    updateChords (chords) {
      state.selectedChords = chords as Chords
    }
  }

  return {
    state,
    actions
  }
})