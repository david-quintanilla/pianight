<template>
  <div>
    <header class="py-2 px-8 flex justify-between bg-cyan-400">
      <h1 class="text-black text-2xl font-extrabold">
        Pianight
      </h1>
      <USelect
        v-model="currentLocale"
        :items="items"
        class="w-16"
        @change="i18n.setLocale(currentLocale)"
      />
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n'

const i18n = useI18n()
const items = computed(() => i18n.locales.value.map(locale => locale.code))
const currentLocale = ref<Locale>(i18n.locale.value)
</script>