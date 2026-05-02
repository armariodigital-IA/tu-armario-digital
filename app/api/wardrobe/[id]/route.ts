import mongoose from "mongoose";
import { NextResponse, type NextRequest } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Garment } from "@/models/Garment";
import {
  normalizeGarmentCategory,
  normalizeGarmentSeason,
} from "@/lib/garment-utils";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const allowedUpdates = [
  "name",
  "category",
  "color",
  "style",
  "material",
  "season",
  "imageUrl",
  "isFavorite",
  "favorite",
] as const;

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const decoded = verifyAuthToken(token);
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de prenda inválido" },
        { status: 400 }
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const updates = Object.fromEntries(
      Object.entries(body).filter(([key]) =>
        allowedUpdates.includes(key as (typeof allowedUpdates)[number])
      )
    );

    const nextFavorite =
      typeof updates.isFavorite === "boolean"
        ? updates.isFavorite
        : typeof updates.favorite === "boolean"
          ? updates.favorite
          : undefined;

    if (typeof nextFavorite === "boolean") {
      updates.isFavorite = nextFavorite;
      updates.favorite = nextFavorite;
    }

    if ("category" in updates) {
      updates.category = normalizeGarmentCategory(updates.category);
    }

    if ("season" in updates) {
      updates.season = normalizeGarmentSeason(updates.season);
    }

    const updatedGarment = await Garment.findOneAndUpdate(
      { _id: id, userId: decoded.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedGarment) {
      return NextResponse.json(
        { error: "Prenda no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGarment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo actualizar la prenda" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const decoded = verifyAuthToken(token);
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de prenda inválido" },
        { status: 400 }
      );
    }

    const deletedGarment = await Garment.findOneAndDelete({
      _id: id,
      userId: decoded.id,
    });

    if (!deletedGarment) {
      return NextResponse.json(
        { error: "Prenda no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Prenda eliminada" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo eliminar la prenda" },
      { status: 500 }
    );
  }
}
