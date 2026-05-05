import type { Song } from '~/stores/builder.store'
import { DURATION_BEATS } from '~/stores/builder.store'

export function useBuilderPlayback() {
  const { playMidi, preload } = useAudio()
  const isPlaying = ref(false)
  const currentMeasureIdx = ref(-1)

  let timeouts: ReturnType<typeof setTimeout>[] = []

  function clearTimers() {
    timeouts.forEach(t => clearTimeout(t))
    timeouts = []
  }

  function stop() {
    clearTimers()
    isPlaying.value = false
    currentMeasureIdx.value = -1
  }

  function play(song: Song) {
    stop()
    if (!song || song.measures.length === 0) return

    preload()
    isPlaying.value = true

    const beatMs = 60_000 / song.tempo
    let cursorMs = 0

    song.measures.forEach((measure, mIdx) => {
      const measureStartMs = cursorMs

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
          const slotDurMs = DURATION_BEATS[first.duration] * beatMs

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

          beatsCursor += DURATION_BEATS[first.duration]
        })
      })

      const m = song.measures[mIdx]
      const fullCap = (Number(song.timeSignature.split('/')[0]) || 4) * 4 / (Number(song.timeSignature.split('/')[1]) || 4)
      const measureBeats = m
        ? (m.pickupBeats ?? Math.max(
          m.treble.reduce((s, sl) => s + (sl[0] ? DURATION_BEATS[sl[0].duration] : 0), 0),
          m.bass.reduce((s, sl) => s + (sl[0] ? DURATION_BEATS[sl[0].duration] : 0), 0),
          fullCap
        ))
        : fullCap

      cursorMs += measureBeats * beatMs
    })

    timeouts.push(setTimeout(() => {
      stop()
    }, cursorMs + 50))
  }

  onBeforeUnmount(() => {
    clearTimers()
  })

  return {
    isPlaying,
    currentMeasureIdx,
    play,
    stop
  }
}
