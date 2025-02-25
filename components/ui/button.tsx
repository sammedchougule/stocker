import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-400",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-[#1E2022] dark:text-white dark:hover:bg-[#2A2D2F]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-700 dark:text-white dark:hover:bg-red-800",
        outline:
          "border border-gray-400 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#151719] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#202325]",
        secondary:
          "bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-400 dark:bg-[#1E2022] dark:text-gray-200 dark:hover:bg-[#2A2D2F] dark:border-gray-600",
        ghost:
          "hover:bg-gray-200 text-gray-800 dark:bg-transparent dark:text-gray-300 dark:hover:bg-[#202325] border-transparent",
        link: "text-primary underline-offset-4 hover:underline dark:text-blue-400 dark:hover:text-blue-300 border-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
