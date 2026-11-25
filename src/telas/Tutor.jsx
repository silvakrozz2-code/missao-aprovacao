import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send, Mic, MicOff, Volume2, Square, Trash2, Sparkles, Loader2, GraduationCap, CheckCheck, PenLine, Search, Shield, CalendarCheck, HelpCircle, Users } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Cabeca } from "./comum.jsx";

/* Agentes de estudo. O papel de cada um (o "prompt") fica no servidor, em lib-agentes.js. */
export const AGENTES = [
  { id: "professor", nome: "Professor particular", desc: "Explica qualquer tema do básico ao nível prova e te faz uma pergunta no fim", Ic: GraduationCap, cor: "#8cc4ff",
    oi: "Oi! Me diga um tema e eu explico do básico ao nível da prova. Pode ser por voz.", sug: ["Me explica regra de três inversa", "Quando usa crase?", "Juros compostos do zero"] },
  { id: "testa", nome: "Me testa", desc: "Quiz por voz: uma pergunta por vez, subindo o nível quando você acerta", Ic: HelpCircle, cor: "#7ddca0",
    oi: "Vamos treinar! Escolha um tema ou diga \"meus pontos fracos\" que eu começo a perguntar, uma de cada vez.", sug: ["Me testa nos meus pontos fracos", "Me testa em porcentagem", "Me testa em concordância verbal"] },
  { id: "corretor", nome: "Corretor de questões", desc: "Cole uma questão e a sua resposta: ele explica cada alternativa e onde você errou", Ic: CheckCheck, cor: "#f5d76e",
    oi: "Cole aqui a questão com as alternativas e diga qual você marcou. Eu explico cada uma e mostro o macete.", sug: ["Como você corrige as questões?"] },
  { id: "redacao", nome: "Redação ENEM", desc: "Nota estimada nas 5 competências e o que mudar para subir", Ic: PenLine, cor: "#ffad7a", obj: "enem",
    oi: "Cole sua redação e eu dou uma nota estimada nas 5 competências do ENEM, com o que mudar. Ou peça um tema inédito para treinar.", sug: ["Me dá um tema inédito estilo ENEM", "Como fazer uma boa proposta de intervenção?"] },
  { id: "pegadinhas", nome: "Caça-pegadinhas FAFIPA", desc: "As armadilhas da banca em cada tema e uma questão inédita no estilo dela", Ic: Search, cor: "#d9a6ff", obj: "concurso",
    oi: "Diga um tema do edital e eu mostro as pegadinhas que a banca costuma usar, depois te passo uma questão no estilo dela.", sug: ["Pegadinhas de Lei Orgânica de Curitiba", "Pegadinhas de crase", "Pegadinhas de porcentagem"] },
  { id: "npor", nome: "Treinador NPOR", desc: "Prova, rotina com treino físico, TAF e entrevista", Ic: Shield, cor: "#c8dd6e", obj: "npor",
    oi: "Pronto para a missão. Posso montar sua rotina de estudo com TAF, revisar conteúdo ou te preparar para a entrevista.", sug: ["Monta minha semana com TAF", "Como melhorar na barra fixa?", "Como é a entrevista?"] },
  { id: "plano", nome: "Plano de estudo", desc: "Monta seus próximos 7 dias com base no seu desempenho e nas horas livres", Ic: CalendarCheck, cor: "#ff9fbf",
    oi: "Vou montar seus próximos 7 dias usando seu desempenho no app, os dias até a prova e suas horas livres.", sug: ["Monta meu plano da semana", "O que eu estudo hoje?", "Estou atrasado, e agora?"] },
];
const AG = Object.fromEntries(AGENTES.map((a) => [a.id, a]));
const CHAVE_VOZ = "missao-aprovacao-tutor-voz", CHAVE_AG = "missao-aprovacao-tutor-agente";
const TINTA = "#0f1513";

/* ───────── voz: primeiro a voz natural do servidor; se não der, a voz do aparelho */
const cacheAudio = new Map();
/* Um único player, destravado no toque do usuário: assim o celular deixa tocar a resposta que chega depois. */
const player = typeof Audio !== "undefined" ? new Audio() : null; let destravado = false;
const SILENCIO = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
function destravar() { if (destravado || !player) return; destravado = true; try { player.src = SILENCIO; player.play().catch(() => {}); } catch { /* ok */ } }
const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const limparTxt = (t) => t.replace(/\*\*/g, "").replace(/^[-•#]+\s*/gm, "");
async function audioNatural(txt) {
  if (cacheAudio.has(txt)) return cacheAudio.get(txt);
  const r = await fetch("/api/voz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: limparTxt(txt) }) });
  if (!r.ok) throw new Error("sem voz");
  const url = URL.createObjectURL(await r.blob()); cacheAudio.set(txt, url); return url;
}
function pararTudo() { try { player?.pause(); } catch { /* ok */ } try { window.speechSynthesis?.cancel(); } catch { /* sem voz */ } }

/* Texto com **negrito** e quebras de linha, sem injetar HTML */
function Rico({ txt }) {
  return txt.split("\n").map((linha, i) => (
    <p key={i} className={cn(!linha.trim() && "h-2")}>{linha.replace(/^#+\s*/, "").split(/(\*\*[^*]+\*\*)/g).map((p, k) => p.startsWith("**") && p.endsWith("**") ? <b key={k} className="text-giz">{p.slice(2, -2)}</b> : p)}</p>));
}

function Escolher({ o, atual, escolher }) {
  const lista = [...AGENTES].sort((a, b) => (b.obj === o) - (a.obj === o));
  return (
    <section aria-label="Agentes de estudo" className="flex flex-col gap-2">
      <h2 className="mao text-xl text-marca">escolha seu agente</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {lista.map((a) => (
          <button key={a.id} onClick={() => escolher(a.id)} aria-pressed={atual === a.id}
            className={cn("grid grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-2xl border p-3 text-left transition-colors", atual === a.id ? "border-acc bg-folha-2" : "border-risco bg-folha hover:border-risco-2")}>
            <span className="grid size-11 place-items-center rounded-xl" style={{ background: a.cor, color: TINTA }}><a.Ic className="size-5" /></span>
            <span className="min-w-0"><b className="block leading-tight">{a.nome}{a.obj === o && <span className="ml-1.5 inline-block whitespace-nowrap rounded-full bg-marca px-1.5 py-px align-middle text-[.7rem] text-marca-tinta">para você</span>}</b><span className="text-sm text-apagado">{a.desc}</span></span>
          </button>))}
      </div>
    </section>
  );
}

export default function Tutor() {
  const n = useNucleo(); const S = n.getS(); const o = S.obj;
  const [ag, setAg] = useState(() => AG[localStorage.getItem(CHAVE_AG)] ? localStorage.getItem(CHAVE_AG) : "professor");
  const [escolhendo, setEscolhendo] = useState(() => !localStorage.getItem(CHAVE_AG));
  const [txt, setTxt] = useState("");
  const [pensando, setPensando] = useState(false);
  const [falando, setFalando] = useState(null);
  const [vozAuto, setVozAuto] = useState(() => localStorage.getItem(CHAVE_VOZ) !== "0");
  const [ouvindo, setOuvindo] = useState(false);
  const fim = useRef(null); const rec = useRef(null); const vez = useRef(0); const enviarRef = useRef(null);
  const agente = AG[ag];
  const vozAutoRef = useRef(vozAuto); vozAutoRef.current = vozAuto;
  const agRef = useRef(ag); agRef.current = ag;
  const todos = S.chat || [];
  const chat = todos.map((m, i) => ({ ...m, k: m.id || `x${i}` })).filter((m) => (m.ag || "professor") === ag);
  useEffect(() => { if (!escolhendo) fim.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [chat.length, pensando, escolhendo]);
  useEffect(() => () => { vez.current++; pararTudo(); try { rec.current?.abort(); } catch { /* ok */ } }, []);
  const parar = () => { vez.current++; pararTudo(); setFalando(null); };

  const escolher = (id) => { parar(); try { rec.current?.abort(); } catch { /* ok */ } setAg(id); setAg(id); localStorage.setItem(CHAVE_AG, id); setEscolhendo(false); };

  async function ouvir(k, texto) {
    if (falando === k) { parar(); return; }
    parar(); const meu = vez.current; setFalando(k);
    const fimFala = () => setFalando((x) => (x === k ? null : x));
    try {
      const url = await audioNatural(texto);
      if (vez.current !== meu) return; // a pessoa parou ou trocou de agente enquanto carregava
      player.src = url; player.onended = fimFala; player.onerror = fimFala;
      await player.play();
    } catch {
      if (vez.current !== meu) return;
      const u = n.falar(limparTxt(texto)); // voz do aparelho
      if (u) u.onend = fimFala; else setFalando(null);
    }
  }

  function contexto() {
    const mats = n.OBJS[o].materias.map((m) => ({ m, s: n.statMat(o, m.id) })).filter((x) => x.s.t >= 3).map((x) => `${x.m.nome}: ${Math.round(x.s.p * 100)}% em ${x.s.t} questões`);
    const dia = (new Date().getDay() + 6) % 7;
    return { objetivo: n.OBJS[o].nome, dias: n.diasAte(S.cfg.datas[o]), horas: S.cfg.horas?.[dia],
      fracos: n.temasFracos(o, 5).filter((x) => x.s.t).map((x) => `${x.tema} (${Math.round(x.s.p * 100)}%)`), materias: mats };
  }

  // Sem IA: só o professor e o plano usam o material do app como reserva; os outros agentes avisam com honestidade.
  function reserva(q, erro) {
    const motivo = erro || "Os agentes de IA não responderam agora.";
    if (ag === "professor" || ag === "plano") return { txt: n.respostaTutor(q).txt, ag, aviso: `${motivo} Esta resposta veio do material do app.` };
    return { txt: `${motivo} Tente de novo em instantes.`, ag, aviso: "Sua mensagem ficou salva aqui na conversa." };
  }

  async function enviar(pergunta) {
    const q = (pergunta ?? txt).trim(); if (!q || pensando) return;
    // comandos rápidos
    if (/^\/(list-agents|agentes|agents)\b/i.test(q)) { setTxt(""); setEscolhendo(true); return; }
    if (/^\/limpar\b/i.test(q)) { setTxt(""); limpar(); return; }
    if (/^\/voz\b/i.test(q)) { setTxt(""); trocarVoz(); return; }
    parar(); setTxt("");
    const S = n.getS();
    S.chat = [...(S.chat || []), { id: novoId(), me: true, txt: q, ag }].slice(-120); n.salvar(); n.render();
    setPensando(true);
    const mensagens = S.chat.filter((m) => (m.ag || "professor") === ag).slice(-12).map((m) => ({ de: m.me ? "eu" : "ia", txt: m.txt }));
    let resp;
    try {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensagens, contexto: contexto(), agente: ag }) });
      const d = await r.json().catch(() => ({}));
      resp = r.ok && d.txt ? { txt: d.txt, ia: true, ag } : reserva(q, d.erro);
    } catch {
      resp = reserva(q, "Sem internet agora.");
    }
    resp.id = novoId();
    S.chat = [...S.chat, resp].slice(-120); n.salvar(); n.render();
    setPensando(false);
    if (vozAutoRef.current && resp.ia && agRef.current === resp.ag) ouvir(resp.id, resp.txt);
  }
  enviarRef.current = enviar;

  function microfone() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { n.ui.toast("Seu navegador não deixa falar com o tutor. Digite a pergunta."); return; }
    if (ouvindo) { rec.current?.stop(); return; }
    parar(); destravar();
    const r = new SR(); r.lang = "pt-BR"; r.interimResults = true; r.continuous = false; rec.current = r;
    let final = "";
    r.onresult = (e) => { const t = [...e.results].map((x) => x[0].transcript).join(" "); setTxt(t); if (e.results[e.results.length - 1].isFinal) final = t; };
    r.onend = () => { setOuvindo(false); if (final.trim()) enviarRef.current?.(final); };
    r.onerror = (e) => { setOuvindo(false); if (e.error === "not-allowed" || e.error === "service-not-allowed") n.ui.toast("Libere o microfone para este site nas permissões do navegador."); else if (e.error !== "no-speech" && e.error !== "aborted") n.ui.toast("Não consegui ouvir. Tente de novo ou digite."); };
    try { r.start(); setOuvindo(true); } catch { setOuvindo(false); }
  }

  function trocarVoz() { const v = !vozAuto; setVozAuto(v); localStorage.setItem(CHAVE_VOZ, v ? "1" : "0"); if (!v) parar(); else destravar(); }
  function limpar() { parar(); S.chat = todos.filter((m) => (m.ag || "professor") !== ag); n.salvar(); n.render(); }

  return (
    <div className="flex flex-col gap-4">
      <Cabeca eyebrow={n.OBJS[o].nome} titulo="Agentes de estudo">Professores com IA, cada um com uma função. Pergunte escrevendo ou falando, e a resposta é lida em voz natural. Eles usam o seu desempenho no app para personalizar a ajuda.</Cabeca>

      {escolhendo ? <Escolher o={o} atual={ag} escolher={escolher} /> : <>
        <div className="flex items-center gap-3 rounded-2xl border border-risco bg-folha p-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: agente.cor, color: TINTA }}><agente.Ic className="size-5" /></span>
          <div className="min-w-0 flex-1"><b className="block leading-tight">{agente.nome}</b><span className="text-sm text-apagado">{agente.desc}</span></div>
          <Button size="sm" variant="secondary" onClick={() => setEscolhendo(true)}><Users /> Trocar</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={vozAuto ? "default" : "secondary"} aria-pressed={vozAuto} onClick={trocarVoz}><Volume2 /> {vozAuto ? "Lendo as respostas em voz alta" : "Voz desligada"}</Button>
          {!!chat.length && <Button size="sm" variant="ghost" onClick={limpar}><Trash2 /> Limpar conversa</Button>}
        </div>

        <section aria-label="Conversa" aria-live="polite" className="flex min-h-[36vh] flex-col gap-3">
          {!chat.length && (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-risco-2 p-4">
              <p>{agente.oi}</p>
              <div className="flex flex-wrap gap-2">{agente.sug.map((s) => <button key={s} onClick={() => { destravar(); enviar(s); }} className="rounded-full border border-risco-2 bg-folha-2 px-3 py-1.5 text-sm font-bold hover:border-acc">{s}</button>)}</div>
              <span className="text-xs text-apagado">Dica: digite /agentes para ver todos os agentes.</span>
            </div>)}
          <AnimatePresence initial={false}>
            {chat.map((m) => (
              <motion.div key={m.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
                <div className={cn("flex max-w-[90%] flex-col gap-2 rounded-2xl px-4 py-3 leading-relaxed", m.me ? "rounded-br-md bg-acc text-sobre-acc" : "rounded-bl-md border border-risco bg-folha")}>
                  {m.me ? <p className="whitespace-pre-wrap">{m.txt}</p> : <>
                    {m.ia && <span className="inline-flex items-center gap-1 text-xs font-bold text-acc"><Sparkles className="size-3.5" /> {agente.nome}</span>}
                    <div className="flex flex-col gap-1"><Rico txt={m.txt} /></div>
                    {m.aviso && <span className="text-xs text-apagado">{m.aviso}</span>}
                    <Button size="sm" variant="ghost" className="self-start" onClick={() => { destravar(); ouvir(m.k, m.txt); }}>{falando === m.k ? <><Square /> Parar</> : <><Volume2 /> Ouvir</>}</Button>
                  </>}
                </div>
              </motion.div>))}
          </AnimatePresence>
          {pensando && <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-risco bg-folha px-4 py-3 text-apagado"><Loader2 className="size-4 animate-spin" /> pensando…</div>}
          <div ref={fim} />
        </section>

        <form onSubmit={(e) => { e.preventDefault(); destravar(); enviar(); }} className="vidro sticky bottom-[calc(76px+env(safe-area-inset-bottom))] z-20 flex items-end gap-2 rounded-2xl border border-risco-2 p-2 md:bottom-4">
          <label htmlFor="pergunta" className="sr-only">Sua mensagem para {agente.nome}</label>
          <textarea id="pergunta" rows={ag === "redacao" || ag === "corretor" ? 3 : 1} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={ouvindo ? "Pode falar…" : ag === "redacao" ? "Cole sua redação ou peça um tema" : ag === "corretor" ? "Cole a questão e a letra que marcou" : "Escreva ou fale (/agentes para trocar)"}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && ag !== "redacao") { e.preventDefault(); enviar(); } }}
            className="max-h-48 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-giz outline-none placeholder:text-apagado" />
          <Button type="button" size="icon" variant={ouvindo ? "default" : "secondary"} onClick={microfone} aria-label={ouvindo ? "Parar de ouvir" : "Falar"}>{ouvindo ? <MicOff /> : <Mic />}</Button>
          <Button type="submit" size="icon" disabled={!txt.trim() || pensando} aria-label="Enviar"><Send /></Button>
        </form>
      </>}
    </div>
  );
}
