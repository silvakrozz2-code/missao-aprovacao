import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCheck, Cable, TextCursorInput, Brain, Check, X, RotateCw, ArrowRight, Timer, PencilLine, GraduationCap } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Card, Badge } from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Faiscas } from "@/components/efeitos/efeitos.jsx";
import { Cabeca } from "./comum.jsx";
import { resumoQualquer } from "./Tema.jsx";

export const MODOS = [
  { id: "ce", nome: "Certo ou errado", desc: "Julgue se a alternativa responde a questão. Rápido como item de prova.", Ic: CheckCheck },
  { id: "colunas", nome: "Ligue as colunas", desc: "Junte cada pergunta à resposta certa, 5 cartões por rodada.", Ic: Cable },
  { id: "lacuna", nome: "Complete a lacuna", desc: "A palavra-chave do resumo some. Você escolhe qual era.", Ic: TextCursorInput },
  { id: "despejo", nome: "Despejo de memória", desc: "Escreva tudo o que lembra de um tema e compare com o resumo.", Ic: Brain },
];
let inicial = null;
export const abrirModo = (id, ir) => { inicial = id; ir("modos"); };

const embaralhar = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sem = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const campo = "min-h-11 w-full rounded-xl border border-risco-2 bg-folha-2 px-3 text-giz";

/* Placar de fim de rodada, igual em todos os modos */
function Fim({ acertos, total, rotulo = "acertos", onDeNovo, extra, voltam }) {
  const p = total ? acertos / total : 0;
  return (
    <Card className="items-center py-8 text-center">
      <span className="mao text-2xl text-marca">{p >= .8 ? "mandou bem!" : p >= .5 ? "tá no caminho" : "bora de novo"}</span>
      <b className="num font-display text-5xl font-extrabold">{acertos}<span className="text-apagado">/{total}</span></b>
      <span className="text-sm text-apagado">{rotulo}{voltam ? " · as questões que você errou voltam amanhã na revisão" : ""}</span>
      {extra}
      <Button size="lg" onClick={onDeNovo}><RotateCw />Outra rodada</Button>
    </Card>
  );
}

/* ───────── Certo ou errado */
function CertoErrado({ o, mat, onFim }) {
  const n = useNucleo();
  const itens = useMemo(() => {
    const pool = n.BANCO[o].filter((q) => !mat || n.TEMA_MAT[o][q.tema] === mat);
    return embaralhar(pool).slice(0, 10).map((q) => {
      const certo = Math.random() < .5; const erradas = q.alternativas.map((_, k) => k).filter((k) => k !== q.correta);
      return { q, certo, k: certo ? q.correta : erradas[(Math.random() * erradas.length) | 0] };
    });
  }, [o, mat]);
  const [i, setI] = useState(0); const [resp, setResp] = useState([]); const [faisca, setFaisca] = useState(null);
  const it = itens[i]; const r = resp[i];
  const julgar = (v) => { if (r != null || !it) return; const ok = v === it.certo; setResp((x) => { const y = [...x]; y[i] = ok; return y; }); if (ok) setFaisca(Date.now()); };
  useEffect(() => {
    const f = (e) => { if (e.target.closest?.("input,textarea,select")) return; const k = e.key.toLowerCase(); if (k === "c") julgar(true); else if (k === "e") julgar(false); else if (k === "enter" && r != null) prox(); };
    addEventListener("keydown", f); return () => removeEventListener("keydown", f);
  });
  const prox = () => { if (i + 1 >= itens.length) onFim(resp.filter(Boolean).length, itens.length, itens.filter((_, k) => !resp[k]).map((x) => x.q.id)); else setI(i + 1); };
  if (!it) return <Card><p>Ainda não há questões escritas para essa matéria.</p></Card>;
  return (
    <div className="flex flex-col gap-4">
      <Progress value={n.pct(i + (r != null ? 1 : 0), itens.length)} label="Itens julgados" />
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12, pointerEvents: "none" }} transition={{ duration: .18 }} className="relative flex flex-col gap-3 rounded-2xl border border-risco bg-folha p-5">
          <Faiscas disparo={faisca} />
          <div className="flex flex-wrap items-center justify-between gap-2"><Badge>{it.q.tema}</Badge><span className="num text-sm text-apagado">item {i + 1} de {itens.length}</span></div>
          <p className="text-[1.05rem] leading-relaxed">{it.q.enunciado}</p>
          <div className="rounded-xl border-l-4 border-marca bg-folha-2 px-4 py-3"><span className="mao block text-marca">resposta proposta</span><span className="text-lg font-bold leading-snug">{it.q.alternativas[it.k]}</span></div>
          <p className="text-sm text-apagado">Essa é a resposta certa da questão? Atalho no teclado: C ou E.</p>
          <div className="grid grid-cols-2 gap-2">
            {[[true, "Certo", Check], [false, "Errado", X]].map(([v, nome, Ic]) => {
              const escolhido = r != null && v === (r ? it.certo : !it.certo); const gab = r != null && v === it.certo;
              return <Button key={nome} size="lg" variant="secondary" disabled={r != null} aria-pressed={escolhido}
                className={cn("disabled:opacity-100", gab && "border-certo bg-certo text-lousa", escolhido && !gab && "border-erro bg-erro text-lousa")} onClick={() => julgar(v)}><Ic />{nome}</Button>;
            })}
          </div>
          {r != null && <div className="flex flex-col gap-2 border-t border-dashed border-risco-2 pt-3" aria-live="polite">
            <b className={cn("mao text-xl", r ? "text-certo" : "text-erro")}>{r ? "isso!" : "não era"}{it.certo ? " · era a resposta certa" : " · a resposta certa é outra"}</b>
            {!it.certo && <p><span className="text-sm font-bold text-apagado">Resposta certa: </span>{it.q.alternativas[it.q.correta]}</p>}
            {it.q.explicacao && <p className="text-[.95rem] leading-relaxed text-apagado">{it.q.explicacao}</p>}
            <Button onClick={prox} className="self-end">{i + 1 >= itens.length ? "Ver placar" : "Próximo item"}<ArrowRight /></Button>
          </div>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ───────── Ligue as colunas */
const CORES = ["var(--acc)", "var(--marca)", "var(--certo)", "#d9a6ff", "#ffb38a"];
function Colunas({ o, mat, onFim }) {
  const n = useNucleo();
  const cards = useMemo(() => embaralhar(n.CARDS[o].filter((c) => !mat || n.TEMA_MAT[o][c.tema] === mat)).slice(0, 5), [o, mat]);
  const direita = useMemo(() => embaralhar(cards.map((c) => c.id)), [cards]);
  const [sel, setSel] = useState(null); const [par, setPar] = useState({}); const [erros, setErros] = useState(0); const [tremor, setTremor] = useState(null); const [faisca, setFaisca] = useState(null);
  const feitos = Object.keys(par).length;
  const escolherVerso = (id) => {
    if (!sel || Object.values(par).includes(id)) return;
    if (id === sel) { const p = { ...par, [sel]: id }; setPar(p); setSel(null); setFaisca(Date.now()); if (Object.keys(p).length === cards.length) setTimeout(() => onFim(Math.max(0, cards.length - erros), cards.length, []), 700); }
    else { setErros((e) => e + 1); setTremor(id); setTimeout(() => setTremor(null), 450); }
  };
  if (cards.length < 2) return <Card><p>Essa matéria ainda tem poucos cartões. Escolha outra.</p></Card>;
  const cor = (cid) => CORES[cards.findIndex((c) => c.id === cid) % CORES.length];
  return (
    <div className="relative flex flex-col gap-4">
      <Faiscas disparo={faisca} />
      <div className="flex items-center justify-between text-sm"><span className="mao text-lg text-marca">{sel ? "agora toque na resposta" : "toque numa pergunta"}</span><span className="num text-apagado">{feitos}/{cards.length} · {erros} {erros === 1 ? "erro" : "erros"}</span></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ul className="flex flex-col gap-2" aria-label="Perguntas">{cards.map((c) => { const ok = par[c.id]; return (
          <li key={c.id}><button type="button" disabled={!!ok} aria-pressed={sel === c.id} onClick={() => setSel(sel === c.id ? null : c.id)}
            className={cn("flex w-full items-start gap-3 rounded-xl border-2 bg-folha p-3 text-left font-bold leading-snug transition-colors", sel === c.id ? "border-acc bg-folha-2" : "border-risco hover:border-risco-2", ok && "opacity-70")}>
            <span className="mt-0.5 size-3 shrink-0 rounded-full" style={{ background: ok ? cor(c.id) : "var(--risco-2)" }} />{c.frente}</button></li>); })}</ul>
        <ul className="flex flex-col gap-2" aria-label="Respostas">{direita.map((id) => { const c = cards.find((x) => x.id === id); const ok = Object.values(par).includes(id); return (
          <li key={id}><motion.button type="button" disabled={ok || !sel} onClick={() => escolherVerso(id)} animate={tremor === id ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} transition={{ duration: .4 }}
            className={cn("flex w-full items-start gap-3 rounded-xl border-2 border-dashed p-3 text-left text-[.95rem] leading-snug transition-colors", ok ? "border-solid bg-folha-2" : "border-risco-2 enabled:hover:border-acc", tremor === id && "border-erro", !sel && !ok && "opacity-80")}
            style={ok ? { borderColor: cor(id) } : undefined}>
            <span className="mt-1 size-3 shrink-0 rounded-full" style={{ background: ok ? cor(id) : "transparent", border: ok ? 0 : "2px solid var(--risco-2)" }} />{c.verso}</motion.button></li>); })}</ul>
      </div>
    </div>
  );
}

/* ───────── Complete a lacuna: some uma palavra em MAIÚSCULAS ou um número do resumo */
const RE_TOK = /\b(\d+(?:[.,]\d+)?%?|[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{4,}(?:\s[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,})*)\b/gu;
const tipo = (t) => (/\d/.test(t) ? "n" : "p");
/* família: números com o mesmo jeito (anos com anos, % com %, 1 dígito com 1 dígito); palavras todas juntas */
const fam = (t) => { if (tipo(t) === "p") return "p"; const u = t.replace("%", "").replace(/\.(?=\d{3}(\D|$))/g, ""); return `${t.endsWith("%") ? "%" : ""}${u.includes(",") ? "," : ""}${u.split(",")[0].length}`; };
const valido = (t) => !/^0\d/.test(t) && !["PODC"].includes(t);
const vizinhos = (t) => {
  const pc = t.endsWith("%"); const v = parseFloat(t.replace(/\./g, "").replace(",", ".")); if (!Number.isFinite(v) || /[.,]/.test(t)) return [];
  return [v + 1, v - 1, v < 100 ? v * 2 : v + 3, v + 2, Math.round(v / 2), v + 5, v - 5, v + 10].filter((x) => x > 0 && x !== v && String(x).length === String(v).length).map((x) => x + (pc ? "%" : ""));
};
const posDe = (txt, alvo) => { const m = new RegExp(`(^|[^\\p{L}\\d])${alvo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\d])`, "u").exec(txt); return m ? m.index + m[1].length : -1; };
export function montarLacunas(n, o, mat) {
  const linhas = [];
  const temas = mat ? n.TEMAS_MAT[o][mat] : Object.values(n.TEMAS_MAT[o]).flat();
  for (const t of temas) { const r = resumoQualquer(n, o, t); r?.t?.forEach((x) => linhas.push({ tema: t, txt: x })); }
  n.CARDS[o].filter((c) => !mat || n.TEMA_MAT[o][c.tema] === mat).forEach((c) => linhas.push({ tema: c.tema, txt: c.verso, pre: c.frente }));
  const toks = linhas.map((l) => [...new Set(l.txt.match(RE_TOK) || [])].filter(valido));
  const todos = [...new Set(toks.flat())];
  const out = [];
  embaralhar(linhas.map((l, k) => k)).forEach((k) => {
    if (out.length >= 10 || !toks[k].length) return;
    const l = linhas[k]; const alvo = toks[k][(Math.random() * toks[k].length) | 0]; const f = fam(alvo);
    const ok = (t) => fam(t) === f && sem(t) !== sem(alvo) && posDe(l.txt, t) < 0;
    const mesmoTema = embaralhar(linhas.flatMap((x, j) => (x.tema === l.tema ? toks[j] : [])));
    const cand = [...new Set([...mesmoTema, ...embaralhar(todos), ...vizinhos(alvo)])].filter(ok);
    const pos = posDe(l.txt, alvo);
    if (cand.length < 3 || pos < 0) return;
    out.push({ ...l, alvo, ops: embaralhar([alvo, ...cand.slice(0, 3)]), antes: l.txt.slice(0, pos), depois: l.txt.slice(pos + alvo.length) });
  });
  return out;
}
function Lacuna({ o, mat, onFim }) {
  const n = useNucleo();
  const itens = useMemo(() => montarLacunas(n, o, mat), [o, mat]);
  const [i, setI] = useState(0); const [esc, setEsc] = useState([]); const [faisca, setFaisca] = useState(null);
  const it = itens[i]; const e = esc[i];
  if (!it) return <Card><p>Os resumos dessa matéria ainda não têm palavras-chave suficientes. Escolha outra matéria.</p></Card>;
  const escolher = (t) => { if (e != null) return; setEsc((x) => { const y = [...x]; y[i] = t; return y; }); if (t === it.alvo) setFaisca(Date.now()); };
  const prox = () => { if (i + 1 >= itens.length) onFim(itens.filter((x, k) => esc[k] === x.alvo).length, itens.length, []); else setI(i + 1); };
  return (
    <div className="flex flex-col gap-4">
      <Progress value={n.pct(i + (e != null ? 1 : 0), itens.length)} label="Lacunas" />
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8, pointerEvents: "none" }} transition={{ duration: .18 }} className="relative flex flex-col gap-4 rounded-2xl border border-risco bg-folha p-5">
          <Faiscas disparo={faisca} />
          <div className="flex flex-wrap items-center justify-between gap-2"><Badge>{it.tema}</Badge><span className="num text-sm text-apagado">{i + 1} de {itens.length}</span></div>
          {it.pre && <p className="text-sm font-bold text-apagado">{it.pre}</p>}
          <p className="text-lg leading-relaxed">{it.antes}
            <span className={cn("mx-0.5 inline-block min-w-[5ch] rounded-md border-b-[3px] px-1.5 text-center font-bold", e == null ? "border-marca bg-folha-2 text-marca" : e === it.alvo ? "border-certo text-certo" : "border-erro text-erro")}>{e == null ? "?" : it.alvo}</span>
            {it.depois}</p>
          <div role="group" aria-label="Opções para a lacuna" className="grid grid-cols-2 gap-2">{it.ops.map((t) => (
            <Button key={t} variant="secondary" disabled={e != null} onClick={() => escolher(t)}
              className={cn("h-auto min-h-12 whitespace-normal disabled:opacity-100", e != null && t === it.alvo && "border-certo bg-certo text-lousa", e === t && t !== it.alvo && "border-erro bg-erro text-lousa", e != null && t !== it.alvo && e !== t && "opacity-50")}>{t}</Button>))}</div>
          {e != null && <Button onClick={prox} className="self-end">{i + 1 >= itens.length ? "Ver placar" : "Próxima"}<ArrowRight /></Button>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ───────── Despejo de memória: escreve, depois compara linha a linha com o resumo */
const PARADAS = new Set(["sobre", "quando", "entre", "porque", "também", "apenas", "outro", "outra", "outros", "outras", "sempre", "nunca", "pelos", "pelas", "desde", "mesmo", "mesma", "ainda", "deve", "podem", "pode", "sendo", "onde", "assim", "qualquer", "todos", "todas", "cada", "exemplo"].map(sem));
const chaves = (s) => [...new Set(sem(s).match(/[a-z0-9]{5,}/g) || [])].filter((w) => !PARADAS.has(w));
function Despejo({ o, mat, onFim }) {
  const n = useNucleo();
  const temas = useMemo(() => (mat ? n.TEMAS_MAT[o][mat] : Object.values(n.TEMAS_MAT[o]).flat()).filter((t) => resumoQualquer(n, o, t)?.t?.length), [o, mat]);
  const sugerido = useMemo(() => n.temasFracos(o, 20).map((f) => f.tema).find((t) => temas.includes(t)) || temas[0], [temas]);
  const [tema, setTema] = useState(sugerido); const [txt, setTxt] = useState(""); const [fase, setFase] = useState("escrever");
  const [seg, setSeg] = useState(180); const [marca, setMarca] = useState([]);
  useEffect(() => { if (fase !== "escrever" || seg <= 0) return; const t = setTimeout(() => setSeg((s) => s - 1), 1000); return () => clearTimeout(t); }, [fase, seg]);
  if (!tema) return <Card><p>Essa matéria ainda não tem resumo. Escolha outra.</p></Card>;
  const r = resumoQualquer(n, o, tema);
  const comparar = () => {
    const meu = new Set(chaves(txt).map((w) => w.slice(0, 5)));
    setMarca(r.t.map((l) => { const k = chaves(l); return k.length ? k.filter((w) => meu.has(w.slice(0, 5))).length / k.length >= .35 : false; }));
    setFase("comparar");
  };
  const lembrei = marca.filter(Boolean).length;
  if (fase === "escrever") return (
    <Card className="gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-bold">Tema<select className={campo} value={tema} onChange={(e) => { setTema(e.target.value); setSeg(180); }}>{temas.map((t) => <option key={t}>{t}</option>)}</select></label>
      <div className="flex items-baseline justify-between gap-2"><span className="mao text-xl text-marca">sem olhar nada, escreva tudo o que lembra</span>
        <span className={cn("num inline-flex items-center gap-1 font-bold", seg <= 30 ? "text-erro" : "text-apagado")}><Timer className="size-4" />{n.mmss(seg * 1000)}</span></div>
      <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={9} aria-label={`O que você lembra de ${tema}`} placeholder="Conceitos, artigos, prazos, exemplos, pegadinhas... do jeito que vier."
        className="w-full rounded-xl border border-risco-2 bg-[repeating-linear-gradient(transparent_0_31px,var(--risco)_31px_32px)] bg-folha-2 px-4 py-1 text-[1.05rem] leading-8 text-giz" />
      <p className="text-sm text-apagado">Puxar da memória fixa mais do que reler. Os 3 minutos são só uma referência, pode passar.</p>
      <Button size="lg" disabled={txt.trim().length < 10} onClick={comparar}>Comparar com o resumo</Button>
    </Card>
  );
  return (
    <Card className="gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-xl font-bold">{tema}</h2><span className="num font-bold text-acc">{lembrei}/{r.t.length} lembrados</span></div>
      <p className="text-sm text-apagado">Marquei sozinho o que parece estar no seu texto. Toque para corrigir o que eu errei.</p>
      <ul className="flex flex-col gap-2">{r.t.map((l, k) => (
        <li key={k}><button type="button" aria-pressed={!!marca[k]} onClick={() => setMarca((m) => { const y = [...m]; y[k] = !y[k]; return y; })}
          className={cn("flex w-full items-start gap-3 rounded-xl border p-3 text-left text-[.95rem] leading-relaxed", marca[k] ? "border-certo/60 bg-folha-2" : "border-erro/50 bg-folha")}>
          <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full", marca[k] ? "bg-certo text-lousa" : "border-2 border-erro text-erro")}>{marca[k] ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} />}</span>
          <span><span className={cn("mao mr-1.5", marca[k] ? "text-certo" : "text-erro")}>{marca[k] ? "lembrei" : "esqueci"}</span>{l}</span></button></li>))}</ul>
      <details className="rounded-xl border border-dashed border-risco-2 p-3"><summary className="cursor-pointer text-sm font-bold">O que você escreveu</summary><p className="mt-2 whitespace-pre-wrap text-apagado">{txt}</p></details>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button onClick={() => onFim(lembrei, r.t.length, [])}>Concluir</Button>
        <Button variant="secondary" onClick={() => n.iniciar(n.questoesDoTema(o, tema, 0, 10), tema)}><PencilLine />Treinar o tema</Button>
        <Button variant="ghost" onClick={() => n.abrirAprender(tema)}><GraduationCap />Aprender de novo</Button>
      </div>
    </Card>
  );
}

const COMP = { ce: CertoErrado, colunas: Colunas, lacuna: Lacuna, despejo: Despejo };
const ROTULO = { ce: "itens certos", colunas: "pares sem errar", lacuna: "lacunas certas", despejo: "pontos lembrados" };

export default function Modos() {
  const n = useNucleo(); const o = n.getS().obj; const d = n.OBJS[o];
  const [modo, setModo] = useState(() => { const m = inicial || "ce"; inicial = null; return m; });
  const [mat, setMat] = useState(""); const [rodada, setRodada] = useState(0); const [fim, setFim] = useState(null);
  const trocar = (m) => { setModo(m); setFim(null); setRodada((r) => r + 1); };
  const C = COMP[modo]; const info = MODOS.find((m) => m.id === modo);
  const terminar = (a, t, errados) => { n.registrarModo(a, t, errados); setFim({ a, t }); n.ui.topo?.(); };
  return (
    <div className="flex flex-col gap-5">
      <Cabeca eyebrow={d.nome} titulo="Outras formas de estudar">Quatro jeitos rápidos de puxar da memória o que você já viu. Tudo sai do banco do app, e o que você erra volta na revisão.</Cabeca>
      <div role="tablist" aria-label="Modo" className="grid grid-cols-2 gap-1 rounded-2xl bg-folha-2 p-1 sm:grid-cols-4">
        {MODOS.map((m) => <button key={m.id} role="tab" aria-selected={modo === m.id} onClick={() => trocar(m.id)} className={cn("relative flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 text-sm font-bold", modo === m.id ? "text-giz" : "text-apagado hover:text-giz")}>
          {modo === m.id && <motion.span layoutId="modo" className="absolute inset-0 rounded-xl bg-folha shadow-[inset_0_-3px_0_var(--acc)]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <m.Ic className="relative size-4 shrink-0" /><span className="relative leading-tight">{m.nome}</span></button>)}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-apagado sm:max-w-[60%]">{info.desc}</p>
        <label className="flex flex-col gap-1.5 text-sm font-bold sm:w-64">Matéria<select className={campo} value={mat} onChange={(e) => { setMat(e.target.value); setFim(null); setRodada((r) => r + 1); }}><option value="">Todas</option>{d.materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}</select></label>
      </div>
      {fim ? <Fim acertos={fim.a} total={fim.t} rotulo={ROTULO[modo]} voltam={modo === "ce" && fim.a < fim.t} onDeNovo={() => { setFim(null); setRodada((r) => r + 1); }} />
        : <C key={modo + mat + rodada} o={o} mat={mat} onFim={terminar} />}
    </div>
  );
}
