<template>
  <div class="w-full overflow-x-auto scroll-elegant">
    <div class="flex h-32 mx-auto" :style="{ width: `${whites.length * whiteWidth}px` }">
      <div
        v-for="(white, i) in whites"
        :key="white.id"
        class="relative h-full rounded-b-md key-white cursor-pointer flex flex-col items-center justify-end pb-3"
        :style="{ width: `${whiteWidth}px` }"
        @mouseenter="handleEnter(white)"
        @mouseleave="$emit('hover', null)"
        @click="handleClick(white)"
      >
        <span
          aria-hidden="true"
          class="absolute inset-0 rounded-b-md key-active-gradient pointer-events-none transition-opacity duration-300 ease-out"
          :style="{ opacity: isHighlighted(white) ? 1 : 0 }"
        />
        <p
          class="relative z-10 text-xs font-display tracking-wide transition-colors duration-300"
          :class="isHighlighted(white) ? 'text-ink-950 font-semibold' : 'text-ink-900/70 font-medium'"
        >
          {{ noteName(white) }}
        </p>

        <!-- Marca de DO central -->
        <span
          v-if="white.letter === 'C' && white.octave === 4"
          aria-hidden="true"
          class="absolute z-10 bottom-9 w-1.5 h-1.5 rounded-full bg-ink-900"
        />

        <!-- Tecla negra (sostenido del blanco actual) -->
        <div
          v-if="i < whites.length - 1 && hasBlackAfter(white.letter)"
          class="absolute top-0 -right-5 z-10 w-10 h-22 rounded-b-md key-black cursor-pointer overflow-visible"
          @mouseenter.stop="handleEnter(blackFor(white))"
          @mouseleave.stop="$emit('hover', null)"
          @click.stop="handleClick(blackFor(white))"
        >
          <span
            aria-hidden="true"
            class="absolute inset-0 rounded-b-md key-active-gradient ring-1 ring-cyan-200/60 pointer-events-none transition-opacity duration-300 ease-out"
            :style="{ opacity: isHighlighted(blackFor(white)) ? 1 : 0 }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { StaffNote } from '~/composables/useStaff'

interface Props {
  whites: StaffNote[]
  highlighted?: StaffNote | null
  soundEnabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  highlighted: null,
  soundEnabled: true
})

const emit = defineEmits<{
  hover: [note: StaffNote | null]
  select: [note: StaffNote]
}>()

const { noteName, buildSharp } = useStaff()
const { playMidi } = useAudio()

const whiteWidth = 52

const BLACK_AFTER: Record<string, boolean> = {
  C: true, D: true, F: true, G: true, A: true
}

function hasBlackAfter(letter: string): boolean {
  return !!BLACK_AFTER[letter]
}

function blackFor(white: StaffNote): StaffNote {
  return buildSharp(white.letter, white.octave)
}

function isHighlighted(note: StaffNote): boolean {
  return props.highlighted?.midi === note.midi
}

function handleEnter(note: StaffNote) {
  emit('hover', note)
}

function handleClick(note: StaffNote) {
  emit('select', note)
  if (props.soundEnabled) playMidi(note.midi, 1500)
}
</script>
