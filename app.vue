<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import mixpanel from 'mixpanel-browser'

mixpanel.init('05b7a75a246691059250585c8e3a2432')

mixpanel.track('screen', {
  name: 'pagina principal'
})

useHead({
  title: 'Pianight',
  htmlAttrs: {
    lang: 'es'
  }
})
</script>
