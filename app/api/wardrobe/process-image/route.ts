import { NextResponse, type NextRequest } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

const maxUploadBytes = 8 * 1024 * 1024;

function bufferToDataUrl(buffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

async function removeImageBackground(buffer: Buffer, mimeType: string) {
  const { removeBackground } = await import("@imgly/background-removal-node");
  const source = new Blob([new Uint8Array(buffer)], { type: mimeType });
  const result = await removeBackground(source);
  const arrayBuffer = await result.arrayBuffer();

  return Buffer.from(arrayBuffer);
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    verifyAuthToken(token);

    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Imagen inválida" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen" },
        { status: 400 }
      );
    }

    if (file.size > maxUploadBytes) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande" },
        { status: 413 }
      );
    }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    const originalDataUrl = bufferToDataUrl(
      originalBuffer,
      file.type || "application/octet-stream"
    );

    try {
      const pngBuffer = await removeImageBackground(
        originalBuffer,
        file.type || "image/png"
      );

      return NextResponse.json({
        imageUrl: bufferToDataUrl(pngBuffer, "image/png"),
        mimeType: "image/png",
        backgroundRemoved: true,
      });
    } catch (backgroundError) {
      console.warn("[wardrobe/process-image] background removal failed", backgroundError);

      return NextResponse.json({
        imageUrl: originalDataUrl,
        mimeType: file.type,
        backgroundRemoved: false,
      });
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "No se pudo procesar la imagen" },
      { status: 500 }
    );
  }
}
