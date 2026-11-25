// Cena 3D do painel: a escada do edital (6 degraus) desenhada a giz.
// three.js é carregado sob demanda (jsDelivr, versão fixa). Sem internet ou sem WebGL,
// fica a ilustração SVG que já está no HTML.
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";
let threeP = null;
const carregar = () => (threeP ||= import(/* @vite-ignore */ THREE_URL));
let atual = null;

export function escadaSVG(degrau) {
  const d = [];
  for (let i = 0; i < 6; i++) {
    const x = 20 + i * 46, h = 24 + i * 20, y = 170 - h;
    d.push(`<rect x="${x}" y="${y}" width="44" height="${h}" rx="2" class="${i < degrau ? "f" : i === degrau ? "a" : ""}"/>`);
  }
  const mx = 20 + degrau * 46 + 22, my = 170 - (24 + degrau * 20) - 22;
  return `<svg class="escada-svg" viewBox="0 0 320 180" aria-hidden="true">${d.join("")}<path d="M${mx} ${my - 12} l10 10 l-10 10 l-10 -10z" class="m"/></svg>`;
}

export function montarCena(el, { cor = "#8cc4ff", giz = "#eef0e8", degrau = 0 } = {}) {
  desmontarCena();
  if (!el) return;
  const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const teste = document.createElement("canvas");
  if (!(teste.getContext("webgl2") || teste.getContext("webgl"))) return;
  const token = {};
  atual = token;
  carregar().then((T) => {
    if (atual !== token || !el.isConnected) return;
    const W = () => el.clientWidth || 320, H = () => el.clientHeight || 220;
    const ren = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    ren.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    ren.setSize(W(), H());
    const cena = new T.Scene();
    const cam = new T.PerspectiveCamera(34, W() / H(), 0.1, 100);
    const longe = W() / H() < 1.4 ? 1.12 : 1; cam.position.set(5.6 * longe, 4.4 * longe, 8.2 * longe); cam.lookAt(0, 1.5, 0);
    cena.add(new T.AmbientLight(0xffffff, 0.55));
    const luz = new T.DirectionalLight(0xffffff, 1.1); luz.position.set(4, 8, 6); cena.add(luz);
    const grupo = new T.Group(); cena.add(grupo);
    const cAcc = new T.Color(cor), cGiz = new T.Color(giz);
    for (let i = 0; i < 6; i++) {
      const h = 0.5 + i * 0.55;
      const geo = new T.BoxGeometry(1.1, h, 2.2);
      const feito = i < degrau, agora = i === degrau;
      const mat = new T.MeshStandardMaterial({ color: agora ? cAcc : feito ? cAcc.clone().multiplyScalar(0.45) : new T.Color(0x34443b), roughness: 0.9, metalness: 0, transparent: !feito && !agora, opacity: feito || agora ? 1 : 0.85 });
      const bloco = new T.Mesh(geo, mat);
      bloco.position.set(-3.3 + i * 1.12, h / 2, 0);
      grupo.add(bloco);
      const arestas = new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color: agora ? cGiz : feito ? cAcc : cGiz, transparent: true, opacity: agora ? 1 : 0.7 }));
      arestas.position.copy(bloco.position);
      grupo.add(arestas);
    }
    // marcador "você está aqui"
    const hAqui = 0.5 + degrau * 0.55;
    const marca = new T.Mesh(new T.OctahedronGeometry(0.4), new T.MeshStandardMaterial({ color: cGiz, emissive: cAcc, emissiveIntensity: 0.35, roughness: 0.4 }));
    marca.position.set(-3.3 + degrau * 1.12, hAqui + 0.7, 0);
    grupo.add(marca);
    // bandeira no topo (aprovação)
    const mastro = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1.2), new T.MeshStandardMaterial({ color: cGiz }));
    mastro.position.set(-3.3 + 5 * 1.12, 0.5 + 5 * 0.55 + 0.6, -0.7); grupo.add(mastro);
    const bandeira = new T.Mesh(new T.PlaneGeometry(0.6, 0.38), new T.MeshStandardMaterial({ color: 0xf5d76e, side: T.DoubleSide }));
    bandeira.position.set(mastro.position.x + 0.3, mastro.position.y + 0.38, -0.7); grupo.add(bandeira);

    el.querySelector(".escada-svg")?.remove();
    ren.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(ren.domElement);

    let rotAlvo = -0.35, rot = -0.35, arrastando = false, x0 = 0, visivel = true, raf = 0;
    const cv = ren.domElement;
    cv.addEventListener("pointerdown", (e) => { arrastando = true; x0 = e.clientX; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => { if (!arrastando) return; rotAlvo += (e.clientX - x0) * 0.008; rotAlvo = Math.max(-1.2, Math.min(0.6, rotAlvo)); x0 = e.clientX; if (reduzido) desenhar(0); });
    cv.addEventListener("pointerup", () => { arrastando = false; });
    const io = new IntersectionObserver(([en]) => { visivel = en.isIntersecting; if (visivel && !reduzido) laco(); });
    io.observe(el);
    const ro = new ResizeObserver(() => { ren.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); desenhar(performance.now()); });
    ro.observe(el);
    function desenhar(t) {
      rot += (rotAlvo - rot) * 0.12; // mola amortecida, interrompível pelo arraste
      grupo.rotation.y = rot + (reduzido || arrastando ? 0 : Math.sin(t / 2600) * 0.12);
      marca.rotation.y = t / 900; marca.position.y = hAqui + 0.7 + (reduzido ? 0 : Math.sin(t / 420) * 0.08);
      bandeira.rotation.y = reduzido ? 0 : Math.sin(t / 500) * 0.25;
      ren.render(cena, cam);
    }
    function laco() { cancelAnimationFrame(raf); const f = (t) => { if (!visivel || document.hidden || atual !== token) return; desenhar(t); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); }
    desenhar(0);
    if (!reduzido) laco();
    token.fim = () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); ren.dispose(); };
  }).catch(() => { /* sem rede: fica o SVG */ });
}
export function desmontarCena() { if (atual?.fim) atual.fim(); atual = null; }
