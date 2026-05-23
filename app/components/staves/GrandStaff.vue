<template>
  <div class="w-full">
    <svg
      :viewBox="`0 ${-topPadding} ${width} ${height + topPadding}`"
      :style="{ width: '100%', height: 'auto', display: 'block' }"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="$t('page.staves-title')"
    >
      <!-- Línea vertical inicial -->
      <line
        :x1="staffLeft"
        :x2="staffLeft"
        :y1="systemTop"
        :y2="systemBottom"
        :stroke="lineColor"
        stroke-width="2"
      />

      <!-- Llave en S (solo cuando hay las dos claves) -->
      <path
        v-if="visibleClefs.treble && visibleClefs.bass"
        :d="bracePath"
        fill="none"
        :stroke="lineColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />

      <!-- Líneas Sol -->
      <template v-if="visibleClefs.treble">
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
      </template>

      <!-- Líneas Fa -->
      <template v-if="visibleClefs.bass">
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
      </template>

      <!-- Línea vertical final -->
      <line
        :x1="width - rightPadding"
        :x2="width - rightPadding"
        :y1="systemTop"
        :y2="systemBottom"
        :stroke="lineColor"
        stroke-width="1"
        opacity="0.35"
      />

      <!-- Claves usando Bravura -->
      <text
        v-if="visibleClefs.treble"
        :x="staffLeft + 16"
        :y="trebleTop + 3 * lineGap"
        class="font-music"
        :style="{ fontSize: `${lineGap * 4}px`, fill: 'var(--color-gold-400)' }"
      >{{ gClef }}</text>
      <text
        v-if="visibleClefs.bass"
        :x="staffLeft + 18"
        :y="bassTop + lineGap"
        class="font-music"
        :style="{ fontSize: `${lineGap * 4}px`, fill: 'var(--color-gold-400)' }"
      >{{ fClef }}</text>

      <!-- Notas -->
      <TransitionGroup tag="g" name="note">
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
          class="pointer-events-none note-label"
        >
          <defs>
            <linearGradient :id="`label-bg-${entry.note.id}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0f1320" stop-opacity="0.98" />
              <stop offset="100%" stop-color="#070810" stop-opacity="0.98" />
            </linearGradient>
            <filter :id="`label-glow-${entry.note.id}`" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#22d3ee" flood-opacity="0.35" />
              <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#000" flood-opacity="0.6" />
            </filter>
          </defs>

          <!-- Tooltip pill -->
          <rect
            :x="-labelWidth / 2"
            :y="entry.labelY - lineGap * 1.35"
            :width="labelWidth"
            :height="lineGap * 2"
            :rx="lineGap"
            :fill="`url(#label-bg-${entry.note.id})`"
            stroke="var(--color-aqua-400)"
            stroke-opacity="0.7"
            stroke-width="1.25"
            :filter="`url(#label-glow-${entry.note.id})`"
          />

          <!-- Pointer: relleno primero (triángulo cerrado, sin stroke) -->
          <path
            :d="`M -6 ${entry.labelY + lineGap * 0.65} L 0 ${entry.labelY + lineGap * 1.2} L 6 ${entry.labelY + lineGap * 0.65} Z`"
            fill="#070810"
          />
          <!-- Pointer: solo los dos lados externos, sin la línea horizontal de arriba -->
          <polyline
            :points="`-6,${entry.labelY + lineGap * 0.65} 0,${entry.labelY + lineGap * 1.2} 6,${entry.labelY + lineGap * 0.65}`"
            fill="none"
            stroke="var(--color-aqua-400)"
            stroke-opacity="0.7"
            stroke-width="1.25"
            stroke-linejoin="round"
            stroke-linecap="round"
          />

          <text
            :x="0"
            :y="entry.labelY + lineGap * 0.05"
            text-anchor="middle"
            class="font-display select-none"
            :style="{ fontSize: `${lineGap * 1.15}px`, fontWeight: 700, letterSpacing: '0.04em', fill: 'var(--color-aqua-100)' }"
          >{{ highlightLabel(entry.note) }}</text>
        </g>
      </g>
      </TransitionGroup>
    </svg>
  </div>
</template>

<style scoped>
.note-enter-from,
.note-leave-to {
  opacity: 0;
}

.note-enter-active {
  transition: opacity 380ms cubic-bezier(0.32, 0.72, 0, 1) 60ms;
}

.note-leave-active {
  transition: opacity 200ms ease-out;
}
</style>

<script lang="ts" setup>
import type { StaffNote } from '~/composables/useStaff'

interface Props {
  trebleNotes: StaffNote[]
  bassNotes: StaffNote[]
  highlighted?: StaffNote | null
  soundEnabled?: boolean
  /** Si se pasa, solo se renderizan las notas de esa octava. */
  focusOctave?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  highlighted: null,
  soundEnabled: true,
  focusOctave: null
})

const emit = defineEmits<{
  hover: [note: StaffNote | null]
  select: [note: StaffNote]
}>()

const { noteName, noteLabel, bottomStep, buildNote } = useStaff()
const { playMidi } = useAudio()

const highlightedIsSharp = computed(() => props.highlighted?.accidental === 'sharp')

const labelWidth = computed(() => {
  if (!props.highlighted) return lineGap.value * 4
  const text = noteLabel(props.highlighted)
  const charWidth = lineGap.value * 0.7
  const padding = lineGap.value * 2
  return Math.max(lineGap.value * 4, text.length * charWidth + padding)
})

function highlightLabel(note: StaffNote): string {
  if (!props.highlighted) return noteName(note)
  return noteLabel(props.highlighted)
}

const lineGap = computed(() => props.focusOctave === null ? 13 : 17)
const noteRadius = computed(() => lineGap.value * (props.focusOctave === null ? 0.6 : 0.5))
const noteSpacing = computed(() => lineGap.value * (props.focusOctave === null ? 2.4 : 1.7))
const staffLeft = computed(() => props.focusOctave === null ? 64 : 8)
const leftPadding = computed(() => staffLeft.value + lineGap.value * (props.focusOctave === null ? 7 : 4))
const rightPadding = computed(() => props.focusOctave === null ? lineGap.value * 3 : lineGap.value * 1)
const staffGap = computed(() => lineGap.value * 4.5)
const topPadding = computed(() => props.focusOctave === null ? lineGap.value * 5 : lineGap.value * 3)

const lineColor = 'rgba(207, 250, 254, 0.7)'

const gClef = String.fromCodePoint(0xE050)
const fClef = String.fromCodePoint(0xE062)

const C4_STEP = buildNote('C', 4).step
const TREBLE_BOTTOM_STEP = bottomStep('treble')
const BASS_BOTTOM_STEP = bottomStep('bass')

const allNotes = computed(() => {
  const bass = props.bassNotes
  const treble = props.trebleNotes.filter(n => n.step !== C4_STEP)
  const all = [...bass, ...treble]
  if (props.focusOctave === null) return all
  const showTreble = props.focusOctave >= 4
  return all.filter(n => showTreble ? n.step >= C4_STEP : n.step < C4_STEP)
})

const visibleClefs = computed(() => {
  if (props.focusOctave === null) return { treble: true, bass: true }
  const oct = props.focusOctave
  if (oct <= 3) return { treble: false, bass: true }
  return { treble: true, bass: false }
})

const trebleTop = computed(() => lineGap.value * 5)
const bassTop = computed(() => {
  if (!visibleClefs.value.treble) return trebleTop.value
  return trebleTop.value + 4 * lineGap.value + staffGap.value
})
const systemTop = computed(() => {
  return visibleClefs.value.treble ? trebleTop.value : bassTop.value
})
const systemBottom = computed(() => {
  return visibleClefs.value.bass
    ? bassTop.value + 4 * lineGap.value
    : trebleTop.value + 4 * lineGap.value
})
const height = computed(() => systemBottom.value + lineGap.value * 5)

const width = computed(() => {
  const intrinsic = leftPadding.value + allNotes.value.length * noteSpacing.value + rightPadding.value
  const minWidth = props.focusOctave === null ? 720 : intrinsic
  return Math.max(minWidth, intrinsic)
})

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
    const baseTop = onTreble ? trebleTop.value : bassTop.value
    const y = baseTop + 4 * lineGap.value - stepsFromBottom * (lineGap.value / 2)

    const ledgers: number[] = []
    if (stepsFromBottom < 0) {
      const count = Math.floor(-stepsFromBottom / 2)
      for (let k = 1; k <= count; k++) {
        const stepBelow = -k * 2
        ledgers.push((stepBelow - stepsFromBottom) * (lineGap.value / 2))
      }
    } else if (stepsFromBottom > 8) {
      const count = Math.floor((stepsFromBottom - 8) / 2)
      for (let k = 1; k <= count; k++) {
        const stepAbove = 8 + k * 2
        ledgers.push((stepAbove - stepsFromBottom) * (lineGap.value / 2))
      }
    }

    const labelY = -lineGap.value * 3.5
    return { note, x: leftPadding.value + i * noteSpacing.value, y, ledgers, labelY }
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
  const x = staffLeft.value - 6
  const y1 = trebleTop.value - 6
  const y2 = bassTop.value + 4 * lineGap.value + 6
  const mid = (y1 + y2) / 2
  const w = 18
  return `
    M ${x} ${y1}
    C ${x - w} ${y1 + 14}, ${x - w * 0.4} ${mid - 20}, ${x - w * 0.6} ${mid}
    C ${x - w * 0.4} ${mid + 20}, ${x - w} ${y2 - 14}, ${x} ${y2}
  `
})
</script>
