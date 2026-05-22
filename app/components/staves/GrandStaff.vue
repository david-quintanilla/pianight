<template>
  <div class="inline-block">
    <svg
      :viewBox="`0 ${-topPadding} ${width} ${height + topPadding}`"
      :width="width"
      :height="height + topPadding"
      :style="{ display: 'block' }"
      role="img"
      :aria-label="$t('page.staves-title')"
    >
      <!-- Línea vertical inicial -->
      <line
        :x1="staffLeft"
        :x2="staffLeft"
        :y1="trebleTop"
        :y2="bassTop + 4 * lineGap"
        :stroke="lineColor"
        stroke-width="2"
      />

      <!-- Llave en S -->
      <path
        :d="bracePath"
        fill="none"
        :stroke="lineColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />

      <!-- Líneas Sol -->
      <line
        v-for="i in 5"
        :key="`treble-${i}`"
        :x1="staffLeft"
        :x2="width - rightPadding"
        :y1="trebleTop + (i - 1) * lineGap"
        :y2="trebleTop + (i - 1) * lineGap"
        :stroke="lineColor"
        stroke-width="0.9"
        opacity="0.55"
      />

      <!-- Líneas Fa -->
      <line
        v-for="i in 5"
        :key="`bass-${i}`"
        :x1="staffLeft"
        :x2="width - rightPadding"
        :y1="bassTop + (i - 1) * lineGap"
        :y2="bassTop + (i - 1) * lineGap"
        :stroke="lineColor"
        stroke-width="0.9"
        opacity="0.55"
      />

      <!-- Línea vertical final -->
      <line
        :x1="width - rightPadding"
        :x2="width - rightPadding"
        :y1="trebleTop"
        :y2="bassTop + 4 * lineGap"
        :stroke="lineColor"
        stroke-width="1"
        opacity="0.35"
      />

      <!-- Claves usando Bravura -->
      <text
        :x="staffLeft + 16"
        :y="trebleTop + 3 * lineGap"
        class="font-music"
        :style="{ fontSize: `${lineGap * 4}px`, fill: 'var(--color-gold-400)' }"
      >{{ gClef }}</text>
      <text
        :x="staffLeft + 18"
        :y="bassTop + lineGap"
        class="font-music"
        :style="{ fontSize: `${lineGap * 4}px`, fill: 'var(--color-gold-400)' }"
      >{{ fClef }}</text>

      <!-- Notas -->
      <g
        v-for="entry in placedNotes"
        :key="entry.note.id"
        :data-step="entry.note.step"
        :transform="`translate(${entry.x}, ${entry.y})`"
        class="cursor-pointer"
        @mouseenter="handleEnter(entry.note)"
        @mouseleave="$emit('hover', null)"
        @click="handleClick(entry.note)"
      >
        <!-- Líneas adicionales -->
        <line
          v-for="ledger in entry.ledgers"
          :key="`ledger-${ledger}`"
          :x1="-noteRadius - 5"
          :x2="noteRadius + 5"
          :y1="ledger"
          :y2="ledger"
          :stroke="lineColor"
          stroke-width="1.1"
          opacity="0.7"
        />

        <rect
          :x="-noteSpacing / 2"
          :y="-lineGap * 4"
          :width="noteSpacing"
          :height="lineGap * 8"
          fill="transparent"
        />

        <!-- Sostenido cuando la negra del piano está activa -->
        <text
          v-if="isHighlighted(entry.note) && highlightedIsSharp"
          :x="-noteRadius - 4"
          :y="lineGap * 0.55"
          text-anchor="end"
          class="font-music pointer-events-none select-none"
          :style="{ fontSize: `${lineGap * 2.1}px`, fill: 'var(--color-aqua-300)' }"
        >{{ sharpGlyph }}</text>

        <ellipse
          :cx="0"
          :cy="0"
          :rx="noteRadius"
          :ry="noteRadius * 0.78"
          :transform="`rotate(-22)`"
          :fill="isHighlighted(entry.note) ? 'var(--color-aqua-300)' : 'rgba(244, 241, 234, 0.92)'"
          :stroke="isHighlighted(entry.note) ? 'var(--color-aqua-300)' : 'rgba(244, 241, 234, 0.92)'"
          :class="isHighlighted(entry.note) ? 'note-glow' : ''"
          class="transition-all duration-150"
        />

        <!-- Etiqueta -->
        <g
          v-if="isHighlighted(entry.note)"
          class="pointer-events-none"
        >
          <rect
            :x="-(highlightedIsSharp ? 56 : 24)"
            :y="entry.labelY - lineGap * 1.15"
            :width="highlightedIsSharp ? 112 : 48"
            :height="lineGap * 1.7"
            :rx="lineGap * 0.85"
            fill="var(--color-ink-900)"
            stroke="var(--color-aqua-400)"
            stroke-opacity="0.45"
            stroke-width="1"
          />
          <text
            :x="0"
            :y="entry.labelY"
            text-anchor="middle"
            class="font-display select-none"
            :style="{ fontSize: `${lineGap}px`, fontWeight: 700, letterSpacing: '0.06em', fill: 'var(--color-paper)' }"
          >{{ highlightLabel(entry.note) }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import type { StaffNote } from '~/composables/useStaff'

interface Props {
  trebleNotes: StaffNote[]
  bassNotes: StaffNote[]
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

const { noteName, noteLabel, bottomStep, buildNote } = useStaff()
const { playMidi } = useAudio()

const sharpGlyph = String.fromCodePoint(0xE262)

const highlightedIsSharp = computed(() => props.highlighted?.accidental === 'sharp')

function highlightLabel(note: StaffNote): string {
  if (!props.highlighted) return noteName(note)
  return noteLabel(props.highlighted)
}

const lineGap = 13
const noteRadius = lineGap * 0.6
const noteSpacing = lineGap * 3.4
const staffLeft = 64
const leftPadding = staffLeft + lineGap * 7
const rightPadding = lineGap * 3
const trebleTop = lineGap * 5
const staffGap = lineGap * 4.5
const bassTop = trebleTop + 4 * lineGap + staffGap
const height = bassTop + 4 * lineGap + lineGap * 5
const topPadding = lineGap * 5

const lineColor = 'rgba(207, 250, 254, 0.7)'

const gClef = String.fromCodePoint(0xE050)
const fClef = String.fromCodePoint(0xE062)

const C4_STEP = buildNote('C', 4).step
const TREBLE_BOTTOM_STEP = bottomStep('treble')
const BASS_BOTTOM_STEP = bottomStep('bass')

const allNotes = computed(() => {
  const bass = props.bassNotes
  const treble = props.trebleNotes.filter(n => n.step !== C4_STEP)
  return [...bass, ...treble]
})

const width = computed(() =>
  Math.max(720, leftPadding + allNotes.value.length * noteSpacing + rightPadding)
)

interface PlacedNote {
  note: StaffNote
  x: number
  y: number
  ledgers: number[]
  labelY: number
}

function isOnTreble(note: StaffNote): boolean {
  return note.step >= C4_STEP
}

const placedNotes = computed<PlacedNote[]>(() => {
  return allNotes.value.map((note, i) => {
    const onTreble = isOnTreble(note)
    const bottom = onTreble ? TREBLE_BOTTOM_STEP : BASS_BOTTOM_STEP
    const stepsFromBottom = note.step - bottom
    const baseTop = onTreble ? trebleTop : bassTop
    const y = baseTop + 4 * lineGap - stepsFromBottom * (lineGap / 2)

    const ledgers: number[] = []
    if (stepsFromBottom < 0) {
      const count = Math.floor(-stepsFromBottom / 2)
      for (let k = 1; k <= count; k++) {
        const stepBelow = -k * 2
        ledgers.push((stepBelow - stepsFromBottom) * (lineGap / 2))
      }
    } else if (stepsFromBottom > 8) {
      const count = Math.floor((stepsFromBottom - 8) / 2)
      for (let k = 1; k <= count; k++) {
        const stepAbove = 8 + k * 2
        ledgers.push((stepAbove - stepsFromBottom) * (lineGap / 2))
      }
    }

    const labelY = -lineGap * 3.5
    return { note, x: leftPadding + i * noteSpacing, y, ledgers, labelY }
  })
})

function isHighlighted(note: StaffNote): boolean {
  const h = props.highlighted
  if (!h) return false
  return h.letter === note.letter && h.octave === note.octave
}

function handleEnter(note: StaffNote) {
  emit('hover', note)
}

function handleClick(note: StaffNote) {
  emit('select', note)
  if (props.soundEnabled) playMidi(note.midi, 1500)
}

const bracePath = computed(() => {
  const x = staffLeft - 6
  const y1 = trebleTop - 6
  const y2 = bassTop + 4 * lineGap + 6
  const mid = (y1 + y2) / 2
  const w = 18
  return `
    M ${x} ${y1}
    C ${x - w} ${y1 + 14}, ${x - w * 0.4} ${mid - 20}, ${x - w * 0.6} ${mid}
    C ${x - w * 0.4} ${mid + 20}, ${x - w} ${y2 - 14}, ${x} ${y2}
  `
})
</script>
