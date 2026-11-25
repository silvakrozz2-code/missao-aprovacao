import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib-utils";

// shadcn/ui Button com as variantes do app
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold transition-[background,transform,box-shadow,border-color] duration-150 active:scale-[.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-[1.1em] [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-acc text-sobre-acc shadow-[0_10px_28px_-14px_var(--acc)] hover:brightness-110",
        secondary: "bg-folha-2 text-giz border border-risco-2 hover:bg-folha-3",
        outline: "border border-risco-2 bg-transparent hover:bg-folha-2",
        ghost: "bg-transparent hover:bg-folha-2 text-giz",
        link: "bg-transparent underline underline-offset-4 text-acc px-0 min-h-0",
      },
      size: { default: "min-h-11 px-4 text-[.95rem]", sm: "min-h-9 px-3 text-sm rounded-lg", lg: "min-h-13 px-6 text-base", icon: "size-11" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
export function Button({ className, variant, size, asChild = false, ...props }) {
  const C = asChild ? Slot : "button";
  return <C className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
