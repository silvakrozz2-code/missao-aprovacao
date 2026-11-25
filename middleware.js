// Vercel Routing Middleware: nada do app abre sem estar logado (inclui /classico e os arquivos)
import { token, igual, COOKIE, lerCookie } from "./lib-login.js";
export const config = { matcher: "/((?!entrar|api/entrar|icone.svg|manifest.webmanifest).*)" };
export default async function middleware(req) {
  const { LOGIN_USUARIO: u, LOGIN_SEGREDO: s } = process.env;
  const c = lerCookie(req, COOKIE);
  if (u && s && c && igual(c, await token(u, s))) return new Response(null, { headers: { "x-middleware-next": "1" } });
  const url = new URL(req.url);
  const volta = url.pathname + url.search;
  return Response.redirect(new URL(`/entrar${volta && volta !== "/" ? `?volta=${encodeURIComponent(volta)}` : ""}`, req.url), 307);
}
