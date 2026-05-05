<template>
  <Tabs
    :model-value="String(pianoStore.state.selectChordIndex)"
    class="w-full items-center"
    @update:model-value="onChange"
  >
    <TabsList class="flex-wrap h-auto gap-1 bg-transparent border-0 p-0">
      <TabsTrigger
        v-for="(chord, index) in pianoStore.compute.chordTypes"
        :key="chord.prefix"
        :value="String(index)"
        class="font-display tracking-wide px-3.5 py-1.5 text-sm rounded-md text-cyan-100/55 hover:text-paper data-[state=active]:bg-white/[0.05] data-[state=active]:text-gold-300 data-[state=active]:ring-1 data-[state=active]:ring-gold-400/20 data-[state=active]:shadow-[0_0_12px_rgba(245,185,66,0.08)]"
      >
        {{ chord.label }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

const pianoStore = usePianoStore()

function onChange(value: string | number | undefined) {
  if (value === undefined || value === '') return
  const idx = Number(value)
  if (!Number.isNaN(idx)) pianoStore.state.selectChordIndex = idx
}
</script>
