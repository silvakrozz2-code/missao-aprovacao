export type Nivel = "basico" | "intermediario" | "avancado";

export const NIVEL_ROTULO: Record<Nivel, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Nível prova",
};

export type Figura =
  | { tipo: "tales"; a: string; b: string; c: string }
  | { tipo: "circulo"; rotulo: string }
  | { tipo: "triangulo"; base: string; altura: string };

export interface Questao {
  id: string;
  materia: string;
  tema: string;
  nivel: Nivel;
  enunciado: string;
  tabela?: { cabecalho: string[]; linhas: string[][] };
  figura?: Figura;
  alternativas: string[]; // sempre 5 (A–E)
  correta: number; // índice 0–4
  /** Para cada alternativa errada, o raciocínio que leva até ela. null na correta. */
  erros: (string | null)[];
  explicacao: string;
  /** Resolução passo a passo, um passo por linha. */
  passos: string[];
  /** Macete de prova (opcional). */
  macete?: string;
  fonte: string;
  altaChance: boolean;
}

/** Parte da questão que cada gerador produz (o resto vem do cadastro do gerador). */
export type CorpoQuestao = Pick<
  Questao,
  "enunciado" | "tabela" | "figura" | "alternativas" | "correta" | "erros" | "explicacao" | "passos" | "macete"
>;

export interface Gerador {
  id: string;
  materia: string;
  tema: string;
  nivel: Nivel;
  altaChance: boolean;
  gerar(rng: import("./gerar/util.ts").Rng): CorpoQuestao;
}
