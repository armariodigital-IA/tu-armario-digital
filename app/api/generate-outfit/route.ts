import { NextResponse, type NextRequest } from "next/server";
import { getTokenFromRequest, verifyAuthToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Garment } from "@/models/Garment";

type GarmentCategory = "top" | "bottom" | "shoes" | "outerwear";
type GarmentSeason = "summer" | "winter" | "all";

type WardrobeGarment = {
  _id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  season: GarmentSeason;
  imageUrl: string;
};

type WeatherInput = {
  temp?: number;
};

type GenerateOutfitBody = {
  occasion?: string;
  mood?: string;
  weather?: WeatherInput | null;
};

function inferSeason(weather: WeatherInput | null | undefined): GarmentSeason {
  if (typeof weather?.temp !== "number") {
    return "all";
  }

  if (weather.temp >= 22) {
    return "summer";
  }

  if (weather.temp <= 16) {
    return "winter";
  }

  return "all";
}

function shouldIncludeOuterwear(weather: WeatherInput | null | undefined) {
  return typeof weather?.temp === "number" && weather.temp <= 18;
}

function pickGarment(
  garments: WardrobeGarment[],
  category: GarmentCategory,
  preferredSeason: GarmentSeason
) {
  const candidates = garments.filter((garment) => garment.category === category);

  if (preferredSeason !== "all") {
    const seasonMatch = candidates.find(
      (garment) => garment.season === preferredSeason || garment.season === "all"
    );

    if (seasonMatch) {
      return seasonMatch;
    }
  }

  return candidates.find(Boolean) ?? null;
}

function buildExplanation(
  occasion: string,
  mood: string,
  outfit: {
    top: WardrobeGarment | null;
    bottom: WardrobeGarment | null;
    shoes: WardrobeGarment | null;
    outerwear: WardrobeGarment | null;
  }
) {
  const selectedNames = [
    outfit.top?.name,
    outfit.bottom?.name,
    outfit.shoes?.name,
    outfit.outerwear?.name,
  ].filter(Boolean);

  if (selectedNames.length === 0) {
    return "No encontré prendas suficientes para armar un outfit con tu armario actual.";
  }

  return `Armé una propuesta ${occasion} con energía ${mood}: ${selectedNames.join(
    ", "
  )}.`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = verifyAuthToken(token);
    const body = (await req.json().catch(() => null)) as GenerateOutfitBody | null;

    if (!body) {
      return NextResponse.json(
        { error: "Cuerpo inválido" },
        { status: 400 }
      );
    }

    const occasion = body.occasion?.trim() || "casual";
    const mood = body.mood?.trim() || "equilibrada";
    const preferredSeason = inferSeason(body.weather);

    const garments = (await Garment.find({ userId: id }).lean()) as WardrobeGarment[];

    if (garments.length === 0) {
      return NextResponse.json(
        { error: "No hay prendas en tu armario" },
        { status: 400 }
      );
    }

    const outfit = {
      top: pickGarment(garments, "top", preferredSeason),
      bottom: pickGarment(garments, "bottom", preferredSeason),
      shoes: pickGarment(garments, "shoes", preferredSeason),
      outerwear: shouldIncludeOuterwear(body.weather)
        ? pickGarment(garments, "outerwear", preferredSeason)
        : null,
    };

    return NextResponse.json({
      outfit,
      explanation: buildExplanation(occasion, mood, outfit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error generando outfit" },
      { status: 500 }
    );
  }
}
