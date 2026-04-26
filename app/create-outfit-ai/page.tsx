"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers/LanguageProvider";

type WeatherSummary = {
  city: string;
  temp: number;
};

type Garment = {
  _id: string;
  name: string;
  imageUrl: string;
};

type StructuredOutfit = {
  top: Garment | null;
  bottom: Garment | null;
  shoes: Garment | null;
  outerwear: Garment | null;
};

export default function GenerateAIOutfit() {
  const router = useRouter();
  const { t } = useLanguage();

  const [occasion, setOccasion] = useState("casual");
  const [mood, setMood] = useState("relajado");
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [outfit, setOutfit] = useState<StructuredOutfit | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      });

      const data = await res.json();
      setWeather(data);
    });
  }, []);

  const generate = async () => {
    setError("");
    setLoading(true);

    const res = await fetch("/api/generate-outfit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        occasion,
        mood,
        weather,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || t("errorGeneratingOutfit"));
      return;
    }

    setOutfit(data.outfit);
    setExplanation(data.explanation || "");
  };

  return (
    <main className="min-h-screen bg-[#F5EFE3] px-10 py-12">

      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-[#162B4E] text-white rounded-lg"
      >
        ← {t("back")}
      </button>

      <h1 className="text-4xl font-semibold text-[#162B4E] mb-10">
        {t("generateOutfitAI")}
      </h1>

      <div className="bg-white p-10 rounded-3xl shadow-xl space-y-6 max-w-xl mb-12">

        <div>
          <label className="block font-medium mb-2">{t("occasion")}</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="casual">{t("casual")}</option>
            <option value="formal">{t("formal")}</option>
            <option value="deportivo">{t("sporty")}</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            {t("howFeelToday")}
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="relajado">{t("relaxed")}</option>
            <option value="seguro">{t("confident")}</option>
            <option value="creativo">{t("creative")}</option>
          </select>
        </div>

        <button
          onClick={generate}
          className="w-full bg-[#162B4E] text-white py-2 rounded-lg"
        >
          {loading ? t("generating") : t("generateOutfit")}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>

      {outfit && (
        <div className="space-y-6">
          {explanation && (
            <p className="text-[#162B4E] text-lg">{explanation}</p>
          )}

          <div className="grid md:grid-cols-4 gap-6">
            {Object.values(outfit)
              .filter((garment): garment is Garment => garment !== null)
              .map((g) => (
              <div key={g._id} className="bg-white p-4 rounded-2xl shadow-lg">
                <img
                  src={g.imageUrl}
                  alt={g.name}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <p className="font-semibold">{g.name}</p>
              </div>
              ))}
          </div>
        </div>
      )}
    </main>
  );
}
