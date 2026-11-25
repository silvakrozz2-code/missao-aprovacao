// Matemática completa por nível: completa os temas que estavam sem Básico, Intermediário
// ou Nível prova e acrescenta os temas que faltavam (PA e PG a fundo, potências, equações,
// sistemas, conjuntos, lógica, Pitágoras, trigonometria, polígonos, matrizes, unidades e
// geometria analítica). Conteúdo original, com números sorteados e conta conferida.
import type { Gerador, Nivel, CorpoQuestao } from "../tipos.ts";
import type { Rng } from "./util.ts";
import { brl, fmt, fracao, mmc, montar, vizinhos } from "./util.ts";

const M = "Raciocínio Lógico";
type D = [txt: string, erro: string];
interface Saida { e: string; c: string; d: D[]; x: string; p: string[]; m?: string; viz?: (i: number) => string; tabela?: CorpoQuestao["tabela"] }

function g(id: string, tema: string, nivel: Nivel, f: (rng: Rng) => Saida, alta = true): Gerador {
  return {
    id: `c-${id}`, materia: M, tema, nivel, altaChance: alta,
    gerar(rng) {
      const o = f(rng);
      return { enunciado: o.e, tabela: o.tabela, ...montar(rng, o.c, o.d.map(([txt, erro]) => ({ txt, erro })), o.viz), explicacao: o.x, passos: o.p, macete: o.m };
    },
  };
}
const SUP: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
const sup = (n: number) => String(n).split("").map((c) => SUP[c]).join("");
const pot = (b: number, e: number) => `${b}${sup(e)}`;
const nv = (v: number, passo = 1) => vizinhos(v, passo, fmt);
const TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29]];
const raiz3 = (k: number) => (k === 1 ? "√3" : `${fmt(k)}√3`);

export const geradoresC: Gerador[] = [
  // ───────────────────────── Progressões (PA e PG)
  g("pg-termo", "Progressões", "basico", (rng) => {
    const a = rng.int(1, 5), q = rng.pick([2, 3]), n = rng.int(4, 7), res = a * q ** (n - 1);
    return {
      e: `Na progressão geométrica (${a}, ${a * q}, ${a * q * q}, ...), qual é o ${n}º termo?`, c: fmt(res),
      d: [[fmt(a * q ** n), `Você deu ${n} pulos, mas do 1º ao ${n}º termo são só ${n - 1}.`], [fmt(a + (n - 1) * q), "Você somou a razão, como numa PA. Na PG a razão MULTIPLICA."], [fmt(a * q * (n - 1)), "Você multiplicou a razão pelo número de pulos. Na PG a razão vira potência."], [fmt(a * q ** (n - 2)), "Faltou um pulo: são n − 1 multiplicações."]],
      x: `Na PG cada termo é o anterior vezes ${q}. aₙ = a₁·qⁿ⁻¹ = ${a}·${pot(q, n - 1)} = ${fmt(res)}.`,
      p: [`a₁ = ${a} e q = ${a * q} ÷ ${a} = ${q}.`, `Do 1º ao ${n}º termo há ${n - 1} pulos: aₙ = ${a}·${pot(q, n - 1)}.`, `${pot(q, n - 1)} = ${q ** (n - 1)}, então aₙ = ${fmt(res)}.`],
      m: "PA soma a razão; PG multiplica. Do 1º ao n-ésimo, sempre n − 1 pulos.", viz: nv(res, q),
    };
  }),
  g("pa-interp", "Progressões", "intermediario", (rng) => {
    const k = rng.int(2, 5), r = rng.int(2, 9), a = rng.int(1, 20), b = a + (k + 1) * r;
    return {
      e: `Inserindo ${k} meios aritméticos entre ${a} e ${b}, forma-se uma PA. Qual é a razão dessa PA?`, c: fmt(r),
      d: [[fmt((b - a) / k), `Você dividiu por ${k} (os meios), mas com os extremos a PA tem ${k + 2} termos e ${k + 1} pulos.`], [fmt((b - a) / (k + 2)), "Você dividiu pelo número de termos. Divide-se pelo número de PULOS."], [fmt(b - a), "Essa é a distância total, falta dividir pelos pulos."], [fmt(r + 1), "Confira a divisão (b − a) ÷ (k + 1)."]],
      x: `A PA tem ${k + 2} termos (2 extremos + ${k} meios), logo ${k + 1} pulos: r = (${b} − ${a}) ÷ ${k + 1} = ${r}.`,
      p: [`Termos: ${a}, ${k} meios, ${b} → ${k + 2} termos.`, `Pulos = termos − 1 = ${k + 1}.`, `r = ${b - a} ÷ ${k + 1} = ${r}.`],
      m: "Interpolar k meios = k + 1 pulos.", viz: nv(r),
    };
  }),
  g("pg-soma", "Progressões", "intermediario", (rng) => {
    const a = rng.int(1, 5), q = rng.pick([2, 3]), n = rng.int(4, 7), an = a * q ** (n - 1), S = (a * (q ** n - 1)) / (q - 1);
    return {
      e: `Uma pessoa guardou R$ ${a} no 1º mês e, a cada mês, guardou o ${q === 2 ? "dobro" : "triplo"} do mês anterior. Quanto guardou no total em ${n} meses?`, c: brl(S),
      d: [[brl(an), "Esse é só o valor do último mês, não a soma."], [brl(a * q ** n), "Isso é a·qⁿ: falta subtrair e dividir pela fórmula."], [brl(a * n * q), "Não se multiplica tudo: some os termos ou use Sₙ = a₁(qⁿ − 1)/(q − 1)."], [brl(S - a), "Você esqueceu o valor do 1º mês."]],
      x: `Sₙ = a₁(qⁿ − 1)/(q − 1) = ${a}·(${pot(q, n)} − 1)/${q - 1} = ${brl(S)}.`,
      p: [`PG com a₁ = ${a}, q = ${q}, n = ${n}.`, `${pot(q, n)} = ${q ** n}.`, `Sₙ = ${a}·${q ** n - 1}/${q - 1} = ${fmt(S)}.`],
      m: "Com q = 2, a soma é sempre (próximo termo − a₁).", viz: vizinhos(S, a, brl),
    };
  }),
  g("pa-soma-mult", "Progressões", "avancado", (rng) => {
    const k = rng.pick([3, 4, 5, 6, 7, 9]), N = rng.int(60, 200), n = Math.floor(N / k), S = (k * n * (n + 1)) / 2;
    return {
      e: `Qual é a soma de todos os múltiplos positivos de ${k} menores ou iguais a ${N}?`, c: fmt(S),
      d: [[fmt(n), "Esse é só a QUANTIDADE de múltiplos (número de termos)."], [fmt((k * n * (n - 1)) / 2), `Você usou n − 1 termos. De ${k} até ${k * n} há ${n} termos.`], [fmt(k * n * n), "Faltou dividir por 2 na fórmula (a₁ + aₙ)·n/2."], [fmt(((k + N) * n) / 2), `O último termo não é ${N}, é o maior múltiplo: ${k * n}.`]],
      x: `PA: ${k}, ${2 * k}, ..., ${k * n}. n = ${N} ÷ ${k} (parte inteira) = ${n}. S = (${k} + ${k * n})·${n}/2 = ${fmt(S)}.`,
      p: [`Último múltiplo ≤ ${N}: ${k}·${n} = ${k * n}.`, `Número de termos: ${n}.`, `S = (a₁ + aₙ)·n/2 = (${k} + ${k * n})·${n}/2 = ${fmt(S)}.`],
      m: "Soma da PA: (primeiro + último) × quantidade ÷ 2.", viz: nv(S, k),
    };
  }),
  g("pg-infinita", "Progressões", "avancado", (rng) => {
    const [num, den, a] = rng.pick([[1, 2, 40], [1, 2, 64], [1, 2, 90], [1, 3, 54], [1, 3, 81], [2, 3, 27], [1, 4, 48], [1, 4, 96], [2, 5, 75]] as const);
    const q = num / den, S = a / (1 - q);
    return {
      e: `Qual é a soma dos infinitos termos da PG (${fmt(a)}; ${fmt(a * q)}; ${fmt(a * q * q, 3)}; ...)?`, c: fmt(S),
      d: [[fmt(a / q), "Você dividiu a₁ por q. O certo é dividir por (1 − q)."], [fmt(a + a * q + a * q * q, 3), "Você somou só os três termos mostrados. São infinitos: use S = a₁/(1 − q)."], [fmt(a / (1 + q)), "O denominador é (1 − q), não (1 + q)."], [fmt(a * (1 + q)), "Você somou só os dois primeiros termos."]],
      x: `q = ${fracao(num, den)} (|q| < 1, a soma converge). S = a₁/(1 − q) = ${a}/(1 − ${fracao(num, den)}) = ${fmt(S)}.`,
      p: [`Razão: ${fmt(a * q)} ÷ ${a} = ${fracao(num, den)}.`, `1 − q = ${fracao(den - num, den)}.`, `S = ${a} ÷ ${fracao(den - num, den)} = ${fmt(S)}.`],
      m: "PG infinita com |q| < 1: S = a₁ ÷ (1 − q).", viz: nv(S, 2),
    };
  }),
  // ───────────────────────── Potenciação e radiciação
  g("pot-valor", "Potenciação e radiciação", "basico", (rng) => {
    const b = rng.int(2, 9), e = rng.int(2, b > 5 ? 3 : 4), res = b ** e;
    return {
      e: `Quanto vale ${pot(b, e)}?`, c: fmt(res),
      d: [[fmt(b * e), `Você multiplicou ${b} por ${e}. Potência é ${b} vezes ele mesmo ${e} vezes.`], [fmt(b ** (e - 1)), "Faltou uma multiplicação."], [fmt(b ** (e + 1)), "Multiplicou uma vez a mais."], [fmt(e ** b), "Você inverteu base e expoente."]],
      x: `${pot(b, e)} = ${Array(e).fill(b).join(" × ")} = ${fmt(res)}.`, p: [`Base ${b}, expoente ${e}: multiplica ${b} por ele mesmo ${e} vezes.`, `${Array(e).fill(b).join(" × ")} = ${fmt(res)}.`],
      m: "Expoente diz QUANTAS VEZES a base aparece na multiplicação.", viz: nv(res),
    };
  }),
  g("pot-prop", "Potenciação e radiciação", "intermediario", (rng) => {
    const b = rng.pick([2, 3, 5, 10]), m = rng.int(2, 6), n = rng.int(2, 6), p = rng.int(1, m + n - 1), k = m + n - p;
    return {
      e: `Simplificando (${pot(b, m)} · ${pot(b, n)}) ÷ ${pot(b, p)}, obtém-se:`, c: pot(b, k),
      d: [[pot(b, m * n - p), "No produto de mesma base os expoentes se SOMAM, não se multiplicam."], [pot(b, m + n + p), "Na divisão de mesma base os expoentes se SUBTRAEM."], [pot(b * b, k), "A base não muda: só os expoentes são operados."], [pot(b, k + 1), "Refaça: m + n − p."]],
      x: `Mesma base: multiplicação soma expoentes e divisão subtrai. ${m} + ${n} − ${p} = ${k}, logo ${pot(b, k)}.`,
      p: [`${pot(b, m)}·${pot(b, n)} = ${pot(b, m + n)}.`, `${pot(b, m + n)} ÷ ${pot(b, p)} = ${pot(b, k)}.`],
      m: "Multiplica → soma expoente. Divide → subtrai. Potência de potência → multiplica.", viz: (i) => pot(b, k + i + 1),
    };
  }),
  g("raiz-simpl", "Potenciação e radiciação", "avancado", (rng) => {
    const m = rng.pick([2, 3, 5, 6, 7]), k = rng.int(2, 9), N = k * k * m;
    return {
      e: `Simplificando √${N}, obtém-se:`, c: `${k}√${m}`,
      d: [[`${m}√${k}`, "Você trocou: o que sai da raiz é a raiz do quadrado perfeito."], [`${k * k}√${m}`, `Sai da raiz √${k * k} = ${k}, não ${k * k}.`], [`${k}√${m * 2}`, `Fatore ${N}: ${k * k} × ${m}.`], [`${N / 2}`, "Raiz quadrada não é dividir por 2."]],
      x: `${N} = ${k * k} × ${m}, e ${k * k} é quadrado perfeito. √${N} = √${k * k}·√${m} = ${k}√${m}.`,
      p: [`Procure o maior quadrado perfeito que divide ${N}: ${k * k}.`, `${N} = ${k * k} × ${m}.`, `√${k * k} = ${k} sai; √${m} fica: ${k}√${m}.`],
      m: "Fatore e tire da raiz os pares: o que é quadrado sai.", viz: (i) => `${k + i}√${m}`,
    };
  }),
  // ───────────────────────── Equações e sistemas
  g("eq1-basica", "Equação do 1º grau", "basico", (rng) => {
    const a = rng.int(2, 9), x = rng.int(2, 15), b = rng.int(1, 30), c = a * x + b;
    return {
      e: `Resolva: ${a}x + ${b} = ${c}. O valor de x é:`, c: fmt(x),
      d: [[fmt((c + b) / a), `Ao passar o +${b} para o outro lado, ele vira −${b}.`], [fmt(c - b), `Faltou dividir por ${a}.`], [fmt((c - b) * a), `O ${a} está multiplicando x: passa DIVIDINDO.`], [fmt(-x), "Confira o sinal."]],
      x: `${a}x = ${c} − ${b} = ${c - b} → x = ${c - b} ÷ ${a} = ${x}.`, p: [`Isole o termo com x: ${a}x = ${c} − ${b}.`, `${a}x = ${c - b}.`, `x = ${c - b} ÷ ${a} = ${x}.`],
      m: "Muda de lado, muda a operação: soma vira subtração, multiplicação vira divisão.", viz: nv(x),
    };
  }),
  g("eq1-problema", "Equação do 1º grau", "intermediario", (rng) => {
    const p = rng.int(3, 6), q = rng.int(1, p - 1), x = rng.int(3, 25), s = rng.int(2, 30), t = p * x + s - q * x;
    const nome = ["o dobro", "o triplo", "o quádruplo", "o quíntuplo", "o sêxtuplo"];
    const qn = q === 1 ? "o próprio número" : nome[q - 2];
    return {
      e: `${nome[p - 2][0].toUpperCase() + nome[p - 2].slice(1)} de um número somado a ${s} é igual a ${qn} mais ${t}. Que número é esse?`, c: fmt(x),
      d: [[fmt((t + s) / (p - q)), "Sinal: o +s passa subtraindo."], [fmt((t - s) / (p + q)), "O termo q·x passa para o outro lado SUBTRAINDO."], [fmt(t - s), `Faltou dividir por ${p - q}.`], [fmt(x + 1), "Substitua na frase e confira."]],
      x: `${p}x + ${s} = ${q}x + ${t} → ${p - q}x = ${t - s} → x = ${x}.`, p: [`Monte: ${p}x + ${s} = ${q === 1 ? "" : q}x + ${t}.`, `Letras de um lado, números do outro: ${p - q}x = ${t - s}.`, `x = ${t - s} ÷ ${p - q} = ${x}.`],
      m: "Traduza palavra por palavra: 'o triplo de um número' = 3x; 'é igual' = '='.", viz: nv(x),
    };
  }),
  g("eq1-salario", "Equação do 1º grau", "avancado", (rng) => {
    const [a, b] = rng.pick([[3, 4], [4, 5], [3, 5], [2, 5], [4, 6], [5, 10]] as const);
    const k = rng.pick([20, 30, 40, 50, 60, 100]), S = k * a * b * (a * b > 30 ? 1 : 2), R = S - S / a - S / b;
    return {
      e: `Uma pessoa gastou 1/${a} do salário com aluguel e 1/${b} com mercado. Sobraram ${brl(R)}. Qual é o salário?`, c: brl(S),
      d: [[brl(R + R / a + R / b), "As frações são do SALÁRIO, não do que sobrou."], [brl(S / a + S / b), "Esse é o total gasto, não o salário."], [brl(R * 2), "Não dá para dobrar: monte a equação com as frações."], [brl(S - S / a), "Esse é o que sobrou só depois do aluguel."]],
      x: `Sobra = 1 − 1/${a} − 1/${b} = ${fracao(a * b - a - b, a * b)} do salário. S = ${brl(R)} ÷ ${fracao(a * b - a - b, a * b)} = ${brl(S)}.`,
      p: [`Gasto: 1/${a} + 1/${b} = ${fracao(a + b, a * b)}.`, `Sobra: ${fracao(a * b - a - b, a * b)} do salário = ${brl(R)}.`, `Salário = ${brl(R)} × ${a * b} ÷ ${a * b - a - b} = ${brl(S)}.`],
      m: "Descubra que fração SOBROU e divida o valor que sobrou por ela.", viz: vizinhos(S, 60, brl),
    };
  }),
  g("eq2-incompleta", "Equação do 2º grau", "basico", (rng) => {
    const k = rng.int(2, 12), a = rng.pick([1, 2, 3]);
    return {
      e: `O conjunto solução de ${a === 1 ? "" : a}x² − ${a * k * k} = 0 é:`, c: `{−${k}, ${k}}`,
      d: [[`{${k}}`, "Faltou a raiz negativa: (−k)² também dá k²."], [`{0, ${k}}`, "Isso seria em ax² + bx = 0 (fatorando x). Aqui não há termo em x."], [`{−${k * k}, ${k * k}}`, "Faltou tirar a raiz quadrada."], [`{−${(a * k * k) / 2}, ${(a * k * k) / 2}}`, "Raiz quadrada não é dividir por 2."]],
      x: `${a === 1 ? "" : `${a}x² = ${a * k * k} → `}x² = ${k * k} → x = ±${k}.`, p: [`Isole x²: x² = ${k * k}.`, `x = ±√${k * k} = ±${k}.`],
      m: "x² = número → duas raízes, uma positiva e uma negativa.", viz: (i) => `{−${k + i}, ${k + i}}`,
    };
  }),
  g("eq2-soma-prod", "Equação do 2º grau", "intermediario", (rng) => {
    const r1 = rng.int(1, 9), r2 = rng.int(r1 + 1, 12), S = r1 + r2, P = r1 * r2;
    return {
      e: `As raízes da equação x² − ${S}x + ${P} = 0 são:`, c: `${r1} e ${r2}`,
      d: [[`−${r1} e −${r2}`, `Soma = −b/a = +${S}: as raízes são positivas.`], [`${r1 + 1} e ${r2 - 1}`, `A soma dá ${S}, mas o produto não dá ${P}.`], [`${S} e ${P}`, "Esses são soma e produto, não as raízes."], [`1 e ${P}`, `O produto dá ${P}, mas a soma não dá ${S}.`]],
      x: `Soma = ${S} e produto = ${P}. Dois números com essa soma e esse produto: ${r1} e ${r2}.`, p: [`Soma = −b/a = ${S}; produto = c/a = ${P}.`, `Teste pares que multiplicam ${P}: ${r1} × ${r2}.`, `${r1} + ${r2} = ${S}. ✓`],
      m: "x² − Sx + P = 0: ache dois números que somam S e multiplicam P.", viz: (i) => `${r1} e ${r2 + i}`,
    };
  }),
  g("eq2-terreno", "Equação do 2º grau", "avancado", (rng) => {
    const x = rng.int(4, 20), d = rng.int(2, 9), A = x * (x + d);
    return {
      e: `Um terreno retangular tem um lado ${d} m maior que o outro e área de ${A} m². Quanto mede o lado menor?`, c: `${x} m`,
      d: [[`${x + d} m`, "Esse é o lado MAIOR."], [`${-(x + d)} m`, "Essa raiz é negativa: medida não pode ser negativa."], [`${Math.round(A / 2)} m`, "Não basta dividir a área por 2: monte x(x + d) = A."], [`${Math.floor(Math.sqrt(A))} m`, "√A só funciona se o terreno for quadrado."]],
      x: `x(x + ${d}) = ${A} → x² + ${d}x − ${A} = 0. Raízes ${x} e −${x + d}; só a positiva serve: ${x} m.`,
      p: [`Lados: x e x + ${d}. Área: x² + ${d}x = ${A}.`, `Δ = ${d * d} + 4·${A} = ${d * d + 4 * A} = ${2 * x + d}².`, `x = (−${d} + ${2 * x + d})/2 = ${x}.`],
      m: "Medida e quantidade: descarte a raiz negativa.", viz: (i) => `${x + i} m`,
    };
  }),
  g("sis-basico", "Sistemas lineares", "basico", (rng) => {
    const y = rng.int(2, 20), x = rng.int(y + 1, 40);
    return {
      e: `No sistema x + y = ${x + y} e x − y = ${x - y}, o valor de x é:`, c: fmt(x),
      d: [[fmt(y), "Esse é o valor de y."], [fmt(x + y), "Essa é a soma x + y."], [fmt((x + y) / 2 + 1), "Some as equações: 2x = soma dos lados direitos."], [fmt(2 * x), "Faltou dividir por 2."]],
      x: `Somando: 2x = ${x + y} + ${x - y} = ${2 * x} → x = ${x}.`, p: ["Some as duas equações: o y some.", `2x = ${2 * x}.`, `x = ${x} (e y = ${y}).`],
      m: "Soma e diferença: x = (S + D)/2 e y = (S − D)/2.", viz: nv(x),
    };
  }),
  g("sis-rodas", "Sistemas lineares", "intermediario", (rng) => {
    const c = rng.int(5, 40), m = rng.int(5, 40), V = c + m, R = 4 * c + 2 * m;
    return {
      e: `Num estacionamento há carros e motos, ${V} veículos e ${R} rodas no total. Quantas são as motos?`, c: fmt(m),
      d: [[fmt(c), "Esse é o número de carros."], [fmt(Math.round(R / 4)), "Não dá para dividir as rodas só por 4: há motos também."], [fmt(Math.round(V / 2)), "Não é metade de cada tipo: use o sistema."], [fmt(R / 2 - V + 1), "Refaça: (4V − R) ÷ 2."]],
      x: `Se todos fossem motos: ${2 * V} rodas. Sobram ${R - 2 * V} rodas, 2 a mais por carro: ${c} carros. Motos: ${V} − ${c} = ${m}.`,
      p: [`c + m = ${V} e 4c + 2m = ${R}.`, `Divida a 2ª por 2: 2c + m = ${R / 2}. Subtraia a 1ª: c = ${c}.`, `m = ${V} − ${c} = ${m}.`],
      m: "Truque: suponha todos do tipo menor e distribua a sobra.", viz: nv(m),
    };
  }),
  g("sis-ingressos", "Sistemas lineares", "avancado", (rng) => {
    const p2 = rng.pick([10, 15, 20]), p1 = p2 * 2, a = rng.int(20, 150), b = rng.int(20, 150), n = a + b, T = p1 * a + p2 * b;
    return {
      e: `Um evento vendeu ${n} ingressos: inteiras a ${brl(p1)} e meias a ${brl(p2)}, arrecadando ${brl(T)}. Quantas inteiras foram vendidas?`, c: fmt(a),
      d: [[fmt(b), "Esse é o número de meias."], [fmt(Math.round(T / p1)), "Nem todos pagaram inteira: use o sistema."], [fmt(Math.round(n / 2)), "Não é metade: monte as duas equações."], [fmt(Math.round(T / (p1 + p2))), "Somar os preços não resolve. Faça x + y = n e p₁x + p₂y = T."]],
      x: `Se todas fossem meias: ${brl(p2 * n)}. Sobra ${brl(T - p2 * n)}, e cada inteira paga ${brl(p1 - p2)} a mais: ${a} inteiras.`,
      p: [`x + y = ${n}; ${p1}x + ${p2}y = ${T}.`, `${p2}·${n} = ${p2 * n}; ${T} − ${p2 * n} = ${T - p2 * n}.`, `x = ${T - p2 * n} ÷ ${p1 - p2} = ${a}.`],
      m: "Suponha todos do preço menor; a diferença ÷ (diferença de preço) dá os outros.", viz: nv(a),
    };
  }),
  // ───────────────────────── Conjuntos
  g("conj-uniao", "Conjuntos", "basico", (rng) => {
    const i = rng.int(3, 20), a = i + rng.int(5, 30), b = i + rng.int(5, 30);
    return {
      e: `Numa turma, ${a} alunos gostam de futebol, ${b} de vôlei e ${i} gostam dos dois. Quantos gostam de pelo menos um dos esportes?`, c: fmt(a + b - i),
      d: [[fmt(a + b), "Os que gostam dos dois foram contados duas vezes."], [fmt(a + b - 2 * i), "Você tirou a interseção duas vezes. Tire uma só."], [fmt(a - i + (b - i)), "Esses são os que gostam de UM só esporte."], [fmt(i), "Esses gostam dos dois."]],
      x: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = ${a} + ${b} − ${i} = ${a + b - i}.`, p: [`Some os grupos: ${a + b}.`, `Quem está nos dois entrou duas vezes: tire ${i}.`, `${a + b - i}.`],
      m: "União: soma e tira a interseção uma vez.", viz: nv(a + b - i),
    };
  }),
  g("conj-pesquisa", "Conjuntos", "intermediario", (rng) => {
    const i = rng.int(5, 30), sa = rng.int(5, 40), sb = rng.int(5, 40), z = rng.int(2, 25), T = i + sa + sb + z, a = sa + i, b = sb + i;
    return {
      e: `Em uma pesquisa com ${T} pessoas, ${a} leem o jornal A, ${b} leem o jornal B e ${z} não leem nenhum dos dois. Quantas leem os dois jornais?`, c: fmt(i),
      d: [[fmt(a + b - T), "Você esqueceu de tirar quem não lê nenhum."], [fmt(T - z), "Esses são os que leem pelo menos um."], [fmt(sa), "Esses leem só o A."], [fmt(sb), "Esses leem só o B."]],
      x: `Leem pelo menos um: ${T} − ${z} = ${T - z}. Interseção = ${a} + ${b} − ${T - z} = ${i}.`, p: [`Pelo menos um: ${T} − ${z} = ${T - z}.`, `${a} + ${b} = ${a + b}: passou de ${T - z} por causa dos que leem os dois.`, `Dois jornais: ${a + b} − ${T - z} = ${i}.`],
      m: "Comece sempre pela interseção no diagrama de Venn.", viz: nv(i),
    };
  }),
  g("conj-apenas", "Conjuntos", "avancado", (rng) => {
    const i = rng.int(5, 30), sa = rng.int(5, 40), sb = rng.int(5, 40), z = rng.int(2, 25), T = i + sa + sb + z, a = sa + i, b = sb + i;
    return {
      e: `Dos ${T} servidores de um órgão, ${a} fizeram curso de Excel, ${b} de Word e ${z} não fizeram nenhum dos dois. Quantos fizeram APENAS o curso de Excel?`, c: fmt(sa),
      d: [[fmt(a), "Esse é o total de Excel, incluindo quem fez os dois."], [fmt(i), "Esses fizeram os dois cursos."], [fmt(sb), "Esses fizeram apenas Word."], [fmt(a + b - i), "Esses fizeram pelo menos um."]],
      x: `Os dois: ${a} + ${b} − (${T} − ${z}) = ${i}. Apenas Excel: ${a} − ${i} = ${sa}.`, p: [`Pelo menos um: ${T - z}.`, `Os dois: ${a + b} − ${T - z} = ${i}.`, `Apenas Excel: ${a} − ${i} = ${sa}.`],
      m: "'Apenas' = total do conjunto − interseção.", viz: nv(sa),
    };
  }),
  // ───────────────────────── Lógica proposicional
  g("log-neg-e", "Lógica proposicional", "basico", (rng) => {
    const [[p, np], [q, nq]] = rng.shuffle(PROPS).slice(0, 2);
    return {
      e: `A negação de "${cap(p)} e ${q}" é:`, c: `${cap(np)} ou ${nq}.`,
      d: [[`${cap(np)} e ${nq}.`, "Negou as partes, mas o 'e' tem que virar 'ou'."], [`${cap(p)} ou ${q}.`, "Trocou o conectivo, mas não negou as partes."], [`${cap(p)} e ${nq}.`, "É preciso negar as DUAS partes e trocar 'e' por 'ou'."], [`Se ${p}, então ${nq}.`, "Essa é a negação do 'se... então' trocada; aqui o conectivo é 'e'."]],
      x: `Lei de De Morgan: ~(p ∧ q) ≡ ~p ∨ ~q. Nega as duas e troca "e" por "ou".`, p: ["Negue cada parte.", "Troque 'e' por 'ou'."],
      m: "Negar o 'e': nega tudo e vira 'ou'. Negar o 'ou': nega tudo e vira 'e'.", viz: undefined,
    };
  }),
  g("log-neg-se", "Lógica proposicional", "intermediario", (rng) => {
    const [[p, np], [q, nq]] = rng.shuffle(PROPS).slice(0, 2);
    return {
      e: `A negação de "Se ${p}, então ${q}" é:`, c: `${cap(p)} e ${nq}.`,
      d: [[`Se ${np}, então ${nq}.`, "Negar a condicional não é negar as partes mantendo o 'se... então'."], [`Se ${q}, então ${p}.`, "Essa é a recíproca, que não é negação."], [`${cap(np)} ou ${q}.`, "Isso é EQUIVALENTE à condicional, não sua negação."], [`Se ${p}, então ${nq}.`, "A negação de uma condicional não é outra condicional."]],
      x: `~(p → q) ≡ p ∧ ~q: mantém a primeira, troca por "e" e nega a segunda.`, p: ["Mantenha a 1ª parte.", "Troque 'se... então' por 'e'.", "Negue a 2ª parte."],
      m: "MA-NÉ: MAntém a primeira E NEga a segunda.", viz: undefined,
    };
  }),
  g("log-equiv-se", "Lógica proposicional", "avancado", (rng) => {
    const [[p, np], [q, nq]] = rng.shuffle(PROPS).slice(0, 2);
    const certa = rng.bool() ? `Se ${nq}, então ${np}.` : `${cap(np)} ou ${q}.`;
    return {
      e: `Uma proposição logicamente EQUIVALENTE a "Se ${p}, então ${q}" é:`, c: certa,
      d: [[`Se ${q}, então ${p}.`, "Recíproca: não é equivalente."], [`Se ${np}, então ${nq}.`, "Inversa (nega sem inverter): não é equivalente."], [`${cap(p)} e ${nq}.`, "Essa é a NEGAÇÃO da condicional."], [`${cap(p)} ou ${nq}.`, "Não equivale: falha quando p é falsa e q verdadeira."]],
      x: `p → q ≡ ~q → ~p (contrapositiva: inverte e nega) ≡ ~p ∨ q (NEOU: nega a primeira, troca por "ou", mantém a segunda).`, p: ["Contrapositiva: inverte a ordem e nega as duas.", "Ou: nega a 1ª, 'ou', mantém a 2ª."],
      m: "Equivalências da condicional: 'volta negando' e 'NEOU'.", viz: undefined,
    };
  }),
  // ───────────────────────── Teorema de Pitágoras
  g("pit-hip", "Teorema de Pitágoras", "basico", (rng) => {
    const [a, b, c] = rng.pick(TRI);
    return {
      e: `Um triângulo retângulo tem catetos de ${a} cm e ${b} cm. Quanto mede a hipotenusa?`, c: `${c} cm`,
      d: [[`${a + b} cm`, "Não se somam os catetos: some os QUADRADOS."], [`${a * a + b * b} cm`, "Faltou tirar a raiz quadrada."], [`${b - a > 0 ? b - a : a + 1} cm`, "A hipotenusa é o MAIOR lado."], [`${(a * b) / 2} cm`, "Isso é a área, não a hipotenusa."]],
      x: `a² = b² + c² → ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c} → hipotenusa = √${c * c} = ${c} cm.`, p: [`${a}² = ${a * a}; ${b}² = ${b * b}.`, `Soma: ${c * c}.`, `√${c * c} = ${c}.`],
      m: "Triplos famosos: 3-4-5, 5-12-13, 8-15-17 e seus múltiplos.", viz: (i) => `${c + i} cm`,
    };
  }),
  g("pit-escada", "Teorema de Pitágoras", "intermediario", (rng) => {
    const [a, b, c] = rng.pick(TRI);
    return {
      e: `Uma escada de ${c} m está encostada em um muro, com o pé a ${a} m da base do muro. A que altura a escada toca o muro?`, c: `${b} m`,
      d: [[`${c - a} m`, "Não basta subtrair: subtraia os QUADRADOS."], [`${Math.round(Math.sqrt(c * c + a * a))} m`, "A escada é a hipotenusa: aqui se SUBTRAI."], [`${c * c - a * a} m`, "Faltou tirar a raiz quadrada."], [`${c} m`, "Essa é a escada (hipotenusa)."]],
      x: `${c}² = ${a}² + h² → h² = ${c * c} − ${a * a} = ${b * b} → h = ${b} m.`, p: ["A escada é a hipotenusa.", `h² = ${c * c} − ${a * a} = ${b * b}.`, `h = ${b} m.`],
      m: "Procura cateto? Hipotenusa² − cateto².", viz: (i) => `${b + i} m`,
    };
  }),
  g("pit-percurso", "Teorema de Pitágoras", "avancado", (rng) => {
    const [a, b, c] = rng.pick(TRI), k = rng.int(1, 3), n1 = rng.int(1, a - 1), l1 = rng.int(1, b - 1);
    const A = a * k, B = b * k, C = c * k, N1 = n1 * k, L1 = l1 * k;
    return {
      e: `Uma pessoa andou ${N1} km para o Norte, ${L1} km para o Leste, mais ${A - N1} km para o Norte e mais ${B - L1} km para o Leste. Qual a distância em linha reta até o ponto de partida?`, c: `${C} km`,
      d: [[`${A + B} km`, "Esse é o caminho percorrido, não a distância em linha reta."], [`${Math.round(Math.sqrt(N1 * N1 + L1 * L1))} km`, "Considere todo o deslocamento, não só a primeira parte."], [`${A * A + B * B} km`, "Faltou a raiz quadrada."], [`${Math.abs(B - A) || 1} km`, "Some os deslocamentos de cada direção e use Pitágoras."]],
      x: `Norte total: ${A} km; Leste total: ${B} km. d = √(${A}² + ${B}²) = ${C} km.`, p: [`Norte: ${N1} + ${A - N1} = ${A}.`, `Leste: ${L1} + ${B - L1} = ${B}.`, `d² = ${A * A} + ${B * B} = ${C * C} → d = ${C}.`],
      m: "Junte tudo que foi na mesma direção antes de usar Pitágoras.", viz: (i) => `${C + i} km`,
    };
  }),
  // ───────────────────────── Trigonometria
  g("trig-razao", "Trigonometria", "basico", (rng) => {
    const [a, b, c] = rng.pick(TRI), r = rng.pick(["sen", "cos", "tg"] as const);
    const val = { sen: [a, c], cos: [b, c], tg: [a, b] }[r];
    return {
      e: `Num triângulo retângulo, o ângulo θ tem cateto oposto ${a}, cateto adjacente ${b} e hipotenusa ${c}. Quanto vale ${r} θ?`, c: fracao(val[0], val[1]),
      d: [[fracao(a, c), "Esse é o seno (oposto/hipotenusa)."], [fracao(b, c), "Esse é o cosseno (adjacente/hipotenusa)."], [fracao(a, b), "Essa é a tangente (oposto/adjacente)."], [fracao(c, a), "Você inverteu a razão."], [fracao(b, a), "Você inverteu a tangente."]],
      x: `${r} θ = ${r === "sen" ? "oposto/hipotenusa" : r === "cos" ? "adjacente/hipotenusa" : "oposto/adjacente"} = ${val[0]}/${val[1]} = ${fracao(val[0], val[1])}.`,
      p: ["SOH: seno = oposto/hipotenusa.", "CAH: cosseno = adjacente/hipotenusa.", "TOA: tangente = oposto/adjacente."], m: "SOH-CAH-TOA.",
    };
  }),
  g("trig-rampa", "Trigonometria", "intermediario", (rng) => {
    const H = rng.int(2, 20) * 2, ang = rng.pick([30, 60]);
    const certa = ang === 30 ? `${fmt(H / 2)} m` : `${raiz3(H / 2)} m`;
    return {
      e: `Uma rampa de ${H} m de comprimento forma ${ang}° com o chão. Qual a altura que ela atinge? (sen 30° = 1/2; sen 60° = √3/2)`, c: certa,
      d: [[ang === 30 ? `${raiz3(H / 2)} m` : `${fmt(H / 2)} m`, `Você usou o seno do outro ângulo (${90 - ang}°).`], [`${H} m`, "Esse é o comprimento da rampa (hipotenusa)."], [`${fmt(H * 2)} m`, "Você dividiu pelo seno em vez de multiplicar."], [`${fmt(H / 2)}√2 m`, "√2/2 é o seno de 45°."]],
      x: `altura = rampa × sen ${ang}° = ${H} × ${ang === 30 ? "1/2" : "√3/2"} = ${certa}.`, p: ["A altura é oposta ao ângulo; a rampa é a hipotenusa → seno.", `h = ${H} · sen ${ang}°.`, `h = ${certa}.`],
      m: "Tabela: 30°, 45°, 60° → seno: 1/2, √2/2, √3/2 (o cosseno é a ordem inversa).", viz: (i) => `${fmt(H / 2 + i)} m`,
    };
  }),
  g("trig-predio", "Trigonometria", "avancado", (rng) => {
    const d = rng.int(2, 15) * 3, ang = rng.pick([30, 45, 60]);
    const res: Record<number, string> = { 30: `${raiz3(d / 3)} m`, 45: `${d} m`, 60: `${raiz3(d)} m` };
    return {
      e: `De um ponto a ${d} m da base de um prédio, vê-se o topo sob um ângulo de ${ang}°. Qual a altura do prédio? (tg 30° = √3/3; tg 45° = 1; tg 60° = √3)`, c: res[ang],
      d: [...[30, 45, 60].filter((x) => x !== ang).map((x): D => [res[x], `Esse seria o resultado para ${x}°.`]), [`${fmt(d / 2)} m`, "sen 30° = 1/2 não serve: aqui temos os dois catetos → tangente."], [`${raiz3(d / 2)} m`, "Confira o valor da tangente do ângulo."]],
      x: `tg ${ang}° = altura/${d} → altura = ${d} × tg ${ang}° = ${res[ang]}.`, p: ["Distância = cateto adjacente; altura = cateto oposto → tangente.", `h = ${d} · tg ${ang}°.`, `h = ${res[ang]}.`],
      m: "Dois catetos na conta = tangente.", viz: (i) => `${raiz3(d / 3 + i)} m`,
    };
  }),
  // ───────────────────────── Ângulos e polígonos
  g("pol-soma", "Ângulos e polígonos", "basico", (rng) => {
    const n = rng.int(5, 12), S = (n - 2) * 180;
    return {
      e: `Qual é a soma dos ângulos internos de um polígono de ${n} lados?`, c: `${fmt(S)}°`,
      d: [[`${fmt(n * 180)}°`, "É (n − 2)·180°, não n·180°."], [`${fmt((n - 1) * 180)}°`, "Tire 2, não 1."], [`360°`, "360° é a soma dos ângulos EXTERNOS."], [`${fmt((n - 2) * 90)}°`, "Multiplique por 180°."]],
      x: `Sᵢ = (n − 2)·180° = ${n - 2}·180° = ${fmt(S)}°.`, p: [`Um polígono de ${n} lados se divide em ${n - 2} triângulos.`, `Cada triângulo soma 180°: ${fmt(S)}°.`],
      m: "Polígono de n lados = n − 2 triângulos.", viz: (i) => `${fmt(S + i * 180)}°`,
    };
  }),
  g("pol-regular", "Ângulos e polígonos", "intermediario", (rng) => {
    const n = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]), ai = ((n - 2) * 180) / n;
    return {
      e: `Quanto mede cada ângulo interno de um polígono regular de ${n} lados?`, c: `${fmt(ai)}°`,
      d: [[`${fmt(360 / n)}°`, "Esse é o ângulo EXTERNO (360°/n)."], [`${fmt((n - 2) * 180)}°`, "Essa é a soma; falta dividir por n."], [`${fmt(180 / n)}°`, "Use (n − 2)·180°/n."], [`${fmt(ai + 10)}°`, "Refaça a divisão."]],
      x: `Interno = 180° − externo = 180° − 360°/${n} = ${fmt(ai)}°.`, p: [`Externo: 360° ÷ ${n} = ${fmt(360 / n)}°.`, `Interno: 180° − ${fmt(360 / n)}° = ${fmt(ai)}°.`],
      m: "Mais rápido: ache o externo (360/n) e faça 180 − externo.", viz: (i) => `${fmt(ai + i * 5)}°`,
    };
  }),
  g("pol-diag", "Ângulos e polígonos", "avancado", (rng) => {
    const n = rng.int(5, 20), dg = (n * (n - 3)) / 2;
    return {
      e: `Quantas diagonais tem um polígono convexo de ${n} lados?`, c: fmt(dg),
      d: [[fmt(n * (n - 3)), "Cada diagonal foi contada duas vezes: divida por 2."], [fmt((n * (n - 1)) / 2), "Isso conta também os lados. Use n − 3."], [fmt(n - 3), "Essas são as diagonais que saem de UM vértice."], [fmt((n * (n - 2)) / 2), "De cada vértice saem n − 3 diagonais (não liga nele nem nos vizinhos)."]],
      x: `d = n(n − 3)/2 = ${n}·${n - 3}/2 = ${fmt(dg)}.`, p: [`De cada vértice saem ${n - 3} diagonais.`, `${n} vértices × ${n - 3} = ${n * (n - 3)}, cada uma contada 2 vezes.`, `÷ 2 = ${fmt(dg)}.`],
      m: "d = n(n − 3)/2.", viz: nv(dg),
    };
  }),
  // ───────────────────────── Matrizes e determinantes
  g("mat-det2", "Matrizes e determinantes", "basico", (rng) => {
    const [a, b, c, d] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)], det = a * d - b * c;
    return {
      e: `Calcule o determinante da matriz 2×2 abaixo.`, tabela: { cabecalho: ["", ""], linhas: [[`${a}`, `${b}`], [`${c}`, `${d}`]] }, c: fmt(det),
      d: [[fmt(a * d + b * c), "É diagonal principal MENOS a secundária."], [fmt(b * c - a * d), "A ordem é principal − secundária."], [fmt(a * b - c * d), "Multiplique em diagonal, não por linha."], [fmt(a + d), "Isso é o traço (soma da diagonal)."]],
      x: `det = ${a}·${d} − ${b}·${c} = ${a * d} − ${b * c} = ${det}.`, p: [`Principal: ${a}·${d} = ${a * d}.`, `Secundária: ${b}·${c} = ${b * c}.`, `${a * d} − ${b * c} = ${det}.`],
      m: "2×2: desce menos sobe.", viz: nv(det),
    };
  }),
  g("mat-det3", "Matrizes e determinantes", "intermediario", (rng) => {
    const A = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => rng.int(0, 4)));
    const P = A[0][0] * A[1][1] * A[2][2] + A[0][1] * A[1][2] * A[2][0] + A[0][2] * A[1][0] * A[2][1];
    const S = A[0][2] * A[1][1] * A[2][0] + A[0][0] * A[1][2] * A[2][1] + A[0][1] * A[1][0] * A[2][2];
    return {
      e: "Pela regra de Sarrus, o determinante da matriz 3×3 abaixo é:", tabela: { cabecalho: ["", "", ""], linhas: A.map((l) => l.map(String)) }, c: fmt(P - S),
      d: [[fmt(P + S), "As diagonais secundárias entram SUBTRAINDO."], [fmt(S - P), "A ordem é principais − secundárias."], [fmt(P), "Faltou subtrair as diagonais secundárias."], [fmt(A[0][0] * A[1][1] * A[2][2]), "Sarrus usa 3 diagonais em cada sentido."]],
      x: `Principais: ${P}. Secundárias: ${S}. det = ${P} − ${S} = ${P - S}.`, p: ["Repita as duas primeiras colunas ao lado.", `Some os produtos das 3 diagonais descendo: ${P}.`, `Some os 3 subindo: ${S}.`, `det = ${P - S}.`],
      m: "Sarrus: desce somando, sobe subtraindo.", viz: nv(P - S),
    };
  }),
  g("mat-prod", "Matrizes e determinantes", "avancado", (rng) => {
    const A = [[rng.int(0, 5), rng.int(0, 5)], [rng.int(0, 5), rng.int(0, 5)]], B = [[rng.int(0, 5), rng.int(0, 5)], [rng.int(0, 5), rng.int(0, 5)]];
    const i = rng.int(0, 1), j = rng.int(0, 1), v = A[i][0] * B[0][j] + A[i][1] * B[1][j];
    return {
      e: `Sendo A = [${A[0].join(" ")} ; ${A[1].join(" ")}] e B = [${B[0].join(" ")} ; ${B[1].join(" ")}] (linhas separadas por ";"), o elemento c${i === 0 ? "₁" : "₂"}${j === 0 ? "₁" : "₂"} da matriz C = A·B é:`, c: fmt(v),
      d: [[fmt(A[i][j] * B[i][j]), "Produto de matrizes não é elemento a elemento."], [fmt(A[0][i] * B[j][0] + A[1][i] * B[j][1]), "Use LINHA de A com COLUNA de B."], [fmt(A[i][0] + B[0][j] + A[i][1] + B[1][j]), "Multiplique os pares e depois some."], [fmt(B[i][0] * A[0][j] + B[i][1] * A[1][j]), "Isso é B·A. Em matrizes a ordem importa."]],
      x: `c = (linha ${i + 1} de A)·(coluna ${j + 1} de B) = ${A[i][0]}·${B[0][j]} + ${A[i][1]}·${B[1][j]} = ${v}.`, p: [`Linha ${i + 1} de A: (${A[i].join(", ")}).`, `Coluna ${j + 1} de B: (${B[0][j]}, ${B[1][j]}).`, `Multiplica par a par e soma: ${v}.`],
      m: "Linha × coluna, sempre. A·B ≠ B·A.", viz: nv(v),
    };
  }),
  // ───────────────────────── Unidades de medida
  g("uni-comp", "Unidades de medida", "basico", (rng) => {
    const [de, para, f] = rng.pick([["km", "m", 1000], ["m", "cm", 100], ["kg", "g", 1000], ["L", "mL", 1000], ["m", "mm", 1000], ["t", "kg", 1000]] as const);
    const v = rng.int(2, 95) / (rng.bool() ? 10 : 1), res = v * f;
    return {
      e: `${fmt(v)} ${de} correspondem a quantos ${para}?`, c: `${fmt(res)} ${para}`,
      d: [[`${fmt(res / 10)} ${para}`, "Faltou uma casa: confira o fator."], [`${fmt(res * 10)} ${para}`, "Andou uma casa a mais."], [`${fmt(v / f, 4)} ${para}`, "De unidade maior para menor, MULTIPLICA."], [`${fmt(v)} ${para}`, "É preciso converter."]],
      x: `1 ${de} = ${fmt(f)} ${para}. ${fmt(v)} × ${fmt(f)} = ${fmt(res)} ${para}.`, p: [`Fator: 1 ${de} = ${fmt(f)} ${para}.`, "Maior → menor: multiplica.", `${fmt(res)} ${para}.`],
      m: "km hm dam m dm cm mm: cada degrau é ×10.", viz: (i) => `${fmt(res + i * f)} ${para}`,
    };
  }),
  g("uni-tempo", "Unidades de medida", "intermediario", (rng) => {
    const h = rng.int(1, 9), fr = rng.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8, 0.9]), min = Math.round(fr * 60);
    return {
      e: `Uma tarefa levou ${fmt(h + fr)} horas. Isso equivale a:`, c: `${h} h ${min} min`,
      d: [[`${h} h ${Math.round(fr * 100)} min`, "A parte decimal é fração de HORA: multiplique por 60."], [`${h} h ${Math.round(fr * 10)} min`, "0,1 h = 6 min, não 1 min."], [`${h} h ${min + 10} min`, "Refaça: decimal × 60."], [`${h + 1} h ${min - 60 > 0 ? min - 60 : 5} min`, "Confira as horas inteiras."]],
      x: `${fmt(fr)} h × 60 = ${min} min. Total: ${h} h ${min} min.`, p: [`Parte inteira: ${h} h.`, `Parte decimal: ${fmt(fr)} × 60 = ${min} min.`],
      m: "Tempo não é decimal: 0,5 h = 30 min, 0,25 h = 15 min.", viz: (i) => `${h} h ${min + i} min`,
    };
  }),
  g("uni-veloc", "Unidades de medida", "avancado", (rng) => {
    const v = rng.pick([18, 36, 54, 72, 90, 108, 126, 144]), ms = v / 3.6;
    return {
      e: `Um veículo anda a ${v} km/h. Qual é a velocidade em m/s?`, c: `${fmt(ms)} m/s`,
      d: [[`${fmt(v * 3.6)} m/s`, "De km/h para m/s DIVIDE por 3,6."], [`${fmt(v / 60, 1)} m/s`, "1 h = 3.600 s, não 60 s."], [`${fmt(v / 1000 * 3600, 1)} m/s`, "Inverteu o fator."], [`${fmt(ms + 5)} m/s`, "Refaça a divisão por 3,6."]],
      x: `${v} km/h = ${v} × 1.000 m ÷ 3.600 s = ${v} ÷ 3,6 = ${fmt(ms)} m/s.`, p: ["1 km = 1.000 m e 1 h = 3.600 s.", "km/h → m/s: ÷ 3,6.", `${v} ÷ 3,6 = ${fmt(ms)}.`],
      m: "km/h → m/s: ÷ 3,6. m/s → km/h: × 3,6.", viz: (i) => `${fmt(ms + i * 5)} m/s`,
    };
  }),
  // ───────────────────────── Geometria analítica
  g("ga-medio", "Geometria analítica", "basico", (rng) => {
    const x1 = rng.int(-8, 8), y1 = rng.int(-8, 8), x2 = x1 + 2 * rng.int(1, 6), y2 = y1 + 2 * rng.int(-5, 5), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return {
      e: `Qual é o ponto médio do segmento de extremos A(${x1}, ${y1}) e B(${x2}, ${y2})?`, c: `(${mx}, ${my})`,
      d: [[`(${x1 + x2}, ${y1 + y2})`, "Faltou dividir por 2."], [`(${(x2 - x1) / 2}, ${(y2 - y1) / 2})`, "É a MÉDIA das coordenadas: some, não subtraia."], [`(${my}, ${mx})`, "Você trocou x com y."], [`(${mx + 1}, ${my})`, "Refaça a média de x."]],
      x: `M = ((${x1} + ${x2})/2, (${y1} + ${y2})/2) = (${mx}, ${my}).`, p: [`x: (${x1} + ${x2}) ÷ 2 = ${mx}.`, `y: (${y1} + ${y2}) ÷ 2 = ${my}.`],
      m: "Ponto médio = média dos x e média dos y.", viz: (i) => `(${mx + i}, ${my - i})`,
    };
  }),
  g("ga-dist", "Geometria analítica", "intermediario", (rng) => {
    const [a, b, c] = rng.pick(TRI), x1 = rng.int(-5, 5), y1 = rng.int(-5, 5);
    return {
      e: `Qual é a distância entre os pontos A(${x1}, ${y1}) e B(${x1 + a}, ${y1 + b})?`, c: fmt(c),
      d: [[fmt(a + b), "Somar as diferenças dá o caminho 'em L'; a distância é a hipotenusa."], [fmt(a * a + b * b), "Faltou a raiz quadrada."], [fmt(Math.abs(b - a) || 1), "Use Pitágoras: √(Δx² + Δy²)."], [fmt(c + 1), "Refaça a conta."]],
      x: `Δx = ${a}, Δy = ${b}. d = √(${a * a} + ${b * b}) = ${c}.`, p: [`Δx = ${a}; Δy = ${b}.`, `d² = ${a * a + b * b}.`, `d = ${c}.`],
      m: "Distância entre pontos é Pitágoras disfarçado.", viz: nv(c),
    };
  }),
  g("ga-reta", "Geometria analítica", "avancado", (rng) => {
    const m = rng.pick([-3, -2, -1, 1, 2, 3, 4]), n = rng.int(-6, 6), x1 = rng.int(-3, 2), x2 = x1 + rng.int(1, 4);
    const y = (x: number) => m * x + n, eq = (mm: number, nn: number) => `y = ${mm === 1 ? "" : mm === -1 ? "−" : mm}x${nn === 0 ? "" : nn > 0 ? ` + ${nn}` : ` − ${-nn}`}`;
    return {
      e: `A reta que passa por A(${x1}, ${y(x1)}) e B(${x2}, ${y(x2)}) tem equação:`, c: eq(m, n),
      d: [[eq(-m, n), "Coeficiente angular = Δy/Δx: confira o sinal."], [eq(m, -n), "Substitua um ponto para achar o coeficiente linear."], [eq(m, n + m), "Refaça o coeficiente linear: n = y − m·x."], [eq(m === 1 ? 2 : 1, n), "m = (y₂ − y₁)/(x₂ − x₁)."]],
      x: `m = (${y(x2)} − ${y(x1)})/(${x2} − ${x1}) = ${m}. n = ${y(x1)} − ${m}·${x1} = ${n}. ${eq(m, n)}.`, p: [`m = Δy/Δx = ${y(x2) - y(x1)}/${x2 - x1} = ${m}.`, `Substitua A: ${y(x1)} = ${m}·${x1} + n → n = ${n}.`, eq(m, n)],
      m: "m = Δy/Δx; depois substitua um ponto para achar n.", viz: (i) => eq(m, n + 2 * i),
    };
  }),
  // ───────────────────────── Níveis que faltavam nos temas já existentes
  g("fr-resto", "Frações", "avancado", (rng) => {
    const [a, b] = rng.pick([[2, 3], [1, 4], [2, 5], [1, 3], [3, 5]] as const), [c, d] = rng.pick([[1, 3], [1, 2], [1, 4], [2, 3]] as const);
    const S = b * d * rng.int(20, 60) * 10, s1 = S - (S * a) / b, sobra = s1 - (s1 * c) / d;
    return {
      e: `De um salário de ${brl(S)}, gastou-se ${a}/${b} com contas e, depois, ${c}/${d} DO RESTANTE com lazer. Quanto sobrou?`, c: brl(sobra),
      d: [[brl(S - (S * a) / b - (S * c) / d), "A 2ª fração é do RESTANTE, não do salário."], [brl(s1), "Esse é o restante antes do lazer."], [brl((s1 * c) / d), "Esse é o gasto com lazer."], [brl((S * a) / b), "Esse é o gasto com contas."]],
      x: `Depois das contas: ${brl(S)} × ${fracao(b - a, b)} = ${brl(s1)}. Depois do lazer: ${brl(s1)} × ${fracao(d - c, d)} = ${brl(sobra)}.`, p: [`Sobra 1: ${fracao(b - a, b)} de ${brl(S)} = ${brl(s1)}.`, `Sobra 2: ${fracao(d - c, d)} de ${brl(s1)} = ${brl(sobra)}.`],
      m: "'Do restante': calcule primeiro o que sobrou.", viz: vizinhos(sobra, 50, brl),
    };
  }),
  g("js-basico", "Juros simples", "basico", (rng) => {
    const C = rng.int(2, 30) * 100, i = rng.int(1, 5), t = rng.int(2, 12), J = (C * i * t) / 100;
    return {
      e: `Qual é o juro simples de ${brl(C)} aplicados a ${i}% ao mês durante ${t} meses?`, c: brl(J),
      d: [[brl(C + J), "Esse é o montante (capital + juros)."], [brl((C * i) / 100), "Esse é o juro de UM mês."], [brl(C * i * t), "Faltou dividir a taxa por 100."], [brl(J / 2), "Refaça C·i·t."]],
      x: `J = C·i·t = ${brl(C)} × ${i}% × ${t} = ${brl(J)}.`, p: [`Juro de 1 mês: ${i}% de ${brl(C)} = ${brl((C * i) / 100)}.`, `${t} meses: × ${t} = ${brl(J)}.`],
      m: "Juro simples = juro de 1 mês × número de meses.", viz: vizinhos(J, 10, brl),
    };
  }),
  g("jc-basico", "Juros compostos", "basico", (rng) => {
    const C = rng.int(1, 20) * 1000, i = rng.pick([10, 20]), M = C * (1 + i / 100) ** 2;
    return {
      e: `${brl(C)} aplicados a juros compostos de ${i}% ao mês. Qual o montante após 2 meses?`, c: brl(M),
      d: [[brl(C * (1 + (2 * i) / 100)), "Esse seria juro SIMPLES. No composto o 2º mês rende sobre o montante."], [brl((C * i) / 100), "Esse é só o juro do 1º mês."], [brl(C * (1 + i / 100)), "Esse é o montante de 1 mês."], [brl(M - C), "Esse é só o juro, não o montante."]],
      x: `M = C·(1 + i)² = ${brl(C)} × ${fmt(1 + i / 100)}² = ${brl(M)}.`, p: [`1º mês: ${brl(C)} × ${fmt(1 + i / 100)} = ${brl(C * (1 + i / 100))}.`, `2º mês: × ${fmt(1 + i / 100)} = ${brl(M)}.`],
      m: "Composto: multiplica pelo fator em cada mês.", viz: vizinhos(M, 100, brl),
    };
  }),
  g("jc-compara", "Juros compostos", "avancado", (rng) => {
    const C = rng.int(1, 10) * 1000, dif = C * (1.1 ** 3 - 1.3);
    return {
      e: `${brl(C)} aplicados por 3 meses a 10% ao mês. Quanto o montante a juros compostos supera o montante a juros simples?`, c: brl(dif),
      d: [[brl(0), "No 1º mês são iguais, mas depois o composto rende juros sobre juros."], [brl(C * 0.3), "Esse é o juro simples total."], [brl(C * (1.1 ** 3 - 1)), "Esse é o juro composto total."], [brl(C * 0.01), "Essa é a diferença em 2 meses, não em 3."]],
      x: `Simples: ${brl(C * 1.3)}. Composto: ${brl(C)} × 1,331 = ${brl(C * 1.331)}. Diferença: ${brl(dif)}.`, p: [`Simples: ${brl(C)} × 1,30 = ${brl(C * 1.3)}.`, `Composto: ${brl(C)} × 1,1³ = ${brl(C * 1.331)}.`, `Diferença: ${brl(dif)}.`],
      m: "1,1² = 1,21 e 1,1³ = 1,331: decore.", viz: vizinhos(dif, 10, brl),
    };
  }),
  g("log-basico", "Logaritmos e exponencial", "basico", (rng) => {
    const b = rng.pick([2, 3, 5, 10]), k = rng.int(2, b === 2 ? 7 : b === 10 ? 5 : 4), N = b ** k;
    return {
      e: `Quanto vale log${b === 10 ? "" : `₍${b}₎`} ${fmt(N)}?`, c: fmt(k),
      d: [[fmt(N / b), "Log é o EXPOENTE, não a divisão."], [fmt(b * k), "O log é o expoente: b elevado a quanto dá N?"], [fmt(k + 1), "Conte de novo as multiplicações."], [fmt(k - 1), "Conte de novo as multiplicações."]],
      x: `${b}${sup(k)} = ${fmt(N)}, logo log${b === 10 ? "" : `₍${b}₎`} ${fmt(N)} = ${k}.`, p: [`Pergunta: ${b} elevado a quanto dá ${fmt(N)}?`, `${b}${sup(k)} = ${fmt(N)} → ${k}.`],
      m: "Log é a pergunta: 'a base elevada a quanto dá o número?'", viz: nv(k),
    };
  }),
  g("log-prop", "Logaritmos e exponencial", "avancado", (rng) => {
    const [a, b] = rng.pick([[2, 1], [1, 1], [2, 2], [3, 1], [1, 2], [4, 1], [0, 2], [3, 2]] as const), N = 2 ** a * 3 ** b, v = a * 0.301 + b * 0.477;
    return {
      e: `Dados log 2 = 0,301 e log 3 = 0,477, quanto vale log ${N}?`, c: fmt(v, 3),
      d: [[fmt(0.301 * 0.477 * (a + b), 3), "Log do produto é a SOMA dos logs."], [fmt(b * 0.301 + a * 0.477, 3), "Você trocou as quantidades de 2 e de 3."], [fmt(0.301 + 0.477, 3), `Fatore ${N} completo: 2${sup(a)}·3${sup(b)}.`], [fmt(v + 0.301, 3), "Conte de novo os fatores 2."]],
      x: `${N} = 2${sup(a)}·3${sup(b)}. log ${N} = ${a}·0,301 + ${b}·0,477 = ${fmt(v, 3)}.`, p: [`Fatore: ${N} = 2${sup(a)}·3${sup(b)}.`, "log(x·y) = log x + log y e log xⁿ = n·log x.", `${fmt(a * 0.301, 3)} + ${fmt(b * 0.477, 3)} = ${fmt(v, 3)}.`],
      m: "Fatore em 2 e 3 e transforme produto em soma.", viz: (i) => fmt(v + i * 0.1, 3),
    };
  }),
  g("circ-roda", "Circunferência", "intermediario", (rng) => {
    const r = rng.pick([20, 25, 30, 35, 40, 50]), n = rng.int(10, 100), d = (2 * 3.14 * r * n) / 100;
    return {
      e: `Uma roda de ${r} cm de raio dá ${n} voltas completas. Quantos metros percorre? (π = 3,14)`, c: `${fmt(d)} m`,
      d: [[`${fmt(d / 2)} m`, "Comprimento é 2πr: faltou o 2."], [`${fmt((3.14 * r * r * n) / 100)} m`, "πr² é área, não comprimento."], [`${fmt(d * 100)} m`, "Faltou converter cm para m."], [`${fmt(d * 2)} m`, "Você usou o diâmetro no lugar do raio na fórmula 2πr."]],
      x: `Uma volta: 2·3,14·${r} = ${fmt(2 * 3.14 * r)} cm. ${n} voltas: ${fmt(2 * 3.14 * r * n)} cm = ${fmt(d)} m.`, p: [`C = 2πr = ${fmt(2 * 3.14 * r)} cm.`, `× ${n} = ${fmt(2 * 3.14 * r * n)} cm.`, `÷ 100 = ${fmt(d)} m.`],
      m: "Uma volta da roda = comprimento da circunferência.", viz: (i) => `${fmt(d + i * 3)} m`,
    };
  }),
  g("circ-coroa", "Circunferência", "avancado", (rng) => {
    const r = rng.int(2, 10), R = r + rng.int(1, 6), A = 3 * (R * R - r * r);
    return {
      e: `Uma pista circular tem raio externo ${R} m e raio interno ${r} m. Qual é a área da pista? (π = 3)`, c: `${fmt(A)} m²`,
      d: [[`${fmt(3 * (R - r) ** 2)} m²`, "Não é π(R − r)²: é π(R² − r²)."], [`${fmt(3 * R * R)} m²`, "Faltou tirar o círculo interno."], [`${fmt(6 * (R - r))} m²`, "2π(R − r) não é área."], [`${fmt(3 * (R * R + r * r))} m²`, "O círculo interno é retirado, não somado."]],
      x: `A = π(R² − r²) = 3·(${R * R} − ${r * r}) = ${fmt(A)} m².`, p: [`Círculo grande: 3·${R * R} = ${3 * R * R}.`, `Círculo pequeno: 3·${r * r} = ${3 * r * r}.`, `Diferença: ${fmt(A)} m².`],
      m: "Coroa = círculo grande − círculo pequeno.", viz: (i) => `${fmt(A + i * 3)} m²`,
    };
  }),
  g("esp-caixa", "Geometria espacial", "basico", (rng) => {
    const a = rng.int(2, 9) * 10, b = rng.int(2, 9) * 10, c = rng.int(2, 9) * 10, V = (a * b * c) / 1000;
    return {
      e: `Uma caixa tem ${a} cm × ${b} cm × ${c} cm. Quantos litros cabem nela?`, c: `${fmt(V)} L`,
      d: [[`${fmt(a * b * c)} L`, "Isso está em cm³: 1 L = 1.000 cm³."], [`${fmt(V * 10)} L`, "Confira: 1 dm³ = 1 L = 1.000 cm³."], [`${fmt((a + b + c) / 10)} L`, "Volume é multiplicação das três medidas."], [`${fmt((a * b) / 1000)} L`, "Faltou a altura."]],
      x: `V = ${a}·${b}·${c} = ${fmt(a * b * c)} cm³ = ${fmt(V)} L.`, p: [`V = comprimento × largura × altura = ${fmt(a * b * c)} cm³.`, `÷ 1.000 = ${fmt(V)} L.`],
      m: "1 L = 1 dm³ = 1.000 cm³; 1 m³ = 1.000 L.", viz: (i) => `${fmt(V + i * 2)} L`,
    };
  }),
  g("esp-cilindro", "Geometria espacial", "avancado", (rng) => {
    const r = rng.int(1, 4), h = rng.int(2, 6), V = 3 * r * r * h * 1000;
    return {
      e: `Uma caixa-d'água cilíndrica tem ${r} m de raio e ${h} m de altura. Quantos litros cabem? (π = 3)`, c: `${fmt(V)} L`,
      d: [[`${fmt(V / 1000)} L`, "Isso está em m³: 1 m³ = 1.000 L."], [`${fmt(V / 3)} L`, "Dividir por 3 é para cone; cilindro não divide."], [`${fmt(6 * r * h * 1000)} L`, "2πrh é a área lateral, não o volume."], [`${fmt(3 * (2 * r) ** 2 * h * 1000)} L`, "Você usou o diâmetro no lugar do raio."]],
      x: `V = πr²h = 3·${r * r}·${h} = ${3 * r * r * h} m³ = ${fmt(V)} L.`, p: [`Base: 3·${r}² = ${3 * r * r} m².`, `× altura ${h} = ${3 * r * r * h} m³.`, `× 1.000 = ${fmt(V)} L.`],
      m: "Cilindro = área da base × altura. 1 m³ = 1.000 L.", viz: (i) => `${fmt(V + i * 1000)} L`,
    };
  }),
  g("comb-anagrama", "Análise combinatória", "avancado", (rng) => {
    const w = rng.pick(["BANANA", "ARARA", "BATATA", "CABANA", "PAPAI", "MALALA", "CASACA", "OVO", "PARAR", "ANANAS"]);
    const fat = (n: number): number => (n <= 1 ? 1 : n * fat(n - 1));
    const cont: Record<string, number> = {}; for (const ch of w) cont[ch] = (cont[ch] || 0) + 1;
    const reps = Object.values(cont).filter((x) => x > 1), den = reps.reduce((s, x) => s * fat(x), 1), res = fat(w.length) / den;
    return {
      e: `Quantos anagramas tem a palavra ${w}?`, c: fmt(res),
      d: [[fmt(fat(w.length)), "Letras repetidas geram anagramas iguais: divida pelos fatoriais das repetições."], [fmt(fat(w.length) / fat(Math.max(...reps))), "Faltou dividir pela repetição das outras letras."], [fmt(fat(w.length - 1)), "Todas as letras entram: é n!, não (n − 1)!."], [fmt(res * 2), "Confira as repetições."]],
      x: `${w}: ${w.length} letras, repetições ${Object.entries(cont).filter(([, x]) => x > 1).map(([l, x]) => `${l} (${x}×)`).join(", ")}. P = ${w.length}!/(${reps.map((x) => `${x}!`).join("·")}) = ${fmt(res)}.`, p: [`Total sem repetição: ${w.length}! = ${fmt(fat(w.length))}.`, `Divida por ${reps.map((x) => `${x}!`).join("·")} = ${den}.`, `${fmt(res)}.`],
      m: "Permutação com repetição: n! ÷ (fatorial de cada repetição).", viz: nv(res),
    };
  }),
  g("mmc-tres", "MMC e MDC", "avancado", (rng) => {
    const [a, b, c] = rng.pick([[10, 12, 15], [6, 8, 12], [4, 6, 10], [8, 12, 18], [15, 20, 30], [6, 10, 15], [12, 18, 20], [9, 12, 18]] as const);
    const L = mmc(mmc(a, b), c), h0 = rng.int(6, 10), hora = (m: number) => `${h0 + Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
    return {
      e: `Três alarmes tocam juntos às ${h0}h00. Um toca a cada ${a} min, outro a cada ${b} min e outro a cada ${c} min. A que horas tocarão juntos de novo?`, c: hora(L),
      d: [[hora(mmc(a, b)), `Esse é o MMC só dos dois primeiros (${mmc(a, b)} min).`], [hora((a * b * c) % 600), "Multiplicar os três não dá o MÍNIMO múltiplo comum."], [hora(a + b + c), "Somar os intervalos não serve: use o MMC."], [hora(L / 2), "Esse é metade do MMC."]],
      x: `MMC(${a}, ${b}, ${c}) = ${L} min. ${h0}h00 + ${L} min = ${hora(L)}.`, p: [`Fatore: MMC(${a}, ${b}, ${c}) = ${L}.`, `${L} min = ${Math.floor(L / 60)} h ${L % 60} min.`, `Horário: ${hora(L)}.`],
      m: "'Juntos de novo' = MMC.", viz: (i) => hora(L + i * 5),
    };
  }),
  g("ops-expr", "Quatro operações", "intermediario", (rng) => {
    const a = rng.int(2, 30), b = rng.int(2, 9), c = rng.int(2, 9), e = rng.int(2, 6), d = e * rng.int(2, 9), res = a + b * c - d / e;
    return {
      e: `Qual o valor da expressão ${a} + ${b} × ${c} − ${d} ÷ ${e}?`, c: fmt(res),
      d: [[fmt(((a + b) * c - d) / e), "Você fez da esquerda para a direita. × e ÷ vêm antes de + e −."], [fmt((a + b) * c - d / e), "A multiplicação vem antes da soma."], [fmt(a + b * c - d), `Faltou dividir ${d} por ${e}.`], [fmt(a + b * (c - d / e)), "Não há parênteses: siga a ordem."]],
      x: `Primeiro × e ÷: ${b}×${c} = ${b * c} e ${d}÷${e} = ${d / e}. Depois: ${a} + ${b * c} − ${d / e} = ${res}.`, p: [`${b} × ${c} = ${b * c}.`, `${d} ÷ ${e} = ${d / e}.`, `${a} + ${b * c} − ${d / e} = ${res}.`],
      m: "Ordem: parênteses → potência → × e ÷ → + e −.", viz: nv(res),
    };
  }),
  g("ops-calendario", "Quatro operações", "avancado", (rng) => {
    const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    const h = rng.int(0, 6), N = rng.int(30, 400), f = (h + N) % 7;
    return {
      e: `Hoje é ${DIAS[h]}. Que dia da semana será daqui a ${N} dias?`, c: DIAS[f],
      d: [[DIAS[(f + 1) % 7], "Um dia a mais: o resto já conta os dias à frente."], [DIAS[(f + 6) % 7], "Um dia a menos: confira o resto."], [DIAS[(h + Math.floor(N / 7)) % 7], "Use o RESTO da divisão por 7, não o quociente."], [DIAS[(f + 2) % 7], "Refaça o resto."], [DIAS[(f + 5) % 7], "Refaça o resto."]],
      x: `${N} ÷ 7 = ${Math.floor(N / 7)} semanas e resto ${N % 7}. Semanas inteiras voltam ao mesmo dia; ande ${N % 7} dias: ${DIAS[f]}.`, p: [`${N} = 7 × ${Math.floor(N / 7)} + ${N % 7}.`, `De ${DIAS[h]}, ande ${N % 7} dias.`, DIAS[f]],
      m: "Ciclos: divida pelo tamanho do ciclo e olhe o RESTO.",
    };
  }),
  g("razao-basica", "Razão e proporção", "basico", (rng) => {
    const k = rng.int(2, 9), a = rng.int(1, 6) * k, b = rng.int(1, 6) * k;
    return {
      e: `Em uma sala há ${a} homens e ${b} mulheres. A razão entre homens e mulheres é:`, c: fracao(a, b),
      d: [[fracao(b, a), "Você inverteu: a razão é homens / mulheres, na ordem do enunciado."], [fracao(a, a + b), "Essa é homens sobre o TOTAL."], [fracao(b, a + b), "Essa é mulheres sobre o total."], [`${a - b}`, "Razão é divisão, não subtração."]],
      x: `${a}/${b} = ${fracao(a, b)}.`, p: [`Razão de A para B = A/B = ${a}/${b}.`, `Simplificando: ${fracao(a, b)}.`],
      m: "Razão segue a ordem do texto: 'de A para B' = A/B.", viz: (i) => fracao(a + i, b),
    };
  }),
  g("razao-inversa", "Razão e proporção", "avancado", (rng) => {
    const a = rng.int(2, 6), b = rng.int(a + 1, 9), k = rng.int(10, 80) * 10, T = k * (a + b), pa = k * b;
    return {
      e: `${brl(T)} serão divididos entre dois servidores em partes INVERSAMENTE proporcionais às suas faltas: ${a} e ${b}. Quanto recebe quem faltou ${a} vezes?`, c: brl(pa),
      d: [[brl(k * a), "Essa seria a divisão DIRETAMENTE proporcional."], [brl(T / 2), "Não é metade: quem falta menos recebe mais."], [brl(T - k * a), "Refaça: parte = T·b/(a + b)."], [brl(k * a * b), "Refaça a constante."]],
      x: `Inversa: proporcional a 1/${a} e 1/${b}, ou seja, a ${b} e ${a}. Parte = ${brl(T)} × ${b}/${a + b} = ${brl(pa)}.`, p: [`Troque as faltas: quem faltou ${a} recebe ${b} partes; quem faltou ${b}, ${a} partes.`, `Total de partes: ${a + b}; cada parte = ${brl(k)}.`, `${b} partes = ${brl(pa)}.`],
      m: "Inversa com dois: troque os números e divida direto.", viz: vizinhos(pa, 50, brl),
    };
  }),
  g("prob-idade", "Resolução de problemas", "basico", (rng) => {
    const f = rng.int(4, 20), k = rng.int(2, 4), S = f * (k + 1);
    return {
      e: `A idade de um pai é ${["", "", "o dobro", "o triplo", "o quádruplo"][k]} da idade do filho, e juntos somam ${S} anos. Qual a idade do filho?`, c: `${f} anos`,
      d: [[`${f * k} anos`, "Essa é a idade do pai."], [`${S / 2} anos`, "Não é metade: o pai tem mais partes."], [`${Math.round(S / k)} anos`, `São ${k + 1} partes (${k} do pai + 1 do filho).`], [`${f + 1} anos`, "Confira a soma."]],
      x: `Filho = x, pai = ${k}x. x + ${k}x = ${S} → ${k + 1}x = ${S} → x = ${f}.`, p: [`Filho: x; pai: ${k}x.`, `${k + 1}x = ${S}.`, `x = ${f}.`],
      m: "Conte as 'partes': filho 1 + pai k.", viz: (i) => `${f + i} anos`,
    };
  }),
  g("din-troco", "Sistema monetário", "intermediario", (rng) => {
    const n1 = rng.int(2, 6), p1 = rng.int(150, 990) / 100, n2 = rng.int(1, 4), p2 = rng.int(200, 1500) / 100, tot = n1 * p1 + n2 * p2, nota = tot < 50 ? 50 : tot < 100 ? 100 : 200, tr = nota - tot;
    return {
      e: `Comprei ${n1} cadernos a ${brl(p1)} cada e ${n2} caneta(s) de ${brl(p2)} cada, pagando com uma nota de ${brl(nota)}. Qual foi o troco?`, c: brl(tr),
      d: [[brl(tot), "Esse é o total da compra."], [brl(nota - p1 - p2), "Multiplique cada preço pela quantidade."], [brl(nota - n1 * p1), "Faltou descontar as canetas."], [brl(tr + 1), "Alinhe as vírgulas ao somar."]],
      x: `Total: ${n1}×${brl(p1)} + ${n2}×${brl(p2)} = ${brl(tot)}. Troco: ${brl(nota)} − ${brl(tot)} = ${brl(tr)}.`, p: [`Cadernos: ${brl(n1 * p1)}.`, `Canetas: ${brl(n2 * p2)}.`, `Troco: ${brl(tr)}.`],
      m: "Some tudo, depois subtraia da nota.", viz: vizinhos(tr, 0.5, brl),
    };
  }),
  g("din-parcela", "Sistema monetário", "avancado", (rng) => {
    const k = rng.pick([3, 4, 5, 6, 10, 12]), P = rng.int(50, 400), pr = P * k, d = rng.pick([5, 8, 10, 12, 15]), ent = rng.pick([0, 100, 200]);
    const tot = ent + pr;
    return {
      e: `Um produto custa ${ent ? `${brl(ent)} de entrada mais ` : ""}${k} parcelas de ${brl(P)}, ou à vista com ${d}% de desconto sobre o preço total a prazo. Quanto se economiza pagando à vista?`, c: brl((tot * d) / 100),
      d: [[brl((pr * d) / 100), "A entrada também faz parte do preço a prazo."], [brl(tot * (1 - d / 100)), "Esse é o preço à vista, não a economia."], [brl((P * d) / 100), "O desconto é sobre o total, não sobre uma parcela."], [brl(tot), "Esse é o preço a prazo."]],
      x: `A prazo: ${ent ? `${brl(ent)} + ` : ""}${k}×${brl(P)} = ${brl(tot)}. Economia: ${d}% de ${brl(tot)} = ${brl((tot * d) / 100)}.`, p: [`Preço a prazo: ${brl(tot)}.`, `${d}% disso: ${brl((tot * d) / 100)}.`],
      m: "Economia = desconto% × preço cheio.", viz: vizinhos((tot * d) / 100, 10, brl),
    };
  }),
  g("tab-variacao", "Tabelas e gráficos", "avancado", (rng) => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai"];
    const v = [rng.int(10, 40) * 10]; for (let i = 1; i < 5; i++) v.push(Math.max(50, v[i - 1] + rng.int(-8, 12) * 10));
    const pcts = v.slice(1).map((x, i) => ((x - v[i]) / v[i]) * 100), best = pcts.indexOf(Math.max(...pcts)), abs = v.slice(1).map((x, i) => x - v[i]);
    const ab = abs.indexOf(Math.max(...abs));
    const rot = (i: number) => `de ${meses[i]} para ${meses[i + 1]}`;
    const outros = [0, 1, 2, 3].filter((i) => i !== best);
    return {
      e: "A tabela mostra os atendimentos de um posto. Em qual mudança de mês houve o MAIOR aumento PERCENTUAL?", tabela: { cabecalho: meses, linhas: [v.map(String)] }, c: rot(best),
      d: [...outros.map((i): D => [rot(i), i === ab ? "Esse foi o maior aumento em NÚMEROS, mas o percentual depende da base." : `Variação ${rot(i)}: ${fmt(pcts[i])}%, menor.`]), ["de Jan para Mai", "A pergunta é sobre meses seguidos."]],
      x: `Variação % = (novo − antigo)/antigo. ${pcts.map((p, i) => `${rot(i)}: ${fmt(p)}%`).join("; ")}. Maior: ${rot(best)}.`, p: pcts.map((p, i) => `${rot(i)}: (${v[i + 1]} − ${v[i]})/${v[i]} = ${fmt(p)}%`),
      m: "Percentual compara com a BASE (o valor antigo).",
    };
  }),
  g("tales-sombra", "Teorema de Tales", "basico", (rng) => {
    const hb = rng.pick([1, 2]), sb = rng.pick([0.5, 1, 1.5, 2, 2.5, 3]), S = rng.int(3, 20) * sb, H = (hb * S) / sb;
    return {
      e: `No mesmo instante, um bastão de ${hb} m projeta sombra de ${fmt(sb)} m e um poste projeta sombra de ${fmt(S)} m. Qual a altura do poste?`, c: `${fmt(H)} m`,
      d: [[`${fmt((sb * S) / hb)} m`, "Proporção invertida: altura/sombra é igual nos dois."], [`${fmt(S)} m`, "Essa é a sombra do poste."], [`${fmt(S + hb - sb)} m`, "Não se soma diferenças: monte a proporção."], [`${fmt(H + 1)} m`, "Refaça a regra de três."]],
      x: `${hb}/${fmt(sb)} = H/${fmt(S)} → H = ${fmt(H)} m.`, p: ["Os raios de sol são paralelos: triângulos semelhantes.", `altura/sombra: ${hb}/${fmt(sb)} = H/${fmt(S)}.`, `H = ${fmt(H)} m.`],
      m: "Altura está para sombra assim como altura está para sombra.", viz: (i) => `${fmt(H + i)} m`,
    };
  }),
  g("tales-x", "Teorema de Tales", "avancado", (rng) => {
    const x = rng.int(2, 9), p = rng.int(2, 4), s = rng.int(1, 8);
    const s1 = p * x, s2 = x + s, A = rng.int(2, 5) * s1, B = (A / s1) * s2;
    return {
      e: `Três retas paralelas cortam duas transversais. Numa, os segmentos medem ${p}x e x + ${s}; na outra, os correspondentes medem ${A} e ${B}. Quanto vale x?`, c: fmt(x),
      d: [[fmt(s1), `Esse é o segmento ${p}x, não x.`], [fmt(s2), `Esse é o segmento x + ${s}.`], [fmt(x + 1), "Substitua e confira a proporção."], [fmt(s), "Monte a proporção e resolva."]],
      x: `${p}x/(x + ${s}) = ${A}/${B} → ${p * B}x = ${A}x + ${A * s} → x = ${x}.`, p: [`Proporção: ${p}x/${A} = (x + ${s})/${B}.`, `Multiplicando cruzado: ${p * B}x = ${A}x + ${A * s}.`, `${p * B - A}x = ${A * s} → x = ${x}.`],
      m: "Mesma ordem nas duas transversais e multiplique cruzado.", viz: nv(x),
    };
  }),
  g("dir-graus", "Noções de direção", "avancado", (rng) => {
    const R = ["Norte", "Nordeste", "Leste", "Sudeste", "Sul", "Sudoeste", "Oeste", "Noroeste"];
    const giros = Array.from({ length: rng.int(3, 5) }, () => rng.pick([45, 90, 135, 180, -45, -90, -135]));
    const tot = giros.reduce((a, b) => a + b, 0), f = (((tot / 45) % 8) + 8) % 8;
    const txt = giros.map((gg) => `${Math.abs(gg)}° à ${gg > 0 ? "direita" : "esquerda"}`).join(", ");
    return {
      e: `Uma pessoa está virada para o Norte e gira, em sequência: ${txt}. Para onde fica virada?`, c: R[f],
      d: [[R[(8 - f) % 8], "Você inverteu direita e esquerda: direita é sentido horário."], [R[(f + 4) % 8], "Confira os giros de 180°."], [R[(f + 1) % 8], "Some os giros com sinal: direita +, esquerda −."], [R[(f + 7) % 8], "Some os giros com sinal: direita +, esquerda −."], [R[(f + 2) % 8], "Refaça a soma."]],
      x: `Saldo: ${giros.map((gg) => (gg > 0 ? `+${gg}` : `${gg}`)).join(" ")} = ${tot}°. A partir do Norte, ${tot}° → ${R[f]}.`, p: ["Direita = +, esquerda = −.", `Saldo: ${tot}°.`, `Cada 45° = um ponto da rosa dos ventos: ${R[f]}.`],
      m: "Some tudo com sinal e só depois ande na rosa dos ventos.",
    };
  }),
  g("arr-cient", "Arredondamento e estimativa", "avancado", (rng) => {
    const m = rng.int(11, 99) / 10, e = rng.pick([-5, -4, -3, -2, 3, 4, 5, 6]), v = m * 10 ** e;
    const num = e < 0 ? v.toFixed(-e + 1).replace(".", ",") : fmt(v, 0);
    const nc = (mm: number, ee: number) => `${fmt(mm, 1)} × 10${sup(ee)}`;
    return {
      e: `Em notação científica, o número ${num} se escreve:`, c: nc(m, e),
      d: [[nc(m, -e), "O sinal do expoente: número pequeno (< 1) tem expoente negativo."], [nc(m, e + 1), "Conte de novo as casas que a vírgula andou."], [nc(m, e - 1), "Conte de novo as casas que a vírgula andou."], [`${fmt(m * 10, 0)} × 10${sup(e - 1)}`, "Em notação científica o número fica entre 1 e 10."]],
      x: `Coloque a vírgula depois do 1º algarismo não nulo (${fmt(m, 1)}) e conte as casas: ${num} = ${nc(m, e)}.`, p: [`Mantissa entre 1 e 10: ${fmt(m, 1)}.`, `A vírgula andou ${Math.abs(e)} casas para a ${e < 0 ? "direita (expoente negativo)" : "esquerda (expoente positivo)"}.`],
      m: "Número grande: expoente positivo. Número pequeno: negativo.",
    };
  }),
  g("fun-maximo", "Funções e equações", "avancado", (rng) => {
    const b = rng.int(2, 20) * 2, c = rng.int(0, 50), xv = b / 2, L = -xv * xv + b * xv + c;
    return {
      e: `O lucro de uma loja é L(x) = −x² + ${b}x${c ? ` + ${c}` : ""}, em que x é a quantidade vendida. Qual é o lucro MÁXIMO?`, c: fmt(L),
      d: [[fmt(xv), "Esse é o x do vértice (quantidade), não o lucro."], [fmt(c), "Esse é o lucro com x = 0."], [fmt(b * b + c), "Faltou o sinal de −x²: substitua xᵥ com cuidado."], [fmt(L - xv), "Refaça L(xᵥ)."]],
      x: `xᵥ = −b/2a = ${b}/2 = ${xv}. L(${xv}) = −${xv * xv} + ${b * xv} + ${c} = ${fmt(L)}.`, p: [`a = −1 < 0: parábola para baixo, tem máximo.`, `xᵥ = ${xv}.`, `L(${xv}) = ${fmt(L)}.`],
      m: "Máximo/mínimo = vértice. Ache xᵥ e substitua (ou yᵥ = −Δ/4a).", viz: nv(L, 2),
    };
  }),
  g("area-composta", "Áreas e superfícies", "avancado", (rng) => {
    const L = rng.int(10, 30), W = rng.int(8, 20), r = rng.int(1, Math.floor(Math.min(L, W) / 2) - 1), A = L * W - 3 * r * r;
    return {
      e: `Um terreno retangular de ${L} m × ${W} m tem um canteiro circular de raio ${r} m que NÃO será gramado. Quantos m² de grama são necessários? (π = 3)`, c: `${fmt(A)} m²`,
      d: [[`${fmt(L * W)} m²`, "Faltou tirar o canteiro."], [`${fmt(L * W - 6 * r)} m²`, "2πr é comprimento; área do círculo é πr²."], [`${fmt(L * W - 3 * (2 * r) ** 2)} m²`, "Você usou o diâmetro no lugar do raio."], [`${fmt(L * W + 3 * r * r)} m²`, "O canteiro é retirado, não somado."]],
      x: `Retângulo: ${L * W} m². Círculo: 3·${r}² = ${3 * r * r} m². Grama: ${fmt(A)} m².`, p: [`${L} × ${W} = ${L * W}.`, `3 × ${r * r} = ${3 * r * r}.`, `${L * W} − ${3 * r * r} = ${fmt(A)}.`],
      m: "Figura composta: divida em partes conhecidas, some ou subtraia.", viz: (i) => `${fmt(A + i * 3)} m²`,
    };
  }),
];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const PROPS: [string, string][] = [
  ["João estuda", "João não estuda"], ["Maria trabalha", "Maria não trabalha"], ["chove", "não chove"], ["o ônibus atrasa", "o ônibus não atrasa"],
  ["a loja abre", "a loja não abre"], ["Pedro é aprovado", "Pedro não é aprovado"], ["o servidor é pontual", "o servidor não é pontual"],
  ["Ana viaja", "Ana não viaja"], ["o relatório está pronto", "o relatório não está pronto"], ["faz sol", "não faz sol"],
];

/** Aulas curtas dos temas novos, já separadas por nível (Início, Intermediário, Avançado). */
export const resumosMatC: Record<string, { t: string[]; cai: string; macete: string }> = {
  Progressões: { t: ["INÍCIO: PA soma sempre a mesma razão (2, 5, 8, 11: r = 3). PG multiplica sempre pela mesma razão (3, 6, 12, 24: q = 2).", "Termo geral: PA aₙ = a₁ + (n − 1)·r. PG aₙ = a₁·qⁿ⁻¹. Do 1º ao n-ésimo termo há n − 1 pulos.", "INTERMEDIÁRIO: soma da PA Sₙ = (a₁ + aₙ)·n/2. Soma da PG Sₙ = a₁(qⁿ − 1)/(q − 1).", "Interpolar k meios entre dois números = k + 1 pulos: r = (último − primeiro)/(k + 1).", "AVANÇADO: soma dos múltiplos de k até N: quantidade n = parte inteira de N/k e use a soma da PA.", "PG infinita com |q| < 1: S = a₁/(1 − q). Ex.: 40 + 20 + 10 + ... = 40/(1 − 1/2) = 80."], cai: "Termo geral, soma da PA, soma da PG e PG infinita.", macete: "PA soma, PG multiplica. Pulos = termos − 1." },
  "Potenciação e radiciação": { t: ["INÍCIO: aⁿ = a multiplicado por ele mesmo n vezes. 2⁵ = 32. Todo número elevado a 0 dá 1.", "INTERMEDIÁRIO: mesma base: multiplicação soma expoentes (aᵐ·aⁿ = aᵐ⁺ⁿ), divisão subtrai (aᵐ/aⁿ = aᵐ⁻ⁿ), potência de potência multiplica ((aᵐ)ⁿ = aᵐⁿ).", "Expoente negativo inverte: 2⁻³ = 1/8.", "AVANÇADO: simplificar raiz: tire os quadrados perfeitos. √72 = √(36·2) = 6√2.", "Raiz como potência: √a = a^(1/2)."], cai: "Propriedades com mesma base e simplificação de raízes.", macete: "Multiplica → soma; divide → subtrai; potência de potência → multiplica." },
  "Equação do 1º grau": { t: ["INÍCIO: isole o x. O que está somando passa subtraindo; o que está multiplicando passa dividindo. 3x + 5 = 20 → 3x = 15 → x = 5.", "INTERMEDIÁRIO: traduza o texto. 'O triplo de um número' = 3x; 'a metade' = x/2; 'excede em 5' = + 5.", "AVANÇADO: frações do total: descubra a fração que sobrou e divida o valor que sobrou por ela."], cai: "Problemas de texto e frações de salário.", macete: "Escreva a equação antes de fazer contas." },
  "Equação do 2º grau": { t: ["INÍCIO: x² = k → x = ±√k (duas raízes). ax² + bx = 0 → x(ax + b) = 0 → x = 0 ou x = −b/a.", "INTERMEDIÁRIO: soma das raízes = −b/a; produto = c/a. Em x² − 7x + 12 = 0: números que somam 7 e multiplicam 12 → 3 e 4.", "Bhaskara: Δ = b² − 4ac; x = (−b ± √Δ)/2a. Δ > 0: duas raízes; Δ = 0: uma; Δ < 0: nenhuma real.", "AVANÇADO: em problemas de medida (área, idade), descarte a raiz negativa."], cai: "Soma e produto e problemas de área.", macete: "Tente soma e produto antes de Bhaskara." },
  "Sistemas lineares": { t: ["INÍCIO: x + y = S e x − y = D → some as equações: x = (S + D)/2.", "INTERMEDIÁRIO: carros e motos, galinhas e coelhos: suponha todos do tipo com menos rodas/pés e distribua a sobra.", "AVANÇADO: ingressos de dois preços: suponha todos do preço menor; diferença arrecadada ÷ diferença de preço = quantidade do mais caro.", "Métodos: substituição (isola uma letra) e adição (soma para cancelar uma letra)."], cai: "Problemas com duas quantidades e dois totais.", macete: "Duas incógnitas, duas equações." },
  Conjuntos: { t: ["INÍCIO: n(A ∪ B) = n(A) + n(B) − n(A ∩ B). A interseção foi contada duas vezes.", "INTERMEDIÁRIO: quando há 'nenhum dos dois', tire esses do total antes: pelo menos um = total − nenhum.", "AVANÇADO: 'apenas A' = n(A) − n(A ∩ B). Desenhe o diagrama de Venn e comece pela interseção."], cai: "Pesquisas com dois grupos e quem não está em nenhum.", macete: "No Venn, preencha de dentro para fora." },
  "Lógica proposicional": { t: ["INÍCIO: negação do 'e': nega as duas e troca por 'ou'. ~(p ∧ q) = ~p ∨ ~q. Negação do 'ou': nega as duas e troca por 'e'.", "INTERMEDIÁRIO: negação do 'se p, então q' é 'p e não q' (MAntém a primeira, NEga a segunda).", "Negação de 'Todo A é B' = 'Algum A não é B'. Negação de 'Nenhum A é B' = 'Algum A é B'.", "AVANÇADO: equivalências do 'se p, então q': 'se não q, então não p' (contrapositiva) e 'não p ou q' (NEOU).", "A condicional só é falsa quando a primeira é V e a segunda é F (Vera Fischer)."], cai: "Negação da condicional e equivalências. Muito cobrado pela FAFIPA em Raciocínio Lógico.", macete: "MA-NÉ para negar; NEOU e 'volta negando' para equivaler." },
  "Teorema de Pitágoras": { t: ["INÍCIO: no triângulo retângulo, hipotenusa² = cateto² + cateto². A hipotenusa é o maior lado, oposto ao ângulo reto.", "Triplos para decorar: 3-4-5, 5-12-13, 8-15-17, 7-24-25 e múltiplos (6-8-10, 9-12-15).", "INTERMEDIÁRIO: achar cateto: cateto² = hipotenusa² − outro cateto² (escada no muro).", "AVANÇADO: percursos: some tudo que foi para o Norte, tudo que foi para o Leste e aplique Pitágoras."], cai: "Escada, rampa, diagonal e deslocamentos.", macete: "Reconheça o triplo e economize a conta." },
  Trigonometria: { t: ["INÍCIO: SOH-CAH-TOA. seno = oposto/hipotenusa; cosseno = adjacente/hipotenusa; tangente = oposto/adjacente.", "INTERMEDIÁRIO: ângulos notáveis. sen 30° = 1/2, sen 45° = √2/2, sen 60° = √3/2. O cosseno é a ordem inversa.", "tg 30° = √3/3, tg 45° = 1, tg 60° = √3.", "AVANÇADO: altura de prédio, árvore ou morro com distância e ângulo: use a tangente (os dois catetos)."], cai: "Rampas e alturas com ângulos de 30°, 45° e 60°.", macete: "Tabela: 1, 2, 3 em cima; 2 embaixo; raiz em todos (menos o 1)." },
  "Ângulos e polígonos": { t: ["INÍCIO: soma dos ângulos internos = (n − 2)·180°. Triângulo 180°, quadrilátero 360°.", "Soma dos externos de qualquer polígono convexo = 360°.", "INTERMEDIÁRIO: polígono regular: externo = 360°/n; interno = 180° − externo.", "AVANÇADO: número de diagonais d = n(n − 3)/2."], cai: "Ângulo interno de polígono regular e diagonais.", macete: "Ache o externo primeiro: é só 360 ÷ n." },
  "Matrizes e determinantes": { t: ["INÍCIO: determinante 2×2 = diagonal principal − diagonal secundária.", "INTERMEDIÁRIO: 3×3 pela regra de Sarrus: repita as duas primeiras colunas, some as diagonais que descem e subtraia as que sobem.", "AVANÇADO: produto A·B: cada elemento é linha de A vezes coluna de B (multiplica par a par e soma). A·B só existe se colunas de A = linhas de B, e em geral A·B ≠ B·A.", "Propriedades: linha de zeros ou duas linhas iguais → det = 0; det(A·B) = det A · det B."], cai: "Determinante e elemento do produto.", macete: "Desce soma, sobe subtrai." },
  "Unidades de medida": { t: ["INÍCIO: km hm dam m dm cm mm: cada degrau ×10 (para a direita) ou ÷10 (para a esquerda). Massa e capacidade seguem a mesma escada.", "Área: cada degrau ×100. Volume: cada degrau ×1.000. 1 dm³ = 1 L; 1 m³ = 1.000 L.", "INTERMEDIÁRIO: tempo é base 60. 0,5 h = 30 min; 0,25 h = 15 min; 0,1 h = 6 min.", "AVANÇADO: velocidade: km/h ÷ 3,6 = m/s; m/s × 3,6 = km/h."], cai: "Conversões de tempo decimal e de volume em litros.", macete: "Hora decimal × 60 = minutos." },
  "Geometria analítica": { t: ["INÍCIO: ponto médio = (média dos x, média dos y).", "INTERMEDIÁRIO: distância entre pontos = √(Δx² + Δy²) (é Pitágoras).", "AVANÇADO: reta y = mx + n. m = Δy/Δx (inclinação); n é onde a reta corta o eixo y.", "Retas paralelas têm o mesmo m; perpendiculares: m₁·m₂ = −1."], cai: "Ponto médio, distância e equação da reta.", macete: "Distância entre pontos = Pitágoras." },
};
