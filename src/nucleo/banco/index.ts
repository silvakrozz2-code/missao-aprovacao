// Banco grande: geradores de questões originais por objetivo. Cada aba tem os seus
// (ids e temas próprios), então o progresso do Concurso, do NPOR e do ENEM fica separado.
// O tema de cada gerador entra automaticamente na matéria cujo nome é igual a g.materia.
import type { Gerador } from "../lib/tipos.ts";
import { legConcurso } from "./concurso-leg.ts";
import { espConcurso } from "./concurso-esp.ts";
import { infoConcurso } from "./informatica.ts";
import { portugues, literatura, OBRAS } from "./portugues.ts";
import { historiaBrasil, exercito, geografiaBrasil, escolasLit } from "./humanas.ts";
import { enemConteudo, nporRedacao } from "./enem.ts";
import { regencia } from "./regencia.ts";
import { portuguesNiveis } from "./portugues-niveis.ts";
import { excelGen, linuxGen, unidadesGen, cartografiaGen, seculoGen, fisicaGen, quimicaGen } from "./parametricos.ts";

const QUINHENTOS_AO_ARCADISMO = new Set(["Quinhentismo", "Barroco", "Arcadismo"]);
const ROMANTISMO_AO_SIMBOLISMO = new Set(["Romantismo", "Realismo", "Naturalismo", "Parnasianismo", "Simbolismo"]);

// ───────── Concurso Curitiba
const concurso: Gerador[] = [
  ...espConcurso,
  ...legConcurso,
  ...infoConcurso,
  ...excelGen("Noções de Informática", "Excel 2016"),
  ...linuxGen("Noções de Informática", "Linux Ubuntu"),
  ...unidadesGen("Noções de Informática", "Hardware e software"),
  ...portugues("cp", "Língua Portuguesa", (t) => t),
  ...portuguesNiveis("cp", "Língua Portuguesa"),
  ...literatura("cp-lit", "Língua Portuguesa", "Literatura brasileira", OBRAS),
  ...escolasLit("cp-lit", "Língua Portuguesa", "Literatura brasileira"),
];

// ───────── NPOR
const NP_PORT: Record<string, string> = {
  "Uso dos porquês": "Ortografia e acentuação", "Acentuação": "Ortografia e acentuação", "Fonologia e ortografia": "Ortografia e acentuação",
  "Crase": "Crase e pontuação", "Pontuação": "Crase e pontuação",
  "Concordância": "Sintaxe e regência", "Funções sintáticas": "Sintaxe e regência",
  "Classes de palavras": "Morfologia (classes de palavras)",
};
const npor: Gerador[] = [
  ...portugues("np", "Português", (t) => NP_PORT[t] ?? "Semântica e interpretação"),
  ...portuguesNiveis("np", "Português"),
  ...literatura("np-l1", "Português", "Literatura: Quinhentismo ao Arcadismo", OBRAS.filter((o) => QUINHENTOS_AO_ARCADISMO.has(o.escola))),
  ...literatura("np-l2", "Português", "Literatura: Romantismo ao Simbolismo", OBRAS.filter((o) => ROMANTISMO_AO_SIMBOLISMO.has(o.escola))),
  ...escolasLit("np-l2", "Português", "Literatura: Romantismo ao Simbolismo"),
  ...historiaBrasil("np-h", "História do Brasil", (t) => t),
  ...seculoGen("História do Brasil", "Linha do tempo"),
  ...exercito("np", "História do Brasil", "Exército Brasileiro"),
  ...geografiaBrasil("np-g", "Geografia", (t) => t),
  ...cartografiaGen("Geografia", "Cartografia"),
  ...nporRedacao,
  ...regencia("np-reg", "Português", "Sintaxe e regência"),
];

// ───────── ENEM
const EN_LING: Record<string, string> = {
  "Variação e gêneros textuais": "Variação linguística", "Funções da linguagem": "Funções da linguagem (ENEM)",
  "Conectivos e coesão": "Interpretação e gêneros", "Semântica e figuras": "Interpretação e gêneros",
};
const EN_HIST: Record<string, string> = { "Território e regiões": "Geografia do Brasil", "Cartografia": "Geografia do Brasil", "Clima e relevo do Brasil": "Geografia do Brasil", "Biomas e domínios": "Geografia ambiental", "População e economia": "Geografia do Brasil" };
const enem: Gerador[] = [
  ...portugues("en", "Linguagens", (t) => EN_LING[t] ?? "Gramática no texto"),
  ...portuguesNiveis("en", "Linguagens").filter((g) => g.tema !== "Redação oficial"),
  ...literatura("en-lit", "Linguagens", "Literatura brasileira (ENEM)", OBRAS),
  ...escolasLit("en-lit", "Linguagens", "Literatura brasileira (ENEM)"),
  ...regencia("en-reg", "Linguagens", "Gramática no texto"),
  ...historiaBrasil("en-h", "Ciências Humanas", () => "História do Brasil (ENEM)"),
  ...geografiaBrasil("en-g", "Ciências Humanas", (t) => EN_HIST[t] ?? "Geografia do Brasil"),
  ...cartografiaGen("Ciências Humanas", "Geografia do Brasil"),
  ...enemConteudo,
  ...fisicaGen("Ciências da Natureza", "Física do cotidiano"),
  ...quimicaGen("Ciências da Natureza", "Química do cotidiano"),
];

export const bancoGrande: Record<"concurso" | "npor" | "enem", Gerador[]> = { concurso, npor, enem };
