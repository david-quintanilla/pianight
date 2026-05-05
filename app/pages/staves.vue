<template>
  <section class="min-h-[calc(100vh-3rem)] px-6 lg:px-10 py-8 lg:py-12">
    <div class="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
      <!-- Columna principal -->
      <div class="flex flex-col gap-10 min-w-0">
        <header class="flex flex-wrap items-end justify-between gap-6">
          <div class="space-y-3">
            <p class="text-[11px] uppercase tracking-[0.18em] text-aqua-300/60 font-medium">
              {{ $t('page.staves-label') }}
            </p>
            <h1 class="font-display text-4xl lg:text-5xl font-semibold tracking-tight text-paper leading-[1.05]">
              {{ $t('page.staves-title') }}
            </h1>
            <p class="text-sm text-cyan-100/55 max-w-xl leading-relaxed">
              {{ $t('page.staves-description') }}
            </p>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <button
              class="px-3 py-2 rounded-lg border border-white/5 hover:border-white/10 text-cyan-100/70 hover:text-paper transition flex items-center gap-2"
              :class="soundEnabled ? 'bg-aqua-400/5 text-aqua-200 border-aqua-400/20' : 'bg-ink-800/40'"
              @click="soundEnabled = !soundEnabled"
            >
              <Volume2 v-if="soundEnabled" :size="14" />
              <VolumeX v-else :size="14" />
              {{ soundEnabled ? $t('page.staves-sound') : $t('page.staves-mute') }}
            </button>
          </div>
        </header>

        <article class="bg-ink-900/40 border border-white/5 rounded-2xl p-6 lg:p-10 backdrop-blur">
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

        <article class="bg-ink-900/40 border border-white/5 rounded-2xl p-6 lg:p-8 backdrop-blur">
          <div class="overflow-x-auto scroll-elegant -mx-2 px-2">
            <StavesStaffPiano
              :whites="pianoWhites"
              :highlighted="highlighted"
              :sound-enabled="soundEnabled"
              @hover="setHighlight"
              @select="setHighlight"
            />
          </div>
        </article>
      </div>

      <!-- Sidebar simbología -->
      <div class="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
        <StavesSymbolGlossary />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Volume2, VolumeX } from 'lucide-vue-next'
import type { StaffNote } from '~/composables/useStaff'

const { buildNote, trebleNotes, bassNotes } = useStaff()
const { preload } = useAudio()

const soundEnabled = ref(true)

onMounted(() => {
  preload()
})
const highlighted = ref<StaffNote | null>(null)

const pianoWhites = computed(() => {
  const letters: ('C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B')[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  const result: StaffNote[] = []
  for (const octave of [3, 4]) {
    for (const letter of letters) {
      result.push(buildNote(letter, octave))
    }
  }
  result.push(buildNote('C', 5))
  return result
})

function setHighlight(note: StaffNote | null) {
  highlighted.value = note
}
</script>
