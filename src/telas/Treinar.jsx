import { useState } from "react";
import { motion } from "motion/react";
import { Zap, RotateCcw, Target, Layers, Repeat, Moon, Volume2 } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Card, Badge } from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Spotlight, NumberTicker, ShimmerButton } from "@/components/efeitos/efeitos.jsx";
import { Cabeca } from "./comum.jsx";

const campo = "min-h-11 w-full rounded-xl border border-risco-2 bg-folha-2 px-3 text-giz disabled:opacity-50";

function Atalho({ Ic, titulo, desc, onClick, destaque }) {
  return (
    <Spotlight as="button" onClick={onClick} className={cn("flex min-h-28 flex-col justify-between gap-3 rounded-2xl border p-4 text-left transition-[transform,border-color] hover:-translate-y-0.5", destaque ? "border-acc bg-folha-2" : "border-risco bg-folha hover:border-risco-2")}>
      <Ic className={cn("relative size-6", destaque ? "text-acc" : "text-marca")} />
      <span className="relative"><b className="block text-lg leading-tight">{titulo}</b><span className="text-sm text-apagado">{desc}</span></span>
    </Spotlight>
  );
}

function Montar({ o }) {
  const n = useNucleo(); const d = n.OBJS[o];
  const [f, setF] = useState({ mat: "", tema: "", nivel: 0, alta: false, n: 10 });
  const up = (k, v) => setF((x) => ({ ...x, [k]: v, ...(k === "mat" ? { tema: "" } : {}) }));
  const temas = f.mat ? n.TEMAS_MAT[o][f.mat] : [];
  return (
    <Card className="gap-4">
      <h2 className="text-xl font-bold">Montar uma lista</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-bold">Matéria<select className={campo} value={f.mat} onChange={(e) => up("mat", e.target.value)}><option value="">Todas</option>{d.materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}</select></label>
        <label className="flex flex-col gap-1.5 text-sm font-bold">Tema<select className={campo} value={f.tema} disabled={!f.mat} onChange={(e) => up("tema", e.target.value)}><option value="">Todos</option>{temas.map((t) => <option key={t}>{t}</option>)}</select></label>
      </div>
      <div className="flex flex-col gap-1.5"><span className="text-sm font-bold">Nível</span>
        <div role="group" aria-label="Nível" className="grid grid-cols-4 gap-1 rounded-xl bg-folha-2 p-1">
          {[0, 1, 2, 3].map((v) => <button key={v} aria-pressed={f.nivel === v} onClick={() => up("nivel", v)} className={cn("relative min-h-10 rounded-lg px-1 text-sm font-bold", f.nivel === v ? "text-giz" : "text-apagado")}>
            {f.nivel === v && <motion.span layoutId="nivel" className="absolute inset-0 rounded-lg bg-folha shadow-[inset_0_-2px_0_var(--acc)]" />}<span className="relative">{v ? n.NIVEL_TXT[v] : "Todos"}</span></button>)}
        </div></div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" className="size-5 accent-[var(--acc)]" checked={f.alta} onChange={(e) => up("alta", e.target.checked)} /> Só “alta chance de cair”</label>
        <label className="flex items-center gap-2 text-sm font-bold">Quantidade <input type="number" min="5" max="60" value={f.n} onChange={(e) => up("n", Math.max(5, Math.min(60, +e.target.value || 10)))} className={cn(campo, "w-20")} /></label>
      </div>
      <Button size="lg" onClick={() => n.iniciar(n.questoesFiltro(o, f), "Treino")}>Começar</Button>
    </Card>
  );
}

export function Cards() {
  const n = useNucleo(); const fc = n.getFc(); const o = n.getS().obj; const [, set] = useState(0);
  if (!fc || fc.i >= fc.lista.length) return (
    <Card className="items-center py-10 text-center"><span className="mao text-2xl text-marca">pronto!</span><h1 className="font-display text-3xl font-extrabold">Revisão de cartões concluída</h1>
      <p className="text-apagado"><span className="num">{fc ? fc.feitos : 0}</span> cartões revisados agora.</p><Button onClick={() => n.ui.ir("revisar")}>Voltar</Button></Card>);
  const c = n.CARDS[o].find((x) => x.id === fc.lista[fc.i]);
  const virar = () => { fc.virado = !fc.virado; set((x) => x + 1); };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">Flashcards</h1>
      <div className="flex items-center justify-between"><span className="text-sm font-bold text-apagado">Flashcards · {c.tema}</span><span className="num text-sm">{fc.i + 1}/{fc.lista.length}</span></div>
      <Progress value={n.pct(fc.i, fc.lista.length)} label="Cartões revisados" />
      <button onClick={virar} aria-label={fc.virado ? "Resposta do cartão" : "Virar cartão"} className="relative h-72 w-full [perspective:1200px]">
        <motion.div key={fc.i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, rotateY: fc.virado ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 24 }} className="relative size-full [transform-style:preserve-3d]">
          <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-risco-2 bg-[linear-gradient(165deg,var(--folha-2),var(--folha))] p-6 text-left [backface-visibility:hidden]">
            <span className="text-sm font-bold text-apagado">Pergunta</span><b className="font-display text-2xl leading-snug">{c.frente}</b><span className="mao text-apagado">toque para virar</span></div>
          <div className="absolute inset-0 flex flex-col gap-3 rounded-3xl border border-acc bg-folha p-6 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-sm font-bold text-acc">Resposta</span><span className="text-lg leading-relaxed">{c.verso}</span></div>
        </motion.div>
      </button>
      {fc.virado ? <div className="grid grid-cols-4 gap-2">{[["Errei", "secondary"], ["Difícil", "secondary"], ["Bom", "default"], ["Fácil", "secondary"]].map(([nome, v], k) => <Button key={k} variant={v} onClick={() => n.avaliarCard(k)}>{nome}</Button>)}</div>
        : <Button size="lg" onClick={virar}>Mostrar resposta</Button>}
      <Button variant="ghost" onClick={() => n.falar(fc.virado ? c.verso : c.frente)}><Volume2 /> Ouvir</Button>
    </div>
  );
}

function Revisar({ o }) {
  const n = useNucleo(); const rv = n.revisoesVencidas(o), cv = n.cardsVencidos(o);
  const prox = Object.values(n.P().rev).filter((r) => r.due > n.hoje()).length;
  return (<>
    <div className="grid gap-3 sm:grid-cols-2">
      {[[Layers, "Flashcards", cv.length, `para hoje (de ${n.CARDS[o].length} no total)`, "Revisar cartões", n.iniciarCards], [Repeat, "Questões que voltaram", rv.length, `vencidas hoje · ${prox} agendadas`, "Refazer agora", () => n.iniciar(rv, "Revisão espaçada")]].map(([Ic, nome, v, sub, acao, fn]) => (
        <Card key={nome}><span className="inline-flex items-center gap-2 text-sm font-bold text-apagado"><Ic className="size-4 text-acc" />{nome}</span>
          <NumberTicker value={v} className="font-display text-5xl font-extrabold" /><span className="text-sm text-apagado">{sub}</span>
          <Button disabled={!v} onClick={fn}>{acao}</Button></Card>))}
    </div>
    <Card>
      <div className="flex items-center justify-between gap-2"><h2 className="text-xl font-bold">Lei seca e números</h2><Button asChild size="sm" variant="ghost"><a href="/classico/#vespera"><Moon /> Modo véspera</a></Button></div>
      <p className="text-sm text-apagado">Os primeiros cartões de {n.OBJS[o].nome}, para leitura rápida.</p>
      <dl className="flex flex-col divide-y divide-dashed divide-risco">{n.CARDS[o].slice(0, 6).map((c) => <div key={c.id} className="py-2.5"><dt className="font-bold">{c.frente}</dt><dd className="text-sm text-apagado">{c.verso}</dd></div>)}</dl>
    </Card>
  </>);
}

export default function Treinar({ revisar }) {
  const n = useNucleo(); const o = n.getS().obj; const d = n.OBJS[o];
  if (revisar) return (
    <div className="flex flex-col gap-5"><Cabeca eyebrow={d.nome} titulo="Revisar">O que você erra volta em 1, 3, 7 e 15 dias. Os flashcards seguem o mesmo princípio: os difíceis aparecem mais.</Cabeca><Revisar o={o} /></div>);
  const fracos = n.temasFracos(o, 5);
  return (
    <div className="flex flex-col gap-5">
      <Cabeca eyebrow={d.nome} titulo="Treinar">Uma questão por tela, sem cronômetro. Toque na alternativa e veja na hora se acertou.</Cabeca>
      <div className="grid gap-3 sm:grid-cols-3">
        <Atalho destaque Ic={Zap} titulo="Revisão relâmpago" desc="10 questões dos seus temas mais fracos" onClick={() => n.iniciar(fracos.flatMap((f) => n.questoesDoTema(o, f.tema, 0, 2)), "Revisão relâmpago")} />
        <Atalho Ic={RotateCcw} titulo="Só os erros" desc="O que errou ou marcou como chute" onClick={() => n.iniciar(n.questoesFiltro(o, { erros: true, n: 30 }), "Só os erros")} />
        <Atalho Ic={Target} titulo="Pegadinhas da banca" desc="Só “alta chance”, matérias misturadas" onClick={() => n.iniciar(n.questoesFiltro(o, { alta: true, n: 10 }), "Pegadinhas da banca")} />
      </div>
      {fracos.some((f) => f.s.t) && <div className="flex flex-wrap items-center gap-2"><span className="mao text-lg text-marca">seus pontos fracos:</span>{fracos.filter((f) => f.s.t).map((f) => <Badge key={f.tema} tone="erro">{f.tema}</Badge>)}</div>}
      <Montar o={o} />
      <Card className="relative overflow-hidden"><h2 className="text-xl font-bold">Simulado</h2><p className="text-sm text-apagado">{o === "concurso" ? "40 questões no formato da banca, com cronômetro de 3 horas." : "Prova misturando as matérias, com cronômetro."}</p>
        <div className="grid gap-2 sm:grid-cols-2"><ShimmerButton onClick={() => n.iniciar(n.simulado(o), "Simulado completo", "simulado", { minutos: o === "concurso" ? 180 : 60 })}>Simulado completo</ShimmerButton>
          <Button size="lg" variant="secondary" onClick={() => n.iniciar(n.simulado(o).slice(0, 10), "Mini-simulado", "simulado", { minutos: 15 })}>Mini (10 questões, 15 min)</Button></div></Card>
    </div>
  );
}
