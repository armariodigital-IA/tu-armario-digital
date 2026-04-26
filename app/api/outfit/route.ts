import OpenAI from "openai";
import { NextResponse } from "next/server";

type OutfitWeatherRequest = {
  lat: number;
  lon: number;
};

function buildFallbackRecommendation(city: string, temp: number) {
  if (temp >= 24) {
    return `${city}: remera liviana, pantalón fresco y zapatillas cómodas. Va limpio, respirable y perfecto para el calor.`;
  }

  if (temp <= 14) {
    return `${city}: sumá abrigo, capa superior sólida, pantalón largo y calzado cerrado. Queda prolijo y te cubre bien del frío.`;
  }

  return `${city}: andá con capas livianas, parte superior versátil, pantalón largo y zapatillas. Es un equilibrio prolijo para media estación.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as OutfitWeatherRequest | null;

    if (!body || typeof body.lat !== "number" || typeof body.lon !== "number") {
      return NextResponse.json(
        { error: "Faltan coordenadas válidas" },
        { status: 400 }
      );
    }

    if (!process.env.OPENWEATHER_KEY) {
      return NextResponse.json(
        { error: "OPENWEATHER_KEY no está configurada" },
        { status: 500 }
      );
    }

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${body.lat}&lon=${body.lon}&units=metric&appid=${process.env.OPENWEATHER_KEY}`
    );

    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: "No se pudo obtener el clima actual" },
        { status: 502 }
      );
    }

    const weatherData = await weatherRes.json();
    const city = weatherData?.name;
    const temperature = weatherData?.main?.temp;

    if (typeof city !== "string" || typeof temperature !== "number") {
      return NextResponse.json(
        { error: "Respuesta inválida del servicio de clima" },
        { status: 502 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        outfit: buildFallbackRecommendation(city, temperature),
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sos un asesor de estilo masculino. Respondé en español, en una sola frase corta, con una recomendación concreta y elegante.",
        },
        {
          role: "user",
          content: `Estoy en ${city} y hacen ${Math.round(
            temperature
          )} grados. Decime qué ponerme hoy.`,
        },
      ],
    });

    return NextResponse.json({
      outfit:
        response.choices[0]?.message?.content?.trim() ??
        buildFallbackRecommendation(city, temperature),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error generando recomendación" },
      { status: 500 }
    );
  }
}
