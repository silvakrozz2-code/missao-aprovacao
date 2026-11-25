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
