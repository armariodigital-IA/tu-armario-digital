"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  Wind,
} from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { languageLabels, type Language } from "@/app/i18n";

type User = {
  id: string;
  name: string;
  email: string;
};

type HourlyForecast = {
  time: string;
  temp: number;
  condition: string;
};

type WeatherData = {
  city: string;
  temperature: number;
  feels_like?: number;
  condition: string;
  hourly?: HourlyForecast[];
};

function buildFallbackHourlyForecast(
  temperature: number,
  condition: string,
  language: Language
): HourlyForecast[] {
  const now = new Date();
  const offsets = [0, 1, 2, 3, 4];

  return offsets.map((offset, index) => {
    const date = new Date(now);
    date.setHours(now.getHours() + offset);

    return {
      time: new Intl.DateTimeFormat(language === "es" ? "es-UY" : "en-US", {
        hour: "numeric",
      }).format(date),
      temp: Math.round(temperature + (index % 2 === 0 ? 0 : 1) - (index > 2 ? 1 : 0)),
      condition,
    };
  });
}

export default function Dashboard() {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [outfit, setOutfit] = useState("");
  const [isLoadingOutfit, setIsLoadingOutfit] = useState(true);

  const [displayText, setDisplayText] = useState("");
  const [fullText, setFullText] = useState("");
  const [isFading, setIsFading] = useState(false);
  const friendLabel = useMemo(() => t("friend"), [t]);
  const recommendationLoadError = useMemo(
    () => t("recommendationLoadError"),
    [t]
  );

  /* ================= USER ================= */
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
  .then(res => res.json())
  .then(data => setUser(data));
  }, []);

  /* ================= OUTFIT Y CLIMA ================= */
  useEffect(() => {
    let isMounted = true;

    const loadOutfit = async () => {
      try {
        const res = await fetch("/api/outfit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!isMounted) return;

        if (!res.ok) {
          throw new Error(data.error || recommendationLoadError);
        }

        setWeather(data.weather ?? null);
        setHourly(data.weather?.hourly ?? []);
        setOutfit(data.outfit ?? "");
      } catch {
        if (!isMounted) return;

        setWeather(null);
        setHourly([]);
        setOutfit(recommendationLoadError);
      } finally {
        if (isMounted) {
          setIsLoadingOutfit(false);
        }
      }
    };

    loadOutfit();

    return () => {
      isMounted = false;
    };
  }, [recommendationLoadError]);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  };

  /* ================= ICONOS ================= */
  const getIcon = (condition: string, size = 32) => {
    const c = condition?.toLowerCase() || "";
    if (c.includes("rain")) return <CloudRain size={size} />;
    if (c.includes("snow")) return <CloudSnow size={size} />;
    if (c.includes("cloud")) return <Cloud size={size} />;
    if (c.includes("fog")) return <CloudFog size={size} />;
    if (c.includes("wind")) return <Wind size={size} />;
    return <Sun size={size} />;
  };

  const localizedCurrentDay = new Intl.DateTimeFormat(
    language === "es" ? "es-UY" : "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  ).format(new Date());

  const highTemp = weather ? Math.round(weather.temperature + 2) : null;
  const lowTemp = weather ? Math.round(weather.temperature - 3) : null;
  const displayHourly =
    hourly.length > 0
      ? hourly
      : weather
      ? buildFallbackHourlyForecast(weather.temperature, weather.condition, language)
      : [];

  const firstName = user?.name?.split(" ")[0] || friendLabel;
  const dashboardQuestions = useMemo(
    () => [
      t("dashboardQuestion1", { name: firstName }),
      t("dashboardQuestion2", { name: firstName }),
      t("dashboardQuestion3", { name: firstName }),
      t("dashboardQuestion4", { name: firstName }),
      t("dashboardQuestion5", { name: firstName }),
    ],
    [firstName, t]
  );

  const ButtonStyle =
    "px-6 py-2 rounded-xl bg-[#162B4E] text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-300";

  /* ================= FRASES DINÁMICAS PRO ================= */

  // Generar primera frase
  useEffect(() => {
    setFullText(
      dashboardQuestions[Math.floor(Math.random() * dashboardQuestions.length)]
    );
  }, [dashboardQuestions]);

  // Typewriter con fade suave
  useEffect(() => {
    if (!fullText) return;

    let i = 0;
    setDisplayText("");
    setIsFading(false);

    const typing = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(typing);
    }, 35);

    return () => clearInterval(typing);
  }, [fullText]);

  // Cambio automático con micro fade
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setFullText(
          dashboardQuestions[
            Math.floor(Math.random() * dashboardQuestions.length)
          ]
        );
      }, 400);
    }, 10000);

    return () => clearInterval(interval);
  }, [dashboardQuestions]);

  return (
    <main className="relative min-h-screen bg-[#F5EFE3] px-10 py-8 overflow-hidden">

      {/* FONDO */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-[140%] h-[400px] bg-[#e8d8ad] blur-3xl rounded-[50%]" />
        <div className="absolute top-0 right-0 w-[120%] h-[350px] bg-[#f5e3b5] blur-3xl rounded-[50%] opacity-60" />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-16">
        <div className="flex gap-4">
          <button
  onClick={() => (window.location.href = "/create-outfit")}
  className={ButtonStyle}
>
  {t("createYourOutfit")}
</button>
          <button
  onClick={() => (window.location.href = "/wardrobe")}
  className={ButtonStyle}
>
  {t("myWardrobe")}
</button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={ButtonStyle}
          >
            {t("account")}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 min-w-[200px] bg-white shadow-xl rounded-2xl p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#162B4E]/60">
                  {t("language")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(languageLabels) as Language[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setLanguage(option)}
                      className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                        language === option
                          ? "bg-[#162B4E] text-white"
                          : "bg-[#F5EFE3] text-[#162B4E]"
                      }`}
                    >
                      {t(option === "es" ? "spanish" : "english")}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={logout}
                className="text-red-500 font-medium hover:opacity-70"
              >
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TITULO PRO */}
      <h1
        className={`text-5xl md:text-6xl font-semibold text-center text-[#162B4E] mb-20 tracking-tight leading-tight transition-opacity duration-500 ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        {displayText}
        <span className="ml-1 animate-pulse opacity-70">|</span>
      </h1>

      {/* CONTENIDO */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-stretch">

        {weather && (
          <div
            className="relative min-h-[430px] overflow-hidden rounded-[24px] border border-white/20 bg-gradient-to-br from-[#77a8ff]/90 via-[#5f8dff]/78 to-[#3f6ce7]/72 p-8 text-white shadow-[0_22px_60px_rgba(42,75,160,0.28)] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.38),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.20),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/35" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-lg font-medium text-white/92">
                    {weather.city}
                  </p>
                  <p className="text-sm font-medium capitalize tracking-[0.04em] text-white/70">
                    {localizedCurrentDay}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  <span className="text-white/85">
                    {getIcon(weather.condition, 18)}
                  </span>
                  <span className="text-sm font-medium text-white/80">
                    {weather.condition}
                  </span>
                </div>
              </div>

              <div className="grid flex-1 place-items-center py-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-5 flex items-center justify-center text-white/95 drop-shadow-[0_10px_24px_rgba(255,255,255,0.16)]">
                    {getIcon(weather.condition, 44)}
                  </div>

                  <p className="text-[116px] font-thin leading-[0.88] tracking-[0.01em] text-white">
                    {Math.round(weather.temperature)}°
                  </p>

                  {typeof weather.feels_like === "number" && (
                    <p className="mt-2 text-base font-medium text-white/76">
                      {t("feelsLike", {
                        temp: Math.round(weather.temperature),
                        feelsLike: Math.round(weather.feels_like),
                      })}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-center gap-3 text-sm font-medium text-white/72">
                    <span>H:{highTemp}°</span>
                    <span className="h-1 w-1 rounded-full bg-white/45" />
                    <span>L:{lowTemp}°</span>
                  </div>
                </div>
              </div>

              {displayHourly.length > 0 && (
                <div className="rounded-[22px] border border-white/15 bg-white/12 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
                  <div className="mb-4 flex items-center justify-between border-b border-white/12 pb-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">
                      {t("hourlyForecast")}
                    </span>
                    <span className="text-xs text-white/52">
                      {t("upcomingHours")}
                    </span>
                  </div>

                  <div className="flex gap-4 overflow-x-auto">
                    {displayHourly.map((h, i) => (
                      <div
                        key={i}
                        className="flex min-w-[68px] shrink-0 flex-col items-center gap-2 border-r border-white/10 pr-4 last:border-r-0 last:pr-0"
                      >
                        <span className="text-sm text-white/68">
                          {h.time}
                        </span>
                        <span className="text-white/90">
                          {getIcon(h.condition, 22)}
                        </span>
                        <span className="text-base font-medium text-white/92">
                          {Math.round(h.temp)}°
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col justify-between bg-white p-10 rounded-[3rem] shadow-2xl">
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-[#162B4E]">
              {t("outfitOfDay")}
            </h2>

            <p className="text-lg text-[#374151] leading-relaxed tracking-wide">
              {isLoadingOutfit ? t("createRecommendationLoading") : outfit}
            </p>
          </div>
        </div>

      </div>

    </main>
  );
}
