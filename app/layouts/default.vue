<template>
  <div class="min-h-screen bg-ink-950">
    <header class="sticky top-0 z-50 backdrop-blur-md bg-ink-950/70">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between gap-4 md:gap-10">

        <!-- Logo lockup -->
        <NuxtLink to="/" class="shrink-0 logo-wrap">
          <span class="logo-word font-display text-[22px] font-semibold tracking-tight leading-none">
            Pianight
          </span>
        </NuxtLink>

        <!-- Nav con indicador deslizante dorado (desktop / tablet) -->
        <nav
          ref="navEl"
          class="relative hidden md:flex items-center gap-1"
        >
          <span
            class="absolute top-1/2 -translate-y-1/2 h-9 rounded-full bg-gradient-to-b from-gold-400/15 to-gold-500/[0.06] border border-gold-400/20 transition-all duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            :style="indicatorStyle"
          />
          <NuxtLink
            v-for="item in menu"
            :key="item.route"
            :ref="(el) => itemRefs[item.route] = el as ComponentPublicInstance | null"
            :to="item.route"
            class="relative z-10 px-5 h-9 inline-flex items-center font-display text-[15px] font-medium tracking-tight transition-colors duration-200"
            :class="item.isActive
              ? 'text-gold-200'
              : 'text-paper/65 hover:text-paper'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Idioma -->
        <div class="flex items-center shrink-0">
          <button
            v-for="(locale, i) in i18n.locales.value"
            :key="locale.code"
            class="relative h-8 px-3 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-200"
            :class="[
              i18n.locale.value === locale.code ? 'text-gold-300' : 'text-paper/40 hover:text-paper/80',
              i > 0 ? 'border-l border-white/[0.08]' : ''
            ]"
            @click="i18n.setLocale(locale.code)"
          >
            {{ locale.code }}
          </button>
        </div>

      </div>

      <span
        aria-hidden="true"
        class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent"
      />
    </header>

    <main class="pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
      <slot />
    </main>

    <!-- Bottom tab bar (solo mobile) -->
    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-ink-950/85 border-t border-white/[0.06]"
      :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
    >
      <ul class="grid grid-cols-3 h-16">
        <li
          v-for="item in menu"
          :key="item.route"
        >
          <NuxtLink
            :to="item.route"
            class="relative h-full flex flex-col items-center justify-center gap-1 transition-colors duration-200"
            :class="item.isActive ? 'text-gold-200' : 'text-paper/55 hover:text-paper'"
          >
            <span
              v-if="item.isActive"
              aria-hidden="true"
              class="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[2px] rounded-full bg-gradient-to-r from-transparent via-gold-400/80 to-transparent"
            />
            <component :is="item.icon" :size="20" :stroke-width="1.75" />
            <span class="font-display text-[11px] tracking-tight leading-none">
              {{ item.label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.logo-word {
  background: linear-gradient(
    100deg,
    #f4f1ea 0%,
    #fcd34d 40%,
    #f4f1ea 60%,
    #67e8f9 100%
  );
  background-size: 200% 100%;
  background-position: 0% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: shimmer 8s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
</style>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { Music2, AudioLines, PencilLine } from 'lucide-vue-next'

const i18n = useI18n()
const route = useRoute()

const menu = computed(() => [
  {
    label: i18n.t('chords'),
    route: '/',
    icon: Music2,
    isActive: route.path === '/'
  },
  {
    label: i18n.t('staves'),
    route: '/staves',
    icon: AudioLines,
    isActive: route.path.includes('/staves')
  },
  {
    label: i18n.t('builder'),
    route: '/builder',
    icon: PencilLine,
    isActive: route.path.includes('/builder')
  }
])

const navEl = ref<HTMLElement | null>(null)
const itemRefs = ref<Record<string, ComponentPublicInstance | null>>({})
const indicatorStyle = ref({ left: '0px', width: '0px', opacity: '0' })

function updateIndicator() {
  const active = menu.value.find(i => i.isActive)
  if (!active) {
    indicatorStyle.value = { ...indicatorStyle.value, opacity: '0' }
    return
  }
  const target = itemRefs.value[active.route]?.$el as HTMLElement | undefined
  const nav = navEl.value
  if (!target || !nav) return
  const navRect = nav.getBoundingClientRect()
  const rect = target.getBoundingClientRect()
  indicatorStyle.value = {
    left: `${rect.left - navRect.left}px`,
    width: `${rect.width}px`,
    opacity: '1'
  }
}

onMounted(() => nextTick(updateIndicator))
watch(() => route.path, () => nextTick(updateIndicator))
</script>
