import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, FlaskConical } from "lucide-react";
import { useNucleo } from "@/estado.js";
import { cn } from "@/lib-utils";
import { Button } from "@/components/ui/button.jsx";
import { Spotlight } from "@/components/efeitos/efeitos.jsx";
import { LAB } from "@/lab/index.jsx";
import { Cabeca } from "./comum.jsx";

let escolhido = null;
export const abrirLab = (id, ir) => { escolhido = id; ir("lab"); };

export function Bancada({ item, compacto }) {
  const C = item.C;
  return (
    <section aria-label={`Laboratório: ${item.nome}`} className={cn("flex flex-col gap-3", !compacto && "rounded-3xl border border-risco bg-folha p-4 md:p-5")}>
      <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-marca text-marca-tinta"><item.Ic className="size-5" /></span>
        <div className="min-w-0"><b className="block font-display text-xl leading-tight">{item.nome}</b><span className="text-sm text-apagado">{item.desc}</span></div></div>
      <C />
    </section>
  );
}

export default function Lab() {
  const n = useNucleo(); const o = n.getS().obj;
  const [id, setId] = useState(() => escolhido); escolhido = null;
  const temasObj = new Set(Object.keys(n.TEMA_MAT[o]));
  const itens = LAB.filter((x) => x.temas.some((t) => temasObj.has(t)));
  const outros = LAB.filter((x) => !itens.includes(x));
  const item = LAB.find((x) => x.id === id);
  if (item) return (
    <div className="flex flex-col gap-4">
      <Button size="sm" variant="ghost" className="-ml-2 self-start" onClick={() => setId(null)}><ChevronLeft /> Laboratório</Button>
      <h1 className="sr-only">{item.nome}</h1>
      <Bancada item={item} />
      <div className="flex flex-wrap gap-2">{item.temas.filter((t) => temasObj.has(t)).map((t) => <Button key={t} variant="secondary" onClick={() => n.iniciar(n.questoesDoTema(o, t, 0, 10), t)}>Treinar 10 de {t}</Button>)}</div>
    </div>);
  const Cartao = ({ x, k }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .035 * k }}>
      <Spotlight as="button" onClick={() => setId(x.id)} className="flex h-full w-full flex-col gap-3 rounded-2xl border border-risco bg-folha p-4 text-left transition-[transform,border-color] hover:-translate-y-0.5 hover:border-acc">
        <span className="relative grid size-12 place-items-center rounded-2xl bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--acc)_45%,var(--folha-2)),var(--folha-2))] text-giz"><x.Ic className="size-6" /></span>
        <span className="relative"><b className="block text-lg leading-tight">{x.nome}</b><span className="text-sm text-apagado">{x.desc}</span></span>
      </Spotlight>
    </motion.div>);
  return (
    <div className="flex flex-col gap-5">
      <Cabeca eyebrow={n.OBJS[o].nome} titulo="Laboratório">Matemática para mexer com o dedo. Arraste, mude os números e toque em qualquer parte: o tutor explica aquela parte com os valores que estão na tela. Cada experimento tem missões que se completam sozinhas.</Cabeca>
      <div className="grid gap-3 sm:grid-cols-2">{itens.map((x, k) => <Cartao key={x.id} x={x} k={k} />)}</div>
      {outros.length > 0 && <><h2 className="mao text-xl text-marca">de outras provas</h2><div className="grid gap-3 sm:grid-cols-2">{outros.map((x, k) => <Cartao key={x.id} x={x} k={k} />)}</div></>}
    </div>
  );
}
export { FlaskConical };
