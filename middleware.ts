import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtenemos el token de las cookies
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Si no hay token, redirige al home
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si hay token, permite continuar con la solicitud
  return NextResponse.next();
}

// Solo protegemos el dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};