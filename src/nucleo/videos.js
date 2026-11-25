// Trechos de videoaulas gratuitas no YouTube, com o minuto de início conferido
// na transcrição pública de cada vídeo (catálogo Assaadflix, 24/11/2026).
// "fim" = início do assunto seguinte no mesmo vídeo (quando conhecido).
export const VIDEOS = {
  m12: { id: "_EmywnyCOM0", titulo: "Toda a Matemática do ENEM em 12 horas", canal: "Pedro Assaad", dur: "12h" },
  fund: { id: "JQfJMJrV5Bk", titulo: "Matemática do Ensino Fundamental (pra quem tem muita dificuldade)", canal: "Pedro Assaad", dur: "11h58" },
};
// tema → lista de trechos [video, inicio, fim|null, o que mostra, nivel 1=base 2=aprofunda]
export const TRECHOS = {
  "MMC e MDC": [["m12", "0:39:53", "0:47:12", "MMC e MDC direto ao ponto", 2], ["fund", "2:22:30", "2:29:35", "Múltiplos e números primos (base)", 1], ["fund", "2:29:35", null, "A ideia do menor múltiplo comum, do zero", 1], ["m12", "0:33:31", "0:39:53", "Critérios de divisibilidade", 1]],
  "Frações": [["m12", "0:19:54", "0:33:31", "Frações: operações", 2], ["fund", "7:41:50", "8:04:23", "Comparar frações (do zero)", 1], ["fund", "8:04:23", "8:35:09", "Simplificação de frações", 1], ["fund", "8:35:09", null, "Soma e subtração de frações", 1]],
  "Quatro operações": [["fund", "0:44:23", "1:00:46", "Princípios das operações (do zero)", 1], ["fund", "1:13:28", "1:37:47", "Multiplicação", 1], ["m12", "0:08:02", "0:19:54", "Operações básicas", 2]],
  "Arredondamento e estimativa": [["fund", "1:37:47", "2:22:30", "Números decimais (base)", 1]],
  "Sistema monetário": [["fund", "1:37:47", "2:22:30", "Números decimais (base para contas com dinheiro)", 1]],
  Porcentagem: [["m12", "0:47:12", "1:11:29", "Porcentagem completa", 2]],
  "Juros simples": [["m12", "1:11:29", "1:20:29", "Juros simples x compostos", 2]],
  "Juros compostos": [["m12", "1:11:29", "1:20:29", "Juros simples x compostos (introdução)", 1], ["m12", "11:08:24", "11:41:41", "Juros compostos aprofundado", 2]],
  "Razão e proporção": [["m12", "1:20:29", "1:39:01", "Razão", 1], ["m12", "1:39:01", "2:07:26", "Proporção", 2]],
  "Regra de três": [["m12", "2:07:26", "2:21:51", "Grandezas direta/inversa e regra de três composta", 2]],
  "Resolução de problemas": [["m12", "0:39:53", "0:47:12", "MMC e MDC (problemas de coincidência)", 1], ["m12", "3:04:57", "3:30:47", "Equações e sistemas", 2]],
  "Tabelas e gráficos": [["m12", "3:30:47", "4:21:38", "Estatística: média, moda e mediana", 2]],
  "Estatística": [["m12", "3:30:47", "4:21:38", "Média, moda e mediana", 2]],
  "Noções de direção": [["m12", "4:21:38", "4:28:18", "Plano cartesiano (apoio)", 1]],
  "Funções e equações": [["m12", "3:04:57", "3:30:47", "Equações e sistemas", 1], ["m12", "4:28:18", "5:07:29", "Função do 1º grau", 2], ["m12", "5:28:43", "6:26:18", "Função do 2º grau", 2]],
  "Sequências": [["m12", "5:07:29", "5:21:05", "Sequências", 2]],
  "Progressões": [["m12", "5:07:29", "5:21:05", "Sequências (base)", 1], ["m12", "5:21:05", "5:28:43", "Progressão aritmética", 2]],
  "Áreas e superfícies": [["m12", "6:26:18", "6:30:21", "Geometria plana: introdução", 1], ["m12", "7:09:42", "7:24:29", "Quadriláteros e áreas", 2]],
  "Teorema de Tales": [["m12", "6:30:21", "7:09:42", "Triângulos (base para Tales e Pitágoras)", 2]],
  "Circunferência": [["m12", "7:43:52", "8:08:22", "Circunferência e círculo", 2]],
  "Geometria espacial": [["m12", "8:08:22", "8:47:30", "Geometria espacial", 2]],
  "Análise combinatória": [["m12", "8:59:56", "10:01:16", "Análise combinatória", 2]],
  "Probabilidade": [["m12", "10:01:16", "10:39:27", "Probabilidade", 2]],
  "Logaritmos e exponencial": [["m12", "10:39:27", "11:08:24", "Logaritmo", 2]],
};
