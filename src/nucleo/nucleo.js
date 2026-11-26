// Núcleo do Missão Aprovação: dados, progresso, questões, revisão, plano, tutor e aula guiada.
// Sem DOM: a interface (React) se inscreve com subscribe() e recebe ui.* para navegar e avisar.
import { geradoresA } from "./lib/gerar/matematica-a.ts";
import { geradoresB } from "./lib/gerar/matematica-b.ts";
import { geradoresC, resumosMatC } from "./lib/gerar/matematica-c.ts";
import { criarRng } from "./lib/gerar/util.ts";
import { geradoresExtra, geradoresBase, resumosMat } from "./gen-extra.ts";
import { bancoGrande } from "./banco/index.ts";
import { resumosPort } from "./banco/portugues-niveis.ts";
import { VIDEOS, TRECHOS } from "./videos.js";
import { concurso } from "./dados-concurso.js";
import { npor } from "./dados-npor.js";
import { enem } from "./dados-enem.js";
import { resumosFaltantes } from "./resumos-faltantes.js";
import { fala, ehServidor, vozAtual, lerTexto, pararLeitura } from "./vozes.js";

/* ───────────────────────── ponte com a interface */
export const ui = { ir: () => {}, toast: () => {}, limparRascunho: () => {}, rolarExplicacao: () => {}, topo: () => {} };
let versao = 0; const ouvintes = new Set();
export const subscribe = (fn) => { ouvintes.add(fn); return () => ouvintes.delete(fn); };
export const getVersao = () => versao;
export function render() { versao++; ouvintes.forEach((f) => f()); }
const toast = (m) => ui.toast(m);
const ir = (r) => { ui.ir(r); render(); };
export const voz = { vel: 1 };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const LETRAS = ["A", "B", "C", "D", "E"];
const NIVEL = { basico: 1, intermediario: 2, avancado: 3 };
const NIVEL_TXT = { 1: "Básico", 2: "Intermediário", 3: "Nível prova" };
const DAY = 86400000;
const hoje = () => isoDia(new Date());
function isoDia(d) { const z = new Date(d); return `${z.getFullYear()}-${String(z.getMonth() + 1).padStart(2, "0")}-${String(z.getDate()).padStart(2, "0")}`; }
function addDias(iso, n) { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return isoDia(d); }
function diasAte(iso) { const a = new Date(hoje() + "T12:00:00"), b = new Date(iso + "T12:00:00"); return Math.round((b - a) / DAY); }
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function shuffleSeed(arr, seed) { const r = criarRng(seed); return r.shuffle(arr); }
const pct = (a, t) => (t ? Math.round((a / t) * 100) : 0);
const fmtData = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
const DIAS_SEM = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];


/* ───────────────────────── dados */
const OBJS = { concurso, npor, enem };
const ORDEM = ["concurso", "npor", "enem"];
for (const o of ORDEM) OBJS[o].resumos = { ...resumosFaltantes[o], ...OBJS[o].resumos };
Object.assign(resumosMat, resumosMatC, resumosPort);
const TODOS_GEN = [...geradoresBase, ...geradoresA, ...geradoresB, ...geradoresC, ...geradoresExtra];
// banco grande: ids prefixados por aba ("b-concurso-..."), para cada objetivo ter o seu
const BANCO_GEN = Object.fromEntries(ORDEM.map((o) => [o, bancoGrande[o].map((g) => ({ ...g, id: `b-${o}-${g.id}` }))]));
const GEN = Object.fromEntries([...TODOS_GEN, ...ORDEM.flatMap((o) => BANCO_GEN[o])].map((g) => [g.id, g]));
const NPOR_TEMAS_AB = new Set(["Porcentagem", "Probabilidade", "Estatística", "Regra de três", "Juros simples", "Áreas e superfícies", "Circunferência", "Razão e proporção", "Resolução de problemas"]);
const genDoObj = {
  concurso: [...geradoresBase, ...geradoresA, ...geradoresB, ...geradoresC],
  npor: [...geradoresBase, ...geradoresExtra, ...geradoresC, ...[...geradoresA, ...geradoresB].filter((g) => NPOR_TEMAS_AB.has(g.tema))],
  enem: [...geradoresBase, ...geradoresExtra, ...geradoresA, ...geradoresB, ...geradoresC].filter((g) => g.tema !== "Noções de direção" && g.tema !== "Sistema monetário"),
};
const genMat = { ...genDoObj }; // só Matemática/RL: define os temas das matérias "gerado"
for (const o of ORDEM) genDoObj[o] = [...genDoObj[o], ...BANCO_GEN[o]];
// monta índices: banco escrito, temas por matéria
const BANCO = {}; const TEMA_MAT = {}; const TEMAS_MAT = {}; const CARDS = {};
for (const o of ORDEM) {
  const d = OBJS[o];
  BANCO[o] = d.questoes.map((q, i) => {
    const id = `w:${o}:${i}`;
    const ordem = shuffleSeed([0, 1, 2, 3, 4], hash(id));
    return { id, tema: q[0], nivel: q[1], enunciado: q[2], alternativas: ordem.map((k) => q[3][k]), correta: ordem.indexOf(q[4]), explicacao: q[5], alta: !!q[6], erros: null, passos: null };
  });
  TEMA_MAT[o] = {}; TEMAS_MAT[o] = {};
  for (const m of d.materias) {
    let temas = m.temas || [];
    if (m.gerado) temas = [...new Set(genMat[o].map((g) => g.tema))];
    else temas = [...new Set([...temas, ...BANCO_GEN[o].filter((g) => g.materia === m.nome).map((g) => g.tema)])];
    TEMAS_MAT[o][m.id] = temas;
    temas.forEach((t) => (TEMA_MAT[o][t] = m.id));
  }
  CARDS[o] = d.cards.map((c, i) => ({ id: `c:${o}:${i}`, frente: c[0], verso: c[1], tema: c[2] }));
}
function resumoDe(o, tema) { return OBJS[o].resumos[tema] || resumosMat[tema] || null; }
function matNome(o, mid) { return OBJS[o].materias.find((m) => m.id === mid)?.nome || ""; }

function getQ(id) {
  if (id.startsWith("w:")) { const [, o, i] = id.split(":"); return BANCO[o][+i]; }
  const [, gid, seedS] = id.split(":");
  const g = GEN[gid]; let seed = +seedS;
  for (let k = 0; k < 6; k++) {
    try {
      const c = g.gerar(criarRng(seed + k * 104729));
      if (new Set(c.alternativas).size === 5) return { id, tema: g.tema, nivel: NIVEL[g.nivel], alta: g.altaChance, ...c };
    } catch (e) { /* tenta outra semente */ }
  }
  return null;
}

/* ───────────────────────── estado */
const KEY = "missao-aprovacao-v1";
const novoObj = () => ({ resp: {}, rev: {}, cards: {}, marcas: {}, notas: {}, porque: {}, sims: [], vistos: {} });
const PADRAO = () => ({
  v: 1, obj: "concurso", xp: 0, dias: {}, medalhas: {}, taf: [],
  cfg: { tom: "equilibrado", fonte: 17, tema: "auto", meta: 30, metaCards: 15, manterRascunho: false, voz: true,
    datas: { concurso: concurso.dataPadrao, npor: npor.dataPadrao, enem: enem.dataPadrao },
    horas: [60, 120, 120, 120, 120, 120, 180], pomo: { foco: 25, pausa: 5, longa: 15 } },
  p: { concurso: novoObj(), npor: novoObj(), enem: novoObj() }, pomo: null, chat: [],
});
let S = carregar();
function carregar() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = JSON.parse(raw); const base = PADRAO(); return { ...base, ...s, cfg: { ...base.cfg, ...s.cfg, datas: { ...base.cfg.datas, ...(s.cfg?.datas || {}) }, pomo: { ...base.cfg.pomo, ...(s.cfg?.pomo || {}) } }, p: { ...base.p, ...s.p } }; }
  } catch (e) { /* sem armazenamento */ }
  return PADRAO();
}
function salvar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignora */ } }
const P = () => S.p[S.obj];
const D = () => OBJS[S.obj];
function dia(iso = hoje()) { return (S.dias[iso] ||= { q: 0, a: 0, cards: 0, pomo: 0, min: 0, obj: {} }); }
function ganharXP(n) { S.xp += n; }
const nivelXP = (xp) => Math.floor(Math.sqrt(xp / 60)) + 1;
const xpDoNivel = (n) => 60 * (n - 1) ** 2;
function ofensiva() {
  let n = 0, d = hoje();
  if (!ativo(d)) d = addDias(d, -1);
  while (ativo(d)) { n++; d = addDias(d, -1); }
  return n;
}
function ativo(iso) { const x = S.dias[iso]; return !!x && (x.q > 0 || x.cards > 0 || x.pomo > 0 || x.modos > 0); }
/* Modos de estudo rápidos (certo ou errado, colunas, lacunas, despejo): XP, dia ativo e erros voltando na revisão */
function registrarModo(acertos, total, idsErrados = []) {
  const d = dia(); d.modos = (d.modos || 0) + total;
  ganharXP(acertos * 4 + total);
  const p = P(); for (const id of idsErrados) if (id && !p.rev[id]) p.rev[id] = { due: addDias(hoje(), 1), step: 0 };
  checarMedalhas(); salvar(); render();
}

/* ───────────────────────── estatísticas */
function statTema(o, tema) {
  let a = 0, t = 0;
  for (const [id, r] of Object.entries(S.p[o].resp)) { if (r.tema === tema) { a += r.a; t += r.a + r.e; } }
  return { a, t, p: t ? a / t : null };
}
function statMat(o, mid) {
  let a = 0, t = 0;
  for (const r of Object.values(S.p[o].resp)) if (TEMA_MAT[o][r.tema] === mid) { a += r.a; t += r.a + r.e; }
  return { a, t, p: t ? a / t : null };
}
function statObj(o) {
  let a = 0, t = 0, ms = 0, n = 0;
  for (const r of Object.values(S.p[o].resp)) { a += r.a; t += r.a + r.e; if (r.ms) { ms += r.ms; n++; } }
  return { a, t, p: t ? a / t : null, tm: n ? ms / n : null };
}
function temasFracos(o, k = 5) {
  const arr = [];
  for (const m of OBJS[o].materias) for (const tema of TEMAS_MAT[o][m.id]) {
    const s = statTema(o, tema);
    const temQ = BANCO[o].some((q) => q.tema === tema) || genDoObj[o].some((g) => g.tema === tema);
    if (!temQ) continue;
    const score = s.t ? s.p - Math.min(s.t, 20) / 200 : 0.5 + (hash(tema + hoje()) % 100) / 1000;
    arr.push({ tema, mid: m.id, s, score: score - m.peso / 1000 });
  }
  return arr.sort((x, y) => x.score - y.score).slice(0, k);
}
function previsao(o) {
  let soma = 0, pesos = 0, cob = 0;
  for (const m of OBJS[o].materias) { const s = statMat(o, m.id); if (s.t >= 3) { soma += s.p * m.peso; pesos += m.peso; cob += m.peso; } }
  if (!pesos) return null;
  return { nota: Math.round((soma / pesos) * 100), cobertura: Math.round(cob) };
}
function progressoEdital(o) {
  let tot = 0, ok = 0;
  for (const m of OBJS[o].materias) for (const t of TEMAS_MAT[o][m.id]) { tot++; const s = statTema(o, t); if (s.t >= 5 || S.p[o].vistos[t]) ok++; }
  return { tot, ok, p: pct(ok, tot) };
}

/* ───────────────────────── montagem de listas de questões */
function questoesDoTema(o, tema, nivel, n = 10) {
  const escritas = BANCO[o].filter((q) => q.tema === tema && (!nivel || q.nivel === nivel)).map((q) => q.id);
  const gens = genDoObj[o].filter((g) => g.tema === tema && (!nivel || NIVEL[g.nivel] === nivel));
  const ids = shuffleSeed(escritas, Date.now() & 0xffff).slice(0, n);
  let k = 0;
  while (ids.length < n && gens.length && k < n * 3) { ids.push(`g:${gens[k % gens.length].id}:${(Math.random() * 1e9) | 0}`); k++; }
  if (!ids.length && nivel) return questoesDoTema(o, tema, 0, n);
  return shuffleSeed(ids, (Math.random() * 1e9) | 0);
}
function questoesFiltro(o, f) {
  let pool = [];
  const temasOk = (tema) => (!f.mat || TEMA_MAT[o][tema] === f.mat) && (!f.tema || f.tema === tema);
  if (f.erros) {
    pool = Object.entries(S.p[o].resp).filter(([id, r]) => r.ultimaErrada && temasOk(r.tema)).map(([id]) => id);
    pool = pool.concat(Object.entries(S.p[o].marcas).filter(([, m]) => m === "chutei" || m === "revisar").map(([id]) => id));
    return shuffleSeed([...new Set(pool)], Date.now() & 0xffff).slice(0, f.n || 15);
  }
  pool = BANCO[o].filter((q) => temasOk(q.tema) && (!f.nivel || q.nivel === f.nivel) && (!f.alta || q.alta)).map((q) => q.id);
  const gens = genDoObj[o].filter((g) => temasOk(g.tema) && (!f.nivel || NIVEL[g.nivel] === f.nivel) && (!f.alta || g.altaChance));
  const n = f.n || 15;
  let ids = shuffleSeed(pool, (Math.random() * 1e9) | 0);
  const quotaGen = gens.length ? Math.max(Math.round(n * (gens.length / (gens.length + pool.length / 2))), n - ids.length) : 0;
  ids = ids.slice(0, n - Math.min(quotaGen, n));
  for (let i = 0; ids.length < n && gens.length && i < n * 2; i++) ids.push(`g:${gens[(Math.random() * gens.length) | 0].id}:${(Math.random() * 1e9) | 0}`);
  return shuffleSeed(ids, (Math.random() * 1e9) | 0);
}
function revisoesVencidas(o) { return Object.entries(S.p[o].rev).filter(([, r]) => r.due <= hoje()).map(([id]) => id); }
function cardsVencidos(o) {
  const c = S.p[o].cards, h = hoje();
  const due = CARDS[o].filter((k) => c[k.id] && c[k.id].due <= h);
  const novosHoje = CARDS[o].filter((k) => c[k.id]?.criado === h).length;
  const novos = CARDS[o].filter((k) => !c[k.id]).slice(0, Math.max(0, S.cfg.metaCards - novosHoje));
  return [...due, ...novos];
}
function simulado(o) {
  if (o === "concurso") {
    const parte = (mid, n) => questoesFiltro(o, { mat: mid, n });
    return [...parte("esp", 20), ...parte("port", 5), ...parte("rl", 5), ...parte("info", 5), ...parte("leg", 5)];
  }
  const out = [];
  for (const m of OBJS[o].materias) { if (m.id === "red") continue; out.push(...questoesFiltro(o, { mat: m.id, n: Math.max(3, Math.round(m.peso / 5)) })); }
  return out.slice(0, 20);
}

/* ───────────────────────── sessão de questões */
let sess = null; // { ids, i, modo, titulo, resp: {i: {esc, ok, ms}}, t0, fim, qt0 }
const qCache = new Map();
function Q(id) { if (!qCache.has(id)) qCache.set(id, getQ(id)); return qCache.get(id); }
function iniciar(ids, titulo, modo = "treino", extra = {}) {
  ids = ids.filter((id) => Q(id));
  if (!ids.length) { toast("Ainda não há questões para esse filtro."); return; }
  sess = { ids, i: 0, modo, titulo, resp: {}, t0: Date.now(), qt0: Date.now(), ...extra };
  if (modo === "simulado") sess.fim = Date.now() + (extra.minutos || 180) * 60000;
  if (!S.cfg.manterRascunho) ui.limparRascunho();
  ir("questao");
}
function responder(idx) {
  const id = sess.ids[sess.i], q = Q(id);
  if (sess.resp[sess.i] && sess.modo !== "simulado") return;
  const ms = Date.now() - sess.qt0;
  const ok = idx === q.correta;
  sess.resp[sess.i] = { esc: idx, ok, ms };
  if (sess.modo === "simulado") { render(); return; }
  if (!ok) (P().errEsc ||= {})[id] = idx;
  registrar(S.obj, id, q, ok, ms);
  render();
  if (!ok) ui.rolarExplicacao();
}
function registrar(o, id, q, ok, ms) {
  const p = S.p[o];
  const r = (p.resp[id] ||= { tema: q.tema, a: 0, e: 0, ms: 0 });
  r.tema = q.tema; ok ? r.a++ : r.e++; r.ultimaErrada = !ok; r.ms = r.ms ? Math.round((r.ms + Math.min(ms, 600000)) / 2) : Math.min(ms, 600000); r.last = Date.now();
  const d = dia(); d.q++; if (ok) d.a++; d.obj[o] = (d.obj[o] || 0) + 1;
  // revisão espaçada: 1, 3, 7, 15 dias
  const INT = [1, 3, 7, 15];
  if (!ok) p.rev[id] = { due: addDias(hoje(), 1), step: 0 };
  else if (p.rev[id]) { const st = p.rev[id].step + 1; if (st >= INT.length) delete p.rev[id]; else p.rev[id] = { due: addDias(hoje(), INT[st]), step: st }; }
  ganharXP(ok ? 10 : 3);
  checarMedalhas(); salvar();
}
function marcar(tipo) {
  const id = sess.ids[sess.i], p = P();
  p.marcas[id] = p.marcas[id] === tipo ? undefined : tipo;
  if (p.marcas[id] === "chutei" && !p.rev[id]) p.rev[id] = { due: addDias(hoje(), 1), step: 0 };
  salvar(); render();
}
function proxima() {
  if (!sess || sess.terminou) return;
  if (sess.i < sess.ids.length - 1) { sess.i++; sess.qt0 = Date.now(); if (!S.cfg.manterRascunho) ui.limparRascunho(); render(); ui.topo(); }
  else finalizar();
}
function finalizar() {
  if (!sess || sess.terminou) return;
  const o = S.obj;
  if (sess.modo === "simulado") {
    const porMat = {};
    sess.ids.forEach((id, i) => {
      const q = Q(id), r = sess.resp[i], mid = TEMA_MAT[o][q.tema];
      const pm = (porMat[mid] ||= { a: 0, t: 0 }); pm.t++;
      if (r) { pm.a += r.ok ? 1 : 0; registrar(o, id, q, r.ok, r.ms); }
      else registrar(o, id, q, false, 0);
    });
    const a = Object.values(porMat).reduce((s, x) => s + x.a, 0);
    S.p[o].sims.push({ data: hoje(), a, t: sess.ids.length, porMat, min: Math.round((Date.now() - sess.t0) / 60000) });
    ganharXP(50); checarMedalhas(); salvar();
  }
  sess.terminou = true; ir("resultado");
}

/* ───────────────────────── flashcards */
let fc = null;
function iniciarCards() { fc = { lista: cardsVencidos(S.obj).map((c) => c.id), i: 0, virado: false, feitos: 0 }; ir("cards"); }
function avaliarCard(nota) {
  const id = fc.lista[fc.i], c = P().cards;
  const k = (c[id] ||= { int: 0, ease: 2.5, n: 0, criado: hoje() });
  if (nota === 0) { k.int = 0; k.ease = Math.max(1.3, k.ease - 0.2); fc.lista.push(id); }
  else {
    k.n++;
    if (nota === 1) { k.int = Math.max(1, Math.round((k.int || 1) * 1.2)); k.ease = Math.max(1.3, k.ease - 0.15); }
    if (nota === 2) k.int = k.int ? Math.round(k.int * k.ease) : 1;
    if (nota === 3) { k.int = k.int ? Math.round(k.int * k.ease * 1.3) : 3; k.ease += 0.1; }
  }
  k.due = addDias(hoje(), k.int);
  dia().cards++; ganharXP(2); fc.feitos++;
  fc.i++; fc.virado = false; checarMedalhas(); salvar(); render();
}

/* ───────────────────────── planner (mapa da semana) */
function pesoObjetivo(iso) {
  const dc = S.cfg.datas.concurso, dn = S.cfg.datas.npor;
  if (iso <= dc) return { concurso: 0.75, npor: 0.25, enem: 0 };
  if (iso <= dn) return { concurso: 0, npor: 0.8, enem: 0.2 };
  return { concurso: 0, npor: 0, enem: 1 };
}
const temAula = (o, tema) => !!(resumoDe(o, tema) || Object.values(OBJS).some((x) => x.resumos[tema]));
function planoDoDia(iso) {
  const dow = new Date(iso + "T12:00:00").getDay();
  const min = +S.cfg.horas[dow] || 0;
  const blocos = [];
  if (!min) return blocos;
  const pesos = pesoObjetivo(iso);
  let slots = Math.max(1, Math.round(min / 30));
  const objs = ORDEM.filter((o) => pesos[o] > 0);
  const porObj = {}; let rest = slots;
  objs.forEach((o, i) => { porObj[o] = i === objs.length - 1 ? rest : Math.max(1, Math.round(slots * pesos[o])); rest -= porObj[o]; if (rest < 0) rest = 0; });
  for (const o of objs) {
    const n = Math.max(0, porObj[o]);
    if (!n) continue;
    const fracos = temasFracos(o, 12);
    const base = hash(iso + o) % Math.max(1, fracos.length - n + 1);
    for (let k = 0; k < n; k++) {
      const f = fracos[(base + k) % fracos.length];
      if (!f) break;
      if (dow === 6 && k === 0 && o === objs[0]) { blocos.push({ o, tipo: "simulado", tema: "Simulado", min: 30 }); continue; }
      blocos.push({ o, tipo: k % 3 === 2 ? "revisao" : temAula(o, f.tema) ? "tema" : "questoes", tema: f.tema, min: 30 });
    }
  }
  if (S.obj === "npor" || pesos.npor > 0) blocos.push({ o: "npor", tipo: "taf", tema: "Treino físico (TAF)", min: 45, extra: true });
  return blocos;
}

/* ───────────────────────── tutor (offline) */
const TONS = {
  calmo: { nome: "Calmo", ok: ["Isso! Você está pegando o jeito.", "Muito bem. Um passo de cada vez.", "Acertou. Pode confiar no seu raciocínio."], erro: ["Tudo bem errar aqui: é o lugar certo para isso. Vamos ver juntos onde o raciocínio desviou.", "Errar no treino é o que evita errar na prova. Olha só o detalhe que pegou você.", "Calma, essa pegadinha derruba muita gente. Veja a explicação com atenção."] },
  equilibrado: { nome: "Equilibrado", ok: ["Certo. Próxima.", "Acertou. Guarde o macete.", "Boa. Esse tema está entrando."], erro: ["Errou. Leia o passo a passo e anote o porquê no caderno de erros.", "Não foi dessa vez. O erro está explicado logo abaixo: entenda e siga.", "Errada. Essa volta para você amanhã na revisão."] },
  linhadura: { nome: "Linha-dura", ok: ["Fez o mínimo. A prova não perdoa, mantenha o ritmo.", "Certo. Agora acerte a próxima mais rápido.", "Acertou. Não comemora, próxima."], erro: ["Errou. A vaga é de quem não erra essa. Leia a explicação e refaça mentalmente.", "Erro de atenção custa aprovação. Anote o motivo e não repita.", "Essa estava no resumo. Volte nele agora, sem desculpa."] },
};
function frase(tipo) { const t = TONS[S.cfg.tom] || TONS.equilibrado; const arr = t[tipo]; return arr[(Date.now() / 1000 | 0) % arr.length]; }
function respostaTutor(texto) {
  const o = S.obj, t = texto.toLowerCase();
  const tom = S.cfg.tom;
  const intro = tom === "linhadura" ? "Direto ao ponto." : tom === "calmo" ? "Vamos com calma." : "";
  if (/o que (eu )?estud|por onde|hoje|plano/.test(t)) {
    const b = planoDoDia(hoje()).filter((x) => !x.extra);
    const f = temasFracos(o, 3);
    return { txt: `${intro} Hoje o plano tem ${b.length} blocos. Comece pelo seu ponto mais fraco agora: ${f.map((x) => `“${x.tema}”`).join(", ")}.`, temas: f.map((x) => x.tema) };
  }
  if (/err|fraco|ruim|dificuldade/.test(t)) {
    const f = temasFracos(o, 4).filter((x) => x.s.t);
    if (!f.length) return { txt: "Ainda não tenho dados suficientes. Resolva pelo menos 20 questões que eu mostro onde você mais erra." };
    return { txt: `${intro} Seus temas mais fracos agora: ${f.map((x) => `${x.tema} (${Math.round(x.s.p * 100)}%)`).join("; ")}. Abaixo de 60% é alerta vermelho.`, temas: f.map((x) => x.tema) };
  }
  if (/simulado|prova completa/.test(t)) return { txt: "Faça o simulado quando já tiver passado pelos temas com maior peso. Ele fica em Mais › Simulado.", link: "simulado" };
  if (/motiva|cansad|desanim|não consigo|nao consigo/.test(t)) {
    const m = { calmo: "Cansaço é sinal de que você está trabalhando. Faça um pomodoro curto de 15 minutos, só um, e veja como se sente depois.", equilibrado: "Divida em pedaços: um pomodoro de 25 minutos e 10 questões. Só isso por agora.", linhadura: "Motivação vem depois da ação. Liga o pomodoro e faz 10 questões. Agora." };
    return { txt: m[tom] || m.equilibrado, link: "foco" };
  }
  // busca nos resumos e flashcards
  const palavras = t.normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9º]+/).filter((w) => w.length > 2 && !["que", "qual", "como", "para", "uma", "com", "dos", "das", "sobre", "explica", "explique", "isso", "voce"].includes(w));
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  let melhor = [];
  const fontes = [];
  for (const oo of ORDEM) {
    for (const [tema, r] of Object.entries({ ...OBJS[oo].resumos })) r.t.forEach((linha) => fontes.push({ tema, txt: linha, o: oo }));
    CARDS[oo].forEach((c) => fontes.push({ tema: c.tema, txt: `${c.frente}: ${c.verso}`, o: oo }));
  }
  for (const [tema, r] of Object.entries(resumosMat)) r.t.forEach((linha) => fontes.push({ tema, txt: linha, o }));
  for (const f of fontes) {
    const n = norm(f.txt + " " + f.tema);
    let sc = 0; for (const w of palavras) if (n.includes(w)) sc += w.length > 5 ? 2 : 1;
    if (f.o === o) sc += 0.5;
    if (sc > 0) melhor.push({ ...f, sc });
  }
  melhor.sort((a, b) => b.sc - a.sc);
  if (!melhor.length || melhor[0].sc < 1.5) return { txt: "Não achei isso no material do app. Tente com outras palavras (ex.: “prazo da LAI”, “crase”, “regra de três inversa”) ou pergunte “o que estudo hoje?”." };
  const top = melhor.slice(0, 3);
  return { txt: `${intro} ${top.map((x) => x.txt).join(" ")}`.trim(), temas: [...new Set(top.map((x) => x.tema))].slice(0, 2) };
}

/* ───────────────────────── medalhas */
const MEDALHAS = [
  { id: "q10", nome: "Primeiras 10 questões", teste: () => totalQ() >= 10 },
  { id: "q100", nome: "100 questões", teste: () => totalQ() >= 100 },
  { id: "q500", nome: "500 questões", teste: () => totalQ() >= 500 },
  { id: "q1000", nome: "1.000 questões", teste: () => totalQ() >= 1000 },
  { id: "of3", nome: "3 dias seguidos", teste: () => ofensiva() >= 3 },
  { id: "of7", nome: "7 dias seguidos", teste: () => ofensiva() >= 7 },
  { id: "of21", nome: "21 dias seguidos", teste: () => ofensiva() >= 21 },
  { id: "sim1", nome: "Primeiro simulado", teste: () => ORDEM.some((o) => S.p[o].sims.length) },
  { id: "c50", nome: "50 flashcards revisados", teste: () => Object.values(S.dias).reduce((s, d) => s + d.cards, 0) >= 50 },
  { id: "p10", nome: "10 pomodoros", teste: () => Object.values(S.dias).reduce((s, d) => s + d.pomo, 0) >= 10 },
  { id: "dia30", nome: "30 questões em um dia", teste: () => dia().q >= 30 },
];
function totalQ() { return Object.values(S.dias).reduce((s, d) => s + d.q, 0); }
function checarMedalhas() { for (const m of MEDALHAS) if (!S.medalhas[m.id] && m.teste()) { S.medalhas[m.id] = hoje(); setTimeout(() => toast(`Medalha: ${m.nome}`), 300); } }

/* ───────────────────────── pomodoro */
let tick = null;
function iniciarPomo(tipo, tarefa) {
  const m = S.cfg.pomo[tipo];
  S.pomo = { tipo, fim: Date.now() + m * 60000, total: m * 60000, tarefa: tarefa || S.pomo?.tarefa || "", ciclos: S.pomo?.ciclos || 0, pausado: null };
  salvar(); ligarTick(); render();
}
function ligarTick() { clearInterval(tick); tick = setInterval(() => { atualizarTimer(); }, 1000); }
function restante() { if (!S.pomo) return 0; return S.pomo.pausado != null ? S.pomo.pausado : Math.max(0, S.pomo.fim - Date.now()); }
function atualizarTimer() {
  if (!S.pomo) { clearInterval(tick); return; }
  if (restante() <= 0 && S.pomo.pausado == null) terminarPomo();
  if (sess && sess.modo === "simulado" && !sess.terminou && Date.now() >= sess.fim) { toast("Tempo esgotado. Simulado entregue."); finalizar(); }
}
function terminarPomo() {
  const tipo = S.pomo.tipo;
  bip();
  if (tipo === "foco") {
    const d = dia(); d.pomo++; d.min += S.cfg.pomo.foco; ganharXP(15);
    S.pomo.ciclos++;
    const longa = S.pomo.ciclos % 4 === 0;
    toast(longa ? "Ciclo completo! Pausa longa." : "Foco concluído. Hora da pausa.");
    const ciclos = S.pomo.ciclos, tarefa = S.pomo.tarefa;
    S.pomo = { tipo: longa ? "longa" : "pausa", fim: Date.now() + S.cfg.pomo[longa ? "longa" : "pausa"] * 60000, total: S.cfg.pomo[longa ? "longa" : "pausa"] * 60000, tarefa, ciclos, pausado: null };
  } else { toast("Pausa acabou. Bora para o próximo foco."); S.pomo = { ...S.pomo, tipo: "pronto", fim: Date.now(), total: 1, pausado: 0 }; }
  checarMedalhas(); salvar(); render();
}
const mmss = (ms) => { const s = Math.ceil(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
function bip() {
  try { const ac = new (window.AudioContext || window.webkitAudioContext)(); [0, 0.25, 0.5].forEach((t) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ac.destination); g.gain.setValueAtTime(0.18, ac.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t + 0.2); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.22); }); } catch (e) { /* sem áudio */ }
  try { navigator.vibrate?.([200, 100, 200]); } catch (e) { /* */ }
}

/* ───────────────────────── voz */
function falar(txt) {
  try {
    if (ehServidor(vozAtual())) { pararLeitura(); lerTexto(txt, voz.vel || 1); return; }
    const ss = window.speechSynthesis; if (!ss) { toast("Leitura em voz alta não está disponível neste navegador."); return; }
    if (ss.speaking) { ss.cancel(); return; }
    const u = fala(txt, voz.vel || 1);
    ss.speak(u); return u;
  } catch (e) { toast("Leitura em voz alta não está disponível."); }
}


/* ───────────────────────── aula guiada (Aprender) */
let ap = null;
const ETAPA_IC = ["play", "ideia", "aula", "pen", "montanha", "trofeu"];
const ETAPAS = [["Assistir", "vídeo no minuto certo"], ["Entender", "a ideia em cartões"], ["Ver resolvido", "passo a passo"], ["Sua vez", "básico, com dica"], ["Subir o nível", "intermediário"], ["Nível prova", "como cai"]];
const segs = (h) => h.split(":").map(Number).reduce((a, b) => a * 60 + b, 0);
const ytLink = (v, ini) => `https://www.youtube.com/watch?v=${VIDEOS[v].id}&t=${segs(ini)}s`;
function durTxt(ini, fim) { if (!fim) return ""; const m = Math.round((segs(fim) - segs(ini)) / 60); return m >= 60 ? `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}` : `${m} min`; }
function proximaFase(o) {
  for (const m of OBJS[o].materias) for (const t of TEMAS_MAT[o][m.id]) {
    const s = statTema(o, t);
    const temQ = BANCO[o].some((q) => q.tema === t) || genDoObj[o].some((g) => g.tema === t);
    if (temQ && !(s.t >= 10 && s.p >= 0.8)) return t;
  }
  return null;
}
function abrirAprender(tema) {
  const o = S.obj;
  const r = resumoDe(o, tema) || Object.values(OBJS).map((x) => x.resumos[tema]).find(Boolean);
  if (!r) { const ids = questoesDoTema(o, tema, 0, 10); if (ids.length) { toast("Esse tema ainda não tem aula. Abri as questões."); iniciar(ids, tema); } else toast("Esse tema ainda não tem aula nem questões."); return; }
  P().vistos[tema] = true; salvar();
  try { speechSynthesis.cancel(); } catch (er) { /* */ }
  ap = { tema, r, etapa: 0, card: 0, travou: false, ex: null, fila: [], qi: 0, q: null, acertos: 0, total: 0, usados: new Set(), extra: 0, log: [] };
  ir("aprender");
}
function pegarQ(nv, n) {
  const o = S.obj, out = [];
  for (const id of questoesDoTema(o, ap.tema, nv, n * 4)) { if (out.length >= n) break; if (!ap.usados.has(id) && !out.includes(id) && Q(id)) out.push(id); }
  return out;
}
function novoExemplo() {
  const o = S.obj, gens = genDoObj[o].filter((g) => g.tema === ap.tema);
  if (gens.length) {
    const base = gens.filter((g) => g.nivel === "basico"); const pool = base.length ? base : gens;
    const g = pool[(Math.random() * pool.length) | 0];
    const id = `g:${g.id}:${(Math.random() * 1e9) | 0}`;
    if (Q(id)) { ap.ex = { id, mostrados: 0 }; return true; }
  }
  const w = BANCO[o].filter((q) => q.tema === ap.tema && !ap.usados.has(q.id)).sort((a, b) => a.nivel - b.nivel)[0];
  if (w) { ap.usados.add(w.id); ap.ex = { id: w.id, mostrados: 0 }; return true; }
  ap.ex = null; return false;
}
function entrarEtapa(n) {
  ap.etapa = n;
  if (n === 1) { ap.card = 0; ap.travou = false; }
  if (n === 2 && !novoExemplo()) return entrarEtapa(3);
  if (n >= 3 && n <= 5) {
    ap.fila = pegarQ(n - 2, 2); ap.qi = 0; ap.extra = 0;
    if (!ap.fila.length) return entrarEtapa(n + 1);
    ap.q = { resp: null, dica: false, t0: Date.now() };
  }
  if (n === 6) {
    const a = (P().aprendeu ||= {});
    a[ap.tema] = { data: hoje(), a: ap.acertos, t: ap.total };
    ganharXP(25); checarMedalhas(); salvar();
  }
  render(); ui.topo();
}
function parecida(id) {
  if (id.startsWith("g:")) { const gid = id.split(":")[1]; const nid = `g:${gid}:${(Math.random() * 1e9) | 0}`; return Q(nid) ? nid : null; }
  return pegarQ(ap.etapa - 2, 1)[0] || null;
}
function acaoAprender(act, ds = {}) {
  switch (act) {
    case "aprender": abrirAprender(ds.tema); return true;
    case "ap-sair": ap = null; try { speechSynthesis.cancel(); } catch (er) { /* */ } ir("trilha"); return true;
  }
  if (!ap) return false;
  switch (act) {
    case "ap-ir": entrarEtapa(+ds.etapa); return true;
    case "ap-prox": entrarEtapa(ap.etapa + 1); return true;
    case "ap-assisti": { const a = (P().assistidos ||= {}); a[ds.key] = !a[ds.key]; if (a[ds.key]) ganharXP(5); salvar(); render(); return true; }
    case "ap-card-ok": ap.card++; ap.travou = false; render(); return true;
    case "ap-card-nao": ap.travou = true; render(); return true;
    case "ap-card-voltar": ap.card = Math.max(0, ap.card - 1); ap.travou = false; render(); return true;
    case "ap-falar": { const cards = [...ap.r.t, `O que mais cai: ${ap.r.cai}`]; falar(cards[ap.card]); return true; }
    case "ap-passo": ap.ex.mostrados++; render(); return true;
    case "ap-novo-ex": novoExemplo(); render(); return true;
    case "ap-dica": ap.q.dica = true; render(); return true;
    case "ap-alt": {
      if (ap.etapa < 3 || ap.etapa > 5 || !ap.q || ap.q.resp) return true;
      const id = ap.fila[ap.qi], q = Q(id), k = +ds.k, ok = k === q.correta;
      ap.q.resp = { esc: k, ok }; ap.total++; if (!ok) (P().errEsc ||= {})[id] = k; if (ok) ap.acertos++; ap.usados.add(id);
      registrar(S.obj, id, q, ok, Date.now() - ap.q.t0); render(); return true;
    }
    case "ap-q-prox": {
      if (ap.etapa < 3 || ap.etapa > 5 || !ap.q?.resp) return true;
      const id = ap.fila[ap.qi];
      if (!ap.q.resp.ok && ap.etapa < 5 && ap.extra < 2) { const n = parecida(id); if (n) { ap.fila.splice(ap.qi + 1, 0, n); ap.extra++; } }
      ap.qi++;
      if (ap.qi >= ap.fila.length) entrarEtapa(ap.etapa + 1);
      else { ap.q = { resp: null, dica: false, t0: Date.now() }; ui.limparRascunho(); render(); ui.topo(); }
      return true;
    }
  }
  return false;
}



/* ───────────────────────── folha de respostas (modo prova) */
function irPara(i) { if (!sess) return; sess.i = Math.max(0, Math.min(sess.ids.length - 1, i)); sess.qt0 = Date.now(); if (!S.cfg.manterRascunho) ui.limparRascunho(); render(); ui.topo(); }
function responderEm(i, k) { if (!sess || sess.modo !== "simulado") return; const q = Q(sess.ids[i]); sess.resp[i] = { esc: k, ok: k === q.correta, ms: 0 }; render(); }

/* ───────────────────────── modo 5 minutos: revisões vencidas + temas fracos, com relógio */
function iniciarCinco() {
  const o = S.obj, ids = [...revisoesVencidas(o)];
  for (const f of temasFracos(o, 6)) { if (ids.length >= 6) break; ids.push(...questoesDoTema(o, f.tema, 0, 1)); }
  iniciar([...new Set(ids)].slice(0, 6), "5 minutos", "treino", { fim: Date.now() + 5 * 60000 });
}

/* ───────────────────────── seus erros mais comuns por tema */
function errosDoTema(o, tema, k = 4) {
  const p = S.p[o];
  return Object.entries(p.resp).filter(([id, r]) => r.tema === tema && r.e > 0 && Q(id))
    .sort((a, b) => b[1].e - a[1].e || (b[1].last || 0) - (a[1].last || 0)).slice(0, k)
    .map(([id, r]) => ({ id, q: Q(id), e: r.e, a: r.a, esc: p.errEsc?.[id], porque: p.porque[id] }));
}

/* ───────────────────────── marca-texto */
function marcasTexto(tema) { return (P().marcaTexto ||= {})[tema] || []; }
function marcarTexto(tema, i, txt) { txt = txt.trim(); if (txt.length < 2) return; const m = ((P().marcaTexto ||= {})[tema] ||= []); if (!m.some((x) => x.i === i && x.txt === txt)) m.push({ i, txt }); salvar(); render(); }
function desmarcarTexto(tema, i, txt) { const m = (P().marcaTexto ||= {})[tema] || []; P().marcaTexto[tema] = m.filter((x) => !(x.i === i && x.txt === txt)); salvar(); render(); }

/* ───────────────────────── desafios semanais e ranking pessoal */
function inicioSemana(iso = hoje(), voltar = 0) { const d = new Date(iso + "T12:00:00"); const w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w - 7 * voltar); return isoDia(d); }
function statsSemana(o, voltar = 0) {
  const ini = inicioSemana(hoje(), voltar), fim = addDias(ini, 6);
  let q = 0, a = 0, cards = 0, dias = 0;
  for (let k = 0; k < 7; k++) { const x = S.dias[addDias(ini, k)]; if (!x) continue; q += x.obj?.[o] || 0; a += x.a || 0; cards += x.cards || 0; if (x.q || x.cards || x.pomo) dias++; }
  const aulas = Object.values(S.p[o].aprendeu || {}).filter((x) => x.data >= ini && x.data <= fim).length;
  const sims = S.p[o].sims.filter((x) => x.data >= ini && x.data <= fim).length;
  return { ini, fim, q, a: Math.min(a, q), cards, dias, aulas, sims };
}
function desafiosDaSemana(o) {
  const st = statsSemana(o), meta = Math.max(70, Math.round(S.cfg.meta * 5 / 10) * 10);
  const lista = [
    { id: "q", nome: `Resolver ${meta} questões`, v: st.q, meta },
    { id: "dias", nome: "Estudar em 5 dias da semana", v: st.dias, meta: 5 },
    { id: "aulas", nome: "Concluir 3 aulas no Aprender", v: st.aulas, meta: 3 },
    { id: "cards", nome: "Revisar 60 flashcards", v: st.cards, meta: 60 },
    { id: "sim", nome: "Fazer 1 simulado", v: st.sims, meta: 1 },
  ];
  const ganhos = ((S.desafios ||= {})[`${o}:${st.ini}`] ||= {});
  let novo = false;
  for (const d of lista) { d.feito = d.v >= d.meta; if (d.feito && !ganhos[d.id]) { ganhos[d.id] = hoje(); ganharXP(60); novo = d.nome; } }
  if (novo) { salvar(); setTimeout(() => toast(`Desafio da semana cumprido: ${novo} (+60 XP)`), 300); }
  return { st, lista };
}
function rankingSemanas(o, n = 8) {
  const arr = Array.from({ length: n }, (_, v) => ({ ...statsSemana(o, v), atual: v === 0 }));
  const ord = [...arr].sort((x, y) => y.q - x.q || y.dias - x.dias);
  return { semanas: arr, pos: ord.findIndex((x) => x.atual) + 1, recorde: ord[0] };
}

/* ───────────────────────── acesso para a interface */
export const getS = () => S;
export const setS = (n) => { S = n; salvar(); render(); };
export const getSess = () => sess;
export const getFc = () => fc;
export const getAp = () => ap;
export const fecharAp = () => { ap = null; render(); };
export const sairSessao = () => { if (sess && Object.keys(sess.resp).length) { sess.terminou = true; ir("resultado"); } else ir("treinar"); };
export const anterior = () => { if (sess?.i) { sess.i--; render(); } };
export function trocarObj(o) { S.obj = o; salvar(); render(); }
export function iniciarFoco() { if (S.pomo && S.pomo.tipo !== "pronto" && S.pomo.pausado == null && S.pomo.fim < Date.now()) S.pomo = null; else if (S.pomo) ligarTick(); }
export {
  OBJS, ORDEM, BANCO, TEMA_MAT, TEMAS_MAT, CARDS, GEN, genDoObj, NIVEL, NIVEL_TXT, LETRAS, DIAS_SEM, VIDEOS, TRECHOS, resumosMat,
  hoje, addDias, diasAte, pct, fmtData, isoDia, hash, PADRAO, salvar, P, D, dia, ganharXP, nivelXP, xpDoNivel, ofensiva,
  statTema, statMat, statObj, temasFracos, previsao, progressoEdital, resumoDe, matNome,
  questoesDoTema, questoesFiltro, revisoesVencidas, cardsVencidos, simulado, Q, iniciar, responder, registrar, marcar, proxima, finalizar,
  iniciarCards, avaliarCard, pesoObjetivo, planoDoDia, TONS, frase, respostaTutor, MEDALHAS, checarMedalhas, totalQ,
  iniciarPomo, restante, terminarPomo, mmss, ligarTick, falar,
  irPara, responderEm, iniciarCinco, errosDoTema, marcasTexto, marcarTexto, desmarcarTexto, inicioSemana, statsSemana, desafiosDaSemana, rankingSemanas,
  registrarModo,
  ETAPA_IC, ETAPAS, segs, ytLink, durTxt, proximaFase, abrirAprender, entrarEtapa, novoExemplo, acaoAprender,
};
