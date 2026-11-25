// Regência verbal e nominal (NPOR e ENEM): frases com lacuna e afirmações.
import { deAfirmacoes, deLacunas } from "./motor.ts";
import type { Gerador } from "../lib/tipos.ts";

export function regencia(pref: string, materia: string, tema: string): Gerador[] {
  return [
    ...deLacunas({
      id: `${pref}-lac`, materia, tema, alta: true,
      opcoes: ["a", "ao", "à", "de", "do", "da", "em", "com", "por"],
      macete: "Troque o verbo por um sinônimo e veja a preposição: assistir (ver) = assistir A; aspirar (desejar) = aspirar A; visar (almejar) = visar A.",
      frases: [
        ["Assisti ___ jogo da seleção.", "ao", "Assistir no sentido de ver pede a preposição \"a\"."],
        ["Obedeça ___ sinalização da pista.", "à", "Obedecer pede \"a\"; com \"a sinalização\" ocorre crase."],
        ["O soldado obedece ___ comandante.", "ao", "Obedecer é transitivo indireto: obedecer a alguém."],
        ["Ele aspira ___ posto de oficial.", "ao", "Aspirar no sentido de desejar pede \"a\"."],
        ["Simpatizo ___ sua proposta.", "com", "Simpatizar pede \"com\" e não é pronominal."],
        ["Cheguei ___ quartel às seis horas.", "ao", "Chegar pede \"a\" (chegar a algum lugar), não \"em\"."],
        ["Esqueci-me ___ senha do sistema.", "da", "Esquecer-se (pronominal) pede \"de\"."],
        ["Lembrou-se ___ compromisso.", "do", "Lembrar-se (pronominal) pede \"de\"."],
        ["Informei-o ___ decisão do comando.", "da", "Informar alguém DE algo."],
        ["Pagou ___ funcionário o que devia.", "ao", "Pagar algo A alguém."],
        ["Perdoou ___ amigo a ofensa.", "ao", "Perdoar algo A alguém."],
        ["Implicava ___ o colega sem motivo.", "com", "Implicar no sentido de antipatizar pede \"com\"."],
        ["A tropa visava ___ vitória.", "à", "Visar no sentido de almejar pede \"a\"; com \"a vitória\", crase."],
        ["Custou ___ aluno entender a matéria.", "ao", "Custar (ser difícil) tem como sujeito a coisa: custou A alguém."],
        ["Ele reside ___ Curitiba.", "em", "Residir, morar e situar-se pedem \"em\"."],
        ["Referiu-se ___ regulamento disciplinar.", "ao", "Referir-se A algo."],
        ["Tenho preferência ___ trabalho em equipe.", "por", "O nome \"preferência\" pede \"por\"."],
        ["Ele é apto ___ serviço militar.", "ao", "O adjetivo \"apto\" pede \"a\" (ou \"para\")."],
        ["Estou acostumado ___ acordar cedo.", "a", "\"Acostumado\" pede \"a\"; antes de verbo, sem crase."],
        ["O candidato tem orgulho ___ sua farda.", "da", "\"Orgulho\" pede \"de\"."],
      ],
    }),
    ...deAfirmacoes({
      id: `${pref}-af`, materia, tema, sobre: "a regência", alta: true,
      cmd: { c: "Assinale a frase de acordo com a norma-padrão quanto à regência.", i: "Assinale a frase com ERRO de regência, segundo a norma-padrão.", j: "Analise a regência das frases:" },
      v: [
        "Prefiro estudar a sair.", "Assisti ao filme ontem.", "O médico assistiu o paciente.", "Aspiro ao cargo de sargento.",
        "Aspirei o perfume das flores.", "Chegamos a Curitiba pela manhã.", "Esqueci o livro em casa.", "Esqueci-me do livro em casa.",
        "Obedeço aos regulamentos.", "Simpatizei com o novo chefe.", "Moro na Rua das Flores.", "Namoro Ana há dois anos.",
        "Visei o alvo com cuidado.", "Custou-me aceitar a derrota.",
      ],
      f: [
        ["Prefiro mais estudar do que sair.", "Preferir não aceita \"mais\" nem \"do que\": prefiro uma coisa A outra."],
        ["Assisti o filme ontem.", "Assistir (ver) pede preposição: assisti AO filme."],
        ["Chegamos em Curitiba pela manhã.", "Na norma-padrão, chegar pede \"a\": chegamos A Curitiba."],
        ["Esqueci-me o livro em casa.", "Esquecer-se (pronominal) pede \"de\": esqueci-me DO livro."],
        ["Obedeço os regulamentos.", "Obedecer pede preposição: obedeço AOS regulamentos."],
        ["Simpatizei-me com o novo chefe.", "Simpatizar não é pronominal: simpatizei com."],
        ["Moro à Rua das Flores.", "Morar pede \"em\": moro NA Rua das Flores."],
        ["Namoro com Ana há dois anos.", "Namorar é transitivo direto: namoro Ana."],
        ["Eu custei a entender a matéria.", "Na norma-padrão: custou-me entender (a coisa é o sujeito)."],
        ["Aspiro o cargo de sargento.", "Aspirar (desejar) pede \"a\": aspiro AO cargo."],
      ],
    }),
  ];
}
