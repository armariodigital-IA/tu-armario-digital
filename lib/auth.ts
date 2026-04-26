import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

type TokenPayload = {
  id: string;
};

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET no está configurada");
  }

  return jwtSecret;
}

export function getTokenFromRequest(request: NextRequest) {
  return request.cookies.get("token")?.value ?? null;
}

export function verifyAuthToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("id" in decoded) ||
    typeof decoded.id !== "string"
  ) {
    throw new Error("Token inválido");
  }

  return { id: decoded.id };
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}
