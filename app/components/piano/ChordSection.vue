<template>
  <article class="px-2 py-2">
    <header class="flex items-center justify-center gap-3 mb-2">
      <h2
        class="font-display tracking-tight text-paper"
        :class="titleStyle === 'hero'
          ? 'text-xl lg:text-2xl font-semibold'
          : 'text-sm font-display-italic font-medium text-paper/85'"
      >
        {{ title }}
      </h2>
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
        class="h-7 w-7 text-aqua-300 border-aqua-400/30 hover:bg-aqua-400/10 hover:text-aqua-200"
        :title="$t('page.chords-play')"
        @click="onPlay"
      >
        <Play :size="13" />
      </Button>
    </header>

    <div class="flex justify-center gap-1 overflow-x-auto scroll-elegant pb-1">
      <PianoKeyboardOctave :selected-notes="octaves.firstOctave" />
      <PianoKeyboardOctave :selected-notes="octaves.secondOctave" center-c />
      <PianoKeyboardOctave :selected-notes="octaves.thirdOctave" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { Play } from 'lucide-vue-next'
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

const { playMidi, preload } = useAudio()

onMounted(() => preload())

function idToMidi(id: number, octave: number): number {
  return (octave + 1) * 12 + (id - 1)
}

function onPlay() {
  const midis: number[] = []
  props.octaves.firstOctave?.forEach(id => midis.push(idToMidi(id, 3)))
  props.octaves.secondOctave?.forEach(id => midis.push(idToMidi(id, 4)))
  props.octaves.thirdOctave?.forEach(id => midis.push(idToMidi(id, 5)))
  midis.forEach(m => playMidi(m, 1800))
}
</script>
