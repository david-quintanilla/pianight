type StepLetter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type Accidental = 'sharp' | 'flat' | null

export interface StaffNote {
  id: string
  letter: StepLetter
  octave: number
  midi: number
  step: number
  accidental?: Accidental
}

export type Clef = 'treble' | 'bass'

const LETTERS: StepLetter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const LETTER_TO_SEMITONE: Record<StepLetter, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11
}

function letterToStep(letter: StepLetter, octave: number): number {
  return octave * 7 + LETTERS.indexOf(letter)
}

function letterToMidi(letter: StepLetter, octave: number): number {
  return (octave + 1) * 12 + LETTER_TO_SEMITONE[letter]
}

function buildNote(letter: StepLetter, octave: number): StaffNote {
  return {
    id: `${letter}${octave}`,
    letter,
    octave,
    midi: letterToMidi(letter, octave),
    step: letterToStep(letter, octave),
    accidental: null
  }
}

function buildSharp(letter: StepLetter, octave: number): StaffNote {
  return {
    id: `${letter}#${octave}`,
    letter,
    octave,
    midi: letterToMidi(letter, octave) + 1,
    step: letterToStep(letter, octave),
    accidental: 'sharp'
  }
}

const TREBLE_BOTTOM = buildNote('E', 4).step
const BASS_BOTTOM = buildNote('G', 2).step

export function useStaff() {
  const i18n = useI18n()

  const letterKey: Record<StepLetter, string> = {
    C: 'note.c', D: 'note.d', E: 'note.e',
    F: 'note.f', G: 'note.g', A: 'note.a', B: 'note.b'
  }

  function noteName(note: StaffNote): string {
    return i18n.t(letterKey[note.letter])
  }

  function noteLabel(note: StaffNote): string {
    const base = i18n.t(letterKey[note.letter])
    if (note.accidental !== 'sharp') return base
    const nextIdx = (LETTERS.indexOf(note.letter) + 1) % 7
    const nextLetter = LETTERS[nextIdx]!
    const enharmonic = i18n.t(letterKey[nextLetter])
    return `${base}${i18n.t('note.sostenido')} / ${enharmonic}${i18n.t('note.bemol')}`
  }

  function buildRange(from: StaffNote, to: StaffNote): StaffNote[] {
    const notes: StaffNote[] = []
    for (let step = from.step; step <= to.step; step++) {
      const octave = Math.floor(step / 7)
      const letter = LETTERS[step % 7]!
      notes.push(buildNote(letter, octave))
    }
    return notes
  }

  function bottomStep(clef: Clef): number {
    return clef === 'treble' ? TREBLE_BOTTOM : BASS_BOTTOM
  }

  const trebleNotes = buildRange(buildNote('C', 4), buildNote('C', 6))
  const bassNotes = buildRange(buildNote('C', 2), buildNote('C', 4))

  return {
    trebleNotes,
    bassNotes,
    noteName,
    noteLabel,
    bottomStep,
    buildNote,
    buildSharp
  }
}
