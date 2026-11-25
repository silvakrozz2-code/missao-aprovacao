// Aulas (resumo, o que mais cai, macete) dos temas que estavam no edital do app sem aula.
// Formato igual ao dos outros resumos: { t: [linhas], cai, macete }. Os resumos que já existem têm prioridade.

const classes = {
  t: [
    "São 10 classes de palavras. VARIÁVEIS (mudam em gênero, número, pessoa ou tempo): substantivo, adjetivo, artigo, numeral, pronome e verbo.",
    "INVARIÁVEIS (não flexionam): advérbio, preposição, conjunção e interjeição.",
    "Substantivo dá nome (casa, Curitiba, saudade). Adjetivo dá característica ao substantivo (casa ANTIGA). Artigo vem antes do substantivo (o, a, um, uma).",
    "Pronome substitui ou acompanha o substantivo: pessoais (eu, ele, o, lhe), possessivos (meu), demonstrativos (este, esse, aquele), relativos (que, o qual, cujo, onde), indefinidos (alguém, nenhum).",
    "Advérbio modifica verbo, adjetivo ou outro advérbio e indica circunstância: tempo (ontem), lugar (aqui), modo (rapidamente), intensidade (muito), negação (não).",
    "Preposição liga palavras (a, de, em, para, por, com, sem). Conjunção liga orações: coordenativas (e, mas, ou, logo, pois) e subordinativas (que, porque, embora, se, quando).",
    "A classe depende do USO na frase: 'O JANTAR está pronto' (substantivo) × 'Vou JANTAR' (verbo); 'Ela fala BAIXO' (advérbio) × 'homem BAIXO' (adjetivo).",
  ],
  cai: "Mudança de classe pelo contexto (palavra substantivada), diferença entre advérbio e adjetivo, e classificar o 'que' e o 'se'.",
  macete: "Para saber se é adjetivo ou advérbio, tente flexionar: se dá para passar para o plural junto com o substantivo (homens baixos), é adjetivo. Se não flexiona (eles falam baixo), é advérbio.",
};

const ortografia = {
  t: [
    "Oxítonas (tônica na última sílaba) levam acento quando terminam em A, E, O (seguidas ou não de S) e EM, ENS: sofá, café, avô, também, parabéns.",
    "Paroxítonas (tônica na penúltima) levam acento quando NÃO terminam em A, E, O, EM, ENS: fácil, açúcar, táxi, vírus, órfão, história (terminada em ditongo).",
    "Proparoxítonas (tônica na antepenúltima) são TODAS acentuadas: lâmpada, médico, último.",
    "Novo Acordo: sem acento nos ditongos abertos EI e OI de paroxítonas (ideia, assembleia, heroico), sem trema (linguiça, frequente) e sem acento em VOO e LEEM.",
    "Acento diferencial que ficou: PÔDE (passado) × PODE (presente), PÔR (verbo) × POR (preposição), e TÊM / VÊM no plural (eles têm, eles vêm).",
    "Hífen com prefixo: usa quando a palavra seguinte começa com H (anti-higiênico) ou com a MESMA vogal em que o prefixo termina (micro-ondas, anti-inflamatório). Vogais diferentes juntam: autoestima, infraestrutura.",
    "Prefixo terminado em vogal + palavra com R ou S: dobra a letra (antirracismo, contrassenso).",
    "Usos que mais caem: MAS (oposição) × MAIS (quantidade); MAL (oposto de bem) × MAU (oposto de bom); ONDE (lugar fixo) × AONDE (com verbo de movimento: aonde você vai?).",
  ],
  cai: "Regras de acentuação por posição da sílaba tônica, o que mudou no Novo Acordo (ideia, voo, linguiça) e hífen com prefixos.",
  macete: "MAL × MAU: troque por BEM e BOM. Se couber BEM, é MAL (dormiu mal / dormiu bem). Se couber BOM, é MAU (mau humor / bom humor).",
};

export const resumosFaltantes = {
  concurso: {
    "Classes de palavras": classes,
    "Funções sintáticas": {
      t: [
        "SUJEITO é o termo sobre o qual se declara algo e concorda com o verbo. Para achar, pergunte ao verbo 'quem?' ou 'o quê?'. Pode ser simples, composto, oculto (desinencial) ou indeterminado; há orações sem sujeito (Choveu. Há provas. Faz dois anos.).",
        "PREDICADO é o que se declara do sujeito. Verbal (núcleo é um verbo de ação), nominal (verbo de ligação + predicativo: 'O servidor está cansado') ou verbo-nominal (os dois juntos).",
        "OBJETO DIRETO completa verbo transitivo direto SEM preposição obrigatória (Comprei o livro). OBJETO INDIRETO completa com preposição (Preciso DE ajuda).",
        "COMPLEMENTO NOMINAL completa o sentido de um nome (substantivo, adjetivo ou advérbio) com preposição: 'respeito ÀS LEIS', 'favorável AO PROJETO'.",
        "ADJUNTO ADNOMINAL caracteriza ou determina um substantivo (artigo, adjetivo, pronome, numeral, locução adjetiva): 'O NOVO edital DA PREFEITURA'.",
        "ADJUNTO ADVERBIAL indica circunstância (tempo, lugar, modo, causa...): 'Saiu CEDO'. AGENTE DA PASSIVA é quem pratica a ação na voz passiva: 'A lei foi aprovada PELA CÂMARA'.",
        "APOSTO explica ou resume um termo e costuma vir entre vírgulas: 'Curitiba, CAPITAL DO PARANÁ, ...'. VOCATIVO é o chamamento e fica sempre isolado por vírgula: 'SENHOR PREFEITO, ...'.",
      ],
      cai: "Diferença entre complemento nominal e adjunto adnominal, achar o sujeito (inclusive o posposto) e separar aposto de vocativo.",
      macete: "Complemento nominal × adjunto adnominal: se o termo com preposição SOFRE a ação (respeito às leis: as leis são respeitadas), é complemento nominal. Se PRATICA ou possui (a decisão do juiz: o juiz decide), é adjunto adnominal.",
    },
    "Fonologia e ortografia": {
      t: [
        "Fonema é o SOM; letra é o SINAL escrito. 'Táxi' tem 4 letras e 5 fonemas (o X vale /ks/). 'Chave' tem 5 letras e 4 fonemas (CH é um som só).",
        "DÍGRAFO: duas letras para um som (ch, lh, nh, rr, ss, qu e gu antes de E/I, sc, sç, xc). ENCONTRO CONSONANTAL: duas consoantes com sons diferentes (pr, bl, tr).",
        "DITONGO: vogal + semivogal na mesma sílaba (pai, céu). TRITONGO: semivogal + vogal + semivogal (Paraguai). HIATO: vogais em sílabas diferentes (sa-ú-de, po-e-ta).",
        "Separação: nunca se separa ditongo nem tritongo; separam-se hiatos, RR, SS, SC, SÇ e XC (car-ro, pas-so, nas-cer, ex-ce-to).",
        ...ortografia.t.slice(0, 4),
        ortografia.t[7],
      ],
      cai: "Contar letras e fonemas, identificar dígrafo e hiato, separação silábica e regras de acentuação do Novo Acordo.",
      macete: "Dígrafo não 'soma som': se duas letras soam como uma (ch, lh, nh, qu), é dígrafo. Se cada uma soa (pr, bl), é encontro consonantal.",
    },
    "Variação e gêneros textuais": {
      t: [
        "Variação linguística é natural e não é 'erro'. Tipos: REGIONAL ou diatópica (lugar: 'guri', 'mandioca/aipim/macaxeira'), SOCIAL ou diastrática (grupo, idade, profissão), SITUACIONAL ou diafásica (formal × informal) e HISTÓRICA ou diacrônica (época: 'vossa mercê' → 'você').",
        "Norma-padrão é a referência para textos oficiais e para a prova, mas não é a única forma correta de falar. Julgar alguém pela fala é PRECONCEITO LINGUÍSTICO.",
        "Adequação: o bom uso depende da situação. Gíria cabe em conversa entre amigos; ofício para a prefeitura pede linguagem formal.",
        "TIPOS textuais são poucos e definidos pela estrutura: narrativo (fatos no tempo), descritivo (características), dissertativo-argumentativo (defende tese), expositivo (informa) e injuntivo (instrui, com verbos no imperativo).",
        "GÊNEROS textuais são incontáveis e ligados ao uso social: notícia, crônica, ofício, e-mail, receita, bula, edital, charge, artigo de opinião, resenha.",
        "Um gênero mistura tipos: a receita é injuntiva no modo de preparo e descritiva nos ingredientes; a notícia é narrativa e expositiva.",
      ],
      cai: "Identificar o tipo de variação num trecho e reconhecer o gênero pela finalidade (instruir, informar, opinar).",
      macete: "TIPO = como o texto se organiza (poucos, cabem na mão). GÊNERO = para que o texto serve no dia a dia (infinitos: bula, edital, meme).",
    },
    "Arquivos e pastas": {
      t: [
        "Arquivo guarda dados (texto, foto, planilha); pasta organiza arquivos e outras pastas. A EXTENSÃO depois do ponto diz o tipo: .docx (Word), .xlsx (Excel), .pdf, .jpg/.png (imagem), .txt, .zip (compactado), .exe (programa).",
        "CAMINHO mostra onde o arquivo está: C:\\Usuários\\Ana\\Documentos\\edital.pdf. No Windows a barra é a invertida (\\); no Linux é a normal (/).",
        "Nomes no Windows NÃO podem ter estes caracteres: \\ / : * ? \" < > |. Podem ter espaço, acento, hífen e ponto.",
        "Arrastar para pasta na MESMA unidade = MOVER. Para OUTRA unidade (pen drive) = COPIAR. Ctrl + arrastar força copiar; Shift + arrastar força mover.",
        "Delete manda para a LIXEIRA (dá para restaurar). Shift + Delete exclui direto, sem Lixeira. Arquivo apagado de pen drive ou rede não vai para a Lixeira.",
        "F2 renomeia. Ctrl + Shift + N cria nova pasta no Explorador. Win + E abre o Explorador de Arquivos.",
        "Compactar (.zip) junta vários arquivos e reduz o tamanho para enviar. Atalho na área de trabalho é só um link: apagar o atalho NÃO apaga o arquivo original.",
      ],
      cai: "Mover × copiar ao arrastar, Lixeira com Delete e Shift + Delete, caracteres proibidos em nomes e extensões de arquivo.",
      macete: "Mesma unidade, MUDA de lugar (move). Outra unidade, a cópia VIAJA e o original fica (copia).",
    },
  },

  npor: {
    "Ortografia e acentuação": ortografia,
    "Morfologia (classes de palavras)": classes,
    "Linha do tempo": {
      t: [
        "Colônia: 1500 chegada de Cabral; 1534 capitanias hereditárias; 1549 Governo-Geral (Tomé de Sousa funda Salvador, a primeira capital).",
        "1648 e 1649: Batalhas dos Guararapes contra os holandeses em Pernambuco. A primeira batalha (19 de abril de 1648) marca o Dia do Exército.",
        "1763: capital passa de Salvador para o Rio de Janeiro. 1789: Inconfidência Mineira (Tiradentes executado em 1792).",
        "Império: 1808 chegada da Família Real ao Rio; 1822 Independência (7 de setembro); 1824 primeira Constituição (com Poder Moderador); 1831 abdicação de D. Pedro I; 1840 Golpe da Maioridade (D. Pedro II).",
        "1864 a 1870: Guerra do Paraguai (Tríplice Aliança: Brasil, Argentina e Uruguai). Duque de Caxias é o patrono do Exército.",
        "Abolição em etapas: 1850 Lei Eusébio de Queirós (fim do tráfico), 1871 Lei do Ventre Livre, 1885 Lei dos Sexagenários, 1888 Lei Áurea (13 de maio).",
        "República: 1889 Proclamação (15 de novembro, Marechal Deodoro); 1891 primeira Constituição republicana; 1930 Revolução de 30 (Vargas); 1937 a 1945 Estado Novo.",
        "1942: Brasil entra na Segunda Guerra; a FEB luta na Itália (Monte Castelo, 1945). 1964: início do regime militar; 1985: volta do governo civil; 1988: Constituição Cidadã.",
      ],
      cai: "Ordem dos fatos (Independência antes da Abolição, que vem antes da República), datas-marco militares (Guararapes, Paraguai, FEB) e as Constituições.",
      macete: "Os 8 do Império: 1808 chega a corte, 1822 independência, 1888 abolição, 1889 república. Decore os quatro 8 e encaixe o resto entre eles.",
    },
  },

  enem: {
    "Gramática no texto": {
      t: [
        "O ENEM não pede regra decorada: pergunta qual EFEITO de sentido a escolha gramatical produz no texto.",
        "Coesão referencial: pronomes e sinônimos retomam termos para evitar repetição ('O prefeito chegou. ELE falou...'). A questão pede a que termo o pronome se refere.",
        "Conectivos mudam o sentido: MAS / PORÉM (oposição), POIS / PORQUE (causa ou explicação), PORTANTO / LOGO (conclusão), EMBORA (concessão), SE / CASO (condição).",
        "Pontuação também significa: aspas marcam ironia ou citação, travessão destaca uma explicação, reticências sugerem hesitação ou continuidade.",
        "Pessoa do discurso e verbo: 1ª pessoa aproxima o leitor; imperativo é marca de texto que instrui ou convence (anúncio, campanha).",
        "Variação linguística aparece em letra de música, tirinha e fala de personagem: a resposta certa costuma valorizar a adequação ao contexto, não 'corrigir' a fala.",
      ],
      cai: "Valor semântico de conectivos, referência de pronomes e efeito de sentido de escolhas como diminutivo, aspas e imperativo.",
      macete: "Troque o conectivo por outro da mesma família: se o sentido se mantém, você achou a relação. 'Estudou, MAS não passou' = 'estudou, PORÉM não passou' (oposição).",
    },
    "Literatura brasileira (ENEM)": {
      t: [
        "Quinhentismo (1500): textos de informação (Carta de Caminha) e de catequese (Anchieta). Barroco (1601, Prosopopeia): conflito fé × razão, Gregório de Matos.",
        "Arcadismo (1768): vida simples no campo, bucolismo (Cláudio Manuel da Costa, Tomás Antônio Gonzaga).",
        "Romantismo (1836): nacionalismo, indianismo (José de Alencar), ultrarromantismo e morte (Álvares de Azevedo), poesia social e abolicionista (Castro Alves).",
        "Realismo e Naturalismo (1881): crítica social e psicológica. Machado de Assis (Memórias Póstumas de Brás Cubas) e Aluísio Azevedo (O Cortiço). Parnasianismo: forma perfeita (Olavo Bilac). Simbolismo (1893): musicalidade (Cruz e Sousa).",
        "Modernismo começa na Semana de Arte Moderna de 1922: liberdade de forma, linguagem coloquial e cultura brasileira (Mário e Oswald de Andrade, Manuel Bandeira).",
        "Geração de 30: romance regionalista e social (Graciliano Ramos, Vidas Secas; Rachel de Queiroz; Jorge Amado) e poesia de Drummond. Geração de 45: Guimarães Rosa (linguagem inventiva) e Clarice Lispector (fluxo de consciência).",
        "O ENEM gosta de comparar épocas: um poema romântico ao lado de um moderno, ou um texto literário dialogando com uma canção atual (intertextualidade).",
      ],
      cai: "Reconhecer a escola pelas características do trecho, Modernismo de 1922 e de 30, e intertextualidade com textos atuais.",
      macete: "Linha do tempo pelos anos-marco: 1500, 1601, 1768, 1836, 1881, 1893, 1922. Quanto mais perto de 1922, mais 'livre' a forma.",
    },
    "História do Brasil (ENEM)": {
      t: [
        "Colônia: economia do açúcar no Nordeste com mão de obra escravizada africana; depois mineração em Minas Gerais no século XVIII. A riqueza seguia para Portugal (pacto colonial).",
        "Resistência: quilombos (Palmares, com Zumbi), revoltas indígenas e movimentos como a Inconfidência Mineira (1789) e a Conjuração Baiana (1798).",
        "Império (1822 a 1889): Constituição de 1824 com Poder Moderador; café no Sudeste; abolição lenta até a Lei Áurea (1888), sem integração dos libertos.",
        "República Velha (1889 a 1930): política do café com leite, coronelismo e voto de cabresto. Revoltas como Canudos e Revolta da Vacina (1904).",
        "Era Vargas (1930 a 1945): CLT (1943), voto feminino (1932), industrialização estatal e o autoritarismo do Estado Novo (1937).",
        "Ditadura militar (1964 a 1985): AI-5 (1968), censura e repressão; 'milagre econômico' com concentração de renda; Diretas Já (1984).",
        "Redemocratização: Constituição de 1988 amplia direitos sociais, reconhece terras indígenas e quilombolas e torna o racismo crime inafiançável.",
      ],
      cai: "Escravidão e suas heranças, trabalho e direitos na Era Vargas, ditadura militar e direitos garantidos pela Constituição de 1988.",
      macete: "O ENEM cobra a relação passado e presente: sempre pergunte 'que desigualdade de hoje nasceu disso?'.",
    },
    "Geografia do Brasil": {
      t: [
        "Biomas: Amazônia (maior floresta tropical), Cerrado (savana, 'berço das águas', avançado pela soja), Mata Atlântica (a mais devastada), Caatinga (semiárido, só brasileira), Pantanal (maior planície alagável) e Pampa (campos no RS).",
        "Clima: equatorial (quente e úmido o ano todo), tropical (verão chuvoso, inverno seco), semiárido (chuvas irregulares no sertão) e subtropical (no Sul, com estações mais marcadas).",
        "Urbanização acelerada a partir de 1950, puxada pelo êxodo rural. Hoje cerca de 85% da população vive em cidades, com problemas de moradia, mobilidade e periferização.",
        "Agropecuária: o agronegócio exporta soja, carne, milho e café, mas concentra terras. A agricultura familiar produz boa parte do alimento consumido no país.",
        "Matriz elétrica muito renovável, com destaque para as hidrelétricas, e crescimento da energia eólica (Nordeste) e solar. Impactos das usinas: alagamento e deslocamento de populações.",
        "Questões ambientais que mais caem: desmatamento e queimadas, ilhas de calor e enchentes nas cidades, e conflitos por terra com povos indígenas e quilombolas.",
      ],
      cai: "Biomas e seus impactos, urbanização e problemas urbanos, matriz energética e conflitos no campo.",
      macete: "Para questão ambiental, ligue sempre três coisas: atividade econômica, impacto e quem é afetado. A alternativa certa costuma ter as três.",
    },
    "História geral": {
      t: [
        "Antiguidade: Grécia (democracia em Atenas, só para cidadãos homens livres) e Roma (República, Império, direito romano).",
        "Idade Média: feudalismo com senhores, servos e Igreja forte; trabalho no campo e economia de subsistência.",
        "Idade Moderna: Renascimento (humanismo, ser humano no centro), Reforma Protestante (Lutero, 1517), Grandes Navegações e Absolutismo.",
        "Iluminismo: razão, liberdade e crítica ao absolutismo (Locke, Montesquieu com a separação dos três poderes, Rousseau). Inspirou a Revolução Francesa (1789): liberdade, igualdade e fraternidade.",
        "Revolução Industrial (Inglaterra, século XVIII): máquinas, fábricas, êxodo rural, jornadas longas e o surgimento do movimento operário.",
        "Século XX: Primeira Guerra (1914 a 1918), crise de 1929, nazifascismo, Segunda Guerra (1939 a 1945) e Guerra Fria (EUA capitalista × URSS socialista) até a queda do Muro de Berlim (1989).",
      ],
      cai: "Iluminismo e Revolução Francesa, Revolução Industrial e trabalho, regimes totalitários e Guerra Fria.",
      macete: "Montesquieu = três poderes (Executivo, Legislativo, Judiciário). Se a questão fala em 'limitar o poder do rei', pense em Iluminismo.",
    },
    "Sociologia e filosofia": {
      t: [
        "Durkheim: FATO SOCIAL é o modo de agir exterior ao indivíduo e que se impõe a ele (leis, costumes). A sociedade funciona como um corpo com partes integradas.",
        "Weber: AÇÃO SOCIAL é a ação com sentido voltada para o outro. Estudou a burocracia e a ética protestante como impulso ao capitalismo.",
        "Marx: a história é a história da LUTA DE CLASSES (burguesia × proletariado). MAIS-VALIA é o valor que o trabalhador produz e não recebe. Alienação: o trabalhador não se reconhece no que produz.",
        "Filosofia antiga: Sócrates (só sei que nada sei, diálogo para chegar à verdade), Platão (mundo das ideias × mundo sensível, mito da caverna) e Aristóteles (ética da virtude, meio-termo).",
        "Modernos: Descartes (penso, logo existo; racionalismo) e Kant (agir como se sua ação pudesse virar lei universal). Contratualistas: Hobbes (Estado forte contra a guerra de todos), Locke (direitos naturais e propriedade) e Rousseau (vontade geral).",
        "Temas atuais que caem: cidadania e direitos humanos, indústria cultural e consumo (Escola de Frankfurt), e trabalho na era das plataformas.",
      ],
      cai: "Diferença entre Durkheim, Weber e Marx, contratualistas e conceitos como alienação e indústria cultural.",
      macete: "Os três clássicos em uma palavra: Durkheim = COESÃO, Weber = SENTIDO, Marx = CONFLITO.",
    },
    "Biologia e saúde": {
      t: [
        "Ecologia: cadeia alimentar vai de produtores (plantas, fazem fotossíntese) a consumidores e decompositores. A energia DIMINUI a cada nível; poluentes como o mercúrio se ACUMULAM no topo (bioacumulação).",
        "Vacina dá imunidade ATIVA (o corpo produz anticorpos e memória, prevenção). Soro dá imunidade PASSIVA (anticorpos prontos, tratamento imediato, como no caso de picada de cobra).",
        "Doenças por vetor: dengue, zika e chikungunya (mosquito Aedes aegypti), malária (Anopheles), doença de Chagas (barbeiro). Prevenção: eliminar água parada e controlar o vetor.",
        "Vírus não têm célula e só se reproduzem dentro de outra; por isso antibiótico NÃO funciona contra vírus, só contra bactérias. Uso errado de antibiótico seleciona bactérias resistentes.",
        "Genética: DNA guarda a informação; gene dominante se manifesta com uma cópia (Aa), recessivo só com duas (aa). No cruzamento Aa × Aa, a proporção é 3 dominantes para 1 recessivo.",
        "Saneamento básico (água tratada e esgoto) previne muitas doenças, como verminoses, hepatite A, cólera e leptospirose.",
      ],
      cai: "Vacina × soro, doenças transmitidas por vetores, bioacumulação na cadeia alimentar e cruzamentos de Mendel.",
      macete: "VACINA = Vem Antes (prevenção, ativa). SORO = Socorro (tratamento, passiva).",
    },
  },
};
