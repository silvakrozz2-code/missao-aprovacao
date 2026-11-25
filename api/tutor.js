// POST /api/tutor  { mensagens: [{de: "eu"|"ia", txt}], contexto: {...} } → { txt }
// As chaves ficam só no servidor (variáveis de ambiente da Vercel). Usa a primeira IA grátis disponível:
// Gemini, Groq, Cerebras, Mistral, OpenRouter, GitHub Models e, por último, o AI Gateway da Vercel.
import { logado, json, responder } from "../lib-ia.js";

const SISTEMA = (c = {}) => `Você é o tutor do app "Missão Aprovação", um app de estudo em português do Brasil.
O aluno está se preparando para: ${String(c.objetivo || "concurso, NPOR e ENEM").slice(0, 80)}${Number.isFinite(c.dias) ? ` (faltam ${c.dias} dias para a prova)` : ""}.
${Array.isArray(c.fracos) && c.fracos.length ? `Temas em que ele mais erra agora: ${c.fracos.slice(0, 5).map((x) => String(x).slice(0, 60)).join(", ")}.` : ""}
Como responder:
- Português do Brasil, frases curtas e claras, como um professor paciente conversando. Nada de inglês.
- Primeiro a resposta direta, depois a explicação. Em conta, mostre o passo a passo com números, uma etapa por linha.
- Dê um macete ou um exemplo quando ajudar. Se a dúvida for de prova, diga a pegadinha comum.
- Seja breve: no máximo uns 8 a 12 linhas, a não ser que peçam mais. A resposta pode ser lida em voz alta, então evite tabelas, símbolos de markdown pesados e listas muito longas. Pode usar **negrito** para o essencial.
- Se não tiver certeza de uma lei, prazo ou número, diga isso e sugira conferir no texto oficial.
- Se o aluno estiver desanimado, acolha em uma frase e proponha um passo pequeno (um pomodoro, 10 questões).
- O app tem: Trilha (aulas por tema), Treinar (questões, simulado, treino de contas com níveis), Revisar (flashcards e revisão espaçada), Laboratório de matemática. Indique essas partes quando fizer sentido.`;

export async function POST(req) {
  if (!(await logado(req))) return json({ erro: "Entre na sua conta para usar o tutor." }, 401);
  let corpo; try { corpo = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400); }
  const msgs = (Array.isArray(corpo.mensagens) ? corpo.mensagens : []).slice(-12)
    .map((m) => ({ de: m?.de === "ia" ? "ia" : "eu", txt: String(m?.txt || "").slice(0, 2500) })).filter((m) => m.txt.trim());
  if (!msgs.length || msgs.at(-1).de !== "eu") return json({ erro: "Escreva sua pergunta." }, 400);
  const sistema = SISTEMA(corpo.contexto || {});
  try {
    const { txt, fonte } = await responder(sistema, msgs);
    return json({ txt, fonte });
  } catch (e) {
    return json({ erro: e.publico || "O tutor não respondeu agora. Tente de novo em instantes." }, e.status || 502);
  }
}
