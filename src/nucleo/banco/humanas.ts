// História do Brasil, Exército, Geografia do Brasil e literatura por escola.
// Blocos reutilizáveis: o NPOR e o ENEM montam os seus com prefixo e temas próprios.
import { deAfirmacoes, deFatos } from "./motor.ts";
import type { Gerador } from "../lib/tipos.ts";

type Tm = (padrao: string) => string;

export function historiaBrasil(pref: string, materia: string, tema: Tm): Gerador[] {
  const id = (s: string) => `${pref}-${s}`;
  return [
    ...deFatos({
      id: id("ano"), materia, tema: tema("Linha do tempo"), nivel: "intermediario", alta: true,
      itens: [
        ["Tratado de Tordesilhas", "1494"], ["Chegada da esquadra de Cabral", "1500"], ["Divisão em capitanias hereditárias", "1534"], ["Criação do Governo-Geral (Tomé de Sousa)", "1549"],
        ["Fundação do Rio de Janeiro", "1565"], ["Início da União Ibérica", "1580"], ["1ª Batalha dos Guararapes", "1648"], ["Expulsão dos holandeses de Pernambuco", "1654"],
        ["Tratado de Madri", "1750"], ["Transferência da capital para o Rio de Janeiro", "1763"], ["Inconfidência Mineira", "1789"], ["Execução de Tiradentes", "1792"],
        ["Conjuração Baiana", "1798"], ["Chegada da família real portuguesa", "1808"], ["Elevação a Reino Unido a Portugal e Algarves", "1815"], ["Independência do Brasil", "1822"],
        ["Primeira Constituição (outorgada)", "1824"], ["Abdicação de D. Pedro I", "1831"], ["Golpe da Maioridade", "1840"], ["Lei Eusébio de Queirós", "1850"],
        ["Início da Guerra do Paraguai", "1864"], ["Fim da Guerra do Paraguai", "1870"], ["Lei do Ventre Livre", "1871"], ["Lei Áurea", "1888"], ["Proclamação da República", "1889"],
        ["Primeira Constituição republicana", "1891"], ["Revolta da Vacina", "1904"], ["Revolta da Chibata", "1910"], ["Semana de Arte Moderna", "1922"], ["Revolução de 1930", "1930"],
        ["Revolução Constitucionalista", "1932"], ["Início do Estado Novo", "1937"], ["Criação da CLT", "1943"], ["Fim do Estado Novo", "1945"], ["Criação da Petrobras", "1953"],
        ["Inauguração de Brasília", "1960"], ["Golpe que iniciou o regime militar", "1964"], ["Edição do AI-5", "1968"], ["Lei da Anistia", "1979"], ["Campanha das Diretas Já", "1984"],
        ["Promulgação da Constituição Cidadã", "1988"], ["Impeachment de Fernando Collor", "1992"], ["Lançamento do Plano Real", "1994"],
      ],
      perg: (k) => `O fato histórico "${k}" ocorreu em:`,
      inv: (v) => `Qual destes fatos da História do Brasil ocorreu em ${v}?`,
    }),
    ...deAfirmacoes({
      id: id("col"), materia, tema: tema("Colônia"), sobre: "o Brasil Colônia", alta: true,
      v: [
        "A exploração do pau-brasil, no início da colonização, usava o escambo com os indígenas.",
        "As capitanias hereditárias, criadas em 1534, transferiram a particulares (donatários) o custo da colonização.",
        "O Governo-Geral foi criado em 1549 para centralizar a administração; Tomé de Sousa fundou Salvador.",
        "Os jesuítas, chegados em 1549, atuaram na catequese dos indígenas.",
        "A economia açucareira concentrou-se no Nordeste, com grandes propriedades, monocultura e mão de obra escravizada.",
        "Durante a União Ibérica (1580-1640), Portugal e Espanha ficaram sob o mesmo rei.",
        "Os holandeses ocuparam Pernambuco no século XVII, com destaque para o governo de Maurício de Nassau.",
        "O Quilombo dos Palmares foi o maior quilombo do período colonial; Zumbi foi seu principal líder.",
        "No século XVIII, a mineração deslocou o eixo econômico para Minas Gerais.",
        "A Coroa cobrava o quinto: 20% do ouro extraído.",
        "A Inconfidência Mineira (1789) foi motivada, entre outros fatores, pela ameaça da derrama.",
        "A Conjuração Baiana (1798) teve participação popular e defendia o fim da escravidão.",
        "Em 1808, D. João decretou a abertura dos portos às nações amigas.",
        "Os bandeirantes contribuíram para a expansão territorial para além do Tratado de Tordesilhas.",
      ],
      f: [
        ["As capitanias hereditárias foram criadas para fortalecer o poder central da Coroa.", "Elas DESCENTRALIZARAM a colonização; o Governo-Geral (1549) é que centralizou."],
        ["A mineração do século XVIII concentrou-se no litoral nordestino.", "Concentrou-se em MINAS GERAIS (e também GO e MT)."],
        ["O quinto correspondia a 50% do ouro extraído.", "O quinto era 20% (um quinto)."],
        ["A Inconfidência Mineira teve ampla participação de escravizados e defendia a abolição.", "Era movimento de elite; a Conjuração BAIANA é que teve caráter popular e abolicionista."],
        ["Os holandeses ocuparam o Rio Grande do Sul no século XVII.", "Ocuparam o NORDESTE, especialmente Pernambuco."],
        ["A abertura dos portos ocorreu após a Independência, em 1822.", "Foi em 1808, com a chegada da família real."],
        ["A economia açucareira usava pequenas propriedades e trabalho livre assalariado.", "Usava latifúndio, monocultura e mão de obra escravizada (plantation)."],
        ["O Tratado de Madri (1750) ampliou o limite de Tordesilhas a favor da Espanha.", "Madri reconheceu a posse portuguesa pelo uso da terra (uti possidetis)."],
      ],
    }),
    ...deAfirmacoes({
      id: id("imp"), materia, tema: tema("Independência e Império"), sobre: "a Independência e o Império", alta: true,
      v: [
        "A Constituição de 1824 foi outorgada por D. Pedro I e criou o Poder Moderador.",
        "O voto na Constituição de 1824 era censitário, baseado na renda.",
        "A Confederação do Equador (1824) foi uma reação ao autoritarismo de D. Pedro I.",
        "O Período Regencial (1831-1840) foi marcado por revoltas como a Cabanagem, a Sabinada, a Balaiada e a Farroupilha.",
        "A Revolução Farroupilha ocorreu no Rio Grande do Sul e durou cerca de dez anos.",
        "O Golpe da Maioridade antecipou a coroação de D. Pedro II, em 1840.",
        "A Lei Eusébio de Queirós (1850) proibiu o tráfico de escravizados para o Brasil.",
        "Na Guerra do Paraguai, Brasil, Argentina e Uruguai formaram a Tríplice Aliança.",
        "Duque de Caxias comandou as forças brasileiras em parte decisiva da Guerra do Paraguai.",
        "A Batalha Naval do Riachuelo (1865) foi uma vitória importante da Marinha do Brasil.",
        "A Lei do Ventre Livre (1871) declarou livres os filhos de escravizadas nascidos a partir dela.",
        "A Lei Áurea, de 13 de maio de 1888, aboliu a escravidão no Brasil.",
        "O café, no Segundo Reinado, tornou-se o principal produto de exportação.",
        "A República foi proclamada em 15 de novembro de 1889 pelo Marechal Deodoro da Fonseca.",
      ],
      f: [
        ["A Constituição de 1824 foi promulgada por uma Assembleia eleita.", "Foi OUTORGADA por D. Pedro I, após dissolver a Constituinte."],
        ["O voto na Constituição de 1824 era universal e secreto.", "Era CENSITÁRIO (por renda) e aberto."],
        ["A Revolução Farroupilha ocorreu no Pará.", "Foi no Rio Grande do Sul; no Pará foi a Cabanagem."],
        ["A Lei Eusébio de Queirós aboliu a escravidão.", "Ela proibiu o TRÁFICO; a abolição veio com a Lei Áurea (1888)."],
        ["Na Guerra do Paraguai, o Brasil lutou ao lado do Chile e da Bolívia.", "A Tríplice Aliança foi Brasil, Argentina e Uruguai."],
        ["A Lei dos Sexagenários libertou os filhos de escravizadas.", "Isso foi a Lei do VENTRE LIVRE (1871)."],
        ["A Proclamação da República foi liderada por D. Pedro II.", "Foi liderada pelo Marechal Deodoro da Fonseca, que depôs o Imperador."],
        ["O Poder Moderador foi criado pela Constituição de 1891.", "Foi criado pela Constituição de 1824 e extinto com a República."],
      ],
    }),
    ...deFatos({
      id: id("reg"), materia, tema: tema("Independência e Império"), nivel: "intermediario",
      itens: [
        ["Cabanagem", "Pará"], ["Balaiada", "Maranhão"], ["Sabinada", "Bahia"], ["Revolução Farroupilha", "Rio Grande do Sul"],
        ["Confederação do Equador", "Pernambuco"], ["Inconfidência Mineira", "Minas Gerais"], ["Guerra do Contestado", "Paraná e Santa Catarina"],
      ],
      perg: (k) => `A ${k} ocorreu em:`,
      inv: (v) => `Qual revolta ou movimento ocorreu em ${v}?`,
    }),
    ...deAfirmacoes({
      id: id("rv"), materia, tema: tema("República Velha"), sobre: "a Primeira República (1889-1930)",
      v: [
        "A Constituição de 1891 instituiu o presidencialismo, o federalismo e a separação entre Igreja e Estado.",
        "Na Constituição de 1891, o voto era aberto e não incluía mulheres nem analfabetos.",
        "A política dos governadores trocava apoio entre o presidente e as oligarquias estaduais.",
        "A política do café com leite alternava paulistas e mineiros na Presidência.",
        "O coronelismo e o voto de cabresto marcaram as eleições da Primeira República.",
        "A Revolta da Vacina (1904) ocorreu no Rio de Janeiro contra a vacinação obrigatória.",
        "A Revolta da Chibata (1910) foi liderada por João Cândido contra castigos físicos na Marinha.",
        "A Guerra do Contestado ocorreu na divisa entre Paraná e Santa Catarina.",
        "O tenentismo começou com a Revolta dos 18 do Forte de Copacabana, em 1922.",
        "A Coluna Prestes percorreu o interior do país entre 1925 e 1927.",
        "Canudos, no sertão da Bahia, foi liderado por Antônio Conselheiro.",
      ],
      f: [
        ["A Constituição de 1891 garantiu o voto feminino.", "O voto feminino só veio com o Código Eleitoral de 1932."],
        ["A política do café com leite alternava gaúchos e pernambucanos na Presidência.", "Alternava SÃO PAULO (café) e MINAS GERAIS (leite)."],
        ["A Revolta da Chibata ocorreu no Exército, contra a vacinação.", "Foi na MARINHA, contra os castigos físicos."],
        ["O Contestado ocorreu no sertão da Bahia.", "Foi entre PARANÁ e SANTA CATARINA; na Bahia foi Canudos."],
        ["O voto na Primeira República era secreto, o que impedia o voto de cabresto.", "O voto era ABERTO, o que facilitava o cabresto."],
        ["A Constituição de 1891 manteve o catolicismo como religião oficial.", "Ela SEPAROU Igreja e Estado."],
      ],
    }),
    ...deAfirmacoes({
      id: id("vg"), materia, tema: tema("Era Vargas e FEB"), sobre: "a Era Vargas e a participação do Brasil nas Guerras Mundiais", alta: true,
      v: [
        "O Código Eleitoral de 1932 instituiu o voto secreto e o voto feminino e criou a Justiça Eleitoral.",
        "A Revolução Constitucionalista de 1932 foi um movimento paulista contra o Governo Provisório.",
        "O Estado Novo (1937-1945) foi uma ditadura, com Constituição outorgada apelidada de \"Polaca\".",
        "A CLT, de 1943, reuniu as leis trabalhistas.",
        "Na Era Vargas foram criadas a Companhia Siderúrgica Nacional e a Vale do Rio Doce.",
        "O Brasil declarou guerra aos países do Eixo em 1942, após ataques a navios brasileiros.",
        "A Força Expedicionária Brasileira (FEB) combateu na Itália, em 1944 e 1945.",
        "A tomada de Monte Castelo, em fevereiro de 1945, é uma das principais vitórias da FEB.",
        "A FEB foi comandada pelo General Mascarenhas de Morais.",
        "O lema da FEB era \"A cobra está fumando\".",
        "O 1º Grupo de Aviação de Caça da FAB, com o grito \"Senta a Pua!\", lutou na Itália.",
        "Na Primeira Guerra Mundial, o Brasil declarou guerra em 1917 e enviou missão naval e médica.",
      ],
      f: [
        ["A FEB combateu na França, na invasão da Normandia.", "A FEB lutou na ITÁLIA."],
        ["O voto feminino foi instituído pela Constituição de 1891.", "Foi pelo Código Eleitoral de 1932."],
        ["O Estado Novo foi um período democrático com eleições livres.", "Foi uma DITADURA (1937-1945)."],
        ["O Brasil declarou guerra aos Aliados em 1942.", "O Brasil declarou guerra ao EIXO e lutou ao lado dos Aliados."],
        ["A FEB foi comandada por Duque de Caxias.", "Caxias é do século XIX; a FEB foi comandada por Mascarenhas de Morais."],
        ["A Revolução Constitucionalista de 1932 ocorreu em Pernambuco.", "Foi em SÃO PAULO."],
        ["A CLT foi criada durante o regime militar.", "A CLT é de 1943, no Estado Novo."],
      ],
    }),
    ...deAfirmacoes({
      id: id("46"), materia, tema: tema("Brasil de 1946 aos dias de hoje"), sobre: "o Brasil de 1946 aos dias de hoje",
      v: [
        "A campanha \"O petróleo é nosso\" levou à criação da Petrobras em 1953, no governo Vargas.",
        "Juscelino Kubitschek lançou o Plano de Metas (\"50 anos em 5\") e inaugurou Brasília em 1960.",
        "Jânio Quadros renunciou em 1961, poucos meses após a posse.",
        "Entre 1961 e 1963, o Brasil teve uma experiência parlamentarista.",
        "O AI-5, de 1968, ampliou os poderes do Executivo e suspendeu garantias como o habeas corpus para certos crimes.",
        "O governo Médici coincidiu com o chamado \"milagre econômico\".",
        "Geisel iniciou a abertura política \"lenta, gradual e segura\".",
        "A Lei da Anistia foi assinada em 1979, no governo Figueiredo.",
        "A emenda Dante de Oliveira, das Diretas Já, foi rejeitada em 1984.",
        "Tancredo Neves foi eleito indiretamente em 1985, mas faleceu antes da posse; assumiu José Sarney.",
        "A Constituição de 1988 ficou conhecida como Constituição Cidadã.",
        "O Plano Real, de 1994, controlou a hiperinflação.",
        "Durante o regime militar vigorou o bipartidarismo, com ARENA e MDB.",
      ],
      f: [
        ["Brasília foi inaugurada no governo Vargas.", "Foi no governo JK, em 1960."],
        ["A emenda das Diretas Já foi aprovada em 1984, e houve eleição direta em 1985.", "A emenda foi REJEITADA; a eleição de 1985 foi INDIRETA."],
        ["O AI-5 foi editado no governo Geisel.", "Foi em 1968, no governo Costa e Silva."],
        ["A Lei da Anistia é de 1988, junto com a Constituição.", "A Lei da Anistia é de 1979."],
        ["O Plano Real foi lançado no governo Sarney.", "Foi em 1994, no governo Itamar Franco."],
        ["Durante o regime militar havia ampla liberdade partidária.", "Vigorou o bipartidarismo (ARENA e MDB) a partir do AI-2."],
        ["Tancredo Neves governou o Brasil de 1985 a 1990.", "Tancredo faleceu antes de tomar posse; governou José Sarney."],
      ],
    }),
  ];
}

export function exercito(pref: string, materia: string, tema: string): Gerador[] {
  return [
    ...deAfirmacoes({
      id: `${pref}-eb`, materia, tema, sobre: "o Exército Brasileiro e as Forças Armadas", alta: true,
      v: [
        "O Dia do Exército, 19 de abril, lembra a 1ª Batalha dos Guararapes, de 1648.",
        "Duque de Caxias é o Patrono do Exército Brasileiro.",
        "O Dia do Soldado é comemorado em 25 de agosto, data de nascimento de Caxias.",
        "As Forças Armadas são formadas pela Marinha, pelo Exército e pela Aeronáutica.",
        "As Forças Armadas são organizadas com base na hierarquia e na disciplina.",
        "O comandante supremo das Forças Armadas é o Presidente da República.",
        "As Forças Armadas destinam-se à defesa da Pátria, à garantia dos poderes constitucionais e da lei e da ordem.",
        "O serviço militar é obrigatório nos termos da lei; mulheres e eclesiásticos são isentos em tempo de paz.",
        "O CPOR e o NPOR formam oficiais da reserva.",
        "A AMAN, em Resende (RJ), forma os oficiais combatentes de carreira do Exército.",
        "Na hierarquia dos oficiais, o posto de Capitão vem antes do de Major.",
        "O alistamento militar deve ser feito no ano em que o brasileiro completa 18 anos.",
      ],
      f: [
        ["O Dia do Exército lembra a Batalha do Riachuelo.", "Lembra a 1ª Batalha dos GUARARAPES (19/4/1648); Riachuelo é data da Marinha."],
        ["O Patrono do Exército é o Almirante Tamandaré.", "Tamandaré é patrono da Marinha; o do Exército é Caxias."],
        ["As Forças Armadas estão sob a autoridade suprema do Ministro da Defesa.", "A autoridade suprema é o PRESIDENTE DA REPÚBLICA (art. 142)."],
        ["As mulheres estão sujeitas ao serviço militar obrigatório em tempo de paz.", "São isentas em tempo de paz (art. 143, § 2º)."],
        ["O NPOR forma oficiais de carreira.", "O NPOR forma oficiais da RESERVA; os de carreira saem da AMAN."],
        ["O Dia do Soldado é 7 de setembro.", "É 25 de agosto, nascimento de Caxias."],
        ["Na hierarquia, o Tenente-Coronel está acima do Coronel.", "O Coronel está acima do Tenente-Coronel."],
      ],
    }),
    ...deFatos({
      id: `${pref}-patr`, materia, tema, nivel: "intermediario",
      itens: [
        ["Exército Brasileiro", "Duque de Caxias"], ["Marinha do Brasil", "Almirante Tamandaré"], ["Força Aérea Brasileira", "Santos-Dumont"],
        ["Arma de Infantaria", "Brigadeiro Sampaio"], ["Arma de Cavalaria", "General Osório"], ["Arma de Artilharia", "Marechal Mallet"],
        ["Arma de Engenharia", "Tenente-Coronel Villagran Cabrita"], ["Arma de Comunicações", "Marechal Rondon"], ["Serviço de Intendência", "Marechal Bittencourt"],
      ],
      perg: (k) => `Quem é o patrono desta instituição, arma ou serviço: ${k}?`,
      inv: (v) => `${v} é patrono de qual força, arma ou serviço?`,
    }),
    ...deFatos({
      id: `${pref}-post`, materia, tema, nivel: "basico",
      itens: [
        ["Aspirante a Oficial", "Praça especial, logo abaixo do 2º Tenente"], ["2º Tenente", "Primeiro posto de oficial subalterno"], ["1º Tenente", "Oficial subalterno acima do 2º Tenente"],
        ["Capitão", "Oficial intermediário"], ["Major", "Primeiro posto de oficial superior"], ["Coronel", "Oficial superior de maior posto"], ["General de Exército", "Maior posto do oficial-general em tempo de paz"],
        ["Subtenente", "Graduação mais alta das praças"], ["3º Sargento", "Primeira graduação de sargento"],
      ],
      perg: (k) => `No Exército, o posto ou graduação de ${k} corresponde a:`,
      inv: (v) => `No Exército, qual posto ou graduação corresponde a: "${v}"?`,
    }),
  ];
}

const UF: [string, string, string][] = [
  ["Acre", "Rio Branco", "Norte"], ["Amazonas", "Manaus", "Norte"], ["Amapá", "Macapá", "Norte"], ["Pará", "Belém", "Norte"], ["Rondônia", "Porto Velho", "Norte"], ["Roraima", "Boa Vista", "Norte"], ["Tocantins", "Palmas", "Norte"],
  ["Maranhão", "São Luís", "Nordeste"], ["Piauí", "Teresina", "Nordeste"], ["Ceará", "Fortaleza", "Nordeste"], ["Rio Grande do Norte", "Natal", "Nordeste"], ["Paraíba", "João Pessoa", "Nordeste"], ["Pernambuco", "Recife", "Nordeste"], ["Alagoas", "Maceió", "Nordeste"], ["Sergipe", "Aracaju", "Nordeste"], ["Bahia", "Salvador", "Nordeste"],
  ["Mato Grosso", "Cuiabá", "Centro-Oeste"], ["Mato Grosso do Sul", "Campo Grande", "Centro-Oeste"], ["Goiás", "Goiânia", "Centro-Oeste"],
  ["Minas Gerais", "Belo Horizonte", "Sudeste"], ["Espírito Santo", "Vitória", "Sudeste"], ["Rio de Janeiro", "Rio de Janeiro", "Sudeste"], ["São Paulo", "São Paulo", "Sudeste"],
  ["Paraná", "Curitiba", "Sul"], ["Santa Catarina", "Florianópolis", "Sul"], ["Rio Grande do Sul", "Porto Alegre", "Sul"],
];

export function geografiaBrasil(pref: string, materia: string, tema: Tm): Gerador[] {
  const id = (s: string) => `${pref}-${s}`;
  return [
    ...deFatos({
      id: id("cap"), materia, tema: tema("Território e regiões"), nivel: "basico",
      itens: UF.map(([e, c]) => [e, c]), perg: (k) => `A capital do estado de ${k} é:`, inv: (v) => `${v} é a capital de qual estado?`,
    }),
    ...deFatos({
      id: id("reg"), materia, tema: tema("Território e regiões"), nivel: "basico",
      itens: UF.map(([e, , r]) => [e, r]), perg: (k) => `Pela divisão do IBGE, o estado de ${k} pertence à região:`, inv: (v) => `Qual estado pertence à região ${v}?`,
    }),
    ...deAfirmacoes({
      id: id("terr"), materia, tema: tema("Território e regiões"), sobre: "o território brasileiro", alta: true,
      v: [
        "O Brasil tem cerca de 8,5 milhões de km² e é o quinto maior país do mundo em área.",
        "O Brasil faz fronteira com todos os países da América do Sul, exceto Chile e Equador.",
        "A maior fronteira terrestre do Brasil é com a Bolívia.",
        "O ponto extremo norte do Brasil é o Monte Caburaí, em Roraima.",
        "O ponto extremo sul do Brasil é o Arroio Chuí, no Rio Grande do Sul.",
        "O ponto extremo leste continental é a Ponta do Seixas, na Paraíba.",
        "A Região Norte é a maior em área, e o Amazonas é o maior estado.",
        "Sergipe é o menor estado brasileiro em área.",
        "O Brasil tem 26 estados e o Distrito Federal.",
        "Pela divisão geoeconômica, o Brasil é dividido em Amazônia, Nordeste e Centro-Sul.",
        "O Brasil possui quatro fusos horários, contando as ilhas oceânicas.",
        "A maior parte do território brasileiro está no Hemisfério Sul.",
        "O Trópico de Capricórnio atravessa o estado do Paraná.",
      ],
      f: [
        ["O Brasil faz fronteira com todos os países da América do Sul.", "Não faz fronteira com Chile e Equador."],
        ["A maior fronteira terrestre do Brasil é com a Argentina.", "É com a BOLÍVIA."],
        ["O ponto extremo norte do Brasil é o Oiapoque, no Amapá.", "O extremo norte é o Monte Caburaí (RR)."],
        ["O menor estado brasileiro em área é o Rio de Janeiro.", "É SERGIPE."],
        ["O Brasil tem um único fuso horário.", "São quatro fusos, contando as ilhas oceânicas."],
        ["O Brasil é o segundo maior país do mundo em área.", "É o QUINTO."],
        ["O Trópico de Capricórnio atravessa o Amazonas.", "Ele passa por MS, PR e SP; no Amazonas passa a Linha do Equador."],
        ["A Região Sul tem quatro estados.", "São três: PR, SC e RS."],
      ],
    }),
    ...deAfirmacoes({
      id: id("cart"), materia, tema: tema("Cartografia"), sobre: "a cartografia",
      v: [
        "Latitude é a distância em graus a partir da Linha do Equador, de 0° a 90° norte ou sul.",
        "Longitude é a distância em graus a partir do Meridiano de Greenwich, de 0° a 180° leste ou oeste.",
        "Paralelos são linhas imaginárias paralelas ao Equador; meridianos ligam os polos.",
        "Quanto maior a escala, maior o nível de detalhe e menor a área representada.",
        "A projeção de Mercator conserva as formas, mas exagera o tamanho das áreas de altas latitudes.",
        "A projeção de Peters preserva a proporção das áreas, deformando as formas.",
        "Curvas de nível ligam pontos de mesma altitude no mapa.",
        "Nordeste, sudeste, sudoeste e noroeste são pontos colaterais da rosa dos ventos.",
        "O GPS determina a posição por meio de sinais de satélites.",
        "Cada fuso horário corresponde, teoricamente, a 15° de longitude.",
      ],
      f: [
        ["A latitude é medida a partir do Meridiano de Greenwich.", "Latitude parte do EQUADOR; longitude parte de Greenwich."],
        ["Uma escala 1:1.000.000 é maior que uma escala 1:10.000.", "1:10.000 é MAIOR (mais detalhada); quanto maior o denominador, menor a escala."],
        ["A projeção de Mercator preserva as áreas reais dos continentes.", "Mercator preserva FORMAS e distorce áreas; Peters preserva áreas."],
        ["Cada fuso horário corresponde a 30° de longitude.", "São 15° (360° ÷ 24 h)."],
        ["Nordeste e sudoeste são pontos cardeais.", "São COLATERAIS; cardeais são N, S, L, O."],
        ["Curvas de nível muito próximas indicam terreno plano.", "Curvas próximas indicam terreno ÍNGREME."],
      ],
    }),
    ...deFatos({
      id: id("clima"), materia, tema: tema("Clima e relevo do Brasil"), nivel: "intermediario", alta: true,
      itens: [
        ["Equatorial", "Quente e úmido o ano todo, com chuvas abundantes, na Amazônia"],
        ["Tropical", "Verão quente e chuvoso e inverno seco, típico do Brasil Central"],
        ["Tropical de altitude", "Temperaturas mais amenas nas serras do Sudeste, com geadas ocasionais"],
        ["Semiárido", "Chuvas escassas e irregulares, no sertão nordestino"],
        ["Subtropical", "Estações bem definidas, inverno frio com geadas, no Sul"],
        ["Tropical litorâneo (úmido)", "Quente e úmido na faixa costeira, influenciado pela massa tropical atlântica"],
      ],
      perg: (k) => `O clima ${k} caracteriza-se por:`,
      inv: (v) => `Qual clima brasileiro é descrito assim: "${v}"?`,
    }),
    ...deAfirmacoes({
      id: id("relevo"), materia, tema: tema("Clima e relevo do Brasil"), sobre: "o clima, o relevo e a hidrografia do Brasil",
      v: [
        "A massa polar atlântica provoca frentes frias e, na Amazônia ocidental, a friagem.",
        "O relevo brasileiro é formado principalmente por planaltos, planícies e depressões.",
        "O Brasil não possui dobramentos modernos nem vulcões ativos.",
        "O ponto mais alto do Brasil é o Pico da Neblina, no Amazonas.",
        "A Bacia Amazônica é a maior bacia hidrográfica do mundo.",
        "O Rio São Francisco nasce em Minas Gerais e é chamado de rio da integração nacional.",
        "A Bacia do Paraná tem o maior aproveitamento hidrelétrico do país, com usinas como Itaipu.",
        "O Aquífero Guarani é uma grande reserva de água subterrânea compartilhada com países vizinhos.",
        "O Pantanal é uma das maiores planícies alagáveis do mundo.",
      ],
      f: [
        ["O Brasil possui vulcões ativos na Serra do Mar.", "O Brasil não tem vulcões ativos nem dobramentos modernos."],
        ["O ponto mais alto do Brasil é o Pico da Bandeira.", "É o Pico da NEBLINA (AM)."],
        ["O Rio São Francisco nasce na Bahia e deságua no Rio de Janeiro.", "Nasce em MG (Serra da Canastra) e deságua entre AL e SE."],
        ["A friagem é causada pela massa equatorial continental.", "É causada pela massa POLAR atlântica."],
        ["O clima semiárido predomina no Sul do Brasil.", "O Sul tem clima SUBTROPICAL; o semiárido é do sertão nordestino."],
      ],
    }),
    ...deFatos({
      id: id("bioma"), materia, tema: tema("Biomas e domínios"), nivel: "basico", alta: true,
      itens: [
        ["Amazônia", "Maior bioma do Brasil, com floresta densa e alta biodiversidade"],
        ["Cerrado", "Vegetação de savana com árvores de troncos retorcidos, no Brasil Central"],
        ["Caatinga", "Bioma exclusivamente brasileiro, do semiárido, com plantas que perdem folhas na seca"],
        ["Mata Atlântica", "Bioma mais devastado, que acompanhava a costa e inclui a Mata de Araucárias"],
        ["Pampa", "Campos com vegetação rasteira, no sul do Rio Grande do Sul"],
        ["Pantanal", "Planície alagável no Mato Grosso e Mato Grosso do Sul"],
      ],
      perg: (k) => `O bioma ${k} caracteriza-se como:`,
      inv: (v) => `Qual bioma brasileiro é descrito assim: "${v}"?`,
    }),
    ...deAfirmacoes({
      id: id("pop"), materia, tema: tema("População e economia"), sobre: "a população e a economia brasileiras",
      v: [
        "Segundo o Censo 2022, o Brasil tem cerca de 203 milhões de habitantes.",
        "A taxa de fecundidade brasileira caiu e hoje está abaixo do nível de reposição.",
        "O envelhecimento da população aumenta a proporção de idosos e pressiona a previdência.",
        "O êxodo rural intensificou a urbanização brasileira a partir de meados do século XX.",
        "O setor terciário (comércio e serviços) responde pela maior parte do PIB brasileiro.",
        "A soja está entre os principais produtos de exportação do Brasil.",
        "A expansão da fronteira agrícola avançou sobre o Cerrado e a Amazônia.",
        "A matriz elétrica brasileira é predominantemente renovável, com destaque para as hidrelétricas.",
        "Migração pendular é o deslocamento diário entre a cidade onde se mora e a cidade onde se trabalha.",
        "A Região Sudeste é a mais populosa do Brasil.",
      ],
      f: [
        ["A população brasileira está ficando cada vez mais jovem.", "Ocorre o ENVELHECIMENTO da população."],
        ["A maior parte da população brasileira vive no campo.", "A maior parte vive em áreas URBANAS."],
        ["O setor primário é o que mais contribui para o PIB brasileiro.", "O setor TERCIÁRIO é o maior."],
        ["A matriz elétrica brasileira é baseada principalmente no carvão mineral.", "É predominantemente HIDRELÉTRICA/renovável."],
        ["A Região Norte é a mais populosa do país.", "A mais populosa é o SUDESTE; o Norte é a maior em área."],
        ["Migração pendular é a mudança definitiva do campo para a cidade.", "Isso é êxodo rural; pendular é o vai e volta diário."],
      ],
    }),
  ];
}

/** Características das escolas literárias (Barroco ao Simbolismo). */
export function escolasLit(pref: string, materia: string, tema: string): Gerador[] {
  return deFatos({
    id: `${pref}-carac`, materia, tema, nivel: "intermediario", alta: true,
    itens: [
      ["Cultismo, conceptismo, antíteses e conflito entre fé e pecado", "Barroco"],
      ["Bucolismo, pastoralismo, carpe diem e fugere urbem", "Arcadismo"],
      ["Subjetivismo, nacionalismo, idealização da mulher e indianismo", "Romantismo (1ª geração)"],
      ["Mal do século, pessimismo e atração pela morte", "Romantismo (2ª geração)"],
      ["Poesia social e abolicionista, de tom grandioso (condoreirismo)", "Romantismo (3ª geração)"],
      ["Objetividade, crítica social e análise psicológica", "Realismo"],
      ["Determinismo, influência do meio e animalização dos personagens", "Naturalismo"],
      ["Arte pela arte, culto à forma perfeita e preferência pelo soneto", "Parnasianismo"],
      ["Musicalidade, sinestesia, misticismo e linguagem sugestiva", "Simbolismo"],
      ["Textos informativos de viajantes e literatura de catequese", "Quinhentismo"],
    ],
    perg: (k) => `As características "${k}" são típicas do:`,
    inv: (v) => `Assinale as características típicas do ${v}.`,
  });
}
