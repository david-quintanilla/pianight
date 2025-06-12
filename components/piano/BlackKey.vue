<template>
  <div
    class="bg-black rounded-b-md flex flex-col-reverse items-center justify-end w-10 h-40 absolute top-0 -right-5 z-10 gap-4 pt-2"
  >
    <span
      v-for="(note, index) in props.notes"
      :key="index"
      class="text-white font-bold text-xs bg-cyan-500 rounded-full h-8 w-8 flex justify-center items-center"
    >
      {{ note }}
    </span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  notes: string[]
}

const props = defineProps<Props>()
</script>