import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

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

    // 1️⃣ Clima actual
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${body.lat}&lon=${body.lon}&units=metric&appid=${key}`;

    const currentRes = await fetch(currentUrl);
    const currentData = await currentRes.json();

    // 2️⃣ Forecast horario
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${body.lat}&lon=${body.lon}&units=metric&appid=${key}`;

    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    // OpenWeather forecast viene cada 3 horas
    const hourlyFormatted = forecastData.list.slice(0, 8).map((h: any) => {
  const date = new Date(h.dt * 1000)

  let hours = date.getHours()
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12

  return {
    time: `${hours} ${ampm}`,
    temp: Math.round(h.main.temp),
    condition: h.weather[0].main,
    icon: h.weather[0].icon,
  }
})

    return NextResponse.json({
      city: currentData.name,
      country: currentData.sys?.country,
      temp: currentData.main.temp,
      temp_min: currentData.main.temp_min,
      temp_max: currentData.main.temp_max,
      condition: currentData.weather[0].main,
      hourly: hourlyFormatted,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando clima" },
      { status: 500 }
    );
  }
}