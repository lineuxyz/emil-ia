import { NextRequest } from "next/server";
import { getAgentDecisionLLMChain } from "@/services/libs/llmChain";
import { handleAgent } from "@/services/agents/agentManager";
import { getHumanizedResponse } from "@/services/libs/humanizeResponse";
import { pdfFileHandler } from "@/services/pdfHandler/pdfFileHandler";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('Content-Type')?.split(';')
  const multipartFormData = 'multipart/form-data'

  if (!contentType) return

  try {
    if (contentType[0] === multipartFormData) {
      const formData = await req.formData();
      const pdfFile = formData.get("pdf") as File;
      const fullText = await pdfFileHandler(pdfFile);

      const rawResult = await handleAgent("pdf", {
        text: fullText,
        from: "",
        location: "",
        to: "",
      });

      const finalResponse = await getHumanizedResponse("pdf", rawResult);

      return new Response(finalResponse, {
        headers: {
          Connection: "keep-alive",
          "Content-Encoding": "none",
          "Cache-Control": "no-cache, no-transform",
          "Content-Type": "text/event-stream; charset=utf-8",
        },
      });
    }
    const { message } = await req.json();

    const decision = await getAgentDecisionLLMChain(message);
    const rawResult = await handleAgent(decision.agent, decision.parameters);
    const finalResponse = await getHumanizedResponse(decision.agent, rawResult);

    return new Response(finalResponse, {
      headers: {
        Connection: "keep-alive",
        "Content-Encoding": "none",
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream; charset=utf-8",
      },
    });
  } catch (error: unknown) {
    console.error("Erro no processamento do chat:", error);
  }
}
