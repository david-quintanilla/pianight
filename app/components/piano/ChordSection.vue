<template>
  <article class="px-2 py-2">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-3 mb-3">
      <h2
        class="font-display tracking-tight text-paper text-center"
        :class="titleStyle === 'hero'
          ? 'text-lg sm:text-xl lg:text-2xl font-semibold'
          : 'text-sm font-display-italic font-medium text-paper/85'"
      >
        {{ title }}
      </h2>
      <div class="flex items-center justify-center gap-2">
        <Badge
          v-if="formula"
          variant="default"
          class="font-sans font-medium tabular-nums tracking-wider bg-gold-400/20 border-gold-400/50 text-gold-200 text-[11px] py-0.5 px-2.5"
        >
          {{ formula }}
        </Badge>
        <Button
          variant="outline"
          size="icon"
          class="h-7 w-7 shrink-0 border-aqua-400/30 hover:bg-aqua-400/10"
          :class="isPlaying
            ? 'text-aqua-100 bg-aqua-400/15 border-aqua-400/50'
            : 'text-aqua-300 hover:text-aqua-200'"
          :title="isPlaying ? $t('page.chords-stop') : $t('page.chords-play')"
          @click="onToggle"
        >
          <Pause v-if="isPlaying" :size="13" />
          <Play v-else :size="13" />
        </Button>
      </div>
    </header>

    <div
      ref="scrollerEl"
      class="flex justify-start md:justify-center gap-1 overflow-x-auto scroll-hidden pb-1"
    >
      <div ref="firstOctaveEl">
        <PianoKeyboardOctave :selected-notes="octaves.firstOctave" />
      </div>
      <div ref="centerOctaveEl">
        <PianoKeyboardOctave :selected-notes="octaves.secondOctave" center-c />
      </div>
      <div ref="lastOctaveEl">
        <PianoKeyboardOctave :selected-notes="octaves.thirdOctave" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Play, Pause } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

interface OctaveAssigment {
  firstOctave: number[]
  secondOctave: number[]
  thirdOctave: number[]
}

interface Props {
  title: string
  formula?: string
  octaves: OctaveAssigment
  titleStyle?: 'hero' | 'inversion'
}

const props = withDefaults(defineProps<Props>(), {
  titleStyle: 'inversion'
})

const { playMidi, preload, stop } = useAudio()

const PLAY_DURATION_MS = 1800
const stopId = `chord-${Math.random().toString(36).slice(2, 9)}`
const isPlaying = ref(false)
let playTimer: ReturnType<typeof setTimeout> | null = null

const scrollerEl = ref<HTMLElement | null>(null)
const firstOctaveEl = ref<HTMLElement | null>(null)
const centerOctaveEl = ref<HTMLElement | null>(null)
const lastOctaveEl = ref<HTMLElement | null>(null)

function centerActiveRange() {
  const scroller = scrollerEl.value
  if (!scroller) return
  if (scroller.scrollWidth <= scroller.clientWidth) return

  const activeEls: HTMLElement[] = []
  if (props.octaves.firstOctave?.length && firstOctaveEl.value) activeEls.push(firstOctaveEl.value)
  if (props.octaves.secondOctave?.length && centerOctaveEl.value) activeEls.push(centerOctaveEl.value)
  if (props.octaves.thirdOctave?.length && lastOctaveEl.value) activeEls.push(lastOctaveEl.value)

  if (activeEls.length === 0) return

  const sRect = scroller.getBoundingClientRect()
  const firstRect = activeEls[0]!.getBoundingClientRect()
  const lastRect = activeEls[activeEls.length - 1]!.getBoundingClientRect()
  const rangeCenter = (firstRect.left + lastRect.right) / 2
  const offset = (rangeCenter - sRect.left) - sRect.width / 2
  scroller.scrollLeft += offset
}

onMounted(() => {
  preload()
  nextTick(centerActiveRange)
})

watch(() => props.octaves, () => nextTick(centerActiveRange), { deep: true })

function idToMidi(id: number, octave: number): number {
  return (octave + 1) * 12 + (id - 1)
}

function clearPlayTimer() {
  if (playTimer) {
    clearTimeout(playTimer)
    playTimer = null
  }
}

function onToggle() {
  if (isPlaying.value) {
    stop(stopId)
    clearPlayTimer()
    isPlaying.value = false
    return
  }

  const midis: number[] = []
  props.octaves.firstOctave?.forEach(id => midis.push(idToMidi(id, 3)))
  props.octaves.secondOctave?.forEach(id => midis.push(idToMidi(id, 4)))
  props.octaves.thirdOctave?.forEach(id => midis.push(idToMidi(id, 5)))
  midis.forEach(m => playMidi(m, PLAY_DURATION_MS, stopId))

  isPlaying.value = true
  playTimer = setTimeout(() => {
    isPlaying.value = false
    playTimer = null
  }, PLAY_DURATION_MS)
}

onBeforeUnmount(() => {
  stop(stopId)
  clearPlayTimer()
})
</script>
