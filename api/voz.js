// POST /api/voz  { texto, voz } → áudio com voz natural.
// voz "ms:Thalita" (ou Francisca, Antonio) usa as vozes neurais da Microsoft pelo Azure Speech; se não der, cai para o Gemini.
// Qualquer outro nome é uma voz do Gemini. Se nada funcionar, o app usa a voz do aparelho.
import { logado, json, falarGemini, falarAzure } from "../lib-ia.js";

export async function POST(req) {
  if (!(await logado(req))) return json({ erro: "Entre na sua conta." }, 401);
  let corpo; try { corpo = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400); }
  const texto = String(corpo.texto || "").replace(/\*\*/g, "").replace(/[#`_>]/g, "").trim().slice(0, 1800);
  if (!texto) return json({ erro: "Sem texto." }, 400);
  const voz = String(corpo.voz || "");
  const cache = { "Cache-Control": "private, max-age=86400" };
  if (voz.startsWith("ms:") && process.env.AZURE_SPEECH_KEY) {
    try { return new Response(await falarAzure(texto, voz.slice(3)), { headers: { "Content-Type": "audio/mpeg", ...cache } }); }
    catch (e) { console.warn(`[voz] Azure: ${e.status || e.message}`); }
  }
  if (!process.env.GEMINI_API_KEY) return json({ erro: "Voz natural não configurada." }, 501);
  try {
    const wav = await falarGemini(texto, voz.startsWith("ms:") ? "" : voz);
    return new Response(wav, { headers: { "Content-Type": "audio/wav", ...cache } });
  } catch (e) {
    return json({ erro: e.publico || "Voz indisponível agora." }, e.status || 502);
  }
}
