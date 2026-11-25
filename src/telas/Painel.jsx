import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { Play, Flame, Target, Trophy, Check, CalendarDays, Sparkles } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { Card, CardTitle, Badge, Eyebrow } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { NumberTicker, ShimmerButton, BorderBeam, Spotlight, Aurora, SplitText, Entra } from "@/components/efeitos/efeitos.jsx";
import { IconeMat } from "@/icones.jsx";
import { DesafiosCard } from "./Extras.jsx";
const Escada3D = lazy(() => import("@/components/Escada3D.jsx"));

export function Vitrine({ o }) {
  const n = useNucleo();
  const itens = [];
  for (const m of n.OBJS[o].materias) for (const t of n.TEMAS_MAT[o][m.id]) { const s = n.statTema(o, t); if (n.TRECHOS[t] && !(s.t >= 10 && s.p >= .8)) itens.push([t, m.id]); }
  if (!itens.length) return null;
  const vistos = n.P().assistidos || {};
  return (
    <section aria-label="Aulas em vídeo" className="flex min-w-0 flex-col gap-3">
      <div className="flex items-baseline justify-between"><h2 className="text-xl font-bold">Aulas no minuto certo</h2><span className="text-sm text-apagado">vídeos gratuitos</span></div>
      <div className="-mx-4 grid snap-x snap-mandatory auto-cols-[minmax(210px,240px)] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] md:mx-0 md:px-0">
        {itens.slice(0, 10).map(([t, mid], i) => { const tr = n.TRECHOS[t][0]; return (
          <motion.div key={t} className="snap-start" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 * i, type: "spring", stiffness: 260, damping: 26 }}>
            <Spotlight as="button" onClick={() => n.abrirAprender(t)} className="flex h-full w-full cursor-pointer flex-col gap-2 rounded-2xl border border-risco bg-folha p-2.5 text-left transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-acc">
              <span className="relative grid aspect-video place-items-center overflow-hidden rounded-xl bg-[radial-gradient(120%_120%_at_20%_10%,color-mix(in_srgb,var(--acc)_40%,var(--folha-2)),var(--folha-2)_70%)]">
                <IconeMat mid={mid} className="size-[44%] opacity-90" strokeWidth={1.25} />
                <span className="absolute bottom-2.5 left-2.5 grid size-9 place-items-center rounded-full bg-giz text-lousa"><Play className="ml-0.5 size-4 fill-current" /></span>
                <span className="num absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 text-xs text-white">{tr[1]}</span>
              </span>
              <b className="relative px-0.5 leading-snug">{t}</b>
              <span className="relative px-0.5 text-sm text-apagado">{tr[3]}{tr[2] ? ` · ${n.durTxt(tr[1], tr[2])}` : ""}</span>
              {vistos[`${t}|0`] && <Badge tone="certo" className="relative self-start"><Check /> assistido</Badge>}
            </Spotlight>
          </motion.div>); })}
      </div>
    </section>
  );
}

export default function Painel() {
  const n = useNucleo(); const S = n.getS(); const o = S.obj; const d = n.OBJS[o];
  const dd = Math.max(0, n.diasAte(S.cfg.datas[o])); const ed = n.progressoEdital(o); const hj = n.dia();
  const nv = n.nivelXP(S.xp), base = n.xpDoNivel(nv), prox = n.xpDoNivel(nv + 1);
  const deg = Math.min(5, Math.floor(ed.p / 17));
  const t = n.proximaFase(o); const tr = t ? (n.TRECHOS[t] || [])[0] : null;
  const [cargo, banca] = d.sub.split(" · ");
  const cv = n.cardsVencidos(o).length, rv = n.revisoesVencidas(o).length;
  const prev = n.previsao(o);
  const cs = typeof window !== "undefined" ? getComputedStyle(document.documentElement) : null;
  const missoes = [
    { txt: `Resolver ${S.cfg.meta} questões (blocos de 10)`, feito: hj.obj[o] || 0, meta: S.cfg.meta, fazer: () => n.iniciar(n.questoesFiltro(o, { n: 10 }), "Missão do dia · bloco de 10") },
    { txt: `Revisar ${Math.min(S.cfg.metaCards, Math.max(cv, 1))} flashcards`, feito: hj.cards, meta: Math.min(S.cfg.metaCards, Math.max(cv + hj.cards, 1)), href: "/classico/#revisar" },
    { txt: "1 pomodoro de foco (25 min)", feito: hj.pomo, meta: 1, href: "/classico/#foco" },
    { txt: rv ? `Refazer ${rv} questões da revisão` : "Sem revisões vencidas hoje", feito: rv ? 0 : 1, meta: 1, fazer: rv ? () => n.iniciar(n.revisoesVencidas(o), "Revisão espaçada") : null },
  ];
  const blocos = n.planoDoDia(n.hoje()).filter((b) => b.o === o && b.tipo !== "taf");
  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Sua subida até a prova" className="relative isolate grid gap-2 overflow-hidden rounded-3xl border border-risco bg-[linear-gradient(160deg,var(--folha-2),var(--folha)_60%)] p-5 md:grid-cols-[1.05fr_1fr] md:p-7">
        <Aurora className="-z-10" />
        <BorderBeam />
        <div className="relative h-52 md:order-2 md:h-72"><Suspense fallback={null}><Escada3D degrau={deg} cor={cs?.getPropertyValue("--acc").trim() || "#8cc4ff"} giz={cs?.getPropertyValue("--giz").trim() || "#eef0e8"} /></Suspense>
          <span className="mao pointer-events-none absolute left-1 top-0 -rotate-3 text-marca">sua escada até a prova</span></div>
        <div className="flex min-w-0 flex-col gap-3">
          <Eyebrow>{d.codigo} · {cargo}{banca ? ` · ${banca}` : ""}</Eyebrow>
          <SplitText key={o} text={d.nome} className="text-4xl font-extrabold leading-[1.02] md:text-5xl" />
          <p className="flex items-baseline gap-3"><NumberTicker value={dd} className="font-display text-6xl font-extrabold leading-none text-acc [font-stretch:115%]" /><span className="font-bold text-apagado">{dd === 1 ? "dia" : "dias"} até a prova{d.dataNota ? " (estimada)" : ""}</span></p>
          <div className="flex flex-col gap-1.5 text-sm text-apagado"><span>Degrau <b className="text-giz">{deg + 1} de 6</b> · {ed.p}% do edital estudado</span><Progress value={ed.p} label="Edital estudado" /></div>
          {t ? (<>
            <div className="flex flex-col gap-1 rounded-2xl border border-dashed border-risco-2 bg-[color-mix(in_srgb,var(--lousa)_55%,transparent)] px-3.5 py-2.5"><span className="text-sm text-apagado">Próxima aula</span><b className="text-lg">{t}</b>{tr && <Badge tone="giz" className="self-start"><Play className="fill-current" /> vídeo a partir de {tr[1]}</Badge>}</div>
            <ShimmerButton onClick={() => n.abrirAprender(t)}><Play className="fill-current" /> Aprender agora</ShimmerButton></>)
            : <Badge tone="certo" className="self-start"><Sparkles /> Edital inteiro dominado</Badge>}
        </div>
        <span className="mao absolute right-4 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--marca)_16%,transparent)] px-3 py-0.5 text-marca"><Flame className="size-4" />{n.ofensiva() ? `${n.ofensiva()} dias seguidos` : "Dia 1"}</span>
      </section>

      <Vitrine o={o} />

      <div className="grid grid-cols-3 gap-3">
        {[[Flame, "Ofensiva", n.ofensiva(), "dias seguidos", "text-enem"], [Target, "Hoje", hj.q, `questões · ${n.pct(hj.a, hj.q)}%`, "text-acc"], [Trophy, "Previsão", prev ? prev.nota : null, prev ? (prev.nota >= 60 ? "acima dos 60%" : "abaixo dos 60%") : "faça 3+ por matéria", "text-marca"]].map(([Ic, nome, v, sub, cor], i) => (
          <Entra key={nome} atraso={.05 * i} className="flex min-w-0 flex-col gap-1 rounded-2xl border border-risco bg-folha p-3.5">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-apagado"><Ic className={`size-4 ${cor}`} />{nome}</span>
            {v == null ? <b className="font-display text-3xl">—</b> : <span className="font-display text-3xl font-extrabold">{nome === "Previsão" ? <><NumberTicker value={v} />%</> : <NumberTicker value={v} />}</span>}
            <span className="text-xs text-apagado">{sub}</span>
          </Entra>))}
      </div>

      <Card>
        <div className="flex items-center justify-between"><CardTitle>Missões de hoje</CardTitle><Badge tone="acc">+XP</Badge></div>
        <ul className="flex flex-col divide-y divide-dashed divide-risco">
          {missoes.map((m) => { const ok = m.feito >= m.meta; return (
            <li key={m.txt} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 py-3">
              <motion.span animate={{ scale: ok ? [1, 1.25, 1] : 1 }} className={`grid size-7 place-items-center rounded-full border-2 ${ok ? "border-certo bg-certo text-lousa" : "border-risco-2"}`}>{ok && <Check className="size-4" strokeWidth={3} />}</motion.span>
              <div className="min-w-0"><div>{m.txt}</div><Progress className="mt-1.5 h-1.5" tone={ok ? "certo" : "acc"} value={n.pct(Math.min(m.feito, m.meta), m.meta)} label={m.txt} /></div>
              {!ok && (m.fazer || m.href) ? (m.href ? <Button asChild size="sm" variant="secondary"><a href={m.href}>Fazer</a></Button> : <Button size="sm" variant="secondary" onClick={m.fazer}>Fazer</Button>) : <span className="num text-sm text-apagado">{Math.min(m.feito, m.meta)}/{m.meta}</span>}
            </li>); })}
        </ul>
      </Card>

      <DesafiosCard compacto />

      {blocos.length > 0 && (
        <Card>
          <div className="flex items-center justify-between"><CardTitle className="inline-flex items-center gap-2"><CalendarDays className="size-5 text-acc" />Plano de hoje</CardTitle><a href="/classico/#plano" className="text-sm font-bold text-acc underline underline-offset-4">Semana toda</a></div>
          <div className="flex flex-col gap-2">
            {blocos.map((b, i) => (
              <div key={i} className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-folha-2 p-3">
                <span className="num text-sm text-apagado">{b.min} min</span>
                <div className="min-w-0"><b className="block leading-snug">{b.tema}</b><span className="text-sm text-apagado">{b.tipo === "simulado" ? "Mini-simulado" : b.tipo === "revisao" ? "Revisão + 10 questões" : "Aula + 10 questões"}</span></div>
                <Button size="sm" variant="secondary" onClick={() => b.tipo === "simulado" ? n.iniciar(n.simulado(o).slice(0, 10), "Mini-simulado", "simulado", { minutos: 15 }) : n.abrirAprender(b.tema)}>Começar</Button>
              </div>))}
          </div>
        </Card>)}
      <p className="text-center text-xs text-apagado">Nível {nv} · <span className="num">{S.xp - base}/{prox - base}</span> XP para o próximo</p>
    </div>
  );
}
