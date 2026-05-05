<template>
  <section class="px-6 lg:px-10 py-6 lg:py-8">
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

      <article class="px-2">
        <div class="overflow-x-auto scroll-elegant -mx-2 px-2">
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

      <article class="px-2">
        <div class="overflow-x-auto scroll-elegant -mx-2 px-2">
          <div class="flex gap-1 mx-auto" :style="{ width: 'fit-content' }">
            <PianoKeyboardOctave
              v-for="oct in [2, 3, 4, 5]"
              :key="oct"
              :octave="oct"
              :selected-midis="highlightedMidi !== null ? [highlightedMidi] : []"
              @toggle-white="onPianoNote"
              @toggle-black="onPianoNote"
            />
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
})

const highlighted = ref<StaffNote | null>(null)
const highlightedMidi = computed(() => highlighted.value?.midi ?? null)

function setHighlight(note: StaffNote | null) {
  highlighted.value = note
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
