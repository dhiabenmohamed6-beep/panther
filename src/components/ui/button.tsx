"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/30",
        destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30",
        outline: "border border-white/20 bg-transparent hover:bg-white/10 text-white",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
        ghost: "bg-transparent hover:bg-white/10 text-white",
        link: "text-purple-400 underline-offset-4 hover:underline text-white",
        premium: "bg-black text-white border border-white/20 hover:bg-white/5 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(90,8,145,0.3)]",
        light: "bg-white text-black border border-black/15 hover:bg-black/5 hover:border-black/30",
        ghostLight: "bg-transparent text-black/70 hover:bg-black/5",
        dangerLight: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
        successLight: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
        admin: "bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-700/30",
        adminOutline:
          "border border-purple-300 bg-white text-purple-800 hover:bg-purple-50",
        adminGhost: "bg-transparent text-purple-900 hover:bg-purple-50",
        adminLight:
          "bg-white text-purple-950 border border-purple-200 hover:bg-purple-50 hover:border-purple-300",
        adminDanger: "bg-rose-600 text-white hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/30",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-10 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Chargement...
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };