import { useEffect, useMemo, useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { Play, GraduationCap, Printer, Highlighter, Volume2, X, PencilLine, Check } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.jsx";
import { Macete, LETRAS } from "./comum.jsx";
import { inteira, linkVideo } from "@/nucleo/videos.js";

export const resumoQualquer = (n, o, tema) => tema ? n.resumoDe(o, tema) || Object.values(n.OBJS).map((x) => x.resumos[tema]).find(Boolean) : null;

/* "Modalidades (art. 28): pregão, ..." → rótulo do galho + texto */
export function galho(txt) {
  const m = txt.match(/^(.{3,64}?)(?::\s|\s—\s|\s=\s|\s→\s)(.+)$/);
  return m ? [m[1], m[2]] : [null, txt];
}

/* Texto com os trechos marcados pelo estudante */
function Realce({ txt, marcas, onTirar }) {
  const partes = useMemo(() => {
    const pos = [];
    for (const m of marcas) { const k = txt.indexOf(m.txt); if (k >= 0) pos.push([k, k + m.txt.length, m.txt]); }
    pos.sort((a, b) => a[0] - b[0]);
    const out = []; let c = 0;
    for (const [a, b, t] of pos) { if (a < c) continue; if (a > c) out.push([txt.slice(c, a)]); out.push([txt.slice(a, b), t]); c = b; }
    if (c < txt.length) out.push([txt.slice(c)]);
    return out;
  }, [txt, marcas]);
  return partes.map(([t, m], k) => m
    ? <mark key={k} className="cursor-pointer rounded-[3px] bg-[color-mix(in_srgb,var(--marca)_45%,transparent)] px-0.5 text-giz" title="Toque para tirar a marcação" onClick={() => onTirar(m)}>{t}</mark>
    : <span key={k}>{t}</span>);
}

function UmaPagina({ tema, r, o }) {
  const n = useNucleo(); const caixa = useRef(null); const [sel, setSel] = useState(null);
  const marcas = n.marcasTexto(tema);
  const cards = n.CARDS[o].filter((c) => c.tema === tema).slice(0, 4);
  useEffect(() => {
    const f = () => {
      const s = getSelection(); const t = s?.toString().trim();
      if (!t || !s.rangeCount) return setSel(null);
      const el = s.getRangeAt(0).commonAncestorContainer; const item = (el.nodeType === 1 ? el : el.parentElement)?.closest("[data-i]");
      setSel(item && caixa.current?.contains(item) ? { i: +item.dataset.i, txt: t } : null);
    };
    document.addEventListener("selectionchange", f); return () => document.removeEventListener("selectionchange", f);
  }, []);
  const imprimir = () => {
    const esc = (x) => String(x).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
    const w = open("", "_blank"); if (!w) return;
    w.document.write(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>${esc(tema)}</title><style>body{font:13px/1.45 system-ui,sans-serif;margin:18mm;color:#111}h1{font-size:20px;margin:0 0 4px}small{color:#555}.b{border-left:4px solid #d4a514;background:#fbf4d8;padding:6px 10px;margin:10px 0}ol{padding-left:20px}li{margin:4px 0}mark{background:#ffe066}dl{display:grid;grid-template-columns:1fr 2fr;gap:4px 12px;margin-top:10px}dt{font-weight:700}</style>
      <h1>${esc(tema)}</h1><small>${esc(n.OBJS[o].nome)} · resumo de uma página</small><div class="b"><b>O que mais cai:</b> ${esc(r.cai)}</div>
      <ol>${r.t.map((x, i) => { let h = esc(x); for (const m of marcas.filter((m) => m.i === i)) h = h.replace(esc(m.txt), `<mark>${esc(m.txt)}</mark>`); return `<li>${h}</li>`; }).join("")}</ol>
      <div class="b"><b>Macete:</b> ${esc(r.macete)}</div>${cards.length ? `<dl>${cards.map((c) => `<dt>${esc(c.frente)}</dt><dd>${esc(c.verso)}</dd>`).join("")}</dl>` : ""}
      ${n.P().notas[tema] ? `<p><b>Minhas anotações:</b> ${esc(n.P().notas[tema])}</p>` : ""}<script>onload=()=>print()<\/script>`);
    w.document.close();
  };
  return (
    <div className="flex flex-col gap-4">
      <Macete rot="O que mais cai">{r.cai}</Macete>
      <ol ref={caixa} className="flex flex-col gap-2.5">{r.t.map((x, i) => (
        <li key={i} data-i={i} className="grid grid-cols-[26px_minmax(0,1fr)] gap-2"><span className="mao select-none text-lg text-marca">{i + 1}.</span>
          <span><Realce txt={x} marcas={marcas.filter((m) => m.i === i)} onTirar={(t) => n.desmarcarTexto(tema, i, t)} /></span></li>))}</ol>
      <Macete>{r.macete}</Macete>
      {cards.length > 0 && <dl className="grid gap-2 rounded-2xl bg-folha-2 p-3.5 text-sm">{cards.map((c) => <div key={c.id}><dt className="font-bold">{c.frente}</dt><dd className="text-apagado">{c.verso}</dd></div>)}</dl>}
      <p className="mao text-apagado">Selecione um trecho com o dedo ou o mouse para passar o marca-texto.</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={imprimir}><Printer /> Imprimir ou salvar PDF</Button>
        <Button size="sm" variant="secondary" onClick={() => n.falar([`${tema}.`, `O que mais cai: ${r.cai}`, ...r.t, `Macete: ${r.macete}`].join(" "))}><Volume2 /> Ouvir</Button>
      </div>
      {sel && <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky bottom-0 z-10 -mx-1 flex items-center justify-between gap-2 rounded-2xl border border-marca bg-lousa p-2 shadow-2xl">
        <span className="min-w-0 truncate px-2 text-sm">“{sel.txt}”</span>
        <Button size="sm" className="bg-marca text-marca-tinta" onMouseDown={(e) => e.preventDefault()} onClick={() => { n.marcarTexto(tema, sel.i, sel.txt); getSelection()?.removeAllRanges(); setSel(null); }}><Highlighter /> Marcar</Button>
      </motion.div>}
    </div>
  );
}

const TONS = ["var(--concurso)", "var(--npor)", "var(--enem)", "var(--giz)"];
export function MapaMental({ tema, r }) {
  const ramos = r.t.map(galho);
  return (
    <div className="relative flex flex-col items-center gap-0" aria-label={`Mapa mental de ${tema}`}>
      <div className="relative z-10 rounded-[28px] border-2 border-marca bg-folha-2 px-5 py-3 text-center font-display text-xl font-extrabold shadow-[0_0_0_6px_color-mix(in_srgb,var(--marca)_14%,transparent)]">{tema}</div>
      <div className="relative w-full pt-5">
        <span aria-hidden className="absolute bottom-6 left-[19px] top-0 w-0.5 bg-[repeating-linear-gradient(to_bottom,var(--risco-2)_0_7px,transparent_7px_12px)] md:left-1/2" />
        <ul className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-x-12">
          <Ramo k={-1} rot="O que mais cai" txt={r.cai} cor="var(--marca)" />
          {ramos.map(([rot, txt], i) => <Ramo key={i} k={i} rot={rot} txt={txt} cor={TONS[i % TONS.length]} />)}
          <Ramo k={99} rot="Macete" txt={r.macete} cor="var(--marca)" />
        </ul>
      </div>
    </div>
  );
}
function Ramo({ k, rot, txt, cor }) {
  return (
    <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(.04 * (k + 2), .6) }} className="relative pl-11 md:pl-0">
      <span aria-hidden className="absolute left-[19px] top-6 h-0.5 w-6 md:hidden" style={{ background: cor }} />
      <span aria-hidden className="absolute left-[13px] top-[18px] size-3.5 rounded-full border-2 border-lousa md:hidden" style={{ background: cor }} />
      <div className="rounded-2xl border bg-folha p-3" style={{ borderColor: `color-mix(in srgb, ${cor} 55%, transparent)` }}>
        {rot && <b className="mao block text-lg leading-tight" style={{ color: cor }}>{rot}</b>}
        <span className="text-[.95rem] leading-snug">{txt}</span>
      </div>
    </motion.li>
  );
}

export function ErrosTema({ tema, o, onTreinar }) {
  const n = useNucleo(); const lista = n.errosDoTema(o, tema);
  if (!lista.length) return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-risco-2 p-4">
      <p>Você ainda não errou questões deste tema. Quando errar, a pegadinha aparece aqui com a sua resposta e a certa, lado a lado.</p>
      {onTreinar && <Button size="sm" onClick={onTreinar}><PencilLine /> Treinar 10 questões</Button>}
    </div>);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-apagado">As questões deste tema que você mais errou. Leia a sua resposta e a certa antes de seguir.</p>
      {lista.map(({ id, q, e, esc, porque }) => (
        <div key={id} className="flex flex-col gap-2 rounded-2xl border border-risco bg-folha p-3.5">
          <span className="text-xs font-bold text-erro">errou {e}×</span>
          <p className="line-clamp-4 leading-snug">{q.enunciado}</p>
          {esc != null && esc !== q.correta && <p className="rounded-xl bg-erro-suave px-3 py-2 text-sm"><X className="mr-1 inline size-4 text-erro" />Você marcou <b>{LETRAS[esc]}</b>: {q.alternativas[esc]}</p>}
          <p className="rounded-xl bg-certo-suave px-3 py-2 text-sm"><Check className="mr-1 inline size-4 text-certo" />Certa <b>{LETRAS[q.correta]}</b>: {q.alternativas[q.correta]}</p>
          <p className="text-sm text-apagado">{q.explicacao}</p>
          {porque && <p className="mao text-lg text-marca">“{porque}”</p>}
        </div>))}
    </div>
  );
}

function Caderno({ tema }) {
  const n = useNucleo(); const [nota, setNota] = useState(() => n.P().notas[tema] || "");
  const marcas = n.marcasTexto(tema);
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-sm font-bold">Minhas anotações
        <textarea value={nota} onChange={(e) => { setNota(e.target.value); n.P().notas[tema] = e.target.value; n.salvar(); }} placeholder="Escreva com suas palavras o que entendeu" className="mao min-h-40 rounded-xl border border-risco-2 bg-[repeating-linear-gradient(transparent_0_31px,var(--risco)_31px_32px)] bg-folha p-3 text-lg leading-8 font-normal" /></label>
      <span className="text-sm font-bold">Trechos marcados <span className="num text-apagado">({marcas.length})</span></span>
      {marcas.length ? <ul className="flex flex-col gap-2">{marcas.map((m) => (
        <li key={m.i + m.txt} className="flex items-start justify-between gap-2 rounded-xl bg-[color-mix(in_srgb,var(--marca)_14%,transparent)] px-3 py-2">
          <span>{m.txt}</span><button type="button" aria-label="Tirar marcação" className="grid size-8 shrink-0 place-items-center rounded-lg hover:bg-folha-3" onClick={() => n.desmarcarTexto(tema, m.i, m.txt)}><X className="size-4" /></button></li>))}</ul>
        : <p className="text-sm text-apagado">Nenhum trecho marcado ainda. Na aba "1 página", selecione um trecho e toque em Marcar.</p>}
    </div>
  );
}

const ABAS = [["pagina", "1 página"], ["mapa", "Mapa mental"], ["erros", "Seus erros"], ["caderno", "Caderno"]];
/* Ficha do tema: resumo de uma página, mapa mental, erros mais comuns e caderno com marca-texto */
export function Resumo({ tema, onClose, aba = "pagina" }) {
  const n = useNucleo(); const o = n.getS().obj; const r = resumoQualquer(n, o, tema);
  const temQ = tema && (n.BANCO[o].some((q) => q.tema === tema) || n.genDoObj[o].some((g) => g.tema === tema));
  const [a, setA] = useState(aba);
  return (
    <Dialog open={!!r} onOpenChange={(v) => !v && onClose()}>
      {r && <DialogContent title={tema}>
        <Tabs.Root value={a} onValueChange={setA} className="flex flex-col gap-4">
          <Tabs.List aria-label="Partes do tema" className="sticky -top-5 z-20 -mx-1 grid grid-cols-4 gap-1 rounded-2xl bg-folha-2 p-1">
            {ABAS.map(([v, nome]) => <Tabs.Trigger key={v} value={v} className={cn("relative min-h-10 rounded-xl px-1 text-[.8rem] font-bold leading-tight sm:text-sm", a === v ? "text-giz" : "text-apagado")}>
              {a === v && <motion.span layoutId="aba-tema" className="absolute inset-0 rounded-xl bg-folha shadow-[inset_0_-2px_0_var(--acc)]" />}<span className="relative">{nome}</span></Tabs.Trigger>)}
          </Tabs.List>
          <Tabs.Content value="pagina"><UmaPagina tema={tema} r={r} o={o} /></Tabs.Content>
          <Tabs.Content value="mapa"><MapaMental tema={tema} r={r} /></Tabs.Content>
          <Tabs.Content value="erros"><ErrosTema tema={tema} o={o} onTreinar={temQ ? () => { onClose(); n.iniciar(n.questoesDoTema(o, tema, 0, 10), tema); } : null} /></Tabs.Content>
          <Tabs.Content value="caderno"><Caderno tema={tema} /></Tabs.Content>
        </Tabs.Root>
        <div className="mt-5 flex flex-col gap-2 border-t border-dashed border-risco-2 pt-4">
          <div className="flex flex-wrap gap-2">
            {r.lei && <Button asChild size="sm" variant="secondary"><a href={r.lei} target="_blank" rel="noopener">Texto oficial</a></Button>}
            {(n.TRECHOS[tema] || []).map((x, i) => <Button key={i} asChild size="sm" variant="secondary"><a href={linkVideo(x[0], x[1])} target="_blank" rel="noopener"><Play className="fill-current" /> {inteira(x) ? x[3] : `${x[1]} · ${x[3]}`}</a></Button>)}
          </div>
          <Button onClick={() => { onClose(); n.abrirAprender(tema); }}><GraduationCap /> Aprender passo a passo</Button>
        </div>
      </DialogContent>}
    </Dialog>
  );
}
