import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary: Burgundy - Main CTAs
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-600 hover:shadow-md",
        // Gold: Premium B2B actions - Quotes, Credit, Wholesale
        gold: "bg-accent text-accent-foreground shadow-sm hover:bg-gold-600 hover:shadow-md",
        // Destructive: Cancel, Delete actions
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        // Outline: Secondary actions with border
        outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
        // Outline Gold: Secondary gold actions
        "outline-gold": "border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground",
        // Secondary: Muted background actions
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost: Minimal style, no background
        ghost: "hover:bg-muted hover:text-foreground",
        // Link: Text only with underline
        link: "text-primary underline-offset-4 hover:underline",
        // Premium: Elevated with shadow and lift
        premium: "bg-primary text-primary-foreground shadow-lg hover:bg-primary-600 hover:shadow-xl hover:-translate-y-0.5",
        // Premium Gold: Elevated gold button
        "premium-gold": "bg-accent text-accent-foreground shadow-lg hover:bg-gold-600 hover:shadow-xl hover:-translate-y-0.5",
        // Success: Positive actions
        success: "bg-success text-success-foreground shadow-sm hover:bg-success/90",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
