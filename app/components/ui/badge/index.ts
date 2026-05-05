import { type VariantProps, cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tabular-nums transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary border border-primary/25',
        secondary: 'bg-white/[0.04] text-foreground border border-white/10',
        outline: 'border border-white/10 text-foreground',
        muted: 'bg-white/[0.03] text-muted-foreground border border-white/5'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
