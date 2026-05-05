<template>
  <div class="w-full flex justify-center">
    <svg
      :viewBox="`0 0 ${totalWidth} ${height}`"
      :style="{ maxWidth: `${totalWidth}px`, width: '100%' }"
      class="h-auto"
      role="img"
      aria-label="Piano"
    >
      <!-- Sombra superior decorativa -->
      <rect
        :x="0"
        :y="0"
        :width="totalWidth"
        :height="6"
        fill="url(#topGradient)"
      />
      <defs>
        <linearGradient id="topGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0.55)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      <!-- Teclas blancas -->
      <g
        v-for="(white, i) in whites"
        :key="`w-${white.id}`"
      >
        <rect
          :x="i * whiteWidth"
          :y="0"
          :width="whiteWidth"
          :height="height"
          :rx="4"
          :fill="isHighlighted(white) ? 'var(--color-aqua-300)' : 'var(--color-paper)'"
          stroke="rgba(0,0,0,0.4)"
          stroke-width="0.8"
          class="cursor-pointer transition-colors duration-150"
          @mouseenter="handleEnter(white)"
          @mouseleave="$emit('hover', null)"
          @click="handleClick(white)"
        />
        <text
          :x="i * whiteWidth + whiteWidth / 2"
          :y="height - 16"
          text-anchor="middle"
          class="pointer-events-none select-none font-display"
          :style="{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            fill: isHighlighted(white) ? '#0b0d13' : '#3f3a30'
          }"
        >{{ noteName(white) }}</text>

        <!-- Marca de DO central -->
        <circle
          v-if="white.letter === 'C' && white.octave === 4"
          :cx="i * whiteWidth + whiteWidth / 2"
          :cy="height - 38"
          :r="2.5"
          fill="var(--color-gold-400)"
          class="pointer-events-none"
        />
      </g>

      <!-- Teclas negras -->
      <rect
        v-for="black in blackKeys"
        :key="`b-${black.x}`"
        :x="black.x"
        :y="0"
        :width="blackWidth"
        :height="height * 0.62"
        :rx="3"
        fill="#0a0a0f"
        stroke="rgba(255,255,255,0.06)"
        stroke-width="0.6"
        class="pointer-events-none"
      />
    </svg>
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

const { noteName } = useStaff()
const { playMidi } = useAudio()

const whiteWidth = 56
const blackWidth = 32
const height = 200

const totalWidth = computed(() => props.whites.length * whiteWidth)

const BLACK_AFTER: Record<string, boolean> = {
  C: true, D: true, F: true, G: true, A: true
}

const blackKeys = computed(() => {
  const keys: { x: number }[] = []
  props.whites.forEach((w, i) => {
    if (i === props.whites.length - 1) return
    if (BLACK_AFTER[w.letter]) {
      keys.push({ x: (i + 1) * whiteWidth - blackWidth / 2 })
    }
  })
  return keys
})

function isHighlighted(note: StaffNote): boolean {
  return props.highlighted?.id === note.id
}

function handleEnter(note: StaffNote) {
  emit('hover', note)
}

function handleClick(note: StaffNote) {
  emit('select', note)
  if (props.soundEnabled) playMidi(note.midi, 1500)
}
</script>
