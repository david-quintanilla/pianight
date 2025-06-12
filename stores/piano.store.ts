interface Octave {
  [key: number]: {
    notes: number[]
  } | undefined
}

interface Chord {
  id: number
  name: string
  octaves: Octave
}

interface State {
  selectedChord: Chord | null
}

export const usePianoStore = defineStore('pianoStore', () => {
  const state: State = reactive({
    selectedChord: null
  })

  return {
    state
  }
})