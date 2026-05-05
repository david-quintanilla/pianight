<template>
  <div class="rounded-b-md flex flex-col items-center justify-end w-10 h-22 absolute top-0 -right-5 z-10 pb-2 key-black overflow-visible">
    <span
      aria-hidden="true"
      class="absolute inset-0 rounded-b-md key-active-gradient ring-1 ring-cyan-200/60 pointer-events-none transition-opacity duration-500 ease-out"
      :style="{ opacity: props.isSelected ? 1 : 0 }"
    />
    <span
      v-for="(note, index) in props.notes"
      :key="index"
      class="relative z-10 font-display text-[10.5px] tracking-wide rounded-full h-5 w-7 flex justify-center items-center transition-colors duration-500"
      :class="props.isSelected ? 'text-ink-950 font-semibold' : 'text-paper/85 font-medium'"
    >
      {{ note }}
    </span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  notes: string[]
  isSelected: boolean
}

const props = defineProps<Props>()
</script>
