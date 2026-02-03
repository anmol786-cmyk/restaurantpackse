import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary: Burgundy solid
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        // Gold: Premium/Wholesale highlights
        gold:
          "border-transparent bg-accent text-accent-foreground hover:bg-gold-600",
        // Secondary: Muted style
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Destructive: Errors, cancellations
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        // Success: Completed, in stock
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/90",
        // Warning: Pending, low stock
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/90",
        // Info: Processing, informational
        info:
          "border-transparent bg-info text-info-foreground hover:bg-info/90",
        // Outline variants
        outline: "text-foreground border-border",
        "outline-primary": "text-primary border-primary bg-primary/5",
        "outline-gold": "text-accent border-accent bg-accent/5",
        "outline-success": "text-success border-success bg-success/5",
        "outline-warning": "text-warning border-warning bg-warning/5",
        "outline-destructive": "text-destructive border-destructive bg-destructive/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
