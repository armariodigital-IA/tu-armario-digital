import mongoose from "mongoose";
import { NextResponse, type NextRequest } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Garment } from "@/models/Garment";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
