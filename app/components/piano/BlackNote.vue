<template>
  <div
    class="rounded-b-md flex flex-col items-center justify-end w-10 h-22 absolute top-0 -right-5 z-10 pb-2"
    :class="props.isSelected ? 'bg-cyan-500 border-3 border-t-0' : 'bg-black'"
  >
    <span
      v-for="(note, index) in props.notes"
      :key="index"
      class="font-bold text-xs rounded-full h-6 w-8 flex justify-center items-center"
      :class="props.isSelected ? 'text-black' : 'text-white'"
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