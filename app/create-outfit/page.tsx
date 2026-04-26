"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";

export default function CreateOutfitHome() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#F5EFE3] px-10 py-12">

      <h1 className="text-5xl font-semibold text-center text-[#162B4E] mb-16">
        {t("howCreateOutfit")}
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

        {/* MANUAL */}
        <div
          onClick={() => (window.location.href = "/create-outfit/manual")}
          className="bg-white rounded-3xl p-12 shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <h2 className="text-3xl font-semibold text-[#162B4E] mb-6">
            {t("createManual")}
          </h2>

          <p className="text-gray-600 text-lg">
            {t("createManualDescription")}
          </p>
        </div>

        {/* IA */}
        <div
          onClick={() => (window.location.href = "/create-outfit-ai")}
          className="bg-gradient-to-b from-[#162B4E] to-[#0f1d35] text-white rounded-3xl p-12 shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <h2 className="text-3xl font-semibold mb-6">
            {t("generateWithAI")}
          </h2>

          <p className="text-lg opacity-90">
            {t("generateWithAIDescription")}
          </p>
        </div>

      </div>
    </main>
  );
}
