"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, LoaderCircle, Sparkles, Shirt } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useUser } from "@/app/providers/UserProvider";
import { useGarments } from "@/app/providers/GarmentsProvider";
import { normalizeGarmentCategory } from "@/lib/garment-utils";

type WardrobeRequirement = {
  tops: number;
  bottoms: number;
  shoes: number;
};

type WeatherSummary = {
  city?: string;
  temp?: number;
  temperature?: number;
  condition?: string;
};

type OutfitItem = {
  _id: string;
  name: string;
  imageUrl: string;
  color: string;
  source: "wardrobe" | "internet";
  category: "top" | "bottom" | "shoes" | "layer";
};

type GeneratedOutfit = {
  top: OutfitItem | null;
  bottom: OutfitItem | null;
  shoes: OutfitItem | null;
  layer: OutfitItem | null;
};

const occasionOptions = [
  { value: "casual", key: "occasionCasual" },
  { value: "work", key: "occasionWork" },
  { value: "date", key: "occasionDate" },
  { value: "gym", key: "occasionGym" },
  { value: "formal", key: "occasionFormal" },
  { value: "night-out", key: "occasionNightOut" },
  { value: "school", key: "occasionSchool" },
] as const;

const timeOptions = [
  { value: "morning", key: "timeMorning" },
  { value: "afternoon", key: "timeAfternoon" },
  { value: "evening", key: "timeEvening" },
  { value: "night", key: "timeNight" },
] as const;

export default function GenerateAIOutfit() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, hasHydratedUser } = useUser();
  const { garments, loaded, isLoadingGarments, refreshGarments } = useGarments();
  const [occasion, setOccasion] = useState("casual");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [freeText, setFreeText] = useState("");
  const [useWardrobeOnly, setUseWardrobeOnly] = useState(true);
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [weatherError, setWeatherError] = useState("");
  const [outfit, setOutfit] = useState<GeneratedOutfit | null>(null);
  const [explanation, setExplanation] = useState("");
  const [appliedStyles, setAppliedStyles] = useState<string[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loaded && garments.length === 0 && !isLoadingGarments) {
      void refreshGarments();
    }
  }, [garments.length, isLoadingGarments, loaded, refreshGarments]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setWeatherError(t("weatherUnavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const res = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }),
        });

        const data = await res.json();
        setWeather({
          city: data.weather?.city,
          temp: data.weather?.temperature,
          temperature: data.weather?.temperature,
          condition: data.weather?.condition,
        });
      },
      () => {
        setWeatherError(t("weatherUnavailable"));
      }
    );
  }, [t]);

  const styleLabels = useMemo(() => {
    const source = user?.styles ?? [];
    return source.map((style) => style.replace(/-/g, " "));
  }, [user?.styles]);

  const wardrobeRequirement = useMemo<WardrobeRequirement>(() => {
    const normalizedGarments = garments.map((garment) => ({
      ...garment,
      category: normalizeGarmentCategory(garment.category),
    }));

    return {
      tops: normalizedGarments.filter((garment) => garment.category === "top").length,
      bottoms: normalizedGarments.filter((garment) => garment.category === "bottom").length,
      shoes: normalizedGarments.filter((garment) => garment.category === "shoes").length,
    };
  }, [garments]);

  const hasLoadedWardrobe = loaded || garments.length > 0;

  const meetsWardrobeMinimum =
    wardrobeRequirement.tops >= 5 &&
    wardrobeRequirement.bottoms >= 4 &&
    wardrobeRequirement.shoes >= 2;

  const generate = async () => {
    if (!user?.styles || user.styles.length === 0) {
      setError(t("saveFirstStyles"));
      return;
    }

    if (!hasLoadedWardrobe) {
      setError(t("loadWardrobeError"));
      await refreshGarments(true);
      return;
    }

    if (!meetsWardrobeMinimum) {
      setError(t("wardrobeMinimumError"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          occasion,
          timeOfDay,
          freeText,
          useWardrobeOnly,
          gender: user.gender,
          styles: user.styles,
          weather: weather
            ? {
                temp: weather.temp ?? weather.temperature,
                condition: weather.condition,
              }
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("errorGeneratingOutfit"));
      }

      setOutfit(data.outfit);
      setExplanation(data.explanation || "");
      setAppliedStyles(Array.isArray(data.appliedStyles) ? data.appliedStyles : []);
      setPalette(Array.isArray(data.palette) ? data.palette : []);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : t("errorGeneratingOutfit")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#F5EFE3] px-5 py-6 text-[#162B4E] sm:px-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center rounded-full border border-[#d9d2c4] bg-white/80 px-4 py-2 text-sm font-medium text-[#162B4E] shadow-sm transition hover:border-[#162B4E] hover:bg-white"
              >
                ← {t("backToHome")}
              </button>

              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-[#162B4E] sm:text-5xl">
                  {t("generateOutfitAI")}
                </h1>
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#4B5F82]">
                  {t("stylistQuestionnaireHint")}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7F9F]">
                {t("yourStyleDirection")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {!hasHydratedUser ? null : styleLabels.length > 0 ? (
                  styleLabels.map((style) => (
                    <span
                      key={style}
                      className="rounded-full bg-[#EEF3FB] px-3 py-1.5 text-sm font-medium text-[#27406F]"
                    >
                      {style}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#4B5F82]">{t("noStylesYet")}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[32px] bg-white p-6 shadow-[0_24px_80px_rgba(22,43,78,0.08)] sm:p-8">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#162B4E]/8 px-4 py-2 text-sm font-medium text-[#162B4E]">
                  <Sparkles size={16} />
                  {t("stylistQuestionnaire")}
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-[#162B4E]">
                  {t("generateStyledOutfit")}
                </h2>
              </div>

              <div className="grid gap-6">
                <div className="rounded-[26px] border border-[#E7DDCB] bg-[linear-gradient(135deg,#FFFDF8,#F8F1E4)] p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-white p-3 text-[#162B4E] shadow-sm">
                      <Shirt size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#162B4E]">
                        {t("wardrobeBannerTitle")}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#4B5F82]">
                        {t("wardrobeBannerBody")}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-[26px] border p-5 ${
                    meetsWardrobeMinimum
                      ? "border-emerald-200 bg-emerald-50/80"
                      : "border-amber-200 bg-amber-50/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {meetsWardrobeMinimum ? (
                      <CheckCircle2 className="mt-0.5 text-emerald-600" size={20} />
                    ) : (
                      <AlertCircle className="mt-0.5 text-amber-600" size={20} />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#162B4E]">
                        {meetsWardrobeMinimum
                          ? t("wardrobeMinimumMet")
                          : t("wardrobeMinimumTitle")}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#4B5F82]">
                        {t("wardrobeMinimumHint", {
                          tops: wardrobeRequirement.tops,
                          bottoms: wardrobeRequirement.bottoms,
                          shoes: wardrobeRequirement.shoes,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <label className="text-sm font-semibold text-[#162B4E]">
                    {t("occasionLabel")}
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {occasionOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setOccasion(option.value)}
                        className={`rounded-[22px] border px-4 py-4 text-left transition ${
                          occasion === option.value
                            ? "border-[#162B4E] bg-[#162B4E] text-white"
                            : "border-[#D7DFEF] bg-[#FBFCFF] text-[#162B4E] hover:border-[#162B4E]/40"
                        }`}
                      >
                        {t(option.key)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <label className="text-sm font-semibold text-[#162B4E]">
                    {t("timeOfDay")}
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {timeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTimeOfDay(option.value)}
                        className={`rounded-[22px] border px-4 py-4 text-left transition ${
                          timeOfDay === option.value
                            ? "border-[#162B4E] bg-[#162B4E] text-white"
                            : "border-[#D7DFEF] bg-[#FBFCFF] text-[#162B4E] hover:border-[#162B4E]/40"
                        }`}
                      >
                        {t(option.key)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <label className="text-sm font-semibold text-[#162B4E]">
                    {t("describeLookToday")}
                  </label>
                  <textarea
                    value={freeText}
                    onChange={(event) => setFreeText(event.target.value)}
                    placeholder={t("describeLookToday")}
                    className="min-h-[140px] rounded-[24px] border border-[#D7DFEF] bg-[#FBFCFF] px-4 py-4 text-[15px] text-[#162B4E] placeholder:text-[#8B99B3] focus:border-[#4D77C3] focus:outline-none focus:ring-4 focus:ring-[#DBE7FF]"
                  />
                </div>

                <div className="grid gap-3">
                  <label className="text-sm font-semibold text-[#162B4E]">
                    {t("clothingSource")}
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setUseWardrobeOnly(true)}
                      className={`rounded-[22px] border px-4 py-4 text-left transition ${
                        useWardrobeOnly
                          ? "border-[#162B4E] bg-[#162B4E] text-white"
                          : "border-[#D7DFEF] bg-[#FBFCFF] text-[#162B4E] hover:border-[#162B4E]/40"
                      }`}
                    >
                      {t("useOnlyWardrobe")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseWardrobeOnly(false)}
                      className={`rounded-[22px] border px-4 py-4 text-left transition ${
                        !useWardrobeOnly
                          ? "border-[#162B4E] bg-[#162B4E] text-white"
                          : "border-[#D7DFEF] bg-[#FBFCFF] text-[#162B4E] hover:border-[#162B4E]/40"
                      }`}
                    >
                      {t("includeInternetClothing")}
                    </button>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#E6ECF7] bg-[#F8FBFF] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7F9F]">
                    {t("weatherAuto")}
                  </p>
                  <p className="mt-2 text-base font-medium text-[#162B4E]">
                    {weather
                      ? `${weather.city ?? "Weather"} · ${Math.round(
                          weather.temp ?? weather.temperature ?? 0
                        )}° · ${weather.condition ?? ""}`
                      : weatherError || t("weatherUnavailable")}
                  </p>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void generate()}
                  disabled={
                    loading ||
                    isLoadingGarments ||
                    !hasLoadedWardrobe ||
                    !meetsWardrobeMinimum
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#162B4E] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {(loading || isLoadingGarments) && (
                    <LoaderCircle className="animate-spin" size={18} />
                  )}
                  {t("generateStyledOutfit")}
                </button>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-[32px] bg-white p-6 shadow-[0_24px_80px_rgba(22,43,78,0.08)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7F9F]">
                  {t("generatedPalette")}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {palette.length > 0 ? (
                    palette.map((color) => (
                      <span
                        key={color}
                        className="rounded-full bg-[#EEF3FB] px-4 py-2 text-sm font-medium text-[#27406F]"
                      >
                        {color}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#4B5F82]">{t("noOutfitAvailable")}</span>
                  )}
                </div>

                {appliedStyles.length > 0 && (
                  <>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7F9F]">
                      {t("yourStyleDirection")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {appliedStyles.map((style) => (
                        <span
                          key={style}
                          className="rounded-full bg-[#F7F3EB] px-3 py-1.5 text-sm font-medium text-[#31496D]"
                        >
                          {style.replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-[32px] bg-white p-6 shadow-[0_24px_80px_rgba(22,43,78,0.08)] sm:p-8">
                <h2 className="text-2xl font-semibold text-[#162B4E]">
                  {t("generatedOutfit")}
                </h2>

                {explanation && (
                  <p className="mt-4 text-[15px] leading-7 text-[#4B5F82]">
                    {explanation}
                  </p>
                )}

                <div className="mt-6 grid gap-4">
                  {[
                    { key: "top", label: t("top"), item: outfit?.top ?? null },
                    { key: "bottom", label: t("bottom"), item: outfit?.bottom ?? null },
                    { key: "shoes", label: t("shoes"), item: outfit?.shoes ?? null },
                    { key: "layer", label: t("optionalLayer"), item: outfit?.layer ?? null },
                  ].map(({ key, label, item }) => (
                    <div
                      key={key}
                      className="rounded-[24px] border border-[#E6ECF7] bg-[#FCFAF6] p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7F9F]">
                        {label}
                      </p>
                      {item ? (
                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[20px] bg-white">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="px-3 text-center text-xs font-medium text-[#6E7F9F]">
                                {item.source === "internet"
                                  ? t("sourceInternet")
                                  : t("sourceWardrobe")}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#162B4E]">{item.name}</p>
                            <p className="mt-1 text-sm text-[#4B5F82]">{item.color}</p>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6E7F9F]">
                              {item.source === "internet"
                                ? t("sourceInternet")
                                : t("sourceWardrobe")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-[#4B5F82]">{t("noOutfitAvailable")}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
