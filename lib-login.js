// Funções compartilhadas pelo middleware e pela rota /api/entrar (Web Crypto, roda no edge e no Node)
const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
export const sha256 = async (txt) => hex(await crypto.subtle.digest("SHA-256", enc.encode(txt)));
export async function token(usuario, segredo) {
  const k = await crypto.subtle.importKey("raw", enc.encode(segredo), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return `${usuario}.${hex(await crypto.subtle.sign("HMAC", k, enc.encode("missao:" + usuario)))}`;
}
export function igual(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
export const COOKIE = "ma_sessao";
export function lerCookie(req, nome) { const m = (req.headers.get("cookie") || "").match(new RegExp(`(?:^|; )${nome}=([^;]+)`)); return m ? decodeURIComponent(m[1]) : null; }
