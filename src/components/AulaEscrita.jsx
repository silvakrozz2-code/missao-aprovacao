import { useState } from "react";
import { BookOpen, Check, X, Target, AlertTriangle, ListChecks, Map as MapaIc } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Card } from "@/components/ui/card.jsx";
import { AULAS } from "@/nucleo/aulas.js";
import { Macete, LETRAS } from "@/telas/comum.jsx";

/* ───────── texto: destaca as palavras em CAIXA ALTA, como o professor sublinha no quadro */
function Rico({ txt }) {
  const partes = String(txt).split(/(\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,}(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,})*\b)/);
  return partes.map((p, i) => (i % 2 ? <mark key={i} className="rounded bg-[color-mix(in_srgb,var(--marca)_22%,transparent)] px-0.5 font-bold text-giz">{p}</mark> : p));
}

/* ───────── esquemas em SVG (desenhados para caber no celular) */
const W = 360;
function quebra(txt, max) {
  const out = []; let l = "";
  for (const w of String(txt).split(/\s+/)) { if ((l + " " + w).trim().length > max && l) { out.push(l); l = w; } else l = (l + " " + w).trim(); }
  if (l) out.push(l); return out;
}
const fonte = { fontFamily: "var(--font-sans)" };

function Mapa({ e }) {
  const raizL = quebra(e.raiz, 30); const raizH = 20 + raizL.length * 20;
  let y = raizH + 26; const ramos = e.ramos.map(([nome, det]) => {
    const dl = det ? quebra(det, 36) : []; const h = 18 + 20 + dl.length * 18 + (dl.length ? 4 : 0); const r = { nome, dl, y, h }; y += h + 12; return r;
  });
  const H = y; const fimEspinha = ramos.length ? ramos[ramos.length - 1].y + 24 : raizH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${e.titulo}: ${e.raiz}, ${e.ramos.map((r) => r[0]).join(", ")}`} className="w-full" style={fonte}>
      <rect x="2" y="2" width={W - 4} height={raizH} rx="14" style={{ fill: "var(--acc)" }} />
      {raizL.map((l, i) => <text key={i} x={W / 2} y={28 + i * 20} textAnchor="middle" style={{ fill: "var(--sobre-acc)", fontWeight: 700, fontSize: 17 }}>{l}</text>)}
      <path d={`M24 ${raizH + 2} V ${fimEspinha}`} style={{ stroke: "var(--risco-2)", strokeWidth: 2.5, fill: "none" }} />
      {ramos.map((r, k) => (
        <g key={k}>
          <path d={`M24 ${r.y + 24} H 48`} style={{ stroke: "var(--risco-2)", strokeWidth: 2.5 }} />
          <circle cx="24" cy={r.y + 24} r="5" style={{ fill: "var(--marca)" }} />
          <rect x="48" y={r.y} width={W - 50} height={r.h} rx="12" style={{ fill: "var(--folha-2)", stroke: "var(--risco-2)" }} />
          <text x="62" y={r.y + 26} style={{ fill: "var(--marca)", fontWeight: 700, fontSize: 16 }}>{r.nome}</text>
          {r.dl.map((l, i) => <text key={i} x="62" y={r.y + 47 + i * 18} style={{ fill: "var(--giz)", fontSize: 14 }}>{l}</text>)}
        </g>
      ))}
    </svg>
  );
}

function Comparar({ e }) {
  const n = e.cols.length, gap = n > 2 ? 8 : 12, cw = (W - 4 - gap * (n - 1)) / n, max = Math.floor((cw - 18) / 7.2);
  const cols = e.cols.map(([nome, itens]) => ({ nl: quebra(nome, max), it: itens.map((t) => quebra(t, max - 1)) }));
  const cabH = Math.max(...cols.map((c) => c.nl.length)) * 19 + 18;
  const corpoH = Math.max(...cols.map((c) => c.it.reduce((s, l) => s + l.length * 17 + 10, 0))) + 14;
  const H = cabH + corpoH + 4; const cores = ["var(--acc)", "var(--marca)", "var(--certo)"];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${e.titulo}: ${e.cols.map(([a, b]) => `${a}: ${b.join("; ")}`).join(". ")}`} className="w-full" style={fonte}>
      {cols.map((c, k) => { const x = 2 + k * (cw + gap); let yy = cabH + 22; return (
        <g key={k}>
          <rect x={x} y="2" width={cw} height={H - 4} rx="12" style={{ fill: "var(--folha-2)", stroke: "var(--risco-2)" }} />
          <rect x={x} y="2" width={cw} height={cabH} rx="12" style={{ fill: cores[k % 3] }} />
          {c.nl.map((l, i) => <text key={i} x={x + cw / 2} y={24 + i * 19} textAnchor="middle" style={{ fill: "var(--lousa)", fontWeight: 700, fontSize: 15 }}>{l}</text>)}
          {c.it.map((linhas, j) => { const y0 = yy; yy += linhas.length * 17 + 10; return (
            <g key={j}><circle cx={x + 10} cy={y0 - 5} r="2.6" style={{ fill: cores[k % 3] }} />
              {linhas.map((l, i) => <text key={i} x={x + 18} y={y0 + i * 17} style={{ fill: "var(--giz)", fontSize: 13 }}>{l}</text>)}</g>); })}
        </g>); })}
    </svg>
  );
}

function Etapas({ e }) {
  let y = 2; const ps = e.passos.map(([nome, det]) => { const dl = det ? quebra(det, 34) : []; const h = Math.max(46, 30 + dl.length * 18); const r = { nome, dl, y, h }; y += h + 22; return r; });
  const H = y - 18;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${e.titulo}: ${e.passos.map((p, i) => `${i + 1}. ${p[0]}${p[1] ? ", " + p[1] : ""}`).join("; ")}`} className="w-full" style={fonte}>
      {ps.map((p, k) => (
        <g key={k}>
          {k < ps.length - 1 && <path d={`M30 ${p.y + p.h} V ${p.y + p.h + 18} M24 ${p.y + p.h + 11} L30 ${p.y + p.h + 19} L36 ${p.y + p.h + 11}`} style={{ stroke: "var(--risco-2)", strokeWidth: 2.5, fill: "none" }} />}
          <rect x="2" y={p.y} width={W - 4} height={p.h} rx="12" style={{ fill: "var(--folha-2)", stroke: "var(--risco-2)" }} />
          <circle cx="30" cy={p.y + p.h / 2} r="15" style={{ fill: "var(--acc)" }} />
          <text x="30" y={p.y + p.h / 2 + 5} textAnchor="middle" style={{ fill: "var(--sobre-acc)", fontWeight: 700, fontSize: 15 }}>{k + 1}</text>
          <text x="56" y={p.y + (p.dl.length ? 22 : p.h / 2 + 6)} style={{ fill: "var(--giz)", fontWeight: 700, fontSize: 16 }}>{p.nome}</text>
          {p.dl.map((l, i) => <text key={i} x="56" y={p.y + 41 + i * 18} style={{ fill: "var(--apagado)", fontSize: 14 }}>{l}</text>)}
        </g>
      ))}
    </svg>
  );
}

function Esquema({ e }) {
  const C = e.tipo === "comparar" ? Comparar : e.tipo === "etapas" ? Etapas : Mapa;
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="mao text-xl text-marca">{e.titulo}</figcaption>
      <div className="mx-auto w-full max-w-[520px]"><C e={e} /></div>
    </figure>
  );
}

// Esquema automático para temas sem aula escrita própria: cada linha do resumo vira um ramo.
function esquemaDoResumo(tema, r) {
  const ramos = r.t.slice(0, 7).map((l) => {
    const m = l.match(/^([^:.]{3,42}):\s*(.+)$/);
    if (m) return [m[1].trim(), m[2].length > 120 ? m[2].slice(0, 117).replace(/\s+\S*$/, "") + "…" : m[2]];
    const caps = l.match(/\b[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{3,}(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,})*\b/);
    const nome = caps ? caps[0].charAt(0) + caps[0].slice(1).toLowerCase() : l.split(/\s+/).slice(0, 4).join(" ");
    return [nome, l.length > 120 ? l.slice(0, 117).replace(/\s+\S*$/, "") + "…" : l];
  });
  return { tipo: "mapa", titulo: "O tema num esquema", raiz: tema, ramos };
}

/* ───────── questão de prova comentada (toca para responder) */
function ExemploProva({ q, k }) {
  const [esc, setEsc] = useState(null); const resp = esc != null;
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-risco bg-folha-2 p-4">
      <span className="text-xs font-bold uppercase tracking-wide text-apagado">Questão {k + 1} · estilo FAFIPA{q.alta ? " · cai muito" : ""}</span>
      <p className="font-bold leading-snug">{q.enunciado}</p>
      <ol className="flex flex-col gap-1.5">
        {q.alternativas.map((a, i) => { const certa = i === q.correta; return (
          <li key={i}><button type="button" disabled={resp} onClick={() => setEsc(i)}
            className={cn("flex w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors", !resp && "border-risco-2 hover:bg-folha-3", resp && certa && "border-certo bg-certo-suave", resp && esc === i && !certa && "border-erro bg-erro-suave", resp && !certa && esc !== i && "border-risco opacity-60")}>
            <b className="num">{LETRAS[i]})</b><span className="flex-1">{a}</span>{resp && certa && <Check className="size-4 shrink-0 text-certo" />}{resp && esc === i && !certa && <X className="size-4 shrink-0 text-erro" />}
          </button></li>); })}
      </ol>
      {resp ? <p className="rounded-xl bg-folha p-3 text-sm leading-relaxed"><b className={esc === q.correta ? "text-certo" : "text-erro"}>{esc === q.correta ? "Acertou. " : `Resposta: ${LETRAS[q.correta]}. `}</b>{q.explicacao}</p>
        : <span className="text-sm text-apagado">Toque numa alternativa para ver o comentário.</span>}
    </div>
  );
}

/* ───────── a aula completa */
export function AulaEscrita({ tema, r, o }) {
  const n = useNucleo(); const a = AULAS[tema] || {};
  const esquemas = a.esquemas?.length ? a.esquemas : [esquemaDoResumo(tema, r)];
  const qs = n.BANCO[o].filter((q) => q.tema === tema).sort((x, y) => (y.alta - x.alta) || (x.nivel - y.nivel)).slice(0, 2);
  const palavras = [a.abre, ...r.t, ...(a.exemplos || []).flat(), ...(a.pegadinhas || []).flat(), r.cai, r.macete].join(" ").split(/\s+/).length;
  const min = Math.max(3, Math.round(palavras / 170) + qs.length * 2);
  const Sec = ({ ic: Ic, t, children }) => (<section className="flex flex-col gap-3"><h3 className="flex items-center gap-2 text-lg font-bold"><Ic className="size-5 text-acc" />{t}</h3>{children}</section>);
  return (
    <Card className="gap-6">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-sm font-bold text-apagado"><BookOpen className="size-4" /> Aula escrita · cerca de <span className="num">{min}</span> min de leitura</span>
        <h2 className="text-2xl font-bold leading-tight">{tema}</h2>
        <p className="text-base leading-relaxed text-apagado">{a.abre || `Esta aula reúne o essencial de ${tema} para a prova: a explicação por partes, um esquema para memorizar, questões comentadas e o que a banca mais cobra. Leia com o caderno aberto e copie o esquema à mão.`}</p>
      </div>

      <Sec ic={MapaIc} t="Esquema para copiar no caderno">{esquemas.map((e, i) => <Esquema key={i} e={e} />)}</Sec>

      <Sec ic={ListChecks} t="A explicação, por partes">
        <ol className="flex flex-col gap-3">
          {r.t.map((l, i) => (
            <li key={i} className="flex gap-3"><span className="num mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-folha-3 text-sm font-bold">{i + 1}</span><p className="leading-relaxed"><Rico txt={l} /></p></li>
          ))}
        </ol>
      </Sec>

      {a.exemplos?.length > 0 && (
        <Sec ic={Target} t="Na prática, na Prefeitura">
          <div className="grid gap-2 md:grid-cols-2">
            {a.exemplos.map(([caso, res], i) => (
              <div key={i} className="flex flex-col gap-1 rounded-2xl border border-risco bg-folha-2 p-3">
                <span className="text-sm leading-snug">{caso}</span>
                <span className="mao text-lg leading-snug text-marca">→ {res}</span>
              </div>
            ))}
          </div>
        </Sec>
      )}

      <Sec ic={AlertTriangle} t="O que mais cai na FAFIPA">
        <p className="leading-relaxed"><Rico txt={r.cai} /></p>
        {a.pegadinhas?.length > 0 && (
          <ul className="flex flex-col gap-2">
            {a.pegadinhas.map(([errado, certo], i) => (
              <li key={i} className="rounded-2xl border border-risco bg-folha-2 p-3 text-sm leading-relaxed">
                <span className="flex gap-2"><X className="mt-0.5 size-4 shrink-0 text-erro" /><s className="text-apagado decoration-erro/70">{errado}</s></span>
                <span className="mt-1 flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-certo" /><span><Rico txt={certo} /></span></span>
              </li>
            ))}
          </ul>
        )}
        {r.macete && <Macete>{r.macete}</Macete>}
      </Sec>

      {qs.length > 0 && <Sec ic={Check} t="Teste agora, como na prova">{qs.map((q, i) => <ExemploProva key={q.id} q={q} k={i} />)}</Sec>}
    </Card>
  );
}
