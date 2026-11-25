import { useMemo, useRef, useState } from "react";
import { Palco, useArrastar, Alca, Toque, Deslizar, Leituras, Experimento, fmt } from "./base.jsx";

const U = 20; // 20 px do quadro = 1 cm
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) / U;
const angulo = (p, q, r) => { const a = [q[0] - p[0], q[1] - p[1]], b = [r[0] - p[0], r[1] - p[1]]; return (Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b))))) * 180) / Math.PI; };
const snap = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v / U) * U));
const quase = (x, y, t = .05) => Math.abs(x - y) < t;
const COR = { A: "#8cc4ff", B: "#c8dd6e", C: "#ffad7a" };

function Arco({ p, q, r, ang, cor, onToque, nome }) {
  const R = 24; const u = (s) => { const v = [s[0] - p[0], s[1] - p[1]]; const k = Math.hypot(...v); return [v[0] / k, v[1] / k]; };
  const a = u(q), b = u(r);
  if (quase(ang, 90, .6)) { const s = 14; const c1 = [p[0] + a[0] * s, p[1] + a[1] * s], c2 = [p[0] + b[0] * s, p[1] + b[1] * s], c3 = [c1[0] + b[0] * s, c1[1] + b[1] * s];
    return <Toque label={`Ângulo ${nome}: 90 graus`} onToque={onToque}><path d={`M${c1} L${c3} L${c2}`} fill={cor} fillOpacity=".18" stroke={cor} strokeWidth="2" /></Toque>; }
  const s = [p[0] + a[0] * R, p[1] + a[1] * R], e = [p[0] + b[0] * R, p[1] + b[1] * R];
  const cruz = a[0] * b[1] - a[1] * b[0];
  return <Toque label={`Ângulo ${nome}: ${fmt(ang, 0)} graus`} onToque={onToque}><path d={`M${p} L${s} A${R} ${R} 0 0 ${cruz > 0 ? 1 : 0} ${e} Z`} fill={cor} fillOpacity=".18" stroke={cor} strokeWidth="2" /></Toque>;
}

/* ───────── Triângulo: arraste os vértices */
export function Triangulo() {
  const W = 360, H = 260; const svg = useRef(null);
  const [P, setP] = useState({ A: [60, 220], B: [300, 220], C: [140, 60] });
  const [foco, setFoco] = useState("inicio");
  const mover = (id, [x, y]) => setP((o) => ({ ...o, [id]: [snap(x, U, W - U), snap(y, U, H - U)] }));
  const begin = useArrastar(svg, mover);
  const { A, B, C } = P;
  const m = useMemo(() => {
    const a = dist(B, C), b = dist(C, A), c = dist(A, B);
    const angA = angulo(A, B, C), angB = angulo(B, C, A), angC = 180 - angA - angB;
    const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2 / (U * U);
    const t = ((C[0] - A[0]) * (B[0] - A[0]) + (C[1] - A[1]) * (B[1] - A[1])) / ((B[0] - A[0]) ** 2 + (B[1] - A[1]) ** 2);
    const pe = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]; const h = dist(C, pe);
    const lados = quase(a, b) && quase(b, c) ? "equilátero" : quase(a, b) || quase(b, c) || quase(a, c) ? "isósceles" : "escaleno";
    const angs = [angA, angB, angC]; const reto = angs.findIndex((x) => quase(x, 90, .6));
    const tipoAng = reto >= 0 ? "retângulo" : Math.max(...angs) > 90 ? "obtusângulo" : "acutângulo";
    return { a, b, c, angA, angB, angC, area, h, pe, lados, tipoAng, reto, per: a + b + c, dentro: t >= 0 && t <= 1 };
  }, [A, B, C]);

  const falas = {
    inicio: { titulo: "Mexa no triângulo", txt: "Arraste as bolinhas A, B e C. Depois toque num lado, num ângulo ou dentro do triângulo para eu explicar aquela parte com os números da tela.", dica: "puxe o C para cima e veja a área crescer." },
    A: { titulo: `Ângulo Â = ${fmt(m.angA, 0)}°`, txt: `É a abertura no vértice A, entre os lados AB e AC. Os três ângulos de qualquer triângulo somam sempre 180°.`, conta: `${fmt(m.angA, 0)}° + ${fmt(m.angB, 0)}° + ${fmt(m.angC, 0)}° = 180°`, dica: "aumente um ângulo e repare que outro diminui para a soma continuar 180°." },
    B: { titulo: `Ângulo B̂ = ${fmt(m.angB, 0)}°`, txt: "Ângulo no vértice B. Se ele passar de 90°, o triângulo vira obtusângulo; se ficar exatamente 90°, vira retângulo.", conta: `180° − ${fmt(m.angA, 0)}° − ${fmt(m.angC, 0)}° = ${fmt(m.angB, 0)}°`, dica: "deixe B̂ com 90°: aparece o quadradinho de ângulo reto." },
    C: { titulo: `Ângulo Ĉ = ${fmt(m.angC, 0)}°`, txt: "Ângulo no vértice C, oposto ao lado AB. O maior ângulo sempre fica de frente para o maior lado.", conta: `maior lado: ${[["BC", m.a], ["AC", m.b], ["AB", m.c]].sort((x, y) => y[1] - x[1])[0][0]} · maior ângulo: ${[["Â", m.angA], ["B̂", m.angB], ["Ĉ", m.angC]].sort((x, y) => y[1] - x[1])[0][0]}` },
    lados: { titulo: `Lados: ${fmt(m.c)} · ${fmt(m.a)} · ${fmt(m.b)} cm`, txt: `Este triângulo é ${m.lados}. Equilátero tem 3 lados iguais, isósceles tem 2, escaleno tem todos diferentes. Para existir triângulo, cada lado precisa ser menor que a soma dos outros dois.`, conta: `${fmt(m.c)} < ${fmt(m.a)} + ${fmt(m.b)} ✓`, dica: "deixe dois lados iguais para formar um isósceles." },
    area: { titulo: `Área = ${fmt(m.area)} cm²`, txt: `Área do triângulo é base vezes altura dividido por 2. A base é AB e a altura é a linha tracejada que sai de C e cai reta (a 90°) sobre a base${m.dentro ? "" : ", aqui ela cai no prolongamento da base"}.`, conta: `(${fmt(m.c)} × ${fmt(m.h)}) ÷ 2 = ${fmt(m.area)} cm²`, dica: "mova só o C na horizontal: a altura não muda, então a área também não!" },
    altura: { titulo: `Altura = ${fmt(m.h)} cm`, txt: "A altura é a distância do vértice C até a reta da base, sempre medida na perpendicular (formando 90°). Não é o lado inclinado.", conta: `h = 2 × Área ÷ base = 2 × ${fmt(m.area)} ÷ ${fmt(m.c)} = ${fmt(m.h)}` },
    perimetro: { titulo: `Perímetro = ${fmt(m.per)} cm`, txt: "Perímetro é o contorno: some os três lados. Cuidado na prova: perímetro é em cm, área é em cm².", conta: `${fmt(m.c)} + ${fmt(m.a)} + ${fmt(m.b)} = ${fmt(m.per)} cm` },
    pitagoras: m.reto >= 0 ? (() => { const hip = [m.a, m.b, m.c].sort((x, y) => y - x); return { titulo: "Teorema de Pitágoras", txt: "Com um ângulo de 90°, o lado de frente para ele é a hipotenusa (o maior). O quadrado dela é igual à soma dos quadrados dos catetos.", conta: `${fmt(hip[0])}² = ${fmt(hip[1])}² + ${fmt(hip[2])}²  →  ${fmt(hip[0] ** 2)} ≈ ${fmt(hip[1] ** 2 + hip[2] ** 2)}`, dica: "tente o clássico 3, 4 e 5: A em (0,0), B 4 quadradinhos à direita e C 3 acima de A." }; })()
      : { titulo: "Pitágoras só no retângulo", txt: "O teorema a² = b² + c² vale apenas quando um dos ângulos mede 90°. Arraste um vértice até aparecer o quadradinho de ângulo reto.", dica: "alinhe C exatamente acima de A." },
  };
  const fala = falas[foco] || falas.inicio;
  const missoes = [
    { txt: "Forme um triângulo retângulo (um ângulo de 90°)", ok: m.reto >= 0 },
    { txt: "Forme um isósceles (dois lados iguais)", ok: m.lados !== "escaleno" },
    { txt: "Deixe a área em exatamente 12 cm²", ok: quase(m.area, 12, .01) },
    { txt: "Forme um obtusângulo (um ângulo maior que 90°)", ok: m.tipoAng === "obtusângulo" },
  ];
  const meio = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const ladoTxt = (p, q, v) => { const c = meio(p, q); return <text x={c[0] + 6} y={c[1] - 6} fill="#eef0e8" fontSize="15">{fmt(v)}</text>; };
  return (
    <Experimento
      palco={<Palco svgRef={svg} w={W} h={H} label={`Triângulo ${m.lados} e ${m.tipoAng}, área ${fmt(m.area)} centímetros quadrados`}>
        <Toque label={`Área do triângulo: ${fmt(m.area)} centímetros quadrados`} onToque={() => setFoco("area")}>
          <polygon points={`${A} ${B} ${C}`} fill="#8cc4ff" fillOpacity=".08" />
        </Toque>
        <line x1={C[0]} y1={C[1]} x2={m.pe[0]} y2={m.pe[1]} stroke="#f5d76e" strokeWidth="2" strokeDasharray="5 5" />
        {!m.dentro && <line x1={A[0]} y1={A[1]} x2={m.pe[0]} y2={m.pe[1]} stroke="#eef0e8" strokeOpacity=".3" strokeDasharray="3 6" />}
        <Toque label={`Altura: ${fmt(m.h)} centímetros`} onToque={() => setFoco("altura")}><line x1={C[0]} y1={C[1]} x2={m.pe[0]} y2={m.pe[1]} stroke="transparent" strokeWidth="16" /></Toque>
        <Toque label="Lados do triângulo" onToque={() => setFoco("lados")}>
          <polygon points={`${A} ${B} ${C}`} fill="none" stroke="#eef0e8" strokeWidth="3" strokeLinejoin="round" filter="url(#giz)" />
          <polygon points={`${A} ${B} ${C}`} fill="none" stroke="transparent" strokeWidth="18" />
        </Toque>
        <Arco p={A} q={B} r={C} ang={m.angA} cor={COR.A} nome="A" onToque={() => setFoco("A")} />
        <Arco p={B} q={C} r={A} ang={m.angB} cor={COR.B} nome="B" onToque={() => setFoco("B")} />
        <Arco p={C} q={A} r={B} ang={m.angC} cor={COR.C} nome="C" onToque={() => setFoco("C")} />
        {ladoTxt(A, B, m.c)}{ladoTxt(B, C, m.a)}{ladoTxt(C, A, m.b)}
        {["A", "B", "C"].map((k) => <Alca key={k} x={P[k][0]} y={P[k][1]} cor={COR[k]} rotulo={k} ativo={foco === k} label={`Vértice ${k}. Arraste ou use as setas.`}
          onDown={begin(k)} onToque={() => setFoco(k)} onTecla={([dx, dy]) => mover(k, [P[k][0] + dx * U / 2, P[k][1] + dy * U / 2])} />)}
        <text x="10" y="22" fill="#f5d76e" fontSize="16">{m.lados} · {m.tipoAng}</text>
      </Palco>}
      leituras={<Leituras itens={[["Área", `${fmt(m.area)} cm²`, "#8cc4ff", () => setFoco("area")], ["Perímetro", `${fmt(m.per)} cm`, "#eef0e8", () => setFoco("perimetro")], ["Ângulos", `${fmt(m.angA, 0)}° ${fmt(m.angB, 0)}° ${fmt(m.angC, 0)}°`, "#ffad7a", () => setFoco("A")], ["Pitágoras", m.reto >= 0 ? "vale ✓" : "não vale", "#c8dd6e", () => setFoco("pitagoras")]]} />}
      fala={fala} missoes={missoes} />
  );
}

/* ───────── Circunferência: puxe o raio */
export function Circulo() {
  const W = 360, H = 260, O = [140, 130]; const svg = useRef(null);
  const [r, setR] = useState(4); const [pi3, setPi3] = useState(false); const [foco, setFoco] = useState("inicio");
  const PI = pi3 ? 3 : 3.14;
  const begin = useArrastar(svg, (_, [x, y]) => setR(Math.max(1, Math.min(5.5, Math.round((Math.hypot(x - O[0], y - O[1]) / U) * 2) / 2))));
  const C = 2 * PI * r, A = PI * r * r, R = r * U;
  const falas = {
    inicio: { titulo: "Puxe o ponto do raio", txt: "Arraste a bolinha da borda para mudar o raio. Toque no raio, no diâmetro, no contorno ou na parte pintada para eu explicar.", dica: "dobre o raio e veja a área ficar 4 vezes maior." },
    raio: { titulo: `Raio = ${fmt(r)} cm`, txt: "Raio é a distância do centro até a borda. Todo ponto da circunferência está a essa mesma distância do centro.", conta: `r = ${fmt(r)} cm` },
    diametro: { titulo: `Diâmetro = ${fmt(2 * r)} cm`, txt: "Diâmetro é a corda que passa pelo centro: vale dois raios. É a maior corda que cabe no círculo.", conta: `d = 2 × r = 2 × ${fmt(r)} = ${fmt(2 * r)} cm` },
    contorno: { titulo: `Comprimento = ${fmt(C, 2)} cm`, txt: "O comprimento da circunferência é o contorno. Se você cortasse e esticasse, daria a barra amarela embaixo. Ele é sempre um pouco mais que 3 diâmetros (é o π).", conta: `C = 2 × π × r = 2 × ${PI} × ${fmt(r)} = ${fmt(C, 2)} cm`, dica: "troque π para 3, como muitas bancas pedem, e compare." },
    area: { titulo: `Área = ${fmt(A, 2)} cm²`, txt: "A área do círculo é π vezes o raio ao quadrado. Como o raio está ao quadrado, dobrar o raio multiplica a área por 4.", conta: `A = π × r² = ${PI} × ${fmt(r)}² = ${fmt(A, 2)} cm²`, dica: "veja a área com raio 2 e depois com raio 4." },
    pi: { titulo: `π = ${PI}`, txt: "π é quantas vezes o contorno é maior que o diâmetro, sempre o mesmo número para qualquer círculo: 3,14159... Na prova, use o valor que o enunciado mandar (3 ou 3,14).", conta: `C ÷ d = ${fmt(C, 2)} ÷ ${fmt(2 * r)} = ${PI}` },
  };
  const missoes = [{ txt: "Deixe o diâmetro com 8 cm", ok: r === 4 }, { txt: "Faça a área passar de 75 cm² (com π = 3,14)", ok: !pi3 && A > 75 }, { txt: "Use π = 3 e deixe o comprimento em 18 cm", ok: pi3 && quase(C, 18) }];
  const Px = [O[0] + R * Math.cos(-.6), O[1] + R * Math.sin(-.6)];
  return (
    <Experimento
      palco={<Palco svgRef={svg} w={W} h={H} label={`Circunferência de raio ${fmt(r)} centímetros`}>
        <Toque label={`Área: ${fmt(A, 2)} centímetros quadrados`} onToque={() => setFoco("area")}><circle cx={O[0]} cy={O[1]} r={R} fill="#ffad7a" fillOpacity=".12" /></Toque>
        <Toque label={`Contorno: ${fmt(C, 2)} centímetros`} onToque={() => setFoco("contorno")}><circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke="#eef0e8" strokeWidth="3" filter="url(#giz)" /><circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke="transparent" strokeWidth="16" /></Toque>
        <Toque label={`Diâmetro: ${fmt(2 * r)} centímetros`} onToque={() => setFoco("diametro")}><line x1={O[0] - R} y1={O[1]} x2={O[0] + R} y2={O[1]} stroke="#c8dd6e" strokeWidth="2.5" strokeDasharray="6 5" /><line x1={O[0] - R} y1={O[1]} x2={O[0] + R} y2={O[1]} stroke="transparent" strokeWidth="14" /></Toque>
        <Toque label={`Raio: ${fmt(r)} centímetros`} onToque={() => setFoco("raio")}><line x1={O[0]} y1={O[1]} x2={Px[0]} y2={Px[1]} stroke="#8cc4ff" strokeWidth="3" /><line x1={O[0]} y1={O[1]} x2={Px[0]} y2={Px[1]} stroke="transparent" strokeWidth="14" /></Toque>
        <circle cx={O[0]} cy={O[1]} r="4" fill="#eef0e8" />
        <text x={(O[0] + Px[0]) / 2 + 4} y={(O[1] + Px[1]) / 2 - 8} fill="#8cc4ff" fontSize="16">r</text>
        <text x={O[0] + R / 2 - 6} y={O[1] + 18} fill="#c8dd6e" fontSize="15">d</text>
        <Alca x={Px[0]} y={Px[1]} cor="#8cc4ff" ativo={foco === "raio"} label={`Ponto da borda, raio ${fmt(r)}. Setas mudam o raio.`} onDown={begin("r")} onToque={() => setFoco("raio")} onTecla={([dx, dy]) => setR((v) => Math.max(1, Math.min(5.5, v + (dx > 0 || dy < 0 ? .5 : -.5))))} />
        <g transform="translate(20 238)"><rect width={Math.min(320, C * 6)} height="8" rx="4" fill="#f5d76e" /><text x={Math.min(320, C * 6) + 6} y="9" fill="#f5d76e" fontSize="14">{C * 6 > 320 ? "…" : ""}</text></g>
        <text x="296" y="30" fill="#eef0e8" fontSize="14" textAnchor="middle">C ÷ d</text><text x="296" y="52" fill="#f5d76e" fontSize="22" textAnchor="middle">{PI}</text>
      </Palco>}
      controles={<><Deslizar rot="Raio" v={r} min={1} max={5.5} passo={.5} onChange={setR} fmtV={(x) => `${fmt(x)} cm`} onFoco={() => setFoco("raio")} />
        <div className="flex flex-col gap-1 text-sm font-bold">Valor de π<div className="grid grid-cols-2 gap-1 rounded-xl bg-folha-2 p-1">{[[false, "3,14"], [true, "3"]].map(([v, t]) => <button key={t} type="button" aria-pressed={pi3 === v} onClick={() => { setPi3(v); setFoco("pi"); }} className={`min-h-9 rounded-lg font-bold ${pi3 === v ? "bg-folha text-giz shadow-[inset_0_-2px_0_var(--acc)]" : "text-apagado"}`}>{t}</button>)}</div></div></>}
      leituras={<Leituras itens={[["Raio", `${fmt(r)} cm`, "#8cc4ff", () => setFoco("raio")], ["Diâmetro", `${fmt(2 * r)} cm`, "#c8dd6e", () => setFoco("diametro")], ["Comprimento", `${fmt(C, 2)} cm`, "#f5d76e", () => setFoco("contorno")], ["Área", `${fmt(A, 2)} cm²`, "#ffad7a", () => setFoco("area")]]} />}
      fala={falas[foco]} missoes={missoes} />
  );
}

/* ───────── Teorema de Tales: mexa nas paralelas */
export function Tales() {
  const W = 360, H = 260; const svg = useRef(null);
  const [ys, setYs] = useState([50, 120, 220]); const [t2, setT2] = useState(330); const [foco, setFoco] = useState("inicio");
  const T1 = [[70, 20], [120, 250]], topo = [210, 20];
  const xEm = (p, q, y) => p[0] + ((y - p[1]) / (q[1] - p[1])) * (q[0] - p[0]);
  const T2 = [topo, [t2, 250]];
  const comp = (p, q, y1, y2) => Math.abs(y2 - y1) * Math.hypot(q[0] - p[0], q[1] - p[1]) / Math.abs(q[1] - p[1]) / U;
  const a = comp(...T1, ys[0], ys[1]), b = comp(...T1, ys[1], ys[2]), c = comp(...T2, ys[0], ys[1]), d = comp(...T2, ys[1], ys[2]);
  const mover = (id, [x, y]) => { if (id === "t2") return setT2(Math.max(230, Math.min(350, Math.round(x / 10) * 10)));
    setYs((o) => { const n = [...o]; const lo = id === 0 ? 30 : n[id - 1] + 20, hi = id === 2 ? 240 : n[id + 1] - 20; n[id] = Math.max(lo, Math.min(hi, Math.round(y / 10) * 10)); return n; }); };
  const begin = useArrastar(svg, mover);
  const falas = {
    inicio: { titulo: "Paralelas cortadas por transversais", txt: "As três retas horizontais são paralelas. Arraste as bolinhas da esquerda para subir ou descer cada paralela, e a bolinha de baixo à direita para inclinar a segunda transversal.", dica: "mexa à vontade e repare que a/b e c/d continuam iguais." },
    razao: { titulo: `a/b = c/d = ${fmt(a / b, 2)}`, txt: "Esse é o Teorema de Tales: quando paralelas cortam duas transversais, os pedaços são proporcionais. A conta da prova é sempre uma regra de três: multiplica cruzado.", conta: `${fmt(a)} ÷ ${fmt(b)} = ${fmt(c)} ÷ ${fmt(d)}  →  ${fmt(a)} × ${fmt(d)} = ${fmt(b)} × ${fmt(c)}`, dica: "na prova, um dos quatro pedaços é o x. Esconda um com a mão e calcule pelos outros três." },
    a: { titulo: `a = ${fmt(a)}`, txt: "Pedaço da primeira transversal entre a 1ª e a 2ª paralela. Ele corresponde ao c na outra transversal.", conta: `a está para b assim como c está para d` },
    c: { titulo: `c = ${fmt(c)}`, txt: "Pedaço da segunda transversal entre as mesmas paralelas do a. Por isso a e c são correspondentes (mesma 'faixa').", conta: `c = a × d ÷ b = ${fmt(a)} × ${fmt(d)} ÷ ${fmt(b)} = ${fmt(a * d / b)}` },
    trans: { titulo: "Inclinar não estraga a proporção", txt: "Ao inclinar a transversal, os pedaços c e d mudam de tamanho, mas mudam juntos, na mesma proporção. Por isso a razão fica igual.", conta: `c ÷ d = ${fmt(c)} ÷ ${fmt(d)} = ${fmt(c / d, 2)}` },
  };
  const missoes = [{ txt: "Deixe a = b (a do meio bem no meio)", ok: quase(a, b) }, { txt: "Faça b ser o dobro de a", ok: quase(b, 2 * a, .02) }, { txt: "Incline a 2ª transversal até a ponta", ok: t2 >= 350 || t2 <= 230 }];
  const pedaco = (T, y1, y2, txt, cor, foc, lado) => { const p1 = [xEm(...T, y1), y1], p2 = [xEm(...T, y2), y2]; const m = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    return <Toque label={`${txt}`} onToque={() => setFoco(foc)}><line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={cor} strokeWidth="5" strokeLinecap="round" /><line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="transparent" strokeWidth="18" /><text x={m[0] + lado} y={m[1] + 5} fill={cor} fontSize="16" textAnchor={lado < 0 ? "end" : "start"}>{txt}</text></Toque>; };
  return (
    <Experimento
      palco={<Palco svgRef={svg} w={W} h={H} label={`Teorema de Tales. a/b igual a c/d igual a ${fmt(a / b, 2)}`}>
        {ys.map((y, k) => <line key={k} x1="20" y1={y} x2="350" y2={y} stroke="#eef0e8" strokeOpacity=".75" strokeWidth="2" filter="url(#giz)" />)}
        <line x1={T1[0][0]} y1={T1[0][1]} x2={T1[1][0]} y2={T1[1][1]} stroke="#eef0e8" strokeOpacity=".35" strokeWidth="2" />
        <Toque label="Segunda transversal" onToque={() => setFoco("trans")}><line x1={T2[0][0]} y1={T2[0][1]} x2={T2[1][0]} y2={T2[1][1]} stroke="#eef0e8" strokeOpacity=".35" strokeWidth="2" /></Toque>
        {pedaco(T1, ys[0], ys[1], `a ${fmt(a)}`, "#8cc4ff", "a", -10)}{pedaco(T1, ys[1], ys[2], `b ${fmt(b)}`, "#c8dd6e", "razao", -10)}
        {pedaco(T2, ys[0], ys[1], `c ${fmt(c)}`, "#8cc4ff", "c", 10)}{pedaco(T2, ys[1], ys[2], `d ${fmt(d)}`, "#c8dd6e", "razao", 10)}
        {ys.map((y, k) => <Alca key={k} x={20} y={y} cor="#f5d76e" label={`Paralela ${k + 1}. Arraste ou use as setas para cima e para baixo.`} onDown={begin(k)} onToque={() => setFoco("razao")} onTecla={([, dy]) => mover(k, [20, y + dy * 5])} />)}
        <Alca x={t2} y={250} cor="#ffad7a" label="Ponta da segunda transversal. Setas para os lados inclinam." onDown={begin("t2")} onToque={() => setFoco("trans")} onTecla={([dx]) => mover("t2", [t2 + dx * 5, 250])} />
      </Palco>}
      leituras={<Leituras itens={[["a ÷ b", fmt(a / b, 2), "#8cc4ff", () => setFoco("razao")], ["c ÷ d", fmt(c / d, 2), "#8cc4ff", () => setFoco("razao")], ["a × d", fmt(a * d, 1), "#c8dd6e", () => setFoco("razao")], ["b × c", fmt(b * c, 1), "#c8dd6e", () => setFoco("razao")]]} />}
      fala={falas[foco]} missoes={missoes} />
  );
}

/* ───────── Gráfico de função afim e quadrática */
export function Funcao() {
  const W = 360, H = 260, X0 = 180, Y0 = 130, S = 20; const svg = useRef(null);
  const [tipo, setTipo] = useState("afim"); const [a, setA] = useState(1); const [b, setB] = useState(1); const [c, setC] = useState(-2); const [foco, setFoco] = useState("inicio");
  const f = (x) => tipo === "afim" ? a * x + b : a * x * x + b * x + c;
  const tx = (x) => X0 + x * S, ty = (y) => Y0 - y * S;
  const pts = []; for (let x = -9; x <= 9; x += .1) { const y = f(x); if (Math.abs(y) < 20) pts.push(`${fmt(tx(x), 2).replace(",", ".")},${fmt(ty(y), 2).replace(",", ".")}`); }
  const delta = b * b - 4 * a * c;
  const raizes = tipo === "afim" ? (a ? [-b / a] : []) : a === 0 ? [] : delta < 0 ? [] : delta === 0 ? [-b / (2 * a)] : [(-b - Math.sqrt(delta)) / (2 * a), (-b + Math.sqrt(delta)) / (2 * a)];
  const V = tipo === "quad" && a ? [-b / (2 * a), -delta / (4 * a)] : null;
  const yInt = tipo === "afim" ? b : c;
  const falas = {
    inicio: { titulo: tipo === "afim" ? "Função afim: f(x) = ax + b" : "Função quadrática: f(x) = ax² + bx + c", txt: "Mexa nos controles e veja o gráfico mudar na hora. Toque nos pontos marcados (onde corta os eixos, o vértice) para eu explicar.", dica: tipo === "afim" ? "deixe a negativo e veja a reta descer." : "zere o Δ e a parábola encosta no eixo x num ponto só." },
    a: tipo === "afim" ? { titulo: `a = ${fmt(a)} (coeficiente angular)`, txt: `O a é a inclinação: a cada 1 passo para a direita, a reta ${a >= 0 ? "sobe" : "desce"} ${fmt(Math.abs(a))}. a > 0 é crescente, a < 0 é decrescente, a = 0 é constante.`, conta: `f(1) − f(0) = ${fmt(f(1))} − ${fmt(f(0))} = ${fmt(a)}` }
      : { titulo: `a = ${fmt(a)} (abertura)`, txt: `O sinal de a decide a "boca": a > 0 é para cima (tem ponto mínimo), a < 0 é para baixo (tem ponto máximo). Quanto maior o |a|, mais fechada a parábola.`, conta: a > 0 ? "a > 0 → boca para cima ∪" : a < 0 ? "a < 0 → boca para baixo ∩" : "a = 0 → não é parábola" },
    b: tipo === "afim" ? { titulo: `b = ${fmt(b)} (coeficiente linear)`, txt: "O b é onde a reta corta o eixo y, porque quando x = 0 sobra só o b.", conta: `f(0) = ${fmt(a)} × 0 + ${fmt(b)} = ${fmt(b)}` }
      : { titulo: `b = ${fmt(b)}`, txt: "O b mexe o vértice para os lados. Ele entra no x do vértice e no Δ.", conta: `xᵥ = −b ÷ 2a = ${fmt(-b)} ÷ ${fmt(2 * a)} = ${V ? fmt(V[0], 2) : "—"}` },
    raiz: raizes.length ? { titulo: raizes.length === 1 ? `Raiz: x = ${fmt(raizes[0], 2)}` : `Raízes: ${fmt(raizes[0], 2)} e ${fmt(raizes[1], 2)}`, txt: "Raiz (ou zero) é o x em que o gráfico corta o eixo x, ou seja, onde f(x) = 0.", conta: tipo === "afim" ? `ax + b = 0 → x = −b ÷ a = ${fmt(-b)} ÷ ${fmt(a)} = ${fmt(raizes[0], 2)}` : `x = (−b ± √Δ) ÷ 2a = (${fmt(-b)} ± √${fmt(delta)}) ÷ ${fmt(2 * a)}` }
      : { titulo: "Sem raiz real", txt: tipo === "afim" ? "Com a = 0 a reta é horizontal e só toca o eixo x se b também for 0." : "Com Δ negativo a parábola não encosta no eixo x: não há raiz real.", conta: tipo === "quad" ? `Δ = b² − 4ac = ${fmt(b * b)} − 4 × ${fmt(a)} × ${fmt(c)} = ${fmt(delta)}` : undefined },
    delta: { titulo: `Δ = ${fmt(delta)}`, txt: "O Δ conta quantas raízes existem: Δ > 0 duas, Δ = 0 uma (a parábola encosta), Δ < 0 nenhuma real.", conta: `Δ = b² − 4ac = ${fmt(b)}² − 4 × ${fmt(a)} × ${fmt(c)} = ${fmt(delta)}` },
    vertice: V ? { titulo: `Vértice (${fmt(V[0], 2)}; ${fmt(V[1], 2)})`, txt: `É o ponto de virada da parábola: ${a > 0 ? "o valor mínimo" : "o valor máximo"} da função. Cai muito em questão de lucro máximo ou altura máxima.`, conta: `xᵥ = −b/2a = ${fmt(V[0], 2)} · yᵥ = −Δ/4a = ${fmt(V[1], 2)}` } : { titulo: "Vértice", txt: "Só a parábola tem vértice." },
    y: { titulo: `Corta o eixo y em ${fmt(yInt)}`, txt: "Para achar onde o gráfico corta o eixo y, troque x por 0.", conta: `f(0) = ${fmt(yInt)}` },
  };
  const missoes = tipo === "afim" ? [{ txt: "Faça a reta passar pela origem (0, 0)", ok: b === 0 && a !== 0 }, { txt: "Deixe a reta decrescente", ok: a < 0 }, { txt: "Faça a raiz ser x = 2", ok: raizes.length === 1 && quase(raizes[0], 2, .01) }]
    : [{ txt: "Deixe a boca para baixo", ok: a < 0 }, { txt: "Faça Δ = 0 (uma raiz só)", ok: a !== 0 && delta === 0 }, { txt: "Deixe sem raiz real (Δ < 0)", ok: a !== 0 && delta < 0 }];
  return (
    <Experimento
      palco={<Palco svgRef={svg} w={W} h={H} label={`Gráfico de f(x). Raízes: ${raizes.map((r) => fmt(r, 2)).join(" e ") || "nenhuma"}`}>
        <line x1="0" y1={Y0} x2={W} y2={Y0} stroke="#eef0e8" strokeOpacity=".5" /><line x1={X0} y1="0" x2={X0} y2={H} stroke="#eef0e8" strokeOpacity=".5" />
        <text x={W - 14} y={Y0 - 6} fill="#a5b0a8" fontSize="14">x</text><text x={X0 + 6} y="16" fill="#a5b0a8" fontSize="14">y</text>
        <polyline points={pts.join(" ")} fill="none" stroke="#8cc4ff" strokeWidth="3.5" strokeLinecap="round" filter="url(#giz)" />
        <Toque label={`Corta o eixo y em ${fmt(yInt)}`} onToque={() => setFoco("y")}><circle cx={tx(0)} cy={ty(yInt)} r="7" fill="#c8dd6e" /><circle cx={tx(0)} cy={ty(yInt)} r="16" fill="transparent" /></Toque>
        {raizes.map((r, k) => Math.abs(r) < 9 && <Toque key={k} label={`Raiz em x igual a ${fmt(r, 2)}`} onToque={() => setFoco("raiz")}><circle cx={tx(r)} cy={Y0} r="7" fill="#ffad7a" /><circle cx={tx(r)} cy={Y0} r="16" fill="transparent" /></Toque>)}
        {V && Math.abs(V[1]) < 6.5 && <Toque label={`Vértice em ${fmt(V[0], 2)} e ${fmt(V[1], 2)}`} onToque={() => setFoco("vertice")}><circle cx={tx(V[0])} cy={ty(V[1])} r="7" fill="#f5d76e" /><circle cx={tx(V[0])} cy={ty(V[1])} r="16" fill="transparent" /><text x={tx(V[0]) + 10} y={ty(V[1]) + (a > 0 ? 18 : -10)} fill="#f5d76e" fontSize="15">V</text></Toque>}
        <text x="10" y="22" fill="#eef0e8" fontSize="17">{tipo === "afim" ? `f(x) = ${fmt(a)}x ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}` : `f(x) = ${fmt(a)}x² ${b < 0 ? "−" : "+"} ${fmt(Math.abs(b))}x ${c < 0 ? "−" : "+"} ${fmt(Math.abs(c))}`}</text>
      </Palco>}
      controles={<>
        <div className="flex flex-col gap-1 text-sm font-bold sm:col-span-2">Tipo<div className="grid grid-cols-2 gap-1 rounded-xl bg-folha-2 p-1">{[["afim", "Afim (reta)"], ["quad", "Quadrática (parábola)"]].map(([v, t]) => <button key={v} type="button" aria-pressed={tipo === v} onClick={() => { setTipo(v); setFoco("inicio"); }} className={`min-h-9 rounded-lg font-bold ${tipo === v ? "bg-folha text-giz shadow-[inset_0_-2px_0_var(--acc)]" : "text-apagado"}`}>{t}</button>)}</div></div>
        <Deslizar rot="a" v={a} min={-3} max={3} passo={.5} onChange={setA} fmtV={(x) => fmt(x)} onFoco={() => setFoco("a")} />
        <Deslizar rot="b" v={b} min={-5} max={5} passo={1} onChange={setB} fmtV={(x) => fmt(x)} cor="#c8dd6e" onFoco={() => setFoco("b")} />
        {tipo === "quad" && <Deslizar rot="c" v={c} min={-5} max={5} passo={1} onChange={setC} fmtV={(x) => fmt(x)} cor="#ffad7a" onFoco={() => setFoco("y")} />}
      </>}
      leituras={<Leituras itens={[["Raízes", raizes.map((r) => fmt(r, 2)).join(" e ") || "nenhuma", "#ffad7a", () => setFoco("raiz")], ["Corta y em", fmt(yInt), "#c8dd6e", () => setFoco("y")], ...(tipo === "quad" ? [["Δ", fmt(delta), "#eef0e8", () => setFoco("delta")], ["Vértice", V ? `(${fmt(V[0], 1)}; ${fmt(V[1], 1)})` : "—", "#f5d76e", () => setFoco("vertice")]] : [["Inclinação", a > 0 ? "crescente" : a < 0 ? "decrescente" : "constante", "#8cc4ff", () => setFoco("a")]])]} />}
      fala={falas[foco]} missoes={missoes} />
  );
}
