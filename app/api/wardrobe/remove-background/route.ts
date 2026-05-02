import { NextResponse, type NextRequest } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

const maxUploadBytes = 8 * 1024 * 1024;

function parseDataUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  const buffer = Buffer.from(match[2], "base64");

  return {
    mimeType: match[1],
    buffer,
  };
}

function bufferToDataUrl(buffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    verifyAuthToken(token);

    const body = (await req.json().catch(() => null)) as {
      imageUrl?: unknown;
    } | null;
    const source = parseDataUrl(body?.imageUrl);

    if (!source) {
      return NextResponse.json(
        { error: "Imagen inválida" },
        { status: 400 }
      );
    }

    if (source.buffer.byteLength > maxUploadBytes) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande" },
        { status: 413 }
      );
    }

    const { transparentBackground } = await import("transparent-background");
    const output = await transparentBackground(source.buffer, "png", {
      fast: false,
    });
    const pngBuffer = Buffer.isBuffer(output) ? output : Buffer.from(output);

    return NextResponse.json({
      imageUrl: bufferToDataUrl(pngBuffer, "image/png"),
      mimeType: "image/png",
    });
  } catch (error) {
    console.error("[wardrobe/remove-background] failed", error);

    return NextResponse.json(
      { error: "No se pudo quitar el fondo" },
      { status: 500 }
    );
  }
}
