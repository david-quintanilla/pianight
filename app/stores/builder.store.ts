import type { Accidental } from '~/composables/useStaff'

export type Duration = 'w' | 'h' | 'q' | '8' | '16'
export type Hand = 'treble' | 'bass'

export const DURATION_BEATS: Record<Duration, number> = {
  w: 4,
  h: 2,
  q: 1,
  '8': 0.5,
  '16': 0.25
}

export function noteBeats(note: Pick<BuilderNote, 'duration' | 'dotted'>): number {
  const base = DURATION_BEATS[note.duration]
  return note.dotted ? base * 1.5 : base
}

export function measureCapacityBeats(timeSignature: string): number {
  const [topStr, bottomStr] = timeSignature.split('/')
  const top = Number(topStr) || 4
  const bottom = Number(bottomStr) || 4
  return (top * 4) / bottom
}

export function slotsBeats(slots: BuilderNote[][]): number {
  return slots.reduce((sum, slot) => {
    const first = slot[0]
    return first ? sum + noteBeats(first) : sum
  }, 0)
}

export interface BuilderNote {
  id: string
  letter: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
  octave: number
  midi: number
  step: number
  accidental: Accidental
  duration: Duration
  dotted?: boolean
  isRest?: boolean
  arpeggio?: boolean
  arpeggioDir?: 'up' | 'down'
}

export type Slot = BuilderNote[]

export interface Measure {
  id: string
  treble: Slot[]
  bass: Slot[]
  pickupBeats?: number
}

export function effectiveCapacity(measure: Measure, timeSignature: string): number {
  return measure.pickupBeats ?? measureCapacityBeats(timeSignature)
}

export interface Song {
  id: string
  title: string
  keySignature: string
  timeSignature: string
  tempo: number
  measures: Measure[]
  createdAt: number
  updatedAt: number
}

interface State {
  songs: Song[]
  currentSongId: string | null
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function emptyMeasure(): Measure {
  return { id: uid(), treble: [], bass: [] }
}

export const useBuilderStore = defineStore('builderStore', () => {
  const state: State = reactive({
    songs: [],
    currentSongId: null
  })

  const currentSong = computed<Song | null>(() => {
    if (!state.currentSongId) return null
    return state.songs.find(s => s.id === state.currentSongId) ?? null
  })

  function createSong(input: { title: string, keySignature?: string, timeSignature?: string, tempo?: number }): Song {
    const now = Date.now()
    const song: Song = {
      id: uid(),
      title: input.title,
      keySignature: input.keySignature ?? 'C',
      timeSignature: input.timeSignature ?? '4/4',
      tempo: input.tempo ?? 90,
      measures: [emptyMeasure()],
      createdAt: now,
      updatedAt: now
    }
    state.songs.unshift(song)
    state.currentSongId = song.id
    return song
  }

  function selectSong(id: string | null) {
    state.currentSongId = id
  }

  function deleteSong(id: string) {
    state.songs = state.songs.filter(s => s.id !== id)
    if (state.currentSongId === id) state.currentSongId = null
  }

  function updateSong(id: string, patch: Partial<Omit<Song, 'id' | 'createdAt'>>) {
    const song = state.songs.find(s => s.id === id)
    if (!song) return
    Object.assign(song, patch, { updatedAt: Date.now() })
  }

  function addMeasure(songId: string) {
    const song = state.songs.find(s => s.id === songId)
    if (!song) return
    song.measures.push(emptyMeasure())
    song.updatedAt = Date.now()
  }

  function removeLastMeasure(songId: string) {
    const song = state.songs.find(s => s.id === songId)
    if (!song || song.measures.length <= 1) return
    song.measures.pop()
    song.updatedAt = Date.now()
  }

  function removeMeasure(songId: string, measureId: string) {
    const song = state.songs.find(s => s.id === songId)
    if (!song || song.measures.length <= 1) return
    song.measures = song.measures.filter(m => m.id !== measureId)
    song.updatedAt = Date.now()
  }

  function addNoteToMeasure(
    songId: string,
    measureId: string,
    hand: Hand,
    note: BuilderNote
  ): boolean {
    return addChordToMeasure(songId, measureId, hand, [note])
  }

  function addChordToMeasure(
    songId: string,
    measureId: string,
    hand: Hand,
    notes: BuilderNote[]
  ): boolean {
    const song = state.songs.find(s => s.id === songId)
    if (!song || notes.length === 0) return false
    const measure = song.measures.find(m => m.id === measureId)
    if (!measure) return false

    const first = notes[0]!
    const slots = hand === 'treble' ? measure.treble : measure.bass
    const used = slotsBeats(slots)
    const slotBeats = noteBeats(first)
    const capacity = effectiveCapacity(measure, song.timeSignature)

    if (used + slotBeats > capacity + 0.001) return false

    slots.push([...notes])
    song.updatedAt = Date.now()
    return true
  }

  function addRestToMeasure(
    songId: string,
    measureId: string,
    hand: Hand,
    duration: Duration
  ): boolean {
    const rest: BuilderNote = {
      id: Math.random().toString(36).slice(2, 10),
      letter: 'C',
      octave: 4,
      midi: 0,
      step: 0,
      accidental: null,
      duration,
      isRest: true
    }
    return addNoteToMeasure(songId, measureId, hand, rest)
  }

  function updateSlot(
    songId: string,
    measureId: string,
    hand: Hand,
    slotIdx: number,
    notes: BuilderNote[]
  ): boolean {
    const song = state.songs.find(s => s.id === songId)
    if (!song || notes.length === 0) return false
    const measure = song.measures.find(m => m.id === measureId)
    if (!measure) return false
    const slots = hand === 'treble' ? measure.treble : measure.bass
    const old = slots[slotIdx]
    if (!old) return false

    const first = notes[0]!
    const newBeats = noteBeats(first)
    const otherBeats = slots.reduce((sum, sl, i) => {
      if (i === slotIdx) return sum
      const f = sl[0]
      return f ? sum + noteBeats(f) : sum
    }, 0)
    const capacity = effectiveCapacity(measure, song.timeSignature)
    if (otherBeats + newBeats > capacity + 0.001) return false

    slots[slotIdx] = [...notes]
    song.updatedAt = Date.now()
    return true
  }

  function setMeasurePickup(songId: string, measureId: string, pickupBeats: number | null) {
    const song = state.songs.find(s => s.id === songId)
    if (!song) return
    const measure = song.measures.find(m => m.id === measureId)
    if (!measure) return

    if (pickupBeats === null) {
      delete measure.pickupBeats
    } else {
      const fullCap = measureCapacityBeats(song.timeSignature)
      const clamped = Math.min(Math.max(0.25, pickupBeats), fullCap)
      const trebleUsed = slotsBeats(measure.treble)
      const bassUsed = slotsBeats(measure.bass)
      if (trebleUsed > clamped + 0.001 || bassUsed > clamped + 0.001) return
      measure.pickupBeats = clamped
    }
    song.updatedAt = Date.now()
  }

  function moveSlot(songId: string, measureId: string, hand: Hand, fromIdx: number, toIdx: number) {
    const song = state.songs.find(s => s.id === songId)
    if (!song) return
    const measure = song.measures.find(m => m.id === measureId)
    if (!measure) return
    const slots = hand === 'treble' ? measure.treble : measure.bass
    if (fromIdx < 0 || fromIdx >= slots.length || toIdx < 0 || toIdx >= slots.length || fromIdx === toIdx) return
    const [moved] = slots.splice(fromIdx, 1)
    if (!moved) return
    slots.splice(toIdx, 0, moved)
    song.updatedAt = Date.now()
  }

  function cycleSlotArpeggio(songId: string, measureId: string, hand: Hand, slotIdx: number) {
    const song = state.songs.find(s => s.id === songId)
    if (!song) return
    const measure = song.measures.find(m => m.id === measureId)
    if (!measure) return
    const slots = hand === 'treble' ? measure.treble : measure.bass
    const slot = slots[slotIdx]
    if (!slot || slot.length < 2) return
    const first = slot[0]!
    let nextOn: boolean
    let nextDir: 'up' | 'down' | undefined
    if (!first.arpeggio) {
      nextOn = true
      nextDir = 'up'
    } else if (first.arpeggioDir === 'up') {
      nextOn = true
      nextDir = 'down'
    } else {
      nextOn = false
      nextDir = undefined
    }
    slot.forEach(n => {
      n.arpeggio = nextOn
      n.arpeggioDir = nextDir
    })
    song.updatedAt = Date.now()
  }

  function removeLastNote(songId: string, measureId: string, hand: Hand) {
    const song = state.songs.find(s => s.id === songId)
    if (!song) return
    const measure = song.measures.find(m => m.id === measureId)
    if (!measure) return
    const slots = hand === 'treble' ? measure.treble : measure.bass
    slots.pop()
    song.updatedAt = Date.now()
  }

  return {
    state,
    currentSong,
    createSong,
    selectSong,
    deleteSong,
    updateSong,
    addMeasure,
    removeLastMeasure,
    removeMeasure,
    addNoteToMeasure,
    addChordToMeasure,
    addRestToMeasure,
    cycleSlotArpeggio,
    setMeasurePickup,
    moveSlot,
    updateSlot,
    removeLastNote
  }
}, {
  persist: {
    key: 'pianight-builder'
  }
})
