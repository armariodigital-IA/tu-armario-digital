"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateAIOutfit() {
  const router = useRouter();

  const [occasion, setOccasion] = useState("casual");
  const [mood, setMood] = useState("relajado");
  const [weather, setWeather] = useState<any>(null);
  const [outfit, setOutfit] = useState<any>(null);
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

    const res = await fetch("/api/generate-ai-outfit", {
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
      setError(data.error || "Error generando outfit");
      return;
    }

    setOutfit(data.outfit);
  };

  return (
    <main className="min-h-screen bg-[#F5EFE3] px-10 py-12">

      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-[#162B4E] text-white rounded-lg"
      >
        ← Volver
      </button>

      <h1 className="text-4xl font-semibold text-[#162B4E] mb-10">
        Generar Outfit con IA
      </h1>

      <div className="bg-white p-10 rounded-3xl shadow-xl space-y-6 max-w-xl mb-12">

        <div>
          <label className="block font-medium mb-2">Ocasión</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="deportivo">Deportivo</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            ¿Cómo te sentís hoy?
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="relajado">Relajado</option>
            <option value="seguro">Seguro</option>
            <option value="creativo">Creativo</option>
          </select>
        </div>

        <button
          onClick={generate}
          className="w-full bg-[#162B4E] text-white py-2 rounded-lg"
        >
          {loading ? "Generando..." : "Generar Outfit"}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>

      {outfit && (
        <div className="grid md:grid-cols-4 gap-6">
          {Object.values(outfit)
            .filter(Boolean)
            .map((g: any) => (
              <div key={g._id} className="bg-white p-4 rounded-2xl shadow-lg">
                <img
                  src={g.imageUrl}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <p className="font-semibold">{g.name}</p>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}