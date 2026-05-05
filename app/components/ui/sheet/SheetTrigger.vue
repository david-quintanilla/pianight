<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps, useForwardProps } from 'reka-ui'

const props = defineProps<DialogTriggerProps & { class?: string }>()

const delegatedProps = computed(() => {
  const { class: _, ...rest } = props
  return rest
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <DialogTrigger v-bind="forwarded" :class="props.class">
    <slot />
  </DialogTrigger>
</template>
