import { getWeatherData, WeatherInfo } from "./weatherAgent";
import { getCurrencyData, CurrencyInfo } from "./currencyAgent";
import { pdfAgent } from "./pdfAgent";
import { HandleError } from "../handlers/handleError";

export type AgentResponse = WeatherInfo | CurrencyInfo | string;
export type AgentType = "weather" | "currency" | "pdf";

type AgentHandlers = {
  weather: (parameters: { location: string }) => Promise<WeatherInfo>;
  currency: (parameters: { from: string; to: string }) => Promise<CurrencyInfo>;
  pdf: (parameters: { text: string }) => Promise<string>;
};

const agentHandlers: AgentHandlers = {
  weather: async (parameters: { location: string }) => {
    if (!parameters.location) {
      new HandleError("Parâmetro 'location' ausente para o agente de clima.");
    }

    return await getWeatherData(parameters.location);
  },
  currency: async (parameters: { from: string; to: string }) => {
    if (!parameters.from || !parameters.to) {
      new HandleError(
        "Parâmetros 'base' ou 'target' ausentes para o agente de currency."
      );
    }
    return await getCurrencyData(parameters);
  },
  pdf: async (parameters: { text: string }) => {
    if (!parameters.text) {
      new HandleError(
        "Parâmetros 'pdfUrl' ou 'query' ausentes para o agente de pdf."
      );
    }
    return await pdfAgent(parameters.text);
  },
};

/**
 * Função que delega a chamada do agente com base no nome.
 * @param agent - Nome do agente (ex: "weather", "currency", "pdf").
 * @param parameters - Parâmetros necessários para a chamada.
 * @returns Resposta do agente escolhido.
 */

export async function handleAgent(
  agent: AgentType,
  parameters: { location: string } & { from: string; to: string } & {
    text: string;
  }
): Promise<string | WeatherInfo | CurrencyInfo> {
  const handler = agentHandlers[agent];
  if (!handler) {
    new HandleError(`Agente desconhecido: ${agent}`);
  }
  return await handler(parameters);
}
