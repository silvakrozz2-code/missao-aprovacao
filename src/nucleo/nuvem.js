/* Sincronização do progresso na nuvem (Firebase / Firestore).
   App privado de um usuário só: o progresso vive num documento fixo
   (usuarios/principal) para seguir a pessoa entre o PC e o celular.
   O login anônimo serve só para passar pelas regras do Firestore.
   Tudo é carregado sob demanda (chunk separado) e qualquer falha cai
   de volta no localStorage, sem quebrar o app. */
import { getS, setS, PADRAO, registrarSync } from "./nucleo.js";

const CONFIG = {
  apiKey: "AIzaSyAbdgHBeI67XKlRjsy8h5S8rPYcwjk6x10",
  authDomain: "movimento-demo-ao-vivo.firebaseapp.com",
  projectId: "movimento-demo-ao-vivo",
  storageBucket: "movimento-demo-ao-vivo.firebasestorage.app",
  messagingSenderId: "983455542377",
  appId: "1:983455542377:web:7c0a8fa8b45ecd455606f8",
};
const MARCA = "missao-aprovacao-sync"; // guarda localmente o atualizadoEm da última escrita

let refDoc = null;
let aplicando = false; // true enquanto adotamos o remoto (evita eco do push)
let timer = null;      // debounce do push
let ultimaMarca = lerMarca();

function lerMarca() { try { return Number(localStorage.getItem(MARCA)) || 0; } catch { return 0; } }
function gravarMarca(t) { try { localStorage.setItem(MARCA, String(t)); } catch { /* ignora */ } ultimaMarca = t; }

/* mescla um estado remoto sobre o padrão, igual ao carregar() do núcleo */
function normalizar(s) {
  const base = PADRAO();
  return {
    ...base, ...s,
    cfg: { ...base.cfg, ...s.cfg, datas: { ...base.cfg.datas, ...(s.cfg?.datas || {}) }, pomo: { ...base.cfg.pomo, ...(s.cfg?.pomo || {}) } },
    p: { ...base.p, ...s.p },
  };
}

/* quão "cheio" está um estado — decide o primeiro encontro quando não há marca de tempo */
function peso(s) {
  if (!s) return 0;
  let n = (s.xp || 0) + Object.keys(s.dias || {}).length * 10;
  for (const o of ["concurso", "npor", "enem"]) n += Object.keys(s.p?.[o]?.resp || {}).length;
  return n;
}

function adotar(estado) {
  aplicando = true;
  try { setS(normalizar(estado)); } finally { aplicando = false; }
}

async function empurrar(estado) {
  if (!refDoc) return;
  const { setDoc } = await import("firebase/firestore");
  const limpo = JSON.parse(JSON.stringify(estado)); // tira undefined/funções que o Firestore recusa
  const t = Date.now();
  await setDoc(refDoc, { estado: limpo, atualizadoEm: t });
  gravarMarca(t);
}

function agendarPush() {
  if (!refDoc || aplicando) return;
  clearTimeout(timer);
  timer = setTimeout(() => { empurrar(getS()).catch((e) => console.warn("[nuvem] push falhou", e?.code || e)); }, 1500);
}

export async function iniciarNuvem() {
  try {
    const { initializeApp } = await import("firebase/app");
    const { getAuth, signInAnonymously, onAuthStateChanged } = await import("firebase/auth");
    const { getFirestore, doc, getDoc, onSnapshot } = await import("firebase/firestore");

    const app = initializeApp(CONFIG);
    const auth = getAuth(app);
    const db = getFirestore(app);

    await new Promise((resolve) => {
      onAuthStateChanged(auth, (u) => { if (u) resolve(); });
      signInAnonymously(auth).catch((e) => { console.warn("[nuvem] login anônimo falhou", e?.code || e); resolve(); });
    });

    refDoc = doc(db, "usuarios", "principal");

    /* 1) primeiro encontro: adota o mais recente entre remoto e local */
    try {
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        const d = snap.data();
        const remotoMaisNovo = (d.atualizadoEm || 0) > ultimaMarca || (ultimaMarca === 0 && peso(d.estado) > peso(getS()));
        if (remotoMaisNovo && d.estado) { adotar(d.estado); gravarMarca(d.atualizadoEm || Date.now()); }
        else await empurrar(getS()); // local é igual ou mais novo: semeia/atualiza o remoto
      } else {
        await empurrar(getS()); // documento ainda não existe: semeia com o local
      }
    } catch (e) { console.warn("[nuvem] leitura inicial falhou", e?.code || e); }

    /* 2) escuta mudanças vindas de outro aparelho */
    onSnapshot(refDoc, (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      if ((d.atualizadoEm || 0) > ultimaMarca && d.estado) { gravarMarca(d.atualizadoEm); adotar(d.estado); }
    }, (e) => console.warn("[nuvem] onSnapshot", e?.code || e));

    /* 3) todo salvar() local agenda um push com debounce */
    registrarSync(agendarPush);
  } catch (e) {
    console.warn("[nuvem] indisponível, seguindo só com o localStorage", e?.code || e);
  }
}
