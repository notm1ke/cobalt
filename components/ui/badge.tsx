import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { css } from "~/util"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                successful:
                    "border-transparent bg-green-400 text-white hover:bg-green-500/80",
                successfulLight:
                    "border-transparent bg-green-100 text-green-400 hover:bg-green-200",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                warning:
                    "border-transparent bg-orange-400 text-white shadow hover:bg-orange-500/80",
                yellow:
                    "border-transparent bg-yellow-400 text-white shadow hover:bg-yellow-500/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={css(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
