import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { User } from "@/models/User";

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

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Token inválido" },
      { status: 401 }
    );
  }
}
