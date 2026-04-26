import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    weather: {
      city: "Montevideo",
      temperature: 22,
      condition: "Despejado",
    },
    outfit:
      "Remera blanca, pantalón negro liviano y zapatillas blancas. Sumá una campera de jean fina si salís más tarde.",
  });
}
