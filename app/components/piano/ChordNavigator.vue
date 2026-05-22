<template>
  <Tabs
    :model-value="String(pianoStore.state.selectChordIndex)"
    class="w-full items-center"
    @update:model-value="onChange"
  >
    <div
      ref="scrollerEl"
      class="w-full overflow-x-auto scroll-elegant -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible"
      :style="{ scrollbarWidth: 'none' }"
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
  </Tabs>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

const pianoStore = usePianoStore()

const scrollerEl = ref<HTMLElement | null>(null)
const triggerRefs = ref<Record<number, HTMLElement | null>>({})

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

watch(() => pianoStore.state.selectChordIndex, () => nextTick(scrollActiveIntoView))
onMounted(() => nextTick(scrollActiveIntoView))
</script>

<style scoped>
div::-webkit-scrollbar {
  display: none;
}
</style>
