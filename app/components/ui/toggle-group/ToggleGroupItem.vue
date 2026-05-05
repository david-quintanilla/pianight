<script setup lang="ts">
import { ToggleGroupItem, type ToggleGroupItemProps, useForwardProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<ToggleGroupItemProps & { class?: string }>()

const delegated = computed(() => {
  const { class: _, ...rest } = props
  return rest
})

const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToggleGroupItem
    v-bind="forwarded"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 h-8 text-sm font-medium transition-all',
      'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]',
      'data-[state=on]:bg-white/[0.08] data-[state=on]:text-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      props.class
    )"
  >
    <slot />
  </ToggleGroupItem>
</template>
