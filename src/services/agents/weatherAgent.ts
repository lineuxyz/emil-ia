import { HandleError } from "../handlers/handleError";

export interface WeatherInfo {
  city: string,
  description: string,
  temperature: number,
  humidity: number,
  wind: number,
}

/**
 * Consulta a API do OpenWeatherMap para obter dados do clima.
 * 
 * @param location - Nome da cidade ou localidade.
 * @param apiKey - Chave da API do OpenWeatherMap.
 * @returns Dados formatados do clima.
 * @throws Erro caso a requisição falhe.
 */

export async function getWeatherData(location: string): Promise<WeatherInfo> {
  const weatherApiKey = process.env.OPENWEATHER_API_KEY;
  
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${weatherApiKey}&units=metric&lang=pt`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorData = await response.json();
    new HandleError(`Erro na API de Clima: ${errorData.message}`);
  }

  const data = await response.json();

  const formattedData: WeatherInfo = {
    city: data.name,
    description: data.weather[0].description,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    wind: data.wind.speed,
  };

  return formattedData;
}
