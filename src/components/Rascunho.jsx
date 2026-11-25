import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eraser, Trash2, Undo2, Pen } from "lucide-react";
import { N } from "@/estado.js";
import { cn } from "@/lib-utils";

/* Folha de rascunho por cima da questão: caneta de giz, borracha, desfazer e limpar.
   O desenho fica guardado enquanto você está na mesma questão (N.ui.limparRascunho apaga ao trocar). */
const CORES = [["Giz", "#eef0e8"], ["Amarelo", "#f5d76e"], ["Azul", "#8cc4ff"], ["Vermelho", "#ff8a7a"]];

export default function Rascunho() {
  const [aberto, setAberto] = useState(false);
  const [cor, setCor] = useState(CORES[0][1]);
  const [borracha, setBorracha] = useState(false);
  const cv = useRef(null), tracos = useRef([]), atual = useRef(null), dpr = useRef(1);

  const desenhar = () => {
    const c = cv.current; if (!c) return; const g = c.getContext("2d");
    g.setTransform(dpr.current, 0, 0, dpr.current, 0, 0); g.clearRect(0, 0, c.width, c.height);
    g.lineCap = "round"; g.lineJoin = "round";
    for (const t of tracos.current) {
      g.globalCompositeOperation = t.borracha ? "destination-out" : "source-over";
      g.strokeStyle = t.cor; g.lineWidth = t.borracha ? 26 : 3.2; g.beginPath();
      t.p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      if (t.p.length === 1) g.lineTo(t.p[0][0] + .1, t.p[0][1]);
      g.stroke();
    }
    g.globalCompositeOperation = "source-over";
  };
  const ajustar = () => { const c = cv.current; if (!c) return; dpr.current = devicePixelRatio || 1; c.width = innerWidth * dpr.current; c.height = innerHeight * dpr.current; desenhar(); };

  useEffect(() => {
    N.ui.rascunho = () => setAberto(true);
    N.ui.limparRascunho = () => { tracos.current = []; desenhar(); };
    const esc = (e) => { if (e.key === "Escape") setAberto(false); };
    addEventListener("keydown", esc); addEventListener("resize", ajustar);
    return () => { removeEventListener("keydown", esc); removeEventListener("resize", ajustar); };
  }, []);
  useEffect(() => { if (aberto) requestAnimationFrame(ajustar); }, [aberto]);

  const ponto = (e) => [e.clientX, e.clientY];
  const down = (e) => { e.currentTarget.setPointerCapture(e.pointerId); atual.current = { cor, borracha, p: [ponto(e)] }; tracos.current.push(atual.current); desenhar(); };
  const move = (e) => { if (!atual.current) return; atual.current.p.push(ponto(e)); desenhar(); };
  const up = () => { atual.current = null; };

  const Bt = ({ on, label, onClick, children }) => (
    <button type="button" aria-label={label} aria-pressed={on} onClick={onClick} className={cn("grid size-11 place-items-center rounded-xl", on ? "bg-giz text-lousa" : "bg-folha-2 text-giz hover:bg-folha-3")}>{children}</button>
  );
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div role="dialog" aria-modal="true" aria-label="Rascunho" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--lousa)_78%,transparent)] backdrop-blur-[1px]" />
          <canvas ref={cv} className="absolute inset-0 size-full touch-none" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
          <span className="mao pointer-events-none absolute left-4 top-[calc(14px+env(safe-area-inset-top))] text-lg text-marca">rascunho: a questão continua por baixo</span>
          <motion.div initial={{ y: 30 }} animate={{ y: 0 }} className="vidro absolute inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] mx-auto flex max-w-md flex-wrap items-center justify-center gap-2 rounded-2xl border border-risco-2 p-2">
            {CORES.map(([nome, c]) => (
              <button key={c} type="button" aria-label={`Caneta ${nome}`} aria-pressed={!borracha && cor === c} onClick={() => { setCor(c); setBorracha(false); }}
                className={cn("grid size-11 place-items-center rounded-xl bg-folha-2", !borracha && cor === c && "ring-2 ring-giz")}><span className="size-5 rounded-full" style={{ background: c }} /></button>))}
            <Bt label="Borracha" on={borracha} onClick={() => setBorracha((b) => !b)}><Eraser className="size-5" /></Bt>
            <Bt label="Desfazer" onClick={() => { tracos.current.pop(); desenhar(); }}><Undo2 className="size-5" /></Bt>
            <Bt label="Limpar tudo" onClick={() => { tracos.current = []; desenhar(); }}><Trash2 className="size-5" /></Bt>
            <Bt label="Fechar rascunho" onClick={() => setAberto(false)}><X className="size-5" /></Bt>
          </motion.div>
        </motion.div>)}
    </AnimatePresence>
  );
}

export const BotaoRascunho = ({ className }) => (
  <button type="button" onClick={() => N.ui.rascunho?.()} className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-risco-2 bg-folha-2 px-3 text-sm font-bold hover:bg-folha-3", className)}><Pen className="size-4" /> Rascunho</button>
);
