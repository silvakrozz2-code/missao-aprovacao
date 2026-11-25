// Geradores parametrizados: aritmética, estimativa, porcentagem, juros,
// sistema monetário, regra de três, razão/proporção e problemas.
import type { Gerador } from "../tipos.ts";
import { brl, fmt, fracao, mdc, mmc, montar, pct, r, vizinhos } from "./util.ts";

const M = "Raciocínio Lógico";

export const geradoresA: Gerador[] = [
  // ───────────────────────── Quatro operações
  {
    id: "ops-caixas",
    materia: M,
    tema: "Quatro operações",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      const c = rng.int(4, 12);
      const f = rng.pick([50, 100, 200, 250, 500]);
      const total = c * f;
      const u = rng.int(f + 1, total - f - 1);
      const res = total - u;
      const m = montar(
        rng,
        fmt(res),
        [
          { txt: fmt(total + u), erro: "Você somou as folhas usadas em vez de subtrair. O que foi usado SAI do estoque." },
          { txt: fmt(total), erro: "Você calculou o total, mas esqueceu de descontar as folhas já usadas." },
          { txt: fmt(res - f), erro: "Você descontou uma caixa inteira a mais. Confira a multiplicação c × f." },
          { txt: fmt(res + f), erro: "Você contou uma caixa a mais no total." },
        ],
        vizinhos(res, 10, fmt),
      );
      return {
        enunciado: `Um setor recebeu ${c} caixas de papel com ${fmt(f)} folhas cada. Durante o mês, foram usadas ${fmt(u)} folhas. Quantas folhas restaram?`,
        ...m,
        explicacao: `Primeiro o total (multiplicação), depois tiramos o que foi usado (subtração): ${fmt(total)} − ${fmt(u)} = ${fmt(res)}.`,
        passos: [
          `Cada caixa tem ${fmt(f)} folhas e são ${c} caixas. Quantidades iguais repetidas → multiplicação.`,
          `Total: ${c} × ${fmt(f)} = ${fmt(total)} folhas.`,
          `Foram usadas ${fmt(u)} folhas, então elas saem do total → subtração.`,
          `${fmt(total)} − ${fmt(u)} = ${fmt(res)} folhas.`,
        ],
        macete: `Multiplicar por ${f}: ${f === 500 ? "multiplique por 1.000 e divida por 2" : f === 250 ? "multiplique por 1.000 e divida por 4" : "multiplique o número e acrescente os zeros no final"}.`,
      };
    },
  },
  {
    id: "ops-divisao",
    materia: M,
    tema: "Quatro operações",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      const n = rng.int(3, 9);
      const per = rng.int(12, 40);
      const P = n * per;
      const k = rng.int(2, per - 3);
      const res = per - k;
      const m = montar(
        rng,
        fmt(res),
        [
          { txt: fmt(P - k), erro: "Você tirou do total sem antes dividir entre os servidores. A pergunta é sobre CADA servidor." },
          { txt: fmt(per), erro: "Você achou a parte de cada um, mas esqueceu de descontar os que já foram analisados." },
          { txt: fmt(P - n * k), erro: "Esse é quanto falta para a EQUIPE inteira, não para cada servidor." },
          { txt: fmt(per + k), erro: "Você somou o que já foi feito em vez de subtrair." },
        ],
        vizinhos(res, 1, fmt),
      );
      return {
        enunciado: `Uma equipe de ${n} servidores precisa analisar ${fmt(P)} processos, divididos igualmente entre eles. Pela manhã, cada servidor analisou ${k} processos. Quantos processos ainda faltam para CADA servidor?`,
        ...m,
        explicacao: `Cada um ficou com ${fmt(P)} ÷ ${n} = ${per} processos; já fez ${k}, então faltam ${per} − ${k} = ${res}.`,
        passos: [
          `"Divididos igualmente" → divisão: ${fmt(P)} ÷ ${n} = ${per} processos para cada servidor.`,
          `Cada um já analisou ${k}, então tiramos: ${per} − ${k}.`,
          `Faltam ${res} processos para cada servidor.`,
        ],
        macete: "Sublinhe a palavra-chave da pergunta (aqui: CADA). Muitas alternativas erradas respondem a pergunta 'do grupo'.",
      };
    },
  },

  // ───────────────────────── Arredondamento, estimativa, comparação
  {
    id: "arredondar",
    materia: M,
    tema: "Arredondamento e estimativa",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      const bases = [
        { b: 10, nome: "dezena" },
        { b: 100, nome: "centena" },
        { b: 1000, nome: "unidade de milhar" },
      ];
      const alvo = rng.pick(bases);
      let x = 0;
      do {
        x = rng.int(100000, 999999) / 100; // 1.000,00 a 9.999,99
      } while (Math.abs(((x / alvo.b) % 1) - 0.5) < 0.02);
      const cor = Math.round(x / alvo.b) * alvo.b;
      const baixo = Math.floor(x / alvo.b) * alvo.b;
      const cima = Math.ceil(x / alvo.b) * alvo.b;
      const outra = cor === baixo ? cima : baixo;
      const outrasBases = bases.filter((o) => o.b !== alvo.b);
      const m = montar(
        rng,
        fmt(cor),
        [
          {
            txt: fmt(outra),
            erro: cor === baixo
              ? "Você arredondou para cima. O algarismo seguinte é menor que 5, então mantemos."
              : "Você só cortou as casas (arredondou para baixo). O algarismo seguinte é 5 ou mais, então sobe.",
          },
          ...outrasBases.map((o) => ({
            txt: fmt(Math.round(x / o.b) * o.b),
            erro: `Esse é o arredondamento para a ${o.nome}, não para a ${alvo.nome}.`,
          })),
          { txt: fmt(Math.round(x)), erro: "Você arredondou para a unidade (só tirou os centavos)." },
        ],
        vizinhos(cor, alvo.b, fmt),
      );
      return {
        enunciado: `Arredondando ${fmt(x)} para a ${alvo.nome} mais próxima, obtemos:`,
        ...m,
        explicacao: `Olhe o algarismo logo à direita da casa da ${alvo.nome}: se for 5 ou mais, sobe; se for menor que 5, mantém.`,
        passos: [
          `Número: ${fmt(x)}. Queremos a ${alvo.nome} mais próxima (múltiplo de ${fmt(alvo.b)}).`,
          `Os dois múltiplos de ${fmt(alvo.b)} em volta são ${fmt(baixo)} e ${fmt(cima)}.`,
          `${fmt(x)} está mais perto de ${fmt(cor)}.`,
          `Resposta: ${fmt(cor)}.`,
        ],
        macete: "Pense: 'entre quais dois números redondos ele está?' e escolha o mais perto. É mais seguro que decorar regra.",
      };
    },
  },
  {
    id: "estimativa-soma",
    materia: M,
    tema: "Arredondamento e estimativa",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const gerarParcela = () => {
        let v = 0;
        do v = rng.int(110, 980);
        while (v % 100 === 50 || v % 100 === 0);
        return v;
      };
      const ps = [gerarParcela(), gerarParcela(), gerarParcela()];
      const arr = ps.map((p) => Math.round(p / 100) * 100);
      const est = arr.reduce((a, b) => a + b, 0);
      const exata = ps.reduce((a, b) => a + b, 0);
      const baixo = ps.reduce((a, p) => a + Math.floor(p / 100) * 100, 0);
      const cima = ps.reduce((a, p) => a + Math.ceil(p / 100) * 100, 0);
      const m = montar(
        rng,
        fmt(est),
        [
          { txt: fmt(exata), erro: "Você fez a conta exata. A questão pede a ESTIMATIVA com as parcelas arredondadas." },
          { txt: fmt(baixo), erro: "Você cortou todas as parcelas para baixo, sem olhar se a dezena era 5 ou mais." },
          { txt: fmt(cima), erro: "Você arredondou todas as parcelas para cima." },
          { txt: fmt(Math.round(exata / 1000) * 1000), erro: "Você arredondou o resultado para o milhar, mas a questão pede arredondar cada parcela para a centena." },
        ],
        vizinhos(est, 100, fmt),
      );
      return {
        enunciado: `Um protocolo registrou ${ps.join(", ").replace(/, (?=[^,]*$)/, " e ")} documentos em três dias. Arredondando cada quantidade para a centena mais próxima, qual é a estimativa do total?`,
        ...m,
        explicacao: `Arredonda cada parcela primeiro (${arr.map((a) => fmt(a)).join(" + ")}) e só depois soma: ${fmt(est)}.`,
        passos: [
          ...ps.map((p, i) => `${p} → ${fmt(arr[i])} (a dezena é ${Math.floor((p % 100) / 10)}, ${p % 100 >= 50 ? "5 ou mais: sobe" : "menor que 5: mantém"}).`),
          `Somando os arredondados: ${arr.map((a) => fmt(a)).join(" + ")} = ${fmt(est)}.`,
        ],
        macete: "Estimativa serve para eliminar alternativas rápido: se só uma está perto do valor estimado, marque e siga.",
      };
    },
  },
  {
    id: "comparar-numeros",
    materia: M,
    tema: "Arredondamento e estimativa",
    nivel: "intermediario",
    altaChance: false,
    gerar(rng) {
      const pool: [number, number][] = [
        [1, 2], [3, 5], [2, 3], [3, 4], [4, 5], [5, 8], [7, 10], [13, 20], [17, 25], [11, 20], [3, 8], [9, 20], [7, 12], [5, 6], [2, 5], [1, 3],
      ];
      let escolhidos: [number, number][] = [];
      do {
        escolhidos = rng.shuffle(pool).slice(0, 5);
      } while (
        escolhidos.some((a, i) => escolhidos.some((b, j) => i !== j && Math.abs(a[0] / a[1] - b[0] / b[1]) < 0.015))
      );
      const exibir = ([n, d]: [number, number]) => {
        const v = n / d;
        const formas: string[] = [`${n}/${d}`];
        if (Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-9) formas.push(fmt(v, 3));
        if (Math.abs(v * 100 - Math.round(v * 100)) < 1e-9) formas.push(`${fmt(v * 100, 0)}%`);
        return rng.pick(formas);
      };
      const textos = escolhidos.map(exibir);
      const maior = rng.bool();
      const valores = escolhidos.map(([n, d]) => n / d);
      const alvo = maior ? Math.max(...valores) : Math.min(...valores);
      const iCorreta = valores.indexOf(alvo);
      const alvoDec = fmt(alvo, 3);
      // Aqui as alternativas já são os números; não há "distratores" calculados.
      const ordem = rng.shuffle([0, 1, 2, 3, 4]);
      const alternativas = ordem.map((i) => textos[i]);
      const erros = ordem.map((i) =>
        i === iCorreta
          ? null
          : `${textos[i]} vale aproximadamente ${fmt(valores[i], 3)}, que é ${maior ? "menor" : "maior"} que ${alvoDec}.`,
      );
      return {
        enunciado: `Qual dos números abaixo é o ${maior ? "MAIOR" : "MENOR"}?`,
        alternativas,
        correta: ordem.indexOf(iCorreta),
        erros,
        explicacao: `Transforme todos para a mesma forma (decimal). ${textos[iCorreta]} ≈ ${alvoDec} é o ${maior ? "maior" : "menor"}.`,
        passos: [
          "Para comparar, coloque todos no mesmo formato. O decimal é o mais fácil.",
          ...escolhidos.map(([n, d], i) => `${textos[i]} → ${n} ÷ ${d} ≈ ${fmt(n / d, 3)}`),
          `O ${maior ? "maior" : "menor"} é ${alvoDec}, ou seja, ${textos[iCorreta]}.`,
        ],
        macete: "Porcentagem vira decimal andando a vírgula duas casas para a esquerda: 65% = 0,65.",
      };
    },
  },

  // ───────────────────────── Porcentagem
  {
    id: "pct-simples",
    materia: M,
    tema: "Porcentagem",
    nivel: "basico",
    altaChance: true,
    gerar(rng) {
      const p = rng.pick([5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75]);
      const passo = 100 / mdc(p, 100);
      let V = 0;
      do V = passo * rng.int(1, 60);
      while (V < 40 || V > 2400);
      const res = (V * p) / 100;
      const m = montar(
        rng,
        fmt(res),
        [
          { txt: fmt((V * p) / 10), erro: "Você dividiu por 10 em vez de 100. 'Por cento' = dividido por 100." },
          { txt: fmt(V - res), erro: `Esse é o número de quem NÃO está no atendimento (${100 - p}%).` },
          { txt: fmt((V * p) / 1000), erro: "Você dividiu por 1.000 — a vírgula andou uma casa a mais." },
          { txt: fmt(V + p), erro: "Você somou o percentual ao total. Porcentagem é multiplicação, não soma." },
        ],
        vizinhos(res, Math.max(1, Math.round(res / 10)), fmt),
      );
      const atalho =
        p % 10 === 0
          ? `10% de ${fmt(V)} = ${fmt(V / 10)}; então ${p}% = ${p / 10} × ${fmt(V / 10)} = ${fmt(res)}.`
          : p % 5 === 0
            ? `10% de ${fmt(V)} = ${fmt(V / 10)}; 5% é a metade disso = ${fmt(V / 20)}. Monte ${p}% somando esses pedaços.`
            : `1% de ${fmt(V)} = ${fmt(V / 100)}; então ${p}% = ${p} × ${fmt(V / 100)} = ${fmt(res)}.`;
      return {
        enunciado: `Uma secretaria municipal tem ${fmt(V)} servidores, e ${p}% deles trabalham no atendimento ao público. Quantos servidores trabalham no atendimento?`,
        ...m,
        explicacao: `${p}% de ${fmt(V)} = ${fmt(V)} × ${p}/100 = ${fmt(res)}.`,
        passos: [
          `${p}% quer dizer ${p} em cada 100, ou seja, ${p}/100.`,
          `"De" em porcentagem significa multiplicar: ${fmt(V)} × ${p}/100.`,
          `${fmt(V)} × ${p} = ${fmt(V * p)}; dividindo por 100: ${fmt(res)}.`,
        ],
        macete: atalho,
      };
    },
  },
  {
    id: "pct-aumento-desconto",
    materia: M,
    tema: "Porcentagem",
    nivel: "intermediario",
    altaChance: true,
    gerar(rng) {
      const aumento = rng.bool();
      const p = rng.pick([4, 5, 6, 8, 10, 12, 15, 20, 25]);
      const S = rng.int(15, 60) * 100;
      const fator = aumento ? 1 + p / 100 : 1 - p / 100;
      const res = S * fator;
      const parte = (S * p) / 100;
      const m = montar(
        rng,
        brl(res),
        [
          { txt: brl(parte), erro: `Você calculou só o valor do ${aumento ? "aumento" : "desconto"} (${p}%), mas esqueceu de ${aumento ? "somar ao" : "tirar do"} valor original.` },
          { txt: brl(aumento ? S + p : S - p), erro: `Você ${aumento ? "somou" : "tirou"} ${p} reais, e não ${p}%.` },
          { txt: brl(aumento ? S * (1 - p / 100) : S * (1 + p / 100)), erro: `Você aplicou ${aumento ? "desconto" : "aumento"} em vez de ${aumento ? "aumento" : "desconto"}.` },
          { txt: brl(aumento ? S * (1 + p / 10) : S * (1 - p / 10)), erro: "Você usou p/10 em vez de p/100 (vírgula no lugar errado)." },
        ],
        vizinhos(res, 10, brl),
      );
      return {
        enunciado: aumento
          ? `O salário de um servidor era ${brl(S)} e recebeu reajuste de ${p}%. Qual é o novo salário?`
          : `Um equipamento custa ${brl(S)} e, à vista, tem desconto de ${p}%. Qual é o preço à vista?`,
        ...m,
        explicacao: `${aumento ? "Aumento" : "Desconto"} de ${p}%: multiplique por ${fmt(fator, 2)}. ${brl(S)} × ${fmt(fator, 2)} = ${brl(res)}.`,
        passos: [
          `${p}% de ${brl(S)} = ${brl(parte)}.`,
          aumento ? `Novo valor = ${brl(S)} + ${brl(parte)} = ${brl(res)}.` : `Valor com desconto = ${brl(S)} − ${brl(parte)} = ${brl(res)}.`,
          `Jeito rápido: ${aumento ? `aumentar ${p}% é ficar com ${100 + p}%` : `tirar ${p}% é ficar com ${100 - p}%`}, ou seja, multiplicar por ${fmt(fator, 2)}.`,
        ],
        macete: `Fator multiplicativo: aumento de p% → × (1 + p/100); desconto de p% → × (1 − p/100).`,
      };
    },
  },
  {
    id: "pct-sucessivo",
    materia: M,
    tema: "Porcentagem",
    nivel: "avancado",
    altaChance: true,
    gerar(rng) {
      const a = rng.pick([10, 20, 25, 30, 40, 50]);
      const b = rng.pick([10, 20, 25, 30, 40, 50]);
      const V = rng.int(10, 80) * 10;
      const fa = 1 + a / 100;
      const fb = 1 - b / 100;
      const res = V * fa * fb;
      const m = montar(
        rng,
        brl(res),
        [
          { txt: brl(V * (1 + (a - b) / 100)), erro: `Você fez ${a}% − ${b}% direto. Não pode: o desconto incide sobre o preço JÁ aumentado.` },
          { txt: brl(V), erro: "Você achou que aumento e desconto se cancelam. Eles incidem sobre bases diferentes." },
          { txt: brl(V * fb), erro: "Você aplicou só o desconto e esqueceu o aumento." },
          { txt: brl(V * fa), erro: "Você aplicou só o aumento e esqueceu o desconto." },
        ],
        vizinhos(res, 5, brl),
      );
      return {
        enunciado: `Um produto custava ${brl(V)}. Ele sofreu um aumento de ${a}% e, em seguida, um desconto de ${b}% sobre o novo preço. Qual é o preço final?`,
        ...m,
        explicacao: `Porcentagens sucessivas se MULTIPLICAM: ${brl(V)} × ${fmt(fa)} × ${fmt(fb)} = ${brl(res)}.`,
        passos: [
          `Aumento de ${a}% → multiplica por ${fmt(fa)}: ${brl(V)} × ${fmt(fa)} = ${brl(V * fa)}.`,
          `O desconto de ${b}% é sobre ${brl(V * fa)} → multiplica por ${fmt(fb)}.`,
          `${brl(V * fa)} × ${fmt(fb)} = ${brl(res)}.`,
          `Variação total: ${fmt(fa)} × ${fmt(fb)} = ${fmt(fa * fb, 4)} → ${fa * fb >= 1 ? "aumento" : "queda"} de ${fmt(Math.abs(fa * fb - 1) * 100)}%.`,
        ],
        macete: "Pegadinha clássica: +x% e depois −x% NÃO volta ao preço inicial. Sempre fica menor.",
      };
    },
  },
  {
    id: "pct-variacao",
    materia: M,
    tema: "Porcentagem",
    nivel: "avancado",
    altaChance: true,
    gerar(rng) {
      const p = rng.pick([10, 15, 20, 25, 30, 40, 50, 60, 75]);
      const passo = 100 / mdc(p, 100);
      const A = passo * rng.int(2, Math.max(3, Math.floor(1200 / passo)));
      const B = A * (1 + p / 100);
      const m = montar(
        rng,
        pct(p),
        [
          { txt: pct(r(((B - A) / B) * 100, 2)), erro: "Você dividiu a diferença pelo valor NOVO. A base é sempre o valor ANTIGO." },
          { txt: pct(r((B / A) * 100, 2)), erro: `Você achou B/A = ${fmt(B / A)} (${fmt((B / A) * 100)}%) e esqueceu de tirar os 100% iniciais.` },
          { txt: pct(B - A), erro: "Você usou a diferença absoluta como se fosse a porcentagem." },
          { txt: pct(p / 2), erro: "Conta feita pela metade. Refaça: diferença ÷ valor inicial." },
        ],
        vizinhos(p, 5, pct),
      );
      return {
        enunciado: `O número de atendimentos de uma unidade passou de ${fmt(A)} para ${fmt(B)} por mês. O aumento percentual foi de:`,
        ...m,
        explicacao: `Variação = (novo − antigo) ÷ antigo = ${fmt(B - A)} ÷ ${fmt(A)} = ${fmt(p / 100)} = ${p}%.`,
        passos: [
          `Diferença: ${fmt(B)} − ${fmt(A)} = ${fmt(B - A)}.`,
          `Compare com o valor de ANTES: ${fmt(B - A)} ÷ ${fmt(A)} = ${fmt(p / 100)}.`,
          `Em porcentagem: ${fmt(p / 100)} × 100 = ${p}%.`,
        ],
        macete: "Base da porcentagem = valor inicial. Pense: 'aumentou quanto EM RELAÇÃO AO QUE ERA?'.",
      };
    },
  },

  // ───────────────────────── Juros simples
  {
    id: "juros-simples",
    materia: M,
    tema: "Juros simples",
    nivel: "intermediario",
    altaChance: true,
    gerar(rng) {
      const C = rng.int(10, 100) * 100;
      const i = rng.pick([1, 1.5, 2, 2.5, 3, 4, 5]);
      const t = rng.int(2, 12);
      const J = (C * i * t) / 100;
      const M_ = C + J;
      const pedeMontante = rng.bool();
      const comp = C * (1 + i / 100) ** t;
      const m = pedeMontante
        ? montar(
            rng,
            brl(M_),
            [
              { txt: brl(J), erro: "Esse é só o juro. Montante = capital + juros." },
              { txt: brl(comp), erro: "Você usou juros compostos. A questão é de juros SIMPLES (o juro é igual todo mês)." },
              { txt: brl(C + (C * i) / 100), erro: "Você calculou o juro de um mês só e esqueceu de multiplicar pelo tempo." },
              { txt: brl(C + (C * i * t) / 10), erro: "Você dividiu por 10 em vez de 100 ao usar a taxa." },
            ],
            vizinhos(M_, 50, brl),
          )
        : montar(
            rng,
            brl(J),
            [
              { txt: brl(M_), erro: "Esse é o montante (capital + juros). A pergunta pede só os juros." },
              { txt: brl((C * i) / 100), erro: "Você calculou o juro de um mês só." },
              { txt: brl(comp - C), erro: "Você usou juros compostos." },
              { txt: brl((C * i * t) / 10), erro: "Você dividiu por 10 em vez de 100 ao usar a taxa." },
            ],
            vizinhos(J, 10, brl),
          );
      return {
        enunciado: `Um capital de ${brl(C)} foi aplicado a juros simples de ${fmt(i)}% ao mês durante ${t} meses. ${pedeMontante ? "Qual é o montante ao final da aplicação?" : "Quanto rendeu de juros?"}`,
        ...m,
        explicacao: `J = C × i × t = ${brl(C)} × ${fmt(i / 100, 3)} × ${t} = ${brl(J)}${pedeMontante ? `; M = C + J = ${brl(M_)}` : ""}.`,
        passos: [
          `Fórmula dos juros simples: J = C × i × t (taxa em decimal e no mesmo período do tempo).`,
          `Taxa: ${fmt(i)}% ao mês = ${fmt(i / 100, 3)}. Tempo: ${t} meses (já combina com a taxa).`,
          `Juro de 1 mês: ${brl(C)} × ${fmt(i / 100, 3)} = ${brl((C * i) / 100)}.`,
          `Em ${t} meses: ${brl((C * i) / 100)} × ${t} = ${brl(J)}.`,
          ...(pedeMontante ? [`Montante = capital + juros = ${brl(C)} + ${brl(J)} = ${brl(M_)}.`] : []),
        ],
        macete: "Juros simples: o rendimento é o mesmo todo mês. Calcule 1 mês e multiplique pelo número de meses.",
      };
    },
  },
  {
    id: "juros-taxa-anual",
    materia: M,
    tema: "Juros simples",
    nivel: "avancado",
    altaChance: true,
    gerar(rng) {
      const C = rng.int(5, 60) * 1000;
      const ia = rng.pick([6, 12, 18, 24, 30, 36]);
      const t = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 15, 18]);
      const J = (C * ia * t) / 100 / 12;
      const m = montar(
        rng,
        brl(J),
        [
          { txt: brl((C * ia * t) / 100), erro: "Você usou taxa ANUAL com tempo em MESES sem converter. Taxa e tempo precisam estar na mesma unidade." },
          { txt: brl((C * ia) / 100), erro: "Esse é o juro de um ano inteiro, não do período pedido." },
          { txt: brl(C + J), erro: "Esse é o montante. A pergunta pede só os juros." },
          { txt: brl((C * ia) / 100 / 12), erro: "Esse é o juro de um único mês." },
        ],
        vizinhos(J, 50, brl),
      );
      return {
        enunciado: `Uma dívida de ${brl(C)} será corrigida a juros simples de ${ia}% ao ano. Quanto de juros será cobrado após ${t} meses?`,
        ...m,
        explicacao: `${ia}% ao ano = ${fmt(ia / 12)}% ao mês. J = ${brl(C)} × ${fmt(ia / 12 / 100, 4)} × ${t} = ${brl(J)}.`,
        passos: [
          `Taxa ao ano e tempo em meses: precisam combinar. Converta a taxa: ${ia}% ÷ 12 = ${fmt(ia / 12)}% ao mês.`,
          `Juro de 1 mês: ${brl(C)} × ${fmt(ia / 12)}% = ${brl((C * ia) / 1200)}.`,
          `Em ${t} meses: ${brl((C * ia) / 1200)} × ${t} = ${brl(J)}.`,
        ],
        macete: "Antes de qualquer conta de juros, confira se taxa e tempo estão na mesma unidade. É a pegadinha nº 1.",
      };
    },
  },

  // ───────────────────────── Sistema monetário
  {
    id: "dinheiro-troco",
    materia: M,
    tema: "Sistema monetário",
    nivel: "basico",
    altaChance: false,
    gerar(rng) {
      const itens = rng.shuffle([
        ["resmas de papel", "resma"],
        ["caixas de caneta", "caixa"],
        ["pastas suspensas", "pasta"],
        ["grampeadores", "grampeador"],
        ["blocos de recado", "bloco"],
      ] as const);
      const q1 = rng.int(2, 5);
      const q2 = rng.int(2, 6);
      const p1 = rng.int(150, 1990) / 100;
      const p2 = rng.int(120, 1490) / 100;
      const p1r = Math.round(p1 * 20) / 20;
      const p2r = Math.round(p2 * 20) / 20;
      const total = r(q1 * p1r + q2 * p2r);
      const nota = [50, 100, 200].find((n) => n > total)!;
      const troco = r(nota - total);
      const m = montar(
        rng,
        brl(troco),
        [
          { txt: brl(nota - p1r - p2r), erro: "Você esqueceu de multiplicar os preços pelas quantidades." },
          { txt: brl(total), erro: "Esse é o valor da compra. A pergunta é o troco." },
          { txt: brl(nota - q1 * p1r), erro: `Você esqueceu de incluir as ${itens[1][0]} no total.` },
          { txt: brl(troco + 1), erro: "Erro no 'vai um' ao somar os centavos. Some reais e centavos separados e confira." },
        ],
        vizinhos(troco, 0.5, brl),
      );
      return {
        enunciado: `Para o almoxarifado, foram compradas ${q1} ${itens[0][0]} a ${brl(p1r)} cada e ${q2} ${itens[1][0]} a ${brl(p2r)} cada. O pagamento foi feito com uma cédula de ${brl(nota)}. Qual foi o troco?`,
        ...m,
        explicacao: `Total = ${q1} × ${brl(p1r)} + ${q2} × ${brl(p2r)} = ${brl(total)}. Troco = ${brl(nota)} − ${brl(total)} = ${brl(troco)}.`,
        passos: [
          `${itens[0][0]}: ${q1} × ${brl(p1r)} = ${brl(q1 * p1r)}.`,
          `${itens[1][0]}: ${q2} × ${brl(p2r)} = ${brl(q2 * p2r)}.`,
          `Total da compra: ${brl(q1 * p1r)} + ${brl(q2 * p2r)} = ${brl(total)}.`,
          `Troco: ${brl(nota)} − ${brl(total)} = ${brl(troco)}.`,
        ],
        macete: "Troco rápido: complete até o próximo real e depois até a cédula. Ex.: de 37,40 para 50 → +0,60 (38) +12 = 12,60.",
      };
    },
  },

  // ───────────────────────── Regra de três
  {
    id: "r3-direta",
    materia: M,
    tema: "Regra de três",
    nivel: "basico",
    altaChance: true,
    gerar(rng) {
      const u = rng.int(18, 35) + rng.pick([0, 0.5, 0.9]);
      const q1 = rng.int(2, 8);
      let q2 = rng.int(3, 15);
      if (q2 === q1) q2 += 1;
      const c1 = r(u * q1);
      const res = r(u * q2);
      const m = montar(
        rng,
        brl(res),
        [
          { txt: brl((c1 * q1) / q2), erro: "Você montou como INVERSA. Mais resmas custam MAIS, então é direta." },
          { txt: brl(c1 + (q2 - q1)), erro: "Você somou a diferença de quantidades ao preço. Regra de três é multiplicação e divisão." },
          { txt: brl(c1 * q2), erro: "Você multiplicou cruzado, mas esqueceu de dividir por " + q1 + "." },
          { txt: brl(u), erro: "Esse é o preço de UMA resma. Falta multiplicar pela quantidade pedida." },
        ],
        vizinhos(res, 5, brl),
      );
      return {
        enunciado: `Se ${q1} resmas de papel custam ${brl(c1)}, quanto custam ${q2} resmas do mesmo papel?`,
        ...m,
        explicacao: `Grandezas diretamente proporcionais: ${q1} → ${brl(c1)}; ${q2} → x. x = ${brl(c1)} × ${q2} ÷ ${q1} = ${brl(res)}.`,
        passos: [
          `Monte a tabela: ${q1} resmas — ${brl(c1)}; ${q2} resmas — x.`,
          `Mais resmas → mais dinheiro: as setas vão no mesmo sentido (DIRETA).`,
          `Multiplica cruzado: ${q1} · x = ${q2} · ${brl(c1)}.`,
          `x = ${brl(c1 * q2)} ÷ ${q1} = ${brl(res)}.`,
        ],
        macete: `Caminho mais curto: ache o valor de 1 unidade (${brl(c1)} ÷ ${q1} = ${brl(u)}) e multiplique por ${q2}.`,
      };
    },
  },
  {
    id: "r3-inversa",
    materia: M,
    tema: "Regra de três",
    nivel: "intermediario",
    altaChance: true,
    gerar(rng) {
      let w1 = 0, d1 = 0, w2 = 0, total = 0;
      for (;;) {
        w1 = rng.int(2, 12);
        d1 = rng.int(4, 30);
        total = w1 * d1;
        const divs = [];
        for (let k = 2; k <= 20; k++) if (total % k === 0 && k !== w1) divs.push(k);
        if (divs.length) {
          w2 = rng.pick(divs);
          break;
        }
      }
      const res = total / w2;
      const m = montar(
        rng,
        `${fmt(res)} dias`,
        [
          { txt: `${fmt((w2 * d1) / w1, 1)} dias`, erro: `Você montou como DIRETA. Mais servidores terminam em MENOS dias: é inversa.` },
          { txt: `${fmt(d1 + (w1 - w2))} dias`, erro: "Você somou/subtraiu a diferença de servidores. Proporção é multiplicação e divisão." },
          { txt: `${fmt(total)} dias`, erro: `Você achou o trabalho total (${w1} × ${d1}), mas esqueceu de dividir por ${w2}.` },
          { txt: `${fmt(res + 2)} dias`, erro: "Erro de conta na divisão final." },
        ],
        vizinhos(res, 1, (n) => `${fmt(n)} dias`),
      );
      return {
        enunciado: `${w1} servidores digitalizam o arquivo de um setor em ${d1} dias. Mantido o mesmo ritmo de trabalho, em quantos dias ${w2} servidores fariam o mesmo serviço?`,
        ...m,
        explicacao: `Inversa: servidores × dias é constante. ${w1} × ${d1} = ${total}; ${total} ÷ ${w2} = ${fmt(res)} dias.`,
        passos: [
          `Pergunta-chave: com ${w2 > w1 ? "MAIS" : "MENOS"} servidores, o serviço leva ${w2 > w1 ? "MENOS" : "MAIS"} dias? Sim → INVERSAMENTE proporcional.`,
          `Na inversa, o produto fica constante: ${w1} servidores × ${d1} dias = ${total} "dias de trabalho".`,
          `Divida esse total pelos novos servidores: ${total} ÷ ${w2} = ${fmt(res)} dias.`,
        ],
        macete: "Inversa = multiplica em linha reta (não cruzado). Teste de sanidade: mais gente tem que dar menos dias.",
      };
    },
  },
  {
    id: "r3-composta",
    materia: M,
    tema: "Regra de três",
    nivel: "avancado",
    altaChance: true,
    gerar(rng) {
      let w1 = 0, w2 = 0, h1 = 0, h2 = 0, d1 = 0, d2 = 0, k = 1;
      do {
        w1 = rng.int(2, 10);
        w2 = rng.int(2, 10);
        h1 = rng.pick([4, 5, 6, 8]);
        h2 = rng.pick([4, 5, 6, 8]);
        d1 = rng.int(3, 20);
        d2 = rng.int(3, 20);
        k = rng.pick([1, 2]);
      } while (w1 === w2 || d1 === d2);
      const p1 = w1 * h1 * d1 * k;
      const p2 = w2 * h2 * d2 * k;
      const f = (x: number) => `${fmt(x, 1)} dias`;
      const m = montar(
        rng,
        f(d2),
        [
          { txt: f((d1 * (w2 / w1) * (h1 / h2) * p2) / p1), erro: "Você tratou SERVIDORES como direta. Mais servidores → menos dias (inversa)." },
          { txt: f((d1 * (w1 / w2) * (h2 / h1) * p2) / p1), erro: "Você tratou HORAS POR DIA como direta. Mais horas por dia → menos dias (inversa)." },
          { txt: f((d1 * (w1 / w2) * (h1 / h2) * p1) / p2), erro: "Você tratou PROCESSOS como inversa. Mais processos → mais dias (direta)." },
          { txt: f((d1 * (w2 / w1) * (h2 / h1) * p2) / p1), erro: "Você tratou todas as grandezas como diretas. Compare cada uma com os DIAS separadamente." },
        ],
        vizinhos(d2, 1, f),
      );
      return {
        enunciado: `${w1} servidores, trabalhando ${h1} horas por dia, analisam ${fmt(p1)} processos em ${d1} dias. Em quantos dias ${w2} servidores, trabalhando ${h2} horas por dia, analisarão ${fmt(p2)} processos, no mesmo ritmo?`,
        ...m,
        explicacao: `x = ${d1} × (${w1}/${w2}) × (${h1}/${h2}) × (${fmt(p2)}/${fmt(p1)}) = ${fmt(d2, 1)} dias.`,
        passos: [
          "Coloque DIAS (a incógnita) em destaque e compare cada grandeza só com ela.",
          `Servidores: mais servidores → menos dias → INVERSA → usa ${w1}/${w2}.`,
          `Horas por dia: mais horas → menos dias → INVERSA → usa ${h1}/${h2}.`,
          `Processos: mais processos → mais dias → DIRETA → usa ${fmt(p2)}/${fmt(p1)}.`,
          `x = ${d1} × ${w1}/${w2} × ${h1}/${h2} × ${fmt(p2)}/${fmt(p1)}.`,
          `Numerador: ${fmt(d1 * w1 * h1 * p2)}; denominador: ${fmt(w2 * h2 * p1)}; x = ${fmt(d2, 1)} dias.`,
        ],
        macete: "Simplifique antes de multiplicar: corte fatores comuns entre numerador e denominador e a conta fica pequena.",
      };
    },
  },

  // ───────────────────────── Razão e proporção
  {
    id: "razao-divisao",
    materia: M,
    tema: "Razão e proporção",
    nivel: "intermediario",
    altaChance: true,
    gerar(rng) {
      let a = 0, b = 0;
      do {
        a = rng.int(2, 9);
        b = rng.int(2, 9);
      } while (a === b || mdc(a, b) !== 1);
      const u = rng.int(5, 40) * 10;
      const T = (a + b) * u;
      const maior = Math.max(a, b);
      const menor = Math.min(a, b);
      const res = maior * u;
      const m = montar(
        rng,
        brl(res),
        [
          { txt: brl(T / 2), erro: "Você dividiu igualmente. A divisão é PROPORCIONAL ao tempo de serviço." },
          { txt: brl(menor * u), erro: "Essa é a parte de quem tem MENOS tempo (ou você dividiu de forma inversa)." },
          { txt: brl(u), erro: `Esse é o valor de cada 'parte' da razão (${brl(T)} ÷ ${a + b}). Falta multiplicar por ${maior}.` },
          { txt: brl(T / maior), erro: `Você dividiu o total por ${maior}. O certo é dividir pela SOMA das partes (${a + b}).` },
        ],
        vizinhos(res, u, brl),
      );
      return {
        enunciado: `Um prêmio de ${brl(T)} será dividido entre dois servidores em partes diretamente proporcionais aos seus anos de serviço: ${a} anos e ${b} anos. Quanto receberá o servidor com MAIS tempo de serviço?`,
        ...m,
        explicacao: `Total de partes: ${a} + ${b} = ${a + b}. Cada parte vale ${brl(T)} ÷ ${a + b} = ${brl(u)}. Quem tem ${maior} anos recebe ${maior} × ${brl(u)} = ${brl(res)}.`,
        passos: [
          `Some as partes da razão: ${a} + ${b} = ${a + b} partes.`,
          `Valor de cada parte: ${brl(T)} ÷ ${a + b} = ${brl(u)}.`,
          `O servidor com ${maior} anos fica com ${maior} partes: ${maior} × ${brl(u)} = ${brl(res)}.`,
          `Conferência: ${brl(res)} + ${brl(menor * u)} = ${brl(T)}. ✔`,
        ],
        macete: "Divisão proporcional = 'divide pela soma, multiplica pela parte'.",
      };
    },
  },

  // ───────────────────────── Resolução de problemas
  {
    id: "mmc-onibus",
    materia: M,
    tema: "Resolução de problemas",
    nivel: "intermediario",
    altaChance: true,
    gerar(rng) {
      let a = 0, b = 0;
      do {
        a = rng.pick([6, 8, 10, 12, 15, 18, 20, 24, 30]);
        b = rng.pick([6, 8, 10, 12, 15, 18, 20, 24, 30]);
      } while (a === b || mmc(a, b) === Math.max(a, b) || mmc(a, b) === a * b);
      const h0 = rng.int(6, 8);
      const hora = (min: number) => {
        const t = h0 * 60 + min;
        return `${Math.floor(t / 60)}h${String(t % 60).padStart(2, "0")}`;
      };
      const L = mmc(a, b);
      const m = montar(
        rng,
        hora(L),
        [
          { txt: hora(a * b), erro: `Você multiplicou ${a} × ${b}. Isso dá um encontro, mas não o PRIMEIRO. Use o MMC.` },
          { txt: hora(mdc(a, b)), erro: "Você usou o MDC. Para 'quando voltam a coincidir', o certo é o MMC." },
          { txt: hora(a + b), erro: "Você somou os intervalos. Some não funciona: procure o menor múltiplo comum." },
          { txt: hora(L / 2), erro: "Nesse horário só uma das linhas sai. Confira listando os múltiplos." },
        ],
        (i) => hora(L + i * 5),
      );
      return {
        enunciado: `Duas linhas de ônibus saem juntas de um terminal às ${h0}h00. A primeira sai a cada ${a} minutos e a segunda, a cada ${b} minutos. Qual o próximo horário em que as duas sairão juntas novamente?`,
        ...m,
        explicacao: `O próximo encontro é o MMC(${a}, ${b}) = ${L} minutos depois: ${hora(L)}.`,
        passos: [
          `"Voltam a coincidir" → menor múltiplo comum (MMC).`,
          `Múltiplos de ${a}: ${[1, 2, 3, 4, 5, 6].map((k) => a * k).join(", ")}…`,
          `Múltiplos de ${b}: ${[1, 2, 3, 4, 5, 6].map((k) => b * k).join(", ")}…`,
          `O primeiro em comum é ${L}. Então: ${h0}h00 + ${L} min = ${hora(L)}.`,
        ],
        macete: "Encontro/coincidência → MMC. Dividir em partes iguais do maior tamanho → MDC.",
      };
    },
  },
  {
    id: "fracao-orcamento",
    materia: M,
    tema: "Resolução de problemas",
    nivel: "avancado",
    altaChance: true,
    gerar(rng) {
      const a = rng.pick([2, 3, 4, 5]);
      const [n, d] = rng.pick([[1, 2], [1, 3], [2, 5], [3, 4], [1, 4], [2, 3]] as const);
      const T = a * d * rng.int(5, 60) * 100;
      const resto1 = T - T / a;
      const y = (resto1 * n) / d;
      const sobra = resto1 - y;
      const m = montar(
        rng,
        brl(sobra),
        [
          { txt: brl(T - T / a - (T * n) / d), erro: `Você calculou ${n}/${d} sobre o TOTAL. O enunciado diz "do restante".` },
          { txt: brl(y), erro: "Esse é o valor destinado à reforma, não o que sobrou." },
          { txt: brl(resto1), erro: "Você parou na primeira etapa. Ainda falta tirar a reforma." },
          { txt: brl(T / a), erro: "Esse é o valor gasto com equipamentos." },
        ],
        vizinhos(sobra, 100, brl),
      );
      return {
        enunciado: `Do orçamento de ${brl(T)} de um departamento, 1/${a} foi destinado a equipamentos e ${n}/${d} do restante foi destinado a uma reforma. Quanto sobrou do orçamento?`,
        ...m,
        explicacao: `Equipamentos: ${brl(T / a)}. Restante: ${brl(resto1)}. Reforma: ${n}/${d} de ${brl(resto1)} = ${brl(y)}. Sobra: ${brl(sobra)}.`,
        passos: [
          `Equipamentos: ${brl(T)} ÷ ${a} = ${brl(T / a)}.`,
          `Restante: ${brl(T)} − ${brl(T / a)} = ${brl(resto1)}.`,
          `"${n}/${d} do restante": ${brl(resto1)} ÷ ${d} × ${n} = ${brl(y)}.`,
          `Sobrou: ${brl(resto1)} − ${brl(y)} = ${brl(sobra)}.`,
        ],
        macete: `Atalho: sobra = T × (1 − 1/${a}) × (1 − ${n}/${d}) = ${brl(T)} × ${fracao(a - 1, a)} × ${fracao(d - n, d)}.`,
      };
    },
  },
];
