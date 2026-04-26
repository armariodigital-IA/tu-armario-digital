import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";

type AnalyzeRequest = {
  imageUrl?: string;
};

type AnalysisResult = {
  name: string;
  category: "top" | "bottom" | "shoes" | "outerwear";
  color: string;
  style: string;
  season: "all" | "summer" | "winter";
  material: string;
};

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("INVALID_ANALYSIS_RESPONSE");
  }

  return JSON.parse(text.slice(start, end + 1)) as Partial<AnalysisResult>;
}

function normalizeAnalysis(result: Partial<AnalysisResult>): AnalysisResult {
  const category =
    result.category === "top" ||
    result.category === "bottom" ||
    result.category === "shoes" ||
    result.category === "outerwear"
      ? result.category
      : "top";

  const season =
    result.season === "summer" ||
    result.season === "winter" ||
    result.season === "all"
      ? result.season
      : "all";

  return {
    name: result.name?.trim() || "Prenda analizada",
    category,
    color: result.color?.trim() || "",
    style: result.style?.trim() || "",
    season,
    material: result.material?.trim() || "",
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY no está configurada" },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => null)) as AnalyzeRequest | null;

    if (!body?.imageUrl) {
      return NextResponse.json(
        { error: "Falta la imagen para analizar" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Analiza prendas de ropa a partir de imágenes. Respondé solo JSON con las claves name, category, color, style, season y material. " +
            "category debe ser top, bottom, shoes u outerwear. season debe ser summer, winter o all. " +
            "Usá valores cortos y concretos.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Observá la prenda de la imagen y completá name, category, color, style, season y material. " +
                "Si no podés inferir material o style con seguridad, devolvé una mejor estimación breve.",
            },
            {
              type: "image_url",
              image_url: {
                url: body.imageUrl,
              },
            },
          ],
        },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error("EMPTY_ANALYSIS_RESPONSE");
    }

    const analysis = normalizeAnalysis(extractJson(rawContent));

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Garment analysis error:", error);
    return NextResponse.json(
      { error: "No se pudo analizar la imagen" },
      { status: 500 }
    );
  }
}
