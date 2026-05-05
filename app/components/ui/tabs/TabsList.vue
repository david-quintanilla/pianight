<script setup lang="ts">
import { TabsList, type TabsListProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<TabsListProps & { class?: string }>()

const delegated = computed(() => {
  const { class: _, ...rest } = props
  return rest
})
</script>

<template>
  <TabsList
    v-bind="delegated"
    :class="cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 p-1 text-muted-foreground gap-1',
      props.class
    )"
  >
    <slot />
  </TabsList>
</template>
