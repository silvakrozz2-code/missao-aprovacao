import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send, Mic, MicOff, Volume2, Square, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Cabeca } from "./comum.jsx";

/* Conversa salva em S.chat no mesmo formato da versão clássica: { me: true, txt } para o aluno e { txt } para o tutor. */
const SUGESTOES = ["O que eu estudo hoje?", "Me explica regra de três inversa", "Quando usa crase?", "Como calcular juros compostos?", "Estou desanimado"];
const CHAVE_VOZ = "missao-aprovacao-tutor-voz";

/* ───────── voz: primeiro a voz natural do servidor; se não der, a voz do aparelho */
const cacheAudio = new Map(); let tocando = null;
const limparTxt = (t) => t.replace(/\*\*/g, "").replace(/^[-•]\s*/gm, "");
async function audioNatural(txt) {
  if (cacheAudio.has(txt)) return cacheAudio.get(txt);
  const r = await fetch("/api/voz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: limparTxt(txt) }) });
  if (!r.ok) throw new Error("sem voz");
  const url = URL.createObjectURL(await r.blob()); cacheAudio.set(txt, url); return url;
}
function pararTudo() { if (tocando) { tocando.pause(); tocando = null; } try { window.speechSynthesis?.cancel(); } catch { /* sem voz */ } }

/* Texto com **negrito** e quebras de linha, sem injetar HTML */
function Rico({ txt }) {
  return txt.split("\n").map((linha, i) => (
    <p key={i} className={cn(!linha.trim() && "h-2")}>{linha.split(/(\*\*[^*]+\*\*)/g).map((p, k) => p.startsWith("**") && p.endsWith("**") ? <b key={k} className="text-giz">{p.slice(2, -2)}</b> : p)}</p>));
}

export default function Tutor() {
  const n = useNucleo(); const S = n.getS(); const o = S.obj;
  const [txt, setTxt] = useState("");
  const [pensando, setPensando] = useState(false);
  const [falando, setFalando] = useState(null); // índice da mensagem em voz alta
  const [vozAuto, setVozAuto] = useState(() => localStorage.getItem(CHAVE_VOZ) !== "0");
  const [ouvindo, setOuvindo] = useState(false);
  const fim = useRef(null); const rec = useRef(null);
  const chat = S.chat || [];
  useEffect(() => { fim.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [chat.length, pensando]);
  useEffect(() => () => pararTudo(), []);

  async function ouvir(i, texto) {
    if (falando === i) { pararTudo(); setFalando(null); return; }
    pararTudo(); setFalando(i);
    try {
      const a = new Audio(await audioNatural(texto)); tocando = a;
      a.onended = () => setFalando((x) => (x === i ? null : x));
      await a.play();
    } catch {
      const u = n.falar(limparTxt(texto)); // voz do aparelho
      if (u) u.onend = () => setFalando((x) => (x === i ? null : x)); else setFalando(null);
    }
  }

  async function enviar(pergunta) {
    const q = (pergunta ?? txt).trim(); if (!q || pensando) return;
    pararTudo(); setFalando(null); setTxt("");
    S.chat = [...chat, { me: true, txt: q }].slice(-60); n.salvar(); n.render();
    setPensando(true);
    const contexto = { objetivo: n.OBJS[o].nome, dias: n.diasAte(S.cfg.datas[o]), fracos: n.temasFracos(o, 4).filter((x) => x.s.t).map((x) => x.tema) };
    const mensagens = S.chat.slice(-12).map((m) => ({ de: m.me ? "eu" : "ia", txt: m.txt }));
    let resp;
    try {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensagens, contexto }) });
      const d = await r.json().catch(() => ({}));
      resp = r.ok && d.txt ? { txt: d.txt, ia: true } : { txt: n.respostaTutor(q).txt, aviso: d.erro || "O tutor de IA não respondeu. Esta resposta veio do material do app." };
    } catch {
      resp = { txt: n.respostaTutor(q).txt, aviso: "Sem internet agora. Esta resposta veio do material do app." };
    }
    S.chat = [...S.chat, resp].slice(-60); n.salvar(); n.render();
    setPensando(false);
    if (vozAuto && resp.ia) ouvir(S.chat.length - 1, resp.txt);
  }

  function microfone() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { n.ui.toast("Seu navegador não deixa falar com o tutor. Digite a pergunta."); return; }
    if (ouvindo) { rec.current?.stop(); return; }
    pararTudo(); setFalando(null);
    const r = new SR(); r.lang = "pt-BR"; r.interimResults = true; r.continuous = false; rec.current = r;
    let final = "";
    r.onresult = (e) => { const t = [...e.results].map((x) => x[0].transcript).join(" "); setTxt(t); if (e.results[e.results.length - 1].isFinal) final = t; };
    r.onend = () => { setOuvindo(false); if (final.trim()) enviar(final); };
    r.onerror = () => setOuvindo(false);
    setOuvindo(true); r.start();
  }

  const trocarVoz = () => { const v = !vozAuto; setVozAuto(v); localStorage.setItem(CHAVE_VOZ, v ? "1" : "0"); if (!v) { pararTudo(); setFalando(null); } };
  const limpar = () => { pararTudo(); setFalando(null); S.chat = []; n.salvar(); n.render(); };

  return (
    <div className="flex flex-col gap-4">
      <Cabeca eyebrow={n.OBJS[o].nome} titulo="Tutor">Pergunte qualquer dúvida de estudo, por texto ou falando. Ele responde com passo a passo e lê a resposta em voz natural.</Cabeca>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant={vozAuto ? "default" : "secondary"} aria-pressed={vozAuto} onClick={trocarVoz}><Volume2 /> {vozAuto ? "Lendo as respostas em voz alta" : "Voz desligada"}</Button>
        {!!chat.length && <Button size="sm" variant="ghost" onClick={limpar}><Trash2 /> Limpar conversa</Button>}
      </div>

      <section aria-label="Conversa" aria-live="polite" className="flex min-h-[40vh] flex-col gap-3">
        {!chat.length && (
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-risco-2 p-4">
            <span className="mao text-lg text-marca">comece por aqui:</span>
            <div className="flex flex-wrap gap-2">{SUGESTOES.map((s) => <button key={s} onClick={() => enviar(s)} className="rounded-full border border-risco-2 bg-folha-2 px-3 py-1.5 text-sm font-bold hover:border-acc">{s}</button>)}</div>
          </div>)}
        <AnimatePresence initial={false}>
          {chat.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
              <div className={cn("flex max-w-[88%] flex-col gap-2 rounded-2xl px-4 py-3 leading-relaxed", m.me ? "rounded-br-md bg-acc text-sobre-acc" : "rounded-bl-md border border-risco bg-folha")}>
                {m.me ? <p>{m.txt}</p> : <>
                  {m.ia && <span className="inline-flex items-center gap-1 text-xs font-bold text-acc"><Sparkles className="size-3.5" /> Tutor</span>}
                  <div className="flex flex-col gap-1"><Rico txt={m.txt} /></div>
                  {m.aviso && <span className="text-xs text-apagado">{m.aviso}</span>}
                  <Button size="sm" variant="ghost" className="self-start" onClick={() => ouvir(i, m.txt)}>{falando === i ? <><Square /> Parar</> : <><Volume2 /> Ouvir</>}</Button>
                </>}
              </div>
            </motion.div>))}
        </AnimatePresence>
        {pensando && <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-risco bg-folha px-4 py-3 text-apagado"><Loader2 className="size-4 animate-spin" /> pensando…</div>}
        <div ref={fim} />
      </section>

      <form onSubmit={(e) => { e.preventDefault(); enviar(); }} className="vidro sticky bottom-[calc(76px+env(safe-area-inset-bottom))] z-20 flex items-end gap-2 rounded-2xl border border-risco-2 p-2 md:bottom-4">
        <label htmlFor="pergunta" className="sr-only">Sua pergunta</label>
        <textarea id="pergunta" rows={1} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={ouvindo ? "Pode falar…" : "Escreva sua dúvida"}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
          className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-giz outline-none placeholder:text-apagado" />
        <Button type="button" size="icon" variant={ouvindo ? "default" : "secondary"} onClick={microfone} aria-label={ouvindo ? "Parar de ouvir" : "Falar a pergunta"}>{ouvindo ? <MicOff /> : <Mic />}</Button>
        <Button type="submit" size="icon" disabled={!txt.trim() || pensando} aria-label="Enviar"><Send /></Button>
      </form>
    </div>
  );
}
