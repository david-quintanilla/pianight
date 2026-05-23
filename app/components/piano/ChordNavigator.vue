<template>
  <Tabs
    :model-value="String(pianoStore.state.selectChordIndex)"
    class="w-full items-center"
    @update:model-value="onChange"
  >
    <div class="relative w-full px-10 md:px-0">
      <div
        ref="scrollerEl"
        class="w-full overflow-x-auto scroll-hidden md:overflow-visible"
        @scroll.passive="updateScrollHints"
      >
        <TabsList class="inline-flex md:flex md:flex-wrap h-auto gap-1.5 bg-transparent border-0 p-0 whitespace-nowrap py-1">
          <TabsTrigger
            v-for="(chord, index) in pianoStore.compute.chordTypes"
            :key="chord.prefix"
            :ref="(el) => setTriggerRef(el, index)"
            :value="String(index)"
            class="font-display tracking-wide px-4 h-10 min-w-[52px] text-sm rounded-lg text-cyan-100/55 hover:text-paper data-[state=active]:bg-white/[0.05] data-[state=active]:text-gold-300 data-[state=active]:ring-1 data-[state=active]:ring-gold-400/20 data-[state=active]:shadow-[0_0_12px_rgba(245,185,66,0.08)] shrink-0 inline-flex items-center justify-center"
          >
            {{ chord.label }}
          </TabsTrigger>
        </TabsList>
      </div>

      <!-- Flechas laterales (mobile) -->
      <div
        class="md:hidden absolute inset-y-0 left-0 flex items-center transition-all duration-300"
        :class="canScrollLeft
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 translate-x-1 pointer-events-none'"
      >
        <button
          type="button"
          class="chord-arrow"
          :aria-label="$t('page.chords-prev-variant')"
          @click="step(-1)"
        >
          <ChevronLeft :size="16" :stroke-width="2.25" />
        </button>
      </div>
      <div
        class="md:hidden absolute inset-y-0 right-0 flex items-center transition-all duration-300"
        :class="canScrollRight
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 -translate-x-1 pointer-events-none'"
      >
        <button
          type="button"
          class="chord-arrow"
          :aria-label="$t('page.chords-next-variant')"
          @click="step(1)"
        >
          <ChevronRight :size="16" :stroke-width="2.25" />
        </button>
      </div>
    </div>
  </Tabs>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

const pianoStore = usePianoStore()

const scrollerEl = ref<HTMLElement | null>(null)
const triggerRefs = ref<Record<number, HTMLElement | null>>({})
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function setTriggerRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (!el) {
    triggerRefs.value[index] = null
    return
  }
  triggerRefs.value[index] = (el as ComponentPublicInstance).$el as HTMLElement ?? (el as HTMLElement)
}

function onChange(value: string | number | undefined) {
  if (value === undefined || value === '') return
  const idx = Number(value)
  if (!Number.isNaN(idx)) pianoStore.state.selectChordIndex = idx
}

function scrollActiveIntoView() {
  const scroller = scrollerEl.value
  const target = triggerRefs.value[pianoStore.state.selectChordIndex]
  if (!scroller || !target) return
  const sRect = scroller.getBoundingClientRect()
  const tRect = target.getBoundingClientRect()
  const offset = (tRect.left - sRect.left) - (sRect.width - tRect.width) / 2
  scroller.scrollTo({ left: scroller.scrollLeft + offset, behavior: 'smooth' })
}

function updateScrollHints() {
  const s = scrollerEl.value
  if (!s) return
  canScrollLeft.value = s.scrollLeft > 2
  canScrollRight.value = s.scrollLeft + s.clientWidth < s.scrollWidth - 2
}

function step(direction: -1 | 1) {
  const total = pianoStore.compute.chordTypes.length
  const next = Math.max(0, Math.min(total - 1, pianoStore.state.selectChordIndex + direction))
  if (next === pianoStore.state.selectChordIndex) return
  pianoStore.state.selectChordIndex = next
}

watch(() => pianoStore.state.selectChordIndex, () => nextTick(() => {
  scrollActiveIntoView()
  updateScrollHints()
}))
onMounted(() => nextTick(() => {
  scrollActiveIntoView()
  updateScrollHints()
}))
</script>

<style scoped>
.chord-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  color: var(--color-gold-200);
  background: linear-gradient(135deg, rgba(245, 185, 66, 0.18), rgba(245, 185, 66, 0.04));
  border: 1px solid rgba(245, 185, 66, 0.35);
  box-shadow:
    0 0 0 1px rgba(7, 8, 12, 0.5) inset,
    0 4px 14px rgba(245, 185, 66, 0.12);
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: transform 120ms ease-out, background 120ms ease-out;
}

.chord-arrow:active {
  transform: scale(0.92);
  background: linear-gradient(135deg, rgba(245, 185, 66, 0.3), rgba(245, 185, 66, 0.08));
}
</style>
