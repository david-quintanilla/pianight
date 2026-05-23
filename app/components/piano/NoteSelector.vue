<template>
  <div class="relative w-full px-10 md:px-0">
    <div
      ref="scrollerEl"
      class="w-full overflow-x-auto scroll-hidden md:overflow-visible"
    >
      <div class="inline-flex md:flex md:flex-wrap md:justify-center gap-1.5 py-1 whitespace-nowrap">
        <button
          v-for="noteItem in note.noteList.value"
          :key="noteItem.id"
          :ref="(el) => setItemRef(el as HTMLElement | null, noteItem.id)"
          type="button"
          :aria-pressed="noteItem.id === pianoStore.state.selectedNote.id"
          class="font-display tracking-wide h-10 px-4 min-w-[52px] rounded-lg shrink-0 inline-flex items-center justify-center text-sm transition-colors"
          :class="noteItem.id === pianoStore.state.selectedNote.id
            ? 'bg-gradient-to-b from-aqua-400/15 to-aqua-500/5 text-aqua-100 ring-1 ring-aqua-400/30'
            : 'text-paper/65 hover:text-paper'"
          @click="onSelect(noteItem.id)"
        >
          {{ noteItem.name }}
        </button>
      </div>
    </div>

    <!-- Flechas laterales (mobile), por fuera del scroller -->
    <div
      class="md:hidden absolute inset-y-0 left-0 flex items-center transition-all duration-300"
      :class="canScrollLeft
        ? 'opacity-100 translate-x-0 pointer-events-auto'
        : 'opacity-0 translate-x-1 pointer-events-none'"
    >
      <button
        type="button"
        class="note-arrow"
        :aria-label="$t('page.notes-prev')"
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
        class="note-arrow"
        :aria-label="$t('page.notes-next')"
        @click="step(1)"
      >
        <ChevronRight :size="16" :stroke-width="2.25" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const pianoStore = usePianoStore()
const note = useNotes()

const scrollerEl = ref<HTMLElement | null>(null)
const itemRefs = ref<Record<number, HTMLElement | null>>({})
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function setItemRef(el: HTMLElement | null, id: number) {
  itemRefs.value[id] = el
}

function onSelect(id: number) {
  const found = note.noteList.value.find(n => n.id === id)
  if (found) pianoStore.state.selectedNote = found
}

function scrollActiveIntoView() {
  const scroller = scrollerEl.value
  const target = itemRefs.value[pianoStore.state.selectedNote.id]
  if (!scroller || !target) return
  if (scroller.scrollWidth <= scroller.clientWidth) return
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
  const list = note.noteList.value
  const currentIdx = list.findIndex(n => n.id === pianoStore.state.selectedNote.id)
  const nextIdx = Math.max(0, Math.min(list.length - 1, currentIdx + direction))
  if (nextIdx === currentIdx) return
  const next = list[nextIdx]
  if (next) pianoStore.state.selectedNote = next
}

watch(() => pianoStore.state.selectedNote.id, () => nextTick(() => {
  scrollActiveIntoView()
  updateScrollHints()
}))

onMounted(() => {
  nextTick(() => {
    scrollActiveIntoView()
    updateScrollHints()
  })
})
</script>

<style scoped>
.note-arrow {
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
  cursor: pointer;
  transition: transform 120ms ease-out, background 120ms ease-out;
}

.note-arrow:active {
  transform: scale(0.92);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.3), rgba(34, 211, 238, 0.08));
}

.note-arrow + button,
button:focus-visible {
  outline: none;
}
</style>
