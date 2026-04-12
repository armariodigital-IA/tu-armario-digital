import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { occasion, style } = await req.json();

  // Lógica simple por ahora
  const outfit = `Outfit ${style} para ocasión ${occasion}: 
  - Parte superior adecuada
  - Parte inferior combinada
  - Calzado acorde`;

  return NextResponse.json({ outfit });
}