import { build } from "/tmp/claude-0/b/node_modules/esbuild/lib/main.js";
import fs from "fs";
const r = await build({ entryPoints: ["src/app.js"], bundle: true, format: "iife", minify: true, write: false, target: "es2020", legalComments: "none" });
const js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = fs.readFileSync("src/estilo.css", "utf8");
const head = `<title>Missão Aprovação</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="App de estudos para o Concurso de Curitiba, NPOR e ENEM">
<meta name="theme-color" content="#2546c6">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Archivo:wdth,wght@100..125,600..800&family=Kalam:wght@400;700&family=IBM+Plex+Mono:wght@500;600&display=swap">
<style>${css}</style>`;
const body = `<div id="root"></div><script>${js}</script>`;
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/missao-aprovacao.html", head + "\n" + body);
// versão completa (abre direto do PC, como arquivo)
fs.writeFileSync("dist/index.html", `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><link rel="manifest" href="manifest.webmanifest">${head}</head><body>${body}<script>if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(()=>{});</script></body></html>`);
console.log("ok", (fs.statSync("dist/index.html").size/1024).toFixed(0)+" KB");
