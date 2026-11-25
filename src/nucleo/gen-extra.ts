// Geradores extras para NPOR e ENEM: progressões, funções, combinatória,
// logaritmos, juros compostos e geometria espacial.
import type { Gerador } from "./lib/tipos.ts";
import { fmt, brl, montar, vizinhos, mmc, mdc, fracao } from "./lib/gerar/util.ts";

const M = "Matemática";
const fat = (n: number): number => (n <= 1 ? 1 : n * fat(n - 1));
const comb = (n: number, p: number) => fat(n) / (fat(p) * fat(n - p));

export const geradoresExtra: Gerador[] = [
  {
    id: "pa-termo", materia: M, tema: "Progressões", nivel: "basico", altaChance: true,
    gerar(rng) {
      const a1 = rng.int(2, 30), r = rng.int(2, 9), n = rng.int(8, 30);
      const an = a1 + (n - 1) * r;
      const m = montar(rng, fmt(an), [
        { txt: fmt(a1 + n * r), erro: "Você usou n·r em vez de (n − 1)·r. O 1º termo já é a₁, então só somamos a razão n − 1 vezes." },
        { txt: fmt(n * r), erro: "Você esqueceu de somar o primeiro termo a₁." },
        { txt: fmt(a1 * n), erro: "Você multiplicou o 1º termo pela posição. PA cresce somando a razão, não multiplicando." },
        { txt: fmt(an - r), erro: "Você parou um termo antes: calculou o termo de posição n − 1." },
      ], vizinhos(an, r, fmt));
      return {
        enunciado: `Em uma progressão aritmética, o primeiro termo é ${a1} e a razão é ${r}. Qual é o ${n}º termo?`,
        ...m,
        explicacao: `aₙ = a₁ + (n − 1)·r = ${a1} + ${n - 1}·${r} = ${an}.`,
        passos: [
          "Fórmula do termo geral da PA: aₙ = a₁ + (n − 1)·r.",
          `Do 1º até o ${n}º termo somamos a razão ${n - 1} vezes: (${n} − 1)·${r} = ${(n - 1) * r}.`,
          `Somamos ao primeiro termo: ${a1} + ${(n - 1) * r} = ${an}.`,
        ],
        macete: "Quantos 'pulos' do 1º ao n-ésimo? Sempre n − 1.",
      };
    },
  },
  {
    id: "pa-soma", materia: M, tema: "Progressões", nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const a1 = rng.int(1, 12), r = rng.int(1, 6), n = rng.pick([10, 12, 15, 20, 25, 30]);
      const an = a1 + (n - 1) * r, s = ((a1 + an) * n) / 2;
      const m = montar(rng, fmt(s), [
        { txt: fmt((a1 + an) * n), erro: "Você esqueceu de dividir por 2. A soma é (a₁ + aₙ)·n / 2." },
        { txt: fmt(an), erro: "Esse é só o último termo, não a soma de todos." },
        { txt: fmt(((a1 + an) / 2)), erro: "Essa é a média dos termos. Faltou multiplicar pela quantidade n." },
        { txt: fmt(((a1 + an - r) * n) / 2), erro: "Você errou o último termo (usou aₙ − r). Recalcule aₙ = a₁ + (n − 1)·r." },
      ], vizinhos(s, n, fmt));
      return {
        enunciado: `Um recruta faz ${a1} flexões no 1º dia de treino e, a cada dia, faz ${r} a mais que no dia anterior. Quantas flexões ele terá feito, no total, ao fim de ${n} dias?`,
        ...m,
        explicacao: `PA com a₁ = ${a1}, r = ${r}, n = ${n}. a${n} = ${an}. Soma = (${a1} + ${an})·${n}/2 = ${s}.`,
        passos: [
          `Último termo: a${n} = ${a1} + (${n} − 1)·${r} = ${an}.`,
          `Soma da PA: Sₙ = (a₁ + aₙ)·n / 2.`,
          `(${a1} + ${an})·${n} / 2 = ${a1 + an}·${n} / 2 = ${s}.`,
        ],
        macete: "Soma de PA = média do primeiro com o último × quantidade de termos.",
      };
    },
  },
  {
    id: "pg-termo", materia: M, tema: "Progressões", nivel: "intermediario", altaChance: false,
    gerar(rng) {
      const a1 = rng.int(1, 5), q = rng.pick([2, 3]), n = rng.int(4, q === 2 ? 9 : 6);
      const an = a1 * q ** (n - 1);
      const m = montar(rng, fmt(an), [
        { txt: fmt(a1 * q ** n), erro: "Você usou qⁿ em vez de qⁿ⁻¹." },
        { txt: fmt(a1 + (n - 1) * q), erro: "Você tratou como PA (somando a razão). Na PG, multiplica." },
        { txt: fmt(a1 * q * (n - 1)), erro: "Você multiplicou q por (n − 1) em vez de elevar q a (n − 1)." },
        { txt: fmt(an / q), erro: "Você parou um termo antes." },
      ], vizinhos(an, a1, fmt));
      return {
        enunciado: `Em uma progressão geométrica, o 1º termo é ${a1} e a razão é ${q}. Qual é o ${n}º termo?`,
        ...m,
        explicacao: `aₙ = a₁·qⁿ⁻¹ = ${a1}·${q}^${n - 1} = ${an}.`,
        passos: [
          "Termo geral da PG: aₙ = a₁ · qⁿ⁻¹.",
          `${q}^${n - 1} = ${q ** (n - 1)}.`,
          `${a1} · ${q ** (n - 1)} = ${an}.`,
        ],
        macete: "PA soma a razão; PG multiplica pela razão.",
      };
    },
  },
  {
    id: "funcao-afim", materia: M, tema: "Funções e equações", nivel: "basico", altaChance: true,
    gerar(rng) {
      const fixo = rng.pick([5, 6, 8, 10, 12]), km = rng.pick([2, 2.5, 3, 3.5, 4]), x = rng.int(4, 25);
      const v = fixo + km * x;
      const m = montar(rng, brl(v), [
        { txt: brl(km * x), erro: "Você esqueceu a bandeirada (valor fixo)." },
        { txt: brl((fixo + km) * x), erro: "Você multiplicou a bandeirada pelos quilômetros. O valor fixo é cobrado uma vez só." },
        { txt: brl(fixo + km + x), erro: "Você somou tudo em vez de multiplicar o preço do km pela distância." },
        { txt: brl(fixo * km * x / 2), erro: "Essa conta não corresponde à função f(x) = fixo + preço·x." },
      ], vizinhos(v, km, brl));
      return {
        enunciado: `Uma corrida de táxi custa ${brl(fixo)} de bandeirada mais ${brl(km)} por quilômetro rodado. Quanto custa uma corrida de ${x} km?`,
        ...m,
        explicacao: `f(x) = ${fmt(fixo)} + ${fmt(km)}x → f(${x}) = ${fmt(fixo)} + ${fmt(km * x)} = ${fmt(v)}.`,
        passos: [
          `É uma função afim: f(x) = b + a·x, com b = ${brl(fixo)} (fixo) e a = ${brl(km)} (por km).`,
          `Parte variável: ${fmt(km)} × ${x} = ${fmt(km * x)}.`,
          `Total: ${fmt(fixo)} + ${fmt(km * x)} = ${brl(v)}.`,
        ],
        macete: "Valor fixo = coeficiente linear (b). Valor por unidade = coeficiente angular (a).",
      };
    },
  },
  {
    id: "equacao-2grau", materia: M, tema: "Funções e equações", nivel: "intermediario", altaChance: true,
    gerar(rng) {
      let r1 = 0, r2 = 0;
      do { r1 = rng.int(-9, 9); r2 = rng.int(-9, 9); } while (r1 === r2 || r1 === 0 || r2 === 0 || r1 === -r2);
      const b = -(r1 + r2), c = r1 * r2;
      const termo = (k: number, s: string) => (k === 0 ? "" : `${k > 0 ? " + " : " − "}${Math.abs(k) === 1 && s ? "" : Math.abs(k)}${s}`);
      const eq = `x²${termo(b, "x")}${termo(c, "")} = 0`;
      const par = (a: number, bb: number) => `${Math.min(a, bb)} e ${Math.max(a, bb)}`;
      const m = montar(rng, par(r1, r2), [
        { txt: par(-r1, -r2), erro: "Os sinais ficaram trocados. Soma das raízes = −b/a, não b/a." },
        { txt: par(r1, -r2), erro: "Confira o produto: as raízes precisam multiplicar dando c." },
        { txt: par(-r1, r2), erro: "Confira a soma: as raízes precisam somar −b." },
        { txt: par(r1 + 1, r2 - 1), erro: "Essas somam −b, mas o produto não dá c. Teste as duas condições." },
      ], (i) => par(r1 + i + 1, r2 - i - 1));
      return {
        enunciado: `As raízes da equação ${eq} são:`,
        ...m,
        explicacao: `Soma = −b/a = ${r1 + r2}; produto = c/a = ${c}. Os números são ${par(r1, r2)}.`,
        passos: [
          `Com a = 1: soma das raízes = −b = ${r1 + r2} e produto = c = ${c}.`,
          `Procure dois números que multiplicados dão ${c} e somados dão ${r1 + r2}.`,
          `${r1} × ${r2} = ${c} e ${r1} + ${r2} = ${r1 + r2}. Raízes: ${par(r1, r2)}.`,
          "Também dá por Bhaskara: Δ = b² − 4ac, x = (−b ± √Δ)/2a.",
        ],
        macete: "Com a = 1, soma e produto resolvem mais rápido que Bhaskara.",
      };
    },
  },
  {
    id: "anagramas", materia: M, tema: "Análise combinatória", nivel: "basico", altaChance: true,
    gerar(rng) {
      const palavra = rng.pick(["FORTE", "ARMAS", "BRAVO", "CAMPO", "TROPA", "SOLDA", "MURAL", "PISTA"].filter((p) => new Set(p).size === 5));
      const n = palavra.length, res = fat(n);
      const m = montar(rng, fmt(res), [
        { txt: fmt(n * n), erro: "Você fez n × n. Para permutar, multiplica n × (n−1) × ... × 1 (fatorial)." },
        { txt: fmt(fat(n - 1)), erro: "Você calculou (n − 1)!. Todas as 5 letras mudam de lugar: 5!." },
        { txt: fmt(n * 2), erro: "Não há conta com dobro aqui: é fatorial." },
        { txt: fmt(2 ** n), erro: "2ⁿ conta subconjuntos, não ordenações." },
      ], vizinhos(res, 10, fmt));
      return {
        enunciado: `Quantos anagramas tem a palavra ${palavra}?`,
        ...m,
        explicacao: `Letras todas diferentes: permutação simples, ${n}! = ${res}.`,
        passos: [
          `A palavra tem ${n} letras diferentes.`,
          `1ª posição: ${n} opções; 2ª: ${n - 1}; ... até 1.`,
          `${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(" × ")} = ${res}.`,
        ],
        macete: "Letras diferentes → n!. Com letras repetidas, divide pelo fatorial das repetições.",
      };
    },
  },
  {
    id: "combinacao", materia: M, tema: "Análise combinatória", nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const n = rng.int(6, 12), p = rng.pick([2, 3]);
      const res = comb(n, p), arr = fat(n) / fat(n - p);
      const m = montar(rng, fmt(res), [
        { txt: fmt(arr), erro: "Você calculou arranjo (a ordem importa). Numa comissão, a ordem não importa: divida por p!." },
        { txt: fmt(n * p), erro: "Multiplicar n por p não conta grupos. Use C(n,p) = n!/(p!(n−p)!)." },
        { txt: fmt(n ** p), erro: "nᵖ permite repetir a mesma pessoa. Aqui as pessoas são distintas." },
        { txt: fmt(comb(n, p + 1)), erro: `Você usou p = ${p + 1}. Releia quantas pessoas formam o grupo.` },
      ], vizinhos(res, 5, fmt));
      return {
        enunciado: `De um grupo de ${n} alunos, quantas equipes diferentes de ${p} alunos podem ser formadas para o serviço de guarda?`,
        ...m,
        explicacao: `Ordem não importa: C(${n},${p}) = ${res}.`,
        passos: [
          "Trocar a ordem dos mesmos alunos não forma outra equipe → combinação.",
          `C(${n},${p}) = ${n}! / (${p}! · ${n - p}!).`,
          `= ${Array.from({ length: p }, (_, i) => n - i).join(" × ")} / ${p}! = ${arr} / ${fat(p)} = ${res}.`,
        ],
        macete: "Pergunte: trocando a ordem muda alguma coisa? Não muda → combinação.",
      };
    },
  },
  {
    id: "logaritmo", materia: M, tema: "Logaritmos e exponencial", nivel: "intermediario", altaChance: false,
    gerar(rng) {
      const base = rng.pick([2, 3, 10]), e1 = rng.int(1, base === 10 ? 4 : 6), e2 = rng.int(1, base === 10 ? 3 : 5);
      const res = e1 + e2;
      const x = base ** e1, y = base ** e2;
      const m = montar(rng, fmt(res), [
        { txt: fmt(e1 * e2), erro: "log(a·b) = log a + log b, não log a × log b." },
        { txt: fmt(x * y), erro: "Esse é o produto x·y, não o logaritmo dele." },
        { txt: fmt(res - 1), erro: "Confira: logₐ(aᵏ) = k." },
        { txt: fmt(x + y), erro: "Você somou os números em vez de somar os logaritmos." },
      ], vizinhos(res, 1, fmt));
      return {
        enunciado: `Calcule log${base === 10 ? "" : "₍" + base + "₎"} ${fmt(x)} + log${base === 10 ? "" : "₍" + base + "₎"} ${fmt(y)}.`,
        ...m,
        explicacao: `${fmt(x)} = ${base}^${e1} e ${fmt(y)} = ${base}^${e2}. Soma: ${e1} + ${e2} = ${res}.`,
        passos: [
          "logₐ b = c significa aᶜ = b.",
          `${fmt(x)} = ${base}^${e1}, então o 1º log vale ${e1}.`,
          `${fmt(y)} = ${base}^${e2}, então o 2º log vale ${e2}.`,
          `Total: ${res}.`,
        ],
        macete: "Logaritmo responde: 'a base elevada a QUANTO dá esse número?'",
      };
    },
  },
  {
    id: "juros-compostos", materia: M, tema: "Juros compostos", nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const C = rng.pick([1000, 2000, 5000, 10000]), i = rng.pick([5, 10, 20]), t = 2;
      const mont = C * (1 + i / 100) ** t;
      const m = montar(rng, brl(mont), [
        { txt: brl(C * (1 + (i / 100) * t)), erro: "Esse é o montante em juros SIMPLES. Nos compostos, os juros rendem juros." },
        { txt: brl(mont - C), erro: "Esses são só os juros. A pergunta pede o montante (capital + juros)." },
        { txt: brl(C * (1 + i / 100)), erro: "Você aplicou só 1 mês. São 2 períodos." },
        { txt: brl(C * (1 + (2 * i) / 100) ** 2), erro: "Você dobrou a taxa e ainda elevou ao quadrado." },
      ], vizinhos(mont, C / 100, brl));
      return {
        enunciado: `Um capital de ${brl(C)} é aplicado a juros compostos de ${i}% ao mês. Qual o montante após ${t} meses?`,
        ...m,
        explicacao: `M = C·(1 + i)^t = ${fmt(C)}·${fmt(1 + i / 100, 2)}² = ${brl(mont)}.`,
        passos: [
          `Fator de cada mês: 1 + ${i}% = ${fmt(1 + i / 100, 2)}.`,
          `1º mês: ${fmt(C)} × ${fmt(1 + i / 100, 2)} = ${fmt(C * (1 + i / 100))}.`,
          `2º mês: ${fmt(C * (1 + i / 100))} × ${fmt(1 + i / 100, 2)} = ${fmt(mont)}.`,
        ],
        macete: "Juros compostos = multiplicar pelo fator várias vezes seguidas.",
      };
    },
  },
  {
    id: "volume", materia: M, tema: "Geometria espacial", nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const cil = rng.bool();
      if (cil) {
        const r = rng.int(1, 5), h = rng.int(2, 10), v = 3 * r * r * h;
        const m = montar(rng, `${fmt(v)} m³`, [
          { txt: `${fmt(3 * 2 * r * h)} m³`, erro: "Você usou o comprimento da circunferência (2πr) em vez da área da base (πr²)." },
          { txt: `${fmt(3 * r * h)} m³`, erro: "Faltou elevar o raio ao quadrado." },
          { txt: `${fmt(3 * r * r)} m³`, erro: "Essa é só a área da base. Multiplique pela altura." },
          { txt: `${fmt(3 * (2 * r) ** 2 * h)} m³`, erro: "Você usou o diâmetro no lugar do raio." },
        ], vizinhos(v, 3, (n) => `${fmt(n)} m³`));
        return {
          enunciado: `Um reservatório cilíndrico tem raio da base de ${r} m e altura de ${h} m. Usando π = 3, qual é o seu volume?`,
          ...m,
          explicacao: `V = π·r²·h = 3·${r * r}·${h} = ${v} m³.`,
          passos: ["Volume de prisma ou cilindro = área da base × altura.", `Área da base: π·r² = 3·${r}² = ${3 * r * r} m².`, `Volume: ${3 * r * r} × ${h} = ${v} m³.`],
          macete: "1 m³ = 1.000 litros.",
        };
      }
      const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 6), v = a * b * c;
      const m = montar(rng, `${fmt(v * 1000)} litros`, [
        { txt: `${fmt(v)} litros`, erro: "Você achou o volume em m³ mas esqueceu de converter: 1 m³ = 1.000 L." },
        { txt: `${fmt(v * 100)} litros`, erro: "1 m³ = 1.000 L, não 100 L." },
        { txt: `${fmt((a + b + c) * 1000)} litros`, erro: "Você somou as medidas. Volume é multiplicação." },
        { txt: `${fmt(2 * (a * b + a * c + b * c) * 1000)} litros`, erro: "Isso é a área total da superfície, não o volume." },
      ], vizinhos(v * 1000, 1000, (n) => `${fmt(n)} litros`));
      return {
        enunciado: `Uma caixa-d'água em forma de paralelepípedo mede ${a} m × ${b} m × ${c} m. Quantos litros ela comporta?`,
        ...m,
        explicacao: `V = ${a}·${b}·${c} = ${v} m³ = ${fmt(v * 1000)} L.`,
        passos: ["Volume do paralelepípedo = comprimento × largura × altura.", `${a} × ${b} × ${c} = ${v} m³.`, `1 m³ = 1.000 L → ${fmt(v * 1000)} L.`],
        macete: "1 m³ = 1.000 L; 1 dm³ = 1 L.",
      };
    },
  },
];


// ───────────────────────── Base: MMC, MDC e frações (do zero)
export const geradoresBase: Gerador[] = [
  {
    id: "mmc-calc", materia: M, tema: "MMC e MDC", nivel: "basico", altaChance: true,
    gerar(rng) {
      let a = 0, b = 0;
      do { a = rng.pick([4, 6, 8, 9, 10, 12, 14, 15, 18, 20]); b = rng.pick([4, 6, 8, 9, 10, 12, 14, 15, 18, 20]); } while (a === b || mmc(a, b) === a * b || mmc(a, b) === Math.max(a, b) || mmc(a, b) / Math.min(a, b) > 8);
      const L = mmc(a, b);
      const tab = (x: number) => Array.from({ length: L / x }, (_, k) => x * (k + 1)).join(", ");
      const m = montar(rng, fmt(L), [
        { txt: fmt(a * b), erro: `${a} × ${b} é um múltiplo comum, mas não o MENOR. Liste os múltiplos e pegue o primeiro que aparece nas duas listas.` },
        { txt: fmt(mdc(a, b)), erro: "Esse é o MDC (maior divisor comum). O MMC é sempre maior ou igual ao maior dos números." },
        { txt: fmt(a + b), erro: "Somar os números não dá o MMC. Procure o primeiro número que está na tabuada dos dois." },
        { txt: fmt(L * 2), erro: "Esse é um múltiplo comum, mas existe um menor. Volte uma posição na lista." },
      ], vizinhos(L, Math.min(a, b), fmt));
      return {
        enunciado: `Qual é o MMC (mínimo múltiplo comum) de ${a} e ${b}?`, ...m,
        explicacao: `MMC(${a}, ${b}) = ${L}: é o primeiro número que aparece na tabuada do ${a} e na do ${b}.`,
        passos: [
          `Tabuada do ${a}: ${tab(a)}…`,
          `Tabuada do ${b}: ${tab(b)}…`,
          `O primeiro número que está nas duas listas é ${L}. Esse é o MMC.`,
        ],
        macete: "MMC = primeiro encontro das tabuadas. Ele nunca é menor que o maior número.",
      };
    },
  },
  {
    id: "mdc-calc", materia: M, tema: "MMC e MDC", nivel: "intermediario", altaChance: true,
    gerar(rng) {
      let a = 0, b = 0;
      do { const g = rng.pick([4, 5, 6, 8, 10, 12, 15]); a = g * rng.int(2, 9); b = g * rng.int(2, 9); } while (a === b || mdc(a, b) < 4);
      const G = mdc(a, b);
      const m = montar(rng, fmt(G), [
        { txt: fmt(mmc(a, b)), erro: "Esse é o MMC. Para cortar em pedaços IGUAIS e do MAIOR tamanho, o certo é o MDC." },
        { txt: fmt(G / 2), erro: "Esse tamanho também divide os dois, mas existe um maior. O problema pede o maior possível." },
        { txt: fmt(a / G + b / G), erro: "Esse é o número de pedaços, não o tamanho de cada pedaço. Releia a pergunta." },
        { txt: fmt(Math.abs(a - b)), erro: "Subtrair os comprimentos não garante que os pedaços sejam iguais." },
      ], vizinhos(G, 1, fmt));
      return {
        enunciado: `Uma servidora tem duas fitas, uma de ${a} cm e outra de ${b} cm. Ela quer cortar as duas em pedaços de mesmo tamanho, o maior possível, sem sobrar nada. Qual será o tamanho de cada pedaço?`, ...m,
        explicacao: `Maior tamanho que divide ${a} e ${b} ao mesmo tempo = MDC(${a}, ${b}) = ${G} cm (${a / G + b / G} pedaços no total).`,
        passos: [
          `"Pedaços iguais, o maior possível, sem sobra" → MDC.`,
          `Divisores de ${a} que também dividem ${b}: procure o maior.`,
          `${a} ÷ ${G} = ${a / G} e ${b} ÷ ${G} = ${b / G}, sem resto. Nenhum número maior que ${G} divide os dois.`,
          `Cada pedaço mede ${G} cm.`,
        ],
        macete: "Repartir/cortar no maior tamanho → MDC. Encontro/coincidência → MMC.",
      };
    },
  },
  {
    id: "fracao-de", materia: M, tema: "Frações", nivel: "basico", altaChance: true,
    gerar(rng) {
      const d = rng.pick([3, 4, 5, 6, 8, 10]); let n = rng.int(1, d - 1); while (mdc(n, d) !== 1) n = rng.int(1, d - 1);
      const tot = d * rng.int(4, 30), r = (tot / d) * n;
      const m = montar(rng, fmt(r), [
        { txt: fmt(tot / d), erro: `Esse é só 1/${d} do total. Faltou multiplicar por ${n}.` },
        { txt: fmt(tot - r), erro: "Esse é o que SOBRA, não a parte pedida." },
        { txt: fmt(tot * n), erro: `Você multiplicou pelo numerador mas esqueceu de dividir por ${d}.` },
        { txt: fmt(Math.round(tot / n)), erro: "Você dividiu pelo numerador. A ordem é: divide pelo de baixo, multiplica pelo de cima." },
      ], vizinhos(r, tot / d, fmt));
      return {
        enunciado: `Um setor recebeu ${tot} processos e já analisou ${n}/${d} deles. Quantos processos foram analisados?`, ...m,
        explicacao: `${n}/${d} de ${tot} = ${tot} ÷ ${d} × ${n} = ${r}.`,
        passos: [
          `O número de baixo (${d}) diz em quantas partes iguais o total foi dividido: ${tot} ÷ ${d} = ${tot / d}.`,
          `O número de cima (${n}) diz quantas dessas partes pegamos: ${tot / d} × ${n} = ${r}.`,
        ],
        macete: "Fração de um número: divide pelo de baixo, multiplica pelo de cima.",
      };
    },
  },
  {
    id: "fracao-soma", materia: M, tema: "Frações", nivel: "intermediario", altaChance: true,
    gerar(rng) {
      let b = 0, d = 0;
      do { b = rng.pick([2, 3, 4, 5, 6, 8]); d = rng.pick([2, 3, 4, 5, 6, 8]); } while (b === d);
      let a = rng.int(1, b - 1), c = rng.int(1, d - 1);
      while (mdc(a, b) !== 1) a = rng.int(1, b - 1);
      while (mdc(c, d) !== 1) c = rng.int(1, d - 1);
      const L = mmc(b, d), num = a * (L / b) + c * (L / d);
      const certa = fracao(num, L);
      const m = montar(rng, certa, [
        { txt: fracao(a + c, b + d), erro: "Somou em cima com em cima e embaixo com embaixo. Na soma de frações, primeiro iguale os denominadores com o MMC." },
        { txt: fracao(a * c, b * d), erro: "Isso é multiplicação de frações, não soma." },
        { txt: fracao(a + c, L), erro: "Você igualou os denominadores mas esqueceu de ajustar os numeradores (divide pelo de baixo, multiplica pelo de cima)." },
        { txt: fracao(num, b * d), erro: `Você usou ${b}×${d} como denominador comum mas manteve o numerador do MMC. Use o mesmo denominador nas duas etapas.` },
      ], (i) => fracao(num + i, L));
      return {
        enunciado: `Calcule ${a}/${b} + ${c}/${d}.`, ...m,
        explicacao: `MMC(${b}, ${d}) = ${L}. ${a}/${b} = ${a * (L / b)}/${L} e ${c}/${d} = ${c * (L / d)}/${L}. Soma = ${num}/${L}${certa !== `${num}/${L}` ? ` = ${certa}` : ""}.`,
        passos: [
          `Denominadores diferentes (${b} e ${d}): não dá para somar direto. Ache o MMC: ${L}.`,
          `${a}/${b}: ${L} ÷ ${b} = ${L / b}, × ${a} = ${a * (L / b)} → ${a * (L / b)}/${L}.`,
          `${c}/${d}: ${L} ÷ ${d} = ${L / d}, × ${c} = ${c * (L / d)} → ${c * (L / d)}/${L}.`,
          `Agora soma só em cima: ${a * (L / b)} + ${c * (L / d)} = ${num}. Resultado ${num}/${L}${certa !== `${num}/${L}` ? `, que simplificado dá ${certa}` : ""}.`,
        ],
        macete: "Soma de frações: MMC embaixo, 'divide pelo de baixo e multiplica pelo de cima', soma em cima.",
      };
    },
  },
];

export const resumosMat: Record<string, { t: string[]; cai: string; macete: string }> = {
  "MMC e MDC": { t: ["Múltiplos de um número = a tabuada dele (6: 6, 12, 18, 24…). Divisores = números que dividem sem resto (12: 1, 2, 3, 4, 6, 12).", "MMC (mínimo múltiplo comum): o primeiro número que aparece na tabuada dos dois. MMC(4, 6) = 12.", "MDC (máximo divisor comum): o maior número que divide os dois sem resto. MDC(12, 18) = 6.", "Como saber qual usar: 'quando vão coincidir de novo' = MMC. 'Cortar ou repartir em partes iguais, o maior possível' = MDC.", "Atalho: MMC × MDC = produto dos dois números."], cai: "Ônibus, remédios ou luzes que coincidem (MMC) e cortes ou kits iguais (MDC).", macete: "MMC = Mais tarde se encontram. MDC = Divide em pedaços." },
  "Frações": { t: ["Fração = parte de um todo. O de baixo (denominador) diz em quantas partes dividiu; o de cima (numerador), quantas pegou.", "Fração de um número: divide pelo de baixo, multiplica pelo de cima. 3/4 de 80 = 80 ÷ 4 × 3 = 60.", "Simplificar: divide em cima e embaixo pelo mesmo número. 6/8 = 3/4.", "Somar ou subtrair: iguale os denominadores com o MMC e depois some só os de cima.", "Multiplicar: em cima × em cima, embaixo × embaixo. Dividir: mantém a primeira e multiplica pelo inverso da segunda."], cai: "Fração de uma quantidade e soma de frações com denominadores diferentes.", macete: "Nunca some os denominadores. Primeiro o MMC." },
  "Quatro operações": { t: ["Leia o enunciado e sublinhe a pergunta (CADA, TOTAL, RESTANTE).", "Divisão em partes iguais: total ÷ partes. Sobra = resto.", "Ordem: parênteses, depois × e ÷, depois + e −."], cai: "Problemas com 'cada' x 'total'.", macete: "Antes de calcular, escreva em palavras o que vai fazer." },
  "Arredondamento e estimativa": { t: ["Arredondar: olhe o algarismo à direita da casa pedida. 5 ou mais sobe; menos de 5 mantém.", "Estimativa: arredonde cada parcela e depois some ou multiplique para eliminar alternativas absurdas."], cai: "Arredondar para dezena, centena e milhar.", macete: "Pergunte: entre quais números redondos ele está?" },
  Porcentagem: { t: ["x% de N = x/100 · N. 10% = ÷10; 1% = ÷100; 50% = metade; 25% = um quarto.", "Aumento de p%: multiplica por (1 + p/100). Desconto de p%: multiplica por (1 − p/100).", "Aumentos e descontos sucessivos se MULTIPLICAM, não se somam: +10% e depois −10% dá −1%.", "Variação percentual = (novo − antigo) / antigo × 100."], cai: "Aumentos e descontos sucessivos.", macete: "Desconto de 20% = pagar 80% = × 0,8." },
  "Juros simples": { t: ["J = C · i · t (taxa e tempo na MESMA unidade).", "Montante M = C + J.", "Taxa mensal × 12 = anual (só em juros simples)."], cai: "Converter a unidade do tempo antes de calcular.", macete: "Simples: os juros de todo mês são iguais." },
  "Sistema monetário": { t: ["R$ 1,00 = 100 centavos.", "Troco = valor pago − total. Some os itens com atenção às casas decimais."], cai: "Troco e combinações de cédulas.", macete: "Alinhe as vírgulas ao somar." },
  "Razão e proporção": { t: ["Razão a:b = a/b. Proporção: a/b = c/d ⇔ a·d = b·c.", "Dividir em partes proporcionais: some as partes, ache o valor de 1 parte e multiplique."], cai: "Divisão proporcional.", macete: "Total ÷ soma das partes = valor de cada parte." },
  "Regra de três": { t: ["Direta: as grandezas aumentam juntas → multiplica cruzado.", "Inversa: uma aumenta e a outra diminui (mais operários, menos dias) → multiplica em linha.", "Composta: compare cada grandeza com a incógnita separadamente (direta ou inversa) e monte uma única fração."], cai: "Regra de três inversa e composta (operários, dias, horas).", macete: "Coloque setas: mesma direção = direta; contrária = inversa." },
  "Resolução de problemas": { t: ["Transforme o texto em equação: 'o dobro' = 2x, 'a terça parte' = x/3.", "Teste as alternativas quando a equação ficar difícil."], cai: "Problemas de idade e de partilha.", macete: "Testar alternativas é estratégia legítima na prova." },
  Estatística: { t: ["Média = soma ÷ quantidade.", "Moda = valor que mais aparece.", "Mediana = valor do meio com os dados em ORDEM (se forem pares, média dos dois centrais)."], cai: "Mediana com quantidade par e esquecer de ordenar.", macete: "Mediana: primeiro ORDENE." },
  "Tabelas e gráficos": { t: ["Leia título, eixos e unidades antes dos números.", "Variação = final − inicial; variação percentual = variação ÷ inicial."], cai: "Maior variação entre meses.", macete: "Escreva a unidade ao lado de cada número que tirar do gráfico." },
  "Áreas e superfícies": { t: ["Retângulo: b·h. Triângulo: b·h/2. Círculo: π·r².", "1 m² = 100 dm² = 10.000 cm². 1 km² = 1.000.000 m². 1 hectare = 10.000 m².", "Em área, cada 'degrau' de unidade multiplica por 100."], cai: "Conversão de unidades de área.", macete: "Área: pulou uma unidade, 2 zeros." },
  Circunferência: { t: ["Comprimento: C = 2·π·r = π·d.", "Área do círculo: π·r².", "Raio = metade do diâmetro."], cai: "Confundir raio com diâmetro.", macete: "Comprimento é 'linha' (2πr); área é 'tinta' (πr²)." },
  "Teorema de Tales": { t: ["Retas paralelas cortadas por transversais determinam segmentos proporcionais.", "a/b = c/x → x = b·c/a."], cai: "Achar o segmento que falta.", macete: "Monte a proporção na mesma ordem dos dois lados." },
  "Noções de direção": { t: ["Girar 90° à direita a partir do Norte → Leste; à esquerda → Oeste.", "Meia-volta = 180°. Norte ↔ Sul, Leste ↔ Oeste."], cai: "Sequência de giros.", macete: "Desenhe a rosa dos ventos no rascunho." },
  Probabilidade: { t: ["P = casos favoráveis ÷ casos possíveis.", "Evento certo: P = 1. Impossível: P = 0.", "Independentes (E): multiplica. Mutuamente exclusivos (OU): soma.", "União: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).", "Sem reposição: o total diminui a cada retirada."], cai: "Retiradas sem reposição e probabilidade da união.", macete: "E = multiplica; OU = soma (tirando o que contou duas vezes)." },
  Sequências: { t: ["Procure a diferença entre termos (soma constante?), a razão (multiplica?) ou padrões alternados.", "Em sequências de letras, troque cada letra pela posição no alfabeto.", "Padrão cíclico: divida a posição pelo tamanho do ciclo e use o resto."], cai: "Termo de posição grande em sequência cíclica.", macete: "Ciclo de k elementos: posição ÷ k, olhe o RESTO." },
  Progressões: { t: ["PA: soma a razão. aₙ = a₁ + (n − 1)r. Sₙ = (a₁ + aₙ)n/2.", "PG: multiplica pela razão. aₙ = a₁·qⁿ⁻¹."], cai: "Termo geral e soma da PA.", macete: "Do 1º ao n-ésimo há n − 1 pulos." },
  "Funções e equações": { t: ["Função afim: f(x) = ax + b (a = taxa por unidade, b = valor fixo). Gráfico: reta.", "Função quadrática: f(x) = ax² + bx + c. Raízes por Bhaskara ou soma e produto. Vértice: xᵥ = −b/2a.", "a > 0: parábola com concavidade para cima (tem mínimo)."], cai: "Montar f(x) a partir de um problema (táxi, conta de celular).", macete: "Valor fixo + valor por unidade = função afim." },
  "Análise combinatória": { t: ["Princípio multiplicativo: etapas independentes → multiplica as possibilidades.", "Permutação: n! (todos mudam de lugar).", "Arranjo: a ordem importa (pódio). Combinação: a ordem não importa (comissão). C(n,p) = n!/(p!(n−p)!)."], cai: "Diferenciar arranjo de combinação.", macete: "Trocar a ordem muda o resultado? Sim = arranjo; não = combinação." },
  "Logaritmos e exponencial": { t: ["logₐ b = c ⇔ aᶜ = b.", "log(x·y) = log x + log y; log(x/y) = log x − log y; log(xⁿ) = n·log x.", "log 10 = 1; log 1 = 0 em qualquer base."], cai: "Propriedades do produto e da potência.", macete: "Log transforma multiplicação em soma." },
  "Juros compostos": { t: ["M = C·(1 + i)ᵗ.", "Os juros de cada período são calculados sobre o montante anterior (juros sobre juros)."], cai: "Comparar simples x compostos.", macete: "Compostos: multiplique pelo fator a cada período." },
  "Geometria espacial": { t: ["Volume de prisma e cilindro = área da base × altura.", "Pirâmide e cone = (área da base × altura) / 3.", "Esfera: V = 4πr³/3.", "1 m³ = 1.000 L; 1 dm³ = 1 L."], cai: "Volume de caixa-d'água em litros.", macete: "Pontudo (pirâmide, cone) divide por 3." },
};
