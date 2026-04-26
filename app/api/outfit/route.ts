import { NextResponse } from "next/server";

export async function POST() {
  const weather = {
    city: "Montevideo",
    temperature: 22,
    feels_like: 19,
    condition: "Despejado",
  };

  if (typeof weather.feels_like !== "number") {
    console.log("Weather API response missing feels_like:", weather);
  }

  return NextResponse.json({
    weather,
    outfit:
      "Remera blanca, pantalón negro liviano y zapatillas blancas. Sumá una campera de jean fina si salís más tarde.",
  });
}
