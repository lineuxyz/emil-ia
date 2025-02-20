/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentType } from "../agents/agentManager";

export interface AgentDecision {
  agent: AgentType;
  parameters: Record<string, any>;
}

/**
 * Usa o LangChain para analisar a mensagem do usuário e decidir qual agente invocar.
 * @param query Mensagem do usuário.
 * @returns JSON com a decisão do agente e os parâmetros extraídos.
 */

export async function getAgentDecisionLLMChain(
  query: string
): Promise<Record<string, any>> {
  const systemTemplate = `
Você é um assistente que analisa mensagens de usuários e decide qual agente de IA chamar.
As opções de agentes são:
- "weather": para obter informações sobre o clima.
- "currency": para buscar cotações de moedas estrangeiras.
- "pdf": para extrair informações de PDFs.

Retorne um JSON com o seguinte formato, sem comentários extras:
{
  "agent": "<nome_do_agente>",
  "parameters": {
    // no caso do weather, mandar "location" com a localização fornecida pelo usuário
    // no caso do currency, mandar do "from" e "to"como parameters
  }
}
`;

  const humanTemplate = `Mensagem do usuário: ${query}`;

  const model = new ChatOpenAI();

  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage(systemTemplate),
    new HumanMessage(humanTemplate),
  ]);

  const parser = new JsonOutputParser();
  const chain = prompt.pipe(model).pipe(parser);

  const result = await chain.invoke(humanTemplate);
  return result;
}
