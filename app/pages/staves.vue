<template>
  <section class="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
    <div class="max-w-[1600px] mx-auto flex flex-col gap-6">
      <header class="flex items-center justify-end gap-2 text-xs">
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

      <article
        class="-mx-4 sm:-mx-6 lg:-mx-10 transition-opacity duration-200"
        :class="layoutReady ? 'opacity-100' : 'opacity-0'"
      >
        <StavesGrandStaff
          :treble-notes="trebleNotes"
          :bass-notes="bassNotes"
          :highlighted="highlighted"
          :sound-enabled="soundEnabled"
          :focus-octave="focusOctave"
          @hover="setHighlight"
          @select="setHighlight"
        />
      </article>

      <article class="relative md:max-w-none">
        <div class="max-w-[320px] mx-auto md:max-w-none">
          <div
            ref="pianoScrollerEl"
            class="overflow-x-auto scroll-hidden"
            @scroll.passive="onPianoScroll"
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
        </div>

        <!-- Hint de scroll lateral, fuera del scroller para no pisar las teclas -->
        <div
          class="md:hidden absolute inset-y-0 -left-3 flex items-center transition-all duration-300"
          :class="canScrollLeft
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 translate-x-1 pointer-events-none'"
        >
          <button
            type="button"
            class="scroll-hint"
            :aria-label="$t('page.staves-prev-octave')"
            @click="scrollOctave(-1)"
          >
            <ChevronLeft :size="16" :stroke-width="2.25" />
          </button>
        </div>
        <div
          class="md:hidden absolute inset-y-0 -right-3 flex items-center transition-all duration-300"
          :class="canScrollRight
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 -translate-x-1 pointer-events-none'"
        >
          <button
            type="button"
            class="scroll-hint"
            :aria-label="$t('page.staves-next-octave')"
            @click="scrollOctave(1)"
          >
            <ChevronRight :size="16" :stroke-width="2.25" />
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-vue-next'
import type { StaffNote } from '~/composables/useStaff'

const { trebleNotes, bassNotes, buildNote, buildSharp } = useStaff()
const { preload, playMidi } = useAudio()

const soundEnabled = ref(true)

const isMobile = ref(false)
const layoutReady = ref(false)
let mql: MediaQueryList | null = null

onMounted(() => {
  preload()
  mql = window.matchMedia('(max-width: 767px)')
  isMobile.value = mql.matches
  mql.addEventListener('change', onMqChange)
  nextTick(() => {
    centerPianoOnOctave(4)
    activeOctave.value = 4
    updateScrollHints()
    layoutReady.value = true
  })
})

onBeforeUnmount(() => {
  mql?.removeEventListener('change', onMqChange)
})

function onMqChange(e: MediaQueryListEvent) {
  isMobile.value = e.matches
}

const highlighted = ref<StaffNote | null>(null)
const highlightedMidi = computed(() => highlighted.value?.midi ?? null)

const activeOctave = ref(4)
const focusOctave = computed(() => isMobile.value ? activeOctave.value : null)

const pianoScrollerEl = ref<HTMLElement | null>(null)
const octaveRefs = ref<Record<number, HTMLElement | null>>({})
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function updateScrollHints() {
  const s = pianoScrollerEl.value
  if (!s) return
  canScrollLeft.value = s.scrollLeft > 2
  canScrollRight.value = s.scrollLeft + s.clientWidth < s.scrollWidth - 2
}

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

const OCTAVE_RANGE = [2, 3, 4, 5] as const

function scrollOctave(direction: -1 | 1) {
  const idx = OCTAVE_RANGE.indexOf(activeOctave.value as typeof OCTAVE_RANGE[number])
  const next = OCTAVE_RANGE[Math.max(0, Math.min(OCTAVE_RANGE.length - 1, idx + direction))]
  if (next === undefined || next === activeOctave.value) return
  activeOctave.value = next
  centerPianoOnOctave(next)
}

function setHighlight(note: StaffNote | null) {
  highlighted.value = note
  if (note) {
    activeOctave.value = note.octave
    nextTick(() => centerPianoOnOctave(note.octave))
  }
}

let scrollDebounce: ReturnType<typeof setTimeout> | null = null

function onPianoScroll() {
  updateScrollHints()
  if (scrollDebounce) clearTimeout(scrollDebounce)
  scrollDebounce = setTimeout(() => {
    const scroller = pianoScrollerEl.value
    if (!scroller) return
    const sRect = scroller.getBoundingClientRect()
    const center = sRect.left + sRect.width / 2
    let closestOctave = activeOctave.value
    let closestDist = Infinity
    for (const [oct, el] of Object.entries(octaveRefs.value)) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const c = r.left + r.width / 2
      const d = Math.abs(c - center)
      if (d < closestDist) {
        closestDist = d
        closestOctave = Number(oct)
      }
    }
    activeOctave.value = closestOctave
  }, 80)
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

<style scoped>
.scroll-hint {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  color: var(--color-aqua-200);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.18), rgba(34, 211, 238, 0.04));
  border: 1px solid rgba(34, 211, 238, 0.35);
  box-shadow:
    0 0 0 1px rgba(7, 8, 12, 0.5) inset,
    0 4px 14px rgba(34, 211, 238, 0.12);
  backdrop-filter: blur(6px);
  animation: hint-breath 2.6s ease-in-out infinite;
  cursor: pointer;
  transition: transform 120ms ease-out, background 120ms ease-out;
}

.scroll-hint:active {
  transform: scale(0.92);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.08));
}

@keyframes hint-breath {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(7, 8, 12, 0.5) inset,
      0 4px 14px rgba(34, 211, 238, 0.12);
    transform: scale(1);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(7, 8, 12, 0.5) inset,
      0 4px 22px rgba(34, 211, 238, 0.28);
    transform: scale(1.05);
  }
}
</style>
