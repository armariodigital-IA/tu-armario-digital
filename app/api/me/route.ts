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

function getAuthenticatedUserId(req: NextRequest) {
  const token = getTokenFromRequest(req);
  console.log("Cookies received:", req.cookies.getAll());

  if (!token) {
    console.error("NO TOKEN FOUND IN REQUEST");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyAuthToken(token);
    console.log("FETCHING USER WITH ID:", decoded.id);
    return decoded.id;
  } catch (error) {
    console.error("INVALID TOKEN", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = getAuthenticatedUserId(req);

    if (userId instanceof NextResponse) {
      return userId;
    }

    const user = await User.findById(userId).select("-password");

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

    const userId = getAuthenticatedUserId(req);

    if (userId instanceof NextResponse) {
      return userId;
    }
    const body = (await req.json().catch(() => null)) as
      | {
          styles?: unknown;
          selectedStyles?: unknown;
          hasCompletedOnboarding?: unknown;
        }
      | null;

    console.log("BODY:", body);
    console.log("USER ID:", userId);

    if (!body) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const rawStyles = Array.isArray(body.styles)
      ? body.styles
      : Array.isArray(body.selectedStyles)
      ? body.selectedStyles
      : [];

    console.log("STYLES RECEIVED:", rawStyles);

    const styles = rawStyles
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);
    const hasCompletedOnboarding =
      typeof body.hasCompletedOnboarding === "boolean"
        ? body.hasCompletedOnboarding
        : true;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    user.styles = styles;
    user.hasCompletedOnboarding = hasCompletedOnboarding;

    console.log("BEFORE SAVE:", user.styles);

    await user.save();

    console.log("AFTER SAVE:", user.styles);

    const checkUser = await User.findById(userId).select("-password");
    console.log("UPDATED USER IN DB:", checkUser);

    const normalizedUser = normalizeUserDocument(user.toObject());
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
