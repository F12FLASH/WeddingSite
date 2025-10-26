import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { buttonVariants, type ButtonProps } from "./button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface MotionButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

MotionButton.displayName = "MotionButton";
