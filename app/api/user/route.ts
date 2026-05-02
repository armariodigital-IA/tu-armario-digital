import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { User } from "@/models/User";

type LeanUserDocument = Record<string, unknown> & {
  styles?: unknown[];
  hasCompletedOnboarding?: unknown;
};

function normalizeUserDocument(user: LeanUserDocument) {
  return {
    ...user,
    styles: user.styles ?? [],
    hasCompletedOnboarding: Boolean(user.hasCompletedOnboarding),
  };
}

function getAuthenticatedUserId(req: NextRequest) {
  const token = getTokenFromRequest(req);

  if (!token) {
    console.error("NO TOKEN FOUND IN REQUEST");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyAuthToken(token);
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
    console.log("GET USER ID:", userId);

    if (userId instanceof NextResponse) {
      return userId;
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const normalizedUser = normalizeUserDocument(user as LeanUserDocument);
    console.log("Styles returned:", normalizedUser.styles);

    return NextResponse.json(normalizedUser);
  } catch (error) {
    console.error("GET /api/user error:", error);
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
    console.log("PUT USER ID:", userId);

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

    const styles = rawStyles
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    console.log("Styles received:", styles);

    const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    $set: {
      styles,
      hasCompletedOnboarding:
        typeof body.hasCompletedOnboarding === "boolean"
          ? body.hasCompletedOnboarding
          : true,
    },
  },
  {
    returnDocument: "after",
    runValidators: true,
  }
)
  .select("-password")
  .lean();

// 👇 🔥 ACÁ EXACTAMENTE
console.log("RAW USER FROM DB:", updatedUser);

if (!updatedUser) {
  return NextResponse.json(
    { error: "Usuario no encontrado" },
    { status: 404 }
  );
}

    const normalizedUser = normalizeUserDocument(updatedUser as Record<string, unknown>);
    console.log("Styles saved:", normalizedUser.styles);
    console.log("Styles returned:", normalizedUser.styles);

    return NextResponse.json(normalizedUser);
  } catch (error) {
    console.error("PUT /api/user error:", error);
    return NextResponse.json(
      { error: "No se pudieron guardar los estilos" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return updateUser(req);
}

export async function PATCH(req: NextRequest) {
  return updateUser(req);
}
