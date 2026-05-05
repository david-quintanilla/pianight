<template>
  <div class="relative flex flex-col items-center justify-end h-full w-10 lg:w-11 xl:w-13 pb-3 rounded-b-md key-white">
    <span
      aria-hidden="true"
      class="absolute inset-0 rounded-b-md key-active-gradient pointer-events-none transition-opacity duration-500 ease-out"
      :style="{ opacity: props.isSelected ? 1 : 0 }"
    />
    <p
      class="relative z-10 text-xs font-display tracking-wide transition-colors duration-500"
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
