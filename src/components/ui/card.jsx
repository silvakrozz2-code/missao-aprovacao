import { cn } from "@/lib-utils";
export const Card = ({ className, ...p }) => <section className={cn("rounded-2xl border border-risco bg-folha p-4 sm:p-5 flex flex-col gap-3 min-w-0", className)} {...p} />;
export const CardTitle = ({ className, ...p }) => <h2 className={cn("text-xl font-bold", className)} {...p} />;
export const Badge = ({ className, tone = "neutro", ...p }) => (
  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap [&_svg]:size-3.5",
    { neutro: "bg-folha-2 text-apagado", acc: "bg-[color-mix(in_srgb,var(--acc)_18%,transparent)] text-acc", certo: "bg-certo-suave text-certo", erro: "bg-erro-suave text-erro", marca: "bg-marca text-marca-tinta", giz: "bg-folha-3 text-giz" }[tone], className)} {...p} />
);
export const Eyebrow = ({ className, ...p }) => <span className={cn("text-sm font-bold text-apagado", className)} {...p} />;
