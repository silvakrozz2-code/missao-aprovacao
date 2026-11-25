// Aulas escritas do Concurso Curitiba (Agente Administrativo, FAFIPA).
// Completam o resumo de cada tema com: abertura, esquema visual, exemplos do dia a dia
// da Prefeitura e pegadinhas de prova. O resumo (t, cai, macete) continua vindo de dados-concurso.js.
//
// esquemas: { tipo: "mapa", titulo, raiz, ramos: [[nome, detalhe]] }
//           { tipo: "comparar", titulo, cols: [[nome, [itens]]] }
//           { tipo: "etapas", titulo, passos: [[nome, detalhe]] }
// exemplos: [[situação, resposta]]   pegadinhas: [[afirmação ERRADA, o certo]]

export const AULAS = {
  "Administração Pública": {
    abre: "Pense na Prefeitura de Curitiba como uma empresa enorme que só pode fazer o que a lei manda. Esta aula responde quatro perguntas: quem presta o serviço público (Administração direta ou indireta), como as tarefas são repartidas (desconcentrar ou descentralizar), que regras guiam tudo (LIMPE) e que poderes o administrador tem para agir.",
    esquemas: [
      { tipo: "mapa", titulo: "O mapa do tema", raiz: "Administração Pública", ramos: [
        ["Direta", "O próprio Município e seus órgãos (secretarias). Órgão não tem personalidade jurídica."],
        ["Indireta", "Autarquias, fundações públicas, empresas públicas e sociedades de economia mista."],
        ["Princípios (LIMPE)", "Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência."],
        ["Poderes", "Hierárquico, disciplinar, regulamentar e de polícia."],
        ["Funções (PODC)", "Planejar, Organizar, Dirigir e Controlar."],
      ] },
      { tipo: "comparar", titulo: "A dupla que mais cai", cols: [
        ["Desconcentração", ["Fica DENTRO da mesma pessoa jurídica", "Cria órgãos (secretaria, departamento)", "Existe hierarquia", "Ex.: Município cria a Secretaria de Saúde"]],
        ["Descentralização", ["Passa a tarefa para OUTRA pessoa", "Autarquia, empresa, concessionária", "Não há hierarquia, só controle (tutela)", "Ex.: Município cria um instituto (autarquia)"]],
      ] },
    ],
    exemplos: [
      ["Curitiba cria um departamento novo dentro da Secretaria de Finanças.", "Desconcentração: continua tudo dentro do Município, com chefe e subordinados (hierarquia)."],
      ["Uma lei municipal cria uma autarquia para cuidar da previdência dos servidores.", "Descentralização por outorga: nasce outra pessoa jurídica, de direito público, que faz parte da Administração indireta."],
      ["A vigilância sanitária interdita um restaurante sujo.", "Poder de polícia: limita a atividade do particular em favor da saúde pública."],
      ["O chefe aplica advertência a um servidor que faltou sem justificar.", "Poder disciplinar: punição de quem tem vínculo com a Administração."],
      ["O prefeito publica um decreto explicando como uma lei será aplicada.", "Poder regulamentar: decreto para a fiel execução da lei, sem criar direito novo."],
    ],
    pegadinhas: [
      ["Secretaria municipal tem personalidade jurídica própria.", "Secretaria é ÓRGÃO, parte do Município. Quem tem personalidade é o Município."],
      ["Entre o Município e sua autarquia existe hierarquia.", "Não há hierarquia entre pessoas diferentes. Há controle finalístico (tutela)."],
      ["A eficiência está no art. 37 desde 1988.", "Eficiência entrou com a Emenda Constitucional 19/1998."],
      ["Multar um servidor faltoso é poder de polícia.", "Punir servidor é poder DISCIPLINAR. Polícia é sobre particulares em geral."],
    ],
  },

  "Atos administrativos": {
    abre: "Ato administrativo é a decisão oficial da Administração: um alvará, uma multa, uma nomeação. A prova quer saber do que o ato é feito (os 5 elementos), que força ele tem (os atributos) e como ele deixa de existir (anulação e revogação).",
    esquemas: [
      { tipo: "mapa", titulo: "Os 5 elementos (COFIFOMOB)", raiz: "Ato administrativo", ramos: [
        ["COmpetência", "Quem pode praticar. Sempre vinculado."],
        ["FInalidade", "O interesse público que se busca. Sempre vinculado."],
        ["FOrma", "Como o ato aparece (escrito, publicado). Vinculado."],
        ["MOtivo", "O fato e a regra que justificam o ato. Pode ser discricionário."],
        ["OBjeto", "O efeito, o conteúdo do ato. Pode ser discricionário."],
      ] },
      { tipo: "comparar", titulo: "Anular × Revogar", cols: [
        ["Anulação", ["Motivo: ILEGALIDADE", "Quem: a Administração ou o Judiciário", "Efeito: retroage (ex tunc)", "É um dever quando há vício"]],
        ["Revogação", ["Motivo: deixou de ser conveniente", "Quem: só a própria Administração", "Efeito: daqui pra frente (ex nunc)", "Respeita direito adquirido"]],
      ] },
    ],
    exemplos: [
      ["A Prefeitura concede alvará de construção a quem cumpriu todas as exigências da lei.", "Licença: ato vinculado. Cumpriu os requisitos, tem direito ao alvará."],
      ["A Prefeitura autoriza fechar uma rua para uma festa junina.", "Autorização: ato discricionário e precário. Pode ser revogada se deixar de convir."],
      ["Descobre-se que um servidor foi nomeado para cargo efetivo sem concurso.", "Anulação: o ato é ilegal e os efeitos caem desde o início."],
      ["A permissão de uso de uma praça para feira deixa de ser conveniente por causa de uma obra.", "Revogação: o ato era legal, mas deixou de ser oportuno. Efeitos daqui pra frente."],
    ],
    pegadinhas: [
      ["O Judiciário pode revogar ato do Executivo por achar inconveniente.", "O Judiciário só ANULA (controle de legalidade). Conveniência é mérito da Administração."],
      ["Todo ato administrativo tem autoexecutoriedade.", "Não. A cobrança forçada de uma multa, por exemplo, depende de execução judicial."],
      ["Revogação tem efeito retroativo.", "Revogação é ex nunc. Quem retroage é a anulação."],
    ],
  },

  "Bens e serviços públicos": {
    abre: "Tudo o que pertence ao Município, da praça ao terreno vazio, é bem público e tem proteção especial. E tudo o que o Município oferece à população, como o transporte coletivo, é serviço público e precisa ser adequado.",
    esquemas: [
      { tipo: "comparar", titulo: "As 3 espécies de bens públicos", cols: [
        ["Uso comum", ["Usado por todos", "Ruas, praças, rios, praias", "Afetado: não pode ser vendido"]],
        ["Uso especial", ["Onde funciona o serviço", "Escola, hospital, sede da Prefeitura", "Afetado: não pode ser vendido"]],
        ["Dominicais", ["Sem destinação pública", "Terreno vazio, prédio desativado", "Pode ser vendido, seguindo a lei"]],
      ] },
      { tipo: "mapa", titulo: "Proteções do bem público", raiz: "Bem público", ramos: [
        ["Inalienável", "Não pode ser vendido enquanto afetado (relativa)."],
        ["Impenhorável", "Não serve para pagar dívida em processo. O Estado paga por precatório."],
        ["Imprescritível", "Não sofre usucapião, nem com décadas de posse."],
        ["Não onerável", "Não pode ser dado em garantia (hipoteca, penhor)."],
      ] },
    ],
    exemplos: [
      ["Uma família ocupa por 20 anos um terreno vazio da Prefeitura e pede usucapião.", "Não ganha: bem público não sofre usucapião (CF, arts. 183, §3º, e 191, parágrafo único)."],
      ["A Prefeitura quer vender o prédio de uma escola que fechou.", "Primeiro desafeta (o bem vira dominical). Depois vende com interesse público, avaliação e licitação."],
      ["O ônibus da linha do bairro é operado por uma empresa privada.", "Serviço público prestado de forma indireta, por concessão, sempre precedida de licitação."],
    ],
    pegadinhas: [
      ["Bens dominicais podem ser adquiridos por usucapião.", "NENHUM bem público sofre usucapião, nem os dominicais."],
      ["Bem de uso especial pode ser vendido livremente.", "Só depois de desafetado e seguindo as exigências da lei."],
      ["Modicidade das tarifas significa serviço gratuito.", "Significa tarifa razoável, acessível ao usuário, não gratuidade."],
    ],
  },

  "Licitações (Lei 14.133)": {
    abre: "Licitação é a disputa justa que a Prefeitura faz antes de comprar, contratar ou vender. A Lei 14.133/2021 é a lei atual e a FAFIPA adora perguntar o que mudou em relação à lei antiga: modalidades novas, a ordem das fases e quando dá para contratar sem licitar.",
    esquemas: [
      { tipo: "etapas", titulo: "Fases da licitação (art. 17), em regra", passos: [
        ["Preparatória", "Planejamento: estudo técnico preliminar, termo de referência, orçamento."],
        ["Divulgação do edital", "Publicidade para que qualquer interessado participe."],
        ["Propostas e lances", "Os licitantes apresentam preços."],
        ["Julgamento", "Escolhe a melhor proposta pelo critério do edital."],
        ["Habilitação", "Só do vencedor: documentos jurídicos, fiscais, técnicos e econômicos."],
        ["Recursal", "Fase recursal única."],
        ["Homologação", "A autoridade confirma o resultado."],
      ] },
      { tipo: "comparar", titulo: "Contratar sem licitar", cols: [
        ["Dispensa (art. 75)", ["A disputa SERIA possível", "A lei permite não licitar", "Ex.: compras de pequeno valor, emergência ou calamidade"]],
        ["Inexigibilidade (art. 74)", ["A disputa é INVIÁVEL", "Não há como comparar", "Ex.: fornecedor exclusivo, artista consagrado, notória especialização"]],
      ] },
    ],
    exemplos: [
      ["A Prefeitura vai comprar papel A4 e canetas.", "Pregão: bem comum, critério menor preço ou maior desconto."],
      ["Escolher o projeto de um monumento, com prêmio para o vencedor.", "Concurso: escolha de trabalho técnico, científico ou artístico."],
      ["Vender carros velhos da frota.", "Leilão: alienação de bens móveis inservíveis, critério maior lance."],
      ["Contratar o show de um artista consagrado para o aniversário da cidade.", "Inexigibilidade: não dá para fazer disputa entre artistas."],
    ],
    pegadinhas: [
      ["Tomada de preços e convite são modalidades da Lei 14.133.", "Foram extintas. As modalidades são pregão, concorrência, concurso, leilão e diálogo competitivo."],
      ["Na Lei 14.133, a habilitação vem antes do julgamento.", "Em regra é DEPOIS. A inversão é exceção, com ato motivado."],
      ["Leilão serve para a Administração comprar.", "Leilão é para VENDER (alienar) bens."],
    ],
  },

  "Responsabilidade e PAD": {
    abre: "Se a ambulância da Prefeitura bate no seu carro, quem paga? Esta aula mostra quem indeniza a vítima (o Estado, sem discutir culpa), quando o servidor devolve o dinheiro (só com dolo ou culpa) e como funciona o processo que pode punir um servidor (PAD).",
    esquemas: [
      { tipo: "etapas", titulo: "O caminho da indenização", passos: [
        ["Agente causa dano", "No exercício da função (ex.: motorista da ambulância)."],
        ["Vítima processa o ESTADO", "Prova só o dano e o nexo causal. Não precisa provar culpa."],
        ["Estado indeniza", "Responsabilidade OBJETIVA (CF, art. 37, §6º)."],
        ["Ação de regresso", "O Estado cobra do servidor, SE ele agiu com dolo ou culpa."],
      ] },
      { tipo: "etapas", titulo: "Fases do PAD", passos: [
        ["Instauração", "Portaria que abre o processo e forma a comissão."],
        ["Inquérito", "Instrução (provas), defesa do acusado e relatório da comissão."],
        ["Julgamento", "A autoridade decide e aplica ou não a pena."],
      ] },
    ],
    exemplos: [
      ["A ambulância do Município bate em um carro parado no semáforo.", "O Município indeniza sem discutir culpa. Depois cobra do motorista se ele agiu com culpa (ex.: avançou o sinal)."],
      ["O servidor é absolvido no processo criminal por falta de provas.", "Ainda pode ser punido no PAD. Só a absolvição por inexistência do fato ou negativa de autoria vincula a esfera administrativa."],
      ["Um servidor é punido sem ter tido chance de se defender.", "A punição é nula: o PAD exige contraditório e ampla defesa (CF, art. 5º, LV)."],
    ],
    pegadinhas: [
      ["A vítima precisa provar a culpa do servidor para receber do Estado.", "A responsabilidade do Estado é objetiva: basta dano e nexo causal."],
      ["O Estado sempre pode cobrar o servidor de volta.", "Só se o servidor agiu com DOLO ou CULPA."],
      ["Absolvição penal por falta de provas impede a punição administrativa.", "Não impede. As esferas são independentes."],
    ],
  },

  "Direito Constitucional": {
    abre: "A Constituição é a lei mais importante do país. Aqui você aprende quem cria e quem muda a Constituição, quanto cada norma vale sozinha (eficácia) e quais ferramentas o cidadão tem para se defender (remédios constitucionais).",
    esquemas: [
      { tipo: "mapa", titulo: "Remédios: qual usar?", raiz: "Remédios constitucionais", ramos: [
        ["Habeas corpus", "Liberdade de ir e vir ameaçada ou violada. Gratuito."],
        ["Habeas data", "Conhecer ou corrigir os SEUS dados em registros públicos. Gratuito."],
        ["Mandado de segurança", "Direito líquido e certo (provado com documentos) não amparado por HC ou HD."],
        ["Mandado de injunção", "Falta de norma regulamentadora impede exercer um direito."],
        ["Ação popular", "Cidadão (eleitor) pede anulação de ato lesivo ao patrimônio público, à moralidade ou ao meio ambiente."],
      ] },
      { tipo: "comparar", titulo: "Eficácia das normas", cols: [
        ["Plena", ["Aplica na hora", "Lei não pode restringir"]],
        ["Contida", ["Aplica na hora", "Lei PODE restringir depois"]],
        ["Limitada", ["Precisa de lei", "para produzir todos os efeitos"]],
      ] },
    ],
    exemplos: [
      ["Uma pessoa é presa sem ordem judicial e sem flagrante.", "Habeas corpus. Qualquer pessoa pode impetrar, sem advogado e sem custo."],
      ["Você quer corrigir um dado errado sobre você num cadastro do governo.", "Habeas data."],
      ["Candidato aprovado dentro das vagas não é nomeado, e tem tudo provado em documentos.", "Mandado de segurança: direito líquido e certo."],
      ["Um cidadão quer anular um contrato superfaturado da Prefeitura.", "Ação popular."],
    ],
    pegadinhas: [
      ["O voto obrigatório é cláusula pétrea.", "Pétreo é o voto direto, secreto, universal e periódico. A obrigatoriedade não."],
      ["Qualquer pessoa pode propor ação popular.", "Só o CIDADÃO, ou seja, o eleitor."],
      ["Emenda constitucional é obra do poder originário.", "Emenda é poder DERIVADO reformador. O originário cria a Constituição."],
    ],
  },

  "Ética e atendimento": {
    abre: "O Agente Administrativo está na linha de frente: é quem atende o cidadão no balcão, no telefone e no e-mail. A prova cobra postura ética (agir pelo interesse público, sem favorecer ninguém) e os direitos do usuário do serviço público (Lei 13.460/2017).",
    esquemas: [
      { tipo: "etapas", titulo: "Um bom atendimento, passo a passo", passos: [
        ["Acolher", "Cumprimentar, olhar para a pessoa, dar atenção."],
        ["Escutar", "Deixar a pessoa falar e confirmar o que ela precisa."],
        ["Informar", "Linguagem clara, informação correta, sem jargão."],
        ["Encaminhar", "Setor certo, protocolo, prazo. Nunca 'empurrar' sem orientar."],
        ["Acompanhar", "Registrar e dar retorno quando prometido."],
      ] },
      { tipo: "mapa", titulo: "Lei 13.460/2017 (usuário do serviço público)", raiz: "Direitos do usuário", ramos: [
        ["Carta de Serviços", "Diz quais serviços existem, como acessar e os padrões de qualidade."],
        ["Ouvidoria", "Resposta conclusiva em até 30 dias, prorrogável uma vez por mais 30."],
        ["Manifestações", "Reclamação, denúncia, sugestão, elogio e outros pronunciamentos."],
        ["Conselhos de usuários", "Participação no acompanhamento e avaliação dos serviços."],
      ] },
    ],
    exemplos: [
      ["Um cidadão chega nervoso, falando alto.", "Manter a calma, ouvir sem interromper, não levar para o lado pessoal e oferecer solução ou encaminhamento."],
      ["Um conhecido pede para passar na frente da fila.", "Recusar com educação: favorecer amigos fere a impessoalidade."],
      ["Você não sabe a resposta para a dúvida do cidadão.", "Não inventar. Buscar a informação ou encaminhar ao setor competente."],
    ],
    pegadinhas: [
      ["A ouvidoria pode prorrogar o prazo quantas vezes precisar.", "Só UMA vez, por igual período e com justificativa (30 + 30)."],
      ["Bom atendimento é dizer sim a tudo o que o cidadão pede.", "É informar certo e encaminhar bem, sem prometer o que não depende de você."],
    ],
  },

  "Arquivologia": {
    abre: "Toda Prefeitura produz papel e arquivos digitais sem parar. A arquivologia ensina onde guardar cada documento, por quanto tempo e quando ele pode ser eliminado ou deve ser guardado para sempre.",
    esquemas: [
      { tipo: "etapas", titulo: "Teoria das três idades", passos: [
        ["Corrente", "Uso frequente, fica perto de quem produziu."],
        ["Intermediário", "Pouco uso, aguarda o prazo da tabela de temporalidade."],
        ["Destinação", "Eliminação OU recolhimento ao arquivo permanente."],
        ["Permanente", "Valor histórico, probatório e informativo. Guardado para sempre."],
      ] },
      { tipo: "mapa", titulo: "Métodos de arquivamento", raiz: "Como ordenar", ramos: [
        ["Alfabético", "Pelo nome (pessoa, empresa)."],
        ["Numérico", "Pelo número (processo, protocolo). Inclui o cronológico e o dígito-terminal."],
        ["Geográfico", "Por local (cidade, bairro, estado)."],
        ["Por assunto (ideográfico)", "Pelo tema do documento."],
      ] },
    ],
    exemplos: [
      ["Processos do ano em andamento no setor de protocolo.", "Arquivo corrente."],
      ["Contratos já encerrados, guardados até o fim do prazo legal.", "Arquivo intermediário."],
      ["Atas da fundação de um bairro e plantas antigas da cidade.", "Arquivo permanente."],
      ["Misturar numa mesma pasta documentos de duas secretarias diferentes.", "Fere o princípio da proveniência (respeito aos fundos)."],
    ],
    pegadinhas: [
      ["Documento de guarda permanente pode ser eliminado depois de digitalizado.", "Permanente é para sempre. Não se elimina."],
      ["A fase do documento depende da data em que foi produzido.", "Depende da frequência de uso e do valor do documento, definidos na tabela de temporalidade."],
    ],
  },

  "Redação oficial": {
    abre: "Redação oficial é como a Prefeitura escreve: ofícios, comunicados e respostas ao cidadão. O que cai é o Manual de Redação da Presidência da República (3ª edição): os atributos do texto, o padrão ofício e, principalmente, os pronomes de tratamento.",
    esquemas: [
      { tipo: "etapas", titulo: "Partes do ofício (padrão ofício)", passos: [
        ["Tipo e número", "Ex.: Ofício nº 123/2026/SMAP."],
        ["Local e data", "Curitiba, 25 de novembro de 2026."],
        ["Endereçamento", "Nome, cargo e endereço do destinatário."],
        ["Assunto", "Resumo do tema em poucas palavras."],
        ["Texto", "Introdução, desenvolvimento e conclusão."],
        ["Fecho", "Respeitosamente (superior) ou Atenciosamente (mesma hierarquia ou inferior)."],
        ["Assinatura", "Nome e cargo de quem assina."],
      ] },
      { tipo: "comparar", titulo: "Vossa × Sua", cols: [
        ["Vossa Excelência", ["Você fala COM a autoridade", "'Vossa Excelência sabe que...'", "Verbo na 3ª pessoa"]],
        ["Sua Excelência", ["Você fala DA autoridade", "'Sua Excelência, o Prefeito, chegou'", "Verbo na 3ª pessoa"]],
      ] },
    ],
    exemplos: [
      ["Ofício ao Prefeito, de um servidor da Secretaria.", "Vocativo 'Senhor Prefeito,', tratamento Vossa Excelência e fecho 'Respeitosamente'."],
      ["Ofício entre dois diretores do mesmo nível.", "Vossa Senhoria e fecho 'Atenciosamente'."],
      ["'Vossa Excelência estais convidado.'", "Errado. Pronome de tratamento pede verbo na 3ª pessoa: 'Vossa Excelência está convidado'."],
    ],
    pegadinhas: [
      ["Usa-se 'vosso' com Vossa Senhoria: 'Vossa Senhoria enviou vosso relatório'.", "O possessivo também vai para a 3ª pessoa: 'seu relatório'."],
      ["'Ilustríssimo Senhor' e 'Digníssimo' continuam obrigatórios.", "Foram abolidos nas comunicações oficiais."],
      ["O adjetivo concorda com 'Excelência' (feminino): 'Vossa Excelência está cansada' para um homem.", "Concorda com o sexo da pessoa: 'Vossa Excelência está cansado'."],
    ],
  },

  "Métodos de pesquisa": {
    abre: "Antes de decidir, a Administração precisa saber o que está acontecendo: quantos atendimentos houve, por que o cidadão reclama, o que outros municípios fazem. Métodos de pesquisa são as formas de descobrir isso com organização.",
    esquemas: [
      { tipo: "comparar", titulo: "Quanto ao objetivo", cols: [
        ["Exploratória", ["Tema pouco conhecido", "Busca CONHECER", "Gera hipóteses"]],
        ["Descritiva", ["Mostra COMO é", "Características de um grupo", "Ex.: perfil dos usuários"]],
        ["Explicativa", ["Busca o PORQUÊ", "Identifica causas", "A mais aprofundada"]],
      ] },
      { tipo: "comparar", titulo: "Quanto à abordagem e à fonte", cols: [
        ["Qualitativa", ["Interpreta opiniões e significados", "Entrevistas abertas, observação"]],
        ["Quantitativa", ["Mede com números", "Questionário fechado, estatística"]],
        ["Bibliográfica × documental", ["Bibliográfica: livros e artigos já analisados", "Documental: documentos sem tratamento (relatórios, planilhas)"]],
      ] },
    ],
    exemplos: [
      ["Contar quantos atendimentos o protocolo fez por mês em 2026.", "Pesquisa quantitativa e descritiva."],
      ["Entrevistar cidadãos para entender por que não usam o aplicativo da Prefeitura.", "Pesquisa qualitativa, com objetivo explicativo."],
      ["Analisar relatórios internos e planilhas da Secretaria.", "Pesquisa documental."],
    ],
    pegadinhas: [
      ["Questionário e formulário são a mesma coisa.", "Questionário a pessoa responde sozinha. Formulário é preenchido pelo pesquisador, perguntando."],
      ["Pesquisa em livros e artigos científicos é documental.", "É BIBLIOGRÁFICA. Documental usa material sem tratamento analítico."],
    ],
  },

  "Orçamento público": {
    abre: "Orçamento é o plano de quanto a Prefeitura vai arrecadar e em que vai gastar. Ele nasce de três leis encadeadas, todas propostas pelo Executivo: o PPA planeja 4 anos, a LDO escolhe as prioridades do ano seguinte e a LOA traz os números do ano.",
    esquemas: [
      { tipo: "etapas", titulo: "As três leis, uma dentro da outra", passos: [
        ["PPA", "Plano plurianual: diretrizes, objetivos e metas para 4 anos."],
        ["LDO", "Metas e prioridades do ano seguinte. Orienta a elaboração da LOA."],
        ["LOA", "Orçamento anual: estima a receita e fixa a despesa."],
      ] },
      { tipo: "mapa", titulo: "Princípios orçamentários", raiz: "Princípios", ramos: [
        ["Anualidade", "O orçamento vale para um exercício (o ano civil)."],
        ["Universalidade", "TODAS as receitas e despesas entram na LOA."],
        ["Unidade", "Uma só lei orçamentária por ente."],
        ["Exclusividade", "A LOA só trata de receita e despesa (exceto créditos suplementares e operações de crédito)."],
      ] },
    ],
    exemplos: [
      ["A LOA traz um artigo mudando o horário de funcionamento do comércio.", "Fere o princípio da exclusividade: assunto estranho ao orçamento."],
      ["O prefeito quer saber quais obras serão prioridade no ano que vem.", "Isso está na LDO."],
      ["Uma secretaria tem uma despesa fora do orçamento, 'por fora'.", "Fere a universalidade: toda despesa deve estar na LOA."],
    ],
    pegadinhas: [
      ["As leis orçamentárias são de iniciativa do Legislativo.", "Iniciativa é do EXECUTIVO. O Legislativo discute, emenda e aprova."],
      ["A LDO vale por 4 anos.", "Quem vale 4 anos é o PPA. LDO e LOA são anuais."],
    ],
  },

  "Gestão de pessoas": {
    abre: "Gestão de pessoas é como a organização atrai, desenvolve e mantém quem trabalha nela. Na prova, quase sempre aparecem as teorias de motivação (Maslow e Herzberg) e os estilos de liderança.",
    esquemas: [
      { tipo: "etapas", titulo: "Pirâmide de Maslow (da base ao topo)", passos: [
        ["Fisiológicas", "Comer, dormir, descansar."],
        ["Segurança", "Estabilidade, proteção, salário garantido."],
        ["Sociais", "Amizade, pertencer a um grupo."],
        ["Estima", "Reconhecimento, status, respeito."],
        ["Autorrealização", "Desenvolver todo o potencial."],
      ] },
      { tipo: "comparar", titulo: "Herzberg: dois fatores", cols: [
        ["Higiênicos", ["Salário, condições, chefia, regras", "Evitam a INSATISFAÇÃO", "Não motivam sozinhos"]],
        ["Motivacionais", ["Reconhecimento, responsabilidade, crescimento", "Geram SATISFAÇÃO", "Ligados ao conteúdo do trabalho"]],
      ] },
    ],
    exemplos: [
      ["O servidor recebe aumento, mas continua desmotivado.", "Herzberg: salário é fator higiênico. Tira a insatisfação, mas não motiva."],
      ["O chefe decide tudo sozinho e só comunica.", "Liderança autocrática."],
      ["A equipe decide junto com o chefe como organizar o atendimento.", "Liderança democrática."],
      ["Recrutar e selecionar novos servidores.", "Processo de AGREGAR pessoas."],
    ],
    pegadinhas: [
      ["Na pirâmide de Maslow, estima vem antes de sociais.", "Ordem: fisiológicas, segurança, SOCIAIS, ESTIMA, autorrealização."],
      ["Para Herzberg, salário alto é fator motivacional.", "Salário é HIGIÊNICO."],
    ],
  },

  // ── Legislação
  "CF: princípios fundamentais (arts. 1º a 4º)": {
    abre: "Os quatro primeiros artigos da Constituição dizem o que o Brasil É (fundamentos), como se divide o poder, aonde o país QUER chegar (objetivos) e como se relaciona com outros países. A FAFIPA troca um pelo outro para confundir.",
    esquemas: [
      { tipo: "comparar", titulo: "Fundamento × Objetivo", cols: [
        ["Fundamentos (art. 1º)", ["SOberania", "CIdadania", "DIgnidade da pessoa humana", "VAlores sociais do trabalho e da livre iniciativa", "PLUralismo político"]],
        ["Objetivos (art. 3º)", ["CONSTRUIR sociedade livre, justa e solidária", "GARANTIR o desenvolvimento nacional", "ERRADICAR a pobreza e reduzir desigualdades", "PROMOVER o bem de todos"]],
      ] },
    ],
    exemplos: [
      ["'Erradicar a pobreza' é fundamento ou objetivo?", "Objetivo: começa com verbo e é algo que o país quer alcançar."],
      ["'Pluralismo político' é fundamento ou objetivo?", "Fundamento (art. 1º, V)."],
      ["'Concessão de asilo político' aparece onde?", "Nos princípios das relações internacionais (art. 4º)."],
    ],
    pegadinhas: [
      ["A dignidade da pessoa humana é objetivo da República.", "É FUNDAMENTO (art. 1º, III)."],
      ["Os Poderes são independentes e hierarquizados.", "São independentes e HARMÔNICOS entre si (art. 2º)."],
    ],
  },

  "CF: direitos e garantias (arts. 5º a 17)": {
    abre: "Do art. 5º ao 17 estão os direitos de cada pessoa: proteção da casa, direitos sociais, nacionalidade e direitos políticos. A prova adora números: idades mínimas, horários e quem pode votar.",
    esquemas: [
      { tipo: "etapas", titulo: "Idades mínimas para cargos (art. 14)", passos: [
        ["35 anos", "Presidente, Vice-Presidente e Senador."],
        ["30 anos", "Governador e Vice-Governador."],
        ["21 anos", "Deputado, Prefeito, Vice-Prefeito e juiz de paz."],
        ["18 anos", "Vereador."],
      ] },
      { tipo: "comparar", titulo: "Entrar na casa sem consentimento (art. 5º, XI)", cols: [
        ["A qualquer hora", ["Flagrante delito", "Desastre", "Prestar socorro"]],
        ["Só durante o DIA", ["Por determinação judicial"]],
      ] },
    ],
    exemplos: [
      ["Um jovem de 17 anos quer votar.", "Pode: o voto é facultativo entre 16 e 18 anos."],
      ["Um vereador de 18 anos.", "Pode: é a idade mínima para vereador."],
      ["Policial com mandado judicial quer entrar numa casa às 23h.", "Não pode: ordem judicial só durante o dia. À noite só em flagrante, desastre ou socorro."],
    ],
    pegadinhas: [
      ["Prefeito precisa ter 30 anos.", "Prefeito: 21 anos. 30 é para governador."],
      ["O voto é facultativo a partir dos 65 anos.", "Facultativo para MAIORES DE 70."],
    ],
  },

  "CF: organização do Estado (arts. 18, 19, 29, 30)": {
    abre: "O Brasil é uma federação: União, Estados, DF e Municípios, todos autônomos. Para o concurso de Curitiba, o mais importante é o Município: como é regido (Lei Orgânica) e o que ele pode fazer sozinho (art. 30).",
    esquemas: [
      { tipo: "etapas", titulo: "Como se aprova a Lei Orgânica (art. 29)", passos: [
        ["2 turnos", "Votada duas vezes na Câmara Municipal."],
        ["10 dias", "Intervalo mínimo entre os turnos."],
        ["2/3", "Aprovada por dois terços dos vereadores."],
      ] },
      { tipo: "mapa", titulo: "O que o Município faz (art. 30)", raiz: "Competências do Município", ramos: [
        ["Interesse local", "Legislar sobre assuntos de interesse local."],
        ["Suplementar", "Completar a lei federal e a estadual no que couber."],
        ["Tributos", "Instituir e arrecadar os seus tributos."],
        ["Serviços locais", "Organizar serviços públicos locais, incluindo o transporte coletivo (essencial)."],
      ] },
    ],
    exemplos: [
      ["Quem organiza as linhas de ônibus de Curitiba?", "O Município: transporte coletivo é serviço de interesse local, de caráter essencial."],
      ["Curitiba tem segundo turno para prefeito?", "Sim: só municípios com mais de 200 mil eleitores têm segundo turno."],
    ],
    pegadinhas: [
      ["A Lei Orgânica é aprovada por maioria absoluta, em turno único.", "São 2 turnos, interstício de 10 dias e 2/3 dos membros."],
      ["Os Estados podem recusar fé a documentos públicos de outro Estado.", "É vedado (art. 19, II)."],
    ],
  },

  "CF: Administração Pública (arts. 37 a 41)": {
    abre: "Estes artigos são o 'estatuto' de quem vai trabalhar na Prefeitura: como se entra (concurso), quanto tempo o concurso vale, o que pode acumular e quando o servidor fica estável. É o tema de Legislação que mais cai para cargo administrativo.",
    esquemas: [
      { tipo: "etapas", titulo: "Do concurso à estabilidade", passos: [
        ["Concurso", "Provas ou provas e títulos (art. 37, II)."],
        ["Validade", "Até 2 anos, prorrogável UMA vez por igual período."],
        ["Posse e exercício", "Começa o estágio probatório."],
        ["Estabilidade", "Após 3 anos de efetivo exercício + avaliação especial de desempenho (art. 41)."],
      ] },
      { tipo: "comparar", titulo: "Pode acumular? (com horários compatíveis)", cols: [
        ["Pode", ["2 cargos de professor", "1 de professor + 1 de qualquer natureza (EC 138/2025)", "2 de profissional de saúde com profissão regulamentada"]],
        ["Não pode", ["2 cargos administrativos", "Qualquer combinação fora da lista"]],
      ] },
    ],
    exemplos: [
      ["Um concurso com validade de 1 ano pode ser prorrogado por 2?", "Não. A prorrogação é por IGUAL período: 1 ano."],
      ["Servidor nomeado há 2 anos pode ser exonerado por mau desempenho?", "Ainda está no estágio probatório; a estabilidade só vem após 3 anos e avaliação."],
      ["Um servidor eleito vereador.", "Se houver compatibilidade de horários, acumula cargo e mandato e recebe os dois (art. 38)."],
    ],
    pegadinhas: [
      ["O concurso vale até 2 anos, prorrogável por mais 4.", "Prorrogável UMA vez por IGUAL período."],
      ["Função de confiança pode ser dada a quem não é servidor efetivo.", "Função de confiança é EXCLUSIVA de quem ocupa cargo efetivo."],
      ["A estabilidade vem após 2 anos de exercício.", "Após 3 anos (EC 19/1998)."],
    ],
  },

  "CF: Poder Legislativo (arts. 44 a 75)": {
    abre: "O Poder Legislativo faz as leis e fiscaliza o Executivo. A prova cobra a composição (Câmara e Senado), mandatos, quóruns e o funcionamento das CPIs e das medidas provisórias.",
    esquemas: [
      { tipo: "comparar", titulo: "Câmara × Senado", cols: [
        ["Câmara dos Deputados", ["Representa o POVO", "Sistema proporcional", "Mandato de 4 anos"]],
        ["Senado Federal", ["Representa os ESTADOS e o DF", "Sistema majoritário, 3 por Estado", "Mandato de 8 anos, renova 1/3 e 2/3"]],
      ] },
      { tipo: "mapa", titulo: "Números que caem", raiz: "Quóruns e prazos", ramos: [
        ["Emenda à CF", "2 turnos em cada Casa, aprovação por 3/5."],
        ["CPI", "Requerimento de 1/3, fato determinado e prazo certo."],
        ["Lei complementar", "Maioria absoluta."],
        ["Medida provisória", "60 dias + 60 dias."],
      ] },
    ],
    exemplos: [
      ["Quantos senadores tem o Paraná?", "3, como todo Estado."],
      ["Deputados querem abrir uma CPI.", "Precisam de 1/3 dos membros da Casa, fato determinado e prazo certo."],
    ],
    pegadinhas: [
      ["Emenda constitucional é aprovada por 2/3 em turno único.", "3/5, em 2 turnos, em cada Casa."],
      ["CPI pode julgar e condenar.", "CPI investiga. As conclusões vão ao Ministério Público."],
    ],
  },

  "Improbidade (Lei 8.429)": {
    abre: "Improbidade é a desonestidade do agente público com a coisa pública. Desde a Lei 14.230/2021, só conta se houve INTENÇÃO (dolo). São três tipos, e cada um tem sua pena.",
    esquemas: [
      { tipo: "comparar", titulo: "Os 3 tipos e suas sanções", cols: [
        ["Art. 9º Enriquecimento ilícito", ["Agente ganha vantagem indevida", "Direitos políticos suspensos até 14 anos", "Proibição de contratar até 14 anos"]],
        ["Art. 10 Prejuízo ao erário", ["Causa perda ao patrimônio público", "Direitos políticos suspensos até 12 anos", "Proibição de contratar até 12 anos"]],
        ["Art. 11 Violar princípios", ["Rol taxativo de condutas", "Multa até 24x a remuneração", "Proibição de contratar até 4 anos"]],
      ] },
    ],
    exemplos: [
      ["Servidor recebe dinheiro para liberar um alvará.", "Enriquecimento ilícito (art. 9º)."],
      ["Servidor, de propósito, compra muito acima do preço e o Município perde dinheiro.", "Prejuízo ao erário (art. 10), se houve dolo."],
      ["Servidor erra uma interpretação da lei, sem má-fé.", "Não é improbidade: divergência de interpretação sem dolo não configura."],
    ],
    pegadinhas: [
      ["Ainda existe improbidade culposa no prejuízo ao erário.", "Depois de 2021, só existe improbidade DOLOSA."],
      ["Violação de princípios gera suspensão dos direitos políticos.", "No art. 11 não há suspensão dos direitos políticos."],
      ["A ação prescreve em 5 anos.", "Prescreve em 8 anos (art. 23)."],
    ],
  },

  "Acesso à informação (LAI)": {
    abre: "Pela LAI, a informação pública pertence ao cidadão. Qualquer pessoa pode pedir, sem dizer por quê, e o órgão tem prazo para responder. Sigilo é exceção e tem prazo para acabar.",
    esquemas: [
      { tipo: "etapas", titulo: "Caminho de um pedido", passos: [
        ["Pedido", "Qualquer interessado, sem precisar explicar o motivo."],
        ["Resposta", "Na hora ou em até 20 dias, prorrogáveis por mais 10 (com justificativa)."],
        ["Negou?", "Recurso em 10 dias da ciência da decisão."],
      ] },
      { tipo: "comparar", titulo: "Prazos de sigilo (art. 24)", cols: [
        ["Ultrassecreta", ["25 anos"]],
        ["Secreta", ["15 anos"]],
        ["Reservada", ["5 anos"]],
      ] },
    ],
    exemplos: [
      ["Um cidadão pede os gastos com combustível da frota e o servidor pergunta 'para quê?'.", "Não pode exigir o motivo (art. 10, §3º)."],
      ["O site da Prefeitura publica as licitações sem ninguém pedir.", "Transparência ATIVA."],
      ["O cidadão pede cópias impressas de 500 páginas.", "A busca é gratuita, mas pode ser cobrado o custo da reprodução."],
    ],
    pegadinhas: [
      ["O prazo de resposta é de 30 dias.", "Até 20 dias, prorrogáveis por mais 10."],
      ["Informação pessoal fica restrita por 25 anos.", "Por até 100 anos (art. 31)."],
    ],
  },

  "Prioridade de atendimento (Lei 10.048)": {
    abre: "No balcão da Prefeitura, algumas pessoas têm direito a ser atendidas primeiro, de forma imediata. O Agente Administrativo precisa saber quem são, porque vai aplicar isso todo dia.",
    esquemas: [
      { tipo: "mapa", titulo: "Quem tem prioridade", raiz: "Atendimento prioritário", ramos: [
        ["Pessoas com deficiência", "Inclui pessoas com transtorno do espectro autista."],
        ["Idosos", "60 anos ou mais."],
        ["Gestantes e lactantes", "Também pessoas com crianças de colo."],
        ["Obesos e mobilidade reduzida", "Entre outros grupos incluídos por leis posteriores, como doadores de sangue."],
      ] },
    ],
    exemplos: [
      ["Uma senhora de 62 anos chega ao protocolo.", "Tem prioridade: idoso é a partir de 60 anos."],
      ["Um pai com um bebê no colo.", "Tem prioridade: pessoa com criança de colo."],
    ],
    pegadinhas: [
      ["Idoso tem prioridade a partir de 65 anos.", "A partir de 60. Os 80+ têm prioridade especial pelo Estatuto da Pessoa Idosa."],
      ["A lei vale só para órgãos públicos.", "Vale também para concessionárias de serviço público e instituições financeiras."],
    ],
  },

  ECA: {
    abre: "O ECA protege crianças e adolescentes com prioridade absoluta. No atendimento público, isso significa: eles vêm primeiro no socorro, no atendimento e no orçamento.",
    esquemas: [
      { tipo: "comparar", titulo: "Quem é quem (art. 2º)", cols: [
        ["Criança", ["Até 12 anos INCOMPLETOS", "Até 11 anos e 364 dias"]],
        ["Adolescente", ["De 12 a 18 anos", "Excepcionalmente o ECA alcança 18 a 21"]],
      ] },
      { tipo: "mapa", titulo: "Absoluta prioridade inclui (art. 4º)", raiz: "Prioridade absoluta", ramos: [
        ["Socorro", "Primazia de receber proteção e socorro."],
        ["Atendimento", "Precedência nos serviços públicos."],
        ["Políticas", "Preferência nas políticas sociais."],
        ["Recursos", "Destinação privilegiada de recursos públicos."],
      ] },
    ],
    exemplos: [
      ["Uma pessoa de 12 anos completos é criança ou adolescente?", "Adolescente."],
      ["De quem é o dever de garantir os direitos da criança?", "Da família, da comunidade, da sociedade em geral e do poder público."],
    ],
    pegadinhas: [
      ["Criança é quem tem até 12 anos completos.", "Até 12 anos INCOMPLETOS."],
      ["Garantir os direitos da criança é dever só do Estado.", "É dever da família, comunidade, sociedade e poder público."],
    ],
  },

  "LINDB (arts. 20 a 30)": {
    abre: "Estes artigos da LINDB foram incluídos em 2018 para dar segurança ao gestor público: decidir olhando as consequências reais e só punir pessoalmente quem agiu com dolo ou erro grosseiro.",
    esquemas: [
      { tipo: "mapa", titulo: "Os artigos que caem", raiz: "LINDB 20 a 30", ramos: [
        ["Art. 20", "Não decidir só com valores abstratos: considerar as consequências práticas."],
        ["Art. 22", "Considerar os obstáculos e dificuldades reais do gestor."],
        ["Art. 23", "Interpretação nova que cria dever pede regime de transição."],
        ["Art. 26", "Compromisso para eliminar irregularidade ou incerteza."],
        ["Art. 28", "Agente responde pessoalmente só por DOLO ou ERRO GROSSEIRO."],
      ] },
    ],
    exemplos: [
      ["Um servidor dá um parecer técnico razoável que depois se mostra errado.", "Não responde pessoalmente: não houve dolo nem erro grosseiro (art. 28)."],
      ["O Tribunal de Contas decide cancelar um contrato sem avaliar o impacto na população.", "Contraria o art. 20: é preciso considerar as consequências práticas."],
    ],
    pegadinhas: [
      ["O agente responde pessoalmente por qualquer erro.", "Só por DOLO ou ERRO GROSSEIRO."],
    ],
  },

  "LGPD (Cap. IV)": {
    abre: "A Prefeitura guarda dados de milhares de cidadãos: CPF, endereço, saúde. O Capítulo IV da LGPD diz quando o poder público pode tratar esses dados (para cumprir sua função) e quem responde por isso (o encarregado).",
    esquemas: [
      { tipo: "mapa", titulo: "Poder público e dados pessoais", raiz: "LGPD, arts. 23 a 32", ramos: [
        ["Finalidade pública", "Tratar dados para executar competências e atribuições legais."],
        ["Transparência", "Informar a base legal, a finalidade e os procedimentos."],
        ["Encarregado", "Pessoa indicada para cuidar do tratamento de dados."],
        ["Interoperável", "Dados em formato estruturado para uso compartilhado (art. 25)."],
        ["ANPD", "Pode pedir informações e sugerir medidas aos órgãos."],
      ] },
    ],
    exemplos: [
      ["A Secretaria de Saúde usa o CPF do paciente para agendar consultas.", "Permitido: finalidade pública, para executar a competência legal."],
      ["Um servidor consulta o endereço de um vizinho no sistema por curiosidade.", "Proibido: não há finalidade pública."],
    ],
    pegadinhas: [
      ["O poder público pode vender bancos de dados a empresas.", "Não. O tratamento é para atender a finalidade pública."],
    ],
  },

  "Leis de Curitiba": {
    abre: "Esta é a parte que só quem estuda para Curitiba sabe. São quatro leis: a Lei Orgânica (a 'constituição' da cidade), o processo administrativo (Lei 16.466/2024), o Estatuto dos servidores (Lei 1.656/1958) e a organização do Executivo (Lei 7.671/1991).",
    esquemas: [
      { tipo: "mapa", titulo: "As leis da cidade", raiz: "Leis de Curitiba", ramos: [
        ["Lei Orgânica (1990)", "Autonomia política, administrativa e financeira. Poderes: Câmara e Prefeito. Data magna: 29 de março."],
        ["Lei 16.466/2024", "Processo administrativo eletrônico. Decisão em 30 dias úteis, recurso em 15 dias úteis."],
        ["Lei 1.656/1958", "Estatuto: deveres, proibições, penas e PAD."],
        ["Lei 7.671/1991", "Organização do Executivo: administração direta e indireta."],
      ] },
      { tipo: "etapas", titulo: "Penas do Estatuto (da mais leve à mais grave)", passos: [
        ["Advertência", ""], ["Repreensão", ""], ["Suspensão", "Até 90 dias."], ["Multa", ""], ["Destituição de função", ""], ["Demissão", ""],
      ] },
    ],
    exemplos: [
      ["Um cidadão perdeu o prazo de recurso num processo da Prefeitura. Quanto tempo ele tinha?", "15 dias úteis, recurso único (Lei 16.466/2024)."],
      ["Um processo foi aberto em 22 de dezembro. O prazo corre no fim do ano?", "Não: os prazos ficam suspensos de 20/12 a 20/01."],
    ],
    pegadinhas: [
      ["A suspensão no Estatuto pode chegar a 180 dias.", "Até 90 dias."],
      ["Na Lei 16.466, os prazos são em dias corridos.", "São em dias ÚTEIS."],
    ],
  },
};
