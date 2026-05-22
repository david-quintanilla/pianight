<template>
  <section class="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
    <div class="max-w-[1600px] mx-auto flex flex-col gap-6">
      <header class="flex items-center justify-end gap-2 text-xs">
        <Sheet>
          <SheetTrigger
            class="px-3 py-2 rounded-lg border border-white/5 hover:border-white/10 text-cyan-100/70 hover:text-paper transition flex items-center gap-2 bg-ink-800/40"
          >
            <BookOpen :size="14" />
            {{ $t('symbol-glossary.title') }}
          </SheetTrigger>
          <SheetContent side="right" class="w-full sm:max-w-md p-0">
            <SheetHeader class="sr-only">
              <SheetTitle>{{ $t('symbol-glossary.title') }}</SheetTitle>
              <SheetDescription>{{ $t('symbol-glossary.description') }}</SheetDescription>
            </SheetHeader>
            <StavesSymbolGlossary />
          </SheetContent>
        </Sheet>

        <button
          class="px-3 py-2 rounded-lg border border-white/5 hover:border-white/10 text-cyan-100/70 hover:text-paper transition flex items-center gap-2"
          :class="soundEnabled ? 'bg-aqua-400/5 text-aqua-200 border-aqua-400/20' : 'bg-ink-800/40'"
          @click="soundEnabled = !soundEnabled"
        >
          <Volume2 v-if="soundEnabled" :size="14" />
          <VolumeX v-else :size="14" />
          {{ soundEnabled ? $t('page.staves-sound') : $t('page.staves-mute') }}
        </button>
      </header>

      <article>
        <div
          ref="staffScrollerEl"
          class="overflow-x-auto scroll-elegant -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10"
        >
          <StavesGrandStaff
            :treble-notes="trebleNotes"
            :bass-notes="bassNotes"
            :highlighted="highlighted"
            :sound-enabled="soundEnabled"
            @hover="setHighlight"
            @select="setHighlight"
          />
        </div>
      </article>

      <article>
        <div
          ref="pianoScrollerEl"
          class="overflow-x-auto scroll-elegant -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10"
        >
          <div class="flex gap-1 md:mx-auto" :style="{ width: 'fit-content' }">
            <div
              v-for="oct in [2, 3, 4, 5]"
              :key="oct"
              :ref="(el) => setOctaveRef(el, oct)"
            >
              <PianoKeyboardOctave
                :octave="oct"
                :selected-midis="highlightedMidi !== null ? [highlightedMidi] : []"
                @toggle-white="onPianoNote"
                @toggle-black="onPianoNote"
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BookOpen, Volume2, VolumeX } from 'lucide-vue-next'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '~/components/ui/sheet'
import type { StaffNote } from '~/composables/useStaff'

const { trebleNotes, bassNotes, buildNote, buildSharp } = useStaff()
const { preload, playMidi } = useAudio()

const soundEnabled = ref(true)

onMounted(() => {
  preload()
  nextTick(() => {
    centerPianoOnOctave(4)
  })
})

const highlighted = ref<StaffNote | null>(null)
const highlightedMidi = computed(() => highlighted.value?.midi ?? null)

const staffScrollerEl = ref<HTMLElement | null>(null)
const pianoScrollerEl = ref<HTMLElement | null>(null)
const octaveRefs = ref<Record<number, HTMLElement | null>>({})

function setOctaveRef(el: Element | null, octave: number) {
  octaveRefs.value[octave] = (el as HTMLElement | null)
}

function centerElementInScroller(scroller: HTMLElement | null, target: HTMLElement | null) {
  if (!scroller || !target) return
  if (scroller.scrollWidth <= scroller.clientWidth) return
  const sRect = scroller.getBoundingClientRect()
  const tRect = target.getBoundingClientRect()
  const offset = (tRect.left - sRect.left) - (sRect.width - tRect.width) / 2
  scroller.scrollTo({ left: scroller.scrollLeft + offset, behavior: 'smooth' })
}

function centerPianoOnOctave(octave: number) {
  centerElementInScroller(pianoScrollerEl.value, octaveRefs.value[octave] ?? null)
}

function centerStaffOnNote(note: StaffNote) {
  const scroller = staffScrollerEl.value
  if (!scroller) return
  const target = scroller.querySelector<SVGGElement>(`g[data-step="${note.step}"]`)
  if (!target) return
  centerElementInScroller(scroller, target as unknown as HTMLElement)
}

function setHighlight(note: StaffNote | null) {
  highlighted.value = note
  if (note) {
    nextTick(() => {
      centerPianoOnOctave(note.octave)
      centerStaffOnNote(note)
    })
  }
}

type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'

function onPianoNote(payload: { letter: Letter, octave: number, midi: number }) {
  const isSharp = payload.midi !== buildNote(payload.letter, payload.octave).midi
  const note = isSharp
    ? buildSharp(payload.letter, payload.octave)
    : buildNote(payload.letter, payload.octave)
  setHighlight(note)
  if (soundEnabled.value) playMidi(note.midi, 1500)
}
</script>
