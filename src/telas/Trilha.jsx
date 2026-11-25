import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Play, Check, Flame, BookOpen, PencilLine, GraduationCap } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/card.jsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.jsx";
import { IconeMat } from "@/icones.jsx";
import { Cabeca, Macete } from "./comum.jsx";

export function Resumo({ tema, onClose }) {
  const n = useNucleo(); const o = n.getS().obj;
  const r = tema ? n.resumoDe(o, tema) || Object.values(n.OBJS).map((x) => x.resumos[tema]).find(Boolean) : null;
  const temQ = tema && (n.BANCO[o].some((q) => q.tema === tema) || n.genDoObj[o].some((g) => g.tema === tema));
  const [nota, setNota] = useState(() => (tema && n.P().notas[tema]) || "");
  return (
    <Dialog open={!!r} onOpenChange={(v) => !v && onClose()}>
      {r && <DialogContent title={tema}>
        <div className="flex flex-col gap-4">
          <Macete rot="O que mais cai">{r.cai}</Macete>
          <ol className="flex flex-col gap-2.5">{r.t.map((x, i) => <li key={i} className="grid grid-cols-[26px_minmax(0,1fr)] gap-2"><span className="mao text-lg text-marca">{i + 1}.</span><span>{x}</span></li>)}</ol>
          <Macete>{r.macete}</Macete>
          <div className="flex flex-wrap gap-2">
            {r.lei && <Button asChild size="sm" variant="secondary"><a href={r.lei} target="_blank" rel="noopener">Texto oficial</a></Button>}
            {(n.TRECHOS[tema] || []).map((x, i) => <Button key={i} asChild size="sm" variant="secondary"><a href={n.ytLink(x[0], x[1])} target="_blank" rel="noopener"><Play className="fill-current" /> {x[1]} · {x[3]}</a></Button>)}
          </div>
          <Button onClick={() => { onClose(); n.abrirAprender(tema); }}><GraduationCap /> Aprender passo a passo</Button>
          <label className="flex flex-col gap-1.5 text-sm font-bold">Minhas anotações
            <textarea value={nota} onChange={(e) => { setNota(e.target.value); n.P().notas[tema] = e.target.value; n.salvar(); }} placeholder="Escreva com suas palavras o que entendeu" className="min-h-24 rounded-xl border border-risco-2 bg-folha p-3 font-normal" /></label>
          {temQ && <Button variant="secondary" onClick={() => { onClose(); n.iniciar(n.questoesDoTema(o, tema, 1, 10), tema); }}>Treinar 10 questões básicas</Button>}
        </div>
      </DialogContent>}
    </Dialog>
  );
}

function Fase({ t, st, prox, ultimo, onResumo }) {
  const n = useNucleo(); const o = n.getS().obj; const s = n.statTema(o, t);
  const temQ = n.BANCO[o].some((q) => q.tema === t) || n.genDoObj[o].some((g) => g.tema === t);
  const nq = n.BANCO[o].filter((q) => q.tema === t).length, gen = n.genDoObj[o].some((g) => g.tema === t);
  const alta = n.BANCO[o].some((q) => q.tema === t && q.alta) || n.genDoObj[o].some((g) => g.tema === t && g.altaChance);
  const tr = n.TRECHOS[t];
  return (
    <li className="relative grid grid-cols-[34px_minmax(0,1fr)] gap-3 pb-4">
      {!ultimo && <span aria-hidden className={cn("absolute left-[16px] top-9 bottom-0 w-0.5", st === "dom" ? "bg-certo" : "bg-[repeating-linear-gradient(to_bottom,var(--risco-2)_0_6px,transparent_6px_12px)]")} />}
      <span className={cn("relative z-10 grid size-[34px] place-items-center rounded-full border-2", st === "dom" ? "border-certo bg-certo text-lousa" : prox ? "border-acc bg-acc text-sobre-acc shadow-[0_0_0_6px_color-mix(in_srgb,var(--acc)_22%,transparent)]" : st === "prog" ? "border-acc bg-folha" : "border-risco-2 bg-lousa")}>
        {st === "dom" ? <Check className="size-4" strokeWidth={3} /> : prox ? <Flame className="size-4" /> : st === "prog" ? <span className="size-2.5 rounded-full bg-acc" /> : null}
      </span>
      <div className={cn("flex min-w-0 flex-col gap-2 rounded-2xl border p-3.5", prox ? "border-acc bg-folha-2" : "border-risco bg-folha")}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><h3 className="text-[1.05rem] font-bold leading-snug">{t}</h3>{prox && <span className="mao text-acc">próxima fase</span>}</div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {alta && <Badge tone="marca">Alta chance</Badge>}
          {s.t ? <Badge tone={s.p < .6 ? "erro" : "certo"} className="num">{Math.round(s.p * 100)}% de {s.t}</Badge> : <Badge>não iniciado</Badge>}
          <Badge>{gen ? "questões infinitas" : `${nq} questões`}</Badge>
          {tr && <Badge tone="giz"><Play className="fill-current" />{tr[0][1]}</Badge>}
          {n.P().aprendeu?.[t] && <Badge tone="certo"><Check />aula feita</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={prox ? "default" : "secondary"} onClick={() => n.abrirAprender(t)}><GraduationCap />Aprender</Button>
          {temQ && <Button size="sm" variant="secondary" onClick={() => n.iniciar(n.questoesDoTema(o, t, 0, 10), t)}><PencilLine />Treinar</Button>}
          <Button size="sm" variant="ghost" onClick={() => onResumo(t)}><BookOpen />Resumo</Button>
        </div>
      </div>
    </li>
  );
}

export default function Trilha() {
  const n = useNucleo(); const S = n.getS(); const o = S.obj; const d = n.OBJS[o];
  const proxima = n.proximaFase(o);
  const [aberta, setAberta] = useState(() => d.materias.find((m) => n.TEMAS_MAT[o][m.id].includes(proxima))?.id || d.materias[0]?.id);
  const [resumo, setResumo] = useState(null);
  return (
    <div className="flex flex-col gap-5">
      <Cabeca eyebrow={d.nome} titulo="Trilha do edital">Cada tema é uma fase. Em Aprender você vê o vídeo no minuto certo, a ideia em cartões, um exemplo resolvido e questões do básico ao nível prova. A fase fica verde com 80% de acerto em 10 ou mais questões.</Cabeca>
      <div className="flex flex-col gap-3">
        {d.materias.map((m) => {
          const temas = n.TEMAS_MAT[o][m.id]; const sm = n.statMat(o, m.id); const on = aberta === m.id;
          const dom = temas.filter((t) => { const s = n.statTema(o, t); return s.t >= 10 && s.p >= .8; }).length;
          const st = (t) => { const s = n.statTema(o, t); return s.t >= 10 && s.p >= .8 ? "dom" : s.t || n.P().vistos[t] ? "prog" : ""; };
          return (
            <section key={m.id} className={cn("overflow-hidden rounded-3xl border transition-colors", on ? "border-risco-2 bg-[color-mix(in_srgb,var(--folha)_60%,transparent)]" : "border-risco bg-folha")}>
              <h2><button aria-expanded={on} onClick={() => setAberta(on ? null : m.id)} className="grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 p-4 text-left">
                <span className="grid size-11 place-items-center rounded-2xl bg-folha-2 text-acc"><IconeMat mid={m.id} className="size-6" /></span>
                <span className="min-w-0"><b className="block text-lg leading-tight">{m.nome}</b><span className="text-sm text-apagado">{dom}/{temas.length} fases · peso {m.peso}%{sm.t ? ` · ${Math.round(sm.p * 100)}% de acerto` : ""}</span>
                  <span aria-hidden className="mt-2 flex gap-1">{temas.map((t) => <i key={t} className={cn("h-1.5 flex-1 rounded-full", st(t) === "dom" ? "bg-certo" : st(t) === "prog" ? "bg-acc" : "bg-folha-3")} />)}</span></span>
                <ChevronDown className={cn("size-5 text-apagado transition-transform", on && "rotate-180")} />
              </button></h2>
              <AnimatePresence initial={false}>
                {on && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 34 }}>
                  <ol className="px-4 pb-1">{temas.map((t, i) => <Fase key={t} t={t} st={st(t)} prox={t === proxima} ultimo={i === temas.length - 1} onResumo={setResumo} />)}</ol>
                </motion.div>}
              </AnimatePresence>
            </section>);
        })}
      </div>
      <Resumo key={resumo || "x"} tema={resumo} onClose={() => setResumo(null)} />
    </div>
  );
}
