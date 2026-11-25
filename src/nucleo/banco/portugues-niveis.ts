// Língua Portuguesa completa por nível: temas que faltavam, cada um com Início (básico),
// Intermediário e Nível prova. Conteúdo original. Cada aba monta com prefixo próprio.
import { deAfirmacoes, deLacunas } from "./motor.ts";
import type { Gerador } from "../lib/tipos.ts";

export function portuguesNiveis(pref: string, materia: string): Gerador[] {
  const id = (s: string) => `${pref}-pn-${s}`;
  const T = {
    col: "Colocação pronominal", voz: "Vozes verbais", verbo: "Tempos e modos verbais", per: "Período composto",
    form: "Formação de palavras", pron: "Pronomes", sent: "Sentido das palavras", tipo: "Tipos e gêneros textuais",
    ofi: "Redação oficial", duv: "Dúvidas de grafia",
  };
  return [
    // ───────── Colocação pronominal
    ...deAfirmacoes({
      id: id("col1"), materia, tema: T.col, sobre: "a colocação pronominal", nivel: "basico",
      cmd: { c: "Assinale a frase com a colocação do pronome de acordo com a norma-padrão.", i: "Assinale a frase com ERRO de colocação pronominal.", j: "Julgue a colocação pronominal das frases:" },
      v: ["Não me deixe sozinho.", "Ninguém nos avisou da reunião.", "Sempre te ajudei quando pude.", "Quem lhe contou a novidade?", "Diga-me a verdade.", "Entreguei-lhe o processo ontem.", "Que Deus o acompanhe.", "Aqui se trabalha muito."],
      f: [["Não deixe-me sozinho.", "O 'não' atrai o pronome: não me deixe."], ["Ninguém avisou-nos da reunião.", "Pronome indefinido atrai: ninguém nos avisou."], ["Me diga a verdade.", "Na norma-padrão não se inicia frase com pronome oblíquo: diga-me."], ["Quem contou-lhe a novidade?", "Pronome interrogativo atrai: quem lhe contou."], ["Sempre ajudei-te quando pude.", "Advérbio sem vírgula atrai: sempre te ajudei."], ["Que Deus acompanhe-o.", "Frase optativa (desejo) pede próclise: que Deus o acompanhe."]],
      macete: "Palavras que puxam o pronome para antes do verbo: não, nunca, ninguém, quem, que, advérbios, pronomes relativos e conjunções subordinativas.",
    }),
    ...deAfirmacoes({
      id: id("col2"), materia, tema: T.col, sobre: "a colocação pronominal", nivel: "intermediario",
      cmd: { c: "Assinale a frase em que a colocação pronominal está correta.", i: "Assinale a frase com colocação pronominal INCORRETA.", j: "Analise a colocação pronominal:" },
      v: ["Entregar-lhe-ei o documento amanhã.", "Far-se-ia a reforma, se houvesse verba.", "O servidor que me atendeu foi gentil.", "Quando o vi, já era tarde.", "Vou entregar-lhe o ofício.", "Tinha-me dito que viria.", "Espero que se resolva logo.", "Em se tratando de prazos, seja rigoroso."],
      f: [["Entregarei-lhe o documento amanhã.", "Futuro do presente sem palavra atrativa pede mesóclise: entregar-lhe-ei."], ["Faria-se a reforma, se houvesse verba.", "Futuro do pretérito: mesóclise (far-se-ia)."], ["O servidor que atendeu-me foi gentil.", "O pronome relativo 'que' atrai: que me atendeu."], ["Quando vi-o, já era tarde.", "Conjunção subordinativa atrai: quando o vi."], ["Tinha dito-me que viria.", "Nunca se usa pronome depois de particípio."], ["Espero que resolva-se logo.", "Conjunção 'que' atrai: que se resolva."]],
      macete: "Futuro do presente e do pretérito sem atrativo: mesóclise. Particípio nunca leva pronome depois.",
    }),
    // ───────── Vozes verbais
    ...deAfirmacoes({
      id: id("voz1"), materia, tema: T.voz, sobre: "as vozes verbais", nivel: "basico",
      v: ["Em 'O fiscal multou a empresa', a voz é ativa.", "Em 'A empresa foi multada pelo fiscal', a voz é passiva analítica.", "Em 'Vendem-se casas', a voz é passiva sintética.", "Em 'Ela se penteou', a voz é reflexiva.", "Na voz passiva, o sujeito sofre a ação.", "O agente da passiva costuma vir introduzido por 'por' ou 'pelo'."],
      f: [["Em 'O fiscal multou a empresa', a voz é passiva.", "O sujeito (o fiscal) pratica a ação: voz ativa."], ["Em 'Vendem-se casas', a voz é reflexiva.", "As casas não vendem a si mesmas: passiva sintética (= casas são vendidas)."], ["Em 'Ela se penteou', a voz é passiva.", "Ela penteou a si mesma: reflexiva."], ["A voz passiva analítica é formada por 'se' + verbo.", "A analítica usa ser + particípio; a sintética usa o 'se'."], ["Na voz ativa, o sujeito sofre a ação.", "Na ativa o sujeito pratica a ação."]],
      macete: "Passiva analítica: SER + particípio. Passiva sintética: verbo + SE (= ser + particípio).",
    }),
    ...deAfirmacoes({
      id: id("voz2"), materia, tema: T.voz, sobre: "a transposição de vozes verbais", nivel: "intermediario",
      cmd: { c: "Assinale a transposição de voz verbal feita corretamente.", i: "Assinale a transposição de voz verbal INCORRETA.", j: "Julgue as transposições de voz verbal:" },
      v: ["'A comissão analisará os recursos' → 'Os recursos serão analisados pela comissão'.", "'O prefeito assinou o decreto' → 'O decreto foi assinado pelo prefeito'.", "'Alugam-se salas' → 'Salas são alugadas'.", "'Os técnicos estavam revisando o edital' → 'O edital estava sendo revisado pelos técnicos'.", "'Consertam-se relógios' tem o verbo no plural porque concorda com 'relógios'.", "'Precisa-se de vendedores' não está na voz passiva: o 'se' é índice de indeterminação do sujeito."],
      f: [["'A comissão analisará os recursos' → 'Os recursos foram analisados pela comissão'.", "O tempo deve ser mantido: analisará → serão analisados."], ["'Aluga-se salas' está correto, pois o 'se' indetermina o sujeito.", "Com verbo transitivo direto é passiva sintética: alugam-se salas."], ["'Precisam-se de vendedores' está correto.", "Com verbo que pede preposição o 'se' indetermina e o verbo fica no singular: precisa-se de."], ["'O prefeito assinou o decreto' → 'O decreto foi assinado do prefeito'.", "O agente da passiva vem com 'por': pelo prefeito."], ["'Os técnicos revisaram o edital' → 'O edital é revisado pelos técnicos'.", "Mantenha o tempo: revisaram → foi revisado."]],
      macete: "Na transposição, o tempo do verbo principal passa para o verbo SER.",
    }),
    // ───────── Tempos e modos verbais
    ...deAfirmacoes({
      id: id("verbo1"), materia, tema: T.verbo, sobre: "os tempos e modos verbais", nivel: "basico",
      v: ["O modo indicativo expressa certeza: 'Ela estuda todos os dias'.", "O modo subjuntivo expressa dúvida ou hipótese: 'Talvez ela estude'.", "O modo imperativo expressa ordem ou pedido: 'Estude mais'.", "'Estudei' está no pretérito perfeito do indicativo.", "'Estudava' está no pretérito imperfeito do indicativo.", "'Estudarei' está no futuro do presente do indicativo."],
      f: [["'Talvez ela estude' está no modo indicativo.", "'Talvez' indica dúvida: subjuntivo."], ["'Estudava' está no pretérito perfeito.", "Ação habitual ou em curso no passado: imperfeito."], ["'Estude mais' está no modo subjuntivo.", "Ordem/pedido: imperativo."], ["'Estudarei' está no futuro do pretérito.", "Futuro do pretérito é 'estudaria'."], ["O modo indicativo expressa sempre ordem.", "Ordem é o imperativo; o indicativo expressa certeza."]],
      macete: "Indicativo = certeza; subjuntivo = possibilidade (que, se, quando, talvez); imperativo = ordem.",
    }),
    ...deAfirmacoes({
      id: id("verbo2"), materia, tema: T.verbo, sobre: "a flexão e a correlação verbal", nivel: "intermediario",
      cmd: { c: "Assinale a frase com flexão verbal de acordo com a norma-padrão.", i: "Assinale a frase com ERRO de flexão ou correlação verbal.", j: "Julgue a flexão verbal das frases:" },
      v: ["Se ele vir o resultado, ficará feliz.", "Quando você vier, traga os documentos.", "O diretor interveio na discussão.", "Se eu soubesse, teria avisado.", "Eles mantiveram a decisão.", "Quando eu puser a mesa, chamo vocês.", "Se nós propusermos a mudança, ela será aceita.", "Ele reouve o dinheiro perdido."],
      f: [["Se ele ver o resultado, ficará feliz.", "Futuro do subjuntivo de VER: se ele vir."], ["Quando você vir, traga os documentos.", "Futuro do subjuntivo de VIR: quando você vier."], ["O diretor interviu na discussão.", "Intervir segue vir: ele interveio."], ["Se eu sabesse, teria avisado.", "Imperfeito do subjuntivo de saber: soubesse."], ["Eles manteram a decisão.", "Manter segue ter: mantiveram."], ["Quando eu pôr a mesa, chamo vocês.", "Futuro do subjuntivo de pôr: quando eu puser."], ["Ele reaveu o dinheiro perdido.", "Reaver segue haver: reouve."]],
      macete: "Derivados seguem o verbo de origem: intervir/vir, manter/ter, propor/pôr, reaver/haver.",
    }),
    // ───────── Período composto
    ...deAfirmacoes({
      id: id("per1"), materia, tema: T.per, sobre: "as orações coordenadas", nivel: "basico",
      v: ["Em 'Estudei, mas não passei', a oração 'mas não passei' é coordenada adversativa.", "Em 'Estude, pois a prova está perto', a segunda oração é coordenada explicativa.", "Em 'Ou você estuda, ou trabalha', as orações são alternativas.", "Em 'Choveu muito; portanto, a estrada fechou', a segunda oração é conclusiva.", "Em 'Ele leu e resumiu o texto', a oração 'e resumiu o texto' é aditiva.", "Orações coordenadas são sintaticamente independentes."],
      f: [["Em 'Estudei, mas não passei', 'mas não passei' é conclusiva.", "'Mas' indica oposição: adversativa."], ["Em 'Choveu; portanto, a estrada fechou', a segunda é adversativa.", "'Portanto' indica conclusão."], ["Em 'Ele leu e resumiu', a segunda é alternativa.", "'E' indica adição: aditiva."], ["Orações coordenadas exercem função sintática uma na outra.", "Isso ocorre nas subordinadas; coordenadas são independentes."], ["'Contudo' é conjunção conclusiva.", "'Contudo' é adversativa (= mas)."]],
      macete: "Coordenadas: Aditiva (e), Adversativa (mas), Alternativa (ou), Conclusiva (portanto), Explicativa (pois, porque).",
    }),
    ...deAfirmacoes({
      id: id("per2"), materia, tema: T.per, sobre: "as orações subordinadas", nivel: "intermediario",
      v: ["Em 'É necessário que todos colaborem', a oração 'que todos colaborem' é subordinada substantiva subjetiva.", "Em 'Os candidatos que estudaram passaram', a oração adjetiva é restritiva (só os que estudaram).", "Em 'Os servidores, que são concursados, têm estabilidade', a oração adjetiva é explicativa e vem entre vírgulas.", "Em 'Embora chovesse, saímos', a oração 'Embora chovesse' é adverbial concessiva.", "Em 'Se estudar, passará', a oração 'Se estudar' é adverbial condicional.", "Em 'Saiu cedo para que não se atrasasse', a oração destacada é adverbial final."],
      f: [["Em 'Embora chovesse, saímos', a oração é adverbial causal.", "'Embora' é concessiva: algo que não impede o fato."], ["A oração adjetiva explicativa nunca vem entre vírgulas.", "A explicativa vem entre vírgulas; a restritiva, sem."], ["Em 'É necessário que todos colaborem', a oração é objetiva direta.", "Ela é o sujeito de 'é necessário': subjetiva."], ["Em 'Se estudar, passará', a oração é adverbial temporal.", "'Se' aqui é condicional."], ["Em 'Saiu cedo para que não se atrasasse', a oração é consecutiva.", "'Para que' indica finalidade: final."]],
      macete: "Adjetiva com vírgula = explicativa (generaliza); sem vírgula = restritiva (separa um grupo).",
    }),
    // ───────── Formação de palavras
    ...deAfirmacoes({
      id: id("form1"), materia, tema: T.form, sobre: "a formação de palavras", nivel: "basico",
      v: ["'Infeliz' é formada por derivação prefixal.", "'Felizmente' é formada por derivação sufixal.", "'Guarda-chuva' é formada por composição por justaposição.", "'Planalto' (plano + alto) é formada por composição por aglutinação.", "'Pernalta' é composição por aglutinação, pois houve perda de som.", "'Girassol' é composição por justaposição."],
      f: [["'Infeliz' é formada por derivação sufixal.", "'In-' é prefixo: derivação prefixal."], ["'Guarda-chuva' é derivação prefixal.", "Junta duas palavras: composição por justaposição."], ["'Planalto' é composição por justaposição.", "Plano perdeu o 'o': aglutinação."], ["'Felizmente' é formada por composição.", "Feliz + sufixo -mente: derivação sufixal."], ["'Girassol' é formada por aglutinação.", "Gira + sol sem perda de som: justaposição."]],
      macete: "Composição junta palavras (justaposição sem perda; aglutinação com perda). Derivação junta afixos.",
    }),
    ...deAfirmacoes({
      id: id("form2"), materia, tema: T.form, sobre: "os processos de formação de palavras", nivel: "intermediario",
      v: ["'Entardecer' é formada por derivação parassintética (prefixo e sufixo juntos).", "'Ajuda' (de ajudar) é formada por derivação regressiva.", "'O jantar' (verbo usado como substantivo) é derivação imprópria.", "'Desleal' é derivação prefixal.", "'Infelizmente' é derivação prefixal e sufixal.", "'Automóvel' (grego + latim) é um hibridismo.", "'Tique-taque' é uma onomatopeia."],
      f: [["'Entardecer' é derivação prefixal e sufixal.", "Não existe 'entarde' nem 'tardecer': é parassintética."], ["'Infelizmente' é parassintética.", "Existem 'infeliz' e 'felizmente': prefixal e sufixal."], ["'Ajuda' é derivação sufixal.", "Veio do verbo, com redução: regressiva."], ["'O jantar' é derivação regressiva.", "Só mudou a classe: derivação imprópria."], ["'Automóvel' é composição por aglutinação.", "Junta elementos de línguas diferentes: hibridismo."]],
      macete: "Tire o prefixo ou o sufixo: se a palavra deixar de existir, é parassintética.",
    }),
    // ───────── Pronomes
    ...deAfirmacoes({
      id: id("pron1"), materia, tema: T.pron, sobre: "o uso dos pronomes pessoais", nivel: "basico",
      cmd: { c: "Assinale a frase em que o pronome está empregado de acordo com a norma-padrão.", i: "Assinale a frase com ERRO no emprego do pronome.", j: "Julgue o emprego dos pronomes:" },
      v: ["Trouxeram o livro para eu ler.", "Isso é para mim.", "Entre mim e você não há segredos.", "Vi-o na rua ontem.", "Encontrei-a na biblioteca.", "Ele trouxe o relatório consigo."],
      f: [["Trouxeram o livro para mim ler.", "Antes de verbo no infinitivo, como sujeito, usa-se 'eu': para eu ler."], ["Isso é para eu.", "Sem verbo depois, após preposição: para mim."], ["Entre eu e você não há segredos.", "Depois de preposição: entre mim e você."], ["Vi ele na rua ontem.", "Na norma-padrão, como objeto direto: vi-o."], ["Encontrei ela na biblioteca.", "Objeto direto pede pronome oblíquo: encontrei-a."]],
      macete: "'Para mim' antes de verbo só se der para tirar: 'Para mim, ler é bom' (vírgula). Se for sujeito do verbo, 'para eu'.",
    }),
    ...deAfirmacoes({
      id: id("pron2"), materia, tema: T.pron, sobre: "os pronomes relativos e demonstrativos", nivel: "intermediario",
      cmd: { c: "Assinale a frase com emprego correto do pronome relativo ou demonstrativo.", i: "Assinale a frase com ERRO no emprego do pronome relativo ou demonstrativo.", j: "Julgue o emprego dos pronomes:" },
      v: ["O autor cujo livro li veio à cidade.", "A cidade onde nasci é pequena.", "Este documento que tenho em mãos é o original.", "Esse livro que está com você é meu.", "O cargo a que aspiro exige curso superior.", "Pedro e Paulo foram aprovados: este em primeiro lugar, aquele em quinto."],
      f: [["O autor cujo o livro li veio à cidade.", "Depois de 'cujo' não se usa artigo."], ["O momento onde ele chegou foi tenso.", "'Onde' só para lugar físico: momento em que."], ["Esse documento que tenho em mãos é o original.", "Perto de quem fala: este."], ["O cargo que aspiro exige curso superior.", "Aspirar (desejar) pede 'a': a que aspiro."], ["Pedro e Paulo foram aprovados: este em primeiro lugar (Pedro).", "'Este' retoma o mais próximo: Paulo."]],
      macete: "Este (aqui, comigo), esse (aí, com você), aquele (lá). 'Cujo' nunca leva artigo depois.",
    }),
    // ───────── Sentido das palavras
    ...deAfirmacoes({
      id: id("sent1"), materia, tema: T.sent, sobre: "o sentido das palavras", nivel: "basico",
      v: ["Sinônimos são palavras de sentido semelhante: 'ágil' e 'rápido'.", "Antônimos são palavras de sentido oposto: 'ativo' e 'passivo'.", "Homônimos têm a mesma pronúncia ou grafia e sentidos diferentes: 'cela' (prisão) e 'sela' (do cavalo).", "Parônimos são parecidos, mas diferentes: 'eminente' (importante) e 'iminente' (prestes a acontecer).", "Polissemia é uma palavra com vários sentidos: 'manga' da camisa e 'manga' fruta.", "No sentido denotativo, a palavra tem o seu sentido literal."],
      f: [["'Eminente' significa 'prestes a acontecer'.", "Prestes a acontecer é 'iminente'; eminente é importante, elevado."], ["Antônimos têm sentidos semelhantes.", "Esses são sinônimos; antônimos são opostos."], ["No sentido conotativo, a palavra tem sentido literal.", "Literal é denotativo; conotativo é figurado."], ["'Cela' e 'sela' são sinônimos.", "Mesma pronúncia, sentidos diferentes: homônimos homófonos."], ["'Ratificar' e 'retificar' significam a mesma coisa.", "Ratificar = confirmar; retificar = corrigir."]],
      macete: "Ratificar = Reafirmar; Retificar = rEtificar = corrigir o Erro. Iminente = Iminência (vai acontecer).",
    }),
    ...deAfirmacoes({
      id: id("sent2"), materia, tema: T.sent, sobre: "a significação das palavras no contexto", nivel: "intermediario",
      v: ["Em 'Aquele jogador é uma fera', 'fera' está em sentido conotativo.", "'Descriminar' significa tirar o caráter de crime; 'discriminar' significa distinguir ou separar.", "'Infligir' é aplicar (pena); 'infringir' é desrespeitar (lei).", "'Tráfego' é trânsito; 'tráfico' é comércio ilegal.", "'Mandado' é ordem judicial; 'mandato' é período de representação política.", "'Comprimento' é medida; 'cumprimento' é saudação ou execução."],
      f: [["'Infringir' significa aplicar uma pena.", "Aplicar pena é infligir; infringir é violar."], ["'Mandato' é a ordem judicial de prisão.", "Ordem judicial é mandado; mandato é período de representação."], ["'Tráfico' é o movimento de veículos.", "Movimento de veículos é tráfego."], ["Em 'Aquele jogador é uma fera', 'fera' está em sentido denotativo.", "Ele não é um animal: sentido figurado (conotativo)."], ["'Descriminar' significa tratar com preconceito.", "Tratar com preconceito é discriminar."]],
      macete: "Na dúvida entre parônimos, procure uma palavra da mesma família: mandatário (mandato), infração (infringir).",
    }),
    // ───────── Tipos e gêneros textuais
    ...deAfirmacoes({
      id: id("tipo1"), materia, tema: T.tipo, sobre: "os tipos textuais", nivel: "basico",
      v: ["A narração conta fatos em sequência, com personagens, tempo e espaço.", "A descrição apresenta características de seres, objetos ou lugares.", "A dissertação argumentativa defende um ponto de vista com argumentos.", "O texto injuntivo orienta ou dá instruções, como receitas e manuais.", "O texto expositivo apresenta informações sem defender opinião.", "Um mesmo texto pode misturar tipos textuais."],
      f: [["A receita culinária é um texto predominantemente narrativo.", "Receita dá instruções: injuntivo."], ["A descrição se caracteriza por defender uma tese.", "Defender tese é dissertação argumentativa."], ["O texto expositivo sempre defende uma opinião.", "O expositivo informa; quem opina é o argumentativo."], ["A narração não tem marcação de tempo.", "A narração se organiza no tempo, com fatos em sequência."], ["Um texto só pode ter um tipo textual.", "Os tipos se misturam; fala-se em tipo predominante."]],
      macete: "Narrar = contar; descrever = mostrar; dissertar = defender; injunção = mandar fazer; expor = explicar.",
    }),
    ...deAfirmacoes({
      id: id("tipo2"), materia, tema: T.tipo, sobre: "os gêneros textuais", nivel: "intermediario",
      v: ["O editorial expressa a opinião do veículo de comunicação e não é assinado.", "O artigo de opinião é assinado e defende o ponto de vista do autor.", "A notícia relata um fato recente de forma predominantemente impessoal.", "A crônica trata de fatos do cotidiano, muitas vezes com humor ou reflexão.", "A charge faz crítica a um fato atual por meio de desenho e humor.", "O resumo apresenta as ideias principais de um texto sem opinião de quem resume."],
      f: [["O editorial é assinado por um colunista e expressa só a opinião dele.", "Esse é o artigo de opinião; o editorial representa o jornal."], ["A notícia é um gênero argumentativo.", "A notícia relata (informa); não defende tese."], ["A charge trata de fatos atemporais, sem relação com a atualidade.", "Isso é o cartum; a charge se liga a um fato atual."], ["O resumo deve incluir a opinião crítica de quem resume.", "Isso é a resenha; o resumo é fiel ao original."], ["A crônica é um gênero exclusivamente científico.", "A crônica é literária e jornalística, ligada ao cotidiano."]],
      macete: "Resumo = só o texto. Resenha = resumo + opinião. Charge = atual; cartum = atemporal.",
    }),
    // ───────── Redação oficial
    ...deAfirmacoes({
      id: id("ofi1"), materia, tema: T.ofi, sobre: "a redação oficial", nivel: "basico",
      v: ["A redação oficial deve ser clara, concisa, formal e impessoal.", "O ofício é usado para comunicação oficial entre órgãos ou com particulares.", "'Vossa Excelência' é usado para altas autoridades, como o Presidente da República e os juízes.", "Os pronomes de tratamento levam o verbo para a 3ª pessoa: 'Vossa Senhoria está convidado'.", "O fecho 'Atenciosamente' é usado para autoridades de mesma hierarquia ou inferior.", "Na redação oficial devem ser evitadas gírias e impressões pessoais."],
      f: [["Os pronomes de tratamento levam o verbo para a 2ª pessoa: 'Vossa Senhoria estais convidado'.", "Concordam na 3ª pessoa: Vossa Senhoria está."], ["A redação oficial admite linguagem informal para aproximar o leitor.", "Deve ser formal e impessoal."], ["'Respeitosamente' é usado para autoridades de hierarquia inferior.", "Respeitosamente é para autoridade SUPERIOR."], ["A concisão permite omitir informações essenciais.", "Concisão é dizer o máximo com o mínimo de palavras, sem perder o essencial."], ["'Vossa Magnificência' é usado para juízes.", "É para reitores de universidade; juízes recebem Vossa Excelência."]],
      macete: "Fecho: Respeitosamente para cima, Atenciosamente para o lado e para baixo.",
    }),
    ...deAfirmacoes({
      id: id("ofi2"), materia, tema: T.ofi, sobre: "os documentos e o padrão oficial", nivel: "intermediario",
      v: ["A ata registra de forma resumida e fiel o que ocorreu em uma reunião.", "O requerimento é usado para solicitar algo a uma autoridade.", "Desde a atualização do Manual de Redação da Presidência (2018), o memorando e o aviso foram reunidos no padrão ofício.", "Na ata não se deixa espaço em branco e, em caso de erro, usa-se 'digo' para corrigir.", "O vocativo para o Presidente da República é 'Excelentíssimo Senhor Presidente da República'.", "Pronome de tratamento com adjetivo concorda com o sexo da pessoa: 'Vossa Excelência está cansada' (para mulher)."],
      f: [["A ata pode ter rasuras e espaços em branco para completar depois.", "Para evitar fraude, a ata não pode ter espaços nem rasuras."], ["O requerimento serve para registrar o que ocorreu numa reunião.", "Isso é a ata; requerimento é pedido."], ["'Vossa Excelência' concorda com 'vossos': 'Vossa Excelência e vossos assessores'.", "Possessivo na 3ª pessoa: 'seus assessores'."], ["Para o Presidente da República usa-se 'Digníssimo Senhor Presidente'.", "'Digníssimo' foi abolido; usa-se 'Excelentíssimo Senhor Presidente da República'."], ["O adjetivo ligado a pronome de tratamento concorda sempre no feminino: 'Vossa Excelência está cansada' (para homem).", "Concorda com o sexo da pessoa: 'cansado' para homem."]],
      macete: "Pronome de tratamento: verbo e possessivo na 3ª pessoa (seu, sua); adjetivo com o sexo da pessoa.",
    }),
    // ───────── Dúvidas de grafia
    ...deLacunas({
      id: id("duv-mal"), materia, tema: T.duv, opcoes: ["mal", "mau"],
      frases: [["Ele dormiu ___ esta noite.", "mal", "Oposto de BEM: mal."], ["O ___ humor estragou o dia.", "mau", "Oposto de BOM: mau."], ["___ chegou, já foi embora.", "Mal", "= assim que (conjunção): mal."], ["Não há ___ nenhum em perguntar.", "mal", "Substantivo (oposto de bem)."], ["Ele é um ___ exemplo.", "mau", "Oposto de bom exemplo."], ["O projeto foi ___ executado.", "mal", "Oposto de bem executado."], ["Não seja ___ com os colegas.", "mau", "Oposto de bom."], ["O paciente passou ___ durante a noite.", "mal", "Oposto de bem."]],
      macete: "Troque por BEM ou BOM: cabe BEM → MAL; cabe BOM → MAU.",
    }),
    ...deLacunas({
      id: id("duv-ha"), materia, tema: T.duv, opcoes: ["há", "a"],
      frases: [["Trabalho aqui ___ cinco anos.", "há", "Tempo passado: há (= faz)."], ["Daqui ___ duas semanas teremos a prova.", "a", "Tempo futuro ou distância: a."], ["A escola fica ___ dois quilômetros daqui.", "a", "Distância: a."], ["Não ___ vagas disponíveis.", "há", "Haver = existir."], ["___ muito tempo não o vejo.", "Há", "Tempo passado (= faz)."], ["O ônibus sai daqui ___ dez minutos.", "a", "Futuro: a."], ["___ candidatos demais para poucas vagas.", "Há", "Haver = existir."], ["Ele partiu ___ dois dias.", "há", "Passado: há."]],
      macete: "Troque por FAZ: se couber, é HÁ. Futuro e distância: A.",
    }),
    ...deAfirmacoes({
      id: id("duv3"), materia, tema: T.duv, sobre: "a grafia de palavras e expressões", nivel: "intermediario",
      cmd: { c: "Assinale a frase escrita de acordo com a norma-padrão.", i: "Assinale a frase com ERRO de grafia.", j: "Julgue a grafia das frases:" },
      v: ["Aonde você vai com tanta pressa?", "Onde você mora?", "Estudou muito, mas não passou.", "Faça o trabalho; senão, perderá a nota.", "Se não chover, iremos à praia.", "Ele está a fim de estudar.", "Fiz isso a fim de ajudar.", "Ao invés de subir, desceu."],
      f: [["Onde você vai com tanta pressa?", "Com verbo de movimento (ir a): aonde."], ["Estudou muito, mais não passou.", "Oposição: mas."], ["Faça o trabalho; se não, perderá a nota.", "= caso contrário: senão (junto)."], ["Senão chover, iremos à praia.", "= caso não: se não (separado)."], ["Ele está afim de estudar.", "Ter vontade: a fim de (separado)."], ["Ao invés de comprar o carro, alugou-o (= em lugar de).", "'Ao invés de' indica oposição; 'em lugar de' é 'em vez de'."]],
      macete: "AONDE = A + ONDE (vai a algum lugar). SENÃO = caso contrário; SE NÃO = caso não.",
    }),
  ];
}

/** Aulas curtas dos temas novos de Português, separadas por nível. */
export const resumosPort: Record<string, { t: string[]; cai: string; macete: string }> = {
  "Colocação pronominal": { t: ["INÍCIO: próclise (pronome antes do verbo) quando há palavra atrativa: não, nunca, ninguém, quem, que, advérbio sem vírgula. 'Não me deixe.'", "Ênclise (depois do verbo) no início da frase e após vírgula: 'Diga-me', 'Ontem, encontrei-o'.", "INTERMEDIÁRIO: mesóclise (no meio) no futuro do presente e do pretérito sem atrativo: 'Entregar-lhe-ei', 'Far-se-ia'.", "AVANÇADO: nunca há pronome depois de particípio ('tinha-me dito', nunca 'tinha dito-me'). Na locução verbal com infinitivo, o pronome pode ficar depois do infinitivo: 'Vou entregar-lhe'."], cai: "Palavras atrativas e mesóclise.", macete: "Atrativo puxa o pronome para trás. Futuro sem atrativo: mesóclise." },
  "Vozes verbais": { t: ["INÍCIO: ativa (sujeito pratica), passiva (sujeito sofre) e reflexiva (pratica e sofre: 'Ela se penteou').", "Passiva analítica: SER + particípio ('O decreto foi assinado pelo prefeito'). Passiva sintética: verbo + SE ('Vendem-se casas').", "INTERMEDIÁRIO: na transposição, o tempo do verbo vai para o SER: 'analisará' → 'será analisado'.", "AVANÇADO: 'Alugam-se salas' (passiva: verbo concorda). 'Precisa-se de vendedores' (índice de indeterminação: verbo no singular)."], cai: "Transposição e concordância do verbo com o 'se'.", macete: "Verbo + se + sem preposição = passiva, concorda. Com preposição = singular." },
  "Tempos e modos verbais": { t: ["INÍCIO: indicativo = certeza; subjuntivo = hipótese; imperativo = ordem.", "Pretérito perfeito: ação concluída (estudei). Imperfeito: ação habitual (estudava). Futuro do pretérito: hipótese (estudaria).", "INTERMEDIÁRIO: correlação: 'Se eu soubesse, teria avisado' (imperfeito do subjuntivo + futuro do pretérito).", "AVANÇADO: verbos derivados seguem o primitivo: intervir/vir (interveio), manter/ter (mantiveram), propor/pôr (propusermos), reaver/haver (reouve). Futuro do subjuntivo: se eu vir (ver), quando eu vier (vir)."], cai: "Ver × vir no futuro do subjuntivo e derivados de ter, vir, pôr.", macete: "Conjugue o verbo primitivo e só acrescente o prefixo." },
  "Período composto": { t: ["INÍCIO: coordenadas são independentes: aditivas (e), adversativas (mas, porém, contudo), alternativas (ou), conclusivas (portanto, logo), explicativas (pois, porque).", "INTERMEDIÁRIO: subordinadas dependem da principal. Substantivas fazem papel de sujeito, objeto etc. ('É necessário que todos venham' = subjetiva).", "Adjetivas: restritiva (sem vírgula, limita) e explicativa (com vírgula, generaliza).", "AVANÇADO: adverbiais: causal (porque), concessiva (embora), condicional (se), final (para que), temporal (quando), consecutiva (tão... que), conformativa (conforme), proporcional (à medida que), comparativa (como)."], cai: "Valor das conjunções e adjetiva restritiva x explicativa.", macete: "Troque a conjunção por outra do mesmo grupo para confirmar o sentido." },
  "Formação de palavras": { t: ["INÍCIO: derivação prefixal (infeliz), sufixal (felizmente). Composição por justaposição (guarda-chuva, girassol) e aglutinação com perda de som (planalto, pernalta).", "INTERMEDIÁRIO: parassintética (prefixo e sufixo ao mesmo tempo: entardecer, anoitecer). Regressiva (verbo vira substantivo encurtado: ajuda, compra). Imprópria (muda a classe: o jantar).", "AVANÇADO: hibridismo (línguas diferentes: automóvel, sociologia), onomatopeia (tique-taque), sigla (ONU) e abreviação (foto, moto)."], cai: "Diferenciar parassintética de prefixal e sufixal.", macete: "Tirou um afixo e a palavra sumiu? Parassintética." },
  Pronomes: { t: ["INÍCIO: pronome reto é sujeito (eu, tu, ele); oblíquo é complemento (me, o, a, lhe, mim). 'Para eu fazer' (eu é sujeito de fazer); 'para mim' sem verbo depois.", "Objeto direto pede o/a: 'Vi-o', não 'vi ele' na norma-padrão.", "INTERMEDIÁRIO: relativos: 'cujo' indica posse e não leva artigo depois; 'onde' só para lugar físico.", "AVANÇADO: demonstrativos: este (perto de quem fala, e o que vou dizer), esse (perto de quem ouve, e o que já disse), aquele (longe). Na retomada de dois termos, 'este' é o mais próximo e 'aquele' o mais distante."], cai: "Para eu × para mim, cujo e este/esse.", macete: "Este = aqui; esse = aí; aquele = lá." },
  "Sentido das palavras": { t: ["INÍCIO: sinônimos (sentido parecido), antônimos (opostos), homônimos (mesmo som ou grafia, sentidos diferentes: cela/sela), parônimos (parecidos: eminente/iminente).", "Denotação = sentido literal; conotação = sentido figurado.", "INTERMEDIÁRIO: pares que mais caem: ratificar/retificar, infligir/infringir, tráfego/tráfico, mandado/mandato, descriminar/discriminar, comprimento/cumprimento, emergir/imergir.", "AVANÇADO: o sentido depende do contexto. Polissemia: a mesma palavra com vários sentidos (manga, banco)."], cai: "Parônimos e sentido no contexto.", macete: "Procure uma palavra da mesma família para decidir o parônimo." },
  "Tipos e gêneros textuais": { t: ["INÍCIO: tipos: narração (conta), descrição (mostra), dissertação (defende ou expõe), injunção (instrui) e exposição (informa).", "INTERMEDIÁRIO: gêneros são formas concretas: notícia, editorial, artigo de opinião, crônica, charge, receita, resumo, resenha.", "AVANÇADO: editorial = opinião do jornal (sem assinatura); artigo de opinião = opinião assinada; resumo = só as ideias do autor; resenha = resumo + avaliação; charge = humor sobre fato atual; cartum = atemporal."], cai: "Identificar o gênero e sua finalidade.", macete: "Pergunte: qual é o objetivo do texto? Contar, mostrar, convencer, instruir ou informar." },
  "Redação oficial": { t: ["INÍCIO: atributos: clareza, concisão, formalidade, impessoalidade e padrão culto.", "Pronomes de tratamento: Vossa Excelência (altas autoridades e juízes), Vossa Senhoria (demais autoridades e particulares), Vossa Magnificência (reitores). Verbo e possessivo na 3ª pessoa.", "Fechos: 'Respeitosamente' para autoridade superior; 'Atenciosamente' para mesma hierarquia ou inferior.", "INTERMEDIÁRIO: documentos: ofício (padrão que reúne memorando e aviso desde 2018), requerimento (pedido), ata (registro de reunião, sem rasuras nem espaços; corrige com 'digo').", "AVANÇADO: vocativo 'Excelentíssimo Senhor' só para chefes de Poder; demais, 'Senhor + cargo'. 'Digníssimo' foi abolido."], cai: "Pronomes de tratamento, fechos e finalidade de cada documento. Muito cobrado em concursos de Agente Administrativo.", macete: "Respeitosamente para cima, Atenciosamente para o lado e para baixo." },
  "Dúvidas de grafia": { t: ["INÍCIO: MAL (oposto de bem) × MAU (oposto de bom). HÁ (tempo passado, = faz; ou = existe) × A (futuro e distância).", "INTERMEDIÁRIO: AONDE com verbos de movimento (ir a); ONDE para permanência. MAS (oposição) × MAIS (quantidade).", "AVANÇADO: SENÃO (caso contrário) × SE NÃO (caso não). A FIM DE (finalidade) × AFIM (semelhante). AO INVÉS DE (oposição) × EM VEZ DE (substituição)."], cai: "Mal/mau, há/a, onde/aonde e senão/se não.", macete: "Troque: BEM/BOM, FAZ, CASO NÃO." },
};
