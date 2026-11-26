import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import { House, Route, PencilLine, Layers, Ellipsis, MessageCircle, Flame } from "lucide-react";
import { useNucleo, N } from "./estado.js";
import { cn } from "./lib-utils";
import Painel from "./telas/Painel.jsx";
import Trilha from "./telas/Trilha.jsx";
import Aprender from "./telas/Aprender.jsx";
import { Questao, Resultado } from "./telas/Questao.jsx";
import Treinar, { Cards } from "./telas/Treinar.jsx";
import Mais from "./telas/Mais.jsx";
import Rascunho from "./components/Rascunho.jsx";
import { Ouvir, CadernoTela, Desafios } from "./telas/Extras.jsx";
import Lab from "./telas/Lab.jsx";
import Modos from "./telas/Modos.jsx";
import Contas from "./telas/Contas.jsx";
import Tutor from "./telas/Tutor.jsx";

const ROTAS = ["painel", "trilha", "treinar", "revisar", "mais", "aprender", "questao", "resultado", "cards", "ouvir", "caderno", "desafios", "lab", "modos", "contas", "tutor"];
const NAV = [["painel", "Painel", House], ["trilha", "Trilha", Route], ["treinar", "Treinar", PencilLine], ["revisar", "Revisar", Layers], ["mais", "Mais", Ellipsis]];
const PAI = { aprender: "trilha", questao: "treinar", resultado: "treinar", cards: "revisar", ouvir: "revisar", caderno: "revisar", desafios: "painel", lab: "trilha", modos: "treinar", contas: "treinar", tutor: "mais" };

function Toast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => { let t; N.ui.toast = (m) => { setMsg(m); clearTimeout(t); t = setTimeout(() => setMsg(null), 2600); }; }, []);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 md:bottom-8">
      <AnimatePresence>{msg && <motion.div initial={{ y: 20, opacity: 0, scale: .96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 30 }} className="mao rounded-2xl bg-giz px-4 py-2 text-lg text-lousa shadow-2xl">{msg}</motion.div>}</AnimatePresence>
    </div>
  );
}

const CURTO = { concurso: "Concurso", npor: "NPOR", enem: "ENEM" };
function Objetivos({ vertical }) {
  const n = useNucleo(); const S = n.getS();
  return (
    <div role="group" aria-label="Objetivo" className={cn("flex gap-1 rounded-2xl bg-folha-2 p-1", vertical && "flex-col")}>
      {n.ORDEM.map((o) => { const d = n.diasAte(S.cfg.datas[o]); const on = S.obj === o; return (
        <button key={o} aria-pressed={on} aria-label={`${n.OBJS[o].nome}${d >= 0 ? `, faltam ${d} dias` : ""}`} onClick={() => n.trocarObj(o)} className={cn("relative flex flex-1 items-center gap-2 rounded-xl text-sm font-bold transition-colors", vertical ? "justify-between px-3 py-2 text-left" : "min-h-9 justify-center px-2 py-1.5", on ? "text-giz" : "text-apagado hover:text-giz")}>
          {on && <motion.span layoutId={vertical ? "obj-v" : "obj-h"} className="absolute inset-0 rounded-xl bg-folha shadow-[inset_0_-2px_0_var(--acc)]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          {/* no celular cabe só o nome curto; o nome completo fica no aria-label */}
          <span className="relative truncate leading-tight">{vertical ? n.OBJS[o].nome : CURTO[o] || n.OBJS[o].nome}</span><span className="num relative text-xs font-semibold" style={{ color: on ? `var(--${o})` : undefined }}>{d >= 0 ? `${d}d` : "—"}</span>
        </button>); })}
    </div>
  );
}

export default function App() {
  const n = useNucleo(); const S = n.getS();
  const [rota, setRota] = useState(() => { const h = location.hash.slice(1); return ROTAS.includes(h) && !["aprender", "questao", "resultado", "cards"].includes(h) ? h : "painel"; });
  useEffect(() => {
    N.ui.ir = (r) => { setRota(r); history.replaceState(null, "", "#" + r); scrollTo(0, 0); };
    N.ui.topo = () => scrollTo({ top: 0, behavior: "smooth" });
    N.ui.rolarExplicacao = () => setTimeout(() => document.getElementById("explica")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    N.iniciarFoco();
    const fh = () => { const h = location.hash.slice(1); if (ROTAS.includes(h)) setRota(h); };
    addEventListener("hashchange", fh); return () => removeEventListener("hashchange", fh);
  }, []);
  useEffect(() => {
    const r = document.documentElement;
    if (S.cfg.tema === "light") r.setAttribute("data-theme", "light"); else r.removeAttribute("data-theme");
    r.style.setProperty("--fs", S.cfg.fonte + "px"); r.setAttribute("data-obj", S.obj);
  });
  const ir = (r) => N.ui.ir(r);
  const atual = PAI[rota] || rota;
  const prova = rota === "questao";
  let tela;
  if (rota === "aprender" && n.getAp()) tela = <Aprender />;
  else if (rota === "questao" && n.getSess()) tela = <Questao />;
  else if (rota === "resultado" && n.getSess()) tela = <Resultado />;
  else if (rota === "cards" && n.getFc()) tela = <Cards />;
  else if (rota === "lab") tela = <Lab />;
  else if (rota === "modos") tela = <Modos />;
  else if (rota === "contas") tela = <Contas />;
  else if (rota === "tutor") tela = <Tutor />;
  else if (rota === "ouvir") tela = <Ouvir />;
  else if (rota === "caderno") tela = <CadernoTela />;
  else if (rota === "desafios") tela = <Desafios />;
  else if (rota === "trilha" || rota === "aprender") tela = <Trilha />;
  else if (rota === "treinar" || rota === "questao" || rota === "resultado") tela = <Treinar />;
  else if (rota === "revisar" || rota === "cards") tela = <Treinar revisar />;
  else if (rota === "mais") tela = <Mais />;
  else tela = <Painel />;
  const nv = n.nivelXP(S.xp);
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[264px_minmax(0,1fr)]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-acc focus:px-3 focus:py-2 focus:text-sobre-acc">Pular para o conteúdo</a>
      <aside className="vidro sticky top-0 hidden h-dvh flex-col gap-5 border-r border-risco p-4 md:flex">
        <div className="flex items-center gap-3"><div className="mao grid size-10 place-items-center rounded-xl bg-acc text-lg font-bold text-sobre-acc">MA</div><div><b className="font-display block text-lg leading-tight">Missão Aprovação</b><span className="text-xs text-apagado">Nível {nv} · <span className="num">{S.xp}</span> XP</span></div></div>
        <Objetivos vertical />
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {NAV.map(([r, nome, Ic]) => (
            <a key={r} href={"#" + r} onClick={(e) => { e.preventDefault(); ir(r); }} aria-current={atual === r ? "page" : undefined} className={cn("relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-bold transition-colors", atual === r ? "text-giz" : "text-apagado hover:bg-folha-2 hover:text-giz")}>
              {atual === r && <motion.span layoutId="nav-side" className="absolute inset-0 rounded-xl bg-folha-2 shadow-[inset_3px_0_0_var(--acc)]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <Ic className="relative size-5" /><span className="relative">{nome}</span></a>))}
        </nav>
        <div className="mt-auto flex items-center gap-2 text-sm text-apagado"><Flame className="size-4 text-enem" /> Ofensiva: <b className="num text-giz">{n.ofensiva()}</b> dia(s)</div>
      </aside>
      <div className="min-w-0">
        {!prova && (
          <header className="vidro sticky top-0 z-30 flex flex-col gap-2 border-b border-risco px-4 pb-2 pt-[calc(10px+env(safe-area-inset-top))] md:hidden">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><div className="mao grid size-9 place-items-center rounded-xl bg-acc font-bold text-sobre-acc">MA</div><div><b className="font-display block leading-tight">Missão Aprovação</b><span className="text-xs text-apagado">Nível {nv} · ofensiva <span className="num">{n.ofensiva()}</span></span></div></div>
              <a href="#tutor" onClick={(e) => { e.preventDefault(); ir("tutor"); }} className="grid size-10 place-items-center rounded-xl border border-risco-2 bg-folha-2" aria-label="Abrir tutor"><MessageCircle className="size-5" /></a></div>
            <Objetivos />
          </header>)}
        <main id="conteudo" className={cn("mx-auto w-full max-w-3xl px-4 pt-5 md:px-8 md:pt-8", prova ? "pb-10" : "pb-[calc(110px+env(safe-area-inset-bottom))] md:pb-12")}>
          <AnimatePresence mode="wait">
            <motion.div key={rota + S.obj} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, pointerEvents: "none" }} transition={{ duration: .22, ease: [.32, .72, 0, 1] }}>{tela}</motion.div>
          </AnimatePresence>
        </main>
      </div>
      {!prova && (
        <nav aria-label="Principal" className="vidro fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-risco pb-[env(safe-area-inset-bottom)] md:hidden">
          {NAV.map(([r, nome, Ic]) => (
            <a key={r} href={"#" + r} onClick={(e) => { e.preventDefault(); ir(r); }} aria-current={atual === r ? "page" : undefined} className={cn("relative flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-bold", atual === r ? "text-giz" : "text-apagado")}>
              {atual === r && <motion.span layoutId="nav-bottom" className="absolute top-2 h-8 w-14 rounded-full bg-[color-mix(in_srgb,var(--acc)_20%,transparent)]" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <Ic className={cn("relative size-5", atual === r && "text-acc")} /><span className="relative">{nome}</span></a>))}
        </nav>)}
      <Toast />
      <Rascunho />
    </div>
  );
}
