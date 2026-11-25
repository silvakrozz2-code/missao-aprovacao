// Efeitos no estilo Magic UI, Aceternity UI e React Bits, escritos para este app
// (mesma ideia dos componentes originais, sem dependências extras). Todos respeitam "reduzir movimento".
import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform, useReducedMotion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { cn } from "@/lib-utils";

/* Magic UI · Number Ticker: o número sobe com mola até o valor */
export function NumberTicker({ value, className, format = (n) => Math.round(n).toLocaleString("pt-BR") }) {
  const reduz = useReducedMotion();
  const mola = useSpring(reduz ? value : 0, { stiffness: 90, damping: 22 });
  const txt = useTransform(mola, (v) => format(v));
  useEffect(() => { mola.set(value); }, [value, mola]);
  return <motion.span className={cn("num", className)}>{txt}</motion.span>;
}

/* Magic UI · Shimmer Button: brilho que atravessa o botão principal */
export function ShimmerButton({ className, children, ...p }) {
  return (
    <button className={cn("group relative inline-flex min-h-13 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-acc px-6 font-bold text-sobre-acc shadow-[0_14px_34px_-16px_var(--acc)] transition-transform active:scale-[.98] [&_svg]:size-5 cursor-pointer", className)} {...p}>
      <span aria-hidden className="pointer-events-none absolute inset-0 animate-brilho bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,.45)_50%,transparent_65%)] bg-[length:200%_100%]" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

/* Magic UI · Border Beam: um feixe de luz percorrendo a borda */
export function BorderBeam({ className, dur = 7 }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0 rounded-[inherit] p-px [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]", className)}>
      <motion.span className="absolute -inset-[200%] bg-[conic-gradient(from_0deg,transparent_0_300deg,var(--acc)_330deg,var(--marca)_350deg,transparent_360deg)]"
        animate={{ rotate: 360 }} transition={{ duration: dur, repeat: Infinity, ease: "linear" }} />
    </span>
  );
}

/* Aceternity · Card Spotlight: luz que segue o dedo/mouse sobre o cartão */
export function Spotlight({ className, children, as: C = "div", ...p }) {
  const ref = useRef(null);
  const mover = (e) => { const r = ref.current.getBoundingClientRect(); ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`); ref.current.style.setProperty("--my", `${e.clientY - r.top}px`); };
  return (
    <C ref={ref} onPointerMove={mover} className={cn("group relative overflow-hidden", className)} {...p}>
      <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(260px_circle_at_var(--mx)_var(--my),color-mix(in_srgb,var(--acc)_22%,transparent),transparent_70%)]" />
      {children}
    </C>
  );
}

/* Aceternity · Aurora Background: manchas de luz lentas atrás do palco */
export function Aurora({ className }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -left-1/4 -top-1/3 h-[140%] w-[90%] animate-aurora rounded-full opacity-40 blur-3xl bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--acc)_55%,transparent),transparent)]" />
      <div className="absolute -right-1/4 top-1/4 h-[120%] w-[70%] animate-aurora rounded-full opacity-25 blur-3xl [animation-delay:-9s] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--marca)_50%,transparent),transparent)]" />
    </div>
  );
}

/* React Bits · Split Text (com GSAP): as letras sobem uma a uma */
export function SplitText({ text, className, as: C = "h1" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => { gsap.from(ref.current.querySelectorAll("[data-l]"), { yPercent: 110, opacity: 0, duration: .7, ease: "power3.out", stagger: .018 }); }, ref);
    return () => ctx.revert();
  }, [text]);
  return (
    <C ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[.08em] align-bottom">
          {[...w].map((ch, k) => <span key={k} data-l className="inline-block">{ch}</span>)}{i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </C>
  );
}

/* React Bits · Click Spark: faíscas de giz quando você acerta */
export function Faiscas({ disparo }) {
  const [id, setId] = useState(0);
  const reduz = useReducedMotion();
  useEffect(() => { if (disparo) setId((x) => x + 1); }, [disparo]);
  if (reduz) return null;
  return (
    <AnimatePresence>{id > 0 && (
      <motion.span key={id} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: .7 }}>
        {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return (
          <motion.i key={i} className="absolute block h-1.5 w-4 rounded-full bg-marca" style={{ rotate: `${(a * 180) / Math.PI}deg` }}
            initial={{ x: 0, y: 0, scaleX: 1 }} animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 70, scaleX: .2 }} transition={{ duration: .6, ease: "easeOut" }} />); })}
      </motion.span>)}
    </AnimatePresence>
  );
}

/* Motion · entrada de tela */
export const Entra = ({ children, className, atraso = 0 }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 28, delay: atraso }}>{children}</motion.div>
);
