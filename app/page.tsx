"use client";

import { useState } from "react";
import AuthModal from "@/app/components/AuthModal";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function Home() {
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f5f1eb]">

      {/* Ondas suaves */}
      <div className="absolute top-0 left-0 w-full h-64 opacity-30 pointer-events-none">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#e8e2d8"
            d="M0,192L80,170.7C160,149,320,107,480,122.7C640,139,800,213,960,218.7C1120,224,1280,160,1360,128L1440,96V0H0Z"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 w-full h-64 opacity-20 pointer-events-none">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#dcd3c5"
            d="M0,96L80,106.7C160,117,320,139,480,144C640,149,800,139,960,117.3C1120,96,1280,64,1360,48L1440,32V320H0Z"
          />
        </svg>
      </div>

      {/* Centro */}
      <div className="relative z-10 text-center space-y-10">
        <h1 className="text-7xl font-semibold tracking-tight text-[#1f2937]">
          Armario Digital
        </h1>

        <p className="text-[#162B4E] text-lg">
          {t("homeTagline")}
        </p>

        {/* Botones debajo del título */}
        <div className="flex gap-6 justify-center pt-4">
          <button
            onClick={() => setModalType("login")}
            className="px-8 py-3 rounded-xl bg-[#1f2937] text-white font-medium
                       shadow-lg hover:shadow-2xl
                       hover:scale-105 active:scale-95
                       transition-all duration-300"
          >
            {t("login")}
          </button>

          <button
            onClick={() => setModalType("register")}
            className="px-8 py-3 rounded-xl border-2 border-[#1f2937]
                       text-[#1f2937] font-medium
                       hover:bg-[#1f2937] hover:text-white
                       hover:scale-105 active:scale-95
                       transition-all duration-300"
          >
            {t("createAccount")}
          </button>
        </div>
      </div>

      {modalType && (
        <AuthModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSuccess={() => (window.location.href = "/dashboard")}
        />
      )}
    </main>
  );
}
