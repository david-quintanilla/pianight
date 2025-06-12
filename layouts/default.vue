<template>
  <div>
    <header class="p-4 flex justify-between bg-cyan-400">
      <h1 class="text-black text-2xl font-extrabold">
        Pianight
      </h1>
      <USelect
        v-model="value"
        :items="items"
        class="w-20"
        @change="i18n.setLocale(value)"
      />
    </header>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n'

const i18n = useI18n()
const items = computed(() => i18n.locales.value.map(locale => locale.code))
const value = ref<Locale>('es')
</script>