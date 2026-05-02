"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  RefreshCw,
  Shirt,
  Sparkles,
  Stars,
} from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useUser } from "@/app/providers/UserProvider";
import {
  useGarments,
  type Garment,
  type GarmentCategory,
} from "@/app/providers/GarmentsProvider";
import type { TranslationKey } from "@/app/i18n";

type OccasionValue =
  | "casual"
  | "formal"
  | "gym"
  | "work"
  | "date"
  | "night-out";

type TimeOfDayValue = "morning" | "afternoon" | "night";

type WeatherSummary = {
  city?: string;
  temp?: number;
  temperature?: number;
  condition?: string;
};

type OutfitCategory = GarmentCategory;

type OutfitSource = "wardrobe" | "fallback";

type OutfitItem = {
  id: string;
  name: string;
  category: OutfitCategory;
  color: string;
  imageUrl: string;
  season: string;
  style: string;
  material: string;
  source: OutfitSource;
  score: number;
};

type GeneratedOutfit = {
  top: OutfitItem | null;
  bottom: OutfitItem | null;
  shoes: OutfitItem | null;
  outerwear: OutfitItem | null;
  usedFallback: boolean;
  hasEnoughCorePieces: boolean;
  signature: string;
};

const occasionOptions: Array<{ value: OccasionValue; key: string }> = [
  { value: "casual", key: "occasionCasual" },
  { value: "formal", key: "occasionFormal" },
  { value: "gym", key: "occasionGym" },
  { value: "work", key: "occasionWork" },
  { value: "date", key: "occasionDate" },
  { value: "night-out", key: "occasionNightOut" },
];

const timeOptions: Array<{ value: TimeOfDayValue; key: string }> = [
  { value: "morning", key: "timeMorning" },
  { value: "afternoon", key: "timeAfternoon" },
  { value: "night", key: "timeNight" },
];

const weatherTranslations: Record<string, string> = {
  "clear sky": "Cielo despejado",
  "broken clouds": "Nubes dispersas",
  "few clouds": "Pocas nubes",
  "scattered clouds": "Nubes dispersas",
  "overcast clouds": "Nublado",
  rain: "Lluvia",
  "light rain": "Lluvia ligera",
  drizzle: "Llovizna",
  thunderstorm: "Tormenta",
  snow: "Nieve",
  mist: "Neblina",
  fog: "Niebla",
};

function capitalizeFirstLetter(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function translateWeatherCondition(condition: string | undefined) {
  const normalized = normalizeText(condition);

  if (!normalized) {
    return "";
  }

  return capitalizeFirstLetter(weatherTranslations[normalized] ?? condition?.trim() ?? "");
}

function buildWeatherField(
  temperature: number | null | undefined,
  condition: string | undefined
) {
  const translatedCondition = translateWeatherCondition(condition);
  const temperatureLabel =
    typeof temperature === "number" ? `${Math.round(temperature)}°C` : "";

  return [temperatureLabel, translatedCondition].filter(Boolean).join(" · ");
}

function normalizeColor(color: string | undefined) {
  return normalizeText(color).replace(/\s+/g, " ");
}

function isNeutralColor(color: string) {
  return [
    "black",
    "white",
    "cream",
    "beige",
    "gray",
    "grey",
    "stone",
    "taupe",
    "brown",
    "camel",
    "navy",
    "charcoal",
    "espresso",
    "oat",
  ].some((neutral) => color.includes(neutral));
}

function getColorHarmonyScore(items: OutfitItem[]) {
  const colors = items.map((item) => normalizeColor(item.color)).filter(Boolean);

  if (colors.length <= 1) {
    return 2;
  }

  const uniqueColors = new Set(colors);

  if (uniqueColors.size === 1) {
    return 4;
  }

  const neutralCount = colors.filter(isNeutralColor).length;

  if (neutralCount >= 2) {
    return 3;
  }

  if (uniqueColors.size === colors.length) {
    return 1;
  }

  return 2;
}

function createSeed(value: number) {
  const seed = Math.sin(value * 999) * 10000;
  return seed - Math.floor(seed);
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleWithSeed<T>(items: T[], seed: number) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(seededRandom(seed + index * 13) * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
}

function buildOutfitSignature(items: Array<OutfitItem | null>) {
  return items
    .filter((item): item is OutfitItem => Boolean(item))
    .map((item) => item.id)
    .sort()
    .join("|");
}

const fallbackGarments: OutfitItem[] = [
  {
    id: "fallback-top-1",
    name: "Soft knit crewneck",
    category: "top",
    color: "cream",
    imageUrl: "",
    season: "winter",
    style: "casual minimal classic",
    material: "knit",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-top-2",
    name: "Performance tank",
    category: "top",
    color: "charcoal",
    imageUrl: "",
    season: "summer",
    style: "sporty gym",
    material: "dry-fit",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-top-3",
    name: "Silk evening blouse",
    category: "top",
    color: "black",
    imageUrl: "",
    season: "all",
    style: "formal elegant night-out",
    material: "silk",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-bottom-1",
    name: "Tailored wide-leg trousers",
    category: "bottom",
    color: "stone",
    imageUrl: "",
    season: "all",
    style: "formal classic work",
    material: "wool blend",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-bottom-2",
    name: "Relaxed denim",
    category: "bottom",
    color: "indigo",
    imageUrl: "",
    season: "all",
    style: "casual minimal",
    material: "denim",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-bottom-3",
    name: "Training leggings",
    category: "bottom",
    color: "black",
    imageUrl: "",
    season: "all",
    style: "sporty gym",
    material: "performance stretch",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-shoes-1",
    name: "Clean leather sneakers",
    category: "shoes",
    color: "white",
    imageUrl: "",
    season: "all",
    style: "casual minimal",
    material: "leather",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-shoes-2",
    name: "Structured loafers",
    category: "shoes",
    color: "espresso",
    imageUrl: "",
    season: "all",
    style: "formal classic work",
    material: "leather",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-shoes-3",
    name: "Running sneakers",
    category: "shoes",
    color: "graphite",
    imageUrl: "",
    season: "all",
    style: "sporty gym",
    material: "mesh",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-outerwear-1",
    name: "Soft wool scarf",
    category: "outerwear",
    color: "oat",
    imageUrl: "",
    season: "winter",
    style: "casual elegant",
    material: "wool",
    source: "fallback",
    score: 0,
  },
  {
    id: "fallback-outerwear-2",
    name: "Structured wool coat",
    category: "outerwear",
    color: "black",
    imageUrl: "",
    season: "all",
    style: "formal minimal date night-out",
    material: "leather",
    source: "fallback",
    score: 0,
  },
];

function normalizeText(value: string | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function garmentToOutfitItem(garment: Garment): OutfitItem {
  return {
    id: garment._id,
    name: garment.name,
    category: garment.category,
    color: garment.color,
    imageUrl: garment.imageUrl,
    season: garment.season,
    style: garment.style ?? "",
    material: garment.material ?? "",
    source: "wardrobe",
    score: 0,
  };
}

function getWeatherProfile(input: string, detectedWeather: WeatherSummary | null) {
  const normalizedInput = normalizeText(input);
  const detectedTemp = detectedWeather?.temp ?? detectedWeather?.temperature;
  const tempMatch = normalizedInput.match(/-?\d+/);
  const temperature =
    tempMatch && Number.isFinite(Number(tempMatch[0]))
      ? Number(tempMatch[0])
      : typeof detectedTemp === "number"
        ? detectedTemp
        : null;
  const condition = normalizedInput || normalizeText(detectedWeather?.condition);

  return {
    temperature,
    condition,
    season:
      temperature !== null && temperature <= 14
        ? "winter"
        : temperature !== null && temperature >= 24
          ? "summer"
          : "all",
  };
}

function matchesWeather(item: OutfitItem, weatherInput: ReturnType<typeof getWeatherProfile>) {
  const haystack = [
    normalizeText(item.name),
    normalizeText(item.style),
    normalizeText(item.material),
    normalizeText(item.season),
  ].join(" ");

  let points = 0;

  if (
    weatherInput.season === "winter" &&
    (item.season === "winter" ||
      haystack.includes("wool") ||
      haystack.includes("knit") ||
      haystack.includes("coat") ||
      haystack.includes("boot"))
  ) {
    points = 2;
  }

  if (item.category === "outerwear" && typeof weatherInput.temperature === "number") {
    if (weatherInput.temperature < 12) {
      points += 7;
    } else if (weatherInput.temperature < 18) {
      points += 4;
    } else if (weatherInput.temperature >= 22) {
      points -= 6;
    }
  }

  if (
    weatherInput.season === "summer" &&
    (item.season === "summer" ||
      haystack.includes("linen") ||
      haystack.includes("tank") ||
      haystack.includes("short") ||
      haystack.includes("breathable"))
  ) {
    points = 2;
  }

  if (weatherInput.season === "all" && item.season === "all") {
    points = 2;
  }

  if (
    (weatherInput.condition.includes("rain") || weatherInput.condition.includes("lluvia")) &&
    (haystack.includes("boot") || haystack.includes("water") || haystack.includes("jacket"))
  ) {
    points = 2;
  }

  return points;
}

function matchesStyles(item: OutfitItem, styles: string[]) {
  const source = normalizeText(`${item.style} ${item.name}`);

  return styles.some((style) => {
    const normalizedStyle = normalizeText(style.replace(/-/g, " "));
    return normalizedStyle.length > 0 && source.includes(normalizedStyle);
  })
    ? 2
    : 0;
}

function matchesOccasion(item: OutfitItem, occasion: OccasionValue) {
  const source = normalizeText(`${item.style} ${item.name}`);
  const keywordMap: Record<OccasionValue, string[]> = {
    casual: ["casual", "minimal", "denim", "relaxed"],
    formal: ["formal", "tailored", "elegant", "silk", "loafer"],
    gym: ["gym", "sporty", "training", "running", "performance"],
    work: ["work", "tailored", "classic", "office", "structured"],
    date: ["date", "elegant", "soft", "silk", "refined"],
    "night-out": ["night", "night-out", "evening", "black", "statement"],
  };

  return keywordMap[occasion].some((keyword) => source.includes(keyword)) ? 1 : 0;
}

function matchesTimeOfDay(item: OutfitItem, timeOfDay: TimeOfDayValue) {
  const source = normalizeText(`${item.style} ${item.name}`);
  const keywordMap: Record<TimeOfDayValue, string[]> = {
    morning: ["light", "fresh", "clean", "casual", "soft"],
    afternoon: ["work", "classic", "relaxed", "denim", "structured"],
    night: ["night", "evening", "formal", "black", "elegant"],
  };

  return keywordMap[timeOfDay].some((keyword) => source.includes(keyword)) ? 1 : 0;
}

function scoreItem(
  item: OutfitItem,
  params: {
    weatherInput: ReturnType<typeof getWeatherProfile>;
    styles: string[];
    occasion: OccasionValue;
    timeOfDay: TimeOfDayValue;
  }
) {
  return (
    matchesWeather(item, params.weatherInput) +
    matchesStyles(item, params.styles) +
    matchesOccasion(item, params.occasion) +
    matchesTimeOfDay(item, params.timeOfDay)
  );
}

function buildCandidateOutfit(params: {
  tops: OutfitItem[];
  bottoms: OutfitItem[];
  shoes: OutfitItem[];
  outerwear: OutfitItem[];
  previousSignature: string | null;
  requestId: number;
  temperature: number | null;
}) {
  const { tops, bottoms, shoes, outerwear, previousSignature, requestId, temperature } = params;
  const candidateTops = shuffleWithSeed(tops, requestId + 11).slice(0, 6);
  const candidateBottoms = shuffleWithSeed(bottoms, requestId + 19).slice(0, 6);
  const candidateShoes = shuffleWithSeed(shoes, requestId + 29).slice(0, 6);
  const candidateOuterwear = shuffleWithSeed(outerwear, requestId + 37).slice(0, 5);
  const shouldAllowOuterwear = typeof temperature === "number" && temperature < 18;
  const shouldPrioritizeOuterwear = typeof temperature === "number" && temperature < 12;
  const outerwearPool =
    shouldAllowOuterwear && candidateOuterwear.length > 0
      ? shouldPrioritizeOuterwear
        ? candidateOuterwear
        : [null, ...candidateOuterwear]
      : [null];

  let best:
    | {
        top: OutfitItem | null;
        bottom: OutfitItem | null;
        shoes: OutfitItem | null;
        outerwear: OutfitItem | null;
        score: number;
        signature: string;
      }
    | null = null;

  for (const top of candidateTops) {
    for (const bottom of candidateBottoms) {
      for (const shoe of candidateShoes) {
        for (const outer of outerwearPool) {
          const pieces = [top, bottom, shoe, outer].filter(
            (item): item is OutfitItem => Boolean(item)
          );
          const signature = buildOutfitSignature([top, bottom, shoe, outer]);
          const colorScore = getColorHarmonyScore(pieces);
          const randomFactor = Math.round(createSeed(requestId + signature.length + pieces.length) * 3);
          const coldLayerBonus = shouldPrioritizeOuterwear && outer ? 8 : 0;
          const totalScore =
            pieces.reduce((sum, piece) => sum + piece.score, 0) +
            colorScore +
            randomFactor -
            (signature === previousSignature ? 1000 : 0) +
            coldLayerBonus;

          if (!best || totalScore > best.score) {
            best = {
              top,
              bottom,
              shoes: shoe,
              outerwear: outer,
              score: totalScore,
              signature,
            };
          }
        }
      }
    }
  }

  return best;
}

function OutfitPiece({
  item,
  emptyLabel,
}: {
  item: OutfitItem;
  emptyLabel: string;
}) {
  const placement: Record<OutfitCategory, string> = {
    outerwear: "left-[13%] top-[7%] w-[56%] z-0",
    top: "left-[27%] top-[9%] w-[48%] z-10",
    bottom: "left-[25%] top-[38%] w-[50%] z-20",
    shoes: "left-[33%] top-[74%] w-[36%] z-30",
  };
  const rotation = createSeed(item.id.length + item.name.length) * 10 - 5;
  const scale = 0.96 + createSeed(item.id.length * 3 + item.color.length) * 0.08;

  return (
    <div
      className={`absolute ${placement[item.category]} transition-transform duration-300`}
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-auto max-h-[250px] w-full object-contain drop-shadow-[0_24px_26px_rgba(48,71,100,0.24)]"
        />
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-[24px] border border-dashed border-[#D7DDE9] bg-white/58 px-4 text-center shadow-[0_18px_42px_rgba(83,105,137,0.10)]">
          <div>
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#162B4E] shadow-sm">
              <Shirt size={20} />
            </div>
            <p className="text-xs font-semibold text-[#5E7092]">{emptyLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SmartOutfitGenerator() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useUser();
  const {
    garments,
    loaded,
    isLoadingGarments,
    refreshGarments,
  } = useGarments();
  const [occasion, setOccasion] = useState<OccasionValue>("casual");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayValue>("morning");
  const [useWardrobeOnly, setUseWardrobeOnly] = useState(true);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [weatherField, setWeatherField] = useState("");
  const [weatherError, setWeatherError] = useState("");
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationRequest, setGenerationRequest] = useState({
    id: 0,
    excludeSignature: null as string | null,
  });
  const [lastGeneratedSignature, setLastGeneratedSignature] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const isWardrobeLoading = !loaded || isLoadingGarments;
  const isWardrobeReady = loaded && garments.length > 0;

  useEffect(() => {
    if (!loaded && garments.length === 0 && !isLoadingGarments) {
      void refreshGarments();
    }
  }, [garments.length, isLoadingGarments, loaded, refreshGarments]);

  useEffect(() => {
    let isMounted = true;

    const applyWeather = async (coords?: { lat: number; lon: number }) => {
      try {
        const response = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coords ?? {}),
        });
        const data = await response.json();

        if (!response.ok || !isMounted) {
          throw new Error(data.error || t("weatherUnavailable"));
        }

        const nextWeather: WeatherSummary = {
          city: data.city,
          temp: data.temp,
          temperature: data.temperature ?? data.temp,
          condition: data.condition,
        };

        setWeather(nextWeather);
        setWeatherField(
          buildWeatherField(
            nextWeather.temp ?? nextWeather.temperature,
            nextWeather.condition
          )
        );
        setWeatherError("");
      } catch {
        if (!isMounted) {
          return;
        }

        setWeatherError(t("weatherUnavailable"));
        setWeatherField((current) => current || buildWeatherField(20, "clear sky"));
      } finally {
        if (isMounted) {
          setIsLoadingWeather(false);
        }
      }
    };

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      void applyWeather();
      return () => {
        isMounted = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void applyWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        void applyWeather();
      }
    );

    return () => {
      isMounted = false;

      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [t]);

  const wardrobeItems = useMemo(() => garments.map(garmentToOutfitItem), [garments]);

  const generatedOutfit = useMemo<GeneratedOutfit | null>(() => {
    if (generationRequest.id === 0 || !isWardrobeReady) {
      return null;
    }

    const styles = user?.styles ?? [];
    const weatherInput = getWeatherProfile(weatherField, weather);
    const sourceItems = useWardrobeOnly
      ? wardrobeItems
      : [...wardrobeItems, ...fallbackGarments];
    const scored = sourceItems.map((item) => ({
      ...item,
      score: scoreItem(item, {
        weatherInput,
        styles,
        occasion,
        timeOfDay,
      }) + Math.round(createSeed(generationRequest.id + item.id.length) * 2),
    }));
    const best = buildCandidateOutfit({
      tops: scored.filter((item) => item.category === "top"),
      bottoms: scored.filter((item) => item.category === "bottom"),
      shoes: scored.filter((item) => item.category === "shoes"),
      outerwear: scored.filter((item) => item.category === "outerwear"),
      previousSignature: generationRequest.excludeSignature,
      requestId: generationRequest.id,
      temperature: weatherInput.temperature,
    });

    const top = best?.top ?? null;
    const bottom = best?.bottom ?? null;
    const shoes = best?.shoes ?? null;
    const outerwear = best?.outerwear ?? null;

    return {
      top,
      bottom,
      shoes,
      outerwear,
      usedFallback: [top, bottom, shoes, outerwear].some(
        (item) => item?.source === "fallback"
      ),
      hasEnoughCorePieces: Boolean(top && bottom && shoes),
      signature: best?.signature ?? buildOutfitSignature([top, bottom, shoes, outerwear]),
    };
  }, [
    generationRequest,
    occasion,
    timeOfDay,
    useWardrobeOnly,
    user?.styles,
    wardrobeItems,
    weather,
    weatherField,
    isWardrobeReady,
  ]);

  useEffect(() => {
    if (!generatedOutfit?.hasEnoughCorePieces || !generatedOutfit.signature) {
      return;
    }

    setLastGeneratedSignature(generatedOutfit.signature);
  }, [generatedOutfit]);

  const handleGenerate = async () => {
    if (isWardrobeLoading || !isWardrobeReady) {
      return;
    }

    setIsGenerating(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setGenerationRequest((current) => ({
        id: current.id + 1,
        excludeSignature: lastGeneratedSignature,
      }));
      setIsGenerating(false);
    }, 520);
  };

  const resultCards = useMemo(
    () =>
      generatedOutfit && generatedOutfit.hasEnoughCorePieces
        ? [
            { key: "outerwear", item: generatedOutfit.outerwear },
            { key: "top", item: generatedOutfit.top },
            { key: "bottom", item: generatedOutfit.bottom },
            { key: "shoes", item: generatedOutfit.shoes },
          ].filter((entry): entry is { key: string; item: OutfitItem } =>
            Boolean(entry.item)
          )
        : [],
    [generatedOutfit]
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F8F3EA_0%,#F5EFE5_100%)] px-5 py-6 text-[#2F4366] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-3">
          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center rounded-full border border-[#DDD4C7] bg-white/85 px-4 py-2 text-sm font-medium text-[#48617F] shadow-sm transition hover:border-[#9DB4CF] hover:bg-white"
            >
              ← {t("backToHome")}
            </button>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DCE7F3] px-4 py-2 text-sm font-medium text-[#4A6688]">
                <Sparkles size={16} />
                {t("smartOutfitTitle")}
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#304764] sm:text-5xl">
                {t("smartOutfitTitle")}
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#70829D]">
                {t("smartOutfitDescription")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_24px_80px_rgba(83,105,137,0.08)] backdrop-blur sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#304764]">
                {t("smartOutfitOptionsTitle")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#7A8BA5]">
                {t("smartOutfitOptionsHint")}
              </p>
            </div>

            <div className="grid gap-5">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#3F5878]">
                  {t("occasionLabel")}
                </span>
                <select
                  value={occasion}
                  onChange={(event) => setOccasion(event.target.value as OccasionValue)}
                  className="w-full rounded-[20px] border border-[#E7E3D9] bg-[#FBF8F3] px-4 py-3 text-sm text-[#435C7B] outline-none transition focus:border-[#A8BED7]"
                >
                  {occasionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.key as TranslationKey)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#3F5878]">
                  {t("weatherLabel")}
                </span>
                <input
                  value={weatherField}
                  onChange={(event) => setWeatherField(event.target.value)}
                  placeholder={t("weatherAuto")}
                  className="w-full rounded-[20px] border border-[#E7E3D9] bg-[#FBF8F3] px-4 py-3 text-sm text-[#435C7B] outline-none transition placeholder:text-[#A0ACC0] focus:border-[#A8BED7]"
                />
                <div className="flex items-center gap-2 text-xs text-[#8796AF]">
                  {isLoadingWeather ? (
                    <>
                      <LoaderCircle className="animate-spin" size={14} />
                      <span>{t("processing")}</span>
                    </>
                  ) : (
                    <span>{weatherError || t("weatherEditableHint")}</span>
                  )}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-[#3F5878]">
                  {t("timeOfDay")}
                </span>
                <select
                  value={timeOfDay}
                  onChange={(event) => setTimeOfDay(event.target.value as TimeOfDayValue)}
                  className="w-full rounded-[20px] border border-[#E7E3D9] bg-[#FBF8F3] px-4 py-3 text-sm text-[#435C7B] outline-none transition focus:border-[#A8BED7]"
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.key as TranslationKey)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-[24px] border border-[#E9E4D8] bg-[linear-gradient(135deg,#FFFDFC,#F7F2EB)] p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#3F5878]">
                      {t("useOnlyWardrobe")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#7A8BA5]">
                      {t("useWardrobeOnlyHint")}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-pressed={useWardrobeOnly}
                    onClick={() => setUseWardrobeOnly((current) => !current)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-all duration-300 ${
                      useWardrobeOnly
                        ? "border-[#C8D7E8] bg-[#DCE8F4]"
                        : "border-[#DCE3EA] bg-[#EFF3F7]"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow-[0_6px_18px_rgba(80,108,140,0.18)] transition-transform duration-300 ${
                        useWardrobeOnly ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {isWardrobeLoading ? (
                <div className="flex items-center gap-2 rounded-[20px] border border-[#E7EDF5] bg-[#F7FAFD] px-4 py-3 text-sm text-[#7A8BA5]">
                  <LoaderCircle className="animate-spin" size={16} />
                  {t("loadingGarments")}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={isGenerating || isWardrobeLoading || !isWardrobeReady}
                className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-[#7B9AB9] px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(123,154,185,0.28)] transition-all duration-200 hover:scale-[1.01] hover:bg-[#6F90B2] disabled:cursor-not-allowed disabled:bg-[#C9D6E4] disabled:text-white/85 disabled:shadow-none"
              >
                {isGenerating || isWardrobeLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    {isWardrobeLoading ? t("loadingGarments") : t("smartOutfitGenerating")}
                  </>
                ) : (
                  <>
                    <Stars size={18} />
                    {t("generateOutfit")}
                  </>
                )}
              </button>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(180deg,#FCFAF8_0%,#F5EEE4_100%)] p-6 shadow-[0_30px_100px_rgba(83,105,137,0.08)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_70%)]" />
            <div className="relative">
                <div className="mb-8 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-[#304764]">
                  {t("smartOutfitResultTitle")}
                </h2>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void handleGenerate()}
                    disabled={isGenerating || isWardrobeLoading || !isWardrobeReady}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D6E1EC] bg-white/88 px-4 py-2 text-sm font-medium text-[#5B7594] shadow-sm transition hover:border-[#B9CDE0] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isGenerating || isWardrobeLoading ? (
                      <LoaderCircle className="animate-spin" size={15} />
                    ) : (
                      <RefreshCw size={15} />
                    )}
                    {t("regenerateOutfit")}
                  </button>
                </div>
              </div>

              {generationRequest.id === 0 ? (
                <div className="flex min-h-[520px] items-center justify-center rounded-[32px] border border-dashed border-[#D7D2C8] bg-white/55 px-8 text-center">
                  <div className="max-w-md">
                    <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#4A6688] shadow-sm">
                      <Sparkles size={26} />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#304764]">
                      {t("smartOutfitEmptyTitle")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#7A8BA5]">
                      {t("smartOutfitEmptyBody")}
                    </p>
                  </div>
                </div>
              ) : !generatedOutfit?.hasEnoughCorePieces ? (
                <div className="flex min-h-[520px] items-center justify-center rounded-[32px] border border-dashed border-[#D7D2C8] bg-white/55 px-8 text-center">
                  <div className="max-w-md">
                    <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#4A6688] shadow-sm">
                      <Shirt size={26} />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#304764]">
                      {t("smartOutfitInsufficientTitle")}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#7A8BA5]">
                      {t("smartOutfitInsufficientBody")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="relative mx-auto min-h-[640px] w-full max-w-[520px] pb-4">
                    {resultCards.map((card) => (
                      <OutfitPiece
                        key={card.key}
                        item={card.item}
                        emptyLabel={t("smartOutfitNoImage")}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
