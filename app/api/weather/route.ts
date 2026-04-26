import { NextResponse } from "next/server";
import { fetchOpenWeatherData } from "./openweather";

type WeatherRequest = {
  lat: number;
  lon: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as WeatherRequest | null;
    const weather = await fetchOpenWeatherData(body);

    return NextResponse.json({
      city: weather.city,
      country: weather.country,
      temp: weather.temp,
      feels_like: weather.feels_like,
      temp_min: weather.temp_min,
      temp_max: weather.temp_max,
      condition: weather.condition,
      hourly: weather.hourly,
      source: weather.source,
      coordinates: weather.coordinates,
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
        { error: "API key no configurada" },
        { status: 500 }
      );
    }

    console.log(error);
    return NextResponse.json(
      { error: "Error procesando clima" },
      { status: 500 }
    );
  }
}
