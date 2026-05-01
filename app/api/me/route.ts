import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { User } from "@/models/User";

function normalizeUserDocument(user: Record<string, unknown>) {
  return {
    ...user,
    styles: Array.isArray(user.styles)
      ? user.styles.filter((style): style is string => typeof style === "string")
      : [],
    hasCompletedOnboarding: user.hasCompletedOnboarding === true,
  };
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

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const normalizedUser = normalizeUserDocument(user.toObject());
    console.log("User from DB:", normalizedUser);
    console.log("Styles from DB:", normalizedUser.styles);

    return NextResponse.json(normalizedUser);

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Token inválido" },
      { status: 401 }
    );
  }
}

async function updateUser(req: NextRequest) {
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
    const body = (await req.json().catch(() => null)) as
      | { styles?: unknown; hasCompletedOnboarding?: unknown }
      | null;

    if (!body || !Array.isArray(body.styles)) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const styles = body.styles
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        styles,
        hasCompletedOnboarding:
          typeof body.hasCompletedOnboarding === "boolean"
            ? body.hasCompletedOnboarding
            : true,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const normalizedUser = normalizeUserDocument(updatedUser.toObject());
    console.log("User from DB:", normalizedUser);
    console.log("Styles from DB:", normalizedUser.styles);

    return NextResponse.json(normalizedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "No se pudieron guardar los estilos" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  return updateUser(req);
}

export async function PUT(req: NextRequest) {
  return updateUser(req);
}
