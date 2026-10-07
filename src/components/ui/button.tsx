import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

// Utility button for quiet, secondary controls (e.g. closing a dialog).
// For primary calls to action use <CapsuleButton>, the brand's asymmetric capsule.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300 ease-kopwerk disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
      },
      size: {
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "icon",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
