<template>
  <div
    class="relative flex flex-col items-center justify-end h-full w-10 lg:w-11 xl:w-13 pb-3 rounded-b-md key-white"
    :class="props.clickable ? 'cursor-pointer' : ''"
    @click="onClick"
  >
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

    <!-- Marca del DO central -->
    <span
      v-if="props.isMiddleC"
      aria-hidden="true"
      class="absolute z-10 bottom-1 w-1.5 h-1.5 rounded-full bg-ink-900"
    />

    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  note: string
  isSelected: boolean
  clickable?: boolean
  isMiddleC?: boolean
}

const props = withDefaults(defineProps<Props>(), { clickable: false, isMiddleC: false })

const emit = defineEmits<{
  click: []
}>()

function onClick() {
  if (props.clickable) emit('click')
}
</script>
