"use client";

import { Bot, ChevronRight, Layers3, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function CreateOutfitHome() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#F5EFE3] px-5 py-8 text-[#162B4E] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[36px] bg-[linear-gradient(135deg,#FFFCF6,#F4EBDD)] p-7 shadow-[0_28px_80px_rgba(22,43,78,0.10)] sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#162B4E] shadow-sm">
              <Sparkles size={16} />
              {t("howCreateOutfit")}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#162B4E] sm:text-5xl">
              {t("howCreateOutfit")}
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-[#4B5F82]">
              {t("createOutfitChooserHint")}
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <button
              type="button"
              onClick={() => router.push("/create-outfit/manual")}
              className="group relative overflow-hidden rounded-[32px] border border-white/80 bg-white p-7 text-left shadow-[0_24px_80px_rgba(22,43,78,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_100px_rgba(22,43,78,0.12)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,43,78,0.07),transparent_34%)] opacity-80" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-[22px] bg-[#F5EFE3] p-4 text-[#162B4E]">
                    <Layers3 size={26} />
                  </div>
                  <ChevronRight className="transition group-hover:translate-x-1" size={22} />
                </div>

                <h2 className="mt-10 text-3xl font-semibold text-[#162B4E]">
                  {t("createManual")}
                </h2>
                <p className="mt-4 text-base leading-7 text-[#4B5F82]">
                  {t("createManualDescription")}
                </p>

                <div className="mt-8 flex items-center gap-3 text-sm font-medium text-[#6E7F9F]">
                  <span className="rounded-full bg-[#F8F3EA] px-3 py-1.5">
                    {t("manualOutfitTag1")}
                  </span>
                  <span className="rounded-full bg-[#F8F3EA] px-3 py-1.5">
                    {t("manualOutfitTag2")}
                  </span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => router.push("/create-outfit-ai")}
              className="group relative overflow-hidden rounded-[32px] border border-[#162B4E]/10 bg-[#162B4E] p-7 text-left text-white shadow-[0_28px_90px_rgba(22,43,78,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_38px_120px_rgba(22,43,78,0.24)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.12),transparent_18%)]" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-[22px] bg-white/10 p-4 text-white backdrop-blur-sm">
                    <Bot size={26} />
                  </div>
                  <ChevronRight className="transition group-hover:translate-x-1" size={22} />
                </div>

                <h2 className="mt-10 text-3xl font-semibold">
                  {t("generateWithAI")}
                </h2>
                <p className="mt-4 text-base leading-7 text-white/82">
                  {t("generateWithAIDescription")}
                </p>

                <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white/78">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    {t("aiOutfitTag1")}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    {t("aiOutfitTag2")}
                  </span>
                </div>

                <div className="mt-10 flex items-center gap-2 text-sm font-semibold text-white">
                  <Wand2 size={16} />
                  {t("aiOutfitPremiumHint")}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
