import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Grid3x3, X, Volume2, ArrowRight, ArrowLeft, Flag, Timer, BookOpen, Check } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Card, Badge } from "@/components/ui/card.jsx";
import { Faiscas, NumberTicker, ShimmerButton } from "@/components/efeitos/efeitos.jsx";
import { Alternativas, Tabela, Figura, Passos, Macete, Veredito, LETRAS } from "./comum.jsx";
import { Resumo } from "./Tema.jsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.jsx";
import { BotaoRascunho } from "@/components/Rascunho.jsx";

function Relogio({ fim }) {
  const n = useNucleo(); const [, set] = useState(0);
  useEffect(() => { const t = setInterval(() => set((x) => x + 1), 1000); return () => clearInterval(t); }, []);
  const resta = Math.max(0, fim - Date.now());
  return <b className={cn("num inline-flex items-center gap-1", resta < 600000 && "text-erro")}><Timer className="size-4" />{n.mmss(resta)}</b>;
}

export function Questao() {
  const n = useNucleo(); const sess = n.getSess(); const o = n.getS().obj;
  const [resumo, setResumo] = useState(null); const [folha, setFolha] = useState(false);
  if (!sess) return null;
  const id = sess.ids[sess.i], q = n.Q(id), r = sess.resp[sess.i];
  const sim = sess.modo === "simulado", respondida = r && !sim;
  const mid = n.TEMA_MAT[o][q.tema]; const marca = n.P().marcas[id]; const res = n.resumoDe(o, q.tema);
  const ult = sess.i >= sess.ids.length - 1;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">{sess.titulo}: questão {sess.i + 1} de {sess.ids.length}</h1>
      <div className="vidro sticky top-0 z-20 -mx-4 flex flex-col gap-2 border-b border-risco px-4 pb-2.5 pt-[calc(10px+env(safe-area-inset-top))] md:static md:mx-0 md:rounded-2xl md:border md:pt-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2"><Button size="sm" variant="ghost" className="-ml-2" onClick={n.sairSessao} aria-label="Sair das questões"><X /> Sair</Button><span className="truncate text-sm font-bold text-apagado">{sess.titulo}</span></span>
          <span className="flex items-center gap-3 text-sm"><span className="num">{sess.i + 1}/{sess.ids.length}</span>{sess.fim && <Relogio fim={sess.fim} />}{sim && <Button size="sm" variant="secondary" onClick={() => setFolha(true)}><Grid3x3 /> Folha</Button>}</span>
        </div>
        <div className="flex gap-1" aria-hidden>{sess.ids.map((_, i) => { const x = sess.resp[i]; return <i key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i === sess.i ? "bg-giz" : x ? (sim ? "bg-acc" : x.ok ? "bg-certo" : "bg-erro") : "bg-folha-3")} />; })}</div>
      </div>

      <motion.section key={sess.i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="relative flex flex-col gap-4 rounded-3xl border border-risco bg-folha p-5">
        <Faiscas disparo={respondida && r.ok ? id : null} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5"><Badge tone="acc">{n.matNome(o, mid)}</Badge><Badge>{q.tema}</Badge><Badge>{n.NIVEL_TXT[q.nivel]}</Badge>{q.alta && <Badge tone="marca">Alta chance</Badge>}</div>
          <span className="flex items-center gap-1"><BotaoRascunho />
          {!sim && <Button size="icon" variant="ghost" aria-label="Ler a questão em voz alta" onClick={() => n.falar(`${q.enunciado}. ${q.alternativas.map((a, k) => `${LETRAS[k]}: ${a}`).join(". ")}`)}><Volume2 /></Button>}</span>
        </div>
        <p className="whitespace-pre-line text-lg leading-relaxed md:text-xl">{q.enunciado}</p>
        <Tabela q={q} /><Figura fg={q.figura} />
        <Alternativas q={q} resp={respondida ? r : null} selecionada={sim ? r?.esc : undefined} onEscolher={(k) => n.responder(k)} />
        {sim && <div className="flex justify-between gap-2"><Button variant="secondary" disabled={!sess.i} onClick={n.anterior}><ArrowLeft /> Anterior</Button><Button onClick={n.proxima}>{ult ? "Entregar" : "Próxima"} <ArrowRight /></Button></div>}
      </motion.section>

      {respondida && (
        <Card id="explica" className="gap-4 scroll-mt-24">
          <Veredito ok={r.ok}>{r.ok ? "Acertou!" : `Errou. A certa é a ${LETRAS[q.correta]}.`}</Veredito>
          <div className="flex items-start gap-3"><span className="mao grid size-9 shrink-0 place-items-center rounded-full bg-acc text-lg text-sobre-acc">T</span>
            <div className="mao rounded-2xl rounded-tl-sm bg-folha-2 px-4 py-2 text-lg">{n.frase(r.ok ? "ok" : "erro")}</div></div>
          <p className="leading-relaxed">{q.explicacao}</p>
          {q.passos?.length > 0 && <div className="flex flex-col gap-2"><span className="text-sm font-bold text-apagado">Passo a passo</span><Passos passos={q.passos} /></div>}
          {(q.macete || res?.macete) && <Macete>{q.macete || res.macete}</Macete>}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => n.falar(`${q.explicacao} ${(q.passos || []).join(". ")}`)}><Volume2 /> Ouvir explicação</Button>
            {!r.ok && res && <Button size="sm" variant="secondary" className="h-auto whitespace-normal py-1.5 text-left" onClick={() => setResumo(q.tema)}><BookOpen /> Resumo de {q.tema}</Button>}
          </div>
          <div className="flex flex-wrap items-center gap-2"><span className="text-sm text-apagado">Marcar:</span>
            {[["dificil", "Difícil"], ["chutei", "Chutei"], ["revisar", "Revisar"]].map(([k, nome]) => <Button key={k} size="sm" variant={marca === k ? "default" : "outline"} aria-pressed={marca === k} onClick={() => n.marcar(k)}><Flag /> {nome}</Button>)}</div>
          {!r.ok && <Porque id={id} />}
          <Button size="lg" onClick={n.proxima}>{ult ? "Ver resultado" : "Próxima"} <ArrowRight /></Button>
        </Card>)}
      {sim ? <Button variant="secondary" onClick={n.finalizar}>Entregar simulado agora</Button> : <Button variant="ghost" onClick={n.sairSessao}>Encerrar treino</Button>}
      <Resumo key={resumo || "x"} tema={resumo} onClose={() => setResumo(null)} />
      {sim && <FolhaRespostas aberta={folha} fechar={() => setFolha(false)} />}
    </div>
  );
}

function Porque({ id }) {
  const n = useNucleo(); const [v, setV] = useState(() => n.P().porque[id] || "");
  return (
    <label className="flex flex-col gap-1.5 text-sm font-bold">Por que eu errei? (vai para o caderno de erros)
      <textarea value={v} onChange={(e) => { setV(e.target.value); n.P().porque[id] = e.target.value; n.salvar(); }} placeholder="Ex.: confundi prazo da LAI com o da ouvidoria" className="mao min-h-20 rounded-xl border border-risco-2 bg-lousa p-3 text-lg font-normal" /></label>
  );
}

function Linha({ nome, a, t }) {
  const n = useNucleo(); const p = n.pct(a, t);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(80px,40%)_44px] items-center gap-3 py-1.5">
      <span className="min-w-0 truncate">{nome}</span>
      <span className="h-2 overflow-hidden rounded-full bg-folha-3"><motion.i initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ type: "spring", stiffness: 120, damping: 22 }} className={cn("block h-full rounded-full", p < 60 ? "bg-erro" : "bg-certo")} /></span>
      <span className="num text-right text-sm">{p}%</span>
    </div>
  );
}

export function Resultado() {
  const n = useNucleo(); const sess = n.getSess(); const o = n.getS().obj;
  if (!sess) return null;
  const tot = sess.ids.length, ac = Object.values(sess.resp).filter((x) => x.ok).length;
  const porTema = {}; sess.ids.forEach((id, i) => { const q = n.Q(id); const t = (porTema[q.tema] ||= { a: 0, t: 0 }); t.t++; if (sess.resp[i]?.ok) t.a++; });
  const p = n.pct(ac, tot); const min = Math.round((Date.now() - sess.t0) / 60000); const tm = tot ? (Date.now() - sess.t0) / tot / 60000 : 0;
  const sims = n.P().sims; const ultimo = sess.modo === "simulado" ? sims[sims.length - 1] : null;
  const passou = p >= 60;
  return (
    <div className="flex flex-col gap-5">
      <section className="relative isolate overflow-hidden rounded-3xl border border-risco bg-[linear-gradient(160deg,var(--folha-2),var(--folha))] p-6">
        {passou && <Faiscas disparo="fim" />}
        <span className="text-sm font-bold text-apagado">{sess.titulo}</span>
        <h1 className="sr-only">Resultado</h1>
        <div className="mt-2 flex flex-wrap items-end gap-x-5 gap-y-2">
          <span className={cn("font-display text-7xl font-extrabold leading-none [font-stretch:115%]", passou ? "text-certo" : "text-erro")}><NumberTicker value={p} />%</span>
          <span className="pb-1"><b className="text-lg">{ac} de {tot} certas</b><br /><span className="text-sm text-apagado">{min} min · {tm.toFixed(1).replace(".", ",")} min por questão</span></span>
        </div>
        <svg aria-hidden viewBox="0 0 300 20" className="mt-3 h-4 w-full max-w-sm"><path d="M2 12 Q 75 2 150 10 T 298 8" fill="none" stroke="var(--marca)" strokeWidth="3" strokeLinecap="round" className="[stroke-dasharray:320] [stroke-dashoffset:320] animate-[risco_.9s_.3s_ease-out_forwards]" /></svg>
        <p className="mao mt-1 text-xl">{passou ? "Acima da linha de corte de 60%." : "Abaixo dos 60%. Os temas em vermelho são o próximo passo."}</p>
      </section>
      {o === "concurso" && tm > 4.5 && <Badge tone="erro" className="self-start whitespace-normal">Ritmo lento: a prova dá 4,5 min por questão (40 em 3h).</Badge>}
      {ultimo && <Card><h2 className="text-xl font-bold">Por matéria</h2><div>{Object.entries(ultimo.porMat).map(([mid, x]) => <Linha key={mid} nome={n.matNome(o, mid)} a={x.a} t={x.t} />)}</div></Card>}
      <Card><h2 className="text-xl font-bold">Por tema</h2><div>{Object.entries(porTema).map(([t, x]) => <Linha key={t} nome={t} a={x.a} t={x.t} />)}</div></Card>
      {sess.modo === "simulado" && (
        <Card><h2 className="text-xl font-bold">Gabarito comentado</h2>
          <div className="flex flex-col divide-y divide-risco">{sess.ids.map((id, i) => { const q = n.Q(id), r = sess.resp[i]; return (
            <details key={i} className="py-2"><summary className="cursor-pointer"><b className="num">{i + 1}.</b> {r ? (r.ok ? <Check className="inline size-4 text-certo" /> : <X className="inline size-4 text-erro" />) : "—"} {q.enunciado.slice(0, 90)}…</summary>
              <p className="mt-2 text-sm">Certa: <b>{LETRAS[q.correta]}</b> {q.alternativas[q.correta]}{r && !r.ok ? ` · Você marcou ${LETRAS[r.esc]}` : ""}</p><p className="text-sm text-apagado">{q.explicacao}</p></details>); })}</div>
        </Card>)}
      <div className="grid gap-3 sm:grid-cols-2"><ShimmerButton onClick={() => n.ui.ir("treinar")}>Treinar mais</ShimmerButton><Button size="lg" variant="secondary" onClick={() => n.ui.ir("painel")}>Voltar ao painel</Button></div>
    </div>
  );
}

/* Cartão-resposta como o da prova: marque direto aqui ou toque no número para ir até a questão */
function FolhaRespostas({ aberta, fechar }) {
  const n = useNucleo(); const sess = n.getSess();
  const feitas = Object.keys(sess.resp).length;
  return (
    <Dialog open={aberta} onOpenChange={(v) => !v && fechar()}>
      <DialogContent title="Folha de respostas">
        <p className="mb-3 text-sm text-apagado"><span className="num">{feitas}</span> de <span className="num">{sess.ids.length}</span> marcadas. Toque no número para abrir a questão, ou na letra para marcar direto, como no cartão da prova.</p>
        <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {sess.ids.map((id, i) => { const q = n.Q(id), r = sess.resp[i]; return (
            <li key={i} className={cn("flex items-center gap-2 rounded-xl px-1.5 py-1", i === sess.i && "bg-folha-2")}>
              <button type="button" onClick={() => { n.irPara(i); fechar(); }} className="num w-9 rounded-lg py-1 text-right font-bold hover:bg-folha-3" aria-label={`Ir para a questão ${i + 1}`}>{String(i + 1).padStart(2, "0")}</button>
              <span className="flex gap-1.5">{q.alternativas.map((_, k) => (
                <button key={k} type="button" aria-label={`Questão ${i + 1}, marcar ${LETRAS[k]}`} aria-pressed={r?.esc === k} onClick={() => n.responderEm(i, k)}
                  className={cn("mao grid size-8 place-items-center rounded-full border-2 text-sm font-bold", r?.esc === k ? "border-giz bg-giz text-lousa" : "border-risco-2 text-apagado hover:border-giz")}>{LETRAS[k]}</button>))}</span>
            </li>); })}
        </ol>
        <Button className="mt-4 w-full" onClick={() => { fechar(); n.finalizar(); }}>Entregar prova</Button>
      </DialogContent>
    </Dialog>
  );
}
