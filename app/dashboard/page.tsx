"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  Wind,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [hourly, setHourly] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [outfit, setOutfit] = useState("");

  const [displayText, setDisplayText] = useState("");
  const [fullText, setFullText] = useState("");
  const [isFading, setIsFading] = useState(false);

  /* ================= USER ================= */
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
  .then(res => res.json())
  .then(data => setUser(data));
  }, []);

  /* ================= WEATHER ================= */
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

      const formattedHours =
        data.hourly?.slice(0, 8).map((h: any) => ({
          time: h.time,
          temp: h.temp,
          condition: h.condition,
        })) || [];

      setHourly(formattedHours);

      const outfitRes = await fetch("/api/outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      });

      const outfitData = await outfitRes.json();
      setOutfit(outfitData.outfit);
    });
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  };

  /* ================= ICONOS ================= */
  const getIcon = (condition: string) => {
    const c = condition?.toLowerCase() || "";
    if (c.includes("rain")) return <CloudRain size={32} />;
    if (c.includes("snow")) return <CloudSnow size={32} />;
    if (c.includes("cloud")) return <Cloud size={32} />;
    if (c.includes("fog")) return <CloudFog size={32} />;
    if (c.includes("wind")) return <Wind size={32} />;
    return <Sun size={32} />;
  };

  const getBackground = () =>
    "bg-gradient-to-b from-[#162B4E] to-[#0f1d35]";

  const ButtonStyle =
    "px-6 py-2 rounded-xl bg-[#162B4E] text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-300";

  /* ================= FRASES DINÁMICAS PRO ================= */

  const generateRandomQuestion = (firstName: string) => {
    const questions = [
      `¿Qué outfit vas a romper hoy, ${firstName}?`,
      `¿Listo para conquistar el día, ${firstName}?`,
      `¿Qué estilo define tu energía hoy, ${firstName}?`,
      `¿Hoy vamos clásico o arriesgado, ${firstName}?`,
      `¿Qué versión tuya mostramos hoy, ${firstName}?`,
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  };

  // Generar primera frase
  useEffect(() => {
    const firstName = user?.name?.split(" ")[0] || "Amigo";
    setFullText(generateRandomQuestion(firstName));
  }, [user]);

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
    const firstName = user?.name?.split(" ")[0] || "Amigo";

    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setFullText(generateRandomQuestion(firstName));
      }, 400);
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

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
  Crea tu outfit
</button>
          <button
  onClick={() => (window.location.href = "/wardrobe")}
  className={ButtonStyle}
>
  Mi armario
</button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={ButtonStyle}
          >
            Cuenta
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 bg-white shadow-xl rounded-2xl p-4">
              <button
                onClick={logout}
                className="text-red-500 font-medium hover:opacity-70"
              >
                Cerrar sesión
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
            className={`flex flex-col justify-between
            ${getBackground()}
            text-white p-10 rounded-[3rem]
            shadow-2xl backdrop-blur-xl`}
          >
            <div>
              <div className="text-center mb-8">
                <p className="text-2xl font-medium opacity-90">
                  {weather.city}
                </p>

                <p className="text-[90px] font-extralight leading-none">
                  {Math.round(weather.temp)}°
                </p>

                <p className="text-lg opacity-80 capitalize">
                  {weather.condition}
                </p>
              </div>

              {hourly.length > 0 && (
                <div className="mt-6 border-t border-white/30 pt-6 flex gap-6 overflow-x-auto">
                  {hourly.map((h, i) => (
                    <div key={i} className="flex flex-col items-center min-w-[60px]">
                      <span className="text-sm opacity-80">
                        {h.time}
                      </span>
                      {getIcon(h.condition)}
                      <span className="text-lg font-medium">
                        {Math.round(h.temp)}°
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col justify-between bg-white p-10 rounded-[3rem] shadow-2xl">
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-[#162B4E]">
              Outfit del día
            </h2>

            <p className="text-lg text-[#374151] leading-relaxed tracking-wide">
              {outfit || "Generando recomendación..."}
            </p>
          </div>
        </div>

      </div>

    </main>
  );
}