import { NextResponse, type NextRequest } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Garment } from "@/models/Garment";
import { User } from "@/models/User";
import { createStyledOutfit, type OutfitRequestInput, type WardrobeGarment } from "@/lib/outfit-stylist";
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

    const { id } = verifyAuthToken(token);
    const body = (await req.json().catch(() => null)) as OutfitRequestInput | null;

    if (!body) {
      return NextResponse.json(
        { error: "Cuerpo inválido" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const garments = ((await Garment.find({ userId: id }).lean()) as Array<
      WardrobeGarment & { userId?: unknown }
    >).map((garment) => ({
      ...garment,
      _id: String(garment._id),
      category: normalizeGarmentCategory(garment.category),
      season: normalizeGarmentSeason(garment.season),
    }));

    console.log("[generate-outfit] user id:", id);
    console.log(
      "[generate-outfit] garments fetched before filtering:",
      garments.map((garment) => ({
        id: garment._id,
        name: garment.name,
        userId: String(garment.userId ?? ""),
        category: garment.category,
        season: garment.season,
      }))
    );

    if (garments.length === 0 && body.useWardrobeOnly !== false) {
      return NextResponse.json(
        { error: "No hay prendas en tu armario" },
        { status: 400 }
      );
    }

    const result = createStyledOutfit({
      garments,
      user: {
        gender: user.gender,
        styles: user.styles,
        styleMemory: user.styleMemory,
      },
      request: body,
    });

    user.styleMemory = result.styleMemory;
    await user.save();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error generando outfit" },
      { status: 500 }
    );
  }
}
