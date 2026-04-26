import { NextResponse } from "next/server";
import { getAuthCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logout exitoso" });

  response.cookies.set("token", "", {
    ...getAuthCookieOptions(),
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
