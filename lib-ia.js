// Funções do tutor de IA usadas por /api/tutor e /api/voz (rodam só no servidor; a chave nunca vai para o navegador)
import { token, igual, COOKIE, lerCookie } from "./lib-login.js";

export const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

export async function logado(req) {
  const { LOGIN_USUARIO: u, LOGIN_SEGREDO: s } = process.env;
  if (!u || !s) return true; // sem login configurado, o middleware já cuida
  const c = lerCookie(req, COOKIE);
  return !!c && igual(c, await token(u, s));
}

const falha = (status, publico) => Object.assign(new Error(publico), { status, publico });
const G = "https://generativelanguage.googleapis.com/v1beta/models/";

async function chamarGemini(modelo, corpo) {
  const r = await fetch(`${G}${modelo}:generateContent`, {
    method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY }, body: JSON.stringify(corpo),
  });
  if (r.ok) return r.json();
  if (r.status === 429) throw falha(429, "O limite grátis do Gemini acabou por agora. Tente de novo daqui a pouco.");
  if (r.status === 400 || r.status === 403) throw falha(502, "A chave do Gemini não foi aceita. Confira a GEMINI_API_KEY na Vercel.");
  throw falha(502, "O Gemini não respondeu agora. Tente de novo em instantes.");
}

async function gemini(sistema, msgs, modelo) {
  const d = await chamarGemini(modelo, {
    systemInstruction: { parts: [{ text: sistema }] },
    contents: msgs.map((m) => ({ role: m.de === "ia" ? "model" : "user", parts: [{ text: m.txt }] })),
    generationConfig: { maxOutputTokens: 900, temperature: 0.6, thinkingConfig: { thinkingBudget: 0 } },
  });
  return d.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
}

/* Provedores no formato OpenAI (chat/completions). Cada um com a sua chave; vários modelos para o caso de algum sair do ar. */
const COMPAT = [
  { nome: "Groq", env: "GROQ_API_KEY", url: "https://api.groq.com/openai/v1/chat/completions", modelos: ["llama-3.3-70b-versatile", "openai/gpt-oss-120b"] },
  { nome: "Cerebras", env: "CEREBRAS_API_KEY", url: "https://api.cerebras.ai/v1/chat/completions", modelos: ["gpt-oss-120b", "llama-3.3-70b"] },
  { nome: "Mistral", env: "MISTRAL_API_KEY", url: "https://api.mistral.ai/v1/chat/completions", modelos: ["mistral-small-latest", "mistral-medium-latest"] },
  { nome: "OpenRouter", env: "OPENROUTER_API_KEY", url: "https://openrouter.ai/api/v1/chat/completions", modelos: ["openrouter/free", "google/gemma-4-31b-it:free"] },
  { nome: "GitHub Models", env: "GITHUB_MODELS_TOKEN", url: "https://models.github.ai/inference/chat/completions", modelos: ["openai/gpt-4.1-mini", "openai/gpt-4o-mini"] },
  { nome: "AI Gateway", env: "AI_GATEWAY_API_KEY", url: "https://ai-gateway.vercel.sh/v1/chat/completions", modelos: ["google/gemini-3-flash"] },
];
async function compat(p, chave, modelo, sistema, msgs) {
  const r = await fetch(p.url, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${chave}`, ...(p.nome === "OpenRouter" ? { "X-Title": "Missao Aprovacao" } : {}) },
    body: JSON.stringify({ model: modelo, max_tokens: 900, temperature: 0.6,
      messages: [{ role: "system", content: sistema }, ...msgs.map((m) => ({ role: m.de === "ia" ? "assistant" : "user", content: m.txt }))] }),
    signal: AbortSignal.timeout(25000),
  });
  if (!r.ok) throw falha(r.status, `${p.nome} ${r.status}`);
  const d = await r.json();
  return d.choices?.[0]?.message?.content?.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

/* Tenta cada IA que tiver chave, na ordem. Se uma estourar o limite grátis ou falhar, passa para a próxima. */
export async function responder(sistema, msgs) {
  const tentativas = [];
  if (process.env.GEMINI_API_KEY) for (const m of ["gemini-2.5-flash", "gemini-2.5-flash-lite"]) tentativas.push({ nome: "Gemini", rodar: () => gemini(sistema, msgs, m) });
  for (const p of COMPAT) {
    const chave = process.env[p.env] || (p.nome === "AI Gateway" ? process.env.VERCEL_OIDC_TOKEN : "");
    if (chave) for (const m of p.modelos) tentativas.push({ nome: p.nome, rodar: () => compat(p, chave, m, sistema, msgs) });
  }
  if (!tentativas.length) throw falha(501, "O tutor ainda não tem chave de IA. Coloque GEMINI_API_KEY (ou GROQ_API_KEY, etc.) nas variáveis de ambiente da Vercel.");
  const pulou = new Set();
  for (const t of tentativas) {
    if (pulou.has(t.nome)) continue;
    try { const txt = await t.rodar(); if (txt) return { txt, fonte: t.nome }; }
    catch (e) { if ([401, 403, 429, 402].includes(e.status)) pulou.add(t.nome); /* chave recusada ou limite: pula o provedor todo */ }
  }
  throw falha(503, "Todas as IAs grátis estão no limite agora. Tente de novo daqui a pouco.");
}

/* Voz natural: Gemini TTS devolve PCM 16 bits, 24 kHz, mono. Embrulhamos num WAV para o navegador tocar. */
const VOZES = new Set(["Kore", "Aoede", "Leda", "Callirrhoe", "Charon", "Puck", "Fenrir", "Orus", "Sulafat", "Achird"]);
export async function falarGemini(texto, voz) {
  const nome = VOZES.has(voz) ? voz : "Kore";
  const d = await chamarGemini("gemini-2.5-flash-preview-tts", {
    contents: [{ parts: [{ text: `Leia em português do Brasil, com voz calma e natural de professor, no ritmo de uma conversa: ${texto}` }] }],
    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: nome } } } },
  });
  const b64 = d.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
  if (!b64) throw falha(502, "Voz indisponível agora.");
  const pcm = Buffer.from(b64, "base64");
  const h = Buffer.alloc(44), taxa = 24000;
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(taxa, 24);
  h.writeUInt32LE(taxa * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
