<template>
  <div class="w-full">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :style="{ width: '100%', height: 'auto' }"
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
        <g v-if="isHighlighted(entry.note)">
          <text
            :x="0"
            :y="entry.labelY"
            text-anchor="middle"
            class="font-display select-none pointer-events-none"
            :style="{ fontSize: `${lineGap * 1.15}px`, fontWeight: 600, letterSpacing: '0.02em', fill: 'var(--color-aqua-100)' }"
          >{{ noteName(entry.note) }}<tspan
            :style="{ fontSize: `${lineGap * 0.7}px`, fill: 'rgba(103, 232, 249, 0.7)', baselineShift: 'sub' }"
          >{{ entry.note.octave }}</tspan></text>
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

const { noteName, bottomStep, buildNote } = useStaff()
const { playMidi } = useAudio()

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

    const labelY = onTreble ? -lineGap * 3.5 : lineGap * 4.6
    return { note, x: leftPadding + i * noteSpacing, y, ledgers, labelY }
  })
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
