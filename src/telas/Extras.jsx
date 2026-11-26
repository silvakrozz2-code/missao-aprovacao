import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Headphones, NotebookPen, Search, Trophy, Medal, Check, Flame, ChevronRight } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Card, Badge } from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { NumberTicker } from "@/components/efeitos/efeitos.jsx";
import { Cabeca } from "./comum.jsx";
import { vozesPt, salvarVoz, ehNatural, vozAtual, lerTexto, pararLeitura, destravarLeitura, ehServidor, VOZES_SERVIDOR, VOZES_GEMINI } from "@/nucleo/vozes.js";
import { Resumo, resumoQualquer } from "./Tema.jsx";

const campo = "min-h-11 w-full rounded-xl border border-risco-2 bg-folha-2 px-3 text-giz";

/* ───────── Modo ônibus: ouvir resumos e lei seca em sequência */
function montarFila(n, o, fonte) {
  const S = []; const resumoDe = (t) => resumoQualquer(n, o, t);
  const doTema = (t) => { const r = resumoDe(t); if (!r) return; S.push({ tema: t, rot: "Tema", txt: t }); S.push({ tema: t, rot: "O que mais cai", txt: r.cai }); r.t.forEach((x) => S.push({ tema: t, rot: "Resumo", txt: x })); S.push({ tema: t, rot: "Macete", txt: r.macete }); };
  if (fonte === "fracos") n.temasFracos(o, 5).forEach((f) => doTema(f.tema));
  else if (fonte === "cards") n.CARDS[o].forEach((c) => { S.push({ tema: c.tema, rot: "Pergunta", txt: c.frente }); S.push({ tema: c.tema, rot: "Resposta", txt: c.verso }); });
  else n.TEMAS_MAT[o][fonte]?.forEach(doTema);
  return S;
}
export function Ouvir() {
  const n = useNucleo(); const o = n.getS().obj; const d = n.OBJS[o];
  const [fonte, setFonte] = useState("fracos"); const [vel, setVel] = useState(1);
  const [fila, setFila] = useState(() => montarFila(n, o, "fracos")); const [i, setI] = useState(0); const [tocando, setTocando] = useState(false);
  const vivo = useRef({ tocando: false, i: 0, vel: 1, fila: [] });
  vivo.current.fila = fila; vivo.current.vel = vel;
  const ss = typeof window !== "undefined" ? window.speechSynthesis : null;
  const falarEm = (k) => {
    const f = vivo.current.fila; if (k >= f.length) { parar(); return; }
    vivo.current.i = k; setI(k); pararLeitura();
    const texto = f[k].rot === "Tema" ? `Tema: ${f[k].txt}.` : f[k].txt;
    lerTexto(texto, vivo.current.vel, () => { if (vivo.current.tocando && vivo.current.i === k) setTimeout(() => vivo.current.tocando && falarEm(k + 1), f[k].rot === "Pergunta" ? 1800 : 350); });
  };
  const tocar = () => { if (!ss && !ehServidor(vozAtual())) { n.ui.toast("Este navegador não tem leitura em voz alta."); return; } destravarLeitura(); vivo.current.tocando = true; setTocando(true); falarEm(vivo.current.i); };
  const parar = () => { vivo.current.tocando = false; setTocando(false); pararLeitura(); };
  const pular = (k) => { const x = Math.max(0, Math.min(fila.length - 1, k)); vivo.current.i = x; setI(x); if (vivo.current.tocando) falarEm(x); };
  useEffect(() => () => { vivo.current.tocando = false; pararLeitura(); }, []);
  const trocar = (f) => { parar(); setFonte(f); const nf = montarFila(n, o, f); setFila(nf); vivo.current.i = 0; setI(0); };
  const atual = fila[i];
  return (
    <div className="flex flex-col gap-5">
      <Cabeca eyebrow={d.nome} titulo="Ouvir">Resumos e lei seca lidos em voz alta, um atrás do outro. Bom para o ônibus ou a academia. No cartão de pergunta há uma pausa para você responder de cabeça.</Cabeca>
      <label className="flex flex-col gap-1.5 text-sm font-bold">O que ouvir
        <select className={campo} value={fonte} onChange={(e) => trocar(e.target.value)}>
          <option value="fracos">Resumos dos seus temas mais fracos</option>
          <option value="cards">Lei seca e números (todos os flashcards)</option>
          {d.materias.map((m) => <option key={m.id} value={m.id}>Resumos de {m.nome}</option>)}
        </select></label>
      <section className="relative isolate flex flex-col gap-4 overflow-hidden rounded-3xl border border-risco bg-[linear-gradient(160deg,var(--folha-2),var(--folha))] p-5">
        {fila.length ? (<>
          <div className="flex items-center justify-between gap-2"><Badge tone={atual.rot === "Macete" || atual.rot === "O que mais cai" ? "marca" : "acc"}>{atual.rot}</Badge><span className="num text-sm text-apagado">{i + 1}/{fila.length}</span></div>
          <span className="truncate text-sm font-bold text-apagado">{atual.tema}</span>
          <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} aria-live="polite" className="min-h-32 text-xl leading-relaxed md:text-2xl">{atual.txt}</motion.p>
          <Progress value={n.pct(i + 1, fila.length)} label="Posição na lista" />
          <div className="flex items-center justify-center gap-3">
            <Button size="icon" variant="secondary" aria-label="Anterior" onClick={() => pular(i - 1)}><SkipBack /></Button>
            <button type="button" onClick={tocando ? parar : tocar} aria-label={tocando ? "Pausar" : "Tocar"} className="grid size-16 place-items-center rounded-full bg-acc text-sobre-acc shadow-[0_14px_36px_-12px_var(--acc)] active:scale-95">{tocando ? <Pause className="size-7 fill-current" /> : <Play className="ml-1 size-7 fill-current" />}</button>
            <Button size="icon" variant="secondary" aria-label="Próximo" onClick={() => pular(i + 1)}><SkipForward /></Button>
          </div>
          <div role="group" aria-label="Velocidade" className="flex justify-center gap-1">{[.9, 1, 1.25, 1.5].map((v) => <button key={v} type="button" aria-pressed={vel === v} onClick={() => setVel(v)} className={cn("num min-h-9 rounded-lg px-3 text-sm font-bold", vel === v ? "bg-giz text-lousa" : "bg-folha-3 text-apagado")}>{String(v).replace(".", ",")}x</button>)}</div>
        </>) : <p className="text-apagado">Nada para ouvir nesta escolha ainda.</p>}
      </section>
      <EscolherVoz />
      <p className="text-sm text-apagado">A voz é a do seu aparelho. Em alguns aparelhos ela para quando a tela apaga; se acontecer, deixe a tela ligada com o brilho no mínimo.</p>
    </div>
  );
}

export function EscolherVoz() {
  const [lista, setLista] = useState(() => vozesPt()); const [atual, setAtual] = useState(() => vozAtual());
  useEffect(() => {
    const s = window.speechSynthesis; if (!s) return;
    const at = () => { const l = vozesPt(); setLista(l); setAtual((a) => a || vozAtual()); };
    at(); s.addEventListener?.("voiceschanged", at); return () => s.removeEventListener?.("voiceschanged", at);
  }, []);
  const [aviso, setAviso] = useState("");
  const testar = () => {
    destravarLeitura(); pararLeitura(); setAviso("");
    lerTexto("Oi! Esta é a voz que vai ler os seus resumos. Vamos estudar?", 1, null,
      (motivo) => setAviso(motivo ? `A voz de IA não tocou agora: ${motivo} Usei a voz do aparelho.` : "A voz de IA não tocou agora. Usei a voz do aparelho."));
  };
  const temNatural = lista.some(ehNatural);
  const vozGemini = atual.startsWith("g:"); const vozOpenai = atual.startsWith("openai:");
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-risco bg-folha p-4">
      <label className="flex flex-col gap-1.5 text-sm font-bold">Voz da leitura
        <select className={campo} value={atual} onChange={(e) => { setAtual(e.target.value); salvarVoz(e.target.value); }}>
          <optgroup label="Vozes de IA grátis (Gemini, com limite diário)">
            {VOZES_GEMINI.map(([v, r]) => <option key={v} value={v}>{r}</option>)}
          </optgroup>
          <optgroup label="Vozes de IA (OpenAI — precisam da chave paga)">
            {VOZES_SERVIDOR.map(([v, r]) => <option key={v} value={v}>{r}</option>)}
          </optgroup>
          <optgroup label="Vozes deste aparelho">
            {lista.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/^Microsoft /, "").replace(/ - Portuguese \(Brazil\)/, "")}{ehNatural(v) ? " · natural" : " · robótica"}</option>)}
          </optgroup>
        </select></label>
      <div className="flex flex-wrap items-center gap-2"><Button size="sm" variant="secondary" onClick={testar}><Play /> Testar voz</Button>
        {vozGemini
          ? <span className="text-sm text-apagado">Voz de IA grátis, natural. Tem um limite diário; quando ele acaba, a leitura passa a usar a voz do aparelho automaticamente.</span>
          : vozOpenai
          ? <span className="text-sm text-apagado">As vozes da OpenAI só tocam quando a chave OPENAI_API_KEY (paga) está na Vercel. Sem ela, a leitura usa a voz do aparelho.</span>
          : !temNatural && <span className="text-sm text-apagado">Este navegador só tem voz robótica. Para voz natural, igual à de assistente, abra o app no Microsoft Edge (vozes Francisca e Antonio). No celular, instale as vozes do Google em Configurações › Texto para fala.</span>}</div>
      {aviso && <span className="text-sm font-semibold text-red-600">{aviso}</span>}
    </div>
  );
}

/* ───────── Caderno: tudo o que você anotou e marcou, por tema */
export function CadernoTela() {
  const n = useNucleo(); const o = n.getS().obj; const d = n.OBJS[o]; const p = n.P();
  const [busca, setBusca] = useState(""); const [aberto, setAberto] = useState(null);
  const itens = d.materias.flatMap((m) => n.TEMAS_MAT[o][m.id].map((t) => ({ t, m, nota: p.notas[t] || "", marcas: (p.marcaTexto || {})[t] || [] })))
    .filter((x) => resumoQualquer(n, o, x.t)).filter((x) => !busca || (x.t + x.nota + x.marcas.map((m) => m.txt).join(" ")).toLowerCase().includes(busca.toLowerCase()));
  const com = itens.filter((x) => x.nota || x.marcas.length), sem = itens.filter((x) => !x.nota && !x.marcas.length);
  const Linha = ({ x }) => (
    <button type="button" onClick={() => setAberto(x.t)} className="flex w-full flex-col gap-1 rounded-2xl border border-risco bg-folha p-3.5 text-left hover:border-risco-2">
      <span className="flex items-center justify-between gap-2"><b className="leading-snug">{x.t}</b>{x.marcas.length > 0 && <Badge tone="marca">{x.marcas.length} marcado{x.marcas.length > 1 ? "s" : ""}</Badge>}</span>
      <span className="text-xs text-apagado">{x.m.nome}</span>
      {x.nota && <span className="mao line-clamp-2 text-lg text-giz">{x.nota}</span>}
      {!x.nota && x.marcas[0] && <span className="line-clamp-2 text-sm"><mark className="rounded-[3px] bg-[color-mix(in_srgb,var(--marca)_40%,transparent)] px-0.5 text-giz">{x.marcas[0].txt}</mark></span>}
    </button>);
  return (
    <div className="flex flex-col gap-5">
      <Cabeca eyebrow={d.nome} titulo="Caderno">Suas anotações e trechos marcados, organizados por tema. Abra um tema para escrever ou passar o marca-texto no resumo.</Cabeca>
      <label className="relative"><span className="sr-only">Buscar no caderno</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-apagado" />
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar tema ou anotação" className={cn(campo, "pl-9")} /></label>
      {com.length > 0 && <section className="flex flex-col gap-2"><h2 className="mao text-xl text-marca">Com anotações</h2>{com.map((x) => <Linha key={x.t} x={x} />)}</section>}
      <section className="flex flex-col gap-2"><h2 className="mao text-xl text-marca">{com.length ? "Ainda em branco" : "Todos os temas"}</h2>
        <div className="grid gap-2 sm:grid-cols-2">{sem.map((x) => <Linha key={x.t} x={x} />)}</div></section>
      <Resumo key={aberto || "x"} tema={aberto} aba="caderno" onClose={() => setAberto(null)} />
    </div>
  );
}

/* ───────── Desafios da semana e ranking pessoal */
export function DesafiosCard({ compacto }) {
  const n = useNucleo(); const o = n.getS().obj; const { lista } = n.desafiosDaSemana(o);
  const feitos = lista.filter((x) => x.feito).length;
  return (
    <Card>
      <div className="flex items-center justify-between gap-2"><h2 className="inline-flex items-center gap-2 text-xl font-bold"><Trophy className="size-5 text-marca" />Desafios da semana</h2><Badge tone={feitos === lista.length ? "certo" : "acc"}><span className="num">{feitos}/{lista.length}</span></Badge></div>
      <ul className="flex flex-col gap-2.5">{(compacto ? lista.filter((x) => !x.feito).slice(0, 3) : lista).map((x) => (
        <li key={x.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
          <span className={cn("text-sm", x.feito && "text-apagado line-through")}>{x.nome}</span><span className="num text-sm">{x.feito ? <Check className="size-4 text-certo" /> : `${Math.min(x.v, x.meta)}/${x.meta}`}</span>
          <Progress className="col-span-2 h-1.5" tone={x.feito ? "certo" : "acc"} value={n.pct(Math.min(x.v, x.meta), x.meta)} label={x.nome} /></li>))}</ul>
      {compacto && <Button size="sm" variant="secondary" className="self-start" onClick={() => n.ui.ir("desafios")}>Ver desafios e ranking <ChevronRight /></Button>}
      <span className="text-xs text-apagado">Cada desafio cumprido vale 60 XP. Os desafios renovam toda segunda-feira.</span>
    </Card>
  );
}
export function Desafios() {
  const n = useNucleo(); const o = n.getS().obj; const d = n.OBJS[o];
  const { semanas, pos, recorde } = n.rankingSemanas(o, 8); const max = Math.max(1, ...semanas.map((s) => s.q));
  const atual = semanas[0];
  return (
    <div className="flex flex-col gap-5">
      <Cabeca eyebrow={d.nome} titulo="Desafios e ritmo">Você disputa com você mesmo: cada semana entra no seu ranking pessoal pelo número de questões resolvidas.</Cabeca>
      <section className="relative isolate flex flex-wrap items-end gap-x-6 gap-y-2 overflow-hidden rounded-3xl border border-risco bg-[linear-gradient(160deg,var(--folha-2),var(--folha))] p-5">
        <span className="flex items-end gap-2"><Medal className="mb-2 size-8 text-marca" /><span className="font-display text-7xl font-extrabold leading-none text-acc">#<NumberTicker value={pos} /></span></span>
        <span className="pb-1"><b className="text-lg">esta semana entre as suas últimas 8</b><br /><span className="text-sm text-apagado">{atual.q >= recorde.q && atual.q > 0 ? "É o seu recorde!" : `Faltam ${recorde.q - atual.q + 1} questões para bater o recorde (${recorde.q}).`}</span></span>
      </section>
      <DesafiosCard />
      <Card>
        <h2 className="text-xl font-bold">Ranking pessoal</h2>
        <ol className="flex flex-col gap-2">{[...semanas].sort((a, b) => b.q - a.q || b.dias - a.dias).map((s, k) => (
          <li key={s.ini} className={cn("grid grid-cols-[28px_minmax(0,1fr)] items-center gap-3 rounded-xl px-2 py-1.5", s.atual && "bg-folha-2")}>
            <span className="num text-right font-bold text-apagado">{k + 1}º</span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="flex justify-between gap-2 text-sm"><span>{s.atual ? <b className="text-acc">Esta semana</b> : `Semana de ${n.fmtData(s.ini)}`}</span><span className="num text-apagado">{s.q} questões · {s.dias} dia{s.dias === 1 ? "" : "s"}</span></span>
              <span className="h-2 overflow-hidden rounded-full bg-folha-3"><motion.i initial={{ width: 0 }} animate={{ width: `${(s.q / max) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 22, delay: .03 * k }} className={cn("block h-full rounded-full", s.atual ? "bg-acc" : "bg-risco-2")} /></span>
            </span>
          </li>))}</ol>
      </Card>
      <p className="inline-flex items-center gap-2 text-sm text-apagado"><Flame className="size-4 text-enem" />Ofensiva atual: <b className="num text-giz">{n.ofensiva()}</b> dia(s) seguidos.</p>
    </div>
  );
}

export const AtalhoExtra = { Headphones, NotebookPen };
