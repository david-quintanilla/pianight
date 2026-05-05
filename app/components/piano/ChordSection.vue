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
    </header>

    <div class="flex justify-center gap-1 overflow-x-auto scroll-elegant pb-1">
      <PianoKeyboardOctave :selected-notes="octaves.firstOctave" />
      <PianoKeyboardOctave :selected-notes="octaves.secondOctave" />
      <PianoKeyboardOctave :selected-notes="octaves.thirdOctave" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { Badge } from '~/components/ui/badge'

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

withDefaults(defineProps<Props>(), {
  titleStyle: 'inversion'
})
</script>
