<template>
  <article class="card-musical p-6 lg:p-8">
    <header class="flex items-center justify-center gap-4 mb-5">
      <h2
        class="font-display tracking-tight text-paper"
        :class="titleStyle === 'hero'
          ? 'text-3xl lg:text-4xl font-semibold'
          : 'text-xl font-display-italic font-medium text-paper/85'"
      >
        {{ title }}
      </h2>
      <Badge
        v-if="formula"
        variant="default"
        class="font-display tracking-wider bg-gold-400/10 border-gold-400/30 text-gold-300"
      >
        {{ formula }}
      </Badge>
    </header>

    <div class="flex justify-center gap-1 overflow-x-auto scroll-elegant pb-2">
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
