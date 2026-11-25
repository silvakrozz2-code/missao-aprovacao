import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Shuffle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Palco, Toque, Deslizar, Leituras, Experimento, fmt, brl, mdc, mmc } from "./base.jsx";

const quase = (x, y, t = 1e-9) => Math.abs(x - y) < t;
const Seg = ({ v, set, ops, rot }) => (
  <div className="flex flex-col gap-1 text-sm font-bold sm:col-span-2">{rot}<div className="grid gap-1 rounded-xl bg-folha-2 p-1" style={{ gridTemplateColumns: `repeat(${ops.length}, minmax(0,1fr))` }}>
    {ops.map(([k, t]) => <button key={k} type="button" aria-pressed={v === k} onClick={() => set(k)} className={`min-h-9 rounded-lg px-1 font-bold ${v === k ? "bg-folha text-giz shadow-[inset_0_-2px_0_var(--acc)]" : "text-apagado"}`}>{t}</button>)}</div></div>
);

/* ───────── Frações: barras de chocolate */
export function Fracoes() {
  const [n1, setN1] = useState(1), [d1, setD1] = useState(2), [n2, setN2] = useState(1), [d2, setD2] = useState(3);
  const [modo, setModo] = useState("comparar"); const [foco, setFoco] = useState("inicio");
  const N1 = Math.min(n1, d1), N2 = Math.min(n2, d2);
  const M = mmc(d1, d2); const e1 = N1 * (M / d1), e2 = N2 * (M / d2);
  const soma = e1 + e2, g = mdc(soma, M);
  const W = 360, H = modo === "somar" ? 250 : 190, L = 300, X = 30;
  const barra = (y, n, d, cor, rot, id, sub = 1) => (
    <g>{Array.from({ length: d * sub }, (_, k) => (
      <Toque key={k} label={`${rot}: parte ${Math.floor(k / sub) + 1} de ${d}`} onToque={() => setFoco(id)}>
        <rect x={X + (k * L) / (d * sub)} y={y} width={L / (d * sub)} height="40" rx="3" fill={k < n * sub ? cor : "transparent"} fillOpacity={k < n * sub ? .85 : 0} stroke="#eef0e8" strokeOpacity={k % sub ? .25 : .8} strokeWidth={k % sub ? 1 : 2} /></Toque>))}
      <text x={X} y={y - 8} fill={cor} fontSize="17">{rot}</text></g>);
  const falas = {
    inicio: { titulo: "Frações como barras", txt: "Cada barra é um inteiro cortado em partes iguais. O de baixo (denominador) diz em quantas partes cortou; o de cima (numerador) diz quantas você pegou. Toque numa barra.", dica: "deixe 1/2 em cima e 2/4 embaixo: o pedaço pintado é o mesmo." },
    f1: { titulo: `${N1}/${d1}`, txt: `Cortei o inteiro em ${d1} partes iguais e pintei ${N1}. Em decimal isso é ${fmt(N1 / d1, 3)}, ou ${fmt((N1 / d1) * 100)}%.`, conta: `${N1} ÷ ${d1} = ${fmt(N1 / d1, 3)}` },
    f2: { titulo: `${N2}/${d2}`, txt: `Cortei em ${d2} partes e pintei ${N2}. Quanto mais partes (denominador maior), menor cada pedaço.`, conta: `${N2} ÷ ${d2} = ${fmt(N2 / d2, 3)}` },
    comparar: { titulo: N1 * d2 === N2 * d1 ? "São equivalentes!" : `${N1 / d1 > N2 / d2 ? `${N1}/${d1}` : `${N2}/${d2}`} é maior`, txt: "Para comparar sem desenhar, multiplique cruzado: o numerador de uma pelo denominador da outra.", conta: `${N1} × ${d2} = ${N1 * d2}   e   ${N2} × ${d1} = ${N2 * d1}`, dica: "frações equivalentes ocupam o mesmo espaço na barra." },
    somar: { titulo: `${N1}/${d1} + ${N2}/${d2} = ${soma / g}/${M / g}`, txt: `Só dá para somar pedaços do mesmo tamanho. Por isso cortei as duas barras em ${M} partes (o MMC de ${d1} e ${d2}). Aí é só somar os pedaços pintados.`, conta: `${N1}/${d1} = ${e1}/${M} · ${N2}/${d2} = ${e2}/${M} · ${e1} + ${e2} = ${soma}/${M}${g > 1 ? ` = ${soma / g}/${M / g}` : ""}`, dica: "tente 1/2 + 1/3: o MMC 6 aparece nas linhas finas." },
  };
  const missoes = [{ txt: "Mostre que 1/2 é igual a 2/4", ok: N1 * d2 === N2 * d1 && ((d1 === 2 && d2 === 4) || (d1 === 4 && d2 === 2)) }, { txt: "Some duas frações que dão exatamente 1 inteiro", ok: modo === "somar" && soma === M }, { txt: "Some frações com denominadores diferentes (ex.: 1/2 + 1/3)", ok: modo === "somar" && d1 !== d2 && N1 > 0 && N2 > 0 }];
  return (
    <Experimento
      palco={<Palco w={W} h={H} label={`Fração ${N1}/${d1} e fração ${N2}/${d2}`}>
        {barra(40, modo === "somar" ? e1 : N1, modo === "somar" ? M : d1, "#8cc4ff", `${N1}/${d1}${modo === "somar" ? ` = ${e1}/${M}` : ""}`, "f1")}
        {barra(118, modo === "somar" ? e2 : N2, modo === "somar" ? M : d2, "#ffad7a", `${N2}/${d2}${modo === "somar" ? ` = ${e2}/${M}` : ""}`, "f2")}
        {modo === "somar" && <Toque label="Resultado da soma" onToque={() => setFoco("somar")}>{Array.from({ length: Math.max(M, soma) }, (_, k) => <rect key={k} x={X + (k * L) / M} y="196" width={L / M} height="40" rx="3" fill={k < e1 ? "#8cc4ff" : k < soma ? "#ffad7a" : "transparent"} fillOpacity=".85" stroke="#eef0e8" strokeOpacity=".6" />)}<text x={X} y="188" fill="#f5d76e" fontSize="17">soma = {soma}/{M}{g > 1 ? ` = ${soma / g}/${M / g}` : ""}{soma > M ? " (passou de 1 inteiro)" : ""}</text></Toque>}
        {modo === "comparar" && <text x={W / 2} y="180" fill="#f5d76e" fontSize="18" textAnchor="middle">{N1 * d2 === N2 * d1 ? "mesmo tamanho: equivalentes" : N1 / d1 > N2 / d2 ? "a azul é maior" : "a laranja é maior"}</text>}
      </Palco>}
      controles={<>
        <Seg rot="O que fazer" v={modo} set={(m) => { setModo(m); setFoco(m); }} ops={[["comparar", "Comparar"], ["somar", "Somar"]]} />
        <Deslizar rot="Azul: pintados" v={N1} min={0} max={d1} onChange={setN1} fmtV={(x) => x} onFoco={() => setFoco("f1")} />
        <Deslizar rot="Azul: partes" v={d1} min={1} max={12} onChange={(v) => { setD1(v); setN1((x) => Math.min(x, v)); }} fmtV={(x) => x} onFoco={() => setFoco("f1")} />
        <Deslizar rot="Laranja: pintados" v={N2} min={0} max={d2} onChange={setN2} fmtV={(x) => x} cor="#ffad7a" onFoco={() => setFoco("f2")} />
        <Deslizar rot="Laranja: partes" v={d2} min={1} max={12} onChange={(v) => { setD2(v); setN2((x) => Math.min(x, v)); }} fmtV={(x) => x} cor="#ffad7a" onFoco={() => setFoco("f2")} />
      </>}
      leituras={<Leituras itens={[["Azul", `${N1}/${d1} = ${fmt(N1 / d1, 3)}`, "#8cc4ff", () => setFoco("f1")], ["Laranja", `${N2}/${d2} = ${fmt(N2 / d2, 3)}`, "#ffad7a", () => setFoco("f2")], ["MMC", M, "#f5d76e", () => setFoco("somar")], ["Comparação", N1 * d2 === N2 * d1 ? "iguais" : N1 / d1 > N2 / d2 ? "azul >" : "laranja >", "#c8dd6e", () => setFoco("comparar")]]} />}
      fala={falas[foco]} missoes={missoes} />
  );
}

/* ───────── Porcentagem: quadro de 100 quadradinhos */
export function Porcentagem() {
  const [p, setP] = useState(25), [v, setV] = useState(200), [modo, setModo] = useState("de"); const [foco, setFoco] = useState("inicio");
  const parte = (p / 100) * v, fator = modo === "aumento" ? 1 + p / 100 : modo === "desconto" ? 1 - p / 100 : p / 100;
  const final = v * fator;
  const falas = {
    inicio: { titulo: "Porcentagem é “por cem”", txt: "O quadro tem 100 quadradinhos: cada um é 1%. Escolha a porcentagem e o valor, e toque no quadro ou nos resultados.", dica: "10% é só andar a vírgula uma casa: 10% de 350 é 35." },
    grade: { titulo: `${p}% = ${p}/100`, txt: `Pintei ${p} de 100 quadradinhos. Porcentagem é uma fração com denominador 100, então ${p}% vale ${fmt(p / 100, 2)} em decimal.`, conta: `${p}% = ${p} ÷ 100 = ${fmt(p / 100, 2)}` },
    de: { titulo: `${p}% de ${fmt(v, 2)} = ${fmt(parte, 2)}`, txt: "“De” em matemática é multiplicação. Transforme a porcentagem em decimal e multiplique.", conta: `${fmt(p / 100, 2)} × ${fmt(v, 2)} = ${fmt(parte, 2)}`, dica: "atalho: 25% é dividir por 4, 50% é a metade, 20% é dividir por 5." },
    aumento: { titulo: `Aumento de ${p}%: ${fmt(final, 2)}`, txt: `Aumentar ${p}% é ficar com os 100% de antes mais ${p}%, ou seja, ${100 + p}%. Multiplique direto pelo fator.`, conta: `${fmt(v, 2)} × ${fmt(fator, 2)} = ${fmt(final, 2)}`, dica: "dois aumentos seguidos multiplicam os fatores, não somam as porcentagens." },
    desconto: { titulo: `Desconto de ${p}%: ${fmt(final, 2)}`, txt: `Com desconto de ${p}%, você paga ${100 - p}% do preço. Multiplique pelo fator.`, conta: `${fmt(v, 2)} × ${fmt(fator, 2)} = ${fmt(final, 2)}`, dica: "aumentar 10% e depois descontar 10% NÃO volta ao preço inicial. Teste!" },
  };
  const missoes = [{ txt: "Calcule 25% de 200", ok: modo === "de" && p === 25 && v === 200 }, { txt: "Aplique um desconto de 10% em 350", ok: modo === "desconto" && p === 10 && v === 350 }, { txt: "Ache um aumento que leve 200 para 250", ok: modo === "aumento" && v === 200 && quase(final, 250, .001) }];
  return (
    <Experimento
      palco={<Palco w={360} h={240} label={`${p} por cento pintado de 100 quadradinhos`}>
        <Toque label={`${p} de 100 quadradinhos pintados`} onToque={() => setFoco("grade")}>
          {Array.from({ length: 100 }, (_, k) => { const x = 16 + (k % 10) * 21, y = 16 + Math.floor(k / 10) * 21; const on = k < p;
            return <motion.rect key={k} x={x} y={y} width="18" height="18" rx="3" initial={false} animate={{ fillOpacity: on ? .9 : .06 }} fill={modo === "desconto" && on ? "#ff8a7a" : "#8cc4ff"} stroke="#eef0e8" strokeOpacity=".2" />; })}
        </Toque>
        <text x="236" y="40" fill="#a5b0a8" fontSize="15">{modo === "de" ? `${p}% de` : modo === "aumento" ? "com aumento" : "com desconto"}</text>
        <text x="236" y="64" fill="#eef0e8" fontSize="20">{fmt(v, 2)}</text>
        <text x="236" y="100" fill="#a5b0a8" fontSize="15">{modo === "de" ? "dá" : "fica"}</text>
        <text x="236" y="132" fill="#f5d76e" fontSize="28">{fmt(modo === "de" ? parte : final, 2)}</text>
        <text x="236" y="170" fill="#a5b0a8" fontSize="14">fator × {fmt(fator, 2)}</text>
      </Palco>}
      controles={<>
        <Seg rot="Tipo de conta" v={modo} set={(m) => { setModo(m); setFoco(m); }} ops={[["de", "x% de"], ["aumento", "Aumento"], ["desconto", "Desconto"]]} />
        <Deslizar rot="Porcentagem" v={p} min={0} max={100} onChange={setP} fmtV={(x) => `${x}%`} onFoco={() => setFoco("grade")} />
        <Deslizar rot="Valor" v={v} min={10} max={1000} passo={10} onChange={setV} fmtV={(x) => fmt(x, 2)} cor="#c8dd6e" onFoco={() => setFoco(modo)} />
      </>}
      leituras={<Leituras itens={[["Decimal", fmt(p / 100, 2), "#8cc4ff", () => setFoco("grade")], [`${p}% de ${v}`, fmt(parte, 2), "#f5d76e", () => setFoco("de")], ["Com aumento", fmt(v * (1 + p / 100), 2), "#c8dd6e", () => { setModo("aumento"); setFoco("aumento"); }], ["Com desconto", fmt(v * (1 - p / 100), 2), "#ff8a7a", () => { setModo("desconto"); setFoco("desconto"); }]]} />}
      fala={falas[foco]} missoes={missoes} />
  );
}

/* ───────── Juros simples x compostos */
export function Juros() {
  const [C, setC] = useState(1000), [i, setI] = useState(5), [t, setT] = useState(6); const [foco, setFoco] = useState("inicio"); const [mes, setMes] = useState(null);
  const S = (k) => C * (1 + (i / 100) * k), Cp = (k) => C * (1 + i / 100) ** k;
  const max = Cp(12) * 1.02, W = 360, H = 240, X0 = 34, base = 210, alt = 180;
  const y = (v) => base - ((v - C * .9) / (max - C * .9)) * alt;
  const falas = {
    inicio: { titulo: "Simples x compostos", txt: "As barras azuis são juros simples; as laranjas, compostos. Mude capital, taxa e tempo. Toque numa barra para ver a conta daquele mês.", dica: "aumente o tempo e veja os compostos se afastarem." },
    simples: { titulo: `Juros simples: ${brl(S(t) - C)}`, txt: "No simples, os juros de todo mês são calculados sobre o capital inicial. Por isso cresce igual todo mês (uma reta).", conta: `J = C × i × t = ${brl(C)} × ${fmt(i / 100, 2)} × ${t} = ${brl(S(t) - C)}`, dica: "a taxa e o tempo precisam estar na mesma unidade (ao mês com meses)." },
    compostos: { titulo: `Montante composto: ${brl(Cp(t))}`, txt: "No composto, os juros de cada mês entram no saldo e passam a render também: é juro sobre juro. Cresce cada vez mais rápido.", conta: `M = C × (1 + i)ᵗ = ${brl(C)} × ${fmt(1 + i / 100, 2)}^${t} = ${brl(Cp(t))}` },
    mes: mes != null ? { titulo: `Mês ${mes}`, txt: `Simples: ${brl(S(mes))}. Compostos: ${brl(Cp(mes))}. Diferença: ${brl(Cp(mes) - S(mes))}.`, conta: `simples ${brl(C)} + ${mes} × ${brl(C * i / 100)}  ·  compostos ${brl(C)} × ${fmt(1 + i / 100, 2)}^${mes}`, dica: mes === 1 ? "no mês 1 os dois são iguais: ainda não houve juro sobre juro." : undefined } : null,
  };
  const missoes = [{ txt: "Faça os juros simples darem R$ 300", ok: quase(S(t) - C, 300, .001) }, { txt: "Encontre um caso em que os compostos superam os simples em mais de R$ 100", ok: Cp(t) - S(t) > 100 }, { txt: "Veja que no mês 1 os dois são iguais (toque na barra do mês 1)", ok: mes === 1 }];
  return (
    <Experimento
      palco={<Palco w={W} h={H} label={`Juros com capital ${brl(C)}, taxa ${i}% ao mês, ${t} meses`}>
        <line x1={X0} y1={base} x2={W - 8} y2={base} stroke="#eef0e8" strokeOpacity=".4" />
        {Array.from({ length: 12 }, (_, k) => { const m = k + 1, x = X0 + k * 27, on = m <= t;
          return <Toque key={m} label={`Mês ${m}: simples ${brl(S(m))}, compostos ${brl(Cp(m))}`} onToque={() => { setMes(m); setFoco("mes"); }}>
            <rect x={x} y={y(S(m))} width="11" height={base - y(S(m))} rx="2" fill="#8cc4ff" fillOpacity={on ? .9 : .2} />
            <rect x={x + 12} y={y(Cp(m))} width="11" height={base - y(Cp(m))} rx="2" fill="#ffad7a" fillOpacity={on ? .9 : .2} />
            <rect x={x - 2} y="10" width="27" height={base} fill="transparent" />
            <text x={x + 11} y={base + 18} fill={mes === m ? "#f5d76e" : "#a5b0a8"} fontSize="13" textAnchor="middle">{m}</text></Toque>; })}
        <text x={X0} y="26" fill="#8cc4ff" fontSize="15">■ simples {brl(S(t))}</text><text x={X0} y="46" fill="#ffad7a" fontSize="15">■ compostos {brl(Cp(t))}</text>
      </Palco>}
      controles={<>
        <Deslizar rot="Capital" v={C} min={100} max={5000} passo={100} onChange={setC} fmtV={brl} cor="#c8dd6e" onFoco={() => setFoco("simples")} />
        <Deslizar rot="Taxa ao mês" v={i} min={1} max={10} onChange={setI} fmtV={(x) => `${x}%`} onFoco={() => setFoco("simples")} />
        <Deslizar rot="Tempo" v={t} min={1} max={12} onChange={setT} fmtV={(x) => `${x} ${x === 1 ? "mês" : "meses"}`} cor="#ffad7a" onFoco={() => setFoco("compostos")} />
      </>}
      leituras={<Leituras itens={[["Juros simples", brl(S(t) - C), "#8cc4ff", () => setFoco("simples")], ["Juros compostos", brl(Cp(t) - C), "#ffad7a", () => setFoco("compostos")], ["Diferença", brl(Cp(t) - S(t)), "#f5d76e", () => setFoco("compostos")], ["Montante simples", brl(S(t)), "#eef0e8", () => setFoco("simples")]]} />}
      fala={falas[foco] || falas.inicio} missoes={missoes} />
  );
}

/* ───────── Regra de três direta e inversa */
export function RegraTres() {
  const [tipo, setTipo] = useState("direta"); const [x, setX] = useState(4); const [foco, setFoco] = useState("inicio");
  const D = { direta: { a: 2, b: 10, ua: "litros de tinta", ub: "m² pintados", ic: "🪣" }, inversa: { a: 4, b: 12, ua: "operários", ub: "dias de obra", ic: "👷" } }[tipo];
  const y = tipo === "direta" ? (D.b * x) / D.a : (D.a * D.b) / x;
  const falas = {
    inicio: { titulo: "Regra de três", txt: `Sabemos que ${D.a} ${D.ua} → ${D.b} ${D.ub}. Mude a quantidade e veja a outra se ajustar. Toque nas setas ou nos números.`, dica: tipo === "direta" ? "dobre a tinta e veja dobrar a área." : "dobre os operários e veja os dias caírem pela metade." },
    setas: tipo === "direta" ? { titulo: "Diretamente proporcional", txt: "Se uma grandeza aumenta e a outra aumenta na mesma proporção, as setas apontam para o mesmo lado. Aí é só multiplicar cruzado.", conta: `${D.a}/${x} = ${D.b}/y  →  ${D.a} × y = ${x} × ${D.b}  →  y = ${fmt(y, 2)}` }
      : { titulo: "Inversamente proporcional", txt: "Mais operários terminam em menos dias: uma sobe, a outra desce. Setas em sentidos opostos. Antes de multiplicar cruzado, inverta uma das razões.", conta: `${D.a} × ${D.b} = ${x} × y  →  y = ${D.a * D.b} ÷ ${x} = ${fmt(y, 2)}`, dica: "na inversa, o produto das duas grandezas fica sempre igual." },
    valor: { titulo: `${x} ${D.ua} → ${fmt(y, 2)} ${D.ub}`, txt: tipo === "direta" ? `Cada ${D.ua.replace(/s$/, "").replace("litros", "litro")} rende ${fmt(D.b / D.a, 2)} ${D.ub}. É a constante da proporção.` : `O trabalho total é sempre ${D.a * D.b} (operários × dias). Dividindo pelo número de operários, sai o número de dias.`, conta: tipo === "direta" ? `y = ${x} × ${fmt(D.b / D.a, 2)} = ${fmt(y, 2)}` : `y = ${D.a * D.b} ÷ ${x} = ${fmt(y, 2)}` },
  };
  const missoes = tipo === "direta" ? [{ txt: "Descubra quantos m² pintam 7 litros", ok: x === 7 }, { txt: "Ache quantos litros pintam 30 m²", ok: quase(y, 30, .001) }, { txt: "Troque para regra de três inversa", ok: false }] : [{ txt: "Com 6 operários, quantos dias?", ok: x === 6 }, { txt: "Ache quantos operários fazem em 4 dias", ok: quase(y, 4, .001) }, { txt: "Repare: operários × dias = 48 sempre", ok: true }];
  const linhaIc = (n, max, ic, yy) => <text x="40" y={yy} fontSize="20">{ic.repeat(Math.min(n, max))}{n > max ? "…" : ""}</text>;
  return (
    <Experimento
      palco={<Palco w={360} h={220} label={`${x} ${D.ua} correspondem a ${fmt(y, 2)} ${D.ub}`}>
        <text x="20" y="34" fill="#a5b0a8" fontSize="15">{D.ua}</text><text x="210" y="34" fill="#a5b0a8" fontSize="15">{D.ub}</text>
        <text x="40" y="70" fill="#eef0e8" fontSize="24">{D.a}</text><text x="230" y="70" fill="#eef0e8" fontSize="24">{D.b}</text>
        <Toque label="Valor que você escolheu e o resultado" onToque={() => setFoco("valor")}><text x="40" y="120" fill="#8cc4ff" fontSize="28">{x}</text><text x="230" y="120" fill="#f5d76e" fontSize="28">{fmt(y, 2)}</text></Toque>
        <Toque label={tipo === "direta" ? "Setas no mesmo sentido: direta" : "Setas em sentidos opostos: inversa"} onToque={() => setFoco("setas")}>
          <rect x="140" y="40" width="70" height="90" fill="transparent" />
          <path d="M160 50 V120 M152 110 L160 122 L168 110" stroke="#c8dd6e" strokeWidth="3" fill="none" />
          {tipo === "direta" ? <path d="M190 50 V120 M182 110 L190 122 L198 110" stroke="#c8dd6e" strokeWidth="3" fill="none" /> : <path d="M190 120 V50 M182 60 L190 48 L198 60" stroke="#ff8a7a" strokeWidth="3" fill="none" />}
        </Toque>
        {linhaIc(x, 12, D.ic, 172)}
        <g transform="translate(40 188)">{Array.from({ length: Math.min(40, Math.round(y)) }, (_, k) => <rect key={k} x={k * 7.5} y="0" width="6" height="14" rx="1.5" fill="#f5d76e" fillOpacity=".8" />)}</g>
      </Palco>}
      controles={<><Seg rot="Tipo" v={tipo} set={(v) => { setTipo(v); setX(v === "direta" ? 4 : 4); setFoco("setas"); }} ops={[["direta", "Direta (tinta)"], ["inversa", "Inversa (obra)"]]} />
        <Deslizar rot={D.ua} v={x} min={1} max={12} onChange={setX} fmtV={(v) => v} onFoco={() => setFoco("valor")} /></>}
      leituras={<Leituras itens={[["Você escolheu", `${x}`, "#8cc4ff", () => setFoco("valor")], ["Resultado", fmt(y, 2), "#f5d76e", () => setFoco("valor")], ["Tipo", tipo, "#c8dd6e", () => setFoco("setas")], [tipo === "direta" ? "Razão" : "Produto", tipo === "direta" ? fmt(D.b / D.a, 2) : D.a * D.b, "#eef0e8", () => setFoco("setas")]]} />}
      fala={falas[foco]} missoes={missoes.filter((m) => m.txt !== "Repare: operários × dias = 48 sempre" && m.txt !== "Troque para regra de três inversa")} />
  );
}

/* ───────── MMC e MDC: saltos na reta */
export function MMC() {
  const [a, setA] = useState(4), [b, setB] = useState(6); const [foco, setFoco] = useState("inicio");
  const M = mmc(a, b), G = mdc(a, b), lim = Math.max(36, Math.min(72, M + a));
  const W = 360, X0 = 16, esc = (W - 32) / lim, px = (v) => X0 + v * esc;
  const divs = (n) => Array.from({ length: n }, (_, k) => k + 1).filter((k) => n % k === 0);
  const falas = {
    inicio: { titulo: "Dois sapos pulando", txt: `O sapo azul pula de ${a} em ${a}; o laranja, de ${b} em ${b}. Onde eles caem juntos pela primeira vez é o MMC. Toque nos pontos amarelos.`, dica: "problema de ônibus que saem juntos de novo é sempre MMC." },
    mmc: { titulo: `MMC(${a}, ${b}) = ${M}`, txt: "Menor Múltiplo Comum: o primeiro número que aparece nas duas listas de múltiplos. Na prova: 'quando acontecem juntos de novo?'.", conta: `${a}: ${Array.from({ length: Math.min(8, M / a) }, (_, k) => a * (k + 1)).join(", ")} · ${b}: ${Array.from({ length: Math.min(8, M / b) }, (_, k) => b * (k + 1)).join(", ")}` },
    mdc: { titulo: `MDC(${a}, ${b}) = ${G}`, txt: "Máximo Divisor Comum: o maior número que divide os dois sem sobrar. Na prova: 'cortar em pedaços iguais, do maior tamanho possível'.", conta: `divisores de ${a}: ${divs(a).join(", ")} · de ${b}: ${divs(b).join(", ")}`, dica: "MMC × MDC = a × b. Confira: " + `${M} × ${G} = ${a * b}` },
  };
  const missoes = [{ txt: "Ache um par com MMC = 12", ok: M === 12 }, { txt: "Ache dois números primos entre si (MDC = 1)", ok: G === 1 }, { txt: "Ache um par em que o MMC é um dos próprios números", ok: M === Math.max(a, b) && a !== b }];
  const pulos = (n, yy, cor) => Array.from({ length: Math.floor(lim / n) }, (_, k) => { const v0 = k * n, v1 = (k + 1) * n; const comum = v1 % a === 0 && v1 % b === 0;
    return <g key={k}><path d={`M${px(v0)} ${yy} Q${(px(v0) + px(v1)) / 2} ${yy - 26} ${px(v1)} ${yy}`} fill="none" stroke={cor} strokeWidth="2" strokeOpacity=".8" /><circle cx={px(v1)} cy={yy} r={comum ? 6 : 3.5} fill={comum ? "#f5d76e" : cor} /></g>; });
  return (
    <Experimento
      palco={<Palco w={W} h={200} label={`MMC de ${a} e ${b} é ${M}. MDC é ${G}`}>
        <line x1={X0} y1="140" x2={W - 16} y2="140" stroke="#eef0e8" strokeOpacity=".5" />
        {Array.from({ length: lim / 6 + 1 }, (_, k) => <text key={k} x={px(k * 6)} y="162" fill="#a5b0a8" fontSize="12" textAnchor="middle">{k * 6}</text>)}
        {pulos(a, 90, "#8cc4ff")}{pulos(b, 140, "#ffad7a")}
        <Toque label={`Primeiro encontro em ${M}`} onToque={() => setFoco("mmc")}><line x1={px(M)} y1="50" x2={px(M)} y2="150" stroke="#f5d76e" strokeWidth="2" strokeDasharray="4 4" /><rect x={px(M) - 22} y="16" width="44" height="26" rx="8" fill="#f5d76e" /><text x={px(M)} y="35" fill="#2a2206" fontSize="16" textAnchor="middle">{M}</text><rect x={px(M) - 20} y="40" width="40" height="120" fill="transparent" /></Toque>
        <Toque label={`MDC ${G}`} onToque={() => setFoco("mdc")}><text x={W - 16} y="190" fill="#c8dd6e" fontSize="15" textAnchor="end">MDC = {G}</text><rect x={W - 110} y="172" width="100" height="24" fill="transparent" /></Toque>
      </Palco>}
      controles={<><Deslizar rot="Pulo do azul" v={a} min={2} max={12} onChange={setA} fmtV={(x) => x} onFoco={() => setFoco("mmc")} /><Deslizar rot="Pulo do laranja" v={b} min={2} max={12} onChange={setB} fmtV={(x) => x} cor="#ffad7a" onFoco={() => setFoco("mmc")} /></>}
      leituras={<Leituras itens={[["MMC", M, "#f5d76e", () => setFoco("mmc")], ["MDC", G, "#c8dd6e", () => setFoco("mdc")], ["a × b", a * b, "#eef0e8", () => setFoco("mdc")], ["MMC × MDC", M * G, "#eef0e8", () => setFoco("mdc")]]} />}
      fala={falas[foco]} missoes={missoes} />
  );
}

/* ───────── Probabilidade: urna com bolinhas */
export function Probabilidade() {
  const [az, setAz] = useState(3), [vm, setVm] = useState(5); const [foco, setFoco] = useState("inicio");
  const [tir, setTir] = useState({ az: 0, vm: 0, ult: null });
  const tot = az + vm, pa = az / tot;
  const bolas = useMemo(() => Array.from({ length: tot }, (_, k) => ({ cor: k < az ? "az" : "vm", x: 70 + ((k * 47) % 140) + (k % 2) * 8, y: 170 - Math.floor(k / 5) * 22 - (k % 3) * 4 })), [az, vm]);
  const sortear = (n = 1) => setTir((t) => { let a = t.az, v = t.vm, u = null; for (let k = 0; k < n; k++) { u = Math.random() < pa ? "az" : "vm"; u === "az" ? a++ : v++; } return { az: a, vm: v, ult: u }; });
  const nt = tir.az + tir.vm, g = mdc(az, tot);
  const falas = {
    inicio: { titulo: "Probabilidade = casos que eu quero ÷ total", txt: "Mude quantas bolinhas azuis e vermelhas há na urna e sorteie. Toque nas bolinhas ou nos resultados.", dica: "sorteie 100 vezes e veja a frequência chegar perto da conta." },
    azul: { titulo: `P(azul) = ${az}/${tot}${g > 1 ? ` = ${az / g}/${tot / g}` : ""}`, txt: `Há ${az} azuis num total de ${tot} bolinhas. Cada bolinha tem a mesma chance, então a probabilidade é favoráveis sobre o total.`, conta: `${az} ÷ ${tot} = ${fmt(pa, 3)} = ${fmt(pa * 100)}%` },
    vermelha: { titulo: `P(vermelha) = ${vm}/${tot}`, txt: "A probabilidade do contrário (o complementar) é 1 menos a do evento. As duas sempre somam 100%.", conta: `1 − ${fmt(pa, 3)} = ${fmt(1 - pa, 3)} = ${fmt((1 - pa) * 100)}%` },
    sorteio: nt ? { titulo: `${nt} sorteios: ${fmt((tir.az / nt) * 100)}% azuis`, txt: `A conta diz ${fmt(pa * 100)}%. Com poucos sorteios a frequência varia muito; com muitos, ela se aproxima da probabilidade. Cada sorteio devolve a bolinha para a urna.`, conta: `frequência = ${tir.az} ÷ ${nt} = ${fmt(tir.az / nt, 3)}` } : { titulo: "Sorteie!", txt: "Toque em Sortear 1 ou Sortear 100." },
  };
  const missoes = [{ txt: "Deixe P(azul) = 50%", ok: az === vm }, { txt: "Deixe P(vermelha) = 1/4", ok: vm * 4 === tot }, { txt: "Faça 100 sorteios ou mais", ok: nt >= 100 }];
  return (
    <Experimento
      palco={<Palco w={360} h={220} label={`Urna com ${az} azuis e ${vm} vermelhas`}>
        <path d="M50 60 Q50 200 140 200 Q230 200 230 60" fill="#eef0e8" fillOpacity=".04" stroke="#eef0e8" strokeWidth="3" filter="url(#giz)" />
        {bolas.map((b, k) => <Toque key={k} label={b.cor === "az" ? "Bolinha azul" : "Bolinha vermelha"} onToque={() => setFoco(b.cor === "az" ? "azul" : "vermelha")}><circle cx={b.x} cy={b.y} r="10" fill={b.cor === "az" ? "#8cc4ff" : "#ff8a7a"} stroke="#0f1513" strokeWidth="2" /></Toque>)}
        <Toque label="Resultado dos sorteios" onToque={() => setFoco("sorteio")}>
          <text x="250" y="60" fill="#a5b0a8" fontSize="14">último</text>
          {tir.ult && <motion.circle key={nt} cx="290" cy="92" r="16" initial={{ scale: 0 }} animate={{ scale: 1 }} fill={tir.ult === "az" ? "#8cc4ff" : "#ff8a7a"} />}
          <text x="250" y="140" fill="#8cc4ff" fontSize="16">azul {tir.az}</text><text x="250" y="162" fill="#ff8a7a" fontSize="16">verm. {tir.vm}</text>
          <rect x="246" y="40" width="110" height="130" fill="transparent" /></Toque>
      </Palco>}
      controles={<>
        <Deslizar rot="Azuis" v={az} min={0} max={10} onChange={(v) => { setAz(Math.max(v, vm ? 0 : 1)); setTir({ az: 0, vm: 0, ult: null }); }} fmtV={(x) => x} onFoco={() => setFoco("azul")} />
        <Deslizar rot="Vermelhas" v={vm} min={0} max={10} onChange={(v) => { setVm(Math.max(v, az ? 0 : 1)); setTir({ az: 0, vm: 0, ult: null }); }} fmtV={(x) => x} cor="#ff8a7a" onFoco={() => setFoco("vermelha")} />
        <div className="flex flex-wrap gap-2 sm:col-span-2"><Button size="sm" onClick={() => { sortear(1); setFoco("sorteio"); }}><Shuffle /> Sortear 1</Button><Button size="sm" variant="secondary" onClick={() => { sortear(100); setFoco("sorteio"); }}>Sortear 100</Button><Button size="sm" variant="ghost" onClick={() => setTir({ az: 0, vm: 0, ult: null })}><RotateCcw /> Zerar</Button></div>
      </>}
      leituras={<Leituras itens={[["P(azul)", `${fmt(pa * 100)}%`, "#8cc4ff", () => setFoco("azul")], ["P(vermelha)", `${fmt((1 - pa) * 100)}%`, "#ff8a7a", () => setFoco("vermelha")], ["Sorteios", nt, "#eef0e8", () => setFoco("sorteio")], ["Freq. azul", nt ? `${fmt((tir.az / nt) * 100)}%` : "—", "#f5d76e", () => setFoco("sorteio")]]} />}
      fala={falas[foco]} missoes={missoes} />
  );
}
