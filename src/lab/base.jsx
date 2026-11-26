import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib-utils";
import { Faiscas } from "@/components/efeitos/efeitos.jsx";

/* Números no jeito brasileiro */
export const fmt = (x, d = 1) => (Number.isFinite(x) ? (Math.round(x * 10 ** d) / 10 ** d).toLocaleString("pt-BR", { maximumFractionDigits: d }) : "—");
export const brl = (x) => x.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const mdc = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
export const mmc = (a, b) => (a && b ? Math.abs(a * b) / mdc(a, b) : 0);

/* Palco: quadro com quadriculado de caderno e filtro de giz. Coordenadas do SVG = unidades do desenho. */
export function Palco({ w = 360, h = 260, children, label, svgRef, className, grade = 20 }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-risco-2 bg-[radial-gradient(120%_90%_at_30%_0%,#1b2a24,#111a16_70%)] shadow-[inset_0_2px_30px_rgba(0,0,0,.45)]", className)}>
      <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} role="group" aria-label={label} className="block h-auto w-full touch-none select-none" style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700 }}>
        <defs>
          <filter id="giz" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3" /><feDisplacementMap in="SourceGraphic" scale="1.6" /></filter>
          <pattern id="grade" width={grade} height={grade} patternUnits="userSpaceOnUse"><path d={`M${grade} 0H0V${grade}`} fill="none" stroke="rgba(238,240,232,.07)" strokeWidth="1" /></pattern>
        </defs>
        <rect width={w} height={h} fill="url(#grade)" />
        {children}
      </svg>
    </div>
  );
}

/* Converte o ponteiro para coordenadas do SVG */
export function useArrastar(svgRef, onMove) {
  const ativo = useRef(null);
  const pt = (e) => { const s = svgRef.current; const m = s.getScreenCTM().inverse(); const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m); return [p.x, p.y]; };
  const begin = useCallback((id) => (e) => { e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); ativo.current = id; }, []);
  useEffect(() => {
    const mv = (e) => { if (ativo.current == null || !svgRef.current) return; onMove(ativo.current, pt(e)); };
    const up = () => { ativo.current = null; };
    addEventListener("pointermove", mv); addEventListener("pointerup", up); addEventListener("pointercancel", up);
    return () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); };
  });
  return begin;
}

/* Alça arrastável (também pelo teclado: setas movem, Shift move mais) */
export function Alca({ x, y, cor = "var(--acc)", rotulo, onDown, onTecla, onToque, ativo, label }) {
  return (
    <g tabIndex={0} role="button" aria-label={label} className="cursor-grab outline-none active:cursor-grabbing [&:focus-visible>circle:first-child]:stroke-giz"
      onPointerDown={(e) => { onToque?.(); onDown?.(e); }}
      onKeyDown={(e) => { const d = e.shiftKey ? 10 : 2; const m = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d] }[e.key]; if (m) { e.preventDefault(); onTecla?.(m); onToque?.(); } if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToque?.(); } }}>
      <circle cx={x} cy={y} r="20" fill="transparent" stroke="transparent" strokeWidth="3" />
      {ativo && <circle cx={x} cy={y} r="14" fill="none" stroke={cor} strokeOpacity=".45" strokeWidth="2"><animate attributeName="r" values="10;17;10" dur="1.6s" repeatCount="indefinite" /></circle>}
      <circle cx={x} cy={y} r="8" fill={cor} stroke="#0f1513" strokeWidth="2.5" />
      {rotulo && <text x={x + 11} y={y - 10} fill={cor} fontSize="17" fontWeight="700">{rotulo}</text>}
    </g>
  );
}

/* Área tocável que chama o tutor (lado, ângulo, região) */
export const Toque = ({ onToque, label, children }) => (
  <g role="button" tabIndex={0} aria-label={label} className="cursor-pointer outline-none [&:focus-visible]:opacity-80" onClick={onToque} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToque(); } }}>{children}</g>
);

/* Controle deslizante no estilo do app */
export function Deslizar({ rot, v, min, max, passo = 1, onChange, fmtV = (x) => fmt(x, 2), cor = "var(--acc)", onFoco }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-bold" onPointerDown={onFoco}>
      <span className="flex justify-between gap-2"><span>{rot}</span><span className="num" style={{ color: cor }}>{fmtV(v)}</span></span>
      <input type="range" min={min} max={max} step={passo} value={v} onChange={(e) => onChange(+e.target.value)} onFocus={onFoco}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-folha-3 [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-lousa [&::-webkit-slider-thumb]:bg-[var(--c)] [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-lousa [&::-moz-range-thumb]:bg-[var(--c)]"
        style={{ "--c": cor, background: `linear-gradient(90deg, ${cor} ${((v - min) / (max - min)) * 100}%, var(--folha-3) 0)` }} />
    </label>
  );
}

/* Leituras ao vivo (medidas) */
export const Leituras = ({ itens }) => (
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
    {itens.map(([k, v, cor, onToque]) => (
      <button key={k} type="button" onClick={onToque} disabled={!onToque} className="flex min-w-0 flex-col rounded-xl border border-risco bg-folha-2 px-3 py-2 text-left enabled:hover:border-risco-2">
        <span className="text-xs font-bold text-apagado">{k}</span><span className="num truncate text-lg font-bold" style={{ color: cor }}>{v}</span>
      </button>))}
  </div>
);

/* Tutor sem IA: cada parte tocada tem uma explicação escrita para ela, com os números da tela */
export function Tutor({ fala }) {
  return (
    <div className="flex items-start gap-3" aria-live="polite">
      <motion.span key={fala?.titulo} initial={{ rotate: -12, scale: .8 }} animate={{ rotate: 0, scale: 1 }} className="mao grid size-11 shrink-0 place-items-center rounded-2xl bg-marca text-xl font-bold text-marca-tinta shadow-[0_8px_20px_-10px_var(--marca)]" aria-hidden>G</motion.span>
      <AnimatePresence mode="wait">
        <motion.div key={fala?.titulo + fala?.txt} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .18 }}
          className="relative min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-risco-2 bg-folha-2 px-4 py-3">
          <b className="mao block text-lg leading-tight text-marca">{fala?.titulo}</b>
          <p className="mt-1 leading-relaxed">{fala?.txt}</p>
          {fala?.conta && <p className="num mt-2 break-words rounded-lg bg-lousa px-3 py-1.5 text-[.95rem] text-acc">{fala.conta}</p>}
          {fala?.dica && <p className="mt-2 text-sm text-apagado"><span className="mao text-base text-giz">Experimente:</span> {fala.dica}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* Missões que se completam sozinhas quando a figura chega lá */
export function Missoes({ lista }) {
  const feitas = useRef(new Set()); const [faisca, setFaisca] = useState(null);
  useEffect(() => { lista.forEach((m, k) => { if (m.ok && !feitas.current.has(k)) { feitas.current.add(k); setFaisca(`${k}-${Date.now()}`); } }); });
  const n = lista.filter((m) => m.ok).length;
  return (
    <div className="relative flex flex-col gap-2 rounded-2xl border border-dashed border-risco-2 p-3.5">
      <Faiscas disparo={faisca} />
      <span className="flex items-center justify-between gap-2 text-sm font-bold"><span className="inline-flex items-center gap-1.5"><Target className="size-4 text-marca" />Missões</span><span className="num text-apagado">{n}/{lista.length}</span></span>
      <ul className="flex flex-col gap-1.5">{lista.map((m, k) => (
        <li key={k} className={cn("flex items-start gap-2 text-sm", m.ok && "text-apagado")}>
          <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2", m.ok ? "border-certo bg-certo text-lousa" : "border-risco-2")}>{m.ok && <Check className="size-3" strokeWidth={3.5} />}</span>
          <span className={cn(m.ok && "line-through")}>{m.txt}</span></li>))}</ul>
      {n === lista.length && <span className="mao inline-flex items-center gap-1 text-lg text-certo"><Sparkles className="size-4" />Mandou bem! Agora tente as questões</span>}
    </div>
  );
}

/* Moldura comum de cada experimento */
export function Experimento({ palco, controles, leituras, fala, missoes }) {
  return (
    <div className="flex flex-col gap-4">
      {palco}
      {controles && <div className="grid gap-3 sm:grid-cols-2">{controles}</div>}
      {leituras}
      <Tutor fala={fala} />
      {missoes && <Missoes lista={missoes} />}
    </div>
  );
}
