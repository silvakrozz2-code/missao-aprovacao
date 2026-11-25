// Geradores com números sorteados fora da Matemática: Excel, Linux, unidades de informática,
// cartografia (escala e fuso), séculos, Física e Química do cotidiano.
// Cada semente gera uma questão diferente, sempre com conta conferida e explicação.
import type { Gerador } from "../lib/tipos.ts";
import { fmt, brl, montar, vizinhos } from "../lib/gerar/util.ts";

const COLS = ["A", "B", "C", "D"];

// ───────── Excel
export const excelGen = (materia: string, tema: string): Gerador[] => [
  {
    id: "xl-func", materia, tema, nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const col = rng.pick(COLS), n = rng.int(4, 6);
      const vals = Array.from({ length: n }, () => rng.int(1, 40));
      const fn = rng.pick(["SOMA", "MÉDIA", "MÁXIMO", "MÍNIMO", "CONT.SE", "MAIOR", "SOMASE"] as const);
      const soma = vals.reduce((a, b) => a + b, 0), lim = rng.int(8, 30);
      const ord = [...vals].sort((a, b) => b - a);
      let formula = "", res = 0, expl = "";
      if (fn === "SOMA") { formula = `=SOMA(${col}1:${col}${n})`; res = soma; expl = `${vals.join(" + ")} = ${soma}.`; }
      if (fn === "MÉDIA") { formula = `=MÉDIA(${col}1:${col}${n})`; res = soma / n; expl = `Soma ${soma} ÷ ${n} células = ${fmt(res)}.`; }
      if (fn === "MÁXIMO") { formula = `=MÁXIMO(${col}1:${col}${n})`; res = ord[0]; expl = `O maior valor do intervalo é ${res}.`; }
      if (fn === "MÍNIMO") { formula = `=MÍNIMO(${col}1:${col}${n})`; res = ord.at(-1)!; expl = `O menor valor do intervalo é ${res}.`; }
      if (fn === "CONT.SE") { formula = `=CONT.SE(${col}1:${col}${n};">${lim}")`; res = vals.filter((v) => v > lim).length; expl = `Valores maiores que ${lim}: ${vals.filter((v) => v > lim).join(", ") || "nenhum"} → ${res}.`; }
      if (fn === "MAIOR") { formula = `=MAIOR(${col}1:${col}${n};2)`; res = ord[1]; expl = `Em ordem decrescente: ${ord.join(", ")}. O 2º maior é ${res}.`; }
      if (fn === "SOMASE") { formula = `=SOMASE(${col}1:${col}${n};"<${lim}")`; res = vals.filter((v) => v < lim).reduce((a, b) => a + b, 0); expl = `Soma dos valores menores que ${lim}: ${vals.filter((v) => v < lim).join(" + ") || "0"} = ${res}.`; }
      const m = montar(rng, fmt(res), [
        { txt: fmt(soma), erro: "Esse é o total do intervalo (SOMA), não o que a função pede." },
        { txt: fmt(soma / n), erro: "Essa é a média do intervalo." },
        { txt: fmt(ord[0]), erro: "Esse é o maior valor (MÁXIMO)." },
        { txt: fmt(ord.at(-1)!), erro: "Esse é o menor valor (MÍNIMO)." },
        { txt: fmt(n), erro: "Essa é a quantidade de células do intervalo." },
      ], vizinhos(res, 1, fmt, -1));
      return {
        enunciado: `Em uma planilha do Excel 2016, as células ${col}1 a ${col}${n} contêm, nessa ordem, os valores ${vals.join(", ")}. Qual é o resultado da fórmula ${formula}?`,
        ...m, explicacao: expl,
        passos: [`Identifique o intervalo ${col}1:${col}${n}: ${vals.join(", ")}.`, `Aplique a função ${fn}.`, expl],
      };
    },
  },
  {
    id: "xl-prec", materia, tema, nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const a = rng.int(2, 12), b = rng.int(2, 9), c = rng.int(2, 6), d = rng.pick([2, 4, 5, 10]);
      const tipo = rng.int(0, 2);
      let f = "", res = 0, errado = 0, expl = "";
      if (tipo === 0) { f = `=A1+B1*C1`; res = a + b * c; errado = (a + b) * c; expl = `Multiplicação antes da soma: ${b}*${c} = ${b * c}; ${a} + ${b * c} = ${res}.`; }
      if (tipo === 1) { f = `=(A1+B1)*C1`; res = (a + b) * c; errado = a + b * c; expl = `Parênteses primeiro: ${a}+${b} = ${a + b}; × ${c} = ${res}.`; }
      if (tipo === 2) { f = `=A1*B1-C1^2`; res = a * b - c ** 2; errado = (a * b - c) ** 2; expl = `Potência primeiro: ${c}^2 = ${c ** 2}; ${a}*${b} = ${a * b}; ${a * b} − ${c ** 2} = ${res}.`; }
      const m = montar(rng, fmt(res), [
        { txt: fmt(errado), erro: "Você ignorou a ordem das operações (potência, depois multiplicação/divisão, depois soma/subtração)." },
        { txt: fmt(a + b + c), erro: "Você somou tudo, sem respeitar os operadores." },
        { txt: fmt(res + d), erro: "Conta com valor a mais: refaça com calma." },
        { txt: fmt(a * b * c), erro: "Você multiplicou tudo." },
      ], vizinhos(res, 2, fmt, -1000));
      return {
        enunciado: `No Excel 2016, A1 = ${a}, B1 = ${b} e C1 = ${c}. Qual é o resultado da fórmula ${f}?`,
        ...m, explicacao: expl, macete: "Ordem do Excel: ( ) → ^ → * e / → + e −.",
      };
    },
  },
  {
    id: "xl-ref", materia, tema, nivel: "avancado", altaChance: true,
    gerar(rng) {
      const taxa = rng.int(2, 9), linhas = rng.int(3, 6);
      const vals = Array.from({ length: linhas }, () => rng.int(10, 90));
      const k = rng.int(2, linhas);
      const res = vals[k - 1] * taxa;
      const m = montar(rng, fmt(res), [
        { txt: fmt(vals[0] * taxa), erro: "Você manteve A1 fixo. Sem $, a referência relativa A1 vira A" + k + " ao copiar." },
        { txt: fmt(vals[k - 1]), erro: "Você esqueceu de multiplicar pelo valor de $E$1." },
        { txt: "0", erro: "Você deslocou também o $E$1, que é absoluto e não muda." },
        { txt: fmt(vals[0] + taxa), erro: "Você somou em vez de multiplicar." },
      ], vizinhos(res, taxa, fmt));
      return {
        enunciado: `Na planilha, a coluna A (A1 a A${linhas}) tem os valores ${vals.join(", ")} e a célula E1 tem ${taxa}. Em B1 foi digitada a fórmula =A1*$E$1, que depois foi copiada para baixo até B${linhas}. Qual valor aparece em B${k}?`,
        ...m,
        explicacao: `Ao copiar para B${k}, A1 (relativa) vira A${k} e $E$1 (absoluta) continua E1: ${vals[k - 1]} × ${taxa} = ${res}.`,
        passos: ["Referência relativa (A1) acompanha a cópia.", "Referência absoluta ($E$1) fica travada.", `B${k} = A${k} * E1 = ${vals[k - 1]} × ${taxa} = ${res}.`],
      };
    },
  },
  {
    id: "xl-se", materia, tema, nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const nota = rng.int(20, 100), corte = rng.pick([50, 60, 70]);
      const sim = rng.pick(["Aprovado", "Classificado", "Apto"]), nao = { Aprovado: "Reprovado", Classificado: "Eliminado", Apto: "Inapto" }[sim]!;
      const op = rng.pick([">=", ">", "<"] as const);
      const cond = op === ">=" ? nota >= corte : op === ">" ? nota > corte : nota < corte;
      const res = cond ? sim : nao;
      const outro = cond ? nao : sim;
      return {
        enunciado: `No Excel 2016, a célula B2 contém ${nota}. Qual é o resultado da fórmula =SE(B2${op}${corte};"${sim}";"${nao}")?`,
        ...montar(rng, res, [
          { txt: outro, erro: `Teste: ${nota} ${op} ${corte} é ${cond ? "VERDADEIRO" : "FALSO"}, então vale o ${cond ? "segundo" : "terceiro"} argumento.` },
          { txt: cond ? "VERDADEIRO" : "FALSO", erro: "O SE devolve o texto do argumento escolhido, não o valor lógico do teste." },
          { txt: "#VALOR!", erro: "A fórmula está correta; não há erro de tipo." },
          { txt: "#NOME?", erro: "A função SE existe e está escrita corretamente." },
        ]),
        explicacao: `${nota} ${op} ${corte}? ${cond ? "Sim" : "Não"}. Resultado: "${res}".`,
        macete: "=SE(teste; se verdadeiro; se falso).",
      };
    },
  },
];

// ───────── Linux: permissões
const RWX = (d: number) => `${d & 4 ? "r" : "-"}${d & 2 ? "w" : "-"}${d & 1 ? "x" : "-"}`;
export const linuxGen = (materia: string, tema: string): Gerador[] => [
  {
    id: "lx-chmod", materia, tema, nivel: "avancado", altaChance: false,
    gerar(rng) {
      const ds = [rng.pick([7, 6, 5]), rng.pick([7, 6, 5, 4, 0]), rng.pick([5, 4, 0, 1])];
      const num = ds.join(""), str = ds.map(RWX).join("");
      const inv = rng.bool();
      const errS = (x: number[]) => x.map(RWX).join("");
      if (inv)
        return {
          enunciado: `No Linux Ubuntu, após o comando chmod ${num} arquivo.sh, as permissões do arquivo (dono, grupo e outros) ficam:`,
          ...montar(rng, str, [
            { txt: errS([...ds].reverse()), erro: "A ordem é dono, grupo, outros — você inverteu." },
            { txt: errS(ds.map((d) => 7 - d)), erro: "Você trocou o que é permitido pelo que é negado." },
            { txt: errS([ds[0], ds[0], ds[0]]), erro: "Cada dígito vale para um grupo diferente." },
            { txt: errS([7, 7, 7]), erro: "777 seria permissão total para todos." },
            { txt: errS([ds[0], ds[2], ds[1]]), erro: "Grupo e outros foram trocados." },
          ], (i) => errS([ds[0], (ds[1] + i) % 8, ds[2]])),
          explicacao: `r = 4, w = 2, x = 1. ${ds.map((d) => `${d} = ${RWX(d)}`).join("; ")}.`,
          macete: "r=4, w=2, x=1. 7 = rwx, 6 = rw-, 5 = r-x, 4 = r--.",
        };
      return {
        enunciado: `No Linux, um arquivo deve ficar com as permissões ${str} (dono, grupo, outros). Qual comando faz isso?`,
        ...montar(rng, `chmod ${num}`, [
          { txt: `chmod ${[...ds].reverse().join("")}`, erro: "A ordem é dono, grupo, outros." },
          { txt: `chmod ${ds.map((d) => 7 - d).join("")}`, erro: "Você contou o que é negado." },
          { txt: `chown ${num}`, erro: "chown muda o DONO, não as permissões." },
          { txt: `chmod 777`, erro: "777 dá permissão total a todos." },
          { txt: `chmod ${ds.map((d) => (d === 7 ? 7 : d + 1)).join("")}`, erro: "Some r=4, w=2 e x=1 para cada grupo." },
        ], (i) => `chmod ${ds[0]}${(ds[1] + i) % 8}${ds[2]}`),
        explicacao: `${ds.map((d) => `${RWX(d)} = ${d}`).join("; ")} → chmod ${num}.`,
        macete: "r=4, w=2, x=1.",
      };
    },
  },
];

// ───────── Unidades de informática
export const unidadesGen = (materia: string, tema: string): Gerador[] => [
  {
    id: "un-conv", materia, tema, nivel: "intermediario", altaChance: false,
    gerar(rng) {
      const tipo = rng.int(0, 2);
      if (tipo === 0) {
        const gb = rng.pick([2, 4, 8, 16, 32, 64]), foto = rng.pick([2, 4, 8]);
        const res = (gb * 1024) / foto;
        return {
          enunciado: `Um pen drive de ${gb} GB está vazio. Quantos arquivos de ${foto} MB cabem nele, considerando 1 GB = 1024 MB?`,
          ...montar(rng, fmt(res), [
            { txt: fmt((gb * 1000) / foto), erro: "Use 1 GB = 1024 MB, como pede o enunciado." },
            { txt: fmt(gb / foto), erro: "Você não converteu GB para MB." },
            { txt: fmt(gb * 1024 * foto), erro: "Você multiplicou pelo tamanho do arquivo em vez de dividir." },
            { txt: fmt(res / 2), erro: "Confira a divisão." },
          ], vizinhos(res, 64, fmt)),
          explicacao: `${gb} × 1024 = ${gb * 1024} MB; ${gb * 1024} ÷ ${foto} = ${fmt(res)} arquivos.`,
        };
      }
      if (tipo === 1) {
        const mbps = rng.pick([10, 20, 40, 50, 80, 100]), mb = rng.pick([50, 100, 200, 300, 500, 1000]);
        const seg = (mb * 8) / mbps;
        return {
          enunciado: `Uma conexão transmite ${mbps} Mbps (megabits por segundo). Desprezando perdas, quanto tempo leva para baixar um arquivo de ${mb} MB (megabytes)?`,
          ...montar(rng, `${fmt(seg)} segundos`, [
            { txt: `${fmt(mb / mbps)} segundos`, erro: "Você esqueceu que 1 byte = 8 bits: MB precisa virar Mb (× 8)." },
            { txt: `${fmt((mb * mbps) / 8)} segundos`, erro: "Você multiplicou pela velocidade em vez de dividir." },
            { txt: `${fmt(seg * 8)} segundos`, erro: "Você multiplicou por 8 duas vezes." },
            { txt: `${fmt(seg / 60)} segundos`, erro: "Você converteu para minutos sem trocar a unidade." },
          ], (i) => `${fmt(seg + i * 3)} segundos`),
          explicacao: `${mb} MB × 8 = ${mb * 8} Mb; ${mb * 8} ÷ ${mbps} = ${fmt(seg)} s.`,
          macete: "B maiúsculo = byte; b minúsculo = bit. 1 byte = 8 bits.",
        };
      }
      const bits = rng.pick([8, 16, 32, 64, 128, 256]) * rng.pick([1, 8, 1024]);
      const bytes = bits / 8;
      return {
        enunciado: `Quantos bytes correspondem a ${fmt(bits)} bits?`,
        ...montar(rng, fmt(bytes), [
          { txt: fmt(bits * 8), erro: "Para ir de bits para bytes, DIVIDA por 8." },
          { txt: fmt(bits / 1024), erro: "1 byte = 8 bits, não 1024." },
          { txt: fmt(bits / 2), erro: "Divida por 8." },
          { txt: fmt(bits / 4), erro: "Divida por 8." },
        ], vizinhos(bytes, 8, fmt)),
        explicacao: `1 byte = 8 bits: ${fmt(bits)} ÷ 8 = ${fmt(bytes)} bytes.`,
      };
    },
  },
];

// ───────── Cartografia
export const cartografiaGen = (materia: string, tema: string): Gerador[] => [
  {
    id: "geo-escala", materia, tema, nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const esc = rng.pick([25000, 50000, 100000, 250000, 500000, 1000000, 2000000, 5000000]);
      const cm = rng.pick([2, 3, 4, 5, 6, 7, 8, 12, 15]);
      const km = (cm * esc) / 100000;
      if (rng.bool(0.65))
        return {
          enunciado: `Em um mapa de escala 1:${fmt(esc, 0)}, a distância entre duas cidades é de ${cm} cm. Qual é a distância real?`,
          ...montar(rng, `${fmt(km)} km`, [
            { txt: `${fmt(km * 10)} km`, erro: "Erro na conversão: 1 km = 100.000 cm." },
            { txt: `${fmt(km / 10)} km`, erro: "Erro na conversão: 1 km = 100.000 cm." },
            { txt: `${fmt(cm * esc)} km`, erro: "Você não converteu centímetros em quilômetros." },
            { txt: `${fmt(km * 100)} km`, erro: "Você converteu cm em m, e não em km." },
          ], (i) => `${fmt(km + i * cm)} km`),
          explicacao: `${cm} cm × ${fmt(esc, 0)} = ${fmt(cm * esc, 0)} cm = ${fmt(km)} km.`,
          passos: ["Escala 1:E → 1 cm no mapa = E cm no real.", `${cm} × ${fmt(esc, 0)} = ${fmt(cm * esc, 0)} cm.`, `÷ 100.000 (cm → km) = ${fmt(km)} km.`],
          macete: "Para passar de cm para km, corte cinco zeros.",
        };
      return {
        enunciado: `Duas cidades distam ${fmt(km)} km na realidade e ${cm} cm em um mapa. Qual é a escala do mapa?`,
        ...montar(rng, `1:${fmt(esc, 0)}`, [
          { txt: `1:${fmt(esc * 10, 0)}`, erro: "Confira a conversão de km para cm (× 100.000)." },
          { txt: `1:${fmt(esc / 10, 0)}`, erro: "Confira a conversão de km para cm (× 100.000)." },
          { txt: `1:${fmt(esc * cm, 0)}`, erro: "Você multiplicou pela distância do mapa em vez de dividir." },
          { txt: `1:${fmt(km, 0)}`, erro: "Escala exige as duas medidas na mesma unidade." },
        ], (i) => `1:${fmt(esc + i * 1000, 0)}`),
        explicacao: `${fmt(km)} km = ${fmt(km * 100000, 0)} cm; ÷ ${cm} = ${fmt(esc, 0)} → 1:${fmt(esc, 0)}.`,
      };
    },
  },
  {
    id: "geo-fuso", materia, tema, nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const lugares: [string, number][] = [["Londres (GMT 0)", 0], ["Lisboa (GMT 0)", 0], ["Paris (GMT +1)", 1], ["Berlim (GMT +1)", 1], ["Moscou (GMT +3)", 3], ["Dubai (GMT +4)", 4], ["Pequim (GMT +8)", 8], ["Tóquio (GMT +9)", 9], ["Nova York (GMT −5)", -5], ["Los Angeles (GMT −8)", -8], ["Cidade do México (GMT −6)", -6], ["Manaus (GMT −4)", -4], ["Rio Branco (GMT −5)", -5]];
      const [nome, gmt] = rng.pick(lugares);
      const h = rng.int(0, 23), dif = gmt - -3;
      const res = (((h + dif) % 24) + 24) % 24;
      const hh = (x: number) => `${String(((x % 24) + 24) % 24).padStart(2, "0")}h`;
      return {
        enunciado: `Quando são ${hh(h)} em Brasília (GMT −3), que horas são em ${nome}? (Desconsidere horário de verão.)`,
        ...montar(rng, hh(res), [
          { txt: hh(h - dif), erro: "Você inverteu o sentido: a leste as horas são adiantadas, a oeste atrasadas." },
          { txt: hh(h + gmt), erro: "Você esqueceu que Brasília já está em GMT −3." },
          { txt: hh(h + dif + 1), erro: "Diferença errada em 1 hora: conte os fusos com cuidado." },
          { txt: hh(h + dif - 1), erro: "Diferença errada em 1 hora." },
        ], (i) => hh(res + i + 2)),
        explicacao: `Diferença: (${gmt}) − (−3) = ${dif >= 0 ? "+" : ""}${dif} h. ${hh(h)} ${dif >= 0 ? "+" : "−"} ${Math.abs(dif)} h = ${hh(res)}.`,
        macete: "Leste: soma horas (o sol nasce antes). Oeste: subtrai.",
      };
    },
  },
];

// ───────── História: século
const ROM = (n: number) => { const t: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let s = ""; for (const [v, r] of [[20, "XX"], ...t] as [number, string][]) while (n >= v) { s += r; n -= v; } return s; };
export const seculoGen = (materia: string, tema: string): Gerador[] => [
  {
    id: "hist-sec", materia, tema, nivel: "basico", altaChance: false,
    gerar(rng) {
      const fatos: [string, number][] = [["a chegada da esquadra de Cabral ao Brasil", 1500], ["a fundação de Salvador", 1549], ["a fundação de Curitiba como vila", 1693], ["a Inconfidência Mineira", 1789], ["a chegada da família real ao Brasil", 1808], ["a Independência do Brasil", 1822], ["a abolição da escravidão", 1888], ["a Proclamação da República", 1889], ["a Revolução de 1930", 1930], ["a criação da Petrobras", 1953], ["a promulgação da Constituição de 1988", 1988], ["a Guerra do Paraguai (início)", 1864], ["a Revolta de Canudos (fim)", 1897], ["a Semana de Arte Moderna", 1922]];
      const [fato, ano] = rng.pick(fatos);
      const sec = Math.ceil(ano / 100);
      return {
        enunciado: `${fato[0].toUpperCase() + fato.slice(1)} ocorreu em ${ano}. Esse ano pertence a qual século?`,
        ...montar(rng, `Século ${ROM(sec)}`, [
          { txt: `Século ${ROM(sec - 1)}`, erro: `Você pegou só os dois primeiros dígitos (${Math.floor(ano / 100)}). Anos de ${(sec - 1) * 100 + 1} a ${sec * 100} são do século ${ROM(sec)}.` },
          { txt: `Século ${ROM(sec + 1)}`, erro: "Você somou 1 sem necessidade." },
          { txt: `Século ${ROM(sec - 2)}`, erro: "Confira a conta: século = centena + 1 (se o ano não terminar em 00)." },
          { txt: `Século ${ROM(sec + 2)}`, erro: "Confira a conta do século." },
        ]),
        explicacao: `${ano}: ${ano % 100 === 0 ? `termina em 00, então é o século ${ROM(sec)}` : `${Math.floor(ano / 100)} + 1 = ${sec}`} → século ${ROM(sec)}.`,
        macete: "Corte os dois últimos dígitos e some 1 (se terminar em 00, não soma).",
      };
    },
  },
];

// ───────── Física e Química do cotidiano (ENEM)
export const fisicaGen = (materia: string, tema: string): Gerador[] => [
  {
    id: "fis-vm", materia, tema, nivel: "basico", altaChance: true,
    gerar(rng) {
      const v = rng.pick([40, 50, 60, 72, 80, 90, 100]), t = rng.pick([1.5, 2, 2.5, 3, 4]);
      const d = v * t;
      return {
        enunciado: `Um ônibus percorre ${fmt(d)} km em ${fmt(t)} h. Qual foi sua velocidade média?`,
        ...montar(rng, `${fmt(v)} km/h`, [
          { txt: `${fmt(d * t)} km/h`, erro: "Velocidade média = distância ÷ tempo, não ×." },
          { txt: `${fmt(v / 3.6)} km/h`, erro: "Você converteu para m/s sem trocar a unidade." },
          { txt: `${fmt(t / d * 100)} km/h`, erro: "Você inverteu a divisão." },
          { txt: `${fmt(v + 10)} km/h`, erro: "Refaça a divisão." },
        ], (i) => `${fmt(v + i * 5)} km/h`),
        explicacao: `v = d/t = ${fmt(d)} ÷ ${fmt(t)} = ${fmt(v)} km/h.`,
      };
    },
  },
  {
    id: "fis-conv", materia, tema, nivel: "basico", altaChance: false,
    gerar(rng) {
      const kmh = rng.pick([18, 36, 54, 72, 90, 108, 144]);
      return {
        enunciado: `Um carro está a ${kmh} km/h. Essa velocidade, em m/s, vale:`,
        ...montar(rng, `${fmt(kmh / 3.6)} m/s`, [
          { txt: `${fmt(kmh * 3.6)} m/s`, erro: "De km/h para m/s, DIVIDE-se por 3,6." },
          { txt: `${fmt(kmh / 60)} m/s`, erro: "Use o fator 3,6 (1000 m ÷ 3600 s)." },
          { txt: `${fmt(kmh / 1000)} m/s`, erro: "Use o fator 3,6." },
          { txt: `${fmt(kmh / 36)} m/s`, erro: "O fator é 3,6, não 36." },
        ]),
        explicacao: `${kmh} ÷ 3,6 = ${fmt(kmh / 3.6)} m/s.`,
        macete: "km/h → m/s: ÷ 3,6. m/s → km/h: × 3,6.",
      };
    },
  },
  {
    id: "fis-kwh", materia, tema, nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const [ap, w] = rng.pick([["Um chuveiro elétrico", 5000], ["Um chuveiro elétrico", 4400], ["Um ferro de passar", 1000], ["Um micro-ondas", 1200], ["Um secador de cabelo", 2000], ["Um ar-condicionado", 1500], ["Uma lâmpada LED", 10]] as [string, number][]);
      const h = ap === "Uma lâmpada LED" ? rng.pick([6, 8, 10]) : rng.pick([0.5, 1, 2, 3]);
      const dias = 30, tarifa = rng.pick([0.6, 0.8, 0.9, 1]);
      const kwh = (w / 1000) * h * dias, custo = kwh * tarifa;
      return {
        enunciado: `${ap} de ${fmt(w)} W fica ligad${ap.startsWith("Uma") ? "a" : "o"} ${fmt(h)} h por dia durante ${dias} dias. Com tarifa de ${brl(tarifa)} por kWh, o custo mensal desse aparelho é de:`,
        ...montar(rng, brl(custo), [
          { txt: brl(w * h * dias * tarifa), erro: "Você não converteu W para kW (÷ 1000)." },
          { txt: brl((w / 1000) * h * tarifa), erro: "Faltou multiplicar pelos 30 dias." },
          { txt: brl(kwh), erro: "Esse é o consumo em kWh, falta multiplicar pela tarifa." },
          { txt: brl(custo * 2), erro: "Confira a conta." },
        ], (i) => brl(custo + i * 3)),
        explicacao: `Energia = P × t = ${fmt(w / 1000, 3)} kW × ${fmt(h)} h × ${dias} = ${fmt(kwh)} kWh. Custo = ${fmt(kwh)} × ${brl(tarifa)} = ${brl(custo)}.`,
        passos: [`Potência em kW: ${fmt(w)} ÷ 1000 = ${fmt(w / 1000, 3)} kW.`, `Horas no mês: ${fmt(h)} × ${dias} = ${fmt(h * dias)} h.`, `Energia: ${fmt(kwh)} kWh.`, `Custo: ${brl(custo)}.`],
      };
    },
  },
  {
    id: "fis-ohm", materia, tema, nivel: "intermediario", altaChance: false,
    gerar(rng) {
      const r = rng.pick([2, 4, 5, 10, 20, 22, 50]), i = rng.pick([0.5, 1, 2, 3, 5, 10]);
      const u = r * i, p = u * i;
      const pedeP = rng.bool();
      return {
        enunciado: pedeP ? `Um resistor de ${fmt(r)} Ω é percorrido por corrente de ${fmt(i)} A. Qual a potência dissipada?` : `Um resistor de ${fmt(r)} Ω é percorrido por corrente de ${fmt(i)} A. Qual a tensão entre seus terminais?`,
        ...montar(rng, pedeP ? `${fmt(p)} W` : `${fmt(u)} V`, pedeP
          ? [{ txt: `${fmt(u)} W`, erro: "Essa é a tensão (U = R·i); a potência é P = U·i = R·i²." }, { txt: `${fmt(r * i * 2)} W`, erro: "É i ao quadrado, não i × 2." }, { txt: `${fmt(r / i)} W`, erro: "P = R·i²." }, { txt: `${fmt(p * 2)} W`, erro: "Confira a conta." }]
          : [{ txt: `${fmt(r / i)} V`, erro: "U = R × i, não R ÷ i." }, { txt: `${fmt(i / r)} V`, erro: "U = R × i." }, { txt: `${fmt(p)} V`, erro: "Isso é potência (R·i²)." }, { txt: `${fmt(r + i)} V`, erro: "Multiplique, não some." }],
          (k) => `${fmt((pedeP ? p : u) + k * 2)} ${pedeP ? "W" : "V"}`),
        explicacao: pedeP ? `P = R·i² = ${fmt(r)} × ${fmt(i * i)} = ${fmt(p)} W.` : `U = R·i = ${fmt(r)} × ${fmt(i)} = ${fmt(u)} V.`,
      };
    },
  },
  {
    id: "fis-dens", materia, tema, nivel: "basico", altaChance: false,
    gerar(rng) {
      const d = rng.pick([0.8, 1, 1.2, 2.7, 7.8, 11.3]), v = rng.pick([10, 20, 50, 100, 250]);
      const m = d * v;
      return {
        enunciado: `Um objeto tem massa de ${fmt(m)} g e volume de ${fmt(v)} cm³. Qual é sua densidade?`,
        ...montar(rng, `${fmt(d)} g/cm³`, [
          { txt: `${fmt(m * v)} g/cm³`, erro: "Densidade = massa ÷ volume." },
          { txt: `${fmt(v / m, 3)} g/cm³`, erro: "Você inverteu: é massa ÷ volume." },
          { txt: `${fmt(m - v)} g/cm³`, erro: "Divida, não subtraia." },
          { txt: `${fmt(d * 10)} g/cm³`, erro: "Confira as casas decimais." },
        ], (k) => `${fmt(d + k * 0.5)} g/cm³`),
        explicacao: `d = m/V = ${fmt(m)} ÷ ${fmt(v)} = ${fmt(d)} g/cm³.${d < 1 ? " Menor que 1: flutua na água." : d > 1 ? " Maior que 1: afunda na água." : ""}`,
      };
    },
  },
];

export const quimicaGen = (materia: string, tema: string): Gerador[] => [
  {
    id: "qui-conc", materia, tema, nivel: "intermediario", altaChance: true,
    gerar(rng) {
      const g = rng.pick([5, 10, 20, 30, 40, 60]), l = rng.pick([0.5, 1, 2, 4, 5]);
      const c = g / l;
      return {
        enunciado: `Dissolvem-se ${fmt(g)} g de sal em água até completar ${fmt(l)} L de solução. Qual é a concentração comum?`,
        ...montar(rng, `${fmt(c)} g/L`, [
          { txt: `${fmt(g * l)} g/L`, erro: "C = massa ÷ volume." },
          { txt: `${fmt(l / g, 3)} g/L`, erro: "Você inverteu a divisão." },
          { txt: `${fmt(c / 1000, 3)} g/L`, erro: "O volume já está em litros; não converta." },
          { txt: `${fmt(c * 2)} g/L`, erro: "Confira a divisão." },
        ], (k) => `${fmt(c + k * 5)} g/L`),
        explicacao: `C = m/V = ${fmt(g)} ÷ ${fmt(l)} = ${fmt(c)} g/L.`,
      };
    },
  },
  {
    id: "qui-dil", materia, tema, nivel: "avancado", altaChance: true,
    gerar(rng) {
      const c1 = rng.pick([10, 20, 40, 60, 80]), v1 = rng.pick([100, 200, 250, 500]), fator = rng.pick([2, 4, 5]);
      const v2 = v1 * fator, c2 = c1 / fator;
      return {
        enunciado: `Uma solução de ${fmt(c1)} g/L, com ${fmt(v1)} mL, é diluída com água até ${fmt(v2)} mL. Qual a nova concentração?`,
        ...montar(rng, `${fmt(c2)} g/L`, [
          { txt: `${fmt(c1 * fator)} g/L`, erro: "Diluir DIMINUI a concentração: C1·V1 = C2·V2." },
          { txt: `${fmt(c1 - fator)} g/L`, erro: "Use C1·V1 = C2·V2." },
          { txt: `${fmt(c1)} g/L`, erro: "Ao acrescentar água, a concentração muda." },
          { txt: `${fmt((c1 * v1) / (v2 + v1))} g/L`, erro: "O volume final já é " + fmt(v2) + " mL; não some o inicial de novo." },
        ], (k) => `${fmt(c2 + k)} g/L`),
        explicacao: `C1·V1 = C2·V2 → ${fmt(c1)} × ${fmt(v1)} = C2 × ${fmt(v2)} → C2 = ${fmt(c2)} g/L.`,
      };
    },
  },
];
