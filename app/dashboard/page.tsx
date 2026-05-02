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
import { useUser } from "@/app/providers/UserProvider";
import { languageLabels, type Language } from "@/app/i18n";
import StylePreferencesModal from "@/app/components/StylePreferencesModal";

type StyleModalMode = "closed" | "edit";

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

const weatherConditionTranslations = {
  "broken clouds": {
    es: "nubes fragmentadas",
    en: "broken clouds",
  },
  "scattered clouds": {
    es: "nubes dispersas",
    en: "scattered clouds",
  },
  "clear sky": {
    es: "despejado",
    en: "clear sky",
  },
  rain: {
    es: "lluvia",
    en: "rain",
  },
} satisfies Record<string, Record<Language, string>>;

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

function translateWeatherCondition(condition: string, language: Language) {
  const normalizedCondition = condition.toLowerCase();
  const translationKey =
    normalizedCondition as keyof typeof weatherConditionTranslations;
  return (
    weatherConditionTranslations[translationKey]?.[language] ?? condition
  );
}

function formatStyleLabel(style: string) {
  return style
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getWeatherCardTheme(condition: string) {
  const normalized = condition.toLowerCase();

  if (normalized.includes("rain")) {
    return {
      gradient:
        "bg-gradient-to-br from-[#5d7fa8]/90 via-[#446487]/82 to-[#243a5a]/78",
      glow:
        "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(166,208,255,0.22),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]",
    };
  }

  if (normalized.includes("cloud")) {
    return {
      gradient:
        "bg-gradient-to-br from-[#81a6d6]/88 via-[#6689bc]/78 to-[#466798]/74",
      glow:
        "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.30),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(215,231,255,0.20),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]",
    };
  }

  return {
    gradient:
      "bg-gradient-to-br from-[#77a8ff]/90 via-[#5f8dff]/78 to-[#3f6ce7]/72",
    glow:
      "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.38),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.20),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]",
  };
}

export default function Dashboard() {
  const { language, setLanguage, t } = useLanguage();
  const { user, hasHydratedUser, saveUserStyles } = useUser();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [styleModalMode, setStyleModalMode] = useState<StyleModalMode>("closed");
  const [accountError, setAccountError] = useState("");
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
  useEffect(() => {
    if (!hasHydratedUser) {
      return;
    }

    console.log("User styles:", user?.styles ?? []);
  }, [hasHydratedUser, user]);

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
      ? hourly.slice(0, 8)
      : weather
      ? buildFallbackHourlyForecast(
          weather.temperature,
          weather.condition,
          language
        ).slice(0, 8)
      : [];
  const localizedCondition = weather
    ? translateWeatherCondition(weather.condition, language)
    : "";
  const weatherCardTheme = getWeatherCardTheme(weather?.condition ?? "");

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

  const saveStyles = async (styles: string[]) => {
    setAccountError("");

    try {
      const updatedUser = await saveUserStyles({
        source: "account",
        styles,
      });

      console.log("User after save:", updatedUser);

      setStyleModalMode("closed");
    } catch {
      setAccountError(t("styleSaveError"));
      throw new Error(t("styleSaveError"));
    }
  };

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
    <>
    <StylePreferencesModal
      isOpen={styleModalMode !== "closed"}
      gender={user?.gender}
      initialStyles={user?.styles ?? []}
      onClose={() => setStyleModalMode("closed")}
      onSave={saveStyles}
      mandatory={false}
      title={styleModalMode === "edit" ? t("styleEditTitle") : undefined}
      description={styleModalMode === "edit" ? t("styleEditDescription") : undefined}
    />
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

        <div className="relative z-20">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={ButtonStyle}
          >
            {t("account")}
          </button>

          {showMenu && (
            <div className="absolute right-0 z-30 mt-3 min-w-[280px] overflow-hidden rounded-2xl bg-white p-4 shadow-xl">
              <div className="relative z-10 space-y-4">
              <div className="rounded-2xl bg-[#162B4E] p-4 text-white shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Cuenta
                </p>
                <p className="mt-2 truncate text-sm font-medium text-white">
                  {user?.email ?? ""}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#162B4E]/60">
                    {t("myStyles")}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStyleModalMode("edit");
                      setShowMenu(false);
                    }}
                    className="text-sm font-medium text-[#162B4E] hover:opacity-70"
                  >
                    {t("editStyles")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!hasHydratedUser ? null : user?.styles && user.styles.length > 0 ? (
                    user.styles.map((style) => (
                      <span
                        key={style}
                        className="rounded-full bg-[#F5EFE3] px-3 py-1.5 text-xs font-medium text-[#162B4E]"
                      >
                        {formatStyleLabel(style)}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[#4B5F82]">{t("noStylesYet")}</p>
                  )}
                </div>
                {accountError && (
                  <p className="text-sm font-medium text-red-600">{accountError}</p>
                )}
              </div>
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
            className={`relative min-h-[460px] overflow-hidden rounded-[28px] border border-white/20 p-6 text-white shadow-[0_22px_60px_rgba(42,75,160,0.28)] backdrop-blur-2xl sm:p-8 ${weatherCardTheme.gradient}`}
          >
            <div className={`absolute inset-0 ${weatherCardTheme.glow}`} />
            <div className="absolute inset-x-0 top-0 h-px bg-white/35" />

            <div className="relative flex h-full flex-col gap-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-base font-medium text-white/88 sm:text-lg">
                    {weather.city}
                  </p>
                  <p className="text-sm font-medium capitalize tracking-[0.04em] text-white/68">
                    {localizedCurrentDay}
                  </p>
                </div>

                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md sm:text-sm">
                  {localizedCondition}
                </div>
              </div>

              <div className="grid flex-1 place-items-center py-2 sm:py-4">
                <div className="flex w-full max-w-[340px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex items-center justify-center text-white/95 drop-shadow-[0_10px_24px_rgba(255,255,255,0.16)] sm:mb-5">
                    {getIcon(weather.condition, 40)}
                  </div>

                  <p className="text-[86px] font-semibold leading-none tracking-[-0.02em] text-white sm:text-[116px]">
                    {Math.round(weather.temperature)}°
                  </p>

                  <p className="mt-2 text-lg font-medium capitalize text-white/86 sm:text-2xl">
                    {localizedCondition}
                  </p>

                  {typeof weather.feels_like === "number" && (
                    <p className="mt-3 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-white/76 backdrop-blur-md sm:text-base">
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
                <div className="rounded-[24px] border border-white/15 bg-white/12 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl sm:px-5">
                  <div className="mb-4 flex items-center justify-between border-b border-white/12 pb-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/58">
                      {t("hourlyForecast")}
                    </span>
                    <span className="text-xs text-white/52">
                      {t("upcomingHours")}
                    </span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-1 sm:gap-4">
                    {displayHourly.map((h, i) => (
                      <div
                        key={i}
                        className="flex min-w-[72px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-3"
                      >
                        <span className="text-xs font-medium text-white/68 sm:text-sm">
                          {h.time}
                        </span>
                        <span className="text-white/92">
                          {getIcon(h.condition, 20)}
                        </span>
                        <span className="text-sm font-medium text-white/92">
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
    </>
  );
}
