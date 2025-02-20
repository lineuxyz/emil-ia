import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Usa o LangChain para analisar a mensagem do usuário e decidir qual agente invocar.
 * @param query Mensagem do usuário.
 * @returns JSON com a decisão do agente e os parâmetros extraídos.
 */

export async function pdfAgent(
  query: string
): Promise<string> {
  const systemTemplate = `
Você é um assistente que analisa um conjunto de texto retirados de um PDF, com essas informações
você faz uma busca e encontrar informações relacionadas ao mesmo texto passado.
`;

  const humanTemplate = `Mensagem do usuário: ${query}`;

  const model = new ChatOpenAI();

  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage(systemTemplate),
    new HumanMessage(humanTemplate),
  ]);

  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);

  const result = await chain.invoke(humanTemplate);
  return result;
}
