import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none outline-none focus-visible:ring-4 focus-visible:ring-amber-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-kopwerk-dark",
  {
    variants: {
      variant: {
        default: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/20 hover:scale-[1.02]",
        primary: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/20 hover:scale-[1.02]",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700",
        outline: "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
        glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-300/70 dark:border-slate-800/90 shadow-lg shadow-slate-200/40 dark:shadow-black/40 hover:border-amber-500/50 dark:hover:border-amber-400/50 text-slate-900 dark:text-white",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:bg-red-900 dark:hover:bg-red-800",
        link: "text-slate-900 dark:text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 text-sm rounded-full",
        sm: "h-9 px-4 text-xs rounded-full",
        md: "h-10 px-5 text-sm rounded-full",
        lg: "h-12 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base rounded-full",
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "size-7 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  fullWidth,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
