// Treino de contas: trilhas separadas por operação, níveis do mais fácil ao mais difícil.
// Cada nível gera contas novas toda vez (nada de decorar a resposta) e tem tempo próprio por conta.
// Uma conta é { exp: [tokens], resp: {n, d}, forma?: "irredutivel", dica }.
// Token: string (número ou operador) | { f: [n, d] } (fração empilhada) | { raiz: tokens, i?: 3 } | { pot: [base, exp] }.

const mdc = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const R = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mdc(n, d); return { n: n / g, d: d / g }; };
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fmt = (x) => {
  const s = String(Math.round(x * 1e6) / 1e6).replace(".", ",").replace("-", "−");
  const [i, d] = s.split(","); return i.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (d ? "," + d : "");
};
// decimal com casas fixas -> fração exata (evita erro de ponto flutuante)
const dec = (inteiroX100) => R(inteiroX100, 100);
const fmtDec = (x100) => fmt(x100 / 100);

const conta = (exp, resp, extra = {}) => ({ exp, resp: typeof resp === "number" ? R(Math.round(resp * 1e6), 1e6) : resp, ...extra });
const op = (a, s, b, r, extra) => conta([fmt(a), s, fmt(b)], r, extra);

/* ───────── Soma */
const soma = [
  { nome: "Até 10", t: 6, gen: () => { const a = ri(1, 9), b = ri(1, 10 - a); return op(a, "+", b, a + b); } },
  { nome: "Passando do 10", t: 6, gen: () => { const a = ri(3, 9), b = ri(11 - a, 9); return op(a, "+", b, a + b, { dica: `Complete o 10: ${a} + ${10 - a} = 10, sobra ${b - (10 - a)}.` }); } },
  { nome: "Dezena + unidade", t: 7, gen: () => { const a = ri(11, 89), b = ri(2, 9); return op(a, "+", b, a + b); } },
  { nome: "Dezenas redondas", t: 6, gen: () => { const a = ri(1, 9) * 10, b = ri(1, 9) * 10; return op(a, "+", b, a + b); } },
  { nome: "Dois dígitos", t: 9, gen: () => { const a = ri(12, 69), b = ri(12, 99 - a); return op(a, "+", b, a + b, { dica: "Some as dezenas primeiro, depois as unidades." }); } },
  { nome: "Dois dígitos com vai-um", t: 10, gen: () => { let a, b; do { a = ri(15, 79); b = ri(15, 79); } while ((a % 10) + (b % 10) < 10); return op(a, "+", b, a + b, { dica: `Arredonde: ${b} vira ${Math.ceil(b / 10) * 10}, depois tire ${Math.ceil(b / 10) * 10 - b}.` }); } },
  { nome: "Três parcelas", t: 11, gen: () => { const a = ri(4, 29), b = ri(4, 29), c = ri(4, 29); return conta([fmt(a), "+", fmt(b), "+", fmt(c)], a + b + c, { dica: "Procure pares que fecham dezena." }); } },
  { nome: "Centenas", t: 10, gen: () => { const a = ri(11, 89) * 10, b = ri(11, 89) * 10; return op(a, "+", b, a + b); } },
  { nome: "Três dígitos", t: 14, gen: () => { const a = ri(120, 799), b = ri(110, 899); return op(a, "+", b, a + b, { dica: "Centenas, dezenas, unidades: uma casa de cada vez, da esquerda para a direita." }); } },
  { nome: "Milhares", t: 15, gen: () => { const a = ri(1100, 6900), b = ri(1100, 2900); return op(a, "+", b, a + b); } },
];

/* ───────── Subtração */
const subtracao = [
  { nome: "Até 10", t: 6, gen: () => { const a = ri(3, 10), b = ri(1, a - 1); return op(a, "−", b, a - b); } },
  { nome: "Até 20", t: 7, gen: () => { const a = ri(11, 19), b = ri(2, 9); return op(a, "−", b, a - b, { dica: `Desça até o 10 e continue: ${a} − ${a - 10} = 10.` }); } },
  { nome: "Dezenas redondas", t: 6, gen: () => { const a = ri(3, 9) * 10, b = ri(1, a / 10 - 1) * 10; return op(a, "−", b, a - b); } },
  { nome: "Dezena − unidade", t: 8, gen: () => { const a = ri(21, 99), b = ri(3, 9); return op(a, "−", b, a - b); } },
  { nome: "Dois dígitos", t: 9, gen: () => { const a = ri(40, 99), b = ri(11, a - 10); return op(a, "−", b, a - b, { dica: "Tire as dezenas, depois as unidades." }); } },
  { nome: "Quanto falta para 100", t: 8, gen: () => { const b = ri(11, 89); return op(100, "−", b, 100 - b, { dica: "Quanto falta para a próxima dezena, mais as dezenas até 100." }); } },
  { nome: "Com empréstimo", t: 10, gen: () => { let a, b; do { a = ri(41, 99); b = ri(12, a - 5); } while (a % 10 >= b % 10); return op(a, "−", b, a - b, { dica: `Arredonde: tire ${Math.ceil(b / 10) * 10} e devolva ${Math.ceil(b / 10) * 10 - b}.` }); } },
  { nome: "Centenas", t: 10, gen: () => { const a = ri(30, 99) * 10, b = ri(11, a / 10 - 5) * 10; return op(a, "−", b, a - b); } },
  { nome: "Três dígitos", t: 14, gen: () => { const a = ri(400, 999), b = ri(111, a - 50); return op(a, "−", b, a - b, { dica: "Conte para cima: do menor até o maior." }); } },
  { nome: "Troco de 1.000", t: 12, gen: () => { const b = ri(101, 989); return op(1000, "−", b, 1000 - b, { dica: "Cada casa completa 9, a última completa 10." }); } },
];

/* ───────── Multiplicação */
const multiplicacao = [
  { nome: "Tabuada do 2 ao 5", t: 6, gen: () => { const a = ri(2, 5), b = ri(2, 10); return op(b, "×", a, a * b); } },
  { nome: "Tabuada do 6 ao 9", t: 7, gen: () => { const a = ri(6, 9), b = ri(3, 10); return op(b, "×", a, a * b, { dica: a === 9 ? `${b} × 9 = ${b} × 10 − ${b}.` : undefined }); } },
  { nome: "Tabuada salteada", t: 6, gen: () => { const a = ri(3, 9), b = ri(3, 9); return op(a, "×", b, a * b); } },
  { nome: "Vezes 10, 100, 1.000", t: 6, gen: () => { const a = ri(2, 99), b = pick([10, 100, 1000]); return op(a, "×", b, a * b, { dica: "Junte os zeros no fim." }); } },
  { nome: "Dezena redonda × unidade", t: 7, gen: () => { const a = ri(2, 9) * 10, b = ri(2, 9); return op(a, "×", b, a * b); } },
  { nome: "Dois dígitos × um", t: 10, gen: () => { const a = ri(12, 49), b = ri(3, 9); return op(a, "×", b, a * b, { dica: `Separe: ${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b}.` }); } },
  { nome: "Vezes 5 e vezes 25", t: 9, gen: () => { const b = pick([5, 25]); const a = b === 5 ? ri(12, 98) : ri(2, 24) * 2; return op(a, "×", b, a * b, { dica: b === 5 ? "× 5 é × 10 e depois a metade." : "× 25 é × 100 e depois dividido por 4." }); } },
  { nome: "Vezes 11", t: 9, gen: () => { const a = ri(12, 99); return op(a, "×", 11, a * 11, { dica: "× 11 é × 10 + o próprio número." }); } },
  { nome: "Dois dígitos × dois", t: 16, gen: () => { const a = ri(12, 29), b = ri(11, 19); return op(a, "×", b, a * b, { dica: `${a} × ${b} = ${a} × 10 + ${a} × ${b - 10}.` }); } },
  { nome: "Três dígitos × um", t: 15, gen: () => { const a = ri(102, 499), b = ri(3, 9); return op(a, "×", b, a * b); } },
];

/* ───────── Divisão (sempre exata, exceto onde o nível pede vírgula) */
const divisao = [
  { nome: "Tabuada ao contrário 2 a 5", t: 6, gen: () => { const b = ri(2, 5), q = ri(2, 10); return op(b * q, "÷", b, q); } },
  { nome: "Tabuada ao contrário 6 a 9", t: 7, gen: () => { const b = ri(6, 9), q = ri(2, 10); return op(b * q, "÷", b, q, { dica: `Pense: ${b} vezes quanto dá ${b * q}?` }); } },
  { nome: "Dividir por 10 e 100", t: 6, gen: () => { const b = pick([10, 100]); const q = ri(2, 90); return op(q * b, "÷", b, q, { dica: "Corte os zeros." }); } },
  { nome: "Metade", t: 7, gen: () => { const a = ri(11, 99) * 2; return op(a, "÷", 2, a / 2, { dica: "Metade das dezenas, metade das unidades." }); } },
  { nome: "Dois dígitos ÷ um", t: 9, gen: () => { const b = ri(3, 9), q = ri(11, Math.floor(99 / b)); return op(b * q, "÷", b, q); } },
  { nome: "Com zeros", t: 8, gen: () => { const b = ri(2, 9), q = ri(2, 9); const z = pick([10, 100]); return op(b * q * z, "÷", b, q * z, { dica: "Divida sem os zeros e devolva os zeros." }); } },
  { nome: "Dividir por 5 e 25", t: 9, gen: () => { const b = pick([5, 25]); const q = b === 5 ? ri(12, 60) : ri(3, 40); return op(b * q, "÷", b, q, { dica: b === 5 ? "÷ 5 é dobrar e dividir por 10." : "÷ 25 é × 4 e dividir por 100." }); } },
  { nome: "Três dígitos ÷ um", t: 12, gen: () => { const b = ri(3, 9), q = ri(21, Math.floor(999 / b)); return op(b * q, "÷", b, q); } },
  { nome: "Resultado com vírgula", t: 11, gen: () => { const b = pick([2, 4, 5]); let a; do { a = ri(3, 49); } while (a % b === 0); return conta([fmt(a), "÷", fmt(b)], R(a, b), { dica: "Pode responder com vírgula, ex.: 3,5." }); } },
  { nome: "Por dois dígitos", t: 13, gen: () => { const b = ri(11, 25), q = ri(3, 19); return op(b * q, "÷", b, q, { dica: `Estime: ${b} × 10 = ${b * 10}.` }); } },
];

/* ───────── Potência */
const potencia = [
  { nome: "Quadrados até 10", t: 6, gen: () => { const a = ri(2, 10); return conta([{ pot: [fmt(a), 2] }], a * a); } },
  { nome: "Potências de 10", t: 6, gen: () => { const e = ri(0, 6); return conta([{ pot: ["10", e] }], 10 ** e, { dica: "O expoente é o número de zeros. 10⁰ = 1." }); } },
  { nome: "Potências de 2", t: 7, gen: () => { const e = ri(0, 10); return conta([{ pot: ["2", e] }], 2 ** e, { dica: "Vá dobrando: 2, 4, 8, 16, 32, 64..." }); } },
  { nome: "Cubos até 5", t: 7, gen: () => { const a = ri(1, 5); return conta([{ pot: [fmt(a), 3] }], a ** 3); } },
  { nome: "Expoente 0 e 1", t: 5, gen: () => { const a = ri(2, 999), e = ri(0, 1); return conta([{ pot: [fmt(a), e] }], e ? a : 1, { dica: "Todo número (≠ 0) elevado a 0 dá 1." }); } },
  { nome: "Quadrados 11 a 20", t: 9, gen: () => { const a = ri(11, 20); return conta([{ pot: [fmt(a), 2] }], a * a, { dica: `${a}² = ${a} × ${a}. Ex.: 13² = 130 + 39.` }); } },
  { nome: "Terminados em 5", t: 8, gen: () => { const d = ri(1, 9), a = d * 10 + 5; return conta([{ pot: [fmt(a), 2] }], a * a, { dica: `${d} × ${d + 1} = ${d * (d + 1)}, e cola 25 no fim.` }); } },
  { nome: "Base negativa", t: 8, gen: () => { const a = ri(2, 6), e = ri(2, 3); return conta([{ pot: [`(−${a})`, e] }], (-a) ** e, { dica: "Expoente par: positivo. Ímpar: negativo." }); } },
  { nome: "Cubos 6 a 10", t: 10, gen: () => { const a = ri(6, 10); return conta([{ pot: [fmt(a), 3] }], a ** 3); } },
  { nome: "Potência de fração", t: 10, gen: () => { const n = ri(1, 4), d = ri(n + 1, 6), e = ri(2, 3); return conta([{ pot: [{ f: [n, d] }, e] }], R(n ** e, d ** e), { dica: "Eleve em cima e embaixo. Responda como a/b." }); } },
];

/* ───────── Raiz */
const raiz = [
  { nome: "Quadradas até 100", t: 6, gen: () => { const a = ri(1, 10); return conta([{ raiz: [fmt(a * a)] }], a); } },
  { nome: "Quadradas até 400", t: 8, gen: () => { const a = ri(11, 20); return conta([{ raiz: [fmt(a * a)] }], a); } },
  { nome: "Com zeros", t: 7, gen: () => { const a = ri(2, 9), z = pick([100, 10000]); return conta([{ raiz: [fmt(a * a * z)] }], a * Math.sqrt(z), { dica: "Cada par de zeros vira um zero na raiz." }); } },
  { nome: "Cúbicas", t: 8, gen: () => { const a = ri(1, 6); return conta([{ raiz: [fmt(a ** 3)], i: 3 }], a, { dica: "Que número vezes ele mesmo três vezes dá isso?" }); } },
  { nome: "Raiz de fração", t: 9, gen: () => { const a = ri(1, 9), b = ri(a + 1, 12); const g = mdc(a, b); return conta([{ raiz: [{ f: [a * a, b * b] }] }], R(a / g, b / g), { dica: "Raiz de cima sobre raiz de baixo." }); } },
  { nome: "Raiz de decimal", t: 9, gen: () => { const a = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]); return conta([{ raiz: [fmt((a * a) / 100)] }], R(a, 10), { dica: "√0,25 = √25 ÷ √100 = 5 ÷ 10 = 0,5." }); } },
  { nome: "Raiz de quadrado grande", t: 10, gen: () => { const a = pick([25, 30, 40, 50, 60, 70, 80, 90, 21, 24, 32, 35, 45]); return conta([{ raiz: [fmt(a * a)] }], a, { dica: "Olhe o último algarismo e estime pela dezena." }); } },
  { nome: "Raiz de produto", t: 9, gen: () => { const a = ri(2, 9), b = ri(2, 9); return conta([{ raiz: [fmt(a * a), "×", fmt(b * b)] }], a * b, { dica: "√(a × b) = √a × √b." }); } },
  { nome: "Raiz + raiz", t: 10, gen: () => { const a = ri(2, 12), b = ri(2, 12); return conta([{ raiz: [fmt(a * a)] }, "+", { raiz: [fmt(b * b)] }], a + b, { dica: "Calcule cada raiz separado e some." }); } },
  { nome: "Cúbicas grandes", t: 10, gen: () => { const a = ri(7, 10); const neg = Math.random() < .3; return conta([{ raiz: [(neg ? "−" : "") + fmt(a ** 3)], i: 3 }], neg ? -a : a, { dica: "Raiz cúbica de negativo é negativa." }); } },
];

/* ───────── Frações */
const fr = (n, d) => ({ f: [n, d] });
const fracoes = [
  { nome: "Fração de um número", t: 8, gen: () => { const d = pick([2, 3, 4, 5, 10]), n = ri(1, d - 1), k = ri(2, 12); return conta([fr(n, d), "de", fmt(d * k)], n * k, { dica: `Divida por ${d} e multiplique por ${n}.` }); } },
  { nome: "Simplificar", t: 10, gen: () => { let n, d; do { n = ri(1, 9); d = ri(n + 1, 12); } while (mdc(n, d) !== 1); const k = ri(2, 6); return conta(["simplifique", fr(n * k, d * k)], R(n, d), { forma: "irredutivel", dica: "Divida em cima e embaixo pelo mesmo número até não dar mais." }); } },
  { nome: "Mesmo denominador", t: 8, gen: () => { const d = ri(3, 12), a = ri(1, d - 1), b = ri(1, d - 1); const s = Math.random() < .5 || a <= b; return conta([fr(a, d), s ? "+" : "−", fr(b, d)], R(s ? a + b : a - b, d), { dica: "Mantém o de baixo, opera o de cima. Pode responder como a/b." }); } },
  { nome: "Fração → decimal", t: 8, gen: () => { const [n, d] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [1, 10], [7, 10], [3, 20], [1, 20], [7, 25]]); return conta(["em decimal:", fr(n, d)], R(n, d), { dica: "Responda com vírgula, ex.: 0,75." }); } },
  { nome: "Multiplicar", t: 10, gen: () => { const a = ri(1, 5), b = ri(2, 7), c = ri(1, 5), d = ri(2, 7); return conta([fr(a, b), "×", fr(c, d)], R(a * c, b * d), { dica: "Em cima com em cima, embaixo com embaixo." }); } },
  { nome: "Denominadores diferentes", t: 14, gen: () => { const b = ri(2, 6); let d; do { d = ri(2, 6); } while (d === b); const a = ri(1, b - 1), c = ri(1, d - 1); return conta([fr(a, b), "+", fr(c, d)], R(a * d + c * b, b * d), { dica: `Iguale os de baixo: MMC de ${b} e ${d}.` }); } },
  { nome: "Dividir", t: 12, gen: () => { const a = ri(1, 6), b = ri(2, 7), c = ri(1, 6), d = ri(2, 7); return conta([fr(a, b), "÷", fr(c, d)], R(a * d, b * c), { dica: "Mantém a primeira e multiplica pelo inverso da segunda." }); } },
  { nome: "Número misto", t: 12, gen: () => { const i = ri(1, 4), d = ri(2, 8), n = ri(1, d - 1); return conta(["vire fração:", `${i}`, fr(n, d)], R(i * d + n, d), { dica: `${i} × ${d} + ${n} em cima, ${d} embaixo.` }); } },
  { nome: "Subtrair diferentes", t: 14, gen: () => { const b = ri(2, 6); let d; do { d = ri(2, 8); } while (d === b); let a, c; do { a = ri(1, b); c = ri(1, d - 1); } while (a * d - c * b <= 0); return conta([fr(a, b), "−", fr(c, d)], R(a * d - c * b, b * d)); } },
  { nome: "Fração de fração", t: 12, gen: () => { const a = ri(1, 3), b = ri(2, 5), c = ri(1, 3), d = ri(2, 5), k = b * d * ri(1, 6); return conta([fr(a, b), "de", fr(c, d), "de", fmt(k)], R(a * c * k, b * d), { dica: "“De” é vezes." }); } },
];

/* ───────── Decimais */
const decimais = [
  { nome: "Somar décimos", t: 8, gen: () => { const a = ri(1, 49), b = ri(1, 49); return conta([fmtDec(a * 10), "+", fmtDec(b * 10)], dec((a + b) * 10)); } },
  { nome: "Vezes 10 e 100", t: 7, gen: () => { const a = ri(101, 9999), m = pick([10, 100]); return conta([fmtDec(a), "×", fmt(m)], dec(a * m), { dica: "A vírgula anda para a direita uma casa por zero." }); } },
  { nome: "Dividir por 10 e 100", t: 7, gen: () => { const a = ri(11, 999), m = pick([10, 100]); return conta([fmt(a), "÷", fmt(m)], R(a, m), { dica: "A vírgula anda para a esquerda." }); } },
  { nome: "Somar com centésimos", t: 10, gen: () => { const a = ri(101, 999), b = ri(11, 999); return conta([fmtDec(a), "+", fmtDec(b)], dec(a + b), { dica: "Vírgula embaixo de vírgula." }); } },
  { nome: "Subtrair", t: 10, gen: () => { const a = ri(300, 999), b = ri(11, a - 50); return conta([fmtDec(a), "−", fmtDec(b)], dec(a - b)); } },
  { nome: "Troco", t: 9, gen: () => { const nota = pick([10, 20, 50]), c = ri(105, nota * 100 - 5); return conta([fmt(nota), "−", fmtDec(c)], dec(nota * 100 - c), { dica: "Complete até o real inteiro, depois até a nota." }); } },
  { nome: "Decimal × inteiro", t: 10, gen: () => { const a = ri(11, 99), b = ri(2, 9); return conta([fmtDec(a * 10), "×", fmt(b)], dec(a * 10 * b), { dica: "Faça sem vírgula e devolva as casas." }); } },
  { nome: "Decimal × decimal", t: 12, gen: () => { const a = ri(2, 9), b = ri(2, 9); return conta([fmtDec(a * 10), "×", fmtDec(b * 10)], R(a * b, 100), { dica: "Conte as casas: 1 + 1 = 2 casas." }); } },
  { nome: "Dividir por decimal", t: 12, gen: () => { const b = pick([2, 4, 5]), q = ri(2, 30); return conta([fmt(q * b / 10), "÷", fmtDec(b * 10)], q, { dica: "Multiplique os dois por 10 para sumir a vírgula." }); } },
  { nome: "Metade e dobro", t: 9, gen: () => { const a = ri(101, 999); const dobro = Math.random() < .5; return conta([dobro ? "dobro de" : "metade de", fmtDec(dobro ? a : a * 2)], dec(dobro ? 2 * a : a)); } },
];

/* ───────── Porcentagem */
const porcentagem = [
  { nome: "10%", t: 7, gen: () => { const a = ri(2, 99) * 10; return conta(["10% de", fmt(a)], a / 10, { dica: "10% é dividir por 10." }); } },
  { nome: "50% e 25%", t: 7, gen: () => { const p = pick([50, 25]); const a = ri(2, 60) * 4; return conta([`${p}% de`, fmt(a)], (a * p) / 100, { dica: "50% é metade; 25% é metade da metade." }); } },
  { nome: "1% e 5%", t: 8, gen: () => { const p = pick([1, 5]); const a = ri(2, 90) * 100; return conta([`${p}% de`, fmt(a)], (a * p) / 100, { dica: "1% é ÷ 100. 5% é metade de 10%." }); } },
  { nome: "20%, 30%, 40%", t: 9, gen: () => { const p = pick([20, 30, 40, 60, 70]); const a = ri(2, 40) * 10; return conta([`${p}% de`, fmt(a)], R(a * p, 100), { dica: `Ache 10% e multiplique por ${p / 10}.` }); } },
  { nome: "15% e 75%", t: 10, gen: () => { const p = pick([15, 75]); const a = ri(2, 30) * 20; return conta([`${p}% de`, fmt(a)], (a * p) / 100, { dica: p === 15 ? "10% + metade dos 10%." : "75% é 3/4: tire um quarto." }); } },
  { nome: "Aumento", t: 11, gen: () => { const p = pick([10, 20, 5, 50, 25]); const a = ri(2, 40) * 20; return conta([fmt(a), `+ ${p}%`], (a * (100 + p)) / 100, { dica: `Aumentar ${p}% é multiplicar por ${fmt((100 + p) / 100)}.` }); } },
  { nome: "Desconto", t: 11, gen: () => { const p = pick([10, 20, 30, 15, 25]); const a = ri(2, 40) * 20; return conta([fmt(a), `− ${p}%`], (a * (100 - p)) / 100, { dica: `Pagar ${100 - p}% do preço.` }); } },
  { nome: "Quantos % é", t: 11, gen: () => { const b = pick([20, 25, 40, 50, 80, 200, 400]); const p = pick([10, 20, 25, 50, 75, 5]); const a = (b * p) / 100; if (a % 1) return porcentagem[7].gen(); return conta([fmt(a), "é quantos % de", fmt(b)], p, { dica: "Parte ÷ todo × 100. Responda só o número." }); } },
  { nome: "12,5% e 33,3%", t: 11, gen: () => { const t = pick(["12,5", "33,3...", "20", "12,5"]); if (t === "33,3...") { const a = ri(2, 40) * 3; return conta(["33,3...% de", fmt(a)], a / 3, { dica: "É um terço." }); } if (t === "20") { const a = ri(2, 40) * 5; return conta(["20% de", fmt(a)], a / 5, { dica: "É um quinto." }); } const a = ri(2, 40) * 8; return conta(["12,5% de", fmt(a)], a / 8, { dica: "É um oitavo: metade de metade de metade." }); } },
  { nome: "Aumentos seguidos", t: 14, gen: () => { const p = pick([10, 20]), q = pick([10, 20, 50]); const a = ri(1, 10) * 100; return conta([fmt(a), `+ ${p}%`, `+ ${q}%`], (a * (100 + p) * (100 + q)) / 10000, { dica: "Aplique um de cada vez: o segundo é sobre o novo valor." }); } },
];

/* ───────── Sinais (números negativos) */
const sg = (x) => (x < 0 ? `(−${-x})` : String(x));
const sinais = [
  { nome: "Somar com negativo", t: 7, gen: () => { const a = ri(-9, 9), b = ri(-9, -1); return conta([a < 0 ? `−${-a}` : `${a}`, "+", sg(b)], a + b, { dica: "Somar um negativo é o mesmo que subtrair." }); } },
  { nome: "Menos com menos", t: 7, gen: () => { const a = ri(-9, 9), b = ri(1, 9); return conta([a < 0 ? `−${-a}` : `${a}`, "−", sg(-b)], a + b, { dica: "− (−b) vira + b." }); } },
  { nome: "Do negativo para o positivo", t: 7, gen: () => { const a = ri(1, 15), b = ri(1, 25); return conta([`−${a}`, "+", `${b}`], b - a, { dica: "Ande na reta numérica: do −a sobe b." }); } },
  { nome: "Multiplicar sinais", t: 7, gen: () => { let a = ri(2, 9), b = ri(2, 9); if (Math.random() < .5) a = -a; if (Math.random() < .6) b = -b; return conta([sg(a), "×", sg(b)], a * b, { dica: "Sinais iguais: +. Diferentes: −." }); } },
  { nome: "Dividir sinais", t: 8, gen: () => { let b = ri(2, 9), q = ri(2, 9); if (Math.random() < .5) b = -b; if (Math.random() < .6) q = -q; return conta([sg(b * q), "÷", sg(b)], q); } },
  { nome: "Três números", t: 9, gen: () => { const a = ri(-12, 12), b = ri(-12, 12), c = ri(-12, 12); return conta([a < 0 ? `−${-a}` : `${a}`, b < 0 ? "−" : "+", `${Math.abs(b)}`, c < 0 ? "−" : "+", `${Math.abs(c)}`], a + b + c, { dica: "Junte os positivos, junte os negativos, depois subtraia." }); } },
  { nome: "Dezenas com sinais", t: 9, gen: () => { const a = ri(-90, -11), b = ri(11, 90); return Math.random() < .5 ? conta([`−${-a}`, "+", `${b}`], a + b) : conta([`${b}`, "−", `${-a + b}`], -a === 0 ? b : b - (-a + b)); } },
  { nome: "Três fatores", t: 9, gen: () => { const v = [ri(2, 5), ri(2, 5), ri(1, 4)].map((x) => (Math.random() < .5 ? -x : x)); return conta([sg(v[0]), "×", sg(v[1]), "×", sg(v[2])], v[0] * v[1] * v[2], { dica: "Conte os negativos: par dá +, ímpar dá −." }); } },
  { nome: "Potência com sinal", t: 9, gen: () => { const a = ri(2, 5), e = ri(2, 3); const par = Math.random() < .5; return par ? conta([{ pot: [`(−${a})`, e] }], (-a) ** e) : conta(["−", { pot: [`${a}`, 2] }], -(a * a), { dica: "−a² sem parênteses: o menos fica de fora." }); } },
  { nome: "Misturado", t: 10, gen: () => pick([sinais[0], sinais[1], sinais[3], sinais[4], sinais[5], sinais[7]]).gen() },
];

/* ───────── Expressões (ordem das operações) */
const expressoes = [
  { nome: "Vezes antes do mais", t: 9, gen: () => { const a = ri(1, 20), b = ri(2, 9), c = ri(2, 9); return Math.random() < .5 ? conta([`${a}`, "+", `${b}`, "×", `${c}`], a + b * c, { dica: "Primeiro × e ÷, depois + e −." }) : conta([`${b}`, "×", `${c}`, "−", `${a}`], b * c - a); } },
  { nome: "Parênteses", t: 9, gen: () => { const a = ri(1, 12), b = ri(1, 9), c = ri(2, 9); return conta(["(", `${a}`, "+", `${b}`, ")", "×", `${c}`], (a + b) * c, { dica: "Parênteses primeiro." }); } },
  { nome: "Divisão no meio", t: 10, gen: () => { const b = ri(2, 9), q = ri(2, 9), a = ri(1, 30); return conta([`${a}`, "+", `${b * q}`, "÷", `${b}`], a + q); } },
  { nome: "Dois produtos", t: 11, gen: () => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9), d = ri(2, 9); return conta([`${a}`, "×", `${b}`, "+", `${c}`, "×", `${d}`], a * b + c * d); } },
  { nome: "Com potência", t: 11, gen: () => { const a = ri(2, 6), b = ri(2, 9), c = ri(1, 20); return conta([{ pot: [`${a}`, 2] }, "+", `${b}`, "×", "2", "−", `${c}`], a * a + b * 2 - c, { dica: "Potência, depois ×, depois + e −." }); } },
  { nome: "Da esquerda para a direita", t: 10, gen: () => { const b = ri(2, 6), c = ri(2, 6), q = ri(2, 8); const a = b * q * c; return conta([`${a}`, "÷", `${b}`, "×", `${c}`], q * c * c, { dica: "× e ÷ juntos: resolva na ordem em que aparecem." }); } },
  { nome: "Colchetes", t: 13, gen: () => { const a = ri(2, 9), b = ri(1, 9), c = ri(2, 5), d = ri(1, 20); return conta([`${d}`, "+", "[", `${a}`, "×", "(", `${b}`, "+", `${c}`, ")", "]"], d + a * (b + c), { dica: "De dentro para fora: ( ), depois [ ]." }); } },
  { nome: "Com negativos", t: 12, gen: () => { const a = ri(2, 9), b = ri(2, 9), c = ri(1, 30); return conta([`${c}`, "−", `${a}`, "×", `(−${b})`], c + a * b, { dica: "a × (−b) é negativo, e menos com menos vira mais." }); } },
  { nome: "Com raiz", t: 12, gen: () => { const r = ri(2, 10), a = ri(2, 9), b = ri(1, 15); return conta([{ raiz: [`${r * r}`] }, "×", `${a}`, "−", `${b}`], r * a - b); } },
  { nome: "Expressão completa", t: 16, gen: () => { const a = ri(2, 5), b = ri(2, 6), c = ri(2, 4), d = ri(1, 10); return conta(["(", `${a}`, "+", `${b}`, ")", "×", `${c}`, "−", { pot: [`${c}`, 2] }, "+", `${d}`], (a + b) * c - c * c + d); } },
];

export const TRILHAS = [
  { id: "soma", nome: "Soma", sim: "+", cor: "#7ddca0", niveis: soma, teclas: "int" },
  { id: "subtracao", nome: "Subtração", sim: "−", cor: "#8cc4ff", niveis: subtracao, teclas: "int" },
  { id: "multiplicacao", nome: "Multiplicação", sim: "×", cor: "#f5d76e", niveis: multiplicacao, teclas: "int" },
  { id: "divisao", nome: "Divisão", sim: "÷", cor: "#ffad7a", niveis: divisao, teclas: "dec" },
  { id: "potencia", nome: "Potência", sim: "x²", cor: "#d9a6ff", niveis: potencia, teclas: "frac" },
  { id: "raiz", nome: "Raiz", sim: "√", cor: "#7fd8d0", niveis: raiz, teclas: "frac" },
  { id: "fracoes", nome: "Frações", sim: "½", cor: "#ff9fbf", niveis: fracoes, teclas: "frac" },
  { id: "decimais", nome: "Decimais", sim: "0,5", cor: "#c8dd6e", niveis: decimais, teclas: "dec" },
  { id: "porcentagem", nome: "Porcentagem", sim: "%", cor: "#ffcf6e", niveis: porcentagem, teclas: "dec" },
  { id: "sinais", nome: "Negativos", sim: "±", cor: "#ff9283", niveis: sinais, teclas: "int" },
  { id: "expressoes", nome: "Expressões", sim: "( )", cor: "#a9c7ff", niveis: expressoes, teclas: "int" },
];
export const TRILHA = Object.fromEntries(TRILHAS.map((t) => [t.id, t]));
export const CONTAS_POR_NIVEL = 10;
export const VIDAS = 3;

/* ───────── Corrigir o que a pessoa digitou */
export function lerResposta(txt) {
  const s = String(txt).trim().replace(/\s/g, "").replace(/−/g, "-").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (!s || s === "-" ) return null;
  const m = s.match(/^(-?)(\d+(?:\.\d+)?)\/(-?\d+)$/);
  if (m) { const d = +m[3]; if (!d) return null; const n = +m[2]; if (n % 1) return null; return { ...R((m[1] ? -1 : 1) * n, d), fracao: true, bruto: [+m[2] * (m[1] ? -1 : 1), d] }; }
  if (!/^-?\d+(\.\d+)?$/.test(s) && !/^-?\.\d+$/.test(s)) return null;
  const casas = (s.split(".")[1] || "").length; const k = 10 ** casas;
  return { ...R(Math.round(+s * k), k), fracao: false };
}
export function confere(c, txt) {
  const r = lerResposta(txt); if (!r) return false;
  if (r.n !== c.resp.n || r.d !== c.resp.d) return false;
  if (c.forma === "irredutivel" && r.fracao) return mdc(r.bruto[0], r.bruto[1]) === 1 && r.bruto[1] > 0;
  return true;
}
/* Resposta “bonita” para mostrar: inteiro, decimal exato ou fração */
export function respTxt(c) {
  const { n, d } = c.resp; if (d === 1) return fmt(n);
  let x = d; while (x % 2 === 0) x /= 2; while (x % 5 === 0) x /= 5;
  const decimalExato = x === 1 && String(n / d).length < 9;
  const precisaFracao = c.forma === "irredutivel" || c.exp.some((t) => t?.f || t?.pot?.[0]?.f || t?.raiz?.[0]?.f);
  if (decimalExato && !precisaFracao) return fmt(n / d);
  return `${n < 0 ? "−" : ""}${Math.abs(n)}/${d}` + (decimalExato ? ` (ou ${fmt(n / d)})` : "");
}

/* Gera as contas de um nível sem repetir a mesma conta seguida */
export function gerarNivel(trilha, i, qtd = CONTAS_POR_NIVEL) {
  const nv = TRILHA[trilha].niveis[i]; const out = []; const vistos = new Set();
  for (let k = 0; out.length < qtd && k < qtd * 20; k++) {
    const c = nv.gen(); const chave = JSON.stringify(c.exp);
    if (vistos.has(chave) && k < qtd * 10) continue;
    vistos.add(chave); out.push({ ...c, t: nv.t, trilha, nivel: i });
  }
  return out;
}
