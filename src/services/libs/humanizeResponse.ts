import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { IterableReadableStream } from "@langchain/core/utils/stream";

export async function getHumanizedResponse(
  agent: string,
  rawData: unknown
): Promise<IterableReadableStream<string>> {
  const humanTemplate = `
Utilizando os dados abaixo, elabore uma resposta amigável, explicativa e humanizada para o usuário:

Dados do agente (${agent}):
${JSON.stringify(rawData, null, 2)}

Escreva a resposta de forma natural e completa:
`;

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const model = new ChatOpenAI({
    streaming: true,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
      },
    ]
  });

  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      "Você é um assistente que transforma dados brutos em uma resposta humanizada e amigável."
    ),
    new HumanMessage(humanTemplate),
  ]);

  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);

  const result = await chain.stream(humanTemplate);
  return result
}
