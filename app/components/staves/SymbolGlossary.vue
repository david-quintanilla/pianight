<template>
  <aside class="flex flex-col h-full bg-ink-900/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur">
    <header class="px-6 py-5 border-b border-white/5">
      <h2 class="font-display text-xl font-semibold tracking-tight text-paper">
        Simbología
      </h2>
      <p class="text-xs text-cyan-100/40 mt-1 leading-relaxed">
        El vocabulario para leer una partitura
      </p>

      <div class="relative mt-4">
        <input
          v-model="query"
          type="text"
          placeholder="Buscar símbolo…"
          class="w-full bg-ink-800 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm text-paper placeholder:text-cyan-100/30 focus:outline-none focus:border-aqua-400/40 focus:bg-ink-800 transition"
        >
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-100/40"
          :size="14"
        />
      </div>
    </header>

    <div class="flex-1 overflow-y-auto scroll-elegant">
      <div
        v-for="cat in filteredCategories"
        :key="cat.id"
        class="border-b border-white/5 last:border-b-0"
      >
        <button
          class="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-white/[0.02] transition group"
          @click="toggle(cat.id)"
        >
          <span class="font-display text-sm font-medium tracking-wide text-paper/90 uppercase" style="letter-spacing: 0.08em">
            {{ cat.label }}
          </span>
          <ChevronDown
            :size="14"
            class="text-cyan-100/40 transition-transform"
            :class="isOpen(cat.id) ? 'rotate-180' : ''"
          />
        </button>

        <div
          v-if="isOpen(cat.id)"
          class="px-3 pb-3 space-y-px"
        >
          <button
            v-for="sym in cat.symbols"
            :key="sym.id"
            class="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-left hover:bg-white/[0.03] transition group"
            :class="active?.id === sym.id ? 'bg-aqua-400/5 ring-1 ring-aqua-400/20' : ''"
            @click="setActive(sym)"
          >
            <span
              class="font-music text-paper/90 w-9 text-center flex-shrink-0"
              :class="active?.id === sym.id ? 'text-aqua-300' : ''"
              :style="{ fontSize: '26px', lineHeight: '1' }"
            >{{ sym.glyph }}</span>
            <span class="flex-1 min-w-0">
              <span class="block font-display text-[13px] font-medium text-paper/95 leading-tight truncate">
                {{ sym.name }}
              </span>
              <span class="block text-[11px] text-cyan-100/45 leading-tight mt-0.5 truncate">
                {{ sym.meaning }}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div
        v-if="filteredCategories.length === 0"
        class="px-6 py-12 text-center text-sm text-cyan-100/30"
      >
        Sin resultados
      </div>
    </div>

    <footer
      v-if="active"
      class="border-t border-white/5 px-6 py-5 bg-ink-800/40"
    >
      <div class="flex items-start gap-5">
        <span
          class="font-music text-aqua-300 flex-shrink-0"
          :style="{ fontSize: '54px', lineHeight: '1' }"
        >{{ active.glyph }}</span>
        <div class="min-w-0">
          <h3 class="font-display text-base font-semibold text-paper tracking-tight">
            {{ active.name }}
          </h3>
          <p class="text-xs text-cyan-100/60 leading-relaxed mt-1.5">
            {{ active.meaning }}
          </p>
        </div>
      </div>
    </footer>
  </aside>
</template>

<script lang="ts" setup>
import { Search, ChevronDown } from 'lucide-vue-next'
import type { MusicSymbol } from '~/composables/useSymbols'

const { categories } = useSymbols()

const query = ref('')
const open = ref<Set<string>>(new Set(categories.map(c => c.id)))
const active = ref<MusicSymbol | null>(null)

const filteredCategories = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return categories
  return categories
    .map(cat => ({
      ...cat,
      symbols: cat.symbols.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q)
      )
    }))
    .filter(cat => cat.symbols.length > 0)
})

function isOpen(id: string): boolean {
  return open.value.has(id) || query.value.trim().length > 0
}

function toggle(id: string) {
  if (open.value.has(id)) open.value.delete(id)
  else open.value.add(id)
}

function setActive(sym: MusicSymbol) {
  active.value = active.value?.id === sym.id ? null : sym
}
</script>
