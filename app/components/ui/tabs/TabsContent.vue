<script setup lang="ts">
import { TabsContent, type TabsContentProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<TabsContentProps & { class?: string }>()

const delegated = computed(() => {
  const { class: _, ...rest } = props
  return rest
})
</script>

<template>
  <TabsContent
    v-bind="delegated"
    :class="cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', props.class)"
  >
    <slot />
  </TabsContent>
</template>
