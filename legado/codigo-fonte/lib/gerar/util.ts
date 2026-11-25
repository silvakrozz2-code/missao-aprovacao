// Utilidades compartilhadas pelos geradores de questões.

export interface Rng {
  /** número em [0, 1) */
  next(): number;
  /** inteiro em [a, b] (inclusivo) */
  int(a: number, b: number): number;
  pick<T>(arr: readonly T[]): T;
  shuffle<T>(arr: readonly T[]): T[];
  bool(p?: number): boolean;
}

/** PRNG com semente (mulberry32): a mesma semente gera sempre a mesma questão. */
export function criarRng(seed: number): Rng {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (a: number, b: number) => a + Math.floor(next() * (b - a + 1));
  return {
    next,
    int,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle: (arr) => {
      const c = [...arr];
      for (let i = c.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [c[i], c[j]] = [c[j], c[i]];
      }
      return c;
    },
    bool: (p = 0.5) => next() < p,
  };
}

/** Arredonda removendo ruído de ponto flutuante. */
export const r = (n: number, casas = 2) => {
  const f = 10 ** casas;
  return Math.round((n + Number.EPSILON) * f) / f;
};

const nfCache = new Map<string, Intl.NumberFormat>();
function nf(min: number, max: number) {
  const k = `${min}-${max}`;
  let f = nfCache.get(k);
  if (!f) {
    f = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: min, maximumFractionDigits: max });
    nfCache.set(k, f);
  }
  return f;
}

/** Número no padrão brasileiro: 1.234,5 */
export const fmt = (n: number, maxCasas = 2) => nf(0, maxCasas).format(r(n, maxCasas));
/** Valor em reais: R$ 1.234,50 */
export const brl = (n: number) => `R$ ${nf(2, 2).format(r(n, 2))}`;
/** Porcentagem: 12,5% */
export const pct = (n: number) => `${fmt(n, 2)}%`;

export const mdc = (a: number, b: number): number => (b === 0 ? Math.abs(a) : mdc(b, a % b));
export const mmc = (a: number, b: number) => (a / mdc(a, b)) * b;

/** Fração simplificada como texto: "3/8" (ou "1" e "0"). */
export function fracao(num: number, den: number): string {
  if (num === 0) return "0";
  const g = mdc(num, den);
  const n = num / g;
  const d = den / g;
  return d === 1 ? `${n}` : `${n}/${d}`;
}

export interface Distrator {
  txt: string;
  erro: string;
}

export interface Montagem {
  alternativas: string[];
  correta: number;
  erros: (string | null)[];
}

/**
 * Monta 5 alternativas: a correta + até 4 distratores (erros comuns).
 * Distratores repetidos ou iguais à correta são descartados; se faltar,
 * completa com valores vizinhos gerados por `extra`.
 */
export function montar(
  rng: Rng,
  correta: string,
  distratores: Distrator[],
  extra?: (i: number) => string,
): Montagem {
  const usados = new Set<string>([correta]);
  const escolhidos: Distrator[] = [];
  for (const d of distratores) {
    if (escolhidos.length === 4) break;
    if (!d.txt || usados.has(d.txt)) continue;
    usados.add(d.txt);
    escolhidos.push(d);
  }
  let i = 1;
  while (escolhidos.length < 4 && extra && i < 200) {
    const t = extra(i++);
    if (t && !usados.has(t)) {
      usados.add(t);
      escolhidos.push({ txt: t, erro: "Este valor não sai de nenhum raciocínio válido. Refaça a conta com calma seguindo os passos." });
    }
  }
  if (escolhidos.length < 4) throw new Error(`Alternativas insuficientes para "${correta}"`);
  const todos = rng.shuffle([{ txt: correta, erro: null as string | null }, ...escolhidos]);
  return {
    alternativas: todos.map((t) => t.txt),
    correta: todos.findIndex((t) => t.erro === null),
    erros: todos.map((t) => t.erro),
  };
}

/** Gerador de vizinhos numéricos para completar alternativas. */
export const vizinhos =
  (valor: number, passo: number, formatar: (n: number) => string, minimo = 0) =>
  (i: number) => {
    const k = Math.ceil(i / 2) * (i % 2 ? 1 : -1);
    const v = valor + k * passo;
    return v > minimo ? formatar(v) : "";
  };
