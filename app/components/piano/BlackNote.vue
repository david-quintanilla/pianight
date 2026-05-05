<template>
  <div
    class="rounded-b-md flex flex-col items-center justify-end w-10 h-22 absolute top-0 -right-5 z-10 pb-2 transition-all duration-150"
    :class="props.isSelected ? 'key-active-gradient ring-1 ring-cyan-200/60' : 'key-black'"
  >
    <span
      v-for="(note, index) in props.notes"
      :key="index"
      class="font-display text-[10.5px] tracking-wide rounded-full h-5 w-7 flex justify-center items-center"
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
