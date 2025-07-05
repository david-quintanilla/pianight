<template>
  <div
    class="h-full text-black font-bold flex flex-col items-center justify-end w-10 lg:w-11 xl:w-13 relative pb-3"
    :class="props.isSelected ? 'bg-cyan-500' : 'bg-white'"
  >
    <p class="text-xs">
      {{ props.note }}
    </p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  note: string
  isSelected: boolean
}

const props = defineProps<Props>()
</script>