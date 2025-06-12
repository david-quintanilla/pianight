<template>
  <div
    class="h-full bg-white text-black font-bold flex flex-col items-center justify-end w-15 relative pb-4"
  >
    {{ props.note }}
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  note: string
}

const props = defineProps<Props>()
</script>