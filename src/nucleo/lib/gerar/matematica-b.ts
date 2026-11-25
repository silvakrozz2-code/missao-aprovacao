// Geradores parametrizados: estatística, tabelas, geometria, medidas,
// Tales, direção, probabilidade e sequências.
import type { Gerador } from "../tipos.ts";
import { fmt, fracao, montar, pct, r, vizinhos } from "./util.ts";

const M = "Raciocínio Lógico";
const PI = 3.14;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const mediana = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const lista = (xs: (string | number)[]) => xs.join(", ").replace(/, (?=[^,]*$)/, " e ");
const DIAS = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro"];

export const geradoresB: Gerador[] = [
  // ───────────────────────── Estatística
  {
    id: "media-simples",
    materia: M,
    tema: "Estatística",
    nivel: "basico",
    altaChance: true,
    gerar(rng) {
      const n = rng.int(5, 7);
      let xs: number[] = [];
      do {
        xs = Array.from({ length: n }, () => rng.int(10, 45));
        const resto = sum(xs) % n;
        xs[n - 1] -= resto;
      } while (xs[n - 1] < 5);
      const media = sum(xs) / n;
      const med = mediana(xs);
      const m = montar(
        rng,
        fmt(media, 2),
        [
          { txt: fmt(med, 2), erro: "Esse valor é a MEDIANA (o do meio, depois de ordenar), não a média." },
          { txt: fmt(sum(xs), 2), erro: "Você somou tudo, mas esqueceu de dividir pela quantidade de dias." },
          { txt: fmt(sum(xs) / (n - 1), 2), erro: `Você dividiu por ${n - 1}. São ${n} dias, então divida por ${n}.` },
          { txt: fmt((Math.max(...xs) + Math.min(...xs)) / 2, 2), erro: "Você fez a média só entre o maior e o menor valor. A média usa TODOS os valores." },
        ],
        vizinhos(media, 1, (v) => fmt(v, 2)),
      );
      return {
        enunciado: `Em ${n} dias, um balcão de atendimento registrou: ${lista(xs)} atendimentos. Qual foi a média de atendimentos por dia?`,
        ...m,
        explicacao: `Média = soma ÷ quantidade = ${sum(xs)} ÷ ${n} = ${fmt(media, 2)}.`,
        passos: [
          `Média aritmética: some todos os valores e divida pela quantidade.`,
          `Soma: ${xs.join(" + ")} = ${sum(xs)}.`,
          `Quantidade de dias: ${n}.`,
          `${sum(xs)} ÷ ${n} = ${fmt(media, 2)}.`,
        ],
        macete: "A média sempre fica entre o menor e o maior valor. Alternativa fora desse intervalo pode ser eliminada na hora.",
      };
    },
  },
  {
    id: "mediana",
    materia: M,
    tema: "Estatística",
    nivel: "intermediario",
    altaChance: true,
    gerar(rng) {
      const n = rng.int(6, 9);
      let xs: number[] = [];
      let med = 0;
      let errada = 0;
      do {
        xs = Array.from({ length: n }, () => rng.int(2, 40));
        med = mediana(xs);
        errada = n % 2 ? xs[(n - 1) / 2] : (xs[n / 2 - 1] + xs[n / 2]) / 2;
      } while (errada === med);
      const s = [...xs].sort((a, b) => a - b);
      const media = sum(xs) / n;
      const m = montar(
        rng,
        fmt(med, 1),
        [
          { txt: fmt(errada, 1), erro: "Você pegou o termo do meio SEM ordenar os dados. Sempre ordene primeiro!" },
          { txt: fmt(media, 1), erro: "Esse valor é a MÉDIA, não a mediana." },
          ...(n % 2 === 0
            ? [
                { txt: fmt(s[n / 2 - 1], 1), erro: "Com quantidade par, a mediana é a média dos DOIS valores centrais, não só um deles." },
                { txt: fmt(s[n / 2], 1), erro: "Com quantidade par, a mediana é a média dos DOIS valores centrais, não só um deles." },
              ]
            : [
                { txt: fmt(s[(n - 1) / 2 - 1], 1), erro: "Você errou a posição central. Com n ímpar, ela é (n + 1) ÷ 2." },
                { txt: fmt(s[(n + 1) / 2], 1), erro: "Você errou a posição central. Com n ímpar, ela é (n + 1) ÷ 2." },
              ]),
        ],
        vizinhos(med, 1, (v) => fmt(v, 1)),
      );
      return {
        enunciado: `As idades (em anos) dos ${n} estagiários de um setor são: ${lista(xs)}. Qual é a mediana dessas idades?`,
        ...m,
        explicacao: `Ordenando: ${s.join(", ")}. ${n % 2 ? `O termo central (posição ${(n + 1) / 2}) é ${med}.` : `Os centrais são ${s[n / 2 - 1]} e ${s[n / 2]}; mediana = ${fmt(med, 1)}.`}`,
        passos: [
          "Mediana é o valor do MEIO depois de colocar os dados em ordem.",
          `Em ordem crescente: ${s.join(", ")}.`,
          n % 2
            ? `São ${n} valores (ímpar): o do meio está na posição (${n} + 1) ÷ 2 = ${(n + 1) / 2}, que é ${med}.`
            : `São ${n} valores (par): os do meio são o ${n / 2}º e o ${n / 2 + 1}º, ou seja, ${s[n / 2 - 1]} e ${s[n / 2]}.`,
          ...(n % 2 ? [] : [`Mediana = (${s[n / 2 - 1]} + ${s[n / 2]}) ÷ 2 = ${fmt(med, 1)}.`]),
        ],
        macete: "Pegadinha preferida: dados fora de ordem. Ordenar é o passo 1, sempre.",
      };
    },
  },
  {
    id: "moda",
    materia: M,
    tema: "Estatística",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      const base = rng.shuffle([18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
      const moda = base[0];
      const dupla = base[1];
      const unicos = base.slice(2, 2 + rng.int(3, 5));
      const xs = rng.shuffle([moda, moda, moda, dupla, dupla, ...unicos]);
      const media = sum(xs) / xs.length;
      const med = mediana(xs);
      const m = montar(
        rng,
        `${moda}`,
        [
          { txt: `${dupla}`, erro: `${dupla} aparece 2 vezes, mas ${moda} aparece 3. A moda é o que MAIS se repete.` },
          { txt: fmt(med, 1), erro: "Esse valor é a MEDIANA." },
          { txt: fmt(media, 1), erro: "Esse valor é a MÉDIA." },
          { txt: `${Math.max(...xs)}`, erro: "Moda não é o maior valor; é o valor mais frequente." },
        ],
        vizinhos(moda, 1, (v) => `${v}`),
      );
      return {
        enunciado: `As temperaturas máximas (°C) registradas em Curitiba durante ${xs.length} dias foram: ${lista(xs)}. A moda desse conjunto é:`,
        ...m,
        explicacao: `${moda} aparece 3 vezes, mais do que qualquer outro valor.`,
        passos: [
          "Moda = valor que aparece MAIS vezes.",
          `Contando: ${moda} aparece 3 vezes; ${dupla} aparece 2 vezes; os demais aparecem 1 vez.`,
          `Moda = ${moda}.`,
        ],
        macete: "MOda = o que está na MOda = o mais repetido.",
      };
    },
  },
  {
    id: "media-ponderada",
    materia: M,
    tema: "Estatística",
    nivel: "avancado",
    altaChance: false,
    gerar(rng) {
      const notas = [rng.int(40, 100) / 10, rng.int(40, 100) / 10, rng.int(40, 100) / 10];
      const pesos = rng.pick([[1, 2, 3], [2, 3, 5], [1, 1, 2], [3, 3, 4], [2, 2, 1]]);
      const sp = sum(pesos);
      const pond = sum(notas.map((x, i) => x * pesos[i])) / sp;
      const simples = sum(notas) / 3;
      const m = montar(
        rng,
        fmt(pond, 2),
        [
          { txt: fmt(simples, 2), erro: "Você fez a média SIMPLES. Com pesos, cada nota é multiplicada pelo seu peso." },
          { txt: fmt(sum(notas.map((x, i) => x * pesos[i])) / 3, 2), erro: `Você dividiu por 3 (número de notas). Na ponderada, divide pela SOMA DOS PESOS (${sp}).` },
          { txt: fmt(sum(notas.map((x, i) => x * pesos[i])), 2), erro: "Você esqueceu de dividir pela soma dos pesos." },
          { txt: fmt(pond + 0.5, 2), erro: "Erro de conta. Refaça as multiplicações nota × peso." },
        ],
        vizinhos(pond, 0.3, (v) => fmt(v, 2)),
      );
      return {
        enunciado: `Em um processo seletivo interno, um candidato tirou ${fmt(notas[0], 1)} na prova escrita (peso ${pesos[0]}), ${fmt(notas[1], 1)} na entrevista (peso ${pesos[1]}) e ${fmt(notas[2], 1)} na análise de títulos (peso ${pesos[2]}). Qual a sua média ponderada?`,
        ...m,
        explicacao: `(${notas.map((x, i) => `${fmt(x, 1)}×${pesos[i]}`).join(" + ")}) ÷ ${sp} = ${fmt(pond, 2)}.`,
        passos: [
          "Média ponderada: multiplique cada nota pelo peso, some tudo e divida pela soma dos pesos.",
          ...notas.map((x, i) => `${fmt(x, 1)} × ${pesos[i]} = ${fmt(x * pesos[i], 1)}`),
          `Soma: ${fmt(sum(notas.map((x, i) => x * pesos[i])), 1)}. Soma dos pesos: ${sp}.`,
          `${fmt(sum(notas.map((x, i) => x * pesos[i])), 1)} ÷ ${sp} = ${fmt(pond, 2)}.`,
        ],
        macete: "A média ponderada fica mais perto da nota de MAIOR peso. Use isso para eliminar alternativas.",
      };
    },
  },

  // ───────────────────────── Tabelas e gráficos
  {
    id: "tabela-variacao",
    materia: M,
    tema: "Tabelas e gráficos",
    nivel: "intermediario",
    altaChance: true,
    gerar(rng) {
      const ini = rng.int(0, MESES.length - 5);
      const meses = MESES.slice(ini, ini + 4);
      const k = rng.int(0, 2); // compara meses k e k+1
      const p = rng.pick([10, 20, 25, 30, 40, 50, -10, -20, -25, -40]);
      const valores = meses.map(() => rng.int(8, 40) * 20);
      valores[k] = rng.int(4, 24) * 100;
      valores[k + 1] = valores[k] * (1 + p / 100);
      const A = valores[k];
      const B = valores[k + 1];
      const sobe = p > 0;
      const m = montar(
        rng,
        `${sobe ? "Aumento" : "Redução"} de ${Math.abs(p)}%`,
        [
          { txt: `${sobe ? "Aumento" : "Redução"} de ${fmt(Math.abs((B - A) / B) * 100, 1)}%`, erro: `Você dividiu pela quantidade de ${meses[k + 1]}. A base é o mês ANTERIOR (${meses[k]}).` },
          { txt: `${sobe ? "Redução" : "Aumento"} de ${Math.abs(p)}%`, erro: "Você inverteu o sentido da variação. Compare: o valor subiu ou caiu?" },
          { txt: `${sobe ? "Aumento" : "Redução"} de ${fmt(Math.abs(B - A))}%`, erro: "Você usou a diferença absoluta como porcentagem." },
          { txt: `${sobe ? "Aumento" : "Redução"} de ${fmt(Math.abs(p) / 2)}%`, erro: "Conta incompleta. Diferença ÷ valor inicial × 100." },
        ],
      );
      return {
        enunciado: `A tabela mostra o número de protocolos abertos em uma regional da prefeitura. De ${meses[k]} para ${meses[k + 1]}, houve:`,
        tabela: { cabecalho: ["Mês", "Protocolos"], linhas: meses.map((mes, i) => [mes, fmt(valores[i])]) },
        ...m,
        explicacao: `(${fmt(B)} − ${fmt(A)}) ÷ ${fmt(A)} = ${fmt(p / 100)} → ${sobe ? "aumento" : "redução"} de ${Math.abs(p)}%.`,
        passos: [
          `Leia só as linhas pedidas: ${meses[k]} = ${fmt(A)}; ${meses[k + 1]} = ${fmt(B)}.`,
          `Diferença: ${fmt(B)} − ${fmt(A)} = ${fmt(B - A)} (${sobe ? "subiu" : "caiu"}).`,
          `Divida pela base (mês anterior): ${fmt(Math.abs(B - A))} ÷ ${fmt(A)} = ${fmt(Math.abs(p) / 100)}.`,
          `${fmt(Math.abs(p) / 100)} = ${Math.abs(p)}% de ${sobe ? "aumento" : "redução"}.`,
        ],
        macete: "Em tabela, risque mentalmente as linhas que a pergunta NÃO usa. A banca coloca dados extras para distrair.",
      };
    },
  },
  {
    id: "tabela-total",
    materia: M,
    tema: "Tabelas e gráficos",
    nivel: "basico",
    altaChance: true,
    gerar(rng) {
      const dias = DIAS.slice(0, 5);
      const presencial = dias.map(() => rng.int(20, 90));
      const online = dias.map(() => rng.int(10, 70));
      const idx = rng.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort();
      const pedeOnline = rng.bool();
      const col = pedeOnline ? online : presencial;
      const outra = pedeOnline ? presencial : online;
      const res = col[idx[0]] + col[idx[1]];
      const m = montar(
        rng,
        fmt(res),
        [
          { txt: fmt(outra[idx[0]] + outra[idx[1]]), erro: `Você somou a coluna errada (${pedeOnline ? "presencial" : "on-line"}).` },
          { txt: fmt(res + outra[idx[0]] + outra[idx[1]]), erro: "Você somou as duas colunas. A pergunta pede só um tipo de atendimento." },
          { txt: fmt(sum(col)), erro: "Você somou a semana inteira. A pergunta pede só dois dias." },
          { txt: fmt(Math.abs(col[idx[0]] - col[idx[1]])), erro: "Você subtraiu em vez de somar." },
        ],
        vizinhos(res, 1, fmt),
      );
      return {
        enunciado: `Pela tabela de atendimentos de uma unidade, quantos atendimentos ${pedeOnline ? "ON-LINE" : "PRESENCIAIS"} foram feitos na ${dias[idx[0]]} e na ${dias[idx[1]]}, juntas?`,
        tabela: {
          cabecalho: ["Dia", "Presencial", "On-line"],
          linhas: dias.map((d, i) => [d, String(presencial[i]), String(online[i])]),
        },
        ...m,
        explicacao: `${col[idx[0]]} + ${col[idx[1]]} = ${res}.`,
        passos: [
          `Coluna certa: ${pedeOnline ? "On-line" : "Presencial"}.`,
          `${dias[idx[0]]}: ${col[idx[0]]}; ${dias[idx[1]]}: ${col[idx[1]]}.`,
          `Soma: ${col[idx[0]]} + ${col[idx[1]]} = ${res}.`,
        ],
        macete: "Antes de calcular, sublinhe na pergunta: QUAL coluna e QUAIS linhas.",
      };
    },
  },

  // ───────────────────────── Geometria: áreas
  {
    id: "area-retangulo",
    materia: M,
    tema: "Áreas e superfícies",
    nivel: "basico",
    altaChance: true,
    gerar(rng) {
      const a = rng.int(3, 15);
      let b = rng.int(3, 15);
      if (b === a) b++;
      const preco = rng.pick([25, 30, 40, 45, 50, 60, 80]);
      const comPreco = rng.bool();
      const area = a * b;
      const res = comPreco ? area * preco : area;
      const f = (v: number) => (comPreco ? `R$ ${fmt(v)},00` : `${fmt(v)} m²`);
      const perim = 2 * (a + b);
      const m = montar(
        rng,
        f(res),
        [
          { txt: f(comPreco ? perim * preco : perim), erro: "Você usou o PERÍMETRO (contorno). Piso cobre a SUPERFÍCIE: área = base × altura." },
          { txt: f(comPreco ? (a + b) * preco : a + b), erro: "Você somou os lados. Área é multiplicação." },
          { txt: f(comPreco ? (area * preco) / 2 : area / 2), erro: "Você dividiu por 2 — isso é a área do TRIÂNGULO, não do retângulo." },
          { txt: f(comPreco ? area * 2 * preco : area * 2), erro: "Você dobrou a área sem motivo." },
        ],
        vizinhos(res, comPreco ? preco : 1, f),
      );
      return {
        enunciado: comPreco
          ? `Uma sala retangular mede ${a} m por ${b} m. O piso custa R$ ${preco},00 o metro quadrado. Quanto custará o piso para a sala inteira?`
          : `Uma sala retangular mede ${a} m por ${b} m. Qual é a área dessa sala?`,
        ...m,
        explicacao: `Área = ${a} × ${b} = ${area} m²${comPreco ? `; custo = ${area} × R$ ${preco},00 = ${f(res)}` : ""}.`,
        passos: [
          "Área do retângulo = comprimento × largura.",
          `${a} × ${b} = ${area} m².`,
          ...(comPreco ? [`Cada m² custa R$ ${preco},00 → ${area} × ${preco} = ${fmt(res)} reais.`] : []),
        ],
        macete: "Perímetro = contorno (rodapé, cerca, moldura). Área = superfície (piso, pintura, grama).",
      };
    },
  },
  {
    id: "area-triangulo",
    materia: M,
    tema: "Áreas e superfícies",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      let b = 0, h = 0;
      do {
        b = rng.int(3, 20);
        h = rng.int(3, 20);
      } while ((b * h) % 2 !== 0 || b === h);
      const area = (b * h) / 2;
      const f = (v: number) => `${fmt(v, 1)} m²`;
      const m = montar(
        rng,
        f(area),
        [
          { txt: f(b * h), erro: "Você esqueceu de dividir por 2. O triângulo é metade do retângulo de mesma base e altura." },
          { txt: f((b + h) / 2), erro: "Você somou base e altura. Área é multiplicação." },
          { txt: f(b + h), erro: "Você somou base e altura. Área é base × altura ÷ 2." },
          { txt: f((b * h) / 4), erro: "Você dividiu por 4. A fórmula é base × altura ÷ 2." },
        ],
        vizinhos(area, 2, f),
      );
      return {
        enunciado: `Um canteiro triangular tem base de ${b} m e altura de ${h} m. Qual é a sua área?`,
        figura: { tipo: "triangulo", base: `${b} m`, altura: `${h} m` },
        ...m,
        explicacao: `Área = base × altura ÷ 2 = ${b} × ${h} ÷ 2 = ${fmt(area, 1)} m².`,
        passos: [
          "Área do triângulo = (base × altura) ÷ 2.",
          `${b} × ${h} = ${b * h}.`,
          `${b * h} ÷ 2 = ${fmt(area, 1)} m².`,
        ],
        macete: "Todo triângulo é a metade de um retângulo. Por isso o ÷ 2.",
      };
    },
  },
  {
    id: "area-circulo",
    materia: M,
    tema: "Áreas e superfícies",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const raio = rng.int(2, 12);
      const daDiametro = rng.bool();
      const area = PI * raio * raio;
      const f = (v: number) => `${fmt(v, 2)} m²`;
      const m = montar(
        rng,
        f(area),
        [
          { txt: f(2 * PI * raio), erro: "Você calculou o COMPRIMENTO da circunferência (2πr). A área é πr²." },
          {
            txt: f(PI * (2 * raio) ** 2),
            erro: daDiametro
              ? `Você usou o diâmetro (${2 * raio}) como se fosse o raio. Raio = metade do diâmetro.`
              : "Você usou o dobro do raio (diâmetro) na fórmula.",
          },
          { txt: f(PI * raio), erro: "Você esqueceu de elevar o raio ao quadrado." },
          { txt: f(PI * raio * 2), erro: "Você multiplicou o raio por 2 em vez de elevar ao quadrado." },
        ],
        vizinhos(area, 3.14, f),
      );
      return {
        enunciado: `Uma praça circular tem ${daDiametro ? `diâmetro de ${2 * raio} m` : `raio de ${raio} m`}. Considerando π = 3,14, qual é a área da praça?`,
        figura: { tipo: "circulo", rotulo: daDiametro ? `d = ${2 * raio} m` : `r = ${raio} m` },
        ...m,
        explicacao: `A = π × r² = 3,14 × ${raio}² = 3,14 × ${raio * raio} = ${fmt(area, 2)} m².`,
        passos: [
          ...(daDiametro ? [`O raio é metade do diâmetro: ${2 * raio} ÷ 2 = ${raio} m.`] : []),
          "Área do círculo: A = π × r².",
          `r² = ${raio} × ${raio} = ${raio * raio}.`,
          `A = 3,14 × ${raio * raio} = ${fmt(area, 2)} m².`,
        ],
        macete: "Área tem 'quadrado' na unidade (m²) e na fórmula (r²). Comprimento não tem.",
      };
    },
  },
  {
    id: "circunferencia",
    materia: M,
    tema: "Circunferência",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      const raio = rng.int(2, 20);
      const daDiametro = rng.bool();
      const C = 2 * PI * raio;
      const f = (v: number) => `${fmt(v, 2)} m`;
      const m = montar(
        rng,
        f(C),
        [
          { txt: f(PI * raio), erro: "Você esqueceu o 2 da fórmula (C = 2πr). Isso é meia volta." },
          { txt: f(PI * raio * raio), erro: "Você calculou a ÁREA (πr²). Para contornar, use C = 2πr." },
          { txt: f(2 * PI * 2 * raio), erro: daDiametro ? "Você usou o diâmetro no lugar do raio na fórmula 2πr. Com diâmetro, use C = π × d." : "Você dobrou o raio duas vezes." },
          { txt: f(2 * raio + PI), erro: "Você somou em vez de multiplicar." },
        ],
        vizinhos(C, 3.14, f),
      );
      return {
        enunciado: `Quantos metros de tela são necessários para dar UMA volta completa em um canteiro circular de ${daDiametro ? `${2 * raio} m de diâmetro` : `${raio} m de raio`}? (Use π = 3,14.)`,
        figura: { tipo: "circulo", rotulo: daDiametro ? `d = ${2 * raio} m` : `r = ${raio} m` },
        ...m,
        explicacao: `C = 2 × π × r = 2 × 3,14 × ${raio} = ${fmt(C, 2)} m${daDiametro ? ` (ou π × d = 3,14 × ${2 * raio})` : ""}.`,
        passos: [
          "Dar a volta = comprimento da circunferência: C = 2 × π × r (ou π × d).",
          ...(daDiametro ? [`Diâmetro ${2 * raio} m → raio ${raio} m.`] : []),
          `C = 2 × 3,14 × ${raio} = 6,28 × ${raio} = ${fmt(C, 2)} m.`,
        ],
        macete: "2 × 3,14 = 6,28. Decore: C = 6,28 × r. Economiza uma conta na prova.",
      };
    },
  },
  {
    id: "superficie-conversao",
    materia: M,
    tema: "Áreas e superfícies",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const un = ["km²", "hm²", "dam²", "m²", "dm²", "cm²", "mm²"];
      let i = 0, j = 0;
      do {
        i = rng.int(0, 6);
        j = rng.int(0, 6);
      } while (i === j || Math.abs(i - j) > 2);
      const v = rng.int(2, 95) / (rng.bool(0.3) ? 10 : 1);
      const k = j - i; // positivo = indo para unidade menor (multiplica)
      const res = v * 100 ** k;
      const f = (n: number) => `${fmt(n, 8)} ${un[j]}`;
      const m = montar(
        rng,
        f(res),
        [
          { txt: f(v * 10 ** k), erro: "Você andou 1 casa por degrau. Em ÁREA, cada degrau vale 100 (2 casas)." },
          { txt: f(v * 1000 ** k), erro: "Você usou 1.000 por degrau — isso é para VOLUME (m³)." },
          { txt: f(v * 100 ** -k), erro: "Você foi no sentido contrário: para unidade menor, multiplica; para maior, divide." },
          { txt: f(v * 100 ** (k > 0 ? k + 1 : k - 1)), erro: "Você contou um degrau a mais na escada de unidades." },
        ],
      );
      return {
        enunciado: `Convertendo ${fmt(v, 2)} ${un[i]} para ${un[j]}, obtemos:`,
        ...m,
        explicacao: `De ${un[i]} para ${un[j]} são ${Math.abs(k)} degrau(s); cada degrau de área vale ×100 ou ÷100. Resultado: ${f(res)}.`,
        passos: [
          `Escada: ${un.join(" → ")}.`,
          `De ${un[i]} para ${un[j]}: ${Math.abs(k)} degrau(s) ${k > 0 ? "para baixo (unidade menor → multiplica)" : "para cima (unidade maior → divide)"}.`,
          `Em área, cada degrau é 100: ${k > 0 ? "×" : "÷"} ${fmt(100 ** Math.abs(k))}.`,
          `${fmt(v, 2)} ${k > 0 ? "×" : "÷"} ${fmt(100 ** Math.abs(k))} = ${f(res)}.`,
        ],
        macete: "Comprimento: 1 casa por degrau. Área (²): 2 casas. Volume (³): 3 casas.",
      };
    },
  },
  {
    id: "tales",
    materia: M,
    tema: "Teorema de Tales",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      let a = 0, b = 0;
      do {
        a = rng.int(2, 10);
        b = rng.int(2, 12);
      } while (a === b);
      const mult = rng.pick([1.5, 2, 2.5, 3]);
      const c = a * mult;
      const x = b * mult;
      const f = (v: number) => `${fmt(v, 2)} cm`;
      const m = montar(
        rng,
        f(x),
        [
          { txt: f((a * c) / b), erro: "Você inverteu a proporção. Segmentos CORRESPONDENTES ficam na mesma posição da fração." },
          { txt: f(b + (c - a)), erro: "Você somou a diferença. Tales é proporção (multiplica e divide), não soma." },
          { txt: f(b * c), erro: `Você multiplicou cruzado e esqueceu de dividir por ${a}.` },
          { txt: f(c), erro: "Você copiou o outro segmento. Os segmentos não são iguais, são proporcionais." },
        ],
        vizinhos(x, 0.5, f),
      );
      return {
        enunciado: `Três retas paralelas são cortadas por duas transversais. Na primeira transversal, os segmentos determinados medem ${a} cm e ${b} cm. Na segunda, o segmento correspondente ao de ${a} cm mede ${fmt(c, 2)} cm. Quanto mede o segmento x, correspondente ao de ${b} cm?`,
        figura: { tipo: "tales", a: `${a}`, b: `${b}`, c: fmt(c, 2) },
        ...m,
        explicacao: `Tales: ${a}/${b} = ${fmt(c, 2)}/x → x = ${b} × ${fmt(c, 2)} ÷ ${a} = ${fmt(x, 2)} cm.`,
        passos: [
          "Teorema de Tales: retas paralelas cortadas por transversais formam segmentos PROPORCIONAIS.",
          `Monte: ${a} está para ${b} assim como ${fmt(c, 2)} está para x → ${a}/${b} = ${fmt(c, 2)}/x.`,
          `Multiplique cruzado: ${a} · x = ${b} · ${fmt(c, 2)} = ${fmt(b * c, 2)}.`,
          `x = ${fmt(b * c, 2)} ÷ ${a} = ${fmt(x, 2)} cm.`,
        ],
        macete: `Atalho: a segunda transversal é a primeira "ampliada" ${fmt(mult, 1)} vezes (${a} → ${fmt(c, 2)}). Então x = ${b} × ${fmt(mult, 1)}.`,
      };
    },
  },

  // ───────────────────────── Direção
  {
    id: "direcao-giros",
    materia: M,
    tema: "Noções de direção",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      const nomes = ["Norte", "Leste", "Sul", "Oeste"];
      const ini = rng.int(0, 3);
      const n = rng.int(2, 3);
      const giros = Array.from({ length: n }, () => rng.pick([1, -1, 2] as const));
      const txt = (g: number) => (g === 1 ? "vira à direita" : g === -1 ? "vira à esquerda" : "dá meia-volta");
      const fim = (((ini + sum(giros)) % 4) + 4) % 4;
      const espelho = (((ini - sum(giros)) % 4) + 4) % 4;
      const alternativas = rng.shuffle([0, 1, 2, 3, 4]);
      const rot = (i: number) => (i === 4 ? "Nordeste" : nomes[i]);
      const erros = alternativas.map((i) =>
        i === fim
          ? null
          : i === espelho
            ? "Você trocou direita com esquerda. Imagine-se olhando para o norte: a direita é o LESTE."
            : i === 4
              ? "Giros de 90° e 180° partindo de um ponto cardeal nunca levam a um colateral (como nordeste)."
              : i === ini
                ? "Essa é a direção inicial. Os giros não se anulam aqui; refaça um a um."
                : "Refaça girando um passo de cada vez: direita = sentido horário (N → L → S → O).",
      );
      return {
        enunciado: `Uma pessoa está de frente para o ${nomes[ini]}. Ela ${giros.map(txt).join(", depois ")}. Para que direção ela está olhando agora?`,
        alternativas: alternativas.map(rot),
        correta: alternativas.indexOf(fim),
        erros,
        explicacao: `Girando passo a passo a partir do ${nomes[ini]}, termina olhando para o ${nomes[fim]}.`,
        passos: [
          "Direita = sentido horário: Norte → Leste → Sul → Oeste → Norte. Esquerda = o contrário. Meia-volta = 2 passos.",
          `Começa: ${nomes[ini]}.`,
          ...giros.map((g, k) => {
            const pos = (((ini + sum(giros.slice(0, k + 1))) % 4) + 4) % 4;
            return `${txt(g)[0].toUpperCase()}${txt(g).slice(1)} → ${nomes[pos]}.`;
          }),
        ],
        macete: "Desenhe uma rosa dos ventos no rascunho e gire o lápis junto. Leva 5 segundos e não tem erro.",
      };
    },
  },
  {
    id: "direcao-deslocamento",
    materia: M,
    tema: "Noções de direção",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const dirs = [
        { nome: "norte", dx: 0, dy: 1 },
        { nome: "leste", dx: 1, dy: 0 },
        { nome: "sul", dx: 0, dy: -1 },
        { nome: "oeste", dx: -1, dy: 0 },
      ];
      let passos: { d: (typeof dirs)[number]; q: number }[] = [];
      let dx = 0, dy = 0;
      do {
        passos = Array.from({ length: rng.int(3, 4) }, () => ({ d: rng.pick(dirs), q: rng.int(1, 6) }));
        dx = sum(passos.map((p) => p.d.dx * p.q));
        dy = sum(passos.map((p) => p.d.dy * p.q));
      } while ((dx === 0 && dy === 0) || (dx !== 0 && dy !== 0 && rng.bool(0.4)));
      const desc = (x: number, y: number) => {
        const partes: string[] = [];
        if (y) partes.push(`${Math.abs(y)} quarteirão(ões) ao ${y > 0 ? "norte" : "sul"}`);
        if (x) partes.push(`${Math.abs(x)} quarteirão(ões) a ${x > 0 ? "leste" : "oeste"}`);
        return partes.length ? partes.join(" e ") : "no ponto de partida";
      };
      const total = sum(passos.map((p) => p.q));
      const m = montar(
        rng,
        desc(dx, dy),
        [
          { txt: desc(-dx, -dy), erro: "Você inverteu os sentidos (trocou norte/sul ou leste/oeste)." },
          { txt: desc(dy, dx), erro: "Você misturou os eixos: norte/sul é um eixo, leste/oeste é outro." },
          { txt: `${total} quarteirões do ponto de partida, em linha reta`, erro: "Você somou todos os trechos. Trechos em sentidos opostos se cancelam." },
          { txt: desc(dx, -dy), erro: "Você errou o sentido do eixo norte–sul." },
          { txt: desc(-dx, dy), erro: "Você errou o sentido do eixo leste–oeste." },
        ],
        (i) => desc(dx + i, dy),
      );
      return {
        enunciado: `Saindo da prefeitura, uma pessoa anda ${passos.map((p) => `${p.q} quarteirão(ões) para o ${p.d.nome}`).join(", depois ")}. Em relação à prefeitura, ela está:`,
        ...m,
        explicacao: `Some cada eixo separado: norte–sul = ${dy >= 0 ? `${dy} ao norte` : `${-dy} ao sul`}; leste–oeste = ${dx >= 0 ? `${dx} a leste` : `${-dx} a oeste`}.`,
        passos: [
          "Separe em dois eixos: Norte(+)/Sul(−) e Leste(+)/Oeste(−).",
          `Norte–sul: ${passos.filter((p) => p.d.dy).map((p) => `${p.d.dy > 0 ? "+" : "−"}${p.q}`).join(" ") || "0"} = ${dy}.`,
          `Leste–oeste: ${passos.filter((p) => p.d.dx).map((p) => `${p.d.dx > 0 ? "+" : "−"}${p.q}`).join(" ") || "0"} = ${dx}.`,
          `Posição final: ${desc(dx, dy)}.`,
        ],
        macete: "Opostos se cancelam: 4 ao norte e 3 ao sul = 1 ao norte.",
      };
    },
  },

  // ───────────────────────── Probabilidade
  {
    id: "prob-simples",
    materia: M,
    tema: "Probabilidade",
    nivel: "basico",
    altaChance: true,
    gerar(rng) {
      let a = 0, b = 0, c = 0;
      do {
        a = rng.int(1, 9);
        b = rng.int(1, 9);
        c = rng.int(1, 9);
      } while (a === b + c || a * 3 === a + b + c);
      const T = a + b + c;
      const m = montar(
        rng,
        fracao(a, T),
        [
          { txt: fracao(a, b + c), erro: "Você dividiu pelas OUTRAS fichas. O denominador é o TOTAL de fichas." },
          { txt: "1/3", erro: "Você dividiu pelo número de TIPOS de ficha. Cada ficha tem a mesma chance, não cada tipo." },
          { txt: fracao(b + c, T), erro: "Essa é a probabilidade de NÃO sair uma ficha preferencial." },
          { txt: fracao(1, T), erro: "Essa é a chance de sair UMA ficha específica, não qualquer ficha preferencial." },
        ],
        (i) => fracao(a + i, T + i),
      );
      return {
        enunciado: `Em uma urna há ${a} fichas de atendimento preferencial, ${b} de atendimento normal e ${c} de retorno, todas iguais no tato. Sorteando uma ficha ao acaso, a probabilidade de ela ser preferencial é:`,
        ...m,
        explicacao: `P = casos favoráveis ÷ casos possíveis = ${a} ÷ ${T}${fracao(a, T) !== `${a}/${T}` ? ` = ${fracao(a, T)}` : ""}.`,
        passos: [
          "Probabilidade = o que eu quero ÷ tudo o que pode acontecer.",
          `Casos favoráveis (preferenciais): ${a}.`,
          `Casos possíveis (todas as fichas): ${a} + ${b} + ${c} = ${T}.`,
          `P = ${a}/${T}${fracao(a, T) !== `${a}/${T}` ? ` = ${fracao(a, T)} (simplificando)` : ""} ≈ ${fmt((a / T) * 100, 1)}%.`,
        ],
        macete: "Probabilidade é sempre entre 0 e 1. Alternativa maior que 1 é eliminada na hora.",
      };
    },
  },
  {
    id: "prob-dado-uniao",
    materia: M,
    tema: "Probabilidade",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const eventos = [
        { nome: "um número par", s: [2, 4, 6] },
        { nome: "um número ímpar", s: [1, 3, 5] },
        { nome: "um número maior que 4", s: [5, 6] },
        { nome: "um número menor que 3", s: [1, 2] },
        { nome: "um múltiplo de 3", s: [3, 6] },
        { nome: "um número primo", s: [2, 3, 5] },
      ];
      let A = eventos[0], B = eventos[1];
      let inter: number[] = [];
      do {
        [A, B] = rng.shuffle(eventos).slice(0, 2);
        inter = A.s.filter((x) => B.s.includes(x));
      } while (inter.length === 0);
      const uniao = [...new Set([...A.s, ...B.s])].sort();
      const m = montar(
        rng,
        fracao(uniao.length, 6),
        [
          { txt: fracao(A.s.length + B.s.length, 6), erro: `Você somou sem descontar a interseção: o(s) número(s) ${inter.join(", ")} foi(ram) contado(s) duas vezes.` },
          { txt: fracao(inter.length, 6), erro: "Você calculou 'A E B' (interseção). A pergunta é 'A OU B' (união)." },
          { txt: fracao(A.s.length, 6), erro: "Você considerou só o primeiro evento." },
          { txt: fracao(6 - uniao.length, 6), erro: "Essa é a probabilidade de NÃO ocorrer nenhum dos dois." },
        ],
        (i) => fracao(((uniao.length + i - 1) % 6) + 1, 6),
      );
      return {
        enunciado: `Lançando um dado comum (faces de 1 a 6), qual a probabilidade de sair ${A.nome} OU ${B.nome}?`,
        ...m,
        explicacao: `P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = ${A.s.length}/6 + ${B.s.length}/6 − ${inter.length}/6 = ${fracao(uniao.length, 6)}.`,
        passos: [
          `A = ${A.nome}: {${A.s.join(", ")}}.`,
          `B = ${B.nome}: {${B.s.join(", ")}}.`,
          `Em comum (A e B): {${inter.join(", ")}} — não pode contar duas vezes.`,
          `A ou B: {${uniao.join(", ")}} → ${uniao.length} casos de 6.`,
          `P = ${uniao.length}/6${fracao(uniao.length, 6) !== `${uniao.length}/6` ? ` = ${fracao(uniao.length, 6)}` : ""}.`,
        ],
        macete: "Com dado, é mais rápido LISTAR os números do que usar fórmula.",
      };
    },
  },
  {
    id: "prob-independentes",
    materia: M,
    tema: "Probabilidade",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const eventos = [
        { nome: "um número par", n: 3 },
        { nome: "o número 6", n: 1 },
        { nome: "um número maior que 4", n: 2 },
        { nome: "um múltiplo de 3", n: 2 },
        { nome: "um número menor que 5", n: 4 },
      ];
      const e = rng.pick(eventos);
      const face = rng.pick(["cara", "coroa"]);
      const m = montar(
        rng,
        fracao(e.n, 12),
        [
          { txt: fracao(6 + 2 * e.n, 12), erro: "Você SOMOU as probabilidades. Para 'E' entre eventos independentes, MULTIPLICA." },
          { txt: fracao(e.n, 6), erro: "Você considerou só o dado e esqueceu a moeda." },
          { txt: "1/2", erro: "Você considerou só a moeda e esqueceu o dado." },
          { txt: fracao(e.n + 1, 8), erro: "Você somou os casos favoráveis e os possíveis. Para eventos independentes, multiplique as probabilidades." },
        ],
        (i) => fracao(i, 12 + i),
      );
      return {
        enunciado: `Uma moeda e um dado comum são lançados ao mesmo tempo. Qual a probabilidade de sair ${face} na moeda E ${e.nome} no dado?`,
        ...m,
        explicacao: `Independentes: P = 1/2 × ${fracao(e.n, 6)} = ${fracao(e.n, 12)}.`,
        passos: [
          "Moeda e dado não interferem um no outro → eventos INDEPENDENTES.",
          `P(${face}) = 1/2.`,
          `P(${e.nome}) = ${e.n}/6${fracao(e.n, 6) !== `${e.n}/6` ? ` = ${fracao(e.n, 6)}` : ""}.`,
          `"E" entre independentes → multiplica: 1/2 × ${e.n}/6 = ${e.n}/12${fracao(e.n, 12) !== `${e.n}/12` ? ` = ${fracao(e.n, 12)}` : ""}.`,
        ],
        macete: "'E' → multiplica. 'OU' → soma (descontando o que se repete).",
      };
    },
  },
  {
    id: "prob-sem-reposicao",
    materia: M,
    tema: "Probabilidade",
    nivel: "avancado",
    altaChance: false,
    gerar(rng) {
      const a = rng.int(3, 7);
      const b = rng.int(2, 7);
      const T = a + b;
      const cor = fracao(a * (a - 1), T * (T - 1));
      const m = montar(
        rng,
        cor,
        [
          { txt: fracao(a * a, T * T), erro: "Você calculou COM reposição. Como o primeiro envelope não volta, o total e os favoráveis diminuem em 1." },
          { txt: fracao(2 * a, T), erro: "Você somou as probabilidades. 'Primeiro E segundo' → multiplica." },
          { txt: fracao(a * (a - 1), T * T), erro: "Você diminuiu os favoráveis, mas esqueceu de diminuir o total na segunda retirada." },
          { txt: fracao(a, T), erro: "Essa é a probabilidade de UMA retirada só." },
        ],
        (i) => fracao(a * (a - 1) + i, T * (T - 1)),
      );
      return {
        enunciado: `Uma gaveta tem ${a} envelopes de processos urgentes e ${b} de processos comuns. Retiram-se 2 envelopes, um após o outro, SEM reposição. Qual a probabilidade de os dois serem urgentes?`,
        ...m,
        explicacao: `P = ${a}/${T} × ${a - 1}/${T - 1} = ${a * (a - 1)}/${T * (T - 1)} = ${cor}.`,
        passos: [
          `1ª retirada: ${a} urgentes em ${T} envelopes → ${a}/${T}.`,
          `Sem reposição: sobram ${a - 1} urgentes em ${T - 1} envelopes → ${a - 1}/${T - 1}. (Eventos DEPENDENTES.)`,
          `As duas coisas acontecem → multiplica: ${a}/${T} × ${a - 1}/${T - 1} = ${a * (a - 1)}/${T * (T - 1)}.`,
          `Simplificando: ${cor}.`,
        ],
        macete: "'Sem reposição' = os eventos dependem um do outro: tire 1 do numerador E do denominador na segunda retirada.",
      };
    },
  },
  {
    id: "prob-certo-impossivel",
    materia: M,
    tema: "Probabilidade",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      const casos = [
        { ev: "sair um número menor que 7", p: "1" },
        { ev: "sair um número de 1 a 6", p: "1" },
        { ev: "sair o número 7", p: "0" },
        { ev: "sair um número maior que 6", p: "0" },
        { ev: "sair o número 0", p: "0" },
        { ev: "sair um número par", p: "1/2" },
        { ev: "sair o número 4", p: "1/6" },
        { ev: "sair um número diferente de 3", p: "5/6" },
      ];
      const c = rng.pick(casos);
      const rot: Record<string, string> = {
        "1": "Evento certo (probabilidade 1)",
        "0": "Evento impossível (probabilidade 0)",
        "1/2": "Evento aleatório com probabilidade 1/2",
        "1/6": "Evento aleatório com probabilidade 1/6",
        "5/6": "Evento aleatório com probabilidade 5/6",
      };
      const chaves = rng.shuffle(Object.keys(rot));
      const expl: Record<string, string> = {
        "1": "Evento certo é o que SEMPRE acontece: todas as 6 faces o satisfazem.",
        "0": "Evento impossível é o que NUNCA acontece: nenhuma face o satisfaz.",
        "1/2": "Seriam 3 faces favoráveis em 6.",
        "1/6": "Seria só 1 face favorável em 6.",
        "5/6": "Seriam 5 faces favoráveis em 6.",
      };
      return {
        enunciado: `No lançamento de um dado comum (faces de 1 a 6), o evento "${c.ev}" é classificado como:`,
        alternativas: chaves.map((k) => rot[k]),
        correta: chaves.indexOf(c.p),
        erros: chaves.map((k) => (k === c.p ? null : `Não confere. ${expl[k]}`)),
        explicacao: `Conte as faces que satisfazem "${c.ev}": a probabilidade é ${c.p}.`,
        passos: [
          "Espaço amostral do dado: {1, 2, 3, 4, 5, 6} → 6 resultados possíveis.",
          `Quantas faces satisfazem "${c.ev}"? Probabilidade = ${c.p}.`,
          c.p === "1" ? "Acontece sempre → evento CERTO." : c.p === "0" ? "Nunca acontece → evento IMPOSSÍVEL." : "Pode ou não acontecer → evento aleatório.",
        ],
        macete: "Certo = 1 (100%). Impossível = 0 (0%). Todo o resto fica entre 0 e 1.",
      };
    },
  },

  // ───────────────────────── Sequências
  {
    id: "seq-aritmetica",
    materia: M,
    tema: "Sequências",
    nivel: "basico",
    altaChance: true,
    gerar(rng) {
      const a0 = rng.int(1, 40);
      const rz = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, -3, -4, -5]);
      const base = rz < 0 ? a0 + 60 : a0;
      const termos = Array.from({ length: 5 }, (_, i) => base + i * rz);
      const prox = base + 5 * rz;
      const m = montar(
        rng,
        String(prox),
        [
          { txt: String(prox + rz), erro: "Você pulou um termo: esse é o 7º, não o 6º." },
          { txt: String(prox - (rz > 0 ? 1 : -1)), erro: `Razão errada: a diferença entre os termos é ${rz}.` },
          { txt: String(termos[4] * 2 - termos[0]), erro: "Você inventou uma regra que não se mantém em todos os termos. Confira a diferença entre vizinhos." },
          { txt: String(termos[4] + termos[3]), erro: "Você somou os dois últimos (regra de Fibonacci), mas a diferença entre vizinhos é constante." },
        ],
        (i) => String(prox + i * 2 + 1),
      );
      return {
        enunciado: `Qual é o próximo termo da sequência: ${termos.join(", ")}, ... ?`,
        ...m,
        explicacao: `A diferença entre termos vizinhos é sempre ${rz}. Próximo: ${termos[4]} ${rz > 0 ? "+" : "−"} ${Math.abs(rz)} = ${prox}.`,
        passos: [
          "Primeiro teste: calcule a diferença entre cada termo e o anterior.",
          termos.slice(1).map((t, i) => `${t} − ${termos[i]} = ${rz}`).join("; "),
          `Diferença constante → progressão aritmética de razão ${rz}.`,
          `Próximo: ${termos[4]} ${rz > 0 ? "+" : "−"} ${Math.abs(rz)} = ${prox}.`,
        ],
        macete: "Ordem de testes: 1) diferença constante? 2) multiplicação constante? 3) diferenças das diferenças? 4) alternância?",
      };
    },
  },
  {
    id: "seq-termo-geral",
    materia: M,
    tema: "Sequências",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const a1 = rng.int(2, 30);
      const rz = rng.int(2, 9);
      const n = rng.int(15, 60);
      const an = a1 + (n - 1) * rz;
      const m = montar(
        rng,
        String(an),
        [
          { txt: String(a1 + n * rz), erro: "Você usou n em vez de (n − 1). Do 1º ao nº termo são n − 1 saltos." },
          { txt: String(n * rz), erro: "Você esqueceu de começar do primeiro termo." },
          { txt: String(a1 * n), erro: "Você multiplicou o primeiro termo por n. Não é assim que a PA cresce." },
          { txt: String(an - rz), erro: "Esse é o termo anterior ao pedido." },
        ],
        (i) => String(an + i * 3),
      );
      return {
        enunciado: `Os números de protocolo de um setor seguem a sequência ${[0, 1, 2, 3].map((k) => a1 + k * rz).join(", ")}, ... Qual será o ${n}º número dessa sequência?`,
        ...m,
        explicacao: `aₙ = a₁ + (n − 1) × r = ${a1} + ${n - 1} × ${rz} = ${an}.`,
        passos: [
          `Razão: ${a1 + rz} − ${a1} = ${rz}. Primeiro termo: ${a1}.`,
          `Do 1º ao ${n}º termo há ${n - 1} "saltos" de ${rz}.`,
          `${n - 1} × ${rz} = ${(n - 1) * rz}.`,
          `${a1} + ${(n - 1) * rz} = ${an}.`,
        ],
        macete: "Pense em degraus: para subir do 1º ao 10º andar você sobe 9 lances, não 10.",
      };
    },
  },
  {
    id: "seq-geometrica",
    materia: M,
    tema: "Sequências",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const a0 = rng.pick([1, 2, 3, 5]);
      const q = rng.pick([2, 3]);
      const termos = Array.from({ length: 5 }, (_, i) => a0 * q ** i);
      const prox = termos[4] * q;
      const m = montar(
        rng,
        String(prox),
        [
          { txt: String(termos[4] + (termos[4] - termos[3])), erro: "Você tratou como PA (somando a última diferença). Aqui cada termo é MULTIPLICADO por " + q + "." },
          { txt: String(termos[4] * (q + 1)), erro: `O fator é ${q}, não ${q + 1}.` },
          { txt: String(termos[4] + termos[3]), erro: "Você somou os dois últimos termos (Fibonacci). A regra é multiplicar." },
          { txt: String(termos[4] * q * q), erro: "Você pulou um termo." },
        ],
        (i) => String(prox + i * q),
      );
      return {
        enunciado: `Qual é o próximo termo da sequência: ${termos.join(", ")}, ... ?`,
        ...m,
        explicacao: `Cada termo é o anterior × ${q}. Próximo: ${termos[4]} × ${q} = ${prox}.`,
        passos: [
          `Diferenças: ${termos.slice(1).map((t, i) => t - termos[i]).join(", ")} — não são constantes, então não é PA.`,
          `Divisões: ${termos.slice(1).map((t, i) => `${t} ÷ ${termos[i]} = ${q}`).join("; ")} → constante!`,
          `Progressão geométrica de razão ${q}. Próximo: ${termos[4]} × ${q} = ${prox}.`,
        ],
        macete: "Se os números crescem cada vez mais rápido, teste a multiplicação.",
      };
    },
  },
  {
    id: "seq-alternada",
    materia: M,
    tema: "Sequências",
    nivel: "avancado",
    altaChance: false,
    gerar(rng) {
      const tipo = rng.int(0, 1);
      let termos: number[] = [];
      let prox = 0;
      let regra = "";
      let passosExtra: string[] = [];
      const errados: { txt: string; erro: string }[] = [];
      if (tipo === 0) {
        // +a, ×b alternados
        const a = rng.int(1, 5);
        const b = rng.pick([2, 3]);
        let x = rng.int(1, 6);
        termos = [x];
        for (let i = 0; i < 5; i++) {
          x = i % 2 === 0 ? x + a : x * b;
          termos.push(x);
        }
        prox = termos[5] + a; // próximo passo (i=5) é soma
        regra = `alterna "+${a}" e "×${b}"`;
        passosExtra = termos.slice(1).map((t, i) => `${termos[i]} ${i % 2 === 0 ? `+ ${a}` : `× ${b}`} = ${t}`);
        errados.push(
          { txt: String(termos[5] * b), erro: `Você repetiu a multiplicação. Depois de "×${b}" vem "+${a}".` },
          { txt: String(termos[5] + (termos[5] - termos[4])), erro: "Você supôs diferença constante. As diferenças mudam; a regra alterna duas operações." },
          { txt: String(termos[5] + a + 1), erro: `O passo de soma é +${a}.` },
          { txt: String(termos[5] + termos[4]), erro: "Você somou os dois últimos termos; a regra é alternar soma e multiplicação." },
        );
      } else {
        // diferenças crescentes: +d, +(d+k), +(d+2k)...
        const d = rng.int(1, 5);
        const k = rng.int(1, 3);
        let x = rng.int(1, 20);
        termos = [x];
        for (let i = 0; i < 5; i++) {
          x += d + i * k;
          termos.push(x);
        }
        prox = termos[5] + d + 5 * k;
        regra = `as diferenças aumentam ${k} a cada passo (${d}, ${d + k}, ${d + 2 * k}, ...)`;
        passosExtra = [`Diferenças: ${termos.slice(1).map((t, i) => t - termos[i]).join(", ")}.`, `As diferenças crescem de ${k} em ${k}; a próxima é ${d + 5 * k}.`];
        errados.push(
          { txt: String(termos[5] + d + 4 * k), erro: "Você repetiu a última diferença. Ela também cresce a cada passo." },
          { txt: String(termos[5] + d + 6 * k), erro: "Você pulou uma diferença." },
          { txt: String(termos[5] * 2 - termos[4]), erro: "Você supôs diferença constante." },
          { txt: String(termos[5] + termos[4]), erro: "Você somou os dois últimos termos (Fibonacci)." },
        );
      }
      const m = montar(rng, String(prox), errados, (i) => String(prox + i));
      return {
        enunciado: `Observe a sequência: ${termos.join(", ")}, ... O próximo termo é:`,
        ...m,
        explicacao: `A regra: ${regra}. Próximo termo: ${prox}.`,
        passos: ["Diferença não é constante e divisão também não → procure um padrão de 2ª ordem ou alternado.", ...passosExtra, `Próximo: ${prox}.`],
        macete: "Escreva as diferenças embaixo da sequência, no rascunho. O padrão costuma aparecer nessa segunda linha.",
      };
    },
  },
  {
    id: "seq-letras",
    materia: M,
    tema: "Sequências",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const k = rng.int(2, 4);
      const ini = rng.int(0, 25 - 5 * k);
      const letras = Array.from({ length: 5 }, (_, i) => AB[ini + i * k]);
      const certo = AB[ini + 5 * k];
      const m = montar(
        rng,
        certo,
        [
          { txt: AB[ini + 5 * k - 1] ?? "", erro: `O salto é de ${k} letras. Conte K, W e Y: elas fazem parte do alfabeto (26 letras).` },
          { txt: AB[ini + 5 * k + 1] ?? "", erro: `Você saltou uma letra a mais. O salto é de ${k}.` },
          { txt: AB[ini + 4 * k + k - 2] ?? "", erro: `O salto é de ${k} (pula ${k - 1} letra(s) entre uma e outra).` },
          { txt: AB[ini + 6 * k] ?? "", erro: "Você pulou um termo inteiro." },
        ],
        (i) => AB[(ini + 5 * k + i + 2) % 26],
      );
      return {
        enunciado: `Considerando o alfabeto de 26 letras, qual letra continua a sequência: ${letras.join(", ")}, ... ?`,
        ...m,
        explicacao: `Cada letra avança ${k} posições no alfabeto. Depois de ${letras[4]}, vem ${certo}.`,
        passos: [
          "Numere as letras: A=1, B=2, C=3, …",
          `${letras.map((l) => `${l}=${AB.indexOf(l) + 1}`).join(", ")} → avança ${k} a cada termo.`,
          `${AB.indexOf(letras[4]) + 1} + ${k} = ${ini + 5 * k + 1} → ${certo}.`,
        ],
        macete: "Escreva o alfabeto numerado no rascunho uma vez só e use para todas as questões de letras.",
      };
    },
  },
];

void r;
void pct;
