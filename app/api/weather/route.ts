import { NextResponse } from "next/server";

type WeatherRequest = {
  lat: number;
  lon: number;
};

type ForecastEntry = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as WeatherRequest | null;

    if (!body || typeof body.lat !== "number" || typeof body.lon !== "number") {
      return NextResponse.json(
        { error: "Faltan coordenadas válidas" },
        { status: 400 }
      );
    }

    if (!process.env.OPENWEATHER_KEY) {
      return NextResponse.json(
        { error: "API key no configurada" },
        { status: 500 }
      );
    }

    const key = process.env.OPENWEATHER_KEY;

    // 🔥 Clima actual
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${body.lat}&lon=${body.lon}&units=metric&appid=${key}`;

    const currentRes = await fetch(currentUrl);
    const currentData = await currentRes.json();

    // 🔥 Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${body.lat}&lon=${body.lon}&units=metric&appid=${key}`;

    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    // 🔥 Formatear forecast
    const hourlyFormatted = (forecastData.list as ForecastEntry[])
      .slice(0, 8)
      .map((h) => {
        const date = new Date(h.dt * 1000);

        let hours = date.getHours();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;

        return {
          time: `${hours} ${ampm}`,
          temp: Math.round(h.main.temp),
          feels_like: Math.round(h.main.feels_like),
          condition: h.weather[0].description, // 🔥 más preciso
          icon: h.weather[0].icon,
        };
      });

    return NextResponse.json({
      city: currentData.name,
      country: currentData.sys?.country,

      temp: Math.round(currentData.main.temp),
      feels_like: Math.round(currentData.main.feels_like), // 🔥 agregado
      temp_min: Math.round(currentData.main.temp_min),
      temp_max: Math.round(currentData.main.temp_max),

      condition: currentData.weather[0].description, // 🔥 más real

      hourly: hourlyFormatted,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error procesando clima" },
      { status: 500 }
    );
  }
}