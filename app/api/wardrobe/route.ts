import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { Garment } from "@/models/Garment";
import {
  normalizeGarmentCategory,
  normalizeGarmentSeason,
} from "@/lib/garment-utils";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const decoded = verifyAuthToken(token);
    const body = (await req.json()) as Record<string, unknown>;
    const nextFavorite =
      typeof body.isFavorite === "boolean"
        ? body.isFavorite
        : typeof body.favorite === "boolean"
          ? body.favorite
          : false;
    const normalizedCategory = normalizeGarmentCategory(body.category);
    const normalizedSeason = normalizeGarmentSeason(body.season);

    const garment = await Garment.create({
      userId: decoded.id,
      ...body,
      category: normalizedCategory,
      season: normalizedSeason,
      isFavorite: nextFavorite,
      favorite: nextFavorite,
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
    const normalizedGarments = garments.map((garment) => {
      const json = garment.toObject();
      const isFavorite = Boolean(json.isFavorite ?? json.favorite);

      return {
        ...json,
        category: normalizeGarmentCategory(json.category),
        season: normalizeGarmentSeason(json.season),
        isFavorite,
        favorite: isFavorite,
      };
    });

    return NextResponse.json(normalizedGarments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo obtener el armario" },
      { status: 500 }
    );
  }
}
