<template>
  <span
    class="absolute"
    :class="[noteStyle, ...lines]"
    :style="position"
  >
    {{ props.note }}
  </span>
</template>

<script lang="ts" setup>
interface Props {
  note: string
  lines?: ('top' | 'center' | 'bottom')[]
  left?: number
  bottom?: number
  top?: number
  right?: number
}

const props = defineProps<Props>()

const noteStyle = `
  bg-cyan-500 rounded-md h-6 w-7 flex items-center justify-center
  text-black font-semibold border text-sm
`

const topLine = `
  before:content-[''] before:absolute before:-top-1.5 before:w-14
  before:h-[0.07rem] before:bg-cyan-400
`

const bottomLine = `
  after:content-[''] after:absolute after:-bottom-1.5 after:w-14
  after:h-[0.07rem] after:bg-cyan-400
`

const centerLine = `
  before:content-[''] before:absolute before:top-2 before:z-[-10]
  before:w-14 before:h-[0.07rem] before:bg-cyan-400
`

const lines = computed(() => [
  props.lines?.includes('top') && topLine,
  props.lines?.includes('center') && centerLine,
  props.lines?.includes('bottom') && bottomLine
])

const position = computed(() =>`
  top: ${props.top}rem;
  right: ${props.right}rem;
  bottom: ${props.bottom}rem;
  left: ${props.left}rem;
`)
</script>