// Escolha da voz de leitura. Usa a voz pt-BR mais natural que o aparelho tiver
// (no Edge/Windows: vozes "Online (Natural)" como Francisca e Antonio; no Chrome: Google português do Brasil).
// A escolha fica salva só neste aparelho, porque cada aparelho tem vozes diferentes.
const CHAVE = "ma-voz";
const ss = () => (typeof window !== "undefined" ? window.speechSynthesis : null);

function nota(v) {
  const nome = v.name || ""; let p = 0;
  if (/^pt[-_]BR/i.test(v.lang)) p += 100; else if (/^pt/i.test(v.lang)) p += 40; else return -1;
  if (/natural/i.test(nome)) p += 60;
  if (/online/i.test(nome)) p += 25;
  if (/francisca|antonio|thalita|brenda|donato|elza|fabio|giovanna|humberto|julio|leila|leticia|manuela|nicolau|valerio|yara/i.test(nome)) p += 15;
  if (/neural/i.test(nome)) p += 60;
  if (/google/i.test(nome)) p += 20;
  if (/luciana|felipe|premium|enhanced|aprimorad/i.test(nome)) p += 12;
  if (/maria|daniel|helia|desktop/i.test(nome)) p -= 5;
  if (!v.localService) p += 3;
  return p;
}

export function vozesPt() {
  const s = ss(); if (!s) return [];
  return s.getVoices().filter((v) => nota(v) >= 0).sort((a, b) => nota(b) - nota(a));
}
export function vozSalva() { try { return localStorage.getItem(CHAVE) || ""; } catch (e) { return ""; } }
export function salvarVoz(nome) { try { nome ? localStorage.setItem(CHAVE, nome) : localStorage.removeItem(CHAVE); } catch (e) { /* sem armazenamento */ } }
export function melhorVoz() {
  const lista = vozesPt(); const n = vozSalva();
  return (n && lista.find((v) => v.name === n)) || lista[0] || null;
}
export const ehNatural = (v) => !!v && /natural|online|neural|google|premium|enhanced|aprimorad/i.test(v.name);
// Prepara uma fala com a melhor voz. Vozes naturais soam melhor um pouco mais devagar que o padrão.
export function fala(txt, vel = 1) {
  const u = new SpeechSynthesisUtterance(txt); u.lang = "pt-BR"; u.rate = vel;
  const v = melhorVoz(); if (v) { u.voice = v; u.lang = v.lang; }
  return u;
}
// As vozes chegam de forma assíncrona em alguns navegadores.
if (ss()) { try { ss().getVoices(); ss().addEventListener?.("voiceschanged", () => ss().getVoices()); } catch (e) { /* */ } }

/* ───────── Vozes de IA naturais, lidas pelo servidor (/api/voz). Aparecem sempre no seletor;
   só tocam de verdade quando a OPENAI_API_KEY está no servidor. Sem ela, a leitura cai para a voz do aparelho. */
// Vozes de IA grátis do Gemini (pt-BR, com limite diário do plano grátis). Sulafat é a padrão.
export const VOZES_GEMINI = [
  ["g:Sulafat", "Sulafat · IA grátis (padrão)"],
  ["g:Achird", "Achird · IA grátis"],
  ["g:Zephyr", "Zephyr · IA grátis"],
  ["g:Aoede", "Aoede · IA grátis"],
];
// Vozes de IA da OpenAI (pagas, precisam da OPENAI_API_KEY no servidor).
export const VOZES_SERVIDOR = [
  ["openai:marin", "Marin · IA natural (OpenAI)"],
  ["openai:cedar", "Cedar · IA natural (OpenAI)"],
  ["openai:coral", "Coral · IA natural (OpenAI)"],
];
// Voz de IA padrão: grátis, natural, sem cartão. Toca pelo Gemini; se o limite diário estourar, cai para a voz do aparelho.
export const VOZ_IA_PADRAO = "g:Sulafat";
export const ehServidor = (sel) => /^(openai:|ms:|g:)/.test(sel || "");
// A voz em uso: a escolhida pela pessoa ou, sem escolha, a voz de IA grátis padrão.
export const vozAtual = () => vozSalva() || VOZ_IA_PADRAO;
// Converte o valor salvo para o que o /api/voz espera (o Gemini recebe o nome cru, sem o prefixo "g:").
const vozParaServidor = (sel) => (sel.startsWith("g:") ? sel.slice(2) : sel);

const cacheIA = new Map();
const playerIA = typeof Audio !== "undefined" ? new Audio() : null;
let destravado = false;
const SILENCIO = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
// Chame num toque do usuário para o celular deixar tocar o áudio que chega depois do fetch.
export function destravarLeitura() { if (destravado || !playerIA) return; destravado = true; try { playerIA.src = SILENCIO; playerIA.play().catch(() => {}); } catch { /* ok */ } }
export function pararLeitura() { try { ss()?.cancel(); } catch { /* */ } try { playerIA?.pause(); } catch { /* */ } }
const limparTxt = (t) => String(t).replace(/\*\*/g, "").replace(/^[-•#]+\s*/gm, "").trim();

/* Lê um texto com a voz escolhida. Se for voz de IA, busca no servidor e toca; senão usa a voz do aparelho.
   onend roda ao terminar ou se a fala não começar. Use pararLeitura() para interromper. */
export async function lerTexto(txt, vel = 1, onend) {
  const fim = () => onend?.();
  const sel = vozAtual();
  const texto = limparTxt(txt);
  if (ehServidor(sel) && playerIA) {
    try {
      const chave = sel + "|" + texto;
      let url = cacheIA.get(chave);
      if (!url) {
        const r = await fetch("/api/voz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto, voz: vozParaServidor(sel) }) });
        if (!r.ok) throw new Error("ia");
        url = URL.createObjectURL(await r.blob()); cacheIA.set(chave, url);
      }
      playerIA.src = url; playerIA.playbackRate = vel; playerIA.onended = fim; playerIA.onerror = fim;
      await playerIA.play();
      return;
    } catch { /* cai para a voz do aparelho */ }
  }
  const s = ss();
  if (!s) { fim(); return; }
  s.cancel(); const u = fala(texto, vel); u.onend = fim; u.onerror = fim; s.speak(u);
}
