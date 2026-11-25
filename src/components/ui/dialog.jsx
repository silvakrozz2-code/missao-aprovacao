import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib-utils";
export const Dialog = D.Root;
export function DialogContent({ title, children, className }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm data-[state=open]:animate-in" />
      <D.Content className={cn("fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-risco bg-lousa p-5 pb-[calc(24px+env(safe-area-inset-bottom))] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl", className)}>
        <div className="mb-3 flex items-start justify-between gap-3"><D.Title className="font-display text-2xl font-bold">{title}</D.Title>
          <D.Close className="grid size-10 place-items-center rounded-full bg-folha-2 hover:bg-folha-3" aria-label="Fechar"><X className="size-5" /></D.Close></div>
        <D.Description className="sr-only">{title}</D.Description>
        {children}
      </D.Content>
    </D.Portal>
  );
}
