<script setup lang="ts">
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<TabsTriggerProps & { class?: string }>()

const delegated = computed(() => {
  const { class: _, ...rest } = props
  return rest
})

const forwarded = useForwardProps(delegated)
</script>

<template>
  <TabsTrigger
    v-bind="forwarded"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-white/[0.06] data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      'text-muted-foreground hover:text-foreground',
      props.class
    )"
  >
    <slot />
  </TabsTrigger>
</template>
