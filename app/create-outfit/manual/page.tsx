"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers/LanguageProvider";

type GarmentCategory = "top" | "bottom" | "shoes" | "outerwear";

type Garment = {
  _id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  imageUrl: string;
};

export default function ManualOutfitPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [garments, setGarments] = useState<Garment[]>([]);
  const [selected, setSelected] = useState<Partial<Record<GarmentCategory, Garment>>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGarments = async () => {
      const res = await fetch("/api/wardrobe", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("loadWardrobeError"));
        return;
      }

      setGarments(data);
    };

    void loadGarments();
  }, [t]);

  const groupedGarments = garments.reduce<Record<GarmentCategory, Garment[]>>(
    (acc, garment) => {
      acc[garment.category].push(garment);
      return acc;
    },
    { top: [], bottom: [], shoes: [], outerwear: [] }
  );

  const categoryLabels: Record<GarmentCategory, string> = {
    top: t("top"),
    bottom: t("bottom"),
    shoes: t("shoes"),
    outerwear: t("outerwear"),
  };

  return (
    <main className="min-h-screen bg-[#F5EFE3] px-8 py-10">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-8 px-4 py-2 bg-[#162B4E] text-white rounded-lg"
      >
        ← {t("back")}
      </button>

      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-semibold text-[#162B4E] mb-3">
            {t("createOutfitManually")}
          </h1>
          <p className="text-[#374151]">
            {t("manualOutfitDescription")}
          </p>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-8">
          {(Object.keys(categoryLabels) as GarmentCategory[]).map((category) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#162B4E]">
                  {categoryLabels[category]}
                </h2>
                {selected[category] && (
                  <p className="text-sm text-[#374151]">
                    {t("selectedItem", { name: selected[category]?.name ?? "" })}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {groupedGarments[category].map((garment) => {
                  const isSelected = selected[category]?._id === garment._id;

                  return (
                    <button
                      key={garment._id}
                      type="button"
                      onClick={() =>
                        setSelected((current) => ({
                          ...current,
                          [category]: garment,
                        }))
                      }
                      className={`bg-white p-4 rounded-2xl shadow-lg text-left transition border-2 ${
                        isSelected ? "border-[#162B4E]" : "border-transparent"
                      }`}
                    >
                      <img
                        src={garment.imageUrl}
                        alt={garment.name}
                        className="w-full aspect-square object-cover rounded-xl mb-3"
                      />
                      <p className="font-semibold text-[#162B4E]">{garment.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{garment.color}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
