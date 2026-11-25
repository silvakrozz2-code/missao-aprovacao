// Escada do edital em 3D (Three.js). Carrega sob demanda; sem WebGL fica o desenho em SVG.
import { useEffect, useRef, useState } from "react";

function EscadaSVG({ degrau }) {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => { const h = 24 + i * 20; return <rect key={i} x={20 + i * 46} y={170 - h} width="44" height={h} rx="3" fill={i < degrau ? "color-mix(in srgb, var(--acc) 45%, var(--folha))" : i === degrau ? "var(--acc)" : "var(--folha-3)"} stroke="var(--giz)" strokeOpacity=".5" />; })}
    </svg>
  );
}

export default function Escada3D({ degrau = 0, cor = "#8cc4ff", giz = "#eef0e8" }) {
  const ref = useRef(null);
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const tc = document.createElement("canvas");
    if (!(tc.getContext("webgl2") || tc.getContext("webgl"))) return;
    let vivo = true, limpar = () => {};
    import("three").then((T) => {
      if (!vivo) return;
      const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const W = () => el.clientWidth || 320, H = () => el.clientHeight || 220;
      const ren = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      ren.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); ren.setSize(W(), H());
      const cena = new T.Scene(), cam = new T.PerspectiveCamera(34, W() / H(), .1, 100);
      const longe = W() / H() < 1.4 ? 1.12 : 1; cam.position.set(5.6 * longe, 4.4 * longe, 8.2 * longe); cam.lookAt(0, 1.5, 0);
      cena.add(new T.AmbientLight(0xffffff, .55)); const luz = new T.DirectionalLight(0xffffff, 1.1); luz.position.set(4, 8, 6); cena.add(luz);
      const g = new T.Group(); cena.add(g);
      const cA = new T.Color(cor), cG = new T.Color(giz);
      for (let i = 0; i < 6; i++) {
        const h = .5 + i * .55, geo = new T.BoxGeometry(1.1, h, 2.2), feito = i < degrau, agora = i === degrau;
        const m = new T.Mesh(geo, new T.MeshStandardMaterial({ color: agora ? cA : feito ? cA.clone().multiplyScalar(.45) : new T.Color(0x34443b), roughness: .9, transparent: !feito && !agora, opacity: feito || agora ? 1 : .85 }));
        m.position.set(-3.3 + i * 1.12, h / 2, 0); g.add(m);
        const ar = new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color: feito ? cA : cG, transparent: true, opacity: agora ? 1 : .7 }));
        ar.position.copy(m.position); g.add(ar);
      }
      const hA = .5 + degrau * .55;
      const marca = new T.Mesh(new T.OctahedronGeometry(.4), new T.MeshStandardMaterial({ color: cG, emissive: cA, emissiveIntensity: .35, roughness: .4 }));
      marca.position.set(-3.3 + degrau * 1.12, hA + .7, 0); g.add(marca);
      const mastro = new T.Mesh(new T.CylinderGeometry(.03, .03, 1.2), new T.MeshStandardMaterial({ color: cG }));
      mastro.position.set(-3.3 + 5 * 1.12, .5 + 5 * .55 + .6, -.7); g.add(mastro);
      const band = new T.Mesh(new T.PlaneGeometry(.6, .38), new T.MeshStandardMaterial({ color: 0xf5d76e, side: T.DoubleSide }));
      band.position.set(mastro.position.x + .3, mastro.position.y + .38, -.7); g.add(band);
      ren.domElement.setAttribute("aria-hidden", "true"); ren.domElement.className = "block h-full w-full";
      el.appendChild(ren.domElement); setPronto(true);
      let alvo = -.35, rot = -.35, arr = false, x0 = 0, vis = true, raf = 0;
      const cv = ren.domElement;
      cv.addEventListener("pointerdown", (e) => { arr = true; x0 = e.clientX; cv.setPointerCapture(e.pointerId); });
      cv.addEventListener("pointermove", (e) => { if (!arr) return; alvo = Math.max(-1.2, Math.min(.6, alvo + (e.clientX - x0) * .008)); x0 = e.clientX; if (reduz) des(0); });
      cv.addEventListener("pointerup", () => { arr = false; });
      const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; if (vis && !reduz) laco(); }); io.observe(el);
      const ro = new ResizeObserver(() => { ren.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); des(performance.now()); }); ro.observe(el);
      function des(t) { rot += (alvo - rot) * .12; g.rotation.y = rot + (reduz || arr ? 0 : Math.sin(t / 2600) * .12); marca.rotation.y = t / 900; marca.position.y = hA + .7 + (reduz ? 0 : Math.sin(t / 420) * .08); band.rotation.y = reduz ? 0 : Math.sin(t / 500) * .25; ren.render(cena, cam); }
      function laco() { cancelAnimationFrame(raf); const f = (t) => { if (!vis || document.hidden || !vivo) return; des(t); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); }
      des(0); if (!reduz) laco();
      limpar = () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); ren.dispose(); cv.remove(); };
    }).catch(() => {});
    return () => { vivo = false; limpar(); };
  }, [degrau, cor, giz]);
  return (
    <div ref={ref} className="relative h-full w-full cursor-grab touch-pan-y" title="Arraste para girar">
      {!pronto && <EscadaSVG degrau={degrau} />}
    </div>
  );
}
