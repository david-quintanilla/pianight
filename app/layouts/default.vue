<template>
  <div>
    <header class="py-2 px-4 h-12 flex bg-cyan-400 text-black sticky top-0 z-100">
      <h1 class="text-2xl font-extrabold">
        Pianight
      </h1>
      <ul class="flex gap-8 font-semibold flex-1 items-center justify-center cursor-pointer">
        <li
          v-for="(item, index) in menu"
          :key="index"
          class="hover:bg-black hover:text-amber-50 transition-all px-4 py-1 rounded"
          :class="item.isActive ? 'bg-black text-amber-50' : ''"
        >
          <a :href="item.route">
            {{ item.label }}
          </a>
        </li>
      </ul>
      <USelect
        v-model="currentLocale"
        :items="items"
        class="w-16 flex justify-self-end"
        @change="i18n.setLocale(currentLocale)"
      />
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n'

const i18n = useI18n()
const currentLocale = ref<Locale>(i18n.locale.value)
const route = useRoute()
const items = computed(() => i18n.locales.value.map(locale => locale.code))

const menu = computed(() => [
  {
    label: i18n.t('chords'),
    route: '/',
    isActive: route.path === '/'
  },
  {
    label: i18n.t('staves-and-note-values'),
    route: '/staves-and-note-values',
    isActive: route.path === '/staves-and-note-values'
  },
  // {
  //   label: i18n.t('expressions-and-symbols'),
  //   route: '/expressions-and-symbols',
  //   isActive: route.path === '/expressions-and-symbols'
  // }
])
</script>