// Motor do banco grande: transforma conteúdo escrito à mão (afirmações certas e erradas,
// pares de fatos e frases com lacuna) em geradores de questões no formato das bancas.
// Cada questão sai com gabarito, explicação e o motivo de cada alternativa errada.
// Todo o conteúdo é original, escrito para o app a partir do texto das leis e da matéria.
import type { Gerador, Nivel, CorpoQuestao } from "../lib/tipos.ts";
import type { Rng } from "../lib/gerar/util.ts";

/** Afirmação falsa + a correção que aparece na explicação. */
export type Falsa = [texto: string, correcao: string];

export interface Afirmacoes {
  id: string;
  materia: string;
  tema: string;
  /** Complemento de "Sobre ___, assinale...": ex. "a Lei de Acesso à Informação". */
  sobre: string;
  nivel?: Nivel;
  alta?: boolean;
  v: string[];
  f: Falsa[];
  macete?: string;
  /** Comandos próprios (blocos de frases): pedem a frase certa / a errada / o julgamento. */
  cmd?: { c: string; i: string; j: string };
}

const ROMANOS = ["I", "II", "III", "IV"];
/** Quantos itens de conteúdo foram escritos à mão (afirmações, fatos e frases). */
export const contagem = { itens: 0 };

function amostra<T>(rng: Rng, arr: readonly T[], k: number): T[] {
  return rng.shuffle(arr).slice(0, k);
}

function embaralhar(rng: Rng, certa: string, erradas: { txt: string; erro: string }[]): Pick<CorpoQuestao, "alternativas" | "correta" | "erros"> {
  const todos = rng.shuffle([{ txt: certa, erro: null as string | null }, ...erradas]);
  return { alternativas: todos.map((t) => t.txt), correta: todos.findIndex((t) => t.erro === null), erros: todos.map((t) => t.erro) };
}

const COMECO_C = ["Sobre {s}, assinale a alternativa correta.", "Sobre {s}, é correto afirmar que:", "Considerando {s}, assinale a alternativa CORRETA."];
const COMECO_I = ["Sobre {s}, assinale a alternativa INCORRETA.", "Sobre {s}, é INCORRETO afirmar que:", "Considerando {s}, assinale a alternativa que contém um erro."];
const sobre = (t: string, s: string) => t.replace("{s}", s);

/** Gera três geradores a partir de um bloco de afirmações: correta, incorreta e julgamento I/II/III. */
export function deAfirmacoes(a: Afirmacoes): Gerador[] {
  if (a.v.length < 4 || a.f.length < 4) throw new Error(`Bloco ${a.id} precisa de 4+ certas e 4+ erradas`);
  contagem.itens += a.v.length + a.f.length;
  const base = { materia: a.materia, tema: a.tema, altaChance: a.alta ?? true };
  const nivel = a.nivel ?? "intermediario";
  return [
    {
      ...base, id: `${a.id}-c`, nivel,
      gerar(rng) {
        const certa = rng.pick(a.v);
        const falsas = amostra(rng, a.f, 4);
        return {
          enunciado: a.cmd ? a.cmd.c : sobre(rng.pick(COMECO_C), a.sobre),
          ...embaralhar(rng, certa, falsas.map(([t, c]) => ({ txt: t, erro: `Errada. ${c}` }))),
          explicacao: `A única afirmação correta é: "${certa}"`,
          passos: falsas.map(([t, c], i) => `Alternativa errada ${i + 1}: ${c}`),
          macete: a.macete,
        };
      },
    },
    {
      ...base, id: `${a.id}-i`, nivel,
      gerar(rng) {
        const [falsa, corr] = rng.pick(a.f);
        const certas = amostra(rng, a.v, 4);
        return {
          enunciado: a.cmd ? a.cmd.i : sobre(rng.pick(COMECO_I), a.sobre),
          ...embaralhar(rng, falsa, certas.map((t) => ({ txt: t, erro: "Esta afirmação está certa. A questão pede a INCORRETA: leia o comando com atenção." }))),
          explicacao: `A incorreta é: "${falsa}". ${corr}`,
          passos: ["Comando pede a INCORRETA: marque a que tem erro.", `Erro encontrado: ${corr}`, "As outras quatro estão de acordo com a matéria."],
          macete: "Circule a palavra INCORRETA no comando antes de ler as alternativas.",
        };
      },
    },
    {
      ...base, id: `${a.id}-j`, nivel: "avancado",
      gerar(rng) {
        const n = rng.bool(0.4) ? 4 : 3;
        const qtdV = rng.int(0, n);
        const itens = rng.shuffle([
          ...amostra(rng, a.v, qtdV).map((t) => ({ t, ok: true, c: "" })),
          ...amostra(rng, a.f, n - qtdV).map(([t, c]) => ({ t, ok: false, c })),
        ]);
        const certas = itens.map((x, i) => (x.ok ? ROMANOS[i] : "")).filter(Boolean);
        const rot = (sel: string[]) =>
          sel.length === 0 ? "Nenhuma afirmativa está correta." : sel.length === n ? "Todas as afirmativas estão corretas." : sel.length === 1 ? `Somente a afirmativa ${sel[0]} está correta.` : `Somente as afirmativas ${sel.slice(0, -1).join(", ")} e ${sel.at(-1)} estão corretas.`;
        const correta = rot(certas);
        // distratores: conjuntos vizinhos (troca um item) primeiro, depois quaisquer
        const todosSub: string[][] = [];
        for (let m = 0; m < 1 << n; m++) todosSub.push(ROMANOS.slice(0, n).filter((_, i) => m & (1 << i)));
        const dist = (s: string[]) => ROMANOS.slice(0, n).filter((r) => s.includes(r) !== certas.includes(r)).length;
        const cand = rng.shuffle(todosSub.filter((s) => dist(s) > 0)).sort((x, y) => dist(x) - dist(y)).slice(0, 4);
        const errados = cand.map((s) => {
          const r = ROMANOS.slice(0, n).find((k) => s.includes(k) !== certas.includes(k))!;
          const i = ROMANOS.indexOf(r);
          return { txt: rot(s), erro: itens[i].ok ? `A afirmativa ${r} está correta e ficou de fora.` : `A afirmativa ${r} está errada: ${itens[i].c}` };
        });
        return {
          enunciado: `${a.cmd ? a.cmd.j : `Sobre ${a.sobre}, analise as afirmativas:`}\n\n${itens.map((x, i) => `${ROMANOS[i]}. ${x.t}`).join("\n")}\n\nAssinale a alternativa correta.`,
          ...embaralhar(rng, correta, errados),
          explicacao: itens.map((x, i) => `${ROMANOS[i]}: ${x.ok ? "certa" : `errada (${x.c})`}`).join(" "),
          passos: itens.map((x, i) => `${ROMANOS[i]} é ${x.ok ? "CERTA" : "ERRADA"}${x.ok ? "." : `: ${x.c}`}`),
          macete: "Julgue item por item e risque as alternativas que contradizem o que você já decidiu. Muitas vezes nem precisa julgar todos.",
        };
      },
    },
  ];
}

/** Pares chave → valor. Gera pergunta direta (chave → valor) e inversa (valor → chave). */
export interface Fatos {
  id: string;
  materia: string;
  tema: string;
  nivel?: Nivel;
  alta?: boolean;
  itens: [chave: string, valor: string, nota?: string][];
  perg: (chave: string) => string;
  inv?: (valor: string) => string;
  macete?: string;
}

export function deFatos(f: Fatos): Gerador[] {
  const base = { materia: f.materia, tema: f.tema, altaChance: f.alta ?? true, nivel: f.nivel ?? "basico" };
  const valores = [...new Set(f.itens.map((x) => x[1]))];
  contagem.itens += f.itens.length;
  const out: Gerador[] = [];
  if (valores.length >= 5)
    out.push({
      ...base, id: `${f.id}-d`,
      gerar(rng) {
        const [k, v, nota] = rng.pick(f.itens);
        const outros = amostra(rng, valores.filter((x) => x !== v), 4);
        return {
          enunciado: f.perg(k),
          ...embaralhar(rng, v, outros.map((o) => {
            const dono = f.itens.find((x) => x[1] === o)![0];
            return { txt: o, erro: `Isso corresponde a "${dono}", não a "${k}".` };
          })),
          explicacao: `${k}: ${v}.${nota ? ` ${nota}` : ""}`,
          macete: f.macete,
        };
      },
    });
  const invOk = f.itens.every(([, v]) => new Set(f.itens.filter((x) => x[1] !== v).map((x) => x[0])).size >= 4);
  if (f.inv && invOk) {
    const inv = f.inv;
    out.push({
      ...base, id: `${f.id}-r`, nivel: base.nivel === "basico" ? "intermediario" : base.nivel,
      gerar(rng) {
        const [k, v, nota] = rng.pick(f.itens);
        const pool = [...new Set(f.itens.filter((x) => x[1] !== v).map((x) => x[0]))];
        const outros = amostra(rng, pool, 4);
        return {
          enunciado: inv(v),
          ...embaralhar(rng, k, outros.map((o) => ({ txt: o, erro: `"${o}" corresponde a: ${f.itens.find((x) => x[0] === o)![1]}.` }))),
          explicacao: `${k}: ${v}.${nota ? ` ${nota}` : ""}`,
          macete: f.macete,
        };
      },
    });
  }
  return out;
}

/** Frases com uma lacuna "___". A questão junta 3 frases e pede a sequência que completa todas. */
export interface Lacunas {
  id: string;
  materia: string;
  tema: string;
  nivel?: Nivel;
  alta?: boolean;
  opcoes: string[];
  frases: [frase: string, resposta: string, motivo: string][];
  macete?: string;
}

export function deLacunas(l: Lacunas): Gerador[] {
  const base = { materia: l.materia, tema: l.tema, altaChance: l.alta ?? true };
  contagem.itens += l.frases.length;
  const um: Gerador = {
    ...base, id: `${l.id}-1`, nivel: "basico",
    gerar(rng) {
      const [fr, resp, mot] = rng.pick(l.frases);
      const outras = amostra(rng, l.opcoes.filter((o) => o !== resp), 4);
      if (outras.length < 4) {
        // poucas opções (ex.: a/à): vira questão de "qual frase está certa"
        const certaTxt = fr.replace("___", resp);
        const erradas = amostra(rng, l.frases.filter((x) => x[0] !== fr), 4).map(([f2, r2, m2]) => {
          const errado = rng.pick(l.opcoes.filter((o) => o !== r2));
          return { txt: f2.replace("___", errado), erro: `O certo é "${r2}": ${m2}` };
        });
        return { enunciado: "Assinale a alternativa em que a frase está escrita de acordo com a norma-padrão.", ...embaralhar(rng, certaTxt, erradas), explicacao: `Correta: "${certaTxt}". ${mot}`, macete: l.macete };
      }
      return {
        enunciado: `Assinale a alternativa que completa corretamente a lacuna:\n\n"${fr}"`,
        ...embaralhar(rng, resp, outras.map((o) => ({ txt: o, erro: `Aqui o certo é "${resp}": ${mot}` }))),
        explicacao: `"${fr.replace("___", resp)}". ${mot}`,
        macete: l.macete,
      };
    },
  };
  const tres: Gerador = {
    ...base, id: `${l.id}-3`, nivel: l.nivel ?? "intermediario",
    gerar(rng) {
      const fs = amostra(rng, l.frases, 3);
      const certa = fs.map((x) => x[1]);
      const fmtSeq = (s: string[]) => s.join(" – ");
      const vistos = new Set([fmtSeq(certa)]);
      const errados: { txt: string; erro: string }[] = [];
      for (let t = 0; errados.length < 4 && t < 80; t++) {
        const s = [...certa];
        const trocas = t < 30 ? 1 : 2;
        for (let k = 0; k < trocas; k++) { const i = rng.int(0, 2); s[i] = rng.pick(l.opcoes.filter((o) => o !== certa[i])); }
        const txt = fmtSeq(s);
        if (vistos.has(txt)) continue;
        vistos.add(txt);
        const i = s.findIndex((x, j) => x !== certa[j]);
        errados.push({ txt, erro: `Na ${i + 1}ª lacuna o certo é "${certa[i]}": ${fs[i][2]}` });
      }
      if (errados.length < 4) throw new Error("poucas combinações");
      return {
        enunciado: `Assinale a alternativa que preenche corretamente as lacunas, na ordem:\n\n${fs.map((x, i) => `${ROMANOS[i]}. ${x[0]}`).join("\n")}`,
        ...embaralhar(rng, fmtSeq(certa), errados),
        explicacao: fs.map((x, i) => `${ROMANOS[i]}: "${x[1]}" (${x[2]})`).join(" "),
        passos: fs.map((x, i) => `${ROMANOS[i]}: ${x[0].replace("___", x[1].toUpperCase())}. ${x[2]}`),
        macete: l.macete,
      };
    },
  };
  return [um, tres];
}
