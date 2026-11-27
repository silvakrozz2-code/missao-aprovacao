// Siglas e macetes para o Painel de Revisão Rápida (aquele que abre do lado da tela).
// Formato: { sigla, letras, significado, tema }
// "sigla" é a palavra-chave que a pessoa decora (LIMPE, PODC...). "letras" abre a sigla,
// "significado" explica. O painel mostra a sigla na frente e a abertura no verso.

export const siglas = {
  concurso: [
    { sigla: "LIMPE", letras: "Legalidade · Impessoalidade · Moralidade · Publicidade · Eficiência", significado: "Os cinco princípios EXPRESSOS da Administração Pública (art. 37, caput, da CF).", tema: "Administração Pública" },
    { sigla: "PODC", letras: "Planejar · Organizar · Dirigir · Controlar", significado: "As quatro funções administrativas (processo administrativo).", tema: "Administração Pública" },
    { sigla: "COFIFOMOB", letras: "Competência · Finalidade · Forma · Motivo · Objeto", significado: "Os cinco elementos (requisitos) do ato administrativo.", tema: "Atos administrativos" },
    { sigla: "PATI", letras: "Presunção de legitimidade · Autoexecutoriedade · Tipicidade · Imperatividade", significado: "Os atributos do ato administrativo.", tema: "Atos administrativos" },
    { sigla: "SO-CI-DI-VA-PLU", letras: "Soberania · Cidadania · Dignidade da pessoa humana · Valores sociais do trabalho e da livre iniciativa · Pluralismo político", significado: "Fundamentos da República (art. 1º da CF).", tema: "Princípios fundamentais" },
    { sigla: "PPA · LDO · LOA", letras: "Plano Plurianual (4 anos) · Diretrizes Orçamentárias (metas do ano seguinte) · Orçamento Anual", significado: "As três leis orçamentárias. O PPA planeja, a LDO orienta, a LOA executa.", tema: "Orçamento público" },
    { sigla: "Concurso 2 + 2", letras: "Validade de até 2 anos, prorrogável UMA vez por igual período", significado: "Prazo de validade do concurso público (art. 37, III, da CF).", tema: "Administração Pública" },
    { sigla: "Estabilidade 3", letras: "3 anos de efetivo exercício + avaliação especial de desempenho", significado: "Requisitos da estabilidade do servidor (art. 41 da CF).", tema: "Administração Pública" },
    { sigla: "MP 60 + 60", letras: "60 dias, prorrogável uma vez por mais 60", significado: "Prazo da Medida Provisória.", tema: "Poder Legislativo" },
    { sigla: "EC 3/5 · 2 · 2", letras: "Aprovação por 3/5, em 2 turnos, nas 2 Casas", significado: "Quórum da Emenda Constitucional (art. 60 da CF).", tema: "Poder Legislativo" },
    { sigla: "CPI · 1/3", letras: "Requerimento de 1/3 · fato determinado · prazo certo · poderes de investigação próprios de juiz", significado: "Requisitos da Comissão Parlamentar de Inquérito.", tema: "Poder Legislativo" },
    { sigla: "LC = maioria absoluta", letras: "Lei Complementar exige maioria ABSOLUTA (art. 69). Lei Ordinária = maioria simples", significado: "Quórum das leis. Absoluta conta sobre o total de membros.", tema: "Poder Legislativo" },
    { sigla: "Idades 35-30-21-18", letras: "35: Presidente/Vice/Senador · 30: Governador · 21: Deputado/Prefeito · 18: Vereador", significado: "Idades mínimas para os cargos eletivos (art. 14, §3º).", tema: "Direitos políticos" },
    { sigla: "LAI 20 + 10", letras: "Resposta em 20 dias + 10 com justificativa · recurso em 10 dias", significado: "Prazos da Lei de Acesso à Informação (Lei 12.527).", tema: "Acesso à informação (LAI)" },
    { sigla: "Sigilo 25-15-5", letras: "Ultrassecreta 25 anos · Secreta 15 · Reservada 5", significado: "Graus de sigilo da LAI (art. 24).", tema: "Acesso à informação (LAI)" },
    { sigla: "Ouvidoria 30 + 30", letras: "Resposta ao usuário em 30 dias, prorrogável uma vez por igual período", significado: "Prazo da ouvidoria (Lei 13.460).", tema: "Ética e atendimento" },
    { sigla: "Improbidade = DOLO", letras: "Só pune a conduta DOLOSA (Lei 14.230/2021). Acabou a modalidade culposa", significado: "Elemento subjetivo da improbidade administrativa (Lei 8.429).", tema: "Improbidade (Lei 8.429)" },
    { sigla: "Anula x Revoga", letras: "ANULA: ato ilegal, efeito ex tunc (retroage), Administração ou Judiciário · REVOGA: ato inconveniente, ex nunc, só a Administração", significado: "Desfazimento do ato administrativo.", tema: "Atos administrativos" },
    { sigla: "Dispensa x Inexigibilidade", letras: "DISPENSA: competição é possível, mas a lei permite não licitar · INEXIGIBILIDADE: competição é inviável (fornecedor único)", significado: "Contratação direta na Lei 14.133.", tema: "Licitações (Lei 14.133)" },
    { sigla: "Modalidades 14.133", letras: "Pregão · Concorrência · Concurso · Leilão · Diálogo competitivo", significado: "As cinco modalidades de licitação. Proibido criar outras ou combinar.", tema: "Licitações (Lei 14.133)" },
    { sigla: "3 idades do arquivo", letras: "Corrente (uso frequente) · Intermediário (aguarda destinação) · Permanente (guarda definitiva)", significado: "Ciclo de vida dos documentos (arquivologia).", tema: "Arquivologia" },
    { sigla: "Resp. / Atenc.", letras: "RESPEITOSAMENTE: para superior hierárquico · ATENCIOSAMENTE: mesma hierarquia ou inferior", significado: "Fecho da redação oficial.", tema: "Redação oficial" },
    { sigla: "Pétreas (art. 60 §4º)", letras: "Forma federativa · Voto direto, secreto, universal e periódico · Separação dos Poderes · Direitos e garantias individuais", significado: "Cláusulas que não podem ser abolidas por emenda.", tema: "Direito Constitucional" },
    { sigla: "Worm x Vírus", letras: "WORM se espalha sozinho pela rede · VÍRUS precisa de hospedeiro e de execução", significado: "Diferença das duas pragas (segurança da informação).", tema: "Segurança da informação" },
    { sigla: "$A$1 (F4)", letras: "O cifrão trava: $A$1 não muda ao copiar (referência absoluta). F4 alterna os travamentos", significado: "Referência absoluta no Excel.", tema: "Excel" },
  ],

  npor: [
    { sigla: "Ordem Unida", letras: "Sentido · Descansar · Ombro-armas · Apresentar-armas", significado: "Comandos básicos da ordem unida. Decore a sequência para não travar na execução.", tema: "Ordem Unida" },
  ],

  enem: [
    { sigla: "SOH · CAH · TOA", letras: "Seno = Oposto/Hipotenusa · Cosseno = Adjacente/Hipotenusa · Tangente = Oposto/Adjacente", significado: "As três razões trigonométricas no triângulo retângulo.", tema: "Trigonometria" },
    { sigla: "Ordem das operações", letras: "( ) → potências/raízes → × e ÷ → + e −", significado: "A ordem em que se resolve uma expressão numérica.", tema: "Aritmética" },
    { sigla: "LEO GER", letras: "LEO: Lose Electrons = Oxidation · GER: Gain Electrons = Reduction", significado: "Quem perde elétron oxida; quem ganha reduz (eletroquímica).", tema: "Química" },
    { sigla: "Porquês", letras: "Por que (pergunta) · Porque (resposta) · Por quê (fim de frase) · Porquê (substantivo, com artigo)", significado: "Os quatro porquês.", tema: "Português" },
    { sigla: "Bhaskara", letras: "x = (−b ± √Δ) / 2a, com Δ = b² − 4ac", significado: "Resolve a equação do 2º grau. Δ>0: duas raízes; Δ=0: uma; Δ<0: nenhuma real.", tema: "Equação do 2º grau" },
    { sigla: "Reinos (bio)", letras: "Monera · Protista · Fungi · Plantae · Animalia", significado: "Os cinco reinos dos seres vivos.", tema: "Biologia" },
  ],
};
