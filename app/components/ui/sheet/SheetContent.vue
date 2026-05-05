<script setup lang="ts">
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits
} from 'reka-ui'
import { cn } from '~/lib/utils'

type Side = 'top' | 'right' | 'bottom' | 'left'

const props = defineProps<DialogContentProps & { class?: string, side?: Side }>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, side: __, ...rest } = props
  return rest
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const side = computed<Side>(() => props.side ?? 'right')

const sideClasses: Record<Side, string> = {
  right: 'inset-y-0 right-0 h-full w-3/4 sm:max-w-md border-l data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
  left: 'inset-y-0 left-0 h-full w-3/4 sm:max-w-md border-r data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
  top: 'inset-x-0 top-0 border-b data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
  bottom: 'inset-x-0 bottom-0 border-t data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'
}
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-ink-950/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      v-bind="forwarded"
      :class="cn(
        'fixed z-50 gap-4 bg-ink-900 border-white/5 p-6 shadow-2xl transition ease-in-out duration-300',
        sideClasses[side],
        props.class
      )"
    >
      <slot />
      <DialogClose
        class="absolute top-4 right-4 rounded-md p-1 text-paper/50 hover:text-paper transition-colors focus:outline-none"
      >
        <X class="size-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
