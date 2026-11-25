import { geradoresA } from "./lib/gerar/matematica-a.ts";
import { geradoresB } from "./lib/gerar/matematica-b.ts";
import { criarRng } from "./lib/gerar/util.ts";
import { geradoresExtra, geradoresBase, resumosMat } from "./gen-extra.ts";
import { VIDEOS, TRECHOS } from "./videos.js";
import { ICONES } from "./icones.js";
import { montarCena, desmontarCena, escadaSVG } from "./cena3d.js";
import { concurso } from "./dados-concurso.js";
import { npor } from "./dados-npor.js";
import { enem } from "./dados-enem.js";

/* ───────────────────────── utilidades */
const $ = (s, el = document) => el.querySelector(s);
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

const I = { ...ICONES };
const MAT_ICON = { esp: "adm", port: "livro", rl: "calc", info: "pc", leg: "lei", mat: "calc", hist: "escudo", geo: "globo", red: "redacao", ling: "lingua", hum: "globo", nat: "quimica" };
const iconeMat = (mid) => I[MAT_ICON[mid]] || I.livro;

/* ───────────────────────── dados */
const OBJS = { concurso, npor, enem };
const ORDEM = ["concurso", "npor", "enem"];
const TODOS_GEN = [...geradoresBase, ...geradoresA, ...geradoresB, ...geradoresExtra];
const GEN = Object.fromEntries(TODOS_GEN.map((g) => [g.id, g]));
const NPOR_TEMAS_AB = new Set(["Porcentagem", "Probabilidade", "Estatística", "Regra de três", "Juros simples", "Áreas e superfícies", "Circunferência", "Razão e proporção", "Resolução de problemas"]);
const genDoObj = {
  concurso: [...geradoresBase, ...geradoresA, ...geradoresB],
  npor: [...geradoresBase, ...geradoresExtra, ...[...geradoresA, ...geradoresB].filter((g) => NPOR_TEMAS_AB.has(g.tema))],
  enem: [...geradoresBase, ...geradoresExtra, ...geradoresA, ...geradoresB].filter((g) => g.tema !== "Noções de direção" && g.tema !== "Sistema monetário"),
};
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
    if (m.gerado) temas = [...new Set(genDoObj[o].map((g) => g.tema))];
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
function ativo(iso) { const x = S.dias[iso]; return !!x && (x.q > 0 || x.cards > 0 || x.pomo > 0); }

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
  if (!S.cfg.manterRascunho) limparRascunho();
  ir("questao");
}
function responder(idx) {
  const id = sess.ids[sess.i], q = Q(id);
  if (sess.resp[sess.i] && sess.modo !== "simulado") return;
  const ms = Date.now() - sess.qt0;
  const ok = idx === q.correta;
  sess.resp[sess.i] = { esc: idx, ok, ms };
  if (sess.modo === "simulado") { render(); return; }
  registrar(S.obj, id, q, ok, ms);
  render();
  if (!ok) setTimeout(() => $("#explica")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
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
  if (sess.i < sess.ids.length - 1) { sess.i++; sess.qt0 = Date.now(); if (!S.cfg.manterRascunho) limparRascunho(); render(); window.scrollTo(0, 0); }
  else finalizar();
}
function finalizar() {
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
      blocos.push({ o, tipo: k % 3 === 2 ? "revisao" : "tema", tema: f.tema, min: 30 });
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
  const r = restante();
  document.querySelectorAll("[data-timer]").forEach((el) => (el.textContent = mmss(r)));
  const ring = $("#ring-arc"); if (ring) ring.setAttribute("stroke-dashoffset", String(565 * (1 - r / S.pomo.total)));
  if (sess && sess.modo === "simulado" && !sess.terminou) { const el = $("#sim-timer"); if (el) el.textContent = mmss(Math.max(0, sess.fim - Date.now())); }
  if (r <= 0 && S.pomo.pausado == null) terminarPomo();
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
    const ss = window.speechSynthesis; if (!ss) { toast("Leitura em voz alta não está disponível neste navegador."); return; }
    if (ss.speaking) { ss.cancel(); return; }
    const u = new SpeechSynthesisUtterance(txt); u.lang = "pt-BR"; u.rate = aula?.vel || 1;
    const v = ss.getVoices().find((x) => x.lang?.startsWith("pt")); if (v) u.voice = v;
    ss.speak(u); return u;
  } catch (e) { toast("Leitura em voz alta não está disponível."); }
}

/* ───────────────────────── toast */
let toastT;
function toast(msg) { let el = $("#toast"); if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); } el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (el.hidden = true), 2600); }

/* ───────────────────────── navegação */
let rota = "painel", aula = null, modalAula = null;
const ROTAS_VALIDAS = ["painel", "trilha", "treinar", "revisar", "mais", "plano", "desempenho", "tutor", "foco", "simulado", "ajustes", "taf", "vespera", "erros", "backup", "leis", "questao", "resultado", "cards", "aprender"];
function ir(r) { rota = r; if (location.hash !== "#" + r) history.replaceState(null, "", "#" + r); render(); window.scrollTo(0, 0); }
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (ROTAS_VALIDAS.includes(h) && h !== rota) { rota = h; render(); } });

/* ───────────────────────── telas */
function navHTML(cls) {
  const itens = cls === "bottom"
    ? [["painel", "Painel", I.home], ["trilha", "Trilha", I.trail], ["treinar", "Treinar", I.pen], ["revisar", "Revisar", I.cards], ["mais", "Mais", I.more]]
    : [["painel", "Painel", I.home], ["trilha", "Trilha", I.trail], ["treinar", "Treinar", I.pen], ["revisar", "Revisar", I.cards], ["plano", "Mapa da semana", I.cal], ["desempenho", "Desempenho", I.chart], ["tutor", "Tutor", I.chat], ["foco", "Foco (pomodoro)", I.clock], ["simulado", "Simulado", I.flag], ["mais", "Mais", I.more]];
  const atual = { aprender: "trilha", questao: "treinar", resultado: "treinar", cards: "revisar", ajustes: "mais", taf: "mais", vespera: "mais", erros: "mais", backup: "mais", leis: "mais" }[rota] || rota;
  return itens.map(([r, n, ic]) => `<a href="#${r}" data-go="${r}" ${atual === r ? 'aria-current="page"' : ""}>${ic}<span>${n}</span></a>`).join("");
}
function objsHTML() {
  return `<div class="objs" role="group" aria-label="Objetivo">${ORDEM.map((o) => { const d = diasAte(S.cfg.datas[o]); return `<button data-obj="${o}" aria-pressed="${S.obj === o}"><span>${OBJS[o].nome}</span><span class="num small">${d >= 0 ? d + "d" : "—"}</span></button>`; }).join("")}</div>`;
}
function shell(conteudo) {
  const nv = nivelXP(S.xp);
  return `<div class="app ${rota === "questao" ? "modo-prova" : ""}">
  <aside class="side">
    <div class="brand"><div class="brand-mark">MA</div><div><b>Missão Aprovação</b><span class="small muted">Nível ${nv} · <span class="num">${S.xp}</span> XP</span></div></div>
    ${objsHTML()}
    <nav class="nav" aria-label="Principal">${navHTML("side")}</nav>
    <div class="small muted" style="margin-top:auto">Ofensiva: <b class="num">${ofensiva()}</b> dia(s)</div>
  </aside>
  <div class="main-col" style="min-width:0">
    <header class="topbar">
      <div class="row between"><div class="brand"><div class="brand-mark">MA</div><div><b>Missão Aprovação</b><span class="small muted">Nível ${nv} · ofensiva <span class="num">${ofensiva()}</span></span></div></div>
      <button class="btn sm" data-go="tutor" aria-label="Abrir tutor">${I.chat}</button></div>
      ${objsHTML()}
    </header>
    <main class="main" id="main">${conteudo}</main>
  </div>
  <nav class="bottom" aria-label="Principal">${navHTML("bottom")}</nav>
  ${S.pomo && S.pomo.tipo !== "pronto" && rota !== "foco" ? `<a class="mini-timer" href="#foco" data-go="foco">${S.pomo.tipo === "foco" ? "Foco" : "Pausa"} <span data-timer>${mmss(restante())}</span></a>` : ""}
  ${rota === "cards" || modalAula ? `<button class="btn fab" data-act="rascunho" aria-label="Abrir rascunho">${I.pen} Rascunho</button>` : ""}
  ${modalAula ? aulaHTML() : ""}
</div>`;
}

function telaPainel() {
  const o = S.obj, d = D(), p = P();
  const dd = diasAte(S.cfg.datas[o]);
  const ed = progressoEdital(o);
  const hj = dia();
  const qHoje = hj.obj[o] || 0;
  const rv = revisoesVencidas(o).length, cv = cardsVencidos(o).length;
  const blocos = planoDoDia(hoje()).filter((b) => b.o === o || b.extra);
  const fr = temasFracos(o, 1)[0];
  const qd = fr ? questoesDoTema(o, fr.tema, 0, 1)[0] : null;
  const prev = previsao(o);
  const nv = nivelXP(S.xp), base = xpDoNivel(nv), prox = xpDoNivel(nv + 1);
  const missoes = [
    { txt: `Resolver ${S.cfg.meta} questões de ${d.nome} (blocos de 10)`, feito: qHoje, meta: S.cfg.meta, act: "missao-q" },
    { txt: `Revisar ${Math.min(S.cfg.metaCards, Math.max(cv, 1))} flashcards`, feito: hj.cards, meta: Math.min(S.cfg.metaCards, Math.max(cv + hj.cards, 1)), act: "missao-c" },
    { txt: "1 pomodoro de foco (25 min)", feito: hj.pomo, meta: 1, act: "missao-p" },
    { txt: rv ? `Refazer ${rv} questões que voltaram da revisão` : "Sem revisões vencidas hoje", feito: rv ? 0 : 1, meta: 1, act: rv ? "missao-r" : "" },
  ];
  const missoesFeitas = missoes.every((m) => m.feito >= m.meta);
  const [cargo, banca] = d.sub.split(" · ");
  const prioridade = pesoObjetivo(hoje());
  const foco = ORDEM.reduce((a, b) => (prioridade[a] >= prioridade[b] ? a : b));
  return `<div class="wrap">
  ${(() => { const t = proximaFase(o); const tr = t ? (TRECHOS[t] || [])[0] : null; const deg = Math.min(5, Math.floor(ed.p / 17)); return `<section class="palco" aria-label="Sua subida até a prova">
    <div class="palco-txt">
      <span class="eyebrow">${esc(d.codigo)} · ${esc(cargo)}${banca ? ` · ${esc(banca)}` : ""}</span>
      <h1 class="page-title">${esc(d.nome)}</h1>
      <p class="contagem"><b class="num">${dd >= 0 ? dd : 0}</b> <span>${dd === 1 ? "dia" : "dias"} até a prova${d.dataNota ? " (data estimada)" : ""}</span></p>
      <p class="small muted">Degrau <b>${deg + 1} de 6</b> · ${ed.p}% do edital estudado · Nível ${nv} (${S.xp - base}/${prox - base} XP)</p>
      ${t ? `<div class="proxima"><span class="small muted">Próxima aula</span><b>${esc(t)}</b>${tr ? `<span class="chip vid">${I.play} vídeo a partir de ${tr[1]}</span>` : ""}</div><button class="btn pri big" data-act="aprender" data-tema="${esc(t)}">${I.play} Aprender agora</button>` : `<span class="chip ok">Edital inteiro dominado</span>`}
    </div>
    <div class="palco-3d" id="palco3d" data-degrau="${deg}" title="Arraste para girar">${escadaSVG(deg)}<span class="giz-nota">sua escada até a prova</span></div>
    <span class="stamp">${missoesFeitas ? "Missão cumprida" : ofensiva() ? `${I.fogo} ${ofensiva()} dias seguidos` : "Dia 1"}</span>
  </section>
  ${vitrineHTML(o)}`; })()}
  ${foco !== o ? `<p class="small muted">Prioridade do momento: <b>${OBJS[foco].nome}</b>. O mapa da semana divide seu tempo assim até ${fmtData(S.cfg.datas[foco])}.</p>` : ""}
  <div class="stats">
    <div class="stat ${ofensiva() ? "quente" : ""}"><span class="eyebrow">${I.fogo} Ofensiva</span><b class="num">${ofensiva()}</b><span class="small muted">dias seguidos</span></div>
    <div class="stat"><span class="eyebrow">${I.alvo} Hoje</span><b class="num">${hj.q}</b><span class="small muted">questões · ${pct(hj.a, hj.q)}%</span></div>
    <div class="stat"><span class="eyebrow">${I.trofeu} Previsão</span><b class="num">${prev ? prev.nota + "%" : "—"}</b><span class="small muted">${prev ? (prev.nota >= 60 ? "acima" : "abaixo") + " dos 60%" : "faça 3+ por matéria"}</span></div>
  </div>
  <section class="card">
    <div class="row between"><h2>Missões de hoje</h2><span class="chip acc">+XP</span></div>
    <div>${missoes.map((m) => { const ok = m.feito >= m.meta; return `<div class="mission"><span class="tick ${ok ? "on" : ""}">${ok ? I.check : ""}</span><div><div>${esc(m.txt)}</div><div class="bar ${ok ? "ok" : ""}" style="margin-top:6px"><i style="width:${Math.min(100, pct(m.feito, m.meta))}%"></i></div></div>${m.act && !ok ? `<button class="btn sm" data-act="${m.act}">Fazer</button>` : `<span class="small muted num">${Math.min(m.feito, m.meta)}/${m.meta}</span>`}</div>`; }).join("")}</div>
  </section>
  ${qd ? `<section class="card"><div class="row between"><h2>Questão do dia</h2><span class="chip bad">${esc(fr.tema)}</span></div><p class="muted small">Sorteada entre seus temas mais fracos.</p><p>${esc(Q(qd)?.enunciado || "")}</p><button class="btn pri" data-act="qdia" data-id="${esc(qd)}">Responder</button></section>` : ""}
  <section class="card">
    <div class="row between"><h2>Plano de hoje</h2><button class="btn ghost sm" data-go="plano">Semana toda</button></div>
    ${blocos.length ? `<div class="stack">${blocos.map((b) => blocoHTML(b)).join("")}</div>` : `<p class="muted">Hoje está sem horário no seu mapa. Ajuste as horas em Mapa da semana.</p>`}
  </section>
  </div>`;
}
function blocoHTML(b) {
  const rotulo = { tema: "Aula + 10 questões", revisao: "Revisão + 10 questões", simulado: "Mini-simulado", taf: "Treino físico" }[b.tipo];
  const act = b.tipo === "simulado" ? `data-act="mini-sim" data-o="${b.o}"` : b.tipo === "taf" ? `data-go="taf"` : `data-act="bloco" data-o="${b.o}" data-tema="${esc(b.tema)}"`;
  return `<div class="block"><span class="t">${b.min} min</span><div style="min-width:0"><div style="font-weight:700">${esc(b.tema)}</div><div class="small muted">${OBJS[b.o].nome} · ${rotulo}</div></div><button class="btn sm" ${act}>Começar</button></div>`;
}

function vitrineHTML(o) {
  const itens = [];
  for (const m of OBJS[o].materias) for (const t of TEMAS_MAT[o][m.id]) { if (TRECHOS[t] && !(statTema(o, t).t >= 10 && statTema(o, t).p >= 0.8)) itens.push([t, m.id]); }
  if (!itens.length) return "";
  return `<section class="vitrine" aria-label="Aulas em vídeo"><div class="row between"><h2>Aulas no minuto certo</h2><span class="small muted">vídeos gratuitos</span></div>
  <div class="trilho">${itens.slice(0, 10).map(([t, mid]) => { const tr = TRECHOS[t][0]; const vis = (P().assistidos || {})[`${t}|0`]; return `<button class="capa" data-act="aprender" data-tema="${esc(t)}"><span class="capa-arte">${iconeMat(mid)}<span class="capa-play">${I.play}</span><span class="capa-tempo num">${tr[1]}</span></span><b>${esc(t)}</b><span class="small muted">${esc(tr[3])}${tr[2] ? ` · ${durTxt(tr[1], tr[2])}` : ""}</span>${vis ? `<span class="chip ok">${I.check} assistido</span>` : ""}</button>`; }).join("")}</div></section>`;
}
function telaTrilha() {
  const o = S.obj, d = D();
  let proxima = null;
  const html = d.materias.map((m) => {
    const sm = statMat(o, m.id);
    const temas = TEMAS_MAT[o][m.id];
    const estagios = temas.map((t) => {
      const s = statTema(o, t);
      const temQ = BANCO[o].some((q) => q.tema === t) || genDoObj[o].some((g) => g.tema === t);
      const st = s.t >= 10 && s.p >= 0.8 ? "dom" : s.t || P().vistos[t] ? "prog" : "";
      const ehProx = !proxima && st !== "dom" && temQ; if (ehProx) proxima = t;
      const nq = BANCO[o].filter((q) => q.tema === t).length;
      const gen = genDoObj[o].some((g) => g.tema === t);
      const alta = BANCO[o].some((q) => q.tema === t && q.alta) || genDoObj[o].some((g) => g.tema === t && g.altaChance);
      return `<div class="stage ${st} ${ehProx ? "next" : ""}"><div style="min-width:0"><h3>${esc(t)}</h3><div class="meta">${alta ? '<span class="chip alta">Alta chance</span>' : ""}${s.t ? `<span class="chip ${s.p < 0.6 ? "bad" : "ok"} num">${Math.round(s.p * 100)}% de ${s.t}</span>` : "<span>não iniciado</span>"}<span>${gen ? "questões infinitas" : nq + " questões"}</span>${TRECHOS[t] ? `<span class="chip vid">▶ ${TRECHOS[t][0][1]}</span>` : ""}${P().aprendeu?.[t] ? `<span class="chip ok">aula feita</span>` : ""}${ehProx ? '<span class="chip acc">próxima fase</span>' : ""}</div></div><div class="row" style="gap:6px"><button class="btn sm pri" data-act="aprender" data-tema="${esc(t)}">Aprender</button>${temQ ? `<button class="btn sm" data-act="treinar-tema" data-tema="${esc(t)}">Treinar</button>` : ""}<button class="btn sm ghost" data-act="aula" data-tema="${esc(t)}">Resumo</button></div></div>`;
    }).join("");
    return `<details class="mat" ${proxima && temas.includes(proxima) ? "open" : ""}><summary><div class="mat-tit"><span class="mat-ic">${iconeMat(m.id)}</span><div><h2>${esc(m.nome)}</h2><span class="small muted">${temas.length} temas · peso ${m.peso}%${sm.t ? ` · ${Math.round(sm.p * 100)}% de acerto` : ""}</span></div></div><span class="chip ${sm.t ? (sm.p < 0.6 ? "bad" : "ok") : ""}">${sm.t ? Math.round(sm.p * 100) + "%" : "—"}</span></summary><div class="trail">${estagios}</div></details>`;
  }).join("");
  return `<div class="wrap"><div><span class="eyebrow">${esc(d.nome)}</span><h1>Trilha do edital</h1><p class="muted">Cada tema é uma fase. Toque em Aprender: vídeo no minuto certo, explicação em cartões, exemplo resolvido e questões subindo do básico ao nível prova. A fase fica verde com 80% de acerto em 10+ questões.</p></div>${html}</div>`;
}

function telaTreinar() {
  const o = S.obj, d = D();
  const f = (window.__filtro ||= { mat: "", tema: "", nivel: 0, alta: false, n: 10 });
  const temas = f.mat ? TEMAS_MAT[o][f.mat] : [];
  return `<div class="wrap">
  <div><span class="eyebrow">${esc(d.nome)}</span><h1>Treinar</h1><p class="muted">Uma questão por tela, sem cronômetro. Toque na alternativa e veja na hora se acertou.</p></div>
  <div class="grid2">
    <button class="btn big pri" data-act="relampago">Revisão relâmpago (10 dos temas fracos)</button>
    <button class="btn big" data-act="so-erros">Só as que errei ou chutei</button>
  </div>
  <section class="card">
    <h2>Montar uma lista</h2>
    <div class="grid2">
      <label class="f">Matéria<select id="f-mat" data-f="mat"><option value="">Todas</option>${d.materias.map((m) => `<option value="${m.id}" ${f.mat === m.id ? "selected" : ""}>${esc(m.nome)}</option>`).join("")}</select></label>
      <label class="f">Tema<select id="f-tema" data-f="tema" ${f.mat ? "" : "disabled"}><option value="">Todos</option>${temas.map((t) => `<option ${f.tema === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
    </div>
    <div class="row"><span class="small" style="font-weight:700">Nível</span><div class="seg">${[0, 1, 2, 3].map((n) => `<button data-nivel="${n}" aria-pressed="${f.nivel === n}">${n ? NIVEL_TXT[n] : "Todos"}</button>`).join("")}</div></div>
    <div class="row"><label class="row small" style="gap:6px;font-weight:700"><input type="checkbox" id="f-alta" data-f="alta" ${f.alta ? "checked" : ""}> Só “alta chance de cair”</label>
    <label class="row small" style="gap:6px;font-weight:700">Quantidade <input type="number" id="f-n" data-f="n" min="5" max="60" value="${f.n}" style="width:80px"></label></div>
    <button class="btn pri big" data-act="filtro-go">Começar</button>
  </section>
  <section class="card"><div class="row between"><h2>Pegadinhas da banca</h2><span class="chip alta">alta chance</span></div><p class="muted">Só questões marcadas como “alta chance”, misturando matérias. Bom para os últimos dias.</p><button class="btn" data-act="pegadinhas">Treinar pegadinhas</button></section>
  </div>`;
}

function figuraHTML(fg) {
  if (!fg) return "";
  if (fg.tipo === "circulo") return `<div class="fig"><svg viewBox="0 0 200 140" role="img" aria-label="Círculo ${esc(fg.rotulo)}"><circle cx="100" cy="70" r="55" fill="none" stroke="currentColor" stroke-width="2"/><line x1="100" y1="70" x2="155" y2="70" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3"/><circle cx="100" cy="70" r="3" fill="currentColor"/><text x="104" y="62" font-size="13" fill="currentColor">${esc(fg.rotulo)}</text></svg></div>`;
  if (fg.tipo === "triangulo") return `<div class="fig"><svg viewBox="0 0 220 150" role="img" aria-label="Triângulo de base ${esc(fg.base)} e altura ${esc(fg.altura)}"><polygon points="20,130 200,130 80,20" fill="none" stroke="currentColor" stroke-width="2"/><line x1="80" y1="20" x2="80" y2="130" stroke="currentColor" stroke-dasharray="4 3"/><text x="100" y="146" font-size="13" fill="currentColor">${esc(fg.base)}</text><text x="86" y="80" font-size="13" fill="currentColor">${esc(fg.altura)}</text></svg></div>`;
  if (fg.tipo === "tales") return `<div class="fig"><svg viewBox="0 0 240 160" role="img" aria-label="Teorema de Tales"><line x1="10" y1="30" x2="230" y2="30" stroke="currentColor"/><line x1="10" y1="80" x2="230" y2="80" stroke="currentColor"/><line x1="10" y1="140" x2="230" y2="140" stroke="currentColor"/><line x1="50" y1="15" x2="80" y2="155" stroke="currentColor" stroke-width="2"/><line x1="150" y1="15" x2="210" y2="155" stroke="currentColor" stroke-width="2"/><text x="40" y="60" font-size="12" fill="currentColor">${esc(fg.a)}</text><text x="50" y="115" font-size="12" fill="currentColor">${esc(fg.b)}</text><text x="186" y="60" font-size="12" fill="currentColor">${esc(fg.c)}</text><text x="200" y="115" font-size="12" fill="currentColor">x</text></svg></div>`;
  return "";
}
function telaQuestao() {
  if (!sess) return telaTreinar();
  const o = S.obj, id = sess.ids[sess.i], q = Q(id), r = sess.resp[sess.i];
  const sim = sess.modo === "simulado";
  const respondida = r && !sim;
  const mid = TEMA_MAT[o][q.tema];
  const marca = P().marcas[id];
  const alts = q.alternativas.map((a, k) => {
    let cls = ""; if (respondida) { if (k === q.correta) cls = "ok"; else if (k === r.esc) cls = "bad"; } else if (r && r.esc === k) cls = "sel";
    const why = respondida && k === r.esc && !r.ok && q.erros?.[k] ? `<span class="why">${esc(q.erros[k])}</span>` : "";
    return `<button class="alt ${cls}" data-alt="${k}" ${respondida ? "disabled" : ""} aria-label="Alternativa ${LETRAS[k]}: ${esc(a)}"><span class="bub">${LETRAS[k]}</span><span>${esc(a)}</span>${why}</button>`;
  }).join("");
  const prog = sess.ids.map((_, i) => { const x = sess.resp[i]; return `<i class="${i === sess.i ? "cur" : x ? (sim ? "ans" : x.ok ? "ok" : "bad") : ""}"></i>`; }).join("");
  const res = resumoDe(o, q.tema);
  const explic = respondida ? `<section class="card" id="explica">
    <div role="status" class="verdict ${r.ok ? "ok" : "bad"}">${r.ok ? "Acertou!" : `Errou. A certa é a ${LETRAS[q.correta]}.`}</div>
    <div class="tutor-say"><span class="avatar">T</span><div class="bubble">${esc(frase(r.ok ? "ok" : "erro"))}${!r.ok && res ? ` <button class="btn ghost sm" data-act="aula" data-tema="${esc(q.tema)}">Abrir o resumo de ${esc(q.tema)}</button>` : ""}</div></div>
    <p>${esc(q.explicacao)}</p>
    ${q.passos?.length ? `<div><div class="eyebrow" style="margin-bottom:6px">Passo a passo</div><ol class="steps">${q.passos.map((s) => `<li><span>${esc(s)}</span></li>`).join("")}</ol></div>` : ""}
    ${q.macete || res?.macete ? `<div class="macete"><b>Macete:</b> ${esc(q.macete || res.macete)}</div>` : ""}
    <div class="row"><button class="btn sm" data-act="falar-exp">${I.sound} Ouvir explicação</button></div>
    <div class="marks"><span class="small muted" style="align-self:center">Marcar:</span>${[["dificil", "Difícil"], ["chutei", "Chutei"], ["revisar", "Revisar"]].map(([k, n]) => `<button class="btn sm" data-marca="${k}" aria-pressed="${marca === k}">${n}</button>`).join("")}</div>
    ${!r.ok ? `<label class="f">Por que eu errei? (vai para o caderno de erros)<textarea id="porque" data-id="${esc(id)}" placeholder="Ex.: confundi prazo da LAI com o da ouvidoria">${esc(P().porque[id] || "")}</textarea></label>` : ""}
    <button class="btn pri big" data-act="proxima">${sess.i < sess.ids.length - 1 ? "Próxima" : "Ver resultado"}</button>
  </section>` : "";
  return `<div class="wrap">
  <h1 class="sr-only">${esc(sess.titulo)}: questão ${sess.i + 1} de ${sess.ids.length}</h1>
  <div class="stack" style="gap:8px"><div class="row between"><span class="row" style="gap:8px;min-width:0"><button class="btn ghost sm" data-act="sair-sessao" aria-label="Sair das questões">✕ Sair</button><span class="eyebrow">${esc(sess.titulo)}</span></span><span class="small num">${sess.i + 1}/${sess.ids.length}${sim ? ` · <b id="sim-timer">${mmss(Math.max(0, sess.fim - Date.now()))}</b>` : ""}</span></div><div class="progress-q">${prog}</div></div>
  <section class="card">
    <div class="q-head"><div class="chips"><span class="chip acc">${esc(matNome(o, mid))}</span><span class="chip">${esc(q.tema)}</span><span class="chip">${NIVEL_TXT[q.nivel]}</span>${q.alta ? '<span class="chip alta">Alta chance</span>' : ""}</div><div class="row" style="gap:4px">${!sim ? `<button class="btn ghost sm" data-act="falar-q" aria-label="Ler a questão em voz alta">${I.sound}</button>` : ""}<button class="btn sm" data-act="rascunho">${I.pen} Rascunho</button></div></div>
    <p class="q-text">${esc(q.enunciado)}</p>
    ${q.tabela ? `<div class="tbl-wrap"><table class="tbl"><thead><tr>${q.tabela.cabecalho.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${q.tabela.linhas.map((l) => `<tr>${l.map((c) => `<td class="num">${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}
    ${figuraHTML(q.figura)}
    <div class="alts">${alts}</div>
    ${sim ? `<div class="row between"><button class="btn" data-act="anterior" ${sess.i ? "" : "disabled"}>Anterior</button><button class="btn pri" data-act="proxima">${sess.i < sess.ids.length - 1 ? "Próxima" : "Entregar"}</button></div>` : ""}
  </section>
  ${explic}
  ${sim ? `<button class="btn" data-act="entregar">Entregar simulado agora</button>` : `<button class="btn ghost" data-act="sair-sessao">Encerrar treino</button>`}
  </div>`;
}
function telaResultado() {
  if (!sess) return telaTreinar();
  const o = S.obj;
  const tot = sess.ids.length, ac = Object.values(sess.resp).filter((x) => x.ok).length;
  const porTema = {};
  sess.ids.forEach((id, i) => { const q = Q(id); const t = (porTema[q.tema] ||= { a: 0, t: 0 }); t.t++; if (sess.resp[i]?.ok) t.a++; });
  const p = pct(ac, tot);
  const min = Math.round((Date.now() - sess.t0) / 60000);
  const tm = tot ? (Date.now() - sess.t0) / tot / 60000 : 0;
  const ultimo = sess.modo === "simulado" ? P().sims[P().sims.length - 1] : null;
  return `<div class="wrap">
  <section class="card hero"><span class="eyebrow">${esc(sess.titulo)}</span><div class="count"><span class="n num">${p}%</span><span>${ac} de ${tot} certas<br><span class="small muted">${min} min · ${tm.toFixed(1).replace(".", ",")} min por questão</span></span></div>
  <p>${p >= 60 ? "Acima da linha de corte de 60%." : "Abaixo dos 60% exigidos. Os temas em vermelho são o próximo passo."}</p></section>
  ${o === "concurso" && tm > 4.5 ? `<p class="chip bad">Ritmo lento: a prova dá 4,5 min por questão (40 em 3h).</p>` : ""}
  ${ultimo ? `<section class="card"><h2>Por matéria</h2>${Object.entries(ultimo.porMat).map(([mid, x]) => temaRow(matNome(o, mid), x.a, x.t)).join("")}</section>` : ""}
  <section class="card"><h2>Por tema</h2>${Object.entries(porTema).map(([t, x]) => temaRow(t, x.a, x.t)).join("")}</section>
  ${sess.modo === "simulado" ? `<section class="card"><h2>Gabarito comentado</h2>${sess.ids.map((id, i) => { const q = Q(id), r = sess.resp[i]; return `<details><summary><b>${i + 1}.</b> ${r ? (r.ok ? "✔" : "✘") : "—"} ${esc(q.enunciado.slice(0, 90))}…</summary><p class="small">Certa: <b>${LETRAS[q.correta]}</b> ${esc(q.alternativas[q.correta])}${r && !r.ok ? ` · Você marcou ${LETRAS[r.esc]}` : ""}</p><p class="small muted">${esc(q.explicacao)}</p></details>`; }).join("")}</section>` : ""}
  <div class="grid2"><button class="btn pri big" data-go="treinar">Treinar mais</button><button class="btn big" data-go="painel">Voltar ao painel</button></div>
  </div>`;
}
function temaRow(nome, a, t) { const p = pct(a, t); return `<div class="tema-row"><span style="min-width:0">${esc(nome)}</span><div class="bar ${p < 60 ? "bad" : "ok"}"><i style="width:${p}%"></i></div><span class="num small" style="text-align:right">${p}%</span></div>`; }

function telaRevisar() {
  const o = S.obj, rv = revisoesVencidas(o), cv = cardsVencidos(o);
  const prox = Object.values(P().rev).filter((r) => r.due > hoje()).length;
  return `<div class="wrap">
  <div><span class="eyebrow">${esc(D().nome)}</span><h1>Revisar</h1><p class="muted">O que você erra volta em 1, 3, 7 e 15 dias. Flashcards seguem o mesmo princípio: os difíceis aparecem mais.</p></div>
  <div class="grid2">
    <section class="card"><span class="eyebrow">Flashcards</span><b class="num" style="font-size:2rem;font-family:var(--f-display)">${cv.length}</b><span class="muted small">para hoje (de ${CARDS[o].length} no total)</span><button class="btn pri" data-act="cards" ${cv.length ? "" : "disabled"}>Revisar cartões</button></section>
    <section class="card"><span class="eyebrow">Questões que voltaram</span><b class="num" style="font-size:2rem;font-family:var(--f-display)">${rv.length}</b><span class="muted small">vencidas hoje · ${prox} agendadas</span><button class="btn pri" data-act="missao-r" ${rv.length ? "" : "disabled"}>Refazer agora</button></section>
  </div>
  <section class="card"><div class="row between"><h2>Lei seca e números</h2><button class="btn ghost sm" data-go="vespera">Modo véspera</button></div><p class="muted small">Todos os cartões de ${esc(D().nome)}, para leitura rápida.</p>
  <div class="stack">${CARDS[o].slice(0, 6).map((c) => `<div><b>${esc(c.frente)}</b><div class="small muted">${esc(c.verso)}</div></div>`).join("")}</div></section>
  </div>`;
}
function telaCards() {
  if (!fc || fc.i >= fc.lista.length) {
    return `<div class="wrap"><section class="card empty"><h2>Revisão de cartões concluída</h2><p>${fc ? fc.feitos : 0} cartões revisados agora.</p><button class="btn pri" data-go="revisar">Voltar</button></section></div>`;
  }
  const c = CARDS[S.obj].find((x) => x.id === fc.lista[fc.i]);
  return `<div class="wrap">
  <div class="row between"><span class="eyebrow">Flashcards · ${esc(c.tema)}</span><span class="num small">${fc.i + 1}/${fc.lista.length}</span></div>
  <div class="flash ${fc.virado ? "on" : ""}" data-act="virar"><div class="flash-in"><div class="face"><span class="eyebrow">Pergunta</span><div class="big">${esc(c.frente)}</div><span class="small muted">Toque para virar</span></div><div class="face back"><span class="eyebrow">Resposta</span><div class="big" style="font-size:1.1rem">${esc(c.verso)}</div></div></div></div>
  ${fc.virado ? `<div class="grid2" style="grid-template-columns:repeat(4,minmax(0,1fr))"><button class="btn" data-card="0">Errei</button><button class="btn" data-card="1">Difícil</button><button class="btn pri" data-card="2">Bom</button><button class="btn" data-card="3">Fácil</button></div>` : `<button class="btn pri big" data-act="virar">Mostrar resposta</button>`}
  <button class="btn ghost" data-act="falar-card">${I.sound} Ouvir</button>
  </div>`;
}

function telaPlano() {
  const h = hoje();
  const dow = new Date(h + "T12:00:00").getDay();
  const domingo = addDias(h, -dow);
  const dias = Array.from({ length: 7 }, (_, i) => addDias(domingo, i));
  return `<div class="wrap wide">
  <div><span class="eyebrow">Mapa da semana</span><h1>Seu tempo, dividido pelas provas</h1><p class="muted">Diga quantos minutos você tem em cada dia. O mapa reparte entre Concurso, NPOR e ENEM pela data de cada prova e escolhe os temas onde você mais erra.</p></div>
  <section class="card"><h2>Minutos livres por dia</h2><div class="grid3" style="grid-template-columns:repeat(7,minmax(0,1fr))">${DIAS_SEM.map((n, i) => `<label class="f small">${n}<input type="number" min="0" max="720" step="15" value="${S.cfg.horas[i]}" data-hora="${i}" id="h${i}"></label>`).join("")}</div>
  <p class="small muted">Divisão atual: ${Object.entries(pesoObjetivo(h)).filter(([, v]) => v).map(([k, v]) => `${OBJS[k].nome} ${Math.round(v * 100)}%`).join(" · ")}. Depois de ${fmtData(S.cfg.datas.concurso)} o NPOR passa a ser a prioridade.</p></section>
  ${dias.map((d) => { const b = planoDoDia(d); const passado = d < h; return `<section class="card" ${d === h ? 'style="border-color:var(--acc)"' : ""}><div class="row between"><h3>${DIAS_SEM[new Date(d + "T12:00:00").getDay()]}, ${fmtData(d)} ${d === h ? '<span class="chip acc">hoje</span>' : ""}</h3><span class="small muted num">${b.reduce((s, x) => s + x.min, 0)} min</span></div>${b.length ? `<div class="stack">${b.map((x) => (passado ? blocoHTML(x).replace('class="block"', 'class="block done"') : blocoHTML(x))).join("")}</div>` : '<p class="muted small">Descanso.</p>'}</section>`; }).join("")}
  </div>`;
}

function telaDesempenho() {
  const o = S.obj, so = statObj(o), d = D(), prev = previsao(o);
  const temas = [];
  for (const m of d.materias) for (const t of TEMAS_MAT[o][m.id]) { const s = statTema(o, t); if (s.t) temas.push({ nome: t, ...s }); }
  temas.sort((a, b) => a.p - b.p);
  const sims = P().sims;
  const ult = Array.from({ length: 28 }, (_, i) => addDias(hoje(), i - 27));
  const tmMin = so.tm ? so.tm / 60000 : null;
  return `<div class="wrap">
  <div><span class="eyebrow">${esc(d.nome)}</span><h1>Desempenho</h1></div>
  <div class="stats">
    <div class="stat"><span class="eyebrow">${I.marcador} Questões</span><b class="num">${so.t}</b><span class="small muted">respondidas</span></div>
    <div class="stat"><span class="eyebrow">${I.alvo} Acerto</span><b class="num" style="color:${so.p == null ? "inherit" : so.p < 0.6 ? "var(--bad)" : "var(--ok)"}">${so.p == null ? "—" : Math.round(so.p * 100) + "%"}</b><span class="small muted">geral</span></div>
    <div class="stat"><span class="eyebrow">${I.clock} Tempo médio</span><b class="num">${tmMin ? tmMin.toFixed(1).replace(".", ",") : "—"}</b><span class="small muted">min/questão</span></div>
  </div>
  ${o === "concurso" && tmMin && tmMin > 4.5 ? `<p class="chip bad">Acima de 4,5 min por questão: na prova não dá tempo para as 40.</p>` : ""}
  <section class="card"><h2>Previsão de nota</h2>${prev ? `<p><b class="num" style="font-size:1.6rem">${prev.nota}%</b> ponderando pelo peso de cada matéria (base: ${prev.cobertura}% do peso da prova já treinado). ${prev.nota >= 60 ? "Você está acima do mínimo de 60%." : "Ainda abaixo do mínimo de 60%."}</p>` : '<p class="muted">Responda pelo menos 3 questões em cada matéria para eu estimar.</p>'}</section>
  <section class="card"><h2>Por matéria</h2>${d.materias.map((m) => { const s = statMat(o, m.id); return s.t ? temaRow(`${m.nome} (${s.t})`, s.a, s.t) : `<div class="tema-row"><span>${esc(m.nome)}</span><span class="small muted">sem dados</span><span></span></div>`; }).join("")}</section>
  <section class="card"><h2>Temas que você mais erra</h2>${temas.length ? temas.slice(0, 12).map((x) => temaRow(`${x.nome} (${x.a}/${x.t})`, x.a, x.t)).join("") : '<p class="muted">Sem dados ainda.</p>'}</section>
  <section class="card chart"><h2>Simulados</h2>${sims.length ? graficoSims(sims) : '<p class="muted">Faça um simulado para ver a evolução aqui.</p>'}</section>
  <section class="card"><h2>Últimas 4 semanas</h2><div class="heat">${ult.map((x) => { const q = S.dias[x]?.q || 0; return `<i class="${q >= 30 ? "l3" : q >= 10 ? "l2" : q > 0 ? "l1" : ""}" title="${fmtData(x)}: ${q} questões"></i>`; }).join("")}</div><p class="small muted">Cada quadrado é um dia. Mais escuro = mais questões.</p></section>
  <section class="card"><h2>Medalhas</h2><div class="grid2">${MEDALHAS.map((m) => `<div class="medal ${S.medalhas[m.id] ? "on" : ""}"><span class="m">${S.medalhas[m.id] ? "★" : "?"}</span><div><b>${esc(m.nome)}</b><div class="small muted">${S.medalhas[m.id] ? "em " + fmtData(S.medalhas[m.id]) : "bloqueada"}</div></div></div>`).join("")}</div></section>
  </div>`;
}
function graficoSims(sims) {
  const W = 600, H = 200, pad = 32;
  const pts = sims.map((s, i) => [pad + (sims.length === 1 ? (W - 2 * pad) / 2 : (i * (W - 2 * pad)) / (sims.length - 1)), H - pad - (pct(s.a, s.t) / 100) * (H - 2 * pad)]);
  const y60 = H - pad - 0.6 * (H - 2 * pad);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução dos simulados">
  ${[0, 50, 100].map((v) => { const y = H - pad - (v / 100) * (H - 2 * pad); return `<line x1="${pad}" x2="${W - pad}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="4" y="${y + 3}">${v}%</text>`; }).join("")}
  <line x1="${pad}" x2="${W - pad}" y1="${y60}" y2="${y60}" stroke="var(--bad)" stroke-dasharray="4 4"/><text x="${W - pad - 60}" y="${y60 - 4}" style="fill:var(--bad)">corte 60%</text>
  <polyline fill="none" stroke="var(--acc)" stroke-width="2.5" points="${pts.map((p) => p.join(",")).join(" ")}"/>
  ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 5 : 3.5}" fill="var(--acc)"/><text x="${p[0] - 14}" y="${H - 10}">${fmtData(sims[i].data)}</text>`).join("")}
  </svg>`;
}

function telaTutor() {
  const msgs = S.chat.slice(-30);
  return `<div class="wrap">
  <div><span class="eyebrow">Tutor</span><h1>Pergunte ao tutor</h1><p class="muted">Funciona sem internet: ele busca nos resumos e cartões do app e olha seus erros. Escolha o tom.</p></div>
  <div class="seg" role="group" aria-label="Tom do tutor">${Object.entries(TONS).map(([k, t]) => `<button data-tom="${k}" aria-pressed="${S.cfg.tom === k}">${t.nome}</button>`).join("")}</div>
  <div class="chips">${["O que estudo hoje?", "Onde estou errando?", "Prazo da LAI", "Crase com lugar", "Regra de três inversa", "Patrono do Exército"].map((s) => `<button class="btn sm" data-sug="${esc(s)}">${esc(s)}</button>`).join("")}</div>
  <div class="chat">${msgs.length ? msgs.map((m) => m.me ? `<div class="msg-me">${esc(m.txt)}</div>` : `<div class="tutor-say"><span class="avatar">T</span><div class="bubble">${esc(m.txt)}${(m.temas || []).map((t) => ` <button class="btn ghost sm" data-act="aula" data-tema="${esc(t)}">Aula: ${esc(t)}</button>`).join("")}${m.link ? ` <button class="btn ghost sm" data-go="${m.link}">Abrir</button>` : ""}</div></div>`).join("") : `<div class="tutor-say"><span class="avatar">T</span><div class="bubble">Oi! Pergunte sobre qualquer tema do edital, ou peça “o que estudo hoje?”.</div></div>`}</div>
  <form class="chat-form" id="chat-form"><input type="text" id="chat-in" placeholder="Ex.: qual o prazo de resposta da LAI?" autocomplete="off" aria-label="Pergunta"><button class="btn pri" type="submit">Enviar</button></form>
  ${msgs.length ? '<button class="btn ghost sm" data-act="limpar-chat">Limpar conversa</button>' : ""}
  </div>`;
}

function telaFoco() {
  const pm = S.pomo, r = restante();
  const tipo = pm?.tipo || "pronto";
  const pausa = tipo === "pausa" || tipo === "longa";
  const dicas = ["Levante e alongue braços e costas.", "Beba um copo de água.", "Olhe para longe por 20 segundos.", "Respire fundo 5 vezes.", "Não pegue o celular para redes sociais."];
  const tf = (pm?.tarefa) || "";
  return `<div class="wrap">
  <div><span class="eyebrow">Pomodoro</span><h1>${pausa ? "Pausa" : "Foco"}</h1><p class="muted">${S.cfg.pomo.foco} min de estudo, ${S.cfg.pomo.pausa} de pausa e ${S.cfg.pomo.longa} a cada 4 ciclos. Ajuste os tempos em Ajustes.</p></div>
  <section class="card ${pausa ? "pausa" : ""}">
    <div class="ring"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="none" stroke="var(--surface-2)" stroke-width="12"/><circle id="ring-arc" cx="100" cy="100" r="90" fill="none" stroke="${pausa ? "var(--ok)" : "var(--acc)"}" stroke-width="12" stroke-linecap="round" stroke-dasharray="565" stroke-dashoffset="${pm && pm.total > 1 ? 565 * (1 - r / pm.total) : 565}"/></svg><div class="lbl"><div><b data-timer>${pm && tipo !== "pronto" ? mmss(r) : String(S.cfg.pomo.foco).padStart(2, "0") + ":00"}</b><span class="small muted">ciclo ${(pm?.ciclos || 0) % 4 + 1} de 4</span></div></div></div>
    ${pausa ? `<p class="macete">${esc(dicas[(pm.ciclos || 0) % dicas.length])} As questões ficam bloqueadas até o fim da pausa.</p>` : `<label class="f">O que vou estudar agora<input type="text" id="pomo-tarefa" value="${esc(tf)}" placeholder="Ex.: Aula de Crase + 10 questões"></label>`}
    <div class="row" style="justify-content:center">
      ${tipo === "pronto" || !pm ? `<button class="btn pri big" data-act="pomo-start">Começar foco</button>` : `<button class="btn" data-act="pomo-pause">${pm.pausado != null ? "Continuar" : "Pausar"}</button><button class="btn" data-act="pomo-skip">${pausa ? "Pular pausa" : "Concluir agora"}</button><button class="btn ghost" data-act="pomo-stop">Parar</button>`}
    </div>
  </section>
  <section class="card"><h2>Hoje</h2><p><b class="num">${dia().pomo}</b> pomodoros · <b class="num">${dia().min}</b> min de foco</p></section>
  </div>`;
}

function telaSimulado() {
  const o = S.obj, sims = P().sims;
  const desc = o === "concurso" ? "40 questões em 3 horas, na proporção da prova: 20 de Conhecimentos Específicos e 5 de cada básica (Português, Raciocínio Lógico, Informática e Legislação). Sem correção até entregar e sem calculadora." : `20 questões de ${D().nome}, cronometradas, com resultado por matéria.`;
  return `<div class="wrap">
  <div><span class="eyebrow">${esc(D().nome)}</span><h1>Simulado</h1><p class="muted">${desc}</p></div>
  <div class="grid2"><button class="btn pri big" data-act="sim-full">Simulado completo</button><button class="btn big" data-act="mini-sim" data-o="${o}">Mini-simulado (10 em 15 min)</button></div>
  <section class="card"><h2>Histórico</h2>${sims.length ? sims.slice().reverse().map((s) => `<div class="row between"><span>${fmtData(s.data)} · ${s.min} min</span><span class="chip ${pct(s.a, s.t) < 60 ? "bad" : "ok"} num">${s.a}/${s.t} · ${pct(s.a, s.t)}%</span></div>`).join("") : '<p class="muted">Nenhum simulado ainda.</p>'}</section>
  </div>`;
}

function telaMais() {
  const o = S.obj;
  const itens = [["plano", "Mapa da semana", "Planner montado com as suas horas livres"], ["desempenho", "Desempenho", "Acerto por matéria, tema, simulados e medalhas"], ["tutor", "Tutor", "Tire dúvidas e veja o que estudar"], ["foco", "Foco (pomodoro)", "Timer 25/5 com ciclos"], ["simulado", "Simulado", "Prova completa ou mini"], ["vespera", "Modo véspera", "Só resumos, números e checklist do dia"], ["erros", "Caderno de erros", "Seus erros com o motivo que você anotou"], ["leis", "Leis e links", "Texto oficial e videoaulas"], ...(o === "npor" ? [["taf", "TAF", "Registre corrida, flexão, abdominal e barra"]] : []), ["ajustes", "Ajustes", "Datas das provas, tom, fonte e tema"], ["backup", "Backup", "Passe seu progresso do PC para o celular"]];
  return `<div class="wrap"><h1>Mais</h1><div class="stack">${itens.map(([r, n, d]) => `<a class="card" href="#${r}" data-go="${r}" style="text-decoration:none;color:inherit;flex-direction:row;justify-content:space-between;align-items:center"><div><h2 class="h3">${n}</h2><span class="small muted">${d}</span></div><span aria-hidden="true">›</span></a>`).join("")}</div></div>`;
}

function telaVespera() {
  const o = S.obj, d = D();
  const check = o === "npor" ? ["Documento oficial com foto", "Comprovante de inscrição / convocação", "Roupa e tênis para o TAF", "Garrafa de água", "Caneta preta de corpo transparente", "Chegar 1h antes", "Dormir pelo menos 7h"] : ["Documento oficial com foto (original)", "Caneta esferográfica preta de corpo transparente", "Conferir local e horário no cartão de inscrição", "Sair com folga: chegar 1h antes", "Lanche leve e água", "Relógio analógico se o edital permitir", "Dormir cedo e não estudar conteúdo novo"];
  const feitos = (S.check ||= {});
  return `<div class="wrap">
  <div><span class="eyebrow">${esc(d.nome)}</span><h1>Modo véspera</h1><p class="muted">Só o essencial: números, prazos e macetes. Leia em voz alta se puder.</p></div>
  <section class="card"><h2>Checklist do dia da prova</h2>${check.map((c, i) => `<label class="row" style="gap:10px"><input type="checkbox" data-check="${o}${i}" ${feitos[o + i] ? "checked" : ""}> ${esc(c)}</label>`).join("")}</section>
  <section class="card"><h2>Números e prazos</h2><div class="stack">${CARDS[o].map((c) => `<div><b>${esc(c.frente)}</b><div class="small">${esc(c.verso)}</div></div>`).join('<hr class="sep">')}</div></section>
  <section class="card"><h2>Macetes de cada tema</h2><div class="stack">${Object.entries(d.resumos).map(([t, r]) => `<div><b>${esc(t)}</b><div class="small">${esc(r.macete)}</div></div>`).join('<hr class="sep">')}</div></section>
  ${o !== "concurso" || true ? `<section class="card"><h2>Fórmulas de matemática</h2><div class="stack">${Object.entries(resumosMat).filter(([t]) => genDoObj[o].some((g) => g.tema === t)).map(([t, r]) => `<div><b>${esc(t)}</b><div class="small">${esc(r.t[0])}</div><div class="small muted">${esc(r.macete)}</div></div>`).join('<hr class="sep">')}</div></section>` : ""}
  </div>`;
}

function telaErros() {
  const p = P();
  const lista = Object.entries(p.resp).filter(([, r]) => r.ultimaErrada).sort((a, b) => b[1].last - a[1].last).slice(0, 60);
  const marcadas = Object.entries(p.marcas).filter(([, m]) => m);
  return `<div class="wrap">
  <div><h1>Caderno de erros</h1><p class="muted">Cada questão que você errou por último, com o motivo que você escreveu.</p></div>
  ${lista.length ? `<button class="btn pri" data-act="so-erros">Refazer todas (${lista.length})</button>` : ""}
  ${lista.length ? lista.map(([id]) => { const q = Q(id); if (!q) return ""; return `<section class="card"><div class="chips"><span class="chip">${esc(q.tema)}</span>${p.marcas[id] ? `<span class="chip alta">${esc(p.marcas[id])}</span>` : ""}</div><p>${esc(q.enunciado)}</p><p class="small">Certa: <b>${LETRAS[q.correta]}) ${esc(q.alternativas[q.correta])}</b></p><p class="small muted">${esc(q.explicacao)}</p>${p.porque[id] ? `<p class="macete small"><b>Por que errei:</b> ${esc(p.porque[id])}</p>` : ""}</section>`; }).join("") : '<section class="card empty">Nenhum erro registrado ainda. Bom sinal, ou hora de treinar.</section>'}
  ${marcadas.length ? `<section class="card"><h2>Marcadas</h2>${marcadas.map(([id, m]) => { const q = Q(id); return q ? `<div class="small"><span class="chip alta">${esc(m)}</span> ${esc(q.enunciado.slice(0, 100))}…</div>` : ""; }).join("")}</section>` : ""}
  </div>`;
}

function telaLeis() {
  const o = S.obj, d = D();
  const comLei = Object.entries(d.resumos).filter(([, r]) => r.lei);
  const yt = (t) => `https://www.youtube.com/results?search_query=${encodeURIComponent(t + " " + (o === "concurso" ? "concurso aula" : o === "npor" ? "aula" : "ENEM aula"))}`;
  return `<div class="wrap">
  <div><h1>Leis e links</h1><p class="muted">Texto oficial para ler a lei seca, e buscas no YouTube por videoaula de cada tema.</p></div>
  ${comLei.length ? `<section class="card"><h2>Texto oficial</h2>${comLei.map(([t, r]) => `<div class="row between"><span>${esc(t)}</span><a class="btn sm" href="${esc(r.lei)}" target="_blank" rel="noopener">Abrir</a></div>`).join("")}</section>` : ""}
  <section class="card"><h2>Videoaulas por tema</h2><p class="small muted">Os botões ▶ abrem a aula gratuita já no minuto em que o assunto começa (conferido na transcrição). Os demais abrem a busca do YouTube.</p>${d.materias.flatMap((m) => TEMAS_MAT[o][m.id]).map((t) => `<div class="row between"><span>${esc(t)}</span>${TRECHOS[t] ? `<a class="btn sm pri" href="${ytLink(TRECHOS[t][0][0], TRECHOS[t][0][1])}" target="_blank" rel="noopener">▶ ${TRECHOS[t][0][1]}</a>` : `<a class="btn sm" href="${yt(t)}" target="_blank" rel="noopener">Buscar vídeo</a>`}</div>`).join("")}</section>
  </div>`;
}

function telaTAF() {
  const ex = npor.taf;
  const ult = S.taf[S.taf.length - 1] || {};
  return `<div class="wrap">
  <div><span class="eyebrow">NPOR</span><h1>Teste de Aptidão Física</h1><p class="muted">Os mínimos abaixo vêm de guias, não do edital oficial. Treine acima da meta e confirme os índices com o quartel.</p></div>
  <section class="card"><h2>Registrar treino de hoje</h2><div class="grid2">${ex.map((e) => `<label class="f">${e.nome} (${e.un})<input type="number" min="0" id="taf-${e.id}" value=""></label>`).join("")}</div><button class="btn pri" data-act="taf-salvar">Salvar</button></section>
  <section class="card"><h2>Situação</h2>${ex.map((e) => { const v = ult[e.id]; const p = v ? Math.min(100, pct(v, e.meta)) : 0; return `<div class="stack" style="gap:4px"><div class="row between"><b>${e.nome}</b><span class="small num">${v ?? "—"} ${e.un} · mínimo ${e.min} · meta ${e.meta}</span></div><div class="bar ${v == null ? "" : v < e.min ? "bad" : "ok"}"><i style="width:${p}%"></i></div></div>`; }).join("")}</section>
  <section class="card"><h2>Histórico</h2>${S.taf.length ? S.taf.slice().reverse().map((t) => `<div class="small">${fmtData(t.data)}: ${ex.map((e) => `${e.nome.split(" ")[0]} ${t[e.id] ?? "—"}`).join(" · ")}</div>`).join("") : '<p class="muted">Nenhum treino registrado.</p>'}</section>
  </div>`;
}

function telaAjustes() {
  const c = S.cfg;
  return `<div class="wrap">
  <h1>Ajustes</h1>
  <section class="card"><h2>Datas das provas</h2>${ORDEM.map((o) => `<label class="f">${OBJS[o].nome}<input type="date" id="data-${o}" data-data="${o}" value="${c.datas[o]}"></label>${OBJS[o].dataNota ? `<span class="small muted">${esc(OBJS[o].dataNota)}</span>` : ""}`).join("")}</section>
  <section class="card"><h2>Aparência</h2>
    <div class="row"><span style="font-weight:700">Tema</span><div class="seg">${[["auto", "Lousa (escuro)"], ["light", "Quadro branco (claro)"]].map(([k, n]) => `<button data-tema-ui="${k}" aria-pressed="${c.tema === k}">${n}</button>`).join("")}</div></div>
    <div class="row"><span style="font-weight:700">Tamanho da letra</span><div class="seg">${[[15, "A-"], [17, "A"], [19, "A+"], [21, "A++"]].map(([k, n]) => `<button data-fonte="${k}" aria-pressed="${c.fonte === k}">${n}</button>`).join("")}</div></div>
  </section>
  <section class="card"><h2>Metas diárias</h2><div class="grid2"><label class="f">Questões por dia<input type="number" id="meta-q" data-cfg="meta" min="5" max="200" value="${c.meta}"></label><label class="f">Novos flashcards por dia<input type="number" id="meta-c" data-cfg="metaCards" min="0" max="100" value="${c.metaCards}"></label></div></section>
  <section class="card"><h2>Pomodoro</h2><div class="grid3"><label class="f">Foco (min)<input type="number" id="p-foco" data-pomo="foco" min="5" max="90" value="${c.pomo.foco}"></label><label class="f">Pausa (min)<input type="number" id="p-pausa" data-pomo="pausa" min="1" max="30" value="${c.pomo.pausa}"></label><label class="f">Pausa longa<input type="number" id="p-longa" data-pomo="longa" min="5" max="60" value="${c.pomo.longa}"></label></div></section>
  <section class="card"><h2>Tutor e rascunho</h2>
    <div class="row"><span style="font-weight:700">Tom do tutor</span><div class="seg">${Object.entries(TONS).map(([k, t]) => `<button data-tom="${k}" aria-pressed="${c.tom === k}">${t.nome}</button>`).join("")}</div></div>
    <label class="row" style="gap:8px"><input type="checkbox" id="manter" data-bool="manterRascunho" ${c.manterRascunho ? "checked" : ""}> Manter o rascunho ao passar de questão</label>
  </section>
  </div>`;
}

function telaBackup() {
  return `<div class="wrap">
  <div><h1>Backup</h1><p class="muted">Seu progresso fica salvo neste navegador. Para passar para outro aparelho, copie o código abaixo e cole lá em “Importar”.</p></div>
  <section class="card"><h2>Exportar</h2><textarea id="exp" aria-label="Código de backup para copiar" readonly style="min-height:120px;font-family:var(--f-mono);font-size:.75rem">${esc(JSON.stringify(S))}</textarea><button class="btn pri" data-act="copiar">Copiar código</button></section>
  <section class="card"><h2>Importar</h2><textarea id="imp" aria-label="Cole aqui o código exportado" placeholder="Cole aqui o código exportado" style="font-family:var(--f-mono);font-size:.75rem"></textarea><label class="f small">ou escolha um arquivo .json<input type="file" id="imp-file" accept=".json,application/json,text/plain"></label><div id="imp-confirm"></div><button class="btn" data-act="importar">Importar</button></section>
  <section class="card"><h2>Recomeçar do zero</h2><p class="small muted">Apaga todo o progresso deste aparelho.</p><div id="reset-zone"><button class="btn" data-act="reset-ask">Apagar progresso</button></div></section>
  </div>`;
}

/* ───────────────────────── aula (resumo + mini-aula animada) */
function abrirAula(tema) {
  const o = S.obj;
  const r = resumoDe(o, tema) || Object.values(OBJS).map((x) => x.resumos[tema]).find(Boolean);
  if (!r) { toast("Este tema ainda não tem resumo."); return; }
  P().vistos[tema] = true; salvar();
  modalAula = { tema, r, modo: "ler", passo: 0, tocando: false };
  aula = { vel: 1 };
  window.__voltaFoco = document.activeElement;
  render();
  setTimeout(() => $(".sheet [data-act=fechar-aula]")?.focus(), 30);
}
function aulaHTML() {
  const { tema, r, modo, passo } = modalAula;
  const o = S.obj;
  const temQ = BANCO[o].some((q) => q.tema === tema) || genDoObj[o].some((g) => g.tema === tema);
  const passos = [...r.t, `O que mais cai: ${r.cai}`, `Macete: ${r.macete}`];
  const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(tema + " aula")}`;
  const nota = P().notas[tema] || "";
  const corpo = modo === "ler" ? `
    <div class="macete"><b>O que mais cai:</b> ${esc(r.cai)}</div>
    <ol class="steps lesson">${r.t.map((x) => `<li><span>${esc(x)}</span></li>`).join("")}</ol>
    <div class="macete"><b>Macete:</b> ${esc(r.macete)}</div>
    <div class="row">${r.lei ? `<a class="btn sm" href="${esc(r.lei)}" target="_blank" rel="noopener">Texto oficial</a>` : ""}${TRECHOS[tema] ? TRECHOS[tema].map((x) => `<a class="btn sm" href="${ytLink(x[0], x[1])}" target="_blank" rel="noopener">▶ ${x[1]} · ${esc(x[3])}</a>`).join("") : `<a class="btn sm" href="${yt}" target="_blank" rel="noopener">Buscar videoaula</a>`}<button class="btn sm" data-act="aula-play">Mini-aula narrada</button></div>
    <button class="btn pri" data-act="aprender" data-tema="${esc(tema)}">Aprender passo a passo (vídeo, exemplo e questões)</button>
    <label class="f">Minhas anotações<textarea id="nota-aula" data-tema="${esc(tema)}" placeholder="Escreva com suas palavras o que entendeu">${esc(nota)}</textarea></label>
    ${temQ ? `<div class="eyebrow">Treinar este tema</div><div class="grid3">${[1, 2, 3].map((n) => `<button class="btn ${n === 1 ? "pri" : ""}" data-act="treinar-nivel" data-tema="${esc(tema)}" data-nivel="${n}">${NIVEL_TXT[n]}</button>`).join("")}</div>` : ""}`
    : `<div class="row between small"><span class="eyebrow">Passo ${passo + 1} de ${passos.length}</span><div class="seg">${[1, 1.25, 1.5].map((v) => `<button data-vel="${v}" aria-pressed="${aula.vel === v}">${String(v).replace(".", ",")}x</button>`).join("")}</div></div>
    <div class="bar"><i style="width:${pct(passo + 1, passos.length)}%"></i></div>
    <div class="lesson-step card" aria-live="polite">${esc(passos[passo])}</div>
    <div class="row between"><button class="btn" data-act="aula-prev" ${passo ? "" : "disabled"}>Voltar</button><button class="btn" data-act="aula-voz">${I.sound} ${modalAula.tocando ? "Parar voz" : "Narrar"}</button>${passo < passos.length - 1 ? `<button class="btn pri" data-act="aula-next">Próximo</button>` : temQ ? `<button class="btn pri" data-act="treinar-nivel" data-tema="${esc(tema)}" data-nivel="1">3 questões para fixar</button>` : `<button class="btn pri" data-act="aula-ler">Concluir</button>`}</div>
    <button class="btn ghost sm" data-act="aula-ler">Ver resumo inteiro</button>`;
  return `<div class="modal" data-act="fechar-aula-fundo"><div class="sheet" role="dialog" aria-modal="true" aria-label="Aula ${esc(tema)}">
    <div class="row between"><div><span class="eyebrow">Aula</span><h2>${esc(tema)}</h2></div><button class="btn sm" data-act="fechar-aula">Fechar</button></div>
    ${corpo}
  </div></div>`;
}
let autoAula = null;
function narrarPasso() {
  if (!modalAula) return;
  const r = modalAula.r, passos = [...r.t, `O que mais cai: ${r.cai}`, `Macete: ${r.macete}`];
  const u = falar(passos[modalAula.passo]);
  if (u) u.onend = () => { if (modalAula?.tocando && modalAula.passo < passos.length - 1) { modalAula.passo++; render(); setTimeout(narrarPasso, 300); } else if (modalAula) { modalAula.tocando = false; render(); } };
}

/* ───────────────────────── rascunho (canvas) */
let rasc = null;
function abrirRascunho() {
  if ($("#draft")) { $("#draft").hidden = false; return; }
  const div = document.createElement("div");
  div.className = "draft"; div.id = "draft";
  const cores = ["#2546c6", "#cf3427", "#17824a", "#131c33"];
  div.innerHTML = `<canvas id="cv"></canvas><div class="draft-bar" role="toolbar" aria-label="Ferramentas do rascunho">
    <button data-d="pen" aria-pressed="true">Pincel</button><button data-d="eraser" aria-pressed="false">Borracha</button>
    ${cores.map((c, i) => `<button data-cor="${c}" aria-pressed="${i === 0}" aria-label="Cor ${i + 1}"><span class="dot" style="background:${c}"></span></button>`).join("")}
    <button data-w="2">Fino</button><button data-w="5">Grosso</button><button data-d="undo">Desfazer</button><button data-d="redo">Refazer</button><button data-d="clear">Limpar</button><button data-d="hide">Esconder</button></div>`;
  document.body.appendChild(div);
  const cv = $("#cv", div), ctx = cv.getContext("2d");
  rasc = rasc || { strokes: [], redo: [], cor: cores[0], w: 3, modo: "pen" };
  const dpr = window.devicePixelRatio || 1;
  function resize() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; redraw(); }
  function redraw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight); ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const s of rasc.strokes) { ctx.globalCompositeOperation = s.er ? "destination-out" : "source-over"; ctx.strokeStyle = s.c; ctx.lineWidth = s.er ? 22 : s.w; ctx.beginPath(); s.p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (s.p.length === 1) ctx.lineTo(s.p[0][0] + 0.1, s.p[0][1]); ctx.stroke(); }
    ctx.globalCompositeOperation = "source-over";
  }
  rasc.redraw = redraw;
  let cur = null;
  cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); cur = { c: rasc.cor, w: rasc.w, er: rasc.modo === "eraser", p: [[e.clientX, e.clientY]] }; rasc.strokes.push(cur); rasc.redo = []; redraw(); e.preventDefault(); });
  cv.addEventListener("pointermove", (e) => { if (!cur) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; for (const ev of evs) cur.p.push([ev.clientX, ev.clientY]); redraw(); e.preventDefault(); });
  const up = () => (cur = null); cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
  div.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.cor) { rasc.cor = b.dataset.cor; rasc.modo = "pen"; }
    if (b.dataset.w) rasc.w = +b.dataset.w;
    const d = b.dataset.d;
    if (d === "pen" || d === "eraser") rasc.modo = d;
    if (d === "undo" && rasc.strokes.length) rasc.redo.push(rasc.strokes.pop());
    if (d === "redo" && rasc.redo.length) rasc.strokes.push(rasc.redo.pop());
    if (d === "clear") { rasc.strokes = []; rasc.redo = []; }
    if (d === "hide") div.hidden = true;
    div.querySelectorAll("[data-d=pen],[data-d=eraser]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.d === rasc.modo)));
    div.querySelectorAll("[data-cor]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.cor === rasc.cor && rasc.modo === "pen")));
    redraw();
  });
  addEventListener("resize", resize); resize();
}
function limparRascunho() { if (rasc) { rasc.strokes = []; rasc.redo = []; rasc.redraw?.(); } const d = $("#draft"); if (d) d.hidden = true; }

/* ───────────────────────── render + eventos */
function aplicarTema() {
  const r = document.documentElement;
  if (S.cfg.tema === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", S.cfg.tema);
  r.style.setProperty("--fs", S.cfg.fonte + "px");
  r.setAttribute("data-obj", S.obj);
}
function render() {
  aplicarTema();
  const telas = { aprender: telaAprender, painel: telaPainel, trilha: telaTrilha, treinar: telaTreinar, questao: telaQuestao, resultado: telaResultado, revisar: telaRevisar, cards: telaCards, plano: telaPlano, desempenho: telaDesempenho, tutor: telaTutor, foco: telaFoco, simulado: telaSimulado, mais: telaMais, vespera: telaVespera, erros: telaErros, leis: telaLeis, taf: telaTAF, ajustes: telaAjustes, backup: telaBackup };
  // pausa do pomodoro bloqueia questões
  let html;
  if (S.pomo && (S.pomo.tipo === "pausa" || S.pomo.tipo === "longa") && rota === "questao" && sess?.modo !== "simulado") html = telaFoco();
  else html = (telas[rota] || telaPainel)();
  const y = window.scrollY;
  $("#root").innerHTML = shell(html);
  if (render.ultima !== rota) { $(".main > .wrap")?.classList.add("entra"); render.ultima = rota; }
  const palco = rota === "painel" && $("#palco3d");
  if (palco) { const cs = getComputedStyle(document.documentElement); montarCena(palco, { cor: cs.getPropertyValue("--acc").trim() || "#8cc4ff", giz: cs.getPropertyValue("--ink").trim() || "#eef0e8", degrau: +palco.dataset.degrau }); } else desmontarCena();
  if (["tutor"].includes(rota)) { const c = $(".chat"); if (c) window.scrollTo(0, document.body.scrollHeight); } else if (rota === "questao" && sess?.resp[sess.i]) window.scrollTo(0, y);
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-go],[data-act],[data-obj],[data-alt],[data-marca],[data-card],[data-nivel],[data-tom],[data-sug],[data-tema-ui],[data-fonte],[data-vel]");
  if (!t) return;
  if (t.closest("#draft")) return;
  const ds = t.dataset;
  if (ds.go) { e.preventDefault(); modalAula = null; ir(ds.go); return; }
  if (ds.obj && t.closest(".objs")) { S.obj = ds.obj; salvar(); if (["questao", "resultado", "cards"].includes(rota)) rota = "painel"; render(); return; }
  if (ds.alt != null) { responder(+ds.alt); return; }
  if (ds.marca) { marcar(ds.marca); return; }
  if (ds.card != null) { avaliarCard(+ds.card); return; }
  if (ds.nivel != null && t.closest(".seg")) { window.__filtro.nivel = +ds.nivel; render(); return; }
  if (ds.tom) { S.cfg.tom = ds.tom; salvar(); render(); return; }
  if (ds.temaUi) { S.cfg.tema = ds.temaUi; salvar(); render(); return; }
  if (ds.fonte) { S.cfg.fonte = +ds.fonte; salvar(); render(); return; }
  if (ds.vel) { aula.vel = +ds.vel; render(); return; }
  if (ds.sug) { enviarChat(ds.sug); return; }
  if (ds.act && (ds.act === "aprender" || ds.act.startsWith("ap-")) && acaoAprender(ds.act, ds, t)) return;
  const o = S.obj;
  switch (ds.act) {
    case "missao-q": iniciar(questoesFiltro(o, { n: 10 }), "Missão do dia · bloco de 10"); break;
    case "missao-c": case "cards": iniciarCards(); break;
    case "missao-p": ir("foco"); break;
    case "missao-r": iniciar(revisoesVencidas(o), "Revisão espaçada"); break;
    case "qdia": iniciar([ds.id], "Questão do dia"); break;
    case "bloco": if (ds.o !== S.obj) S.obj = ds.o; abrirAprender(ds.tema); break;
    case "mini-sim": if (ds.o && ds.o !== S.obj) S.obj = ds.o; iniciar(simulado(S.obj).slice(0, 10), "Mini-simulado", "simulado", { minutos: 15 }); break;
    case "sim-full": iniciar(simulado(o), "Simulado completo", "simulado", { minutos: o === "concurso" ? 180 : 60 }); break;
    case "aula": abrirAula(ds.tema); break;
    case "treinar-tema": iniciar(questoesDoTema(o, ds.tema, 0, 10), ds.tema); break;
    case "treinar-nivel": { const fix = modalAula?.modo === "play"; modalAula = null; iniciar(questoesDoTema(o, ds.tema, +ds.nivel, fix ? 3 : 8), `${ds.tema} · ${NIVEL_TXT[+ds.nivel]}`); break; }
    case "relampago": iniciar(temasFracos(o, 5).flatMap((f) => questoesDoTema(o, f.tema, 0, 2)), "Revisão relâmpago"); break;
    case "so-erros": iniciar(questoesFiltro(o, { erros: true, n: 30 }), "Só os erros"); break;
    case "pegadinhas": iniciar(questoesFiltro(o, { alta: true, n: 10 }), "Pegadinhas da banca"); break;
    case "filtro-go": { const f = window.__filtro; iniciar(questoesFiltro(o, f), "Treino"); break; }
    case "proxima": proxima(); break;
    case "anterior": if (sess.i) { sess.i--; render(); } break;
    case "entregar": finalizar(); break;
    case "sair-sessao": sess && Object.keys(sess.resp).length ? (sess.terminou = true, ir("resultado")) : ir("treinar"); break;
    case "falar-q": { const q = Q(sess.ids[sess.i]); falar(`${q.enunciado}. ${q.alternativas.map((a, k) => `${LETRAS[k]}: ${a}`).join(". ")}`); break; }
    case "falar-exp": { const q = Q(sess.ids[sess.i]); falar(`${q.explicacao} ${(q.passos || []).join(". ")}`); break; }
    case "falar-card": { const c = CARDS[o].find((x) => x.id === fc.lista[fc.i]); falar(fc.virado ? c.verso : c.frente); break; }
    case "virar": fc.virado = !fc.virado; render(); break;
    case "rascunho": abrirRascunho(); break;
    case "fechar-aula": modalAula = null; try { speechSynthesis.cancel(); } catch (er) { /* */ } render(); window.__voltaFoco?.focus?.(); break;
    case "fechar-aula-fundo": if (e.target === t) { modalAula = null; try { speechSynthesis.cancel(); } catch (er) { /* */ } render(); } break;
    case "aula-play": modalAula.modo = "play"; modalAula.passo = 0; render(); break;
    case "aula-ler": modalAula.modo = "ler"; modalAula.tocando = false; try { speechSynthesis.cancel(); } catch (er) { /* */ } render(); break;
    case "aula-next": modalAula.passo++; render(); break;
    case "aula-prev": modalAula.passo = Math.max(0, modalAula.passo - 1); render(); break;
    case "aula-voz": if (modalAula.tocando) { modalAula.tocando = false; try { speechSynthesis.cancel(); } catch (er) { /* */ } render(); } else { modalAula.tocando = true; render(); narrarPasso(); } break;
    case "pomo-start": { const tf = $("#pomo-tarefa")?.value || ""; iniciarPomo("foco", tf); break; }
    case "pomo-pause": if (S.pomo.pausado != null) { S.pomo.fim = Date.now() + S.pomo.pausado; S.pomo.pausado = null; } else S.pomo.pausado = restante(); salvar(); render(); break;
    case "pomo-skip": S.pomo.fim = Date.now(); S.pomo.pausado = null; terminarPomo(); break;
    case "pomo-stop": S.pomo = null; salvar(); render(); break;
    case "limpar-chat": S.chat = []; salvar(); render(); break;
    case "taf-salvar": { const reg = { data: hoje() }; let algum = false; for (const ex of npor.taf) { const v = $("#taf-" + ex.id).value; if (v !== "") { reg[ex.id] = +v; algum = true; } } if (!algum) { toast("Preencha pelo menos um exercício."); break; } S.taf.push(reg); dia().min += 0; salvar(); toast("Treino salvo."); render(); break; }
    case "copiar": { const ta = $("#exp"); navigator.clipboard?.writeText(ta.value).then(() => toast("Código copiado."), () => { ta.select(); toast("Selecionei o código: copie com Ctrl+C."); }) ?? (ta.select(), toast("Selecionei o código: copie com Ctrl+C.")); break; }
    case "importar": { const txt = $("#imp").value.trim(); try { const s = JSON.parse(txt); if (!s.p || !s.cfg) throw 0; $("#imp-confirm").innerHTML = `<p class="small">Isso vai substituir o progresso deste aparelho.</p><button class="btn pri" data-act="importar-ok">Confirmar importação</button>`; window.__imp = s; } catch (er) { toast("Código inválido. Copie de novo em Exportar."); } break; }
    case "importar-ok": S = { ...PADRAO(), ...window.__imp }; salvar(); toast("Progresso importado."); ir("painel"); break;
    case "reset-ask": $("#reset-zone").innerHTML = `<p class="small">Tem certeza? Não dá para desfazer.</p><div class="row"><button class="btn" data-act="reset-ok" style="border-color:var(--bad);color:var(--bad)">Apagar tudo</button><button class="btn" data-go="backup">Cancelar</button></div>`; break;
    case "reset-ok": S = PADRAO(); salvar(); toast("Progresso apagado."); ir("painel"); break;
  }
});
document.addEventListener("change", (e) => {
  const t = e.target, ds = t.dataset;
  if (ds.f) { const f = window.__filtro; f[ds.f] = t.type === "checkbox" ? t.checked : t.type === "number" ? Math.max(5, Math.min(60, +t.value || 15)) : t.value; if (ds.f === "mat") f.tema = ""; render(); }
  if (ds.hora != null) { S.cfg.horas[+ds.hora] = Math.max(0, +t.value || 0); salvar(); render(); }
  if (ds.data) { if (t.value) { S.cfg.datas[ds.data] = t.value; salvar(); } }
  if (ds.cfg) { S.cfg[ds.cfg] = Math.max(0, +t.value || 0); salvar(); }
  if (ds.pomo) { S.cfg.pomo[ds.pomo] = Math.max(1, +t.value || 1); salvar(); }
  if (ds.bool) { S.cfg[ds.bool] = t.checked; salvar(); }
  if (ds.check) { (S.check ||= {})[ds.check] = t.checked; salvar(); }
  if (t.id === "imp-file" && t.files?.[0]) { const fr = new FileReader(); fr.onload = () => { $("#imp").value = String(fr.result); }; fr.readAsText(t.files[0]); }
});
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.id === "porque") { P().porque[t.dataset.id] = t.value; salvar(); }
  if (t.id === "nota-aula") { P().notas[t.dataset.tema] = t.value; salvar(); }
  if (t.id === "pomo-tarefa" && S.pomo) { S.pomo.tarefa = t.value; salvar(); }
});
document.addEventListener("submit", (e) => { if (e.target.id === "chat-form") { e.preventDefault(); const v = $("#chat-in").value.trim(); if (v) enviarChat(v); } });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalAula) { modalAula = null; try { speechSynthesis.cancel(); } catch (er) { /* */ } render(); window.__voltaFoco?.focus?.(); return; }
  if (rota === "aprender" && ap && ap.etapa >= 3 && ap.etapa <= 5 && !/input|textarea|select/i.test(e.target.tagName)) {
    const k = e.key.toUpperCase();
    if (LETRAS.includes(k) && !ap.q.resp) acaoAprender("ap-alt", { k: LETRAS.indexOf(k) });
    else if (e.key === "Enter" && ap.q.resp) acaoAprender("ap-q-prox", {});
    return;
  }
  if (rota !== "questao" || !sess || /input|textarea|select/i.test(e.target.tagName)) return;
  const k = e.key.toUpperCase();
  if (LETRAS.includes(k)) { responder(LETRAS.indexOf(k)); }
  if (e.key === "Enter" && sess.resp[sess.i] && sess.modo !== "simulado") proxima();
  if (e.key === "Escape" && modalAula) { modalAula = null; render(); }
});
function enviarChat(txt) { S.chat.push({ me: true, txt }); const r = respostaTutor(txt); S.chat.push(r); S.chat = S.chat.slice(-40); salvar(); render(); setTimeout(() => $("#chat-in")?.focus(), 30); }

/* ───────────────────────── modo Aprender: escada do básico ao nível prova */
let ap = null;
const ETAPA_IC = ["play", "ideia", "aula", "pen", "montanha", "trofeu"];
const ETAPAS = [["Assistir", "vídeo no minuto certo"], ["Entender", "a ideia em cartões"], ["Ver resolvido", "passo a passo"], ["Sua vez", "básico, com dica"], ["Subir o nível", "intermediário"], ["Nível prova", "como cai"]];
const segs = (h) => h.split(":").map(Number).reduce((a, b) => a * 60 + b, 0);
const ytLink = (v, ini) => `https://www.youtube.com/watch?v=${VIDEOS[v].id}&t=${segs(ini)}s`;
function durTxt(ini, fim) { if (!fim) return ""; const m = Math.round((segs(fim) - segs(ini)) / 60); return m >= 60 ? `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}` : `${m} min`; }
function trechoHTML(tr, k, tema) {
  const [v, ini, fim, oque] = tr, vid = VIDEOS[v];
  const key = `${tema}|${k}`, visto = !!(P().assistidos || {})[key];
  return `<div class="trecho ${visto ? "visto" : ""}">
    <a class="tr-play" href="${ytLink(v, ini)}" target="_blank" rel="noopener" aria-label="Assistir ${esc(oque)} a partir de ${ini}"><span class="tr-tri" aria-hidden="true"></span><span class="num">${ini}</span></a>
    <div class="tr-info"><b>${esc(oque)}</b><span class="small muted">${esc(vid.canal)} · ${esc(vid.titulo)}${fim ? ` · trecho de ${durTxt(ini, fim)} (até ${fim})` : ""}</span></div>
    <button class="btn sm ${visto ? "" : "ghost"}" data-act="ap-assisti" data-key="${esc(key)}" aria-pressed="${visto}">${visto ? `${I.check} Assistido` : "Marcar assistido"}</button>
  </div>`;
}
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
  if (!r) { toast("Este tema ainda não tem aula."); return; }
  P().vistos[tema] = true; salvar();
  try { speechSynthesis.cancel(); } catch (er) { /* */ }
  ap = { tema, r, etapa: 0, card: 0, travou: false, ex: null, fila: [], qi: 0, q: null, acertos: 0, total: 0, usados: new Set(), extra: 0, log: [] };
  modalAula = null; ir("aprender");
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
  render(); window.scrollTo(0, 0);
}
function parecida(id) {
  if (id.startsWith("g:")) { const gid = id.split(":")[1]; const nid = `g:${gid}:${(Math.random() * 1e9) | 0}`; return Q(nid) ? nid : null; }
  return pegarQ(ap.etapa - 2, 1)[0] || null;
}
function tabHTML(q) { return q.tabela ? `<div class="tbl-wrap"><table class="tbl"><thead><tr>${q.tabela.cabecalho.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${q.tabela.linhas.map((l) => `<tr>${l.map((c) => `<td class="num">${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""; }
function escadaHTML() {
  return `<ol class="escada" aria-label="Etapas da aula">${ETAPAS.map(([n, d], i) => `<li class="${i < ap.etapa ? "feito" : i === ap.etapa ? "agora" : ""}" style="--i:${i}"><button data-act="ap-ir" data-etapa="${i}" ${i === ap.etapa ? 'aria-current="step"' : ""}><span class="degrau">${i < ap.etapa ? I.check : I[ETAPA_IC[i]]}</span><span class="en">${n}</span><span class="ed">${d}</span></button></li>`).join("")}</ol>`;
}
function altsHTML(q, resp, acao) {
  return q.alternativas.map((a, k) => {
    let cls = ""; if (resp) { if (k === q.correta) cls = "ok"; else if (k === resp.esc) cls = "bad"; }
    const why = resp && k === resp.esc && !resp.ok && q.erros?.[k] ? `<span class="why">${esc(q.erros[k])}</span>` : "";
    return `<button class="alt ${cls}" ${acao ? `data-act="${acao}" data-k="${k}"` : ""} ${resp || !acao ? "disabled" : ""} aria-label="Alternativa ${LETRAS[k]}: ${esc(a)}"><span class="bub">${LETRAS[k]}</span><span>${esc(a)}</span>${why}</button>`;
  }).join("");
}
function telaAprender() {
  if (!ap) return telaTrilha();
  const o = S.obj, { tema, r, etapa } = ap;
  const mid = TEMA_MAT[o][tema];
  const trechos = TRECHOS[tema] || [];
  let corpo = "";
  if (etapa === 0) {
    const base = trechos.map((t, k) => [t, k]).filter(([t]) => t[4] === 1), fundo = trechos.map((t, k) => [t, k]).filter(([t]) => t[4] !== 1);
    const busca = `https://www.youtube.com/results?search_query=${encodeURIComponent(tema + " " + (o === "concurso" ? "concurso aula" : o === "npor" ? "aula" : "ENEM aula"))}`;
    corpo = `<section class="card">
      <h2>Assista primeiro</h2>
      ${trechos.length ? `<p class="small muted">Cada botão abre o vídeo gratuito no YouTube já no minuto em que o assunto começa. Assista com o caderno aberto, pause e copie os exemplos. Depois volte aqui para praticar.</p>
      ${base.length ? `<div class="eyebrow">Se está começando do zero</div><div class="stack">${base.map(([t, k]) => trechoHTML(t, k, tema)).join("")}</div>` : ""}
      ${fundo.length ? `<div class="eyebrow">${base.length ? "Se já sabe o básico" : "Aula do tema"}</div><div class="stack">${fundo.map(([t, k]) => trechoHTML(t, k, tema)).join("")}</div>` : ""}`
      : `<p class="small muted">Ainda não tenho um trecho com minuto conferido para este tema. A busca abaixo lista as aulas do YouTube; prefira professores conhecidos e vídeos recentes.</p><a class="btn" href="${busca}" target="_blank" rel="noopener">Buscar videoaula de ${esc(tema)}</a>`}
      ${r.lei ? `<a class="btn sm" href="${esc(r.lei)}" target="_blank" rel="noopener">Ler o texto oficial da lei</a>` : ""}
    </section>
    <div class="row between"><span class="small muted">Sem tempo para vídeo? Os cartões a seguir resumem o essencial.</span><button class="btn pri" data-act="ap-prox">${trechos.length ? "Já assisti, vamos entender" : "Ir para a explicação"}</button></div>`;
  } else if (etapa === 1) {
    const cards = [...r.t, `O que mais cai: ${r.cai}`];
    const ult = ap.card >= cards.length - 1;
    const base = trechos.find((t) => t[4] === 1) || trechos[0];
    const temQ = BANCO[o].some((q) => q.tema === tema) || genDoObj[o].some((g) => g.tema === tema);
    corpo = `<section class="card ideia">
      <div class="row between small"><span class="eyebrow">Cartão ${ap.card + 1} de ${cards.length}</span><button class="btn ghost sm" data-act="ap-falar">${I.sound} Ouvir</button></div>
      <div class="bar"><i style="width:${pct(ap.card + 1, cards.length)}%"></i></div>
      <p class="ideia-txt" aria-live="polite">${esc(cards[ap.card])}</p>
      ${ap.travou ? `<div class="macete"><b>Outro jeito de ver:</b> ${esc(r.macete)}${base ? `<br><a class="btn sm" style="margin-top:8px" href="${ytLink(base[0], base[1])}" target="_blank" rel="noopener">Ver a explicação em vídeo a partir de ${base[1]}</a>` : ""}</div>` : ""}
      ${ult ? `<div class="macete"><b>Macete:</b> ${esc(r.macete)}</div>
      <label class="f">Explique com as suas palavras, como se fosse ensinar alguém<textarea id="nota-aula" data-tema="${esc(tema)}" placeholder="Se você consegue explicar, você aprendeu.">${esc(P().notas[tema] || "")}</textarea></label>` : ""}
      <div class="row between"><button class="btn" data-act="ap-card-voltar" ${ap.card ? "" : "disabled"}>Voltar</button>
      ${ap.travou || ult ? "" : `<button class="btn" data-act="ap-card-nao">Não entendi</button>`}
      <button class="btn pri" data-act="${ult ? "ap-prox" : "ap-card-ok"}">${ult ? (temQ ? "Ver um exemplo resolvido" : "Concluir aula") : "Entendi, próximo"}</button></div>
    </section>`;
  } else if (etapa === 2) {
    const q = Q(ap.ex.id), passos = q.passos || [];
    const tudo = passos.length ? ap.ex.mostrados >= passos.length : ap.ex.mostrados >= 1;
    corpo = `<section class="card">
      <div class="row between"><span class="eyebrow">Exemplo resolvido</span><button class="btn ghost sm" data-act="ap-novo-ex">Outro exemplo</button></div>
      <p class="q-text">${esc(q.enunciado)}</p>${tabHTML(q)}${figuraHTML(q.figura)}
      ${passos.length ? `<ol class="steps reveal">${passos.slice(0, ap.ex.mostrados).map((s) => `<li><span>${esc(s)}</span></li>`).join("")}</ol>
        ${tudo ? `<div role="status" class="verdict ok">Resposta: ${esc(q.alternativas[q.correta])}</div>${q.macete ? `<div class="macete"><b>Macete:</b> ${esc(q.macete)}</div>` : ""}` : `<div class="pense"><span>${ap.ex.mostrados ? "Antes de ver: qual é o próximo passo? Pense ou rabisque." : "Antes de ver: por onde você começaria?"}</span><button class="btn pri" data-act="ap-passo">Mostrar passo ${ap.ex.mostrados + 1} de ${passos.length}</button></div>`}`
      : `<div class="alts">${altsHTML(q, tudo ? { esc: q.correta, ok: true } : null, null)}</div>
        ${tudo ? `<div class="macete"><b>Por quê:</b> ${esc(q.explicacao)}</div>` : `<div class="pense"><span>Escolha mentalmente uma alternativa e justifique.</span><button class="btn pri" data-act="ap-passo">Ver resposta comentada</button></div>`}`}
    </section>
    ${tudo ? `<div class="row between"><button class="btn" data-act="rascunho">${I.pen} Rascunho</button><button class="btn pri" data-act="ap-prox">Agora é sua vez</button></div>` : ""}`;
  } else if (etapa >= 3 && etapa <= 5) {
    const id = ap.fila[ap.qi], q = Q(id), resp = ap.q.resp;
    const dica = q.passos?.[0] || r.macete;
    corpo = `<section class="card">
      <div class="row between"><span class="eyebrow">Questão ${ap.qi + 1} de ${ap.fila.length} · ${NIVEL_TXT[etapa - 2]}</span><button class="btn ghost sm" data-act="rascunho">${I.pen} Rascunho</button></div>
      <p class="q-text">${esc(q.enunciado)}</p>${tabHTML(q)}${figuraHTML(q.figura)}
      <div class="alts">${altsHTML(q, resp, "ap-alt")}</div>
      ${!resp ? (ap.q.dica ? `<div class="macete"><b>Dica:</b> ${esc(dica)}</div>` : etapa < 5 ? `<button class="btn ghost sm" data-act="ap-dica">Quero uma dica</button>` : `<p class="small muted">No nível prova não tem dica. Respire e confie no que você viu.</p>`) : ""}
      ${resp ? `<div role="status" class="verdict ${resp.ok ? "ok" : "bad"}">${resp.ok ? "Acertou!" : `Ainda não. A certa é a ${LETRAS[q.correta]}.`}</div>
        <p class="small">${esc(q.explicacao)}</p>
        ${q.passos?.length && !resp.ok ? `<ol class="steps">${q.passos.map((s) => `<li><span>${esc(s)}</span></li>`).join("")}</ol>` : ""}
        ${!resp.ok && etapa < 5 && ap.extra < 2 ? `<p class="small muted">Vem outra parecida antes de subir de nível.</p>` : ""}
        <button class="btn pri" data-act="ap-q-prox">Continuar</button>` : ""}
    </section>`;
  } else {
    const p = ap.total ? Math.round((ap.acertos / ap.total) * 100) : null;
    const lista = TEMAS_MAT[o][mid] || [];
    const prox = lista[lista.indexOf(tema) + 1] || proximaFase(o);
    corpo = `<section class="card fim-aula">
      <span class="eyebrow">Aula concluída · +25 XP</span>
      <h2>${p == null ? "Leitura feita" : p >= 80 ? "Você aprendeu este tema" : p >= 50 ? "Quase lá" : "Primeiro contato feito"}</h2>
      ${p == null ? `<p class="muted">Este tema não tem questões no app. Pratique escrevendo um texto ou resumo sobre ele.</p>` : `<p><b class="num" style="font-size:1.8rem">${ap.acertos}/${ap.total}</b> <span class="muted">acertos subindo do básico ao nível prova (${p}%).</span></p>
      <p class="small muted">${p >= 80 ? "As questões erradas voltam sozinhas na Revisão em 1, 3, 7 e 15 dias." : "Normal no começo. Reveja os cartões ou o trecho do vídeo e refaça amanhã: os erros já entraram na Revisão."}</p>`}
      <div class="grid2">
        ${prox && prox !== tema ? `<button class="btn pri" data-act="aprender" data-tema="${esc(prox)}">Próximo tema: ${esc(prox)}</button>` : ""}
        ${p != null ? `<button class="btn" data-act="treinar-tema" data-tema="${esc(tema)}">Treinar mais 10 deste tema</button>` : ""}
        <button class="btn" data-act="ap-ir" data-etapa="1">Rever os cartões</button>
        <button class="btn ghost" data-go="trilha">Voltar à trilha</button>
      </div>
    </section>`;
  }
  return `<div class="wrap aprender">
    <div><button class="btn ghost sm" data-act="ap-sair">‹ Trilha</button><span class="eyebrow" style="display:block;margin-top:8px">Aprender · ${esc(matNome(o, mid))}</span><h1>${esc(tema)}</h1></div>
    ${escadaHTML()}
    ${corpo}
  </div>`;
}
function acaoAprender(act, ds, t) {
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
      if (ap.q.resp) return true;
      const id = ap.fila[ap.qi], q = Q(id), k = +ds.k, ok = k === q.correta;
      ap.q.resp = { esc: k, ok }; ap.total++; if (ok) ap.acertos++; ap.usados.add(id);
      registrar(S.obj, id, q, ok, Date.now() - ap.q.t0); render(); return true;
    }
    case "ap-q-prox": {
      const id = ap.fila[ap.qi];
      if (!ap.q.resp.ok && ap.etapa < 5 && ap.extra < 2) { const n = parecida(id); if (n) { ap.fila.splice(ap.qi + 1, 0, n); ap.extra++; } }
      ap.qi++;
      if (ap.qi >= ap.fila.length) entrarEtapa(ap.etapa + 1);
      else { ap.q = { resp: null, dica: false, t0: Date.now() }; render(); window.scrollTo(0, 0); }
      return true;
    }
  }
  return false;
}

/* início */
const h0 = location.hash.slice(1);
if (ROTAS_VALIDAS.includes(h0) && !["questao", "resultado", "cards", "aprender"].includes(h0)) rota = h0;
if (S.pomo) { if (S.pomo.tipo !== "pronto" && S.pomo.pausado == null && S.pomo.fim < Date.now()) S.pomo = null; else ligarTick(); }
setInterval(() => { if (sess && sess.modo === "simulado" && !sess.terminou && rota === "questao") { const el = $("#sim-timer"); if (el) el.textContent = mmss(Math.max(0, sess.fim - Date.now())); if (Date.now() >= sess.fim) { toast("Tempo esgotado. Simulado entregue."); finalizar(); } } }, 1000);
render();
