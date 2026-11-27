import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Layers, X, ChevronLeft, ChevronRight, Volume2, Sparkles, RotateCcw, Lightbulb } from "lucide-react";
import { useNucleo, N } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/card.jsx";

const ABAS = [
  ["siglas", "Siglas & macetes", Sparkles],
  ["erros", "Meus erros", RotateCcw],
];

// Cartão de sigla/macete: frente = a sigla, verso = a abertura + significado.
function CartaoSigla({ c, virado }) {
  return (
    <div className="relative size-full [transform-style:preserve-3d]">
      <motion.div animate={{ rotateY: virado ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 24 }} className="relative size-full [transform-style:preserve-3d]">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border border-risco-2 bg-[linear-gradient(165deg,var(--folha-2),var(--folha))] p-6 text-center [backface-visibility:hidden]">
          <span className="text-sm font-bold text-apagado">Decore a sigla</span>
          <b className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">{c.sigla}</b>
          <span className="mao text-apagado">Toque para abrir</span>
        </div>
        <div className="absolute inset-0 flex flex-col gap-3 overflow-auto rounded-3xl border border-acc bg-folha p-5 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex items-center gap-2"><Lightbulb className="size-4 shrink-0 text-acc" /><b className="font-display text-xl leading-tight">{c.sigla}</b></div>
          <p className="text-[1.05rem] font-bold leading-snug text-giz">{c.letras}</p>
          <p className="text-sm leading-relaxed text-apagado">{c.significado}</p>
          <div className="mt-auto"><Badge tone="acc">{c.tema}</Badge></div>
        </div>
      </motion.div>
    </div>
  );
}

// Cartão de erro: frente = o enunciado que caiu, verso = resposta certa + por que ela errou.
function CartaoErro({ c, virado }) {
  return (
    <div className="relative size-full [transform-style:preserve-3d]">
      <motion.div animate={{ rotateY: virado ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 24 }} className="relative size-full [transform-style:preserve-3d]">
        <div className="absolute inset-0 flex flex-col gap-3 overflow-auto rounded-3xl border border-risco-2 bg-[linear-gradient(165deg,var(--folha-2),var(--folha))] p-5 text-left [backface-visibility:hidden]">
          <Badge tone="erro">{c.tema}</Badge>
          <b className="text-[1.05rem] font-bold leading-snug">{c.enunciado}</b>
          <span className="mao mt-auto text-apagado">Toque para ver a resposta</span>
        </div>
        <div className="absolute inset-0 flex flex-col gap-3 overflow-auto rounded-3xl border border-acc bg-folha p-5 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div><span className="text-xs font-bold uppercase tracking-wide text-certo">Resposta certa</span><p className="text-[1.05rem] font-bold leading-snug text-giz">{c.correta}</p></div>
          {c.marcou && <p className="text-sm text-apagado">Você marcou: <span className="text-erro">{c.marcou}</span></p>}
          {c.explicacao && <p className="text-sm leading-relaxed text-apagado">{c.explicacao}</p>}
          {c.porque && <p className="mao rounded-xl border border-risco bg-lousa p-3 text-[1.05rem] leading-snug text-giz">Seu lembrete: {c.porque}</p>}
        </div>
      </motion.div>
    </div>
  );
}

function Vazio({ aba }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-risco-2 bg-folha-2 p-6 text-center">
      <Layers className="size-7 text-apagado" />
      <b className="font-display text-xl">{aba === "erros" ? "Nenhum erro guardado ainda" : "Sem cartões por aqui"}</b>
      <p className="text-sm text-apagado">{aba === "erros" ? "Quando você errar uma questão e anotar “Por que eu errei?”, ela aparece aqui para revisar." : "Troque de objetivo no topo para ver as siglas dele."}</p>
    </div>
  );
}

export default function PainelRevisao({ oculto }) {
  const n = useNucleo(); const o = n.getS().obj; const objNome = n.OBJS[o].nome;
  const [aberto, setAberto] = useState(false);
  const [aba, setAba] = useState("siglas");
  const [i, setI] = useState(0);
  const [virado, setVirado] = useState(false);

  const siglas = n.siglasDoObj(o);
  const erros = n.cartoesErro(o);
  const lista = aba === "siglas" ? siglas : erros;
  const atual = lista[i];

  // Deixa outras telas abrirem o painel: n.ui.abrirRevisao("erros")
  useEffect(() => { N.ui.abrirRevisao = (qual) => { if (qual) setAba(qual); setI(0); setVirado(false); setAberto(true); }; }, []);
  // Sempre que troca de aba ou de objetivo, volta pro primeiro cartão desvirado.
  useEffect(() => { setI(0); setVirado(false); }, [aba, o]);

  const ir = useCallback((d) => { setVirado(false); setI((x) => { const t = lista.length; return t ? (x + d + t) % t : 0; }); }, [lista.length]);

  useEffect(() => {
    if (!aberto) return;
    const h = (e) => {
      if (e.key === "Escape") setAberto(false);
      else if (e.key === "ArrowRight") ir(1);
      else if (e.key === "ArrowLeft") ir(-1);
      else if (e.key === " " || e.key === "Enter") { if (e.target.tagName !== "BUTTON") { e.preventDefault(); setVirado((v) => !v); } }
    };
    addEventListener("keydown", h); return () => removeEventListener("keydown", h);
  }, [aberto, ir]);

  if (oculto) return null;

  return (
    <>
      {/* aba que fica no lado da tela */}
      <AnimatePresence>
        {!aberto && (
          <motion.button
            initial={{ x: 46, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 46, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            onClick={() => setAberto(true)} aria-label="Abrir revisão rápida de siglas e erros"
            className="mao fixed right-0 top-[38%] z-[75] flex items-center gap-2 rounded-l-2xl border border-r-0 border-risco-2 bg-acc py-3 pl-3 pr-2 text-sobre-acc shadow-[0_12px_30px_-12px_var(--acc)] [writing-mode:vertical-rl] md:top-1/2">
            <Layers className="size-5 [writing-mode:horizontal-tb]" /><span className="text-sm font-bold">Revisão rápida</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aberto && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAberto(false)} className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px]" />
            <motion.aside
              role="dialog" aria-label="Revisão rápida"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="vidro fixed right-0 top-0 z-[81] flex h-dvh w-[min(400px,92vw)] flex-col gap-3 border-l border-risco bg-folha p-4 pt-[calc(14px+env(safe-area-inset-top))] shadow-2xl">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2"><Layers className="size-5 text-acc" /><div><b className="font-display block leading-tight">Revisão rápida</b><span className="text-xs text-apagado">{objNome}</span></div></div>
                <Button variant="ghost" size="icon" onClick={() => setAberto(false)} aria-label="Fechar"><X /></Button>
              </div>

              <div role="tablist" aria-label="Tipo de revisão" className="grid grid-cols-2 gap-1 rounded-2xl bg-folha-2 p-1">
                {ABAS.map(([id, nome, Ic]) => { const on = aba === id; const q = id === "erros" ? erros.length : siglas.length; return (
                  <button key={id} role="tab" aria-selected={on} onClick={() => setAba(id)} className={cn("relative flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-2 text-sm font-bold transition-colors", on ? "text-giz" : "text-apagado hover:text-giz")}>
                    {on && <motion.span layoutId="aba-rev" className="absolute inset-0 rounded-xl bg-folha shadow-[inset_0_-2px_0_var(--acc)]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <Ic className="relative size-4" /><span className="relative">{nome}</span>{q > 0 && <span className="num relative text-xs text-apagado">{q}</span>}
                  </button>); })}
              </div>

              {lista.length === 0 ? <div className="min-h-0 flex-1"><Vazio aba={aba} /></div> : (<>
                <div className="flex items-center justify-between text-sm text-apagado"><span className="font-bold">{aba === "siglas" ? "Macete" : "Questão que você errou"}</span><span className="num">{i + 1}/{lista.length}</span></div>
                <button onClick={() => setVirado((v) => !v)} aria-label={virado ? "Virar de volta" : "Virar o cartão"} className="relative min-h-0 flex-1 [perspective:1200px]">
                  <AnimatePresence mode="wait">
                    <motion.div key={aba + atual.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .2 }} className="size-full">
                      {aba === "siglas" ? <CartaoSigla c={atual} virado={virado} /> : <CartaoErro c={atual} virado={virado} />}
                    </motion.div>
                  </AnimatePresence>
                </button>

                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                  <Button variant="secondary" size="icon" onClick={() => ir(-1)} aria-label="Cartão anterior"><ChevronLeft /></Button>
                  <Button onClick={() => setVirado((v) => !v)}>{virado ? "Ver a frente" : "Mostrar resposta"}</Button>
                  <Button variant="secondary" size="icon" onClick={() => ir(1)} aria-label="Próximo cartão"><ChevronRight /></Button>
                </div>
                <Button variant="ghost" onClick={() => n.falar(aba === "siglas" ? (virado ? `${atual.letras}. ${atual.significado}` : atual.sigla) : (virado ? `${atual.correta}. ${atual.explicacao || ""}` : atual.enunciado))}><Volume2 /> Ouvir</Button>
              </>)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
