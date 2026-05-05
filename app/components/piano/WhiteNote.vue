<template>
  <div
    class="relative flex flex-col items-center justify-end h-full w-10 lg:w-11 xl:w-13 pb-3 rounded-b-md transition-all duration-150"
    :class="props.isSelected ? 'key-active-gradient' : 'key-white'"
  >
    <p
      class="text-xs font-display tracking-wide"
      :class="props.isSelected ? 'text-ink-950 font-semibold' : 'text-ink-900/70 font-medium'"
    >
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
