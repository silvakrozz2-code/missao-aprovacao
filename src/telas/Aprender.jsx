import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Play, Lightbulb, BookOpenCheck, PencilLine, Mountain, Trophy, Check, Volume2, RotateCcw, Search, ArrowRight, BookOpen } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Card, Badge } from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Faiscas, ShimmerButton, NumberTicker } from "@/components/efeitos/efeitos.jsx";
import { BotaoRascunho } from "@/components/Rascunho.jsx";
import { TrechoVideo } from "@/components/Video.jsx";
import { AulaEscrita } from "@/components/AulaEscrita.jsx";
import { labDoTema } from "@/lab/index.jsx";
import { Bancada } from "./Lab.jsx";
import { Alternativas, Tabela, Figura, Passos, Macete, Veredito, LETRAS } from "./comum.jsx";

const IC = [Play, Lightbulb, BookOpenCheck, PencilLine, Mountain, Trophy];

function Escada({ ap, ir }) {
  const n = useNucleo();
  return (
    <ol aria-label="Etapas da aula" className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-6 md:px-0">
      {n.ETAPAS.map(([nome0, desc0], i) => { const semVideo = i === 0 && !(n.TRECHOS[ap.tema] || []).length; const nome = semVideo ? "Aula" : nome0, desc = semVideo ? "leitura com esquema" : desc0; const Ic = semVideo ? BookOpen : IC[i]; const feito = i < ap.etapa, agora = i === ap.etapa; return (
        <li key={nome} className="snap-start" style={{ paddingTop: `${(5 - i) * 4}px` }}>
          <button onClick={() => ir(i)} aria-current={agora ? "step" : undefined} className={cn("relative flex w-[118px] flex-col gap-1 rounded-2xl border p-2.5 text-left transition-colors md:w-auto", agora ? "border-acc bg-folha-2" : feito ? "border-risco bg-folha" : "border-dashed border-risco-2 bg-transparent hover:bg-folha")}>
            {agora && <motion.span layoutId="degrau" className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-acc" />}
            <span className={cn("grid size-8 place-items-center rounded-full", feito ? "bg-certo text-lousa" : agora ? "bg-acc text-sobre-acc" : "bg-folha-3 text-apagado")}>{feito ? <Check className="size-4" strokeWidth={3} /> : <Ic className="size-4" />}</span>
            <b className="text-sm leading-tight">{nome}</b><span className="text-xs leading-tight text-apagado">{desc}</span>
          </button>
        </li>); })}
    </ol>
  );
}

function Trecho({ tr, k, tema }) {
  const n = useNucleo(); const [v, ini, fim, oque] = tr; const vid = n.VIDEOS[v];
  const key = `${tema}|${k}`, visto = !!(n.P().assistidos || {})[key];
  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border p-3", visto ? "border-certo/50 bg-certo-suave" : "border-risco bg-folha-2")}>
      <TrechoVideo v={v} ini={ini} fim={fim} titulo={oque} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0"><b className="block leading-snug">{oque}</b><span className="text-sm text-apagado">{vid.canal} · {vid.titulo}{fim ? ` · trecho de ${n.durTxt(ini, fim)}` : ""}</span></div>
        <div className="flex flex-wrap gap-1.5">
          <Button asChild size="sm" variant="ghost"><a href={n.ytLink(v, ini)} target="_blank" rel="noopener" aria-label={`Abrir no YouTube: ${oque}`}>Abrir no YouTube</a></Button>
          <Button size="sm" variant={visto ? "secondary" : "outline"} aria-pressed={visto} onClick={() => n.acaoAprender("ap-assisti", { key })}>{visto ? <><Check /> Assistido</> : "Marcar assistido"}</Button>
        </div>
      </div>
    </div>
  );
}

function Assistir({ ap, o }) {
  const n = useNucleo(); const { tema, r } = ap; const trs = (n.TRECHOS[tema] || []).map((t, k) => [t, k]);
  const base = trs.filter(([t]) => t[4] === 1), fundo = trs.filter(([t]) => t[4] !== 1);
  const [ler, setLer] = useState(false);
  const busca = `https://www.youtube.com/results?search_query=${encodeURIComponent(tema + " " + (o === "concurso" ? "concurso aula" : o === "npor" ? "aula" : "ENEM aula"))}`;
  const lei = r.lei && <Button asChild size="sm" variant="secondary" className="self-start"><a href={r.lei} target="_blank" rel="noopener">Ler o texto oficial da lei</a></Button>;
  return (<>
    {trs.length > 0 && (
      <Card>
        <h2 className="text-xl font-bold">Assista primeiro</h2>
        <p className="text-sm text-apagado">Cada botão abre o vídeo gratuito no YouTube no minuto em que o assunto começa. Assista com o caderno aberto, pause e copie os exemplos. Depois volte aqui para praticar.</p>
        {base.length > 0 && <><span className="mao text-lg text-marca">Se está começando do zero</span><div className="flex flex-col gap-2">{base.map(([t, k]) => <Trecho key={k} tr={t} k={k} tema={tema} />)}</div></>}
        {fundo.length > 0 && <><span className="mao text-lg text-marca">{base.length ? "Se já sabe o básico" : "Aula do tema"}</span><div className="flex flex-col gap-2">{fundo.map(([t, k]) => <Trecho key={k} tr={t} k={k} tema={tema} />)}</div></>}
        {lei}
        {!ler && <Button variant="secondary" className="self-start" onClick={() => setLer(true)}><BookOpen /> Prefiro ler: abrir a aula escrita</Button>}
      </Card>
    )}
    {(!trs.length || ler) && <AulaEscrita tema={tema} r={r} o={o} />}
    {!trs.length && (
      <div className="flex flex-wrap items-center gap-2 text-sm text-apagado">
        {lei}
        <span>Quer ver alguém explicando também?</span>
        <a href={busca} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-bold text-acc underline underline-offset-4"><Search className="size-4" /> Procurar videoaula no YouTube</a>
      </div>
    )}
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-apagado">{trs.length ? "Sem tempo para vídeo? Os cartões a seguir resumem o essencial." : "Agora vamos fixar com cartões rápidos e depois praticar."}</span>
      <Button onClick={() => n.acaoAprender("ap-prox")}>{trs.length ? "Já assisti, vamos entender" : "Já li, vamos fixar"} <ArrowRight /></Button></div>
  </>);
}

function Entender({ ap, o }) {
  const n = useNucleo(); const { tema, r } = ap;
  const cards = [...r.t, `O que mais cai: ${r.cai}`]; const ult = ap.card >= cards.length - 1;
  const trs = n.TRECHOS[tema] || []; const base = trs.find((t) => t[4] === 1) || trs[0];
  const temQ = n.BANCO[o].some((q) => q.tema === tema) || n.genDoObj[o].some((g) => g.tema === tema);
  const [nota, setNota] = useState(() => n.P().notas[tema] || "");
  const lab = labDoTema(tema);
  return (<>
    {lab && <div className="flex flex-col gap-2"><span className="mao text-xl text-marca">mexa você mesmo antes de ler</span><Bancada item={lab} /></div>}
    <Card className="gap-4">
      <div className="flex items-center justify-between"><span className="text-sm font-bold text-apagado">Cartão <span className="num">{ap.card + 1}</span> de <span className="num">{cards.length}</span></span>
        <Button size="sm" variant="ghost" onClick={() => n.acaoAprender("ap-falar")}><Volume2 /> Ouvir</Button></div>
      <Progress value={n.pct(ap.card + 1, cards.length)} label="Cartões vistos" />
      <div className="relative min-h-40 [perspective:900px]">
        <AnimatePresence mode="wait">
          <motion.p key={ap.card} aria-live="polite" initial={{ rotateX: -70, opacity: 0, y: 12 }} animate={{ rotateX: 0, opacity: 1, y: 0 }} exit={{ rotateX: 50, opacity: 0, y: -8 }} transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="rounded-2xl border border-risco bg-[linear-gradient(170deg,var(--folha-2),var(--folha))] p-5 text-xl leading-relaxed md:text-2xl">{cards[ap.card]}</motion.p>
        </AnimatePresence>
      </div>
      {ap.travou && <Macete rot="Outro jeito de ver">{r.macete}</Macete>}
      {ap.travou && base && <TrechoVideo v={base[0]} ini={base[1]} fim={base[2]} titulo={`${tema}: a explicação em vídeo`} />}
      {ult && (<>
        <Macete>{r.macete}</Macete>
        <label className="flex flex-col gap-1.5 text-sm font-bold">Explique com as suas palavras, como se fosse ensinar alguém
          <textarea value={nota} onChange={(e) => { setNota(e.target.value); n.P().notas[tema] = e.target.value; n.salvar(); }} placeholder="Se você consegue explicar, você aprendeu." className="mao min-h-28 rounded-xl border border-risco-2 bg-lousa p-3 text-lg font-normal" /></label>
      </>)}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="secondary" disabled={!ap.card} onClick={() => n.acaoAprender("ap-card-voltar")}>Voltar</Button>
        {!ap.travou && !ult && <Button variant="ghost" onClick={() => n.acaoAprender("ap-card-nao")}>Não entendi</Button>}
        <Button onClick={() => n.acaoAprender(ult ? "ap-prox" : "ap-card-ok")}>{ult ? (temQ ? "Ver um exemplo resolvido" : "Concluir aula") : "Entendi, próximo"}</Button>
      </div>
    </Card>
  </>);
}

function Resolvido({ ap }) {
  const n = useNucleo(); if (!ap.ex || ap.etapa !== 2) return null; const q = n.Q(ap.ex.id); const passos = q.passos || [];
  const tudo = passos.length ? ap.ex.mostrados >= passos.length : ap.ex.mostrados >= 1;
  return (<>
    <Card className="gap-4">
      <div className="flex items-center justify-between"><span className="mao text-lg text-marca">Exemplo resolvido</span><span className="flex items-center gap-1"><BotaoRascunho /><Button size="sm" variant="ghost" onClick={() => n.acaoAprender("ap-novo-ex")}><RotateCcw /> Outro</Button></span></div>
      <p className="whitespace-pre-line text-lg leading-relaxed">{q.enunciado}</p><Tabela q={q} /><Figura fg={q.figura} />
      {passos.length ? (<>
        <Passos passos={passos.slice(0, ap.ex.mostrados)} />
        {tudo ? (<><Veredito ok>Resposta: {q.alternativas[q.correta]}</Veredito>{q.macete && <Macete>{q.macete}</Macete>}</>)
          : <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-risco-2 p-4 sm:flex-row sm:items-center sm:justify-between"><span className="mao text-lg">{ap.ex.mostrados ? "Antes de ver: qual é o próximo passo? Pense ou rabisque." : "Antes de ver: por onde você começaria?"}</span>
            <Button onClick={() => n.acaoAprender("ap-passo")}>Mostrar passo {ap.ex.mostrados + 1} de {passos.length}</Button></div>}
      </>) : (<>
        <Alternativas q={q} resp={tudo ? { esc: q.correta, ok: true } : null} />
        {tudo ? <Macete rot="Por quê">{q.explicacao}</Macete> : <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-risco-2 p-4 sm:flex-row sm:items-center sm:justify-between"><span className="mao text-lg">Escolha mentalmente uma alternativa e justifique.</span><Button onClick={() => n.acaoAprender("ap-passo")}>Ver resposta comentada</Button></div>}
      </>)}
    </Card>
    {tudo && <Button className="self-end" onClick={() => n.acaoAprender("ap-prox")}>Agora é sua vez <ArrowRight /></Button>}
  </>);
}

function Pratica({ ap }) {
  const n = useNucleo(); const { etapa, r } = ap; const id = ap.fila[ap.qi]; if (!id || etapa < 3 || etapa > 5) return null; const q = n.Q(id); const resp = ap.q.resp;
  const dica = q.passos?.[0] || r.macete;
  return (
    <Card className="relative gap-4">
      <Faiscas disparo={resp?.ok ? `${id}-${ap.qi}` : null} />
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-bold text-apagado">Questão <span className="num">{ap.qi + 1}</span> de <span className="num">{ap.fila.length}</span></span><span className="flex items-center gap-2"><Badge tone="acc">{n.NIVEL_TXT[etapa - 2]}</Badge><BotaoRascunho /></span></div>
      <p className="whitespace-pre-line text-lg leading-relaxed">{q.enunciado}</p><Tabela q={q} /><Figura fg={q.figura} />
      <Alternativas q={q} resp={resp} onEscolher={(k) => n.acaoAprender("ap-alt", { k })} />
      {!resp && (ap.q.dica ? <Macete rot="Dica">{dica}</Macete> : etapa < 5 ? <Button size="sm" variant="ghost" className="self-start" onClick={() => n.acaoAprender("ap-dica")}><Lightbulb /> Quero uma dica</Button> : <p className="text-sm text-apagado">No nível prova não tem dica. Respire e confie no que você viu.</p>)}
      {resp && (<>
        <Veredito ok={resp.ok}>{resp.ok ? "Acertou!" : `Ainda não. A certa é a ${LETRAS[q.correta]}.`}</Veredito>
        <p>{q.explicacao}</p>
        {q.passos?.length > 0 && !resp.ok && <Passos passos={q.passos} />}
        {!resp.ok && etapa < 5 && ap.extra < 2 && <p className="text-sm text-apagado">Vem outra parecida antes de subir de nível.</p>}
        <Button className="self-end" onClick={() => n.acaoAprender("ap-q-prox")}>Continuar <ArrowRight /></Button>
      </>)}
    </Card>
  );
}

function Fim({ ap, o, mid }) {
  const n = useNucleo(); const { tema } = ap;
  const p = ap.total ? Math.round((ap.acertos / ap.total) * 100) : null;
  const lista = n.TEMAS_MAT[o][mid] || []; const prox = lista[lista.indexOf(tema) + 1] || n.proximaFase(o);
  return (
    <Card className="relative gap-4 overflow-hidden border-acc">
      <Faiscas disparo={tema} />
      <span className="mao text-lg text-marca">Aula concluída · +25 XP</span>
      <h2 className="font-display text-3xl font-extrabold">{p == null ? "Leitura feita" : p >= 80 ? "Você aprendeu este tema" : p >= 50 ? "Quase lá" : "Primeiro contato feito"}</h2>
      {p == null ? <p className="text-apagado">Este tema não tem questões no app. Pratique escrevendo um texto ou resumo sobre ele.</p> : (<>
        <p className="flex items-baseline gap-2"><span className="font-display text-5xl font-extrabold text-acc"><NumberTicker value={ap.acertos} />/{ap.total}</span><span className="text-apagado">acertos do básico ao nível prova ({p}%)</span></p>
        <p className="text-sm text-apagado">{p >= 80 ? "As questões erradas voltam sozinhas na Revisão em 1, 3, 7 e 15 dias." : "Normal no começo. Reveja os cartões ou o trecho do vídeo e refaça amanhã: os erros já entraram na Revisão."}</p></>)}
      <div className="grid gap-2 sm:grid-cols-2">
        {prox && prox !== tema && <ShimmerButton className="sm:col-span-2" onClick={() => n.abrirAprender(prox)}>Próximo tema: {prox} <ArrowRight /></ShimmerButton>}
        {p != null && <Button variant="secondary" onClick={() => n.iniciar(n.questoesDoTema(o, tema, 0, 10), tema)}>Treinar mais 10 deste tema</Button>}
        <Button variant="secondary" onClick={() => n.acaoAprender("ap-ir", { etapa: 1 })}>Rever os cartões</Button>
        <Button variant="ghost" onClick={() => n.acaoAprender("ap-sair")}>Voltar à trilha</Button>
      </div>
    </Card>
  );
}

export default function Aprender() {
  const n = useNucleo(); const ap = n.getAp(); const o = n.getS().obj;
  if (!ap) return null;
  const mid = n.TEMA_MAT[o][ap.tema];
  const corpo = ap.etapa === 0 ? <Assistir ap={ap} o={o} /> : ap.etapa === 1 ? <Entender ap={ap} o={o} /> : ap.etapa === 2 ? <Resolvido ap={ap} />
    : ap.etapa <= 5 ? <Pratica ap={ap} /> : <Fim ap={ap} o={o} mid={mid} />;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Button size="sm" variant="ghost" className="-ml-2 self-start" onClick={() => n.acaoAprender("ap-sair")}><ChevronLeft /> Trilha</Button>
        <span className="text-sm font-bold text-apagado">Aprender · {n.matNome(o, mid)}</span>
        <h1 className="font-display text-4xl font-extrabold leading-tight">{ap.tema}</h1>
      </div>
      <Escada ap={ap} ir={(i) => n.acaoAprender("ap-ir", { etapa: i })} />
      <AnimatePresence mode="wait">
        <motion.div key={`${ap.etapa}-${ap.qi}-${ap.ex?.id}`} className="flex flex-col gap-4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12, pointerEvents: "none" }} transition={{ duration: .2 }}>{corpo}</motion.div>
      </AnimatePresence>
    </div>
  );
}
