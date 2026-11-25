import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, Heart, Lock, Star, Delete, Check, X, Timer, RotateCcw, ArrowRight } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Card } from "@/components/ui/card.jsx";
import { Cabeca } from "./comum.jsx";
import { TRILHAS, TRILHA, VIDAS, gerarNivel, confere, respTxt } from "@/nucleo/contas.js";

/* ───────── progresso salvo no aparelho (chave própria, não mexe no resto do app) */
const KEY = "missao-aprovacao-contas-v1";
const lerProg = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const gravarProg = (p) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* sem armazenamento */ } };
const estrelasDe = (prog, id) => prog[id]?.e || [];
const liberado = (prog, id, i) => i === 0 || (estrelasDe(prog, id)[i - 1] || 0) > 0;
const totalEstrelas = (prog, id) => estrelasDe(prog, id).reduce((a, b) => a + (b || 0), 0);
const proximoNivel = (prog, id) => { const e = estrelasDe(prog, id); const n = TRILHA[id].niveis.length; for (let i = 0; i < n; i++) if (!e[i]) return i; return n - 1; };

const TINTA = "#0f1513"; // texto escuro sobre as cores das trilhas (legível nos dois temas)
const COM_MENOS = new Set(["sinais", "potencia", "raiz", "expressoes"]);

/* ───────── desenho da conta: frações empilhadas, raiz com traço, potência com expoente */
function Tok({ t }) {
  if (t == null) return null;
  if (typeof t === "string") {
    const op = /^[+−×÷=]$/.test(t) || /^[()[\]]$/.test(t);
    const palavra = /[a-zà-ú]/i.test(t);
    return <span className={cn(op ? "px-1 text-apagado" : palavra ? "font-sans text-[.5em] font-bold text-apagado" : "")}>{t}</span>;
  }
  if (t.f) return (
    <span className="mx-1 inline-flex flex-col items-center align-middle text-[.72em] leading-none" aria-label={`${t.f[0]} sobre ${t.f[1]}`}>
      <span className="px-1 pb-1">{t.f[0]}</span><span className="h-[3px] w-full rounded bg-current" /><span className="px-1 pt-1">{t.f[1]}</span>
    </span>);
  if (t.pot) return <span className="inline-flex items-start"><Tok t={t.pot[0]} /><sup className="ml-0.5 text-[.55em] leading-none text-marca">{t.pot[1]}</sup></span>;
  if (t.raiz) return (
    <span className="inline-flex items-stretch">
      {t.i && <sup className="-mr-1 self-start text-[.45em] text-marca">{t.i}</sup>}
      <span className="pr-0.5">√</span>
      <span className="inline-flex items-center gap-1 border-t-[3px] border-current px-1">{t.raiz.map((x, k) => <Tok key={k} t={x} />)}</span>
    </span>);
  return null;
}
const Conta = ({ exp, className }) => (
  <div className={cn("num flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 font-bold leading-none", className)}>{exp.map((t, k) => <Tok key={k} t={t} />)}</div>
);

function Estrelas({ n = 0, tam = "size-4", animar }) {
  const reduz = useReducedMotion();
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} de 3 estrelas`}>
      {[0, 1, 2].map((k) => (
        <motion.span key={k} initial={animar && !reduz ? { scale: 0, rotate: -40 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ delay: animar ? .25 + k * .22 : 0, type: "spring", stiffness: 380, damping: 16 }}>
          <Star className={cn(tam, k < n ? "fill-marca text-marca" : "text-risco-2")} strokeWidth={2.2} />
        </motion.span>))}
    </span>
  );
}

/* ───────── tela 1: escolher a operação */
function Mapa({ prog, abrir }) {
  return (
    <div className="flex flex-col gap-5">
      <Cabeca eyebrow="Treinar" titulo="Treino de contas">Cada operação tem sua trilha de 10 níveis, do mais fácil ao nível prova. Cada conta tem tempo para responder e você tem 3 vidas. Termine o nível para abrir o próximo.</Cabeca>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TRILHAS.map((t) => {
          const est = totalEstrelas(prog, t.id), max = t.niveis.length * 3, feitos = estrelasDe(prog, t.id).filter(Boolean).length;
          return (
            <button key={t.id} onClick={() => abrir(t.id)} className="group flex flex-col gap-3 rounded-2xl border border-risco bg-folha p-4 text-left transition-[transform,border-color] hover:-translate-y-0.5 hover:border-risco-2">
              <span className="num grid size-12 place-items-center rounded-2xl text-xl font-bold shadow-[inset_0_-4px_0_rgba(0,0,0,.18)]" style={{ background: t.cor, color: TINTA }}>{t.sim}</span>
              <span><b className="block text-lg leading-tight">{t.nome}</b><span className="text-sm text-apagado">Nível <span className="num">{Math.min(feitos + 1, t.niveis.length)}</span> de <span className="num">{t.niveis.length}</span></span></span>
              <span className="h-2 overflow-hidden rounded-full bg-folha-3"><span className="block h-full rounded-full transition-[width]" style={{ width: `${(est / max) * 100}%`, background: t.cor }} /></span>
              <span className="inline-flex items-center gap-1 text-sm text-apagado"><Star className="size-4 fill-marca text-marca" /><span className="num">{est}/{max}</span></span>
            </button>);
        })}
      </div>
    </div>
  );
}

/* ───────── tela 2: caminho de níveis da operação (estilo trilha) */
function Caminho({ id, prog, voltar, jogar }) {
  const t = TRILHA[id]; const atual = proximoNivel(prog, id); const e = estrelasDe(prog, id);
  const desloc = [0, 34, 54, 34, 0, -34, -54, -34, 0, 34];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={voltar} aria-label="Voltar às operações"><ChevronLeft /></Button>
        <span className="num grid size-11 place-items-center rounded-xl text-lg font-bold" style={{ background: t.cor, color: TINTA }}>{t.sim}</span>
        <div><h1 className="font-display text-3xl font-extrabold leading-tight">{t.nome}</h1><span className="text-sm text-apagado"><span className="num">{totalEstrelas(prog, id)}</span> de <span className="num">{t.niveis.length * 3}</span> estrelas</span></div>
      </div>
      <ol className="flex flex-col items-center gap-4 py-2">
        {t.niveis.map((nv, i) => {
          const livre = liberado(prog, id, i), eh = i === atual && livre;
          return (
            <li key={i} className="flex flex-col items-center gap-1.5" style={{ transform: `translateX(${desloc[i % desloc.length]}%)` }}>
              {eh && <motion.span initial={{ y: 4, opacity: 0 }} animate={{ y: [0, -4, 0], opacity: 1 }} transition={{ y: { repeat: Infinity, duration: 1.6 } }} className="mao rounded-xl border border-risco-2 bg-folha-2 px-3 py-0.5 text-sm font-bold text-giz">{e[i] ? "melhorar" : "começar"}</motion.span>}
              <button disabled={!livre} onClick={() => jogar(i)} aria-label={`Nível ${i + 1}: ${nv.nome}${livre ? "" : " (bloqueado)"}`}
                className={cn("num grid size-[4.5rem] place-items-center rounded-full text-2xl font-bold transition-transform active:translate-y-1", livre ? "shadow-[inset_0_-6px_0_rgba(0,0,0,.22)] hover:scale-105" : "bg-folha-3 text-apagado", eh && "ring-4 ring-offset-4 ring-offset-lousa")}
                style={livre ? { background: t.cor, color: TINTA, ...(eh ? { "--tw-ring-color": t.cor } : {}) } : undefined}>
                {livre ? i + 1 : <Lock className="size-6" />}
              </button>
              <span className={cn("max-w-40 text-center text-sm font-bold leading-tight", !livre && "text-apagado")}>{nv.nome}</span>
              <span className="inline-flex items-center gap-2 text-xs text-apagado"><Estrelas n={e[i] || 0} tam="size-3.5" /><span className="inline-flex items-center gap-0.5"><Timer className="size-3" /><span className="num">{nv.t}s</span></span></span>
            </li>);
        })}
      </ol>
    </div>
  );
}

/* ───────── teclado numérico na tela */
function Teclado({ id, aperta }) {
  const tr = TRILHA[id]; const virg = tr.teclas !== "int"; const barra = tr.teclas === "frac"; const menos = COM_MENOS.has(id);
  const extras = [menos && ["−", "-"], virg && [",", ","], barra && ["/", "/"]].filter(Boolean);
  const tecla = "num grid min-h-14 place-items-center rounded-2xl border border-risco-2 bg-folha-2 text-2xl font-bold shadow-[inset_0_-3px_0_var(--risco)] transition-transform active:translate-y-0.5 active:shadow-none select-none";
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Teclado numérico">
      {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((d) => <button key={d} type="button" className={tecla} onClick={() => aperta(d)}>{d}</button>)}
      {extras.length ? <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${extras.length}, minmax(0,1fr))` }}>
        {extras.map(([r, v]) => <button key={v} type="button" className={cn(tecla, "text-xl")} onClick={() => aperta(v)} aria-label={v === "-" ? "menos" : v === "," ? "vírgula" : "barra de fração"}>{r}</button>)}
      </div> : <span />}
      <button type="button" className={tecla} onClick={() => aperta("0")}>0</button>
      <button type="button" className={tecla} onClick={() => aperta("⌫")} aria-label="Apagar"><Delete className="size-6" /></button>
    </div>
  );
}

/* ───────── tela 3: o jogo */
function Jogo({ id, nivel, sair, fim }) {
  const tr = TRILHA[id]; const nv = tr.niveis[nivel];
  const [contas] = useState(() => gerarNivel(id, nivel));
  const [i, setI] = useState(0);
  const [vidas, setVidas] = useState(VIDAS);
  const [txt, setTxt] = useState("");
  const [fase, setFase] = useState("resp"); // resp | certo | errado
  const [motivo, setMotivo] = useState(null);
  const [erros, setErros] = useState(0);
  const [restante, setRestante] = useState(nv.t * 1000);
  const t0 = useRef(performance.now()); const tempos = useRef([]);
  const c = contas[i];

  const avancar = useCallback(() => {
    const resumo = { id, nivel, erros, total: contas.length, tempos: tempos.current };
    if (vidas <= 0) return fim({ ...resumo, venceu: false, acertos: i + 1 - erros });
    if (i + 1 >= contas.length) return fim({ ...resumo, venceu: true, acertos: contas.length - erros });
    setI(i + 1); setTxt(""); setFase("resp"); setMotivo(null); setRestante(nv.t * 1000); t0.current = performance.now();
  }, [i, vidas, erros, contas.length, fim, id, nivel, nv.t]);

  const errar = useCallback((porTempo) => {
    tempos.current.push(nv.t); setFase("errado"); setMotivo(porTempo ? "tempo" : "conta");
    setVidas((v) => v - 1); setErros((e) => e + 1);
    try { navigator.vibrate?.(90); } catch { /* sem vibração */ }
  }, [nv.t]);

  const txtRef = useRef(""); txtRef.current = txt;
  const conferir = useCallback(() => {
    const txt = txtRef.current;
    if (fase !== "resp" || !txt) return;
    if (confere(c, txt)) { tempos.current.push((performance.now() - t0.current) / 1000); setFase("certo"); }
    else errar(false);
  }, [fase, c, errar]);

  // cronômetro
  useEffect(() => {
    if (fase !== "resp") return;
    const h = setInterval(() => {
      const r = nv.t * 1000 - (performance.now() - t0.current);
      setRestante(Math.max(0, r));
      if (r <= 0) { clearInterval(h); errar(true); }
    }, 100);
    return () => clearInterval(h);
  }, [fase, i, nv.t, errar]);

  // acertou: segue sozinho
  useEffect(() => { if (fase !== "certo") return; const h = setTimeout(avancar, 650); return () => clearTimeout(h); }, [fase, avancar]);

  const aperta = useCallback((k) => {
    if (fase === "errado" && k === "Enter") return avancar();
    if (fase !== "resp") return;
    if (k === "Enter") return conferir();
    if (k === "⌫") return setTxt((s) => s.slice(0, -1));
    setTxt((s) => {
      if (s.length >= 12) return s;
      if (k === "-") return s.startsWith("-") ? s.slice(1) : "-" + s;
      if (k === "," && (s.includes(",") || s.includes("/"))) return s;
      if (k === "/" && (s.includes("/") || s.includes(",") || !/\d$/.test(s))) return s;
      return s + k;
    });
  }, [fase, conferir, avancar]);

  // teclado físico (computador)
  useEffect(() => {
    const teclas = TRILHA[id].teclas;
    const f = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const m = e.key;
      const k = /^\d$/.test(m) ? m : (m === "." || m === ",") ? (teclas === "int" ? null : ",") : m === "-" ? "-" : m === "/" ? (teclas === "frac" ? "/" : null) : m === "Backspace" ? "⌫" : m === "Enter" ? "Enter" : null;
      if (k) { e.preventDefault(); aperta(k); }
    };
    addEventListener("keydown", f); return () => removeEventListener("keydown", f);
  }, [aperta, id]);

  const frac = restante / (nv.t * 1000);
  const feitas = i + (fase === "resp" ? 0 : 1);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-lousa px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))]">
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={sair} aria-label="Sair do nível"><X /></Button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-folha-3" role="progressbar" aria-label="Contas do nível" aria-valuemin={0} aria-valuemax={contas.length} aria-valuenow={feitas}>
          <motion.div className="h-full rounded-full" style={{ background: tr.cor }} initial={{ width: 0 }} animate={{ width: `${(feitas / contas.length) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 26 }} />
        </div>
        <span className="inline-flex items-center gap-1 font-bold text-erro" aria-label={`${vidas} vidas`}>
          {Array.from({ length: VIDAS }, (_, k) => <motion.span key={k} animate={k >= vidas ? { scale: [1.3, 1], opacity: .3 } : { scale: 1, opacity: 1 }}><Heart className={cn("size-5", k < vidas && "fill-erro")} /></motion.span>)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-apagado"><span>Nível <span className="num">{nivel + 1}</span> · {nv.nome}</span><span className="num">{i + 1}/{contas.length}</span></div>

      <Card className="relative items-center gap-5 overflow-hidden py-8">
        <span className={cn("num absolute right-3 top-3 inline-flex items-center gap-1 text-sm font-bold", frac < .3 ? "text-erro" : "text-apagado")}><Timer className="size-4" />{Math.ceil(restante / 1000)}s</span>
        <Conta key={i} exp={c.exp} className={c.exp.length > 8 ? "text-[1.9rem] sm:text-4xl" : "text-[2.6rem] sm:text-5xl"} />
        <div className={cn("num flex min-h-16 min-w-40 items-center justify-center rounded-2xl border-2 px-4 text-4xl font-bold transition-colors",
          fase === "certo" ? "border-certo bg-certo-suave text-certo" : fase === "errado" ? "border-erro bg-erro-suave text-erro" : "border-risco-2 bg-folha-2")} aria-live="polite" aria-label="Sua resposta">
          {txt.replace("-", "−") || <span className="text-apagado">?</span>}
          {fase === "resp" && <motion.span className="ml-0.5 inline-block h-9 w-[3px] bg-acc" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} />}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-folha-3" aria-hidden>
          <div className={cn("h-full transition-[width] duration-100 ease-linear", frac < .3 ? "bg-erro" : "bg-acc")} style={{ width: `${frac * 100}%` }} />
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {fase === "errado" ? (
          <motion.div key="err" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 rounded-2xl border-2 border-erro bg-erro-suave p-4">
            <b className="mao inline-flex items-center gap-2 text-xl text-erro"><X className="size-5" strokeWidth={3} />{motivo === "tempo" ? "Acabou o tempo" : "Não foi dessa vez"}</b>
            <span>Resposta certa: <b className="num text-xl">{respTxt(c)}</b></span>
            {c.dica && <span className="text-sm"><b className="mao text-base text-marca">Macete:</b> {c.dica}</span>}
            <Button size="lg" autoFocus onClick={avancar}>{vidas <= 0 ? "Ver resultado" : "Continuar"} <ArrowRight /></Button>
          </motion.div>
        ) : fase === "certo" ? (
          <motion.div key="ok" initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="mao flex min-h-[19rem] items-start justify-center gap-2 pt-6 text-3xl font-bold text-certo"><Check className="size-8" strokeWidth={3} /> Certo!</motion.div>
        ) : (
          <motion.div key="kb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
            <Teclado id={id} aperta={aperta} />
            {c.forma === "irredutivel" && <span className="text-center text-sm text-apagado">Responda como fração irredutível, ex.: 3/4</span>}
            <Button size="lg" disabled={!txt} onClick={conferir}>Conferir</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}

/* ───────── tela 4: resultado do nível */
function Fim({ r, estrelas, recorde, xp, repetir, proximo, voltar }) {
  const tr = TRILHA[r.id]; const media = r.tempos.length ? r.tempos.reduce((a, b) => a + b, 0) / r.tempos.length : 0;
  const temProx = r.venceu && r.nivel + 1 < tr.niveis.length;
  return (
    <Card className="mx-auto w-full max-w-md items-center gap-4 py-8 text-center">
      <span className="mao text-2xl text-marca">{r.venceu ? (estrelas === 3 ? "perfeito!" : "nível concluído!") : "acabaram as vidas"}</span>
      <h1 className="font-display text-3xl font-extrabold leading-tight">{tr.nome} · nível <span className="num">{r.nivel + 1}</span></h1>
      {r.venceu ? <Estrelas n={estrelas} tam="size-12" animar /> : <Heart className="size-12 text-erro" />}
      {recorde && <span className="rounded-full bg-marca px-3 py-0.5 text-sm font-bold text-marca-tinta">Novo recorde de estrelas</span>}
      <dl className="grid w-full grid-cols-3 gap-2">
        {[["Acertos", `${r.acertos}/${r.total}`], ["Tempo médio", `${media.toFixed(1).replace(".", ",")}s`], ["XP", `+${xp}`]].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-folha-2 p-3"><dt className="text-xs font-bold text-apagado">{k}</dt><dd className="num text-xl font-bold">{v}</dd></div>))}
      </dl>
      <p className="text-sm text-apagado">{r.venceu ? (estrelas === 3 ? "Sem nenhum erro. As contas mudam toda vez, então dá para treinar de novo quando quiser." : "3 estrelas é terminar sem errar nenhuma. O próximo nível já está aberto.") : "As contas são novas a cada tentativa. Leia os macetes e tente de novo: terminar o nível abre o próximo."}</p>
      <div className="flex w-full flex-col gap-2">
        {temProx && <Button size="lg" onClick={proximo}>Próximo nível <ArrowRight /></Button>}
        <Button size="lg" variant={temProx ? "secondary" : "default"} onClick={repetir}><RotateCcw /> {r.venceu ? "Repetir nível" : "Tentar de novo"}</Button>
        <Button variant="ghost" onClick={voltar}>Voltar à trilha</Button>
      </div>
    </Card>
  );
}

let pedido = null; // permite abrir direto numa operação
export const abrirContas = (id, ir) => { pedido = id || null; ir("contas"); };

export default function Contas() {
  const n = useNucleo();
  const [prog, setProg] = useState(lerProg);
  const [v, setV] = useState(() => { const p = pedido; pedido = null; return p ? { modo: "trilha", id: p } : { modo: "mapa" }; });
  const [jogada, setJogada] = useState(0);
  useEffect(() => { scrollTo(0, 0); }, [v.modo]);

  const fim = useCallback((r) => {
    const atual = lerProg(); const reg = atual[r.id] || { e: [] }; const antes = reg.e[r.nivel] || 0;
    const estrelas = r.venceu ? Math.max(1, 3 - r.erros) : 0;
    if (estrelas > antes) { reg.e[r.nivel] = estrelas; atual[r.id] = reg; gravarProg(atual); setProg({ ...atual }); }
    const xpAntes = n.getS().xp; n.registrarModo(Math.max(0, r.acertos), r.total);
    let xp = n.getS().xp - xpAntes;
    if (estrelas > antes) { const bonus = (estrelas - antes) * 5; n.ganharXP(bonus); n.salvar(); xp += bonus; }
    setV({ modo: "fim", r, estrelas, recorde: estrelas > antes && antes > 0, xp });
  }, [n]);

  const jogar = (id, nivel) => { setJogada((x) => x + 1); setV({ modo: "jogo", id, nivel }); };
  if (v.modo === "jogo") return <Jogo key={jogada} id={v.id} nivel={v.nivel} sair={() => setV({ modo: "trilha", id: v.id })} fim={fim} />;
  if (v.modo === "fim") return <Fim {...v} repetir={() => jogar(v.r.id, v.r.nivel)} proximo={() => jogar(v.r.id, v.r.nivel + 1)} voltar={() => setV({ modo: "trilha", id: v.r.id })} />;
  if (v.modo === "trilha") return <Caminho id={v.id} prog={prog} voltar={() => setV({ modo: "mapa" })} jogar={(nivel) => jogar(v.id, nivel)} />;
  return <Mapa prog={prog} abrir={(id) => setV({ modo: "trilha", id })} />;
}
