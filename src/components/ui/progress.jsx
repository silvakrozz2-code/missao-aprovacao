import * as P from "@radix-ui/react-progress";
import { cn } from "@/lib-utils";
export function Progress({ value = 0, className, tone = "acc", label }) {
  return (
    <P.Root value={value} aria-label={label} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-folha-3", className)}>
      <P.Indicator className={cn("h-full rounded-full transition-[width] duration-500 ease-out", tone === "certo" ? "bg-certo" : tone === "erro" ? "bg-erro" : "bg-acc")} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </P.Root>
  );
}
