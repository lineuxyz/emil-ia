import { HandleError } from "../handlers/handleError";

export interface CurrencyInfo {
  from: string;
  to: string;
  rate: number;
}

/**
 * Consulta uma API de câmbio (por exemplo, ExchangeRate API) para obter a cotação.
 *
 * @param parameters - Objeto contendo "from" e "to" (ex: { from: "USD", to: "BRL" }).
 * @returns Dados da cotação.
 */

export async function getCurrencyData(parameters: {
  from: string;
  to: string;
}): Promise<CurrencyInfo> {
  const { from, to } = parameters;
  const exchangerateApiKey = process.env.EXCHANGERATE_API_KEY;
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${exchangerateApiKey}/latest/${from}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    new HandleError(`Erro na API de currency: ${errorData.message}`);
  }

  const data = await response.json();
  const rate = data.conversion_rates[to];

  if (!rate) new HandleError(`Taxa para ${to} não encontrada.`);

  return { from, to, rate };
}
