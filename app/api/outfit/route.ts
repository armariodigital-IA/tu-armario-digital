import { NextResponse } from "next/server";
import { fetchOpenWeatherData } from "../weather/openweather";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { lat?: number; lon?: number }
      | null;
    const weather = await fetchOpenWeatherData(body);

    return NextResponse.json({
      weather: {
        city: weather.city,
        temperature: weather.temperature,
        feels_like: weather.feels_like,
        condition: weather.condition,
        hourly: weather.hourly,
      },
      outfit:
        "Remera blanca, pantalón negro liviano y zapatillas blancas. Sumá una campera de jean fina si salís más tarde.",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_COORDINATES") {
      return NextResponse.json(
        { error: "Faltan coordenadas válidas" },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "MISSING_OPENWEATHER_KEY") {
      return NextResponse.json(
        { error: "OPENWEATHER_KEY no está configurada" },
        { status: 500 }
      );
    }

    console.log(error);
    return NextResponse.json(
      { error: "Error obteniendo clima actual" },
      { status: 500 }
    );
  }
}
