import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mic2, Send, Mic, MicOff, Volume2, Square, Trash2, Sparkles, Loader2, GraduationCap, CheckCheck, PenLine, Search, Shield, CalendarCheck, HelpCircle, Users, Plus, Camera, Image as ImageIcon, ChevronDown, AudioLines, X, Check } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Cabeca } from "./comum.jsx";
import { vozesPt, ehNatural } from "@/nucleo/vozes.js";

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
const CHAVE_AG = "missao-aprovacao-tutor-agente", CHAVE_QUAL = "missao-aprovacao-tutor-qual-voz";
/* Vozes do Gemini (pelo servidor). O valor salvo é "g:Nome" para Gemini ou "d:Nome" para uma voz do aparelho. */
const VOZES_IA = [["Achird", "amigável"], ["Sulafat", "calorosa"], ["Zephyr", "animada"], ["Aoede", "leve"], ["Puck", "alegre"], ["Laomedeia", "animada"], ["Algieba", "suave"], ["Vindemiatrix", "gentil"], ["Charon", "informativa, grave"], ["Orus", "firme, grave"], ["Iapetus", "clara, grave"], ["Kore", "firme"]];
const AMOSTRA = "Oi! Eu sou seu tutor. Vamos estudar juntos? Me pergunta o que quiser.";
let qualVoz = (() => { try { return localStorage.getItem(CHAVE_QUAL) || "g:Achird"; } catch { return "g:Achird"; } })();
const TINTA = "#0f1513";

/* ───────── voz: primeiro a voz natural do servidor; se não der, a voz do aparelho */
const cacheAudio = new Map();
/* Um único player, destravado no toque do usuário: assim o celular deixa tocar a resposta que chega depois. */
const player = typeof Audio !== "undefined" ? new Audio() : null; let destravado = false;
const SILENCIO = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
function destravar() { if (destravado || !player) return; destravado = true; try { player.src = SILENCIO; player.play().catch(() => {}); } catch { /* ok */ } }
const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const limparTxt = (t) => t.replace(/\*\*/g, "").replace(/^[-•#]+\s*/gm, "");
async function audioNatural(txt, voz) {
  const chave = voz + "|" + txt;
  if (cacheAudio.has(chave)) return cacheAudio.get(chave);
  const r = await fetch("/api/voz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: limparTxt(txt), voz }) });
  if (!r.ok) throw new Error("sem voz");
  const url = URL.createObjectURL(await r.blob()); cacheAudio.set(chave, url); return url;
}
/* Fala com uma voz do aparelho escolhida pelo nome (ou a melhor que houver) */
function falarAparelho(txt, nome, n) {
  const ss = window.speechSynthesis; if (!ss) return null;
  const v = nome && ss.getVoices().find((x) => x.name === nome);
  if (!v) return n.falar(txt);
  ss.cancel(); const u = new SpeechSynthesisUtterance(txt); u.voice = v; u.lang = v.lang; ss.speak(u); return u;
}
function pararTudo() { try { player?.pause(); } catch { /* ok */ } try { window.speechSynthesis?.cancel(); } catch { /* sem voz */ } }

/* Texto com **negrito** e quebras de linha, sem injetar HTML */
function Rico({ txt }) {
  return txt.split("\n").map((linha, i) => (
    <p key={i} className={cn(!linha.trim() && "h-2")}>{linha.replace(/^#+\s*/, "").split(/(\*\*[^*]+\*\*)/g).map((p, k) => p.startsWith("**") && p.endsWith("**") ? <b key={k} className="text-giz">{p.slice(2, -2)}</b> : p)}</p>));
}

function PainelVoz({ voz, escolher, falando }) {
  const [disp, setDisp] = useState(() => vozesPt().filter(ehNatural).slice(0, 8));
  useEffect(() => { const s = window.speechSynthesis; if (!s) return; const at = () => setDisp(vozesPt().filter(ehNatural).slice(0, 8)); at(); s.addEventListener?.("voiceschanged", at); return () => s.removeEventListener?.("voiceschanged", at); }, []);
  const Opcao = ({ v, nome, desc }) => (
    <button onClick={() => escolher(v)} aria-pressed={voz === v} className={cn("flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm", voz === v ? "border-acc bg-folha-2" : "border-risco bg-folha hover:border-risco-2")}>
      <span className="min-w-0"><b className="block truncate">{nome}</b><span className="text-apagado">{desc}</span></span>
      {falando === "amostra-" + v ? <Square className="size-4 shrink-0 text-acc" /> : <Volume2 className="size-4 shrink-0 text-apagado" />}
    </button>);
  return (
    <section aria-label="Escolher a voz" className="flex flex-col gap-3 rounded-2xl border border-risco bg-folha p-3">
      <p className="text-sm text-apagado">Toque numa voz para ouvir uma amostra. A que você tocar por último fica escolhida.</p>
      <div><h3 className="mb-1.5 text-sm font-bold">Vozes de IA (Gemini)</h3>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">{VOZES_IA.map(([nome, d]) => <Opcao key={nome} v={"g:" + nome} nome={nome} desc={d} />)}</div></div>
      {!!disp.length && <div><h3 className="mb-1.5 text-sm font-bold">Vozes naturais deste aparelho</h3>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">{disp.map((v) => <Opcao key={v.name} v={"d:" + v.name} nome={v.name.replace(/^Microsoft /, "").replace(/ Online \(Natural\).*/, "").replace(/ - .*$/, "")} desc={/natural|online/i.test(v.name) ? "Microsoft, grátis" : "do aparelho"} />)}</div>
        <p className="mt-1.5 text-xs text-apagado">No navegador Edge aparecem as vozes Francisca, Thalita e Antonio, que são as mais naturais de graça.</p></div>}
    </section>
  );
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


/* ───────── imagem: reduz no aparelho antes de mandar (foto de celular pode ter 5 MB) */
function lerImagem(arquivo) {
  return new Promise((ok, erro) => {
    const url = URL.createObjectURL(arquivo); const im = new Image();
    im.onload = () => {
      const fazer = (max, q) => { const k = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", q); };
      const grande = fazer(1600, 0.82), mini = fazer(360, 0.6); URL.revokeObjectURL(url);
      ok({ mime: "image/jpeg", b64: grande.split(",")[1], mini });
    };
    im.onerror = () => { URL.revokeObjectURL(url); erro(new Error("imagem")); };
    im.src = url;
  });
}
const CHAVE_DITADO = "missao-aprovacao-tutor-ditado-envia";

/* ───────── conversa por voz, em tela cheia: fala, a IA responde falando e volta a ouvir até fechar */
function ModoVoz({ agente, fase, parcial, ultima, tocar, fechar, pausar }) {
  const rotulo = { ouvindo: "Ouvindo… pode falar", pensando: "Pensando…", falando: "Falando… toque para interromper", pausado: "Pausado. Toque no círculo para falar" }[fase] || "";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Conversa por voz"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-lousa px-6 pb-[calc(28px+env(safe-area-inset-bottom))] pt-[calc(24px+env(safe-area-inset-top))]">
      <div className="flex items-center gap-2 text-sm text-apagado"><agente.Ic className="size-4" /> {agente.nome}</div>
      <div className="flex flex-col items-center gap-8">
        <button onClick={tocar} aria-label={rotulo} className="relative grid size-52 place-items-center rounded-full outline-none">
          <motion.span className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 35% 30%, #fff8, ${agente.cor} 45%, ${agente.cor}55 75%)` }}
            animate={fase === "ouvindo" ? { scale: [1, 1.08, 1] } : fase === "falando" ? { scale: [1, 1.14, 0.96, 1.1, 1] } : fase === "pensando" ? { scale: [0.92, 0.98, 0.92], rotate: [0, 180, 360] } : { scale: 0.85 }}
            transition={{ duration: fase === "falando" ? 1.1 : fase === "pensando" ? 1.6 : 2, repeat: Infinity, ease: "easeInOut" }} />
          {fase === "pensando" && <Loader2 className="relative size-8 animate-spin" style={{ color: TINTA }} />}
          {fase === "pausado" && <Mic className="relative size-10" style={{ color: TINTA }} />}
        </button>
        <div className="flex min-h-24 max-w-md flex-col items-center gap-2 text-center">
          <b>{rotulo}</b>
          {parcial ? <p className="text-lg">{parcial}</p> : ultima ? <p className="line-clamp-4 text-apagado">{limparTxt(ultima)}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Button size="icon" variant="secondary" className="size-14 rounded-full" onClick={pausar} aria-label={fase === "pausado" ? "Voltar a ouvir" : "Pausar o microfone"}>{fase === "pausado" ? <Mic /> : <MicOff />}</Button>
        <Button size="icon" variant="secondary" className="size-14 rounded-full" onClick={fechar} aria-label="Encerrar conversa por voz"><X /></Button>
      </div>
    </motion.div>
  );
}

export default function Tutor() {
  const n = useNucleo(); const S = n.getS(); const o = S.obj;
  const [ag, setAg] = useState(() => AG[localStorage.getItem(CHAVE_AG)] ? localStorage.getItem(CHAVE_AG) : "professor");
  const [escolhendo, setEscolhendo] = useState(() => !localStorage.getItem(CHAVE_AG));
  const [txt, setTxt] = useState("");
  const [anexo, setAnexo] = useState(null);
  const [pensando, setPensando] = useState(false);
  const [falando, setFalando] = useState(null);
  const [ouvindo, setOuvindo] = useState(false);
  const [vozPainel, setVozPainel] = useState(false);
  const [menu, setMenu] = useState(null); // "mais" | "mic" | null
  const [ditadoEnvia, setDitadoEnvia] = useState(() => localStorage.getItem(CHAVE_DITADO) === "1");
  const [modoVoz, setModoVoz] = useState(false);
  const [fase, setFase] = useState("ouvindo");
  const [parcial, setParcial] = useState("");
  const [ultima, setUltima] = useState("");
  const [voz, setVoz] = useState(qualVoz);
  const escolherVoz = (v) => { qualVoz = v; setVoz(v); try { localStorage.setItem(CHAVE_QUAL, v); } catch { /* ok */ } destravar(); ouvir("amostra-" + v, AMOSTRA); };
  const fim = useRef(null); const rec = useRef(null); const vez = useRef(0); const enviarRef = useRef(null);
  const camRef = useRef(null); const galRef = useRef(null); const txtRef = useRef(null);
  const fimFalaRef = useRef(null); const modoRef = useRef(false); const silencios = useRef(0);
  const agente = AG[ag];
  const todos = S.chat || [];
  const chat = todos.map((m, i) => ({ ...m, k: m.id || `x${i}` })).filter((m) => (m.ag || "professor") === ag);
  useEffect(() => { if (!escolhendo) fim.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [chat.length, pensando, escolhendo]);
  useEffect(() => () => { modoRef.current = false; vez.current++; pararTudo(); try { rec.current?.abort(); } catch { /* ok */ } }, []);
  const parar = () => { vez.current++; pararTudo(); setFalando(null); const f = fimFalaRef.current; fimFalaRef.current = null; f?.(); };

  const escolher = (id) => { fecharModoVoz(); parar(); try { rec.current?.abort(); } catch { /* ok */ } setAg(id); localStorage.setItem(CHAVE_AG, id); setEscolhendo(false); };

  /* Fala um texto; a promessa termina quando a fala acaba ou é interrompida */
  function ouvir(k, texto) {
    if (falando === k) { parar(); return Promise.resolve(); }
    parar(); const meu = vez.current; setFalando(k);
    return new Promise((resolve) => {
      const fimFala = () => { setFalando((x) => (x === k ? null : x)); if (fimFalaRef.current === fimFala) fimFalaRef.current = null; resolve(); };
      fimFalaRef.current = fimFala;
      (async () => {
        try {
          if (qualVoz.startsWith("d:")) throw new Error("aparelho");
          const url = await audioNatural(texto, qualVoz.slice(2));
          if (vez.current !== meu) return; // parou ou trocou enquanto carregava
          player.src = url; player.onended = fimFala; player.onerror = fimFala;
          await player.play();
        } catch {
          if (vez.current !== meu) return;
          const u = falarAparelho(limparTxt(texto), qualVoz.startsWith("d:") ? qualVoz.slice(2) : "", n); // voz do aparelho
          if (u) { u.onend = fimFala; u.onerror = fimFala; } else fimFala();
        }
      })();
    });
  }

  function contexto() {
    const mats = n.OBJS[o].materias.map((m) => ({ m, s: n.statMat(o, m.id) })).filter((x) => x.s.t >= 3).map((x) => `${x.m.nome}: ${Math.round(x.s.p * 100)}% em ${x.s.t} questões`);
    const dia = (new Date().getDay() + 6) % 7;
    return { objetivo: n.OBJS[o].nome, dias: n.diasAte(S.cfg.datas[o]), horas: S.cfg.horas?.[dia],
      fracos: n.temasFracos(o, 5).filter((x) => x.s.t).map((x) => `${x.tema} (${Math.round(x.s.p * 100)}%)`), materias: mats };
  }

  // Sem IA: só o professor e o plano usam o material do app como reserva; os outros agentes avisam com honestidade.
  function reserva(q, erro, comImg) {
    const motivo = erro || "Os agentes de IA não responderam agora.";
    if (!comImg && (ag === "professor" || ag === "plano")) return { txt: n.respostaTutor(q).txt, ag, aviso: `${motivo} Esta resposta veio do material do app.` };
    return { txt: `${motivo} Tente de novo em instantes.`, ag, aviso: "Sua mensagem ficou salva aqui na conversa." };
  }

  /* Guarda só as miniaturas das últimas imagens, para não lotar a memória do navegador */
  function podarImagens(lista) {
    let k = 0;
    return lista.slice().reverse().map((m) => (m.img && ++k > 10 ? { ...m, img: undefined } : m)).reverse();
  }

  async function enviar(pergunta) {
    const img = pergunta === undefined ? anexo : null;
    const q = ((pergunta ?? txt).trim()) || (img ? "Me ajuda com esta questão da imagem." : "");
    if (!q || pensando) return null;
    // comandos rápidos
    if (!img && /^\/(list-agents|agentes|agents)\b/i.test(q)) { setTxt(""); setEscolhendo(true); return null; }
    if (!img && /^\/limpar\b/i.test(q)) { setTxt(""); limpar(); return null; }
    if (!img && /^\/voz\b/i.test(q)) { setTxt(""); setVozPainel(true); return null; }
    if (!modoRef.current) parar();
    setTxt(""); setAnexo(null);
    const S = n.getS();
    S.chat = podarImagens([...(S.chat || []), { id: novoId(), me: true, txt: q, ag, ...(img ? { img: img.mini } : {}) }]).slice(-120); n.salvar(); n.render();
    setPensando(true);
    const mensagens = S.chat.filter((m) => (m.ag || "professor") === ag).slice(-12).map((m, i, a) => ({ de: m.me ? "eu" : "ia", txt: m.img && i < a.length - 1 ? `(mandei uma imagem) ${m.txt}` : m.txt }));
    let resp;
    try {
      const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens, contexto: contexto(), agente: ag, ...(img ? { imagem: { mime: img.mime, b64: img.b64 } } : {}) }) });
      const d = await r.json().catch(() => ({}));
      resp = r.ok && d.txt ? { txt: d.txt, ia: true, ag } : reserva(q, d.erro, !!img);
    } catch {
      resp = reserva(q, "Sem internet agora.", !!img);
    }
    resp.id = novoId();
    S.chat = [...S.chat, resp].slice(-120); n.salvar(); n.render();
    setPensando(false);
    return resp;
  }
  enviarRef.current = enviar;

  async function anexar(arquivo) {
    setMenu(null);
    if (!arquivo) return;
    if (!/^image\//.test(arquivo.type)) { n.ui.toast("Mande uma imagem (foto ou print)."); return; }
    try { setAnexo(await lerImagem(arquivo)); txtRef.current?.focus(); }
    catch { n.ui.toast("Não consegui abrir essa imagem. Tente um print ou outra foto."); }
  }
  function colar(e) {
    const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith("image/"));
    if (f) { e.preventDefault(); anexar(f); }
  }

  /* Microfone do campo de texto: ditado. Escreve o que você fala; envia sozinho só se você ligar isso no menu. */
  function microfone() {
    setMenu(null);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { n.ui.toast("Seu navegador não deixa ditar. Digite a pergunta."); return; }
    if (ouvindo) { rec.current?.stop(); return; }
    parar(); destravar();
    const antes = txt.trim();
    const r = new SR(); r.lang = "pt-BR"; r.interimResults = true; r.continuous = false; rec.current = r;
    let final = "";
    r.onresult = (e) => { const t = [...e.results].map((x) => x[0].transcript).join(" "); setTxt((antes ? antes + " " : "") + t); if (e.results[e.results.length - 1].isFinal) final = t; };
    r.onend = () => { setOuvindo(false); if (final.trim() && ditadoEnvia) enviarRef.current?.((antes ? antes + " " : "") + final); };
    r.onerror = (e) => { setOuvindo(false); if (e.error === "not-allowed" || e.error === "service-not-allowed") n.ui.toast("Libere o microfone para este site nas permissões do navegador."); else if (e.error !== "no-speech" && e.error !== "aborted") n.ui.toast("Não consegui ouvir. Tente de novo ou digite."); };
    try { r.start(); setOuvindo(true); } catch { setOuvindo(false); }
  }

  /* Conversa por voz: ouvir → pensar → falar → ouvir de novo, até fechar */
  function escutar() {
    if (!modoRef.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { n.ui.toast("Seu navegador não tem reconhecimento de voz. Use o Chrome ou o Edge."); fecharModoVoz(); return; }
    try { rec.current?.abort(); } catch { /* ok */ }
    const r = new SR(); r.lang = "pt-BR"; r.interimResults = true; r.continuous = false; rec.current = r;
    let final = ""; let negado = false;
    setFase("ouvindo"); setParcial("");
    r.onresult = (e) => { const t = [...e.results].map((x) => x[0].transcript).join(" "); setParcial(t); if (e.results[e.results.length - 1].isFinal) final = t; };
    r.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") { negado = true; n.ui.toast("Libere o microfone para este site nas permissões do navegador."); } };
    r.onend = async () => {
      if (rec.current !== r || !modoRef.current) return;
      if (negado) { fecharModoVoz(); return; }
      if (!final.trim()) { // silêncio: tenta de novo algumas vezes e depois pausa
        if (++silencios.current >= 3) { setFase("pausado"); setParcial(""); return; }
        escutar(); return;
      }
      silencios.current = 0;
      setFase("pensando");
      const resp = await enviarRef.current?.(final);
      setParcial("");
      if (!modoRef.current) return;
      if (resp?.txt) { setUltima(resp.txt); setFase("falando"); await ouvir(resp.id, resp.txt); }
      if (modoRef.current) escutar();
    };
    try { r.start(); } catch { setFase("pausado"); }
  }
  function abrirModoVoz() {
    setMenu(null); setVozPainel(false); parar(); destravar();
    try { rec.current?.abort(); } catch { /* ok */ } setOuvindo(false);
    modoRef.current = true; silencios.current = 0; setUltima(""); setParcial(""); setModoVoz(true); escutar();
  }
  function fecharModoVoz() {
    if (!modoRef.current && !modoVoz) return;
    modoRef.current = false; setModoVoz(false); setParcial("");
    try { rec.current?.abort(); } catch { /* ok */ } parar();
  }
  function tocarOrbe() {
    if (fase === "falando") { parar(); return; } // interrompe e volta a ouvir
    if (fase === "ouvindo") { rec.current?.stop(); return; } // terminei de falar
    if (fase === "pausado") { silencios.current = 0; destravar(); escutar(); }
  }
  function pausarModoVoz() {
    if (fase === "pausado") { silencios.current = 0; escutar(); return; }
    const r = rec.current; rec.current = null; try { r?.abort(); } catch { /* ok */ }
    parar(); setFase("pausado"); setParcial("");
  }

  function limpar() { parar(); S.chat = todos.filter((m) => (m.ag || "professor") !== ag); n.salvar(); n.render(); }
  function trocarDitado() { const v = !ditadoEnvia; setDitadoEnvia(v); localStorage.setItem(CHAVE_DITADO, v ? "1" : "0"); }

  const temTexto = !!txt.trim() || !!anexo;
  const itemMenu = "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-folha-2";

  return (
    <div className="flex flex-col gap-4">
      <Cabeca eyebrow={n.OBJS[o].nome} titulo="Agentes de estudo">Professores com IA, cada um com uma função. Escreva, mande a foto de uma questão ou converse por voz.</Cabeca>

      {escolhendo ? <Escolher o={o} atual={ag} escolher={escolher} /> : <>
        <div className="flex items-center gap-3 rounded-2xl border border-risco bg-folha p-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: agente.cor, color: TINTA }}><agente.Ic className="size-5" /></span>
          <div className="min-w-0 flex-1"><b className="block leading-tight">{agente.nome}</b><span className="text-sm text-apagado">{agente.desc}</span></div>
          <Button size="sm" variant="secondary" onClick={() => setEscolhendo(true)}><Users /> Trocar</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" aria-expanded={vozPainel} onClick={() => setVozPainel((x) => !x)}><Mic2 /> Voz: {voz.slice(2).replace(/^Microsoft /, "").replace(/ Online \(Natural\).*/, "")}</Button>
          {!!chat.length && <Button size="sm" variant="ghost" onClick={limpar}><Trash2 /> Limpar conversa</Button>}
        </div>
        {vozPainel && <PainelVoz voz={voz} escolher={escolherVoz} falando={falando} />}

        <section aria-label="Conversa" aria-live="polite" className="flex min-h-[36vh] flex-col gap-3">
          {!chat.length && (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-risco-2 p-4">
              <p>{agente.oi}</p>
              <div className="flex flex-wrap gap-2">{agente.sug.map((s) => <button key={s} onClick={() => enviar(s)} className="rounded-full border border-risco-2 bg-folha-2 px-3 py-1.5 text-sm font-bold hover:border-acc">{s}</button>)}</div>
              <span className="text-xs text-apagado">Dica: toque no + para mandar a foto de uma questão, ou no botão de ondas para conversar por voz.</span>
            </div>)}
          <AnimatePresence initial={false}>
            {chat.map((m) => (
              <motion.div key={m.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", m.me ? "justify-end" : "justify-start")}>
                <div className={cn("flex max-w-[90%] flex-col gap-2 rounded-2xl px-4 py-3 leading-relaxed", m.me ? "rounded-br-md bg-acc text-sobre-acc" : "rounded-bl-md border border-risco bg-folha")}>
                  {m.me ? <>
                    {m.img && <img src={m.img} alt="Imagem enviada" className="max-h-56 w-auto self-end rounded-lg" />}
                    <p className="whitespace-pre-wrap">{m.txt}</p>
                  </> : <>
                    {m.ia && <span className="inline-flex items-center gap-1 text-xs font-bold text-acc"><Sparkles className="size-3.5" /> {agente.nome}</span>}
                    <div className="flex flex-col gap-1"><Rico txt={m.txt} /></div>
                    {m.aviso && <span className="text-xs text-apagado">{m.aviso}</span>}
                    <Button size="sm" variant="ghost" className="self-start" onClick={() => { destravar(); ouvir(m.k, m.txt); }}>{falando === m.k ? <><Square /> Parar</> : <><Volume2 /> Ouvir</>}</Button>
                  </>}
                </div>
              </motion.div>))}
          </AnimatePresence>
          {pensando && !modoVoz && <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-risco bg-folha px-4 py-3 text-apagado"><Loader2 className="size-4 animate-spin" /> pensando…</div>}
          <div ref={fim} />
        </section>

        <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { anexar(e.target.files?.[0]); e.target.value = ""; }} />
        <input ref={galRef} type="file" accept="image/*" hidden onChange={(e) => { anexar(e.target.files?.[0]); e.target.value = ""; }} />
        {menu && <button aria-label="Fechar menu" className="fixed inset-0 z-20 cursor-default" onClick={() => setMenu(null)} />}

        <form onSubmit={(e) => { e.preventDefault(); destravar(); enviar(); }} className="vidro sticky bottom-[calc(76px+env(safe-area-inset-bottom))] z-30 flex flex-col gap-1 rounded-3xl border border-risco-2 p-2 md:bottom-4">
          {anexo && (
            <div className="relative ml-1 mt-1 self-start">
              <img src={anexo.mini} alt="Imagem anexada" className="h-20 w-auto rounded-xl border border-risco" />
              <button type="button" onClick={() => setAnexo(null)} aria-label="Tirar a imagem" className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-giz text-lousa"><X className="size-3.5" /></button>
            </div>)}
          <label htmlFor="pergunta" className="sr-only">Sua mensagem para {agente.nome}</label>
          <textarea id="pergunta" ref={txtRef} rows={ag === "redacao" || ag === "corretor" ? 3 : 1} value={txt} onChange={(e) => setTxt(e.target.value)} onPaste={colar}
            placeholder={ouvindo ? "Pode falar…" : anexo ? "Diga o que quer saber da imagem (opcional)" : ag === "redacao" ? "Cole sua redação ou peça um tema" : ag === "corretor" ? "Cole a questão ou mande uma foto dela" : "Pergunte qualquer coisa"}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && ag !== "redacao") { e.preventDefault(); enviar(); } }}
            className="max-h-48 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-giz outline-none placeholder:text-apagado" />
          <div className="flex items-center gap-1">
            <div className="relative z-30">
              <Button type="button" size="icon" variant="ghost" className="rounded-full" aria-label="Anexar foto ou print" aria-expanded={menu === "mais"} onClick={() => setMenu(menu === "mais" ? null : "mais")}><Plus className="!size-5" /></Button>
              <AnimatePresence>{menu === "mais" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} role="menu" className="absolute bottom-12 left-0 w-64 rounded-2xl border border-risco-2 bg-folha p-1.5 shadow-xl">
                  <button type="button" role="menuitem" className={itemMenu} onClick={() => camRef.current?.click()}><Camera className="size-4" /> Tirar foto da questão</button>
                  <button type="button" role="menuitem" className={itemMenu} onClick={() => galRef.current?.click()}><ImageIcon className="size-4" /> Foto ou print da galeria</button>
                  <p className="px-3 pb-1.5 pt-1 text-xs text-apagado">No computador, você também pode colar um print com Ctrl+V.</p>
                </motion.div>)}</AnimatePresence>
            </div>
            <div className="flex-1" />
            <div className="relative z-30 flex items-center">
              <Button type="button" size="icon" variant={ouvindo ? "default" : "ghost"} className="rounded-full" onClick={microfone} aria-label={ouvindo ? "Parar o ditado" : "Ditar"}>{ouvindo ? <MicOff className="!size-5" /> : <Mic className="!size-5" />}</Button>
              <button type="button" className="grid h-11 w-6 place-items-center text-apagado hover:text-giz" aria-label="Opções de voz" aria-expanded={menu === "mic"} onClick={() => setMenu(menu === "mic" ? null : "mic")}><ChevronDown className="size-4" /></button>
              <AnimatePresence>{menu === "mic" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} role="menu" className="absolute bottom-12 right-0 w-72 rounded-2xl border border-risco-2 bg-folha p-1.5 shadow-xl">
                  <button type="button" role="menuitem" className={itemMenu} onClick={abrirModoVoz}><AudioLines className="size-4" /> <span><b className="block">Conversa por voz</b><span className="text-xs text-apagado">Você fala, ele responde falando</span></span></button>
                  <button type="button" role="menuitem" className={itemMenu} onClick={microfone}><Mic className="size-4" /> <span><b className="block">Ditar mensagem</b><span className="text-xs text-apagado">Escreve o que você falar</span></span></button>
                  <button type="button" role="menuitemcheckbox" aria-checked={ditadoEnvia} className={itemMenu} onClick={trocarDitado}><Send className="size-4" /> <span className="flex-1">Enviar sozinho ao parar de ditar</span>{ditadoEnvia && <Check className="size-4 text-acc" />}</button>
                  <button type="button" role="menuitem" className={itemMenu} onClick={() => { setMenu(null); setVozPainel(true); }}><Mic2 className="size-4" /> Escolher a voz do tutor</button>
                </motion.div>)}</AnimatePresence>
            </div>
            {temTexto || pensando
              ? <Button type="submit" size="icon" className="rounded-full" disabled={!temTexto || pensando} aria-label="Enviar"><Send className="!size-5" /></Button>
              : <Button type="button" size="icon" className="rounded-full" onClick={abrirModoVoz} aria-label="Conversa por voz"><AudioLines className="!size-5" /></Button>}
          </div>
        </form>
      </>}

      <AnimatePresence>{modoVoz && <ModoVoz agente={agente} fase={fase} parcial={parcial} ultima={ultima} tocar={tocarOrbe} fechar={fecharModoVoz} pausar={pausarModoVoz} />}</AnimatePresence>
    </div>
  );
}
