<template>
  <section class="px-6 lg:px-10 py-6 lg:py-8">
    <div class="max-w-[1600px] mx-auto flex flex-col gap-6">
      <header class="flex items-center justify-between gap-4">
        <div>
          <p class="text-[11px] uppercase tracking-[0.18em] text-paper/40">
            {{ $t('page.builder-label') }}
          </p>
          <h1 class="font-display text-2xl text-paper mt-1">
            {{ $t('page.builder-title') }}
          </h1>
        </div>

        <div class="flex items-center gap-2">
          <Button
            v-if="builder.currentSong"
            variant="outline"
            size="sm"
            @click="onBack"
          >
            <ArrowLeft :size="14" />
            {{ $t('page.builder-back') }}
          </Button>
          <BuilderSyncStatus v-if="builder.currentSong && drive.isConnected" />
          <BuilderDriveMenu />
          <Button size="sm" @click="onCreate">
            <Plus :size="14" />
            {{ $t('page.builder-new') }}
          </Button>
        </div>
      </header>

      <!-- Lista -->
      <article
        v-if="!builder.currentSong"
        class="flex flex-col gap-3"
      >
        <div
          v-if="builder.state.songs.length === 0"
          class="rounded-xl border border-white/5 bg-ink-800/40 p-8 text-paper/60 text-sm text-center"
        >
          {{ $t('page.builder-no-songs') }}
        </div>

        <ul
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          <li
            v-for="song in builder.state.songs"
            :key="song.id"
            class="rounded-xl border border-white/5 bg-ink-800/40 hover:bg-ink-800/60 p-4 cursor-pointer transition group"
            @click="builder.selectSong(song.id)"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-display text-paper truncate">{{ song.title }}</p>
                <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                  <Badge variant="outline" class="text-[10px]">{{ song.keySignature }}</Badge>
                  <Badge variant="outline" class="text-[10px]">{{ song.timeSignature }}</Badge>
                  <Badge variant="outline" class="text-[10px]">{{ song.tempo }} bpm</Badge>
                </div>
                <p class="text-[11px] text-paper/30 mt-2">
                  {{ song.measures.length }} {{ $t('page.builder-measures') }}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="opacity-0 group-hover:opacity-100 text-paper/40 hover:text-rose-300"
                :title="$t('page.builder-delete')"
                @click.stop="builder.deleteSong(song.id)"
              >
                <Trash2 :size="14" />
              </Button>
            </div>
          </li>
        </ul>
      </article>

      <!-- Editor -->
      <article v-else class="flex flex-col gap-4">
        <div class="rounded-xl border border-white/5 bg-ink-800/40 p-4 flex flex-wrap items-center gap-4 text-xs">
          <input
            v-model="titleModel"
            class="bg-transparent border-b border-white/10 focus:border-gold-400/40 outline-none text-paper font-display text-lg px-1 py-0.5 min-w-[200px]"
            :placeholder="$t('page.builder-title-placeholder')"
          >

          <div class="flex items-center gap-2">
            <span class="text-paper/40">{{ $t('page.builder-key') }}</span>
            <select
              v-model="keyModel"
              class="bg-ink-900 border border-white/10 rounded px-2 py-1 text-paper text-xs"
            >
              <option v-for="k in KEYS" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-paper/40">{{ $t('page.builder-time') }}</span>
            <select
              v-model="timeModel"
              class="bg-ink-900 border border-white/10 rounded px-2 py-1 text-paper text-xs"
            >
              <option v-for="t in TIMES" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-paper/40">{{ $t('page.builder-tempo') }}</span>
            <input
              v-model.number="tempoModel"
              type="number"
              min="30"
              max="240"
              class="bg-ink-900 border border-white/10 rounded px-2 py-1 text-paper text-xs w-16"
            >
            <span class="text-paper/40">bpm</span>
          </div>

          <div class="flex-1" />

          <Button
            v-if="!playback.isPlaying.value"
            size="sm"
            class="bg-aqua-400/15 text-aqua-200 hover:bg-aqua-400/25 border border-aqua-400/30"
            :disabled="!hasNotes"
            @click="onPlay"
          >
            <Play :size="14" />
            {{ $t('page.builder-play') }}
          </Button>
          <Button
            v-else
            size="sm"
            variant="outline"
            @click="playback.stop"
          >
            <Square :size="14" />
            {{ $t('page.builder-stop') }}
          </Button>

          <Button
            variant="outline"
            size="sm"
            :disabled="(builder.currentSong?.measures.length ?? 0) <= 1"
            @click="builder.removeLastMeasure(builder.currentSong!.id)"
          >
            <Minus :size="14" />
            {{ $t('page.builder-remove-measure') }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="builder.addMeasure(builder.currentSong!.id)"
          >
            <Plus :size="14" />
            {{ $t('page.builder-add-measure') }}
          </Button>
        </div>

        <div class="rounded-xl border border-white/5 bg-ink-900/40 p-4">
          <BuilderGrandStaff
            :measures="builder.currentSong.measures"
            :time-signature="builder.currentSong.timeSignature"
            :selected-measure-id="selectedMeasureId"
            :playing-measure-idx="playback.currentMeasureIdx.value"
            @select-measure="onSelectMeasure"
          />
        </div>

        <p class="text-[11px] text-paper/40 px-1">
          {{ $t('page.builder-coming-edit') }}
        </p>
      </article>
    </div>

    <BuilderMeasureSheet
      :open="sheetOpen"
      :measure="selectedMeasure"
      :measure-number="selectedMeasureNumber"
      :time-signature="builder.currentSong?.timeSignature ?? '4/4'"
      :duration="duration"
      :dotted="dotted"
      :accidental="accidental"
      :hand="hand"
      @update:open="sheetOpen = $event"
      @update:duration="duration = $event"
      @update:dotted="dotted = $event"
      @update:accidental="accidental = $event"
      @update:hand="hand = $event"
      @add-chord="onAddChord"
      @add-rest="onAddRest"
      @remove-slot="onRemoveSlot"
      @toggle-arpeggio="onToggleArpeggio"
      @move-slot="onMoveSlot"
      @update-slot="onUpdateSlot"
      @set-pickup="onSetPickup"
    />
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft, Minus, Play, Plus, Square, Trash2 } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import BuilderGrandStaff from '~/components/builder/BuilderGrandStaff.vue'
import BuilderMeasureSheet from '~/components/builder/BuilderMeasureSheet.vue'
import BuilderDriveMenu from '~/components/builder/BuilderDriveMenu.vue'
import BuilderSyncStatus from '~/components/builder/BuilderSyncStatus.vue'
import type { BuilderNote, Duration, Hand } from '~/stores/builder.store'

const builder = useBuilderStore()
const drive = useDriveStore()
const playback = useBuilderPlayback()
const { t } = useI18n()

useDriveSync()

const hasNotes = computed(() => {
  if (!builder.currentSong) return false
  return builder.currentSong.measures.some(m => m.treble.length > 0 || m.bass.length > 0)
})

function onPlay() {
  if (!builder.currentSong) return
  playback.play(builder.currentSong)
}

useHead({ title: 'Pianight · Builder' })

const KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'B♭', 'E♭', 'A♭']
const TIMES = ['4/4', '3/4', '6/8', '2/4']

const sheetOpen = ref(false)
const selectedMeasureId = ref<string | null>(null)

const duration = ref<Duration>('q')
const dotted = ref(false)
const accidental = ref<'sharp' | 'flat' | null>(null)
const hand = ref<Hand>('treble')

const selectedMeasure = computed(() => {
  if (!builder.currentSong || !selectedMeasureId.value) return null
  return builder.currentSong.measures.find(m => m.id === selectedMeasureId.value) ?? null
})

const selectedMeasureNumber = computed(() => {
  if (!builder.currentSong || !selectedMeasureId.value) return 0
  return builder.currentSong.measures.findIndex(m => m.id === selectedMeasureId.value) + 1
})

function onCreate() {
  builder.createSong({ title: t('page.builder-new-default') })
}

function onBack() {
  selectedMeasureId.value = null
  sheetOpen.value = false
  builder.selectSong(null)
}

function onSelectMeasure(id: string) {
  selectedMeasureId.value = id
  sheetOpen.value = true
}

watch(sheetOpen, (open) => {
  if (!open) selectedMeasureId.value = null
})

function onAddChord(payload: { hand: Hand, notes: BuilderNote[] }) {
  if (!builder.currentSong || !selectedMeasureId.value) return
  builder.addChordToMeasure(builder.currentSong.id, selectedMeasureId.value, payload.hand, payload.notes)
}

function onAddRest(payload: { hand: Hand }) {
  if (!builder.currentSong || !selectedMeasureId.value) return
  builder.addRestToMeasure(builder.currentSong.id, selectedMeasureId.value, payload.hand, duration.value)
}

function onToggleArpeggio(payload: { hand: Hand, slotIdx: number }) {
  if (!builder.currentSong || !selectedMeasureId.value) return
  builder.cycleSlotArpeggio(builder.currentSong.id, selectedMeasureId.value, payload.hand, payload.slotIdx)
}

function onMoveSlot(payload: { hand: Hand, from: number, to: number }) {
  if (!builder.currentSong || !selectedMeasureId.value) return
  builder.moveSlot(builder.currentSong.id, selectedMeasureId.value, payload.hand, payload.from, payload.to)
}

function onUpdateSlot(payload: { hand: Hand, slotIdx: number, notes: BuilderNote[] }) {
  if (!builder.currentSong || !selectedMeasureId.value) return
  builder.updateSlot(builder.currentSong.id, selectedMeasureId.value, payload.hand, payload.slotIdx, payload.notes)
}

function onSetPickup(beats: number | null) {
  if (!builder.currentSong || !selectedMeasureId.value) return
  builder.setMeasurePickup(builder.currentSong.id, selectedMeasureId.value, beats)
}

function onRemoveSlot(payload: { hand: Hand, slotIdx: number }) {
  if (!builder.currentSong || !selectedMeasureId.value) return
  const song = builder.currentSong
  const measure = song.measures.find(m => m.id === selectedMeasureId.value)
  if (!measure) return
  const slots = payload.hand === 'treble' ? measure.treble : measure.bass
  slots.splice(payload.slotIdx, 1)
  builder.updateSong(song.id, {})
}

const titleModel = computed({
  get: () => builder.currentSong?.title ?? '',
  set: v => builder.currentSong && builder.updateSong(builder.currentSong.id, { title: v })
})

const keyModel = computed({
  get: () => builder.currentSong?.keySignature ?? 'C',
  set: v => builder.currentSong && builder.updateSong(builder.currentSong.id, { keySignature: v })
})

const timeModel = computed({
  get: () => builder.currentSong?.timeSignature ?? '4/4',
  set: v => builder.currentSong && builder.updateSong(builder.currentSong.id, { timeSignature: v })
})

const tempoModel = computed({
  get: () => builder.currentSong?.tempo ?? 90,
  set: v => builder.currentSong && builder.updateSong(builder.currentSong.id, { tempo: Number(v) || 90 })
})
</script>
