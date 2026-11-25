import { Triangle, Circle, Rows3, ChartSpline, ChartPie, Percent, TrendingUp, ArrowLeftRight, Footprints, Dices } from "lucide-react";
import { Triangulo, Circulo, Tales, Funcao } from "./geometria.jsx";
import { Fracoes, Porcentagem, Juros, RegraTres, MMC, Probabilidade } from "./numeros.jsx";

/* Cada experimento: nome, uma linha do que se faz nele, ícone, componente e os temas do edital em que ele aparece */
export const LAB = [
  { id: "triangulo", nome: "Triângulo", desc: "Arraste os vértices e veja ângulos, área e Pitágoras", Ic: Triangle, C: Triangulo, temas: ["Áreas e superfícies"] },
  { id: "circulo", nome: "Circunferência", desc: "Puxe o raio: diâmetro, comprimento, área e π", Ic: Circle, C: Circulo, temas: ["Circunferência"] },
  { id: "tales", nome: "Teorema de Tales", desc: "Mexa nas paralelas e a proporção continua", Ic: Rows3, C: Tales, temas: ["Teorema de Tales"] },
  { id: "funcao", nome: "Gráfico de função", desc: "Reta e parábola: raízes, vértice e Δ ao vivo", Ic: ChartSpline, C: Funcao, temas: ["Funções e equações"] },
  { id: "fracoes", nome: "Frações", desc: "Barras para comparar e somar frações", Ic: ChartPie, C: Fracoes, temas: ["Frações"] },
  { id: "porcentagem", nome: "Porcentagem", desc: "Quadro de 100: x% de, aumento e desconto", Ic: Percent, C: Porcentagem, temas: ["Porcentagem"] },
  { id: "juros", nome: "Juros simples e compostos", desc: "Mês a mês, lado a lado", Ic: TrendingUp, C: Juros, temas: ["Juros simples", "Juros compostos"] },
  { id: "regra3", nome: "Regra de três", desc: "Direta e inversa com setas", Ic: ArrowLeftRight, C: RegraTres, temas: ["Regra de três", "Razão e proporção"] },
  { id: "mmc", nome: "MMC e MDC", desc: "Dois sapos pulando na reta numérica", Ic: Footprints, C: MMC, temas: ["MMC e MDC"] },
  { id: "probabilidade", nome: "Probabilidade", desc: "Urna com bolinhas e sorteios", Ic: Dices, C: Probabilidade, temas: ["Probabilidade"] },
];
export const labDoTema = (tema) => LAB.find((x) => x.temas.includes(tema)) || null;
