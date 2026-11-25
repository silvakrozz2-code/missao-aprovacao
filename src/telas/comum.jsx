import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib-utils";

export const LETRAS = ["A", "B", "C", "D", "E"];

/* Alternativas no estilo "bolha de gabarito": a letra vira a marca de caneta quando você escolhe. */
export function Alternativas({ q, resp, onEscolher, selecionada, travar }) {
  return (
    <div className="flex flex-col gap-2.5" role="group" aria-label="Alternativas">
      {q.alternativas.map((a, k) => {
        const certa = resp && k === q.correta, errada = resp && k === resp.esc && !resp.ok;
        const sel = !resp && selecionada === k;
        const why = errada && q.erros?.[k];
        return (
          <motion.button key={k} type="button" disabled={!!resp || travar || !onEscolher} onClick={() => onEscolher?.(k)}
            aria-label={`Alternativa ${LETRAS[k]}: ${a}`}
            animate={errada ? { x: [0, -6, 6, -3, 0] } : certa ? { scale: [1, 1.015, 1] } : {}}
            transition={{ duration: .35 }}
            className={cn("group grid grid-cols-[36px_minmax(0,1fr)] items-start gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-[1.02rem] leading-snug transition-colors",
              certa ? "border-certo bg-certo-suave" : errada ? "border-erro bg-erro-suave" : sel ? "border-acc bg-folha-2" : "border-risco bg-folha hover:border-risco-2 hover:bg-folha-2",
              (resp || !onEscolher) && !certa && !errada && "opacity-80")}>
            <span className={cn("mao grid size-9 place-items-center rounded-full border-2 text-lg font-bold transition-colors",
              certa ? "border-certo bg-certo text-lousa" : errada ? "border-erro bg-erro text-white" : sel ? "border-acc bg-acc text-sobre-acc" : "border-risco-2 text-apagado group-hover:border-giz group-hover:text-giz")}>
              {certa ? <Check className="size-5" strokeWidth={3} /> : errada ? <X className="size-5" strokeWidth={3} /> : LETRAS[k]}
            </span>
            <span className="min-w-0 pt-1.5">{a}{why && <span className="mt-1.5 block text-sm text-erro">{why}</span>}</span>
          </motion.button>);
      })}
    </div>
  );
}

export function Tabela({ q }) {
  if (!q.tabela) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-risco">
      <table className="w-full border-collapse text-sm">
        <thead><tr>{q.tabela.cabecalho.map((h, i) => <th key={i} className="bg-folha-2 px-3 py-2 text-left font-bold">{h}</th>)}</tr></thead>
        <tbody>{q.tabela.linhas.map((l, i) => <tr key={i} className="border-t border-risco">{l.map((c, j) => <td key={j} className="num px-3 py-2">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function Figura({ fg }) {
  if (!fg) return null;
  const t = { fontSize: 13, fill: "currentColor" };
  let svg = null;
  if (fg.tipo === "circulo") svg = <svg viewBox="0 0 200 140" role="img" aria-label={`Círculo ${fg.rotulo}`}><circle cx="100" cy="70" r="55" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="100" y1="70" x2="155" y2="70" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" /><circle cx="100" cy="70" r="3" fill="currentColor" /><text x="104" y="62" {...t}>{fg.rotulo}</text></svg>;
  if (fg.tipo === "triangulo") svg = <svg viewBox="0 0 220 150" role="img" aria-label={`Triângulo de base ${fg.base} e altura ${fg.altura}`}><polygon points="20,130 200,130 80,20" fill="none" stroke="currentColor" strokeWidth="2" /><line x1="80" y1="20" x2="80" y2="130" stroke="currentColor" strokeDasharray="4 3" /><text x="100" y="146" {...t}>{fg.base}</text><text x="86" y="80" {...t}>{fg.altura}</text></svg>;
  if (fg.tipo === "tales") svg = <svg viewBox="0 0 240 160" role="img" aria-label="Teorema de Tales"><line x1="10" y1="30" x2="230" y2="30" stroke="currentColor" /><line x1="10" y1="80" x2="230" y2="80" stroke="currentColor" /><line x1="10" y1="140" x2="230" y2="140" stroke="currentColor" /><line x1="50" y1="15" x2="80" y2="155" stroke="currentColor" strokeWidth="2" /><line x1="150" y1="15" x2="210" y2="155" stroke="currentColor" strokeWidth="2" /><text x="40" y="60" {...t} fontSize="12">{fg.a}</text><text x="50" y="115" {...t} fontSize="12">{fg.b}</text><text x="186" y="60" {...t} fontSize="12">{fg.c}</text><text x="200" y="115" {...t} fontSize="12">x</text></svg>;
  return svg ? <div className="mx-auto w-full max-w-xs text-giz">{svg}</div> : null;
}

export function Passos({ passos, className }) {
  return (
    <ol className={cn("flex flex-col gap-2", className)}>
      {passos.map((s, i) => (
        <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .04 * i }} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2.5">
          <span className="mao grid size-7 place-items-center rounded-full bg-folha-3 text-marca">{i + 1}</span><span className="pt-0.5">{s}</span>
        </motion.li>))}
    </ol>
  );
}

export const Macete = ({ rot = "Macete", children }) => (
  <div className="rounded-2xl border-l-4 border-marca bg-[color-mix(in_srgb,var(--marca)_10%,transparent)] px-4 py-3"><b className="mao mr-1 text-lg text-marca">{rot}:</b> {children}</div>
);

export function Veredito({ ok, children }) {
  return (
    <motion.div role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className={cn("mao flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xl font-bold", ok ? "bg-certo-suave text-certo" : "bg-erro-suave text-erro")}>
      {ok ? <Check className="size-6" strokeWidth={3} /> : <X className="size-6" strokeWidth={3} />}{children}
    </motion.div>
  );
}

export const Cabeca = ({ eyebrow, titulo, children }) => (
  <div className="flex flex-col gap-1.5"><span className="text-sm font-bold text-apagado">{eyebrow}</span><h1 className="font-display text-4xl font-extrabold leading-tight">{titulo}</h1>{children && <p className="max-w-prose text-apagado">{children}</p>}</div>
);
