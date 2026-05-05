import { SplendidGrandPiano } from 'smplr'

let ctx: AudioContext | null = null
let pianoInstance: SplendidGrandPiano | null = null
let loadingPromise: Promise<SplendidGrandPiano> | null = null

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return ctx
}

function loadPiano(): Promise<SplendidGrandPiano> {
  if (pianoInstance) return Promise.resolve(pianoInstance)
  if (loadingPromise) return loadingPromise

  const audio = getContext()
  const piano = new SplendidGrandPiano(audio)
  loadingPromise = piano.load.then(() => {
    pianoInstance = piano
    return piano
  })
  return loadingPromise
}

export function useAudio() {
  function preload() {
    if (typeof window === 'undefined') return
    loadPiano().catch(() => { /* silencio si CDN falla */ })
  }

  async function playMidi(midi: number, durationMs = 1500) {
    if (typeof window === 'undefined') return
    const audio = getContext()
    if (audio.state === 'suspended') await audio.resume()

    try {
      const piano = await loadPiano()
      piano.start({
        note: midi,
        velocity: 90,
        duration: durationMs / 1000
      })
    } catch {
      // Ignorar silenciosamente si la carga del piano falla
    }
  }

  return { playMidi, preload }
}
