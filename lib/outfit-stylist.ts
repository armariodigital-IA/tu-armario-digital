import {
  normalizeGender,
  styleCompatibilityMap,
  stylePaletteMap,
  styleSilhouetteMap,
  type UserGender,
} from "@/lib/style-system";
import {
  normalizeGarmentCategory,
  normalizeGarmentSeason,
} from "@/lib/garment-utils";

type GarmentCategory = "top" | "bottom" | "shoes" | "outerwear";
type GarmentSeason = "summer" | "winter" | "all";

export type WardrobeGarment = {
  _id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  style?: string;
  material?: string;
  season: GarmentSeason;
  imageUrl: string;
  isFavorite?: boolean;
  favorite?: boolean;
};

export type OutfitRequestInput = {
  occasion?: string;
  timeOfDay?: string;
  freeText?: string;
  useWardrobeOnly?: boolean;
  gender?: string;
  styles?: string[];
  weather?: {
    temp?: number;
    condition?: string;
  } | null;
};

type MemoryHistoryEntry = {
  signature?: string;
  items?: string[];
  colors?: string[];
  styles?: string[];
  createdAt?: Date | string;
};

export type StyleMemory = {
  styleWeights?: Record<string, number>;
  colorWeights?: Record<string, number>;
  silhouetteWeights?: Record<string, number>;
  lastGeneratedOutfits?: MemoryHistoryEntry[];
};

export type OutfitItem = {
  _id: string;
  name: string;
  imageUrl: string;
  color: string;
  source: "wardrobe" | "internet";
  category: "top" | "bottom" | "shoes" | "layer";
};

export type StyledOutfitResult = {
  outfit: {
    top: OutfitItem | null;
    bottom: OutfitItem | null;
    shoes: OutfitItem | null;
    layer: OutfitItem | null;
  };
  explanation: string;
  appliedStyles: string[];
  palette: string[];
  styleMemory: StyleMemory;
};

const neutralColors = ["black", "white", "gray", "grey", "beige", "cream", "navy", "taupe", "stone", "camel"];

const occasionProfiles: Record<
  string,
  { formality: number; sportyBias: boolean; preferredKeywords: string[] }
> = {
  casual: { formality: 1, sportyBias: false, preferredKeywords: ["casual", "relaxed"] },
  work: { formality: 2, sportyBias: false, preferredKeywords: ["tailored", "smart", "structured"] },
  date: { formality: 2, sportyBias: false, preferredKeywords: ["refined", "elevated", "fitted"] },
  gym: { formality: 0, sportyBias: true, preferredKeywords: ["sport", "athletic", "performance"] },
  formal: { formality: 3, sportyBias: false, preferredKeywords: ["formal", "tailored", "elegant"] },
  "night-out": { formality: 2, sportyBias: false, preferredKeywords: ["sharp", "statement", "sleek"] },
  school: { formality: 1, sportyBias: false, preferredKeywords: ["comfortable", "clean", "layered"] },
};

function clampHistory(history: MemoryHistoryEntry[]) {
  return history.slice(-20);
}

function tokenize(value: string | undefined) {
  return (value ?? "")
    .toLowerCase()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
}

function inferSeason(weather?: OutfitRequestInput["weather"]) {
  if (typeof weather?.temp !== "number") {
    return "all";
  }

  if (weather.temp <= 16) return "winter";
  if (weather.temp >= 23) return "summer";
  return "all";
}

function needsLayer(weather?: OutfitRequestInput["weather"], occasion?: string) {
  if (occasion === "formal") return true;
  if (typeof weather?.temp === "number" && weather.temp < 18) return true;
  return Boolean(weather?.condition?.toLowerCase().includes("rain"));
}

function prioritizesLayer(weather?: OutfitRequestInput["weather"]) {
  return typeof weather?.temp === "number" && weather.temp < 12;
}

function resolveStyles(styles: string[], memory: StyleMemory) {
  const weights = memory.styleWeights ?? {};
  const unique = Array.from(new Set(styles.filter(Boolean)));

  if (unique.length === 0) {
    const fromMemory = Object.entries(weights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([style]) => style);

    return fromMemory.length > 0 ? fromMemory : ["minimal"];
  }

  const scored = unique
    .map((style, index) => ({
      style,
      score: (weights[style] ?? 0) + (unique.length - index) * 2,
    }))
    .sort((a, b) => b.score - a.score);

  const primary = scored[0]?.style ?? unique[0];
  const compatible = new Set(styleCompatibilityMap[primary] ?? [primary]);

  const resolved = [primary];

  for (const candidate of scored.slice(1)) {
    if (resolved.length >= 2) break;
    if (compatible.has(candidate.style)) {
      resolved.push(candidate.style);
    }
  }

  return resolved;
}

function pickPalette(styles: string[], memory: StyleMemory, freeText: string) {
  const weightEntries = Object.entries(memory.colorWeights ?? {}).sort(
    (a, b) => b[1] - a[1]
  );
  const paletteSeed = stylePaletteMap[styles[0]] ?? stylePaletteMap.minimal;
  const explicit = freeText.toLowerCase();

  const base =
    weightEntries.find(([color]) => paletteSeed.base.includes(color))?.[0] ??
    paletteSeed.base[0];
  const secondary =
    weightEntries.find(([color]) => paletteSeed.secondary.includes(color))?.[0] ??
    paletteSeed.secondary[0];

  let accent = paletteSeed.accent[0];

  if (explicit.includes("monochrome")) {
    accent = secondary;
  } else if (explicit.includes("neutral")) {
    accent = paletteSeed.secondary[1] ?? secondary;
  }

  return [base, secondary, accent].filter(Boolean);
}

function inferSilhouettes(styles: string[]) {
  return Array.from(
    new Set(styles.flatMap((style) => styleSilhouetteMap[style] ?? []))
  );
}

function garmentText(garment: WardrobeGarment) {
  return tokenize(
    [garment.name, garment.style, garment.material, garment.color].join(" ")
  );
}

function scoreGarment(params: {
  garment: WardrobeGarment;
  styles: string[];
  palette: string[];
  season: string;
  profile: { formality: number; sportyBias: boolean; preferredKeywords: string[] };
  recentHistory: MemoryHistoryEntry[];
  silhouettes: string[];
  freeText: string;
}) {
  const { garment, styles, palette, season, profile, recentHistory, silhouettes, freeText } =
    params;

  let score = 0;
  const text = garmentText(garment);
  const combinedStyleTokens = styles.flatMap((style) => tokenize(style.replace(/-/g, " ")));
  const freeTextTokens = tokenize(freeText);

  if (season === "all" || garment.season === "all" || garment.season === season) {
    score += 12;
  }

  if (palette.some((color) => garment.color.toLowerCase().includes(color))) {
    score += 15;
  } else if (neutralColors.some((color) => garment.color.toLowerCase().includes(color))) {
    score += 8;
  }

  if (Boolean(garment.isFavorite ?? garment.favorite)) {
    score += 6;
  }

  score += combinedStyleTokens.filter((token) => text.includes(token)).length * 3;
  score += silhouettes.filter((silhouette) => text.includes(silhouette)).length * 2;
  score += profile.preferredKeywords.filter((keyword) => text.includes(keyword)).length * 2;
  score += freeTextTokens.filter((token) => text.includes(token)).length;

  if (profile.sportyBias && text.includes("sport")) {
    score += 5;
  }

  if (garment.category === "outerwear" && typeof params.season === "string") {
    if (params.season === "winter") {
      score += 6;
    } else if (params.season === "summer") {
      score -= 8;
    }
  }

  const repeatedUsage = recentHistory.filter((entry) =>
    entry.items?.includes(String(garment._id))
  ).length;
  score -= repeatedUsage * 5;

  return score;
}

function categoryToOutput(category: GarmentCategory | "layer"): OutfitItem["category"] {
  if (category === "outerwear") return "layer";
  return category;
}

function toOutfitItem(
  garment: WardrobeGarment,
  category: GarmentCategory | "layer"
): OutfitItem {
  return {
    _id: String(garment._id),
    name: garment.name,
    imageUrl: garment.imageUrl,
    color: garment.color,
    source: "wardrobe",
    category: categoryToOutput(category),
  };
}

function buildInternetSuggestion(params: {
  category: OutfitItem["category"];
  styles: string[];
  palette: string[];
  occasion: string;
  gender: UserGender;
}) {
  const { category, styles, palette, occasion, gender } = params;
  const style = styles[0] ?? "minimal";
  const color = palette[0] ?? "black";

  const descriptors: Record<OutfitItem["category"], string> = {
    top:
      gender === "female" ? "top estructurado" : "top limpio",
    bottom:
      gender === "female" ? "bottom estilizado" : "bottom de línea recta",
    shoes:
      occasion === "formal"
        ? gender === "female"
          ? "zapatos elegantes"
          : "zapatos de cuero"
        : "zapatillas refinadas",
    layer:
      occasion === "formal" ? "capa pulida" : "capa ligera",
  };

  return {
    _id: `internet-${category}-${style}-${color}`,
    name: `${descriptors[category]} ${style.replace(/-/g, " ")} ${color}`,
    imageUrl: "",
    color,
    source: "internet" as const,
    category,
  };
}

function buildSignature(items: Array<OutfitItem | null>) {
  return items
    .filter((item): item is OutfitItem => item !== null)
    .map((item) => item._id)
    .sort()
    .join("|");
}

function calculateSimilarity(signature: string, recentHistory: MemoryHistoryEntry[]) {
  if (!signature) return 0;

  const parts = signature.split("|");

  return recentHistory.reduce((max, entry) => {
    const other = entry.signature?.split("|") ?? [];
    const overlap = parts.filter((part) => other.includes(part)).length;
    const similarity = other.length > 0 ? overlap / Math.max(parts.length, other.length) : 0;
    return Math.max(max, similarity);
  }, 0);
}

export function createStyledOutfit(params: {
  garments: WardrobeGarment[];
  user: {
    gender?: string;
    styles?: string[];
    styleMemory?: StyleMemory;
  };
  request: OutfitRequestInput;
}) {
  const { garments, user, request } = params;
  const memory = user.styleMemory ?? {};
  const gender = normalizeGender(request.gender ?? user.gender);
  const styles = resolveStyles(request.styles ?? user.styles ?? [], memory);
  const palette = pickPalette(styles, memory, request.freeText ?? "");
  const silhouettes = inferSilhouettes(styles);
  const profile =
    occasionProfiles[request.occasion ?? "casual"] ?? occasionProfiles.casual;
  const season = inferSeason(request.weather);
  const recentHistory = memory.lastGeneratedOutfits ?? [];
  const normalizedGarments = garments.map((garment) => ({
    ...garment,
    _id: String(garment._id),
    category: normalizeGarmentCategory(garment.category),
    season: normalizeGarmentSeason(garment.season),
  }));

  const rankedByCategory = {
    top: normalizedGarments
      .filter((garment) => garment.category === "top")
      .map((garment) => ({
        garment,
        score: scoreGarment({
          garment,
          styles,
          palette,
          season,
          profile,
          recentHistory,
          silhouettes,
          freeText: request.freeText ?? "",
        }),
      }))
      .sort((a, b) => b.score - a.score),
    bottom: normalizedGarments
      .filter((garment) => garment.category === "bottom")
      .map((garment) => ({
        garment,
        score: scoreGarment({
          garment,
          styles,
          palette,
          season,
          profile,
          recentHistory,
          silhouettes,
          freeText: request.freeText ?? "",
        }),
      }))
      .sort((a, b) => b.score - a.score),
    shoes: normalizedGarments
      .filter((garment) => garment.category === "shoes")
      .map((garment) => ({
        garment,
        score: scoreGarment({
          garment,
          styles,
          palette,
          season,
          profile,
          recentHistory,
          silhouettes,
          freeText: request.freeText ?? "",
        }),
      }))
      .sort((a, b) => b.score - a.score),
    outerwear: normalizedGarments
      .filter((garment) => garment.category === "outerwear")
      .map((garment) => ({
        garment,
        score: scoreGarment({
          garment,
          styles,
          palette,
          season,
          profile,
          recentHistory,
          silhouettes,
          freeText: request.freeText ?? "",
        }),
      }))
      .sort((a, b) => b.score - a.score),
  };

  console.log("[generate-outfit] garments after filtering by category:", {
    tops: rankedByCategory.top.map(({ garment }) => ({
      id: garment._id,
      name: garment.name,
      category: garment.category,
    })),
    bottoms: rankedByCategory.bottom.map(({ garment }) => ({
      id: garment._id,
      name: garment.name,
      category: garment.category,
    })),
    shoes: rankedByCategory.shoes.map(({ garment }) => ({
      id: garment._id,
      name: garment.name,
      category: garment.category,
    })),
  });

  const topChoices = rankedByCategory.top.slice(0, 4);
  const bottomChoices = rankedByCategory.bottom.slice(0, 4);
  const shoeChoices = rankedByCategory.shoes.slice(0, 4);
  const layerChoices = rankedByCategory.outerwear.slice(0, 4);

  let best:
    | {
        top: OutfitItem | null;
        bottom: OutfitItem | null;
        shoes: OutfitItem | null;
        layer: OutfitItem | null;
        score: number;
      }
    | undefined;

  for (const top of topChoices.length > 0 ? topChoices : [{ garment: null, score: 0 }]) {
    for (const bottom of bottomChoices.length > 0
      ? bottomChoices
      : [{ garment: null, score: 0 }]) {
      for (const shoes of shoeChoices.length > 0 ? shoeChoices : [{ garment: null, score: 0 }]) {
        const layerIsUseful = needsLayer(request.weather, request.occasion);
        const layerIsPriority = prioritizesLayer(request.weather);
        const potentialLayers =
          layerIsUseful && layerChoices.length > 0
            ? layerIsPriority
              ? layerChoices
              : [{ garment: null, score: 0 }, ...layerChoices]
            : [{ garment: null, score: 0 }];

        for (const layer of potentialLayers) {
          const selected = {
            top: top.garment ? toOutfitItem(top.garment, "top") : null,
            bottom: bottom.garment ? toOutfitItem(bottom.garment, "bottom") : null,
            shoes: shoes.garment ? toOutfitItem(shoes.garment, "shoes") : null,
            layer: layer.garment ? toOutfitItem(layer.garment, "outerwear") : null,
          };

          const signature = buildSignature(Object.values(selected));
          const similarityPenalty = calculateSimilarity(signature, recentHistory) > 0.7 ? 25 : 0;
          const randomFactor = Math.random() * 4;
          const layerBonus = layerIsPriority && layer.garment ? 12 : 0;
          const baseScore =
            top.score +
            bottom.score +
            shoes.score +
            layer.score +
            layerBonus +
            randomFactor -
            similarityPenalty;

          if (
            !best ||
            baseScore > best.score
          ) {
            best = { ...selected, score: baseScore };
          }
        }
      }
    }
  }

  const useWardrobeOnly = request.useWardrobeOnly !== false;

  const completed = {
    top:
      best?.top ??
      (useWardrobeOnly ? null : buildInternetSuggestion({
        category: "top",
        styles,
        palette,
        occasion: request.occasion ?? "casual",
        gender,
      })),
    bottom:
      best?.bottom ??
      (useWardrobeOnly ? null : buildInternetSuggestion({
        category: "bottom",
        styles,
        palette,
        occasion: request.occasion ?? "casual",
        gender,
      })),
    shoes:
      best?.shoes ??
      (useWardrobeOnly ? null : buildInternetSuggestion({
        category: "shoes",
        styles,
        palette,
        occasion: request.occasion ?? "casual",
        gender,
      })),
    layer:
      best?.layer ??
      (needsLayer(request.weather, request.occasion) && !useWardrobeOnly
        ? buildInternetSuggestion({
            category: "layer",
            styles,
            palette,
            occasion: request.occasion ?? "casual",
            gender,
          })
        : null),
  };

  const signature = buildSignature(Object.values(completed));
  const updatedMemory: StyleMemory = {
    styleWeights: { ...(memory.styleWeights ?? {}) },
    colorWeights: { ...(memory.colorWeights ?? {}) },
    silhouetteWeights: { ...(memory.silhouetteWeights ?? {}) },
    lastGeneratedOutfits: clampHistory([
      ...(memory.lastGeneratedOutfits ?? []),
      {
        signature,
        items: Object.values(completed)
          .filter((item): item is OutfitItem => item !== null)
          .map((item) => item._id),
        colors: palette,
        styles,
        createdAt: new Date(),
      },
    ]),
  };

  for (const style of styles) {
    updatedMemory.styleWeights![style] = (updatedMemory.styleWeights![style] ?? 0) + 1;
  }

  for (const color of palette) {
    updatedMemory.colorWeights![color] = (updatedMemory.colorWeights![color] ?? 0) + 1;
  }

  for (const silhouette of silhouettes) {
    updatedMemory.silhouetteWeights![silhouette] =
      (updatedMemory.silhouetteWeights![silhouette] ?? 0) + 1;
  }

  const explanation = [
    `Built around ${styles.join(" + ").replace(/-/g, " ")} with a ${palette[0]} base.`,
    typeof request.weather?.temp === "number"
      ? `Adjusted for ${Math.round(request.weather.temp)}° and ${request.weather.condition ?? "current conditions"}.`
      : "Balanced for the current context and occasion.",
    request.freeText
      ? `I also pulled from your note: "${request.freeText.trim()}".`
      : "Kept the silhouette and palette coherent instead of mixing conflicting aesthetics.",
  ].join(" ");

  return {
    outfit: completed,
    explanation,
    appliedStyles: styles,
    palette,
    styleMemory: updatedMemory,
  } satisfies StyledOutfitResult;
}
