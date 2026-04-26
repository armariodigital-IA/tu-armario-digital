import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { Garment } from "@/models/Garment";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const decoded = verifyAuthToken(token);
    const body = await req.json();

    const garment = await Garment.create({
      userId: decoded.id,
      ...body,
    });

    return NextResponse.json(garment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo guardar la prenda" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const decoded = verifyAuthToken(token);

    const garments = await Garment.find({ userId: decoded.id });

    return NextResponse.json(garments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo obtener el armario" },
      { status: 500 }
    );
  }
}
