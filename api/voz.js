// POST /api/voz  { texto } → áudio WAV com voz natural (Gemini TTS). Se não der, o app usa a voz do aparelho.
import { logado, json, falarGemini } from "../lib-ia.js";

export async function POST(req) {
  if (!(await logado(req))) return json({ erro: "Entre na sua conta." }, 401);
  if (!process.env.GEMINI_API_KEY) return json({ erro: "Voz natural não configurada." }, 501);
  let corpo; try { corpo = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400); }
  const texto = String(corpo.texto || "").replace(/\*\*/g, "").replace(/[#`_>]/g, "").trim().slice(0, 1800);
  if (!texto) return json({ erro: "Sem texto." }, 400);
  try {
    const wav = await falarGemini(texto, corpo.voz);
    return new Response(wav, { headers: { "Content-Type": "audio/wav", "Cache-Control": "private, max-age=86400" } });
  } catch (e) {
    return json({ erro: e.publico || "Voz indisponível agora." }, e.status || 502);
  }
}
