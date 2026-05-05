<script setup lang="ts">
import { ToggleGroupRoot, type ToggleGroupRootEmits, type ToggleGroupRootProps, useForwardPropsEmits } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<ToggleGroupRootProps & { class?: string }>()
const emits = defineEmits<ToggleGroupRootEmits>()

const delegated = computed(() => {
  const { class: _, ...rest } = props
  return rest
})

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ToggleGroupRoot
    v-bind="forwarded"
    :class="cn('flex items-center justify-center gap-1 rounded-lg bg-white/[0.03] border border-white/5 p-1', props.class)"
  >
    <slot />
  </ToggleGroupRoot>
</template>
