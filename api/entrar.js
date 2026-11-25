// POST /api/entrar  (usuario, senha) → cookie de sessão por 90 dias.  POST /api/entrar?sair=1 → apaga o cookie.
import { sha256, token, igual, COOKIE } from "../lib-login.js";
export const config = { runtime: "edge" };
const espera = () => new Promise((r) => setTimeout(r, 600));
export default async function handler(req) {
  const url = new URL(req.url);
  if (url.searchParams.get("sair")) return new Response(null, { status: 303, headers: { Location: "/entrar", "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });
  if (req.method !== "POST") return new Response("Use o formulário de entrada.", { status: 405 });
  const { LOGIN_USUARIO: u, LOGIN_SENHA_HASH: h, LOGIN_SEGREDO: s } = process.env;
  if (!u || !h || !s) return new Response("Login não configurado.", { status: 500 });
  const f = await req.formData();
  const usuario = String(f.get("usuario") || "").trim().toLowerCase(), senha = String(f.get("senha") || "");
  let volta = String(f.get("volta") || "/"); if (!volta.startsWith("/") || volta.startsWith("//")) volta = "/";
  const ok = igual(usuario, u.toLowerCase()) & igual(await sha256(senha), h);
  if (!ok) { await espera(); return new Response(null, { status: 303, headers: { Location: `/entrar?erro=1${volta !== "/" ? `&volta=${encodeURIComponent(volta)}` : ""}` } }); }
  return new Response(null, { status: 303, headers: { Location: volta, "Set-Cookie": `${COOKIE}=${encodeURIComponent(await token(u, s))}; Path=/; Max-Age=7776000; HttpOnly; Secure; SameSite=Lax` } });
}
