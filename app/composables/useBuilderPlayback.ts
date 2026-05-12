import type { Song } from '~/stores/builder.store'
import { noteBeats } from '~/stores/builder.store'

export function useBuilderPlayback() {
  const { playMidi, preload } = useAudio()
  const isPlaying = ref(false)
  const currentMeasureIdx = ref(-1)
  const playheadMs = ref(0)
  const measureStartsMs = ref<number[]>([])
  const measureDurationsMs = ref<number[]>([])

  let timeouts: ReturnType<typeof setTimeout>[] = []
  let rafId: number | null = null
  let startTimestamp = 0

  function clearTimers() {
    timeouts.forEach(t => clearTimeout(t))
    timeouts = []
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function stop() {
    clearTimers()
    isPlaying.value = false
    currentMeasureIdx.value = -1
    playheadMs.value = 0
  }

  function tick() {
    if (!isPlaying.value) return
    playheadMs.value = performance.now() - startTimestamp
    rafId = requestAnimationFrame(tick)
  }

  function play(song: Song) {
    stop()
    if (!song || song.measures.length === 0) return

    preload()
    isPlaying.value = true

    const beatMs = 60_000 / song.tempo
    let cursorMs = 0
    const starts: number[] = []
    const durations: number[] = []

    song.measures.forEach((measure, mIdx) => {
      const measureStartMs = cursorMs
      starts.push(measureStartMs)

      timeouts.push(setTimeout(() => {
        currentMeasureIdx.value = mIdx
      }, measureStartMs))

      ;(['treble', 'bass'] as const).forEach(hand => {
        const slots = hand === 'treble' ? measure.treble : measure.bass
        let beatsCursor = 0
        slots.forEach(slot => {
          const first = slot[0]
          if (!first) return
          const slotStartMs = measureStartMs + beatsCursor * beatMs
          const slotDurMs = noteBeats(first) * beatMs

          if (!first.isRest) {
            if (first.arpeggio && slot.length >= 2) {
              const arpStepMs = 55
              const ordered = [...slot].sort((a, b) => a.midi - b.midi)
              if (first.arpeggioDir === 'down') ordered.reverse()
              ordered.forEach((note, i) => {
                const offset = i * arpStepMs
                timeouts.push(setTimeout(() => {
                  playMidi(note.midi, slotDurMs - offset)
                }, slotStartMs + offset))
              })
            } else {
              slot.forEach(note => {
                timeouts.push(setTimeout(() => {
                  playMidi(note.midi, slotDurMs)
                }, slotStartMs))
              })
            }
          }

          beatsCursor += noteBeats(first)
        })
      })

      const fullCap = (Number(song.timeSignature.split('/')[0]) || 4) * 4 / (Number(song.timeSignature.split('/')[1]) || 4)
      const measureBeats = measure.pickupBeats ?? Math.max(
        measure.treble.reduce((s, sl) => s + (sl[0] ? noteBeats(sl[0]) : 0), 0),
        measure.bass.reduce((s, sl) => s + (sl[0] ? noteBeats(sl[0]) : 0), 0),
        fullCap
      )
      const measureMs = measureBeats * beatMs
      durations.push(measureMs)
      cursorMs += measureMs
    })

    measureStartsMs.value = starts
    measureDurationsMs.value = durations

    timeouts.push(setTimeout(() => {
      stop()
    }, cursorMs + 50))

    startTimestamp = performance.now()
    playheadMs.value = 0
    rafId = requestAnimationFrame(tick)
  }

  onBeforeUnmount(() => {
    clearTimers()
  })

  return {
    isPlaying,
    currentMeasureIdx,
    playheadMs,
    measureStartsMs,
    measureDurationsMs,
    play,
    stop
  }
}
