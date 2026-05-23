<template>
  <div ref="containerEl" class="w-full">
    <svg
      v-if="containerWidth > 0"
      :viewBox="`0 0 ${containerWidth} ${totalHeight}`"
      :style="{ width: '100%', height: 'auto' }"
      role="img"
      aria-label="Builder grand staff"
    >
      <g
        v-for="(system, sIdx) in systems"
        :key="`sys-${sIdx}`"
        :transform="`translate(0, ${system.y})`"
      >
        <line
          :x1="staffLeft"
          :x2="staffLeft"
          :y1="trebleTop"
          :y2="bassTop + 4 * lineGap"
          :stroke="lineColor"
          stroke-width="2"
        />

        <path
          :d="bracePath"
          fill="none"
          :stroke="lineColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />

        <line
          v-for="i in 5"
          :key="`treble-${i}`"
          :x1="staffLeft"
          :x2="system.right"
          :y1="trebleTop + (i - 1) * lineGap"
          :y2="trebleTop + (i - 1) * lineGap"
          :stroke="lineColor"
          stroke-width="0.9"
          opacity="0.55"
        />

        <line
          v-for="i in 5"
          :key="`bass-${i}`"
          :x1="staffLeft"
          :x2="system.right"
          :y1="bassTop + (i - 1) * lineGap"
          :y2="bassTop + (i - 1) * lineGap"
          :stroke="lineColor"
          stroke-width="0.9"
          opacity="0.55"
        />

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

        <!-- Armadura (sostenidos o bemoles según la tonalidad) -->
        <template v-for="(pos, i) in keySignatureMarks.positions" :key="`ks-${i}`">
          <text
            :x="staffLeft + lineGap * 5.5 + i * lineGap * 0.9"
            :y="trebleTop + pos.treble * (lineGap / 2)"
            class="font-music select-none"
            :style="{ fontSize: `${lineGap * 2.4}px`, fill: 'var(--color-paper)' }"
          >{{ keySignatureMarks.glyph }}</text>
          <text
            :x="staffLeft + lineGap * 5.5 + i * lineGap * 0.9"
            :y="bassTop + pos.bass * (lineGap / 2)"
            class="font-music select-none"
            :style="{ fontSize: `${lineGap * 2.4}px`, fill: 'var(--color-paper)' }"
          >{{ keySignatureMarks.glyph }}</text>
        </template>

        <template v-if="sIdx === 0">
          <text
            :x="staffLeft + leftClefPadding - lineGap * 1.6"
            :y="trebleTop + 1.6 * lineGap"
            class="font-music select-none"
            text-anchor="middle"
            :style="{ fontSize: `${lineGap * 2.6}px`, fill: 'var(--color-paper)' }"
          >{{ tsTop }}</text>
          <text
            :x="staffLeft + leftClefPadding - lineGap * 1.6"
            :y="trebleTop + 3.6 * lineGap"
            class="font-music select-none"
            text-anchor="middle"
            :style="{ fontSize: `${lineGap * 2.6}px`, fill: 'var(--color-paper)' }"
          >{{ tsBottom }}</text>
          <text
            :x="staffLeft + leftClefPadding - lineGap * 1.6"
            :y="bassTop + 1.6 * lineGap"
            class="font-music select-none"
            text-anchor="middle"
            :style="{ fontSize: `${lineGap * 2.6}px`, fill: 'var(--color-paper)' }"
          >{{ tsTop }}</text>
          <text
            :x="staffLeft + leftClefPadding - lineGap * 1.6"
            :y="bassTop + 3.6 * lineGap"
            class="font-music select-none"
            text-anchor="middle"
            :style="{ fontSize: `${lineGap * 2.6}px`, fill: 'var(--color-paper)' }"
          >{{ tsBottom }}</text>
        </template>

        <!-- Compases clickeables -->
        <g
          v-for="(m, idx) in system.measures"
          :key="m.id"
        >
          <text
            :x="m.x + lineGap * 0.4"
            :y="trebleTop - lineGap * 1.2"
            class="font-display select-none pointer-events-none"
            :style="{ fontSize: `${lineGap * 0.95}px`, fill: 'var(--color-paper)', opacity: 0.55 }"
          >{{ m.number }}</text>

          <line
            v-if="idx > 0"
            :x1="m.x"
            :x2="m.x"
            :y1="trebleTop"
            :y2="bassTop + 4 * lineGap"
            :stroke="lineColor"
            stroke-width="0.9"
            opacity="0.45"
          />

          <rect
            :x="m.x"
            :y="trebleTop - lineGap * 2"
            :width="m.width"
            :height="(bassTop + 4 * lineGap + lineGap * 2) - (trebleTop - lineGap * 2)"
            :fill="selectedMeasureId === m.id
              ? 'rgba(252, 211, 77, 0.06)'
              : 'transparent'"
            :stroke="selectedMeasureId === m.id
              ? 'rgba(252, 211, 77, 0.35)'
              : 'transparent'"
            stroke-width="1"
            class="cursor-pointer hover:fill-aqua-400/[0.04] transition-colors"
            @click="emit('select-measure', m.id)"
          />

          <!-- Arpegios del compás (línea ondulada vertical en SVG path) -->
          <g
            v-for="arp in m.arpeggios"
            :key="arp.key"
            class="pointer-events-none"
          >
            <!-- Onda principal: arranca encima de la nota más aguda y baja hasta la más grave -->
            <g :transform="`translate(${arp.x - lineGap * 1.2}, ${arp.yTop - lineGap * 0.3})`">
              <path
                :d="arpeggioPath(arp.yBottom - arp.yTop + lineGap * 0.6)"
                fill="none"
                :stroke="paperColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </g>

            <!-- Flecha ascendente: punta arriba, encima de la onda -->
            <path
              v-if="arp.dir === 'up'"
              :d="`M ${arp.x - lineGap * 1.55} ${arp.yTop - lineGap * 0.05}
                   L ${arp.x - lineGap * 1.2} ${arp.yTop - lineGap * 0.7}
                   L ${arp.x - lineGap * 0.85} ${arp.yTop - lineGap * 0.05}`"
              fill="none"
              :stroke="paperColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Flecha descendente: punta abajo, debajo de la onda -->
            <path
              v-else-if="arp.dir === 'down'"
              :d="`M ${arp.x - lineGap * 1.55} ${arp.yBottom + lineGap * 0.35}
                   L ${arp.x - lineGap * 1.2} ${arp.yBottom + lineGap}
                   L ${arp.x - lineGap * 0.85} ${arp.yBottom + lineGap * 0.35}`"
              fill="none"
              :stroke="paperColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>

          <!-- Notas del compás -->
          <g
            v-for="placed in m.placedNotes"
            :key="placed.key"
            :transform="`translate(${placed.x}, ${placed.y})`"
            class="pointer-events-none"
          >
            <!-- Silencio -->
            <text
              v-if="placed.isRest"
              :x="0"
              :y="0"
              text-anchor="middle"
              class="font-music select-none"
              :style="{ fontSize: `${lineGap * 4}px`, fill: 'var(--color-paper)' }"
            >{{ placed.restGlyph }}</text>

            <!-- Nota normal -->
            <template v-else>
              <line
                v-for="(ledger, lIdx) in placed.ledgers"
                :key="`ldg-${lIdx}`"
                :x1="-noteRadius - 5"
                :x2="noteRadius + 5"
                :y1="ledger"
                :y2="ledger"
                :stroke="lineColor"
                stroke-width="1.1"
                opacity="0.7"
              />

              <text
                v-if="placed.accidental"
                :x="-noteRadius - 6"
                :y="lineGap * 0.55"
                text-anchor="end"
                class="font-music select-none"
                :style="{ fontSize: `${lineGap * 2.1}px`, fill: 'var(--color-paper)' }"
              >{{ placed.accidental === 'sharp' ? sharpGlyph : flatGlyph }}</text>

              <line
                v-if="placed.hasStem"
                :x1="placed.stemUp ? noteRadius * 0.9 : -noteRadius * 0.9"
                :x2="placed.stemUp ? noteRadius * 0.9 : -noteRadius * 0.9"
                :y1="0"
                :y2="placed.stemEndY !== undefined ? placed.stemEndY - placed.y : (placed.stemUp ? -lineGap * 2.4 : lineGap * 2.4)"
                :stroke="paperColor"
                stroke-width="1.4"
              />

              <text
                v-if="placed.flagGlyph"
                :x="placed.stemUp ? noteRadius * 0.9 : -noteRadius * 0.9"
                :y="placed.stemUp ? -lineGap * 2.4 : lineGap * 2.4"
                class="font-music select-none"
                :style="{ fontSize: `${lineGap * 4}px`, fill: 'var(--color-paper)' }"
              >{{ placed.flagGlyph }}</text>

              <ellipse
                :cx="0"
                :cy="0"
                :rx="noteRadius"
                :ry="noteRadius * 0.78"
                :transform="`rotate(-22)`"
                :fill="placed.filled ? paperColor : 'transparent'"
                :stroke="paperColor"
                stroke-width="1.4"
              />

              <circle
                v-if="placed.dotted"
                :cx="noteRadius + 5"
                :cy="0"
                :r="2.2"
                :fill="paperColor"
              />
            </template>
          </g>

          <!-- Beams (barras horizontales que unen plicas) -->
          <g
            v-for="beam in m.beams"
            :key="beam.key"
            class="pointer-events-none"
          >
            <rect
              v-for="layer in beam.layers"
              :key="`${beam.key}-${layer}`"
              :x="beam.x1"
              :y="beam.y1 + (beam.stemUp ? (layer - 1) * lineGap * 0.45 : -(layer - 1) * lineGap * 0.45 - lineGap * 0.32)"
              :width="beam.x2 - beam.x1"
              :height="lineGap * 0.32"
              :fill="paperColor"
            />
          </g>
        </g>

        <line
          :x1="system.right"
          :x2="system.right"
          :y1="trebleTop"
          :y2="bassTop + 4 * lineGap"
          :stroke="lineColor"
          stroke-width="1.5"
        />
      </g>

      <!-- Playhead: línea vertical que sigue la reproducción -->
      <g v-if="playhead" class="pointer-events-none">
        <line
          :x1="playhead.x"
          :x2="playhead.x"
          :y1="playhead.yTop"
          :y2="playhead.yBottom"
          stroke="rgb(103, 232, 249)"
          stroke-width="1.5"
          opacity="0.9"
        />
        <circle
          :cx="playhead.x"
          :cy="playhead.yTop"
          r="3.5"
          fill="rgb(103, 232, 249)"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import type { Duration, Hand, Measure } from '~/stores/builder.store'
import { measureCapacityBeats, noteBeats } from '~/stores/builder.store'

interface Props {
  measures: Measure[]
  timeSignature: string
  keySignature?: string
  selectedMeasureId?: string | null
  playingMeasureIdx?: number
  playheadMs?: number
  measureStartsMs?: number[]
  measureDurationsMs?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  keySignature: 'C',
  selectedMeasureId: null,
  playingMeasureIdx: -1,
  playheadMs: 0,
  measureStartsMs: () => [],
  measureDurationsMs: () => []
})

const emit = defineEmits<{
  'select-measure': [measureId: string]
}>()

const lineGap = 14
const staffLeft = computed(() => isMobileLayout.value ? 16 : 64)
const trebleTop = computed(() => lineGap * (isMobileLayout.value ? 2 : 5))
const staffGap = lineGap * 4.5
const bassTop = computed(() => trebleTop.value + 4 * lineGap + staffGap)
const systemHeight = computed(() => bassTop.value + 4 * lineGap + lineGap * (isMobileLayout.value ? 1.5 : 5))
const systemTopPadding = computed(() => lineGap * (isMobileLayout.value ? 0.5 : 3))
const systemSpacing = computed(() => lineGap * (isMobileLayout.value ? 1 : 3))
const noteRadius = lineGap * 0.42

const leftClefPaddingBase = lineGap * 9
const leftClefPadding = computed(() => leftClefPaddingBase + keySignatureWidth.value)
const rightPadding = lineGap * 1.5

const lineColor = 'rgba(207, 250, 254, 0.7)'
const paperColor = 'rgba(244, 241, 234, 0.92)'

const gClef = String.fromCodePoint(0xE050)
const fClef = String.fromCodePoint(0xE062)
const sharpGlyph = String.fromCodePoint(0xE262)
const flatGlyph = String.fromCodePoint(0xE260)
const flag8Up = String.fromCodePoint(0xE240)
const flag8Down = String.fromCodePoint(0xE241)
const flag16Up = String.fromCodePoint(0xE242)
const flag16Down = String.fromCodePoint(0xE243)

// B4 (línea central de la clave de Sol): step = 4*7 + 6 = 34
// D3 (línea central de la clave de Fa):  step = 3*7 + 1 = 22
const TREBLE_REF_STEP = 34
const BASS_REF_STEP = 22
const TREBLE_REF_Y = computed(() => trebleTop.value + 2 * lineGap)
const BASS_REF_Y = computed(() => bassTop.value + 2 * lineGap)

const tsTop = computed(() => props.timeSignature.split('/')[0] ?? '4')
const tsBottom = computed(() => props.timeSignature.split('/')[1] ?? '4')

// Armadura: cuántos sostenidos/bemoles trae cada tonalidad mayor.
// Positivo = sostenidos, negativo = bemoles.
const KEY_ACCIDENTALS: Record<string, number> = {
  C: 0,
  G: 1, D: 2, A: 3, E: 4, B: 5,
  F: -1, 'B♭': -2, 'E♭': -3, 'A♭': -4
}

// Orden tradicional de sostenidos: FA♯, DO♯, SOL♯, RE♯, LA♯, MI♯, SI♯
// Y de bemoles (al revés): SI♭, MI♭, LA♭, RE♭, SOL♭, DO♭, FA♭
// Para cada uno, su posición vertical relativa al top del staff (en semilíneas, 1 = lineGap/2).
// Clave de Sol (treble): F#=top, C#=middle, G#=top, D#=middle, A#=high, E#=top, B#=middle
const SHARP_Y_TREBLE = [0, 3, -1, 2, 5, 1, 4]   // FA♯, DO♯, SOL♯, RE♯, LA♯, MI♯, SI♯
const SHARP_Y_BASS = [2, 5, 1, 4, 7, 3, 6]
const FLAT_Y_TREBLE = [4, 1, 5, 2, 6, 3, 7]    // SI♭, MI♭, LA♭, RE♭, SOL♭, DO♭, FA♭
const FLAT_Y_BASS = [6, 3, 7, 4, 8, 5, 9]

const keySignatureMarks = computed(() => {
  const count = KEY_ACCIDENTALS[props.keySignature] ?? 0
  if (count === 0) return { glyph: '', positions: [] as { treble: number, bass: number }[] }
  if (count > 0) {
    const positions = Array.from({ length: count }, (_, i) => ({
      treble: SHARP_Y_TREBLE[i]!,
      bass: SHARP_Y_BASS[i]!
    }))
    return { glyph: sharpGlyph, positions }
  }
  const n = -count
  const positions = Array.from({ length: n }, (_, i) => ({
    treble: FLAT_Y_TREBLE[i]!,
    bass: FLAT_Y_BASS[i]!
  }))
  return { glyph: flatGlyph, positions }
})

const keySignatureWidth = computed(() => keySignatureMarks.value.positions.length * lineGap * 0.9)

const containerEl = ref<HTMLElement | null>(null)
const containerWidth = ref(0)

let ro: ResizeObserver | null = null

onMounted(() => {
  if (!containerEl.value) return
  containerWidth.value = containerEl.value.clientWidth
  ro = new ResizeObserver(entries => {
    const entry = entries[0]
    if (entry) containerWidth.value = entry.contentRect.width
  })
  ro.observe(containerEl.value)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
})

const isMobileLayout = computed(() => containerWidth.value > 0 && containerWidth.value < 640)

const measuresPerSystem = computed(() => {
  const w = containerWidth.value
  if (w > 0 && w < 640) return 2
  if (w > 0 && w < 960) return 3
  return 4
})

const measureWidth = computed(() => {
  const width = containerWidth.value
  if (width <= 0) return lineGap * 14
  const usable = width - staffLeft.value - leftClefPadding.value - rightPadding
  return usable / measuresPerSystem.value
})

function stepToY(step: number, hand: Hand): number {
  const refY = hand === 'treble' ? TREBLE_REF_Y.value : BASS_REF_Y.value
  const refStep = hand === 'treble' ? TREBLE_REF_STEP : BASS_REF_STEP
  return refY - (step - refStep) * (lineGap / 2)
}

function calcLedgers(step: number, hand: Hand): number[] {
  const ledgers: number[] = []
  // Treble: top line F5=38, bottom line E4=30
  // Bass:   top line A3=26, bottom line G2=18
  const topStep = hand === 'treble' ? 38 : 26
  const bottomStep = hand === 'treble' ? 30 : 18
  if (step > topStep) {
    for (let s = topStep + 2; s <= step; s += 2) {
      ledgers.push(stepToY(s, hand) - stepToY(step, hand))
    }
  } else if (step < bottomStep) {
    for (let s = bottomStep - 2; s >= step; s -= 2) {
      ledgers.push(stepToY(s, hand) - stepToY(step, hand))
    }
  }
  return ledgers
}

interface PlacedNote {
  key: string
  x: number
  y: number
  ledgers: number[]
  accidental: 'sharp' | 'flat' | null
  filled: boolean
  hasStem: boolean
  stemUp: boolean
  flagGlyph: string | null
  isRest: boolean
  restGlyph: string | null
  stemEndY?: number
  dotted: boolean
}

const REST_GLYPHS: Record<Duration, string> = {
  w: String.fromCodePoint(0xE4E3),
  h: String.fromCodePoint(0xE4E4),
  q: String.fromCodePoint(0xE4E5),
  '8': String.fromCodePoint(0xE4E6),
  '16': String.fromCodePoint(0xE4E7)
}

interface ArpeggioMark {
  key: string
  x: number
  yTop: number
  yBottom: number
  dir: 'up' | 'down'
}

interface BeamMark {
  key: string
  x1: number
  x2: number
  y1: number
  y2: number
  layers: number
  stemUp: boolean
}

interface PlacedMeasure {
  id: string
  number: number
  x: number
  width: number
  placedNotes: PlacedNote[]
  arpeggios: ArpeggioMark[]
  beams: BeamMark[]
}

interface System {
  y: number
  right: number
  measures: PlacedMeasure[]
}

function durationVisuals(duration: Duration, stemUp: boolean) {
  const filled = duration !== 'w' && duration !== 'h'
  const hasStem = duration !== 'w'
  let flagGlyph: string | null = null
  if (duration === '8') flagGlyph = stemUp ? flag8Up : flag8Down
  else if (duration === '16') flagGlyph = stemUp ? flag16Up : flag16Down
  return { filled, hasStem, flagGlyph }
}

interface SlotInfo {
  slotIdx: number
  startBeats: number
  duration: Duration
  isRest: boolean
  notes: BuilderNote[]
}

function isBeamableDuration(d: Duration): boolean {
  return d === '8' || d === '16'
}

// Cuántas barras lleva la duración: corchea = 1, semicorchea = 2
function beamLayers(d: Duration): number {
  if (d === '8') return 1
  if (d === '16') return 2
  return 0
}

// Devuelve los grupos de slots que se deben beamear, respetando pulsos fuertes (cada negra)
function detectBeamGroups(slots: SlotInfo[]): SlotInfo[][] {
  const groups: SlotInfo[][] = []
  let current: SlotInfo[] = []

  const flush = () => {
    if (current.length >= 2) groups.push(current)
    current = []
  }

  for (const s of slots) {
    if (s.isRest || !isBeamableDuration(s.duration)) {
      flush()
      continue
    }
    if (current.length === 0) {
      current.push(s)
      continue
    }
    const last = current[current.length - 1]!
    const currentBeat = Math.floor(last.startBeats)
    const nextBeat = Math.floor(s.startBeats)
    // Si cruza un pulso fuerte (entera), cortar grupo
    if (nextBeat !== currentBeat) {
      flush()
      current.push(s)
    } else {
      current.push(s)
    }
  }
  flush()
  return groups
}

function buildPlacedNotes(m: Measure, measureX: number, mw: number = measureWidth.value): { placed: PlacedNote[], arpeggios: ArpeggioMark[], beams: BeamMark[] } {
  const placed: PlacedNote[] = []
  const arpeggios: ArpeggioMark[] = []
  const beams: BeamMark[] = []
  const fullCapacity = measureCapacityBeats(props.timeSignature)
  const isPickup = m.pickupBeats !== undefined && m.pickupBeats < fullCapacity
  const effCapacity = m.pickupBeats ?? fullCapacity

  const visibleRatio = isPickup ? (effCapacity / fullCapacity) : 1
  const measureLeftPadding = lineGap * 1.8
  const measureRightPadding = lineGap * 1.2
  const usableW = (mw - measureLeftPadding - measureRightPadding) * visibleRatio
  const startNoteX = isPickup
    ? measureX + (mw - measureRightPadding) - usableW
    : measureX + measureLeftPadding
  const capacity = effCapacity
  const minNoteSpacing = lineGap * 2.2

  ;(['treble', 'bass'] as Hand[]).forEach(hand => {
    const slots = hand === 'treble' ? m.treble : m.bass
    const refStep = hand === 'treble' ? TREBLE_REF_STEP : BASS_REF_STEP
    const staffMidY = (hand === 'treble' ? trebleTop.value : bassTop.value) + 2 * lineGap

    // Pre-cálculo: posición de cada slot
    const infos: SlotInfo[] = []
    let beatsCursor = 0
    slots.forEach((slot, slotIdx) => {
      const first = slot[0]
      if (!first) return
      infos.push({
        slotIdx,
        startBeats: beatsCursor,
        duration: first.duration,
        isRest: !!first.isRest,
        notes: slot
      })
      beatsCursor += noteBeats(first)
    })

    // Mapeo de slotIdx → x calculado, asegurando separación mínima
    const slotX = new Map<number, number>()
    let lastX = -Infinity
    for (const info of infos) {
      const proportional = startNoteX + (info.startBeats / capacity) * usableW
      const x = Math.max(proportional, lastX + minNoteSpacing)
      slotX.set(info.slotIdx, x)
      lastX = x
    }

    // Detectar grupos beameables
    const beamGroups = detectBeamGroups(infos)
    const beamedSlotIdx = new Set<number>()
    beamGroups.forEach(g => g.forEach(s => beamedSlotIdx.add(s.slotIdx)))

    // Construir notas
    infos.forEach(info => {
      const x = slotX.get(info.slotIdx) ?? startNoteX

      if (info.isRest) {
        placed.push({
          key: `${m.id}-${hand}-${info.slotIdx}-rest`,
          x,
          y: staffMidY,
          ledgers: [],
          accidental: null,
          filled: false,
          hasStem: false,
          stemUp: false,
          flagGlyph: null,
          isRest: true,
          restGlyph: REST_GLYPHS[info.duration],
          dotted: !!info.notes[0]?.dotted
        })
        return
      }

      const inBeam = beamedSlotIdx.has(info.slotIdx)
      const ys: number[] = []
      info.notes.forEach((note, noteIdx) => {
        const stemUp = note.step < refStep
        const visuals = durationVisuals(note.duration, stemUp)
        const y = stepToY(note.step, hand)
        ys.push(y)
        placed.push({
          key: `${m.id}-${hand}-${info.slotIdx}-${noteIdx}`,
          x,
          y,
          ledgers: calcLedgers(note.step, hand),
          accidental: note.accidental,
          filled: visuals.filled,
          hasStem: visuals.hasStem,
          stemUp,
          // Si la nota está dentro de un beam, NO dibujamos banderola individual
          flagGlyph: inBeam ? null : visuals.flagGlyph,
          isRest: false,
          restGlyph: null,
          dotted: !!note.dotted
        })
      })

      const first = info.notes[0]!
      if (info.notes.length >= 2 && first.arpeggio) {
        arpeggios.push({
          key: `${m.id}-${hand}-${info.slotIdx}-arp`,
          x,
          yTop: Math.min(...ys),
          yBottom: Math.max(...ys),
          dir: first.arpeggioDir ?? 'up'
        })
      }
    })

    // Construir beams
    beamGroups.forEach((group, gIdx) => {
      // Posiciones X de cada slot en el grupo
      const xs = group.map(s => slotX.get(s.slotIdx) ?? startNoteX)

      // Decidir dirección de plica común: la mayoría manda; empate → arriba
      let upVotes = 0
      let downVotes = 0
      group.forEach(s => {
        s.notes.forEach(n => {
          if (n.step < refStep) upVotes++
          else downVotes++
        })
      })
      const stemUp = upVotes >= downVotes

      // Y extremo: para stemUp tomamos la nota más aguda (Y mínima),
      // para stemDown la más grave (Y máxima)
      const allYs: { x: number, yExtreme: number }[] = group.map((s, i) => {
        const noteYs = s.notes.map(n => stepToY(n.step, hand))
        return {
          x: xs[i]!,
          yExtreme: stemUp ? Math.min(...noteYs) : Math.max(...noteYs)
        }
      })

      // Plica de longitud "estándar": ~3.2 lineGap de la cabeza extrema
      const stemLen = lineGap * 2.4
      const beamYs = allYs.map(p => stemUp ? p.yExtreme - stemLen : p.yExtreme + stemLen)

      // Y del beam: elegir el extremo más lejano (todas las plicas llegan al menos hasta el beam)
      const beamY1 = stemUp ? Math.min(...beamYs) : Math.max(...beamYs)
      const beamY2 = beamY1 // por ahora barra horizontal (no inclinada)

      const layers = Math.max(...group.map(s => beamLayers(s.duration)))

      beams.push({
        key: `${m.id}-${hand}-beam-${gIdx}`,
        x1: xs[0]! + (stemUp ? noteRadius * 0.9 : -noteRadius * 0.9),
        x2: xs[xs.length - 1]! + (stemUp ? noteRadius * 0.9 : -noteRadius * 0.9),
        y1: beamY1,
        y2: beamY2,
        layers,
        stemUp
      })

      // Marcar a las notas placed con stemEndY igual al beam
      group.forEach((s, i) => {
        const xRef = xs[i]!
        const noteYs = s.notes.map(n => stepToY(n.step, hand))
        s.notes.forEach((n, noteIdx) => {
          const placedNote = placed.find(p => p.key === `${m.id}-${hand}-${s.slotIdx}-${noteIdx}`)
          if (placedNote) {
            placedNote.stemUp = stemUp
            // El extremo Y de la plica que llega al beam
            placedNote.stemEndY = beamY1 - (stemUp ? n.step === Math.min(...noteYs.map((_, k) => s.notes[k]!.step)) ? 0 : 0 : 0)
            // Simplificado: usar la Y del beam
            placedNote.stemEndY = beamY1
          }
        })
        void xRef
      })
    })
  })

  return { placed, arpeggios, beams }
}

const systems = computed<System[]>(() => {
  if (containerWidth.value <= 0) return []
  const result: System[] = []
  const startX = staffLeft.value + leftClefPadding.value
  const usable = containerWidth.value - startX - rightPadding

  const mps = measuresPerSystem.value
  for (let i = 0; i < props.measures.length; i += mps) {
    const slice = props.measures.slice(i, i + mps)
    // Si la última fila tiene menos compases, los expandimos para llenar el ancho.
    const mw = usable / slice.length
    const placed: PlacedMeasure[] = slice.map((m, j) => {
      const x = startX + j * mw
      const built = buildPlacedNotes(m, x, mw)
      return {
        id: m.id,
        number: i + j + 1,
        x,
        width: mw,
        placedNotes: built.placed,
        arpeggios: built.arpeggios,
        beams: built.beams
      }
    })
    result.push({
      y: systemTopPadding.value + result.length * (systemHeight.value + systemSpacing.value),
      right: startX + slice.length * mw,
      measures: placed
    })
  }
  return result
})

const totalHeight = computed(() => {
  if (systems.value.length === 0) return systemHeight.value + systemTopPadding.value * 2
  return systemTopPadding.value * 2 + systems.value.length * systemHeight.value + (systems.value.length - 1) * systemSpacing.value
})

interface PlayheadPos {
  x: number
  yTop: number
  yBottom: number
}

const playhead = computed<PlayheadPos | null>(() => {
  const idx = props.playingMeasureIdx
  if (idx < 0) return null
  const starts = props.measureStartsMs
  const durs = props.measureDurationsMs
  if (!starts.length || idx >= starts.length) return null

  // Localizar el sistema y la PlacedMeasure activos
  let activeMeasure: PlacedMeasure | null = null
  let activeSystem: System | null = null
  for (const sys of systems.value) {
    const m = sys.measures.find(pm => pm.number - 1 === idx)
    if (m) {
      activeMeasure = m
      activeSystem = sys
      break
    }
  }
  if (!activeMeasure || !activeSystem) return null

  const elapsedInMeasure = Math.max(0, props.playheadMs - starts[idx]!)
  const dur = durs[idx] ?? 1
  const progress = Math.min(1, elapsedInMeasure / dur)

  return {
    x: activeMeasure.x + progress * activeMeasure.width,
    yTop: activeSystem.y + trebleTop.value - lineGap * 2,
    yBottom: activeSystem.y + bassTop.value + 4 * lineGap + lineGap * 2
  }
})

function arpeggioPath(height: number): string {
  const amp = lineGap * 0.45
  const wavelength = lineGap * 1.1
  const waves = Math.max(2, Math.round(height / wavelength))
  const stepY = height / waves
  let d = `M 0 0`
  for (let i = 0; i < waves; i++) {
    const y0 = i * stepY
    const y1 = (i + 0.5) * stepY
    const y2 = (i + 1) * stepY
    const sign = i % 2 === 0 ? 1 : -1
    d += ` C ${sign * amp} ${y0 + stepY * 0.15}, ${sign * amp} ${y1 + stepY * 0.35}, 0 ${y2}`
  }
  return d
}

const bracePath = computed(() => {
  const x = staffLeft.value - 6
  const y1 = trebleTop.value - 6
  const y2 = bassTop.value + 4 * lineGap + 6
  const mid = (y1 + y2) / 2
  const w = 18
  return `
    M ${x} ${y1}
    C ${x - w} ${y1 + 14}, ${x - w * 0.4} ${mid - 20}, ${x - w * 0.6} ${mid}
    C ${x - w * 0.4} ${mid + 20}, ${x - w} ${y2 - 14}, ${x} ${y2}
  `
})
</script>
