<template>
  <div class="flex flex-col gap-3">
    <!-- Capacidad -->
    <div class="flex items-center gap-2 text-[11px] text-paper/50">
      <Badge
        variant="outline"
        class="font-mono"
        :class="atCapacity
          ? 'text-amber-300/90 border-amber-300/30'
          : full
            ? 'text-rose-300/90 border-rose-300/30'
            : ''"
      >
        {{ usedBeats }} / {{ capacity }} {{ $t('page.builder-beats') }}
      </Badge>
      <span v-if="atCapacity" class="text-amber-300/80">{{ $t('page.builder-full') }}</span>
      <span v-else-if="full" class="text-rose-300/80">{{ $t('page.builder-no-fit') }}</span>
    </div>

    <!-- Mini piano (multi-octava, usa KeyboardOctave unificado) -->
    <div class="rounded-lg border border-white/10 bg-ink-900/40 overflow-hidden">
      <div class="flex items-center justify-between px-3 py-2 border-b border-white/5 text-[11px]">
        <span class="uppercase tracking-[0.18em] text-paper/40">{{ $t('page.builder-pitch') }}</span>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="icon" class="h-6 w-6" @click="shiftOctaves(-1)">
            <ChevronLeft :size="13" />
          </Button>
          <span class="text-paper/50 font-mono">
            {{ $t('page.builder-octave') }} {{ startOctave }}–{{ startOctave + visibleOctaves - 1 }}
          </span>
          <Button variant="outline" size="icon" class="h-6 w-6" @click="shiftOctaves(1)">
            <ChevronRight :size="13" />
          </Button>
        </div>
      </div>
      <div class="overflow-x-auto scroll-elegant p-2">
        <div class="flex gap-1 mx-auto" :style="{ width: 'fit-content' }">
          <PianoKeyboardOctave
            v-for="oct in visibleOctaveList"
            :key="oct"
            :octave="oct"
            :selected-midis="selectedMidis"
            @toggle-white="onPianoToggle"
            @toggle-black="onPianoToggle"
          />
        </div>
      </div>
    </div>
    <p v-if="selectedNotes.length === 0" class="text-[10px] text-paper/30">
      {{ $t('page.builder-pitch-hint') }}
    </p>

    <div class="grid grid-cols-2 gap-2">
      <Button
        :disabled="(editingIdx === null && full) || selectedNotes.length === 0"
        @click="onPrimaryAction"
      >
        <Plus :size="14" />
        {{ selectedNotes.length > 1 ? $t('page.builder-add-chord') : $t('page.builder-add-note') }}
      </Button>
      <Button
        variant="outline"
        :disabled="full && editingIdx === null"
        @click="emit('add-rest')"
      >
        <Pause :size="14" />
        {{ $t('page.builder-add-rest') }}
      </Button>
    </div>

    <!-- Lista de slots existentes -->
    <div class="flex flex-col gap-1.5">
      <label class="text-[11px] uppercase tracking-[0.18em] text-paper/40">
        {{ $t('page.builder-current-notes') }}
      </label>
      <p v-if="slots.length === 0" class="text-xs text-paper/40 italic">
        {{ $t('page.builder-no-notes') }}
      </p>
      <ul v-else class="flex flex-col gap-1">
        <li
          v-for="(slot, idx) in slots"
          :key="idx"
          class="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-ink-900/50 border text-xs transition-colors cursor-pointer hover:bg-ink-900/80"
          :class="editingIdx === idx ? 'border-gold-400/50 bg-gold-400/[0.04]' : 'border-white/5'"
          @click="onSlotClick(idx)"
        >
          <div class="flex items-center gap-2 min-w-0">
            <Badge variant="outline" class="font-mono shrink-0">{{ idx + 1 }}</Badge>
            <span class="text-paper truncate">
              {{ slotLabel(slot) }}
            </span>
            <span class="text-paper/40 font-music text-base leading-none shrink-0">
              {{ durationGlyph(slot[0]?.duration) }}
            </span>
          </div>
          <div class="flex items-center gap-1 shrink-0" @click.stop>
            <Button
              variant="ghost"
              size="icon"
              class="h-7 w-7 text-paper/40 hover:text-paper disabled:opacity-30"
              :disabled="idx === 0"
              :title="$t('page.builder-move-up')"
              @click="emit('move-slot', { from: idx, to: idx - 1 })"
            >
              <ChevronUp :size="13" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-7 w-7 text-paper/40 hover:text-paper disabled:opacity-30"
              :disabled="idx === slots.length - 1"
              :title="$t('page.builder-move-down')"
              @click="emit('move-slot', { from: idx, to: idx + 1 })"
            >
              <ChevronDown :size="13" />
            </Button>
            <Button
              v-if="slot.length >= 2 && !slot[0]?.isRest"
              variant="ghost"
              size="icon"
              class="h-7 w-7"
              :class="slot[0]?.arpeggio
                ? 'text-aqua-300 hover:text-aqua-200'
                : 'text-paper/40 hover:text-paper'"
              :title="arpeggioTooltip(slot)"
              @click="emit('toggle-arpeggio', idx)"
            >
              <ArrowUp v-if="slot[0]?.arpeggio && slot[0]?.arpeggioDir !== 'down'" :size="13" />
              <ArrowDown v-else-if="slot[0]?.arpeggio && slot[0]?.arpeggioDir === 'down'" :size="13" />
              <Waves v-else :size="13" />
            </Button>
            <Button variant="ghost" size="icon" class="h-7 w-7 text-paper/40 hover:text-rose-300" @click="emit('remove', idx)">
              <Trash2 :size="13" />
            </Button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pause, Plus, Trash2, Waves } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import type { BuilderNote, Duration, Hand } from '~/stores/builder.store'
import { DURATION_BEATS, measureCapacityBeats, slotsBeats } from '~/stores/builder.store'

type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'

interface Props {
  hand: Hand
  slots: BuilderNote[][]
  timeSignature: string
  selectedDuration: Duration
  selectedAccidental: 'sharp' | 'flat' | null
  capacityOverride?: number | null
}

const props = withDefaults(defineProps<Props>(), { capacityOverride: null })

const emit = defineEmits<{
  add: [notes: BuilderNote[]]
  'add-rest': []
  remove: [slotIdx: number]
  'toggle-arpeggio': [slotIdx: number]
  'move-slot': [payload: { from: number, to: number }]
  'update-slot': [payload: { slotIdx: number, notes: BuilderNote[] }]
  'sync-controls': [payload: { duration: Duration, accidental: 'sharp' | 'flat' | null }]
}>()

const { t } = useI18n()

const LETTERS: Letter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

interface SelectedNote {
  letter: Letter
  octave: number
  midi: number
  accidental: 'sharp' | 'flat' | null
}

const visibleOctaves = 3
const startOctave = ref(props.hand === 'treble' ? 4 : 2)
const selectedNotes = ref<SelectedNote[]>([])

const selectedMidis = computed(() => selectedNotes.value.map(n => n.midi))

const visibleOctaveList = computed(() =>
  Array.from({ length: visibleOctaves }, (_, i) => startOctave.value + i)
)

watch(() => props.hand, (h) => {
  startOctave.value = h === 'treble' ? 4 : 2
})

function shiftOctaves(delta: number) {
  startOctave.value = Math.min(7 - visibleOctaves, Math.max(1, startOctave.value + delta))
}

interface ToggleEvt { letter: Letter, octave: number, midi: number }

function onPianoToggle(payload: ToggleEvt & { letter: string }) {
  const letter = payload.letter as Letter
  const idx = selectedNotes.value.findIndex(n => n.midi === payload.midi)
  if (idx >= 0) {
    selectedNotes.value.splice(idx, 1)
    return
  }
  // Si es tecla negra (midi+1 vs blanca), accidental sharp
  const whiteMidi = (payload.octave + 1) * 12 + ({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 } as Record<Letter, number>)[letter]
  const isSharp = payload.midi === whiteMidi + 1
  selectedNotes.value.push({
    letter,
    octave: payload.octave,
    midi: payload.midi,
    accidental: isSharp ? 'sharp' : null
  })
}

// Edición de slot existente: panel superior se sintoniza, cambios aplican al toque
const editingIdx = ref<number | null>(null)

function onSlotClick(idx: number) {
  const slot = props.slots[idx]
  if (!slot || slot[0]?.isRest) return

  if (editingIdx.value === idx) {
    exitEditing()
    return
  }

  const first = slot[0]!
  editingIdx.value = idx
  selectedNotes.value = slot.map(n => ({
    letter: n.letter as Letter,
    octave: n.octave,
    midi: n.midi,
    accidental: n.accidental
  }))
  // Empujar el piano para que la octava más grave del slot quede visible
  startOctave.value = Math.max(1, Math.min(5, Math.min(...slot.map(n => n.octave)) - 1))
  emit('sync-controls', {
    duration: first.duration,
    accidental: first.accidental
  })
}

function exitEditing() {
  editingIdx.value = null
  selectedNotes.value = []
}

function onPrimaryAction() {
  if (editingIdx.value !== null) commitEdit()
  else addChord()
}

function commitEdit() {
  if (editingIdx.value === null || selectedNotes.value.length === 0) return
  const idx = editingIdx.value
  const oldFirst = props.slots[idx]?.[0]
  const notes = buildNotes().map(n => ({
    ...n,
    arpeggio: oldFirst?.arpeggio,
    arpeggioDir: oldFirst?.arpeggioDir
  }))
  emit('update-slot', { slotIdx: idx, notes })
}

// Aplicar cambios al toque mientras estás editando un slot
watch([selectedNotes, () => props.selectedDuration, () => props.selectedAccidental], () => {
  if (editingIdx.value !== null) commitEdit()
}, { deep: true })

// Si el slot editado deja de existir (borrado externo), salir
watch(() => props.slots.length, () => {
  if (editingIdx.value !== null && editingIdx.value >= props.slots.length) {
    exitEditing()
  }
})

const capacity = computed(() => props.capacityOverride ?? measureCapacityBeats(props.timeSignature))
const usedBeats = computed(() => slotsBeats(props.slots))
const remaining = computed(() => capacity.value - usedBeats.value)
const atCapacity = computed(() => remaining.value <= 0.001)
const full = computed(() => remaining.value < DURATION_BEATS[props.selectedDuration] - 0.001)

function stepOf(l: Letter, o: number): number {
  return o * 7 + LETTERS.indexOf(l)
}

function buildNotes(): BuilderNote[] {
  const ordered = [...selectedNotes.value].sort((a, b) => a.midi - b.midi)
  return ordered.map(n => ({
    id: Math.random().toString(36).slice(2, 10),
    letter: n.letter,
    octave: n.octave,
    midi: n.midi,
    step: stepOf(n.letter, n.octave),
    accidental: n.accidental,
    duration: props.selectedDuration
  }))
}

function addChord() {
  if (full.value || selectedNotes.value.length === 0) return
  emit('add', buildNotes())
}

function slotLabel(slot: BuilderNote[]): string {
  const first = slot[0]
  if (first?.isRest) return t('page.builder-rest-label')
  return slot.map(n => {
    const base = t(`note.${n.letter.toLowerCase()}`)
    if (n.accidental === 'sharp') return `${base}${t('note.sostenido')}${n.octave}`
    if (n.accidental === 'flat') return `${base}${t('note.bemol')}${n.octave}`
    return `${base}${n.octave}`
  }).join(' + ')
}

function arpeggioTooltip(slot: BuilderNote[]): string {
  const first = slot[0]
  if (!first?.arpeggio) return t('page.builder-arpeggio-off')
  return first.arpeggioDir === 'down'
    ? t('page.builder-arpeggio-down')
    : t('page.builder-arpeggio-up')
}

function durationGlyph(d: Duration | undefined): string {
  switch (d) {
    case 'w': return String.fromCodePoint(0xE1D2)
    case 'h': return String.fromCodePoint(0xE1D3)
    case 'q': return String.fromCodePoint(0xE1D5)
    case '8': return String.fromCodePoint(0xE1D7)
    case '16': return String.fromCodePoint(0xE1D9)
    default: return ''
  }
}
</script>
