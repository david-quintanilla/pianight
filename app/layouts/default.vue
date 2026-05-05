<template>
  <div class="min-h-screen bg-ink-950">
    <header class="sticky top-0 z-50 backdrop-blur-md bg-ink-950/80 border-b border-white/5">
      <div class="max-w-[1600px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between gap-6">
        <NuxtLink
          to="/"
          class="font-display text-xl font-semibold tracking-tight text-paper hover:text-aqua-200 transition"
        >
          Pianight<span class="text-aqua-400">.</span>
        </NuxtLink>

        <nav class="flex items-center gap-1">
          <NuxtLink
            v-for="item in menu"
            :key="item.route"
            :to="item.route"
            class="px-4 py-1.5 rounded-md text-sm font-medium transition"
            :class="item.isActive
              ? 'text-paper bg-white/5'
              : 'text-cyan-100/55 hover:text-paper hover:bg-white/[0.03]'"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2">
          <button
            v-for="locale in i18n.locales.value"
            :key="locale.code"
            class="text-xs px-2 py-1 rounded transition uppercase tracking-wider font-medium"
            :class="i18n.locale.value === locale.code
              ? 'text-aqua-300'
              : 'text-cyan-100/40 hover:text-paper'"
            @click="i18n.setLocale(locale.code)"
          >
            {{ locale.code }}
          </button>
        </div>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const i18n = useI18n()
const route = useRoute()

const menu = computed(() => [
  {
    label: i18n.t('chords'),
    route: '/',
    isActive: route.path === '/'
  },
  {
    label: i18n.t('staves'),
    route: '/staves',
    isActive: route.path.includes('/staves')
  }
])
</script>
