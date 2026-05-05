<template>
  <Sheet :open="open" @update:open="onOpenChange">
    <SheetContent side="right" class="w-full sm:max-w-md p-0 flex flex-col">
      <SheetHeader class="px-6 pt-6 pb-4 border-b border-white/5">
        <SheetTitle class="font-display text-paper">
          {{ $t('page.builder-sheet-title', { n: measureNumber }) }}
        </SheetTitle>
        <SheetDescription class="text-paper/50 text-xs">
          {{ $t('page.builder-sheet-description') }}
        </SheetDescription>
      </SheetHeader>

      <div v-if="measure" class="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
        <!-- Selector duración -->
        <section class="flex flex-col gap-2">
          <label class="text-[11px] uppercase tracking-[0.18em] text-paper/40">
            {{ $t('page.builder-duration') }}
          </label>
          <ToggleGroup
            type="single"
            :model-value="duration"
            class="justify-start"
            @update:model-value="(v) => v && emit('update:duration', v as Duration)"
          >
            <ToggleGroupItem
              v-for="d in DURATIONS"
              :key="d.value"
              :value="d.value"
              class="font-music text-lg"
              :title="$t(d.labelKey)"
            >{{ d.glyph }}</ToggleGroupItem>
          </ToggleGroup>
        </section>

        <!-- Accidental -->
        <section class="flex flex-col gap-2">
          <label class="text-[11px] uppercase tracking-[0.18em] text-paper/40">
            {{ $t('page.builder-accidental') }}
          </label>
          <ToggleGroup
            type="single"
            :model-value="accidental ?? 'natural'"
            class="justify-start"
            @update:model-value="(v) => emit('update:accidental', v === 'natural' ? null : (v as 'sharp' | 'flat'))"
          >
            <ToggleGroupItem value="natural" class="font-music text-lg">♮</ToggleGroupItem>
            <ToggleGroupItem value="sharp" class="font-music text-lg">{{ sharpGlyph }}</ToggleGroupItem>
            <ToggleGroupItem value="flat" class="font-music text-lg">{{ flatGlyph }}</ToggleGroupItem>
          </ToggleGroup>
        </section>

        <!-- Anacrusa (pickup) -->
        <section class="flex flex-col gap-2 rounded-lg border border-white/5 bg-ink-900/40 p-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Music2 :size="14" class="text-paper/50" />
              <span class="text-[11px] uppercase tracking-[0.18em] text-paper/50">
                {{ $t('page.builder-pickup') }}
              </span>
            </div>
            <Button
              variant="outline"
              size="xs"
              :class="isPickup ? 'border-aqua-400/40 bg-aqua-400/10 text-aqua-200' : ''"
              @click="onTogglePickup"
            >
              {{ isPickup ? $t('page.builder-pickup-on') : $t('page.builder-pickup-off') }}
            </Button>
          </div>
          <div v-if="isPickup" class="flex items-center justify-between gap-2">
            <span class="text-[11px] text-paper/40">{{ $t('page.builder-pickup-beats') }}</span>
            <div class="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                class="h-7 w-7"
                :disabled="(measure?.pickupBeats ?? 1) <= 0.5"
                @click="emit('set-pickup', Math.max(0.5, (measure?.pickupBeats ?? 1) - 0.5))"
              >
                <Minus :size="13" />
              </Button>
              <Badge variant="outline" class="font-mono w-12 justify-center">
                {{ measure?.pickupBeats?.toFixed(1) ?? '1.0' }}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                class="h-7 w-7"
                :disabled="(measure?.pickupBeats ?? 1) >= fullCapacity - 0.5"
                @click="emit('set-pickup', Math.min(fullCapacity - 0.5, (measure?.pickupBeats ?? 1) + 0.5))"
              >
                <Plus :size="13" />
              </Button>
            </div>
          </div>
        </section>

        <!-- Tabs por mano -->
        <Tabs :model-value="hand" class="w-full" @update:model-value="(v) => emit('update:hand', v as Hand)">
          <TabsList class="grid grid-cols-2 w-full">
            <TabsTrigger value="bass" class="flex items-center gap-1.5">
              <HandIcon :size="14" class="-scale-x-100" />
              {{ $t('page.builder-hand-left') }}
            </TabsTrigger>
            <TabsTrigger value="treble" class="flex items-center gap-1.5">
              <HandIcon :size="14" />
              {{ $t('page.builder-hand-right') }}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bass" class="mt-4">
            <HandEditor
              hand="bass"
              :slots="measure.bass"
              :time-signature="timeSignature"
              :selected-duration="duration"
              :selected-accidental="accidental"
              :capacity-override="measure.pickupBeats ?? null"
              @add="(notes) => emit('add-chord', { hand: 'bass', notes })"
              @add-rest="emit('add-rest', { hand: 'bass' })"
              @remove="(slotIdx) => emit('remove-slot', { hand: 'bass', slotIdx })"
              @toggle-arpeggio="(slotIdx) => emit('toggle-arpeggio', { hand: 'bass', slotIdx })"
              @move-slot="(p) => emit('move-slot', { hand: 'bass', ...p })"
              @update-slot="(p) => emit('update-slot', { hand: 'bass', ...p })"
              @sync-controls="onSyncControls"
            />
          </TabsContent>

          <TabsContent value="treble" class="mt-4">
            <HandEditor
              hand="treble"
              :slots="measure.treble"
              :time-signature="timeSignature"
              :selected-duration="duration"
              :selected-accidental="accidental"
              :capacity-override="measure.pickupBeats ?? null"
              @add="(notes) => emit('add-chord', { hand: 'treble', notes })"
              @add-rest="emit('add-rest', { hand: 'treble' })"
              @remove="(slotIdx) => emit('remove-slot', { hand: 'treble', slotIdx })"
              @toggle-arpeggio="(slotIdx) => emit('toggle-arpeggio', { hand: 'treble', slotIdx })"
              @move-slot="(p) => emit('move-slot', { hand: 'treble', ...p })"
              @update-slot="(p) => emit('update-slot', { hand: 'treble', ...p })"
              @sync-controls="onSyncControls"
            />
          </TabsContent>
        </Tabs>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Hand as HandIcon, Minus, Music2, Plus } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '~/components/ui/sheet'
import {
  ToggleGroup,
  ToggleGroupItem
} from '~/components/ui/toggle-group'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '~/components/ui/tabs'
import HandEditor from './BuilderHandEditor.vue'
import type { BuilderNote, Duration, Hand, Measure } from '~/stores/builder.store'
import { measureCapacityBeats } from '~/stores/builder.store'

interface Props {
  open: boolean
  measure: Measure | null
  measureNumber: number
  timeSignature: string
  duration: Duration
  accidental: 'sharp' | 'flat' | null
  hand: Hand
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:duration': [value: Duration]
  'update:accidental': [value: 'sharp' | 'flat' | null]
  'update:hand': [value: Hand]
  'add-chord': [payload: { hand: Hand, notes: BuilderNote[] }]
  'add-rest': [payload: { hand: Hand }]
  'remove-slot': [payload: { hand: Hand, slotIdx: number }]
  'toggle-arpeggio': [payload: { hand: Hand, slotIdx: number }]
  'move-slot': [payload: { hand: Hand, from: number, to: number }]
  'update-slot': [payload: { hand: Hand, slotIdx: number, notes: BuilderNote[] }]
  'set-pickup': [beats: number | null]
}>()

const fullCapacity = computed(() => measureCapacityBeats(props.timeSignature))
const isPickup = computed(() => props.measure?.pickupBeats !== undefined)

function onTogglePickup() {
  if (isPickup.value) emit('set-pickup', null)
  else emit('set-pickup', 1)
}

function onSyncControls(payload: { duration: Duration, accidental: 'sharp' | 'flat' | null }) {
  emit('update:duration', payload.duration)
  emit('update:accidental', payload.accidental)
}

function onOpenChange(value: boolean) {
  emit('update:open', value)
}

const sharpGlyph = String.fromCodePoint(0xE262)
const flatGlyph = String.fromCodePoint(0xE260)

const DURATIONS: { value: Duration, glyph: string, labelKey: string }[] = [
  { value: 'w', glyph: String.fromCodePoint(0xE1D2), labelKey: 'page.builder-dur-w' },
  { value: 'h', glyph: String.fromCodePoint(0xE1D3), labelKey: 'page.builder-dur-h' },
  { value: 'q', glyph: String.fromCodePoint(0xE1D5), labelKey: 'page.builder-dur-q' },
  { value: '8', glyph: String.fromCodePoint(0xE1D7), labelKey: 'page.builder-dur-8' },
  { value: '16', glyph: String.fromCodePoint(0xE1D9), labelKey: 'page.builder-dur-16' }
]
</script>
