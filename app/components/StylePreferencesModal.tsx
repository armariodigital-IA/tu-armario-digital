"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { getStyleOptions, normalizeGender } from "@/lib/style-system";
import { useLanguage } from "@/app/providers/LanguageProvider";

type StylePreferencesModalProps = {
  isOpen: boolean;
  gender?: string | null;
  initialStyles: string[];
  onClose: () => void;
  onSave: (styles: string[]) => Promise<void> | void;
  mandatory?: boolean;
  title?: string;
  description?: string;
};

export default function StylePreferencesModal({
  isOpen,
  gender,
  initialStyles,
  onClose,
  onSave,
  mandatory = false,
  title,
  description,
}: StylePreferencesModalProps) {
  const { language, t } = useLanguage();
  const [selected, setSelected] = useState<string[]>(initialStyles);
  const [saving, setSaving] = useState(false);
  const resolvedGender = normalizeGender(gender);

  useEffect(() => {
    if (!isOpen) return;
    setSelected(initialStyles);
  }, [initialStyles, isOpen]);

  const options = useMemo(() => getStyleOptions(resolvedGender), [resolvedGender]);

  if (!isOpen) return null;

  const toggleStyle = (styleId: string) => {
    setSelected((current) =>
      current.includes(styleId)
        ? current.filter((value) => value !== styleId)
        : [...current, styleId]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) return;
    setSaving(true);

    try {
      await onSave(selected);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#F5EFE3]">
      <div className="min-h-screen px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#162B4E] shadow-sm">
                <Sparkles size={16} />
                {t("styleOnboardingEyebrow")}
              </div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#162B4E] sm:text-5xl">
                {title ?? t("styleOnboardingTitle")}
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#4B5F82]">
                {description ?? t("styleOnboardingDescription")}
              </p>
            </div>

            {!mandatory && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white p-3 text-[#162B4E] shadow-sm transition hover:scale-105"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#162B4E] px-4 py-2 text-sm font-medium text-white">
              {resolvedGender === "female" ? t("genderFemale") : t("genderMale")}
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#162B4E] shadow-sm">
              {t("stylesSelectedCount", { count: selected.length })}
            </span>
            <span className="text-sm text-[#4B5F82]">
              {t("stylesMultiSelectHint")}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {options.map((option) => {
              const active = selected.includes(option.id);

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleStyle(option.id)}
                  className={`group overflow-hidden rounded-[30px] border text-left shadow-[0_22px_70px_rgba(22,43,78,0.10)] transition-all duration-200 ${
                    active
                      ? "border-[#162B4E] bg-white ring-4 ring-[#162B4E]/10"
                      : "border-white/80 bg-white/90 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(22,43,78,0.14)]"
                  }`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F3EA]">
                    <img
                      src={option.imageUrl}
                      alt={option.label[language]}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/94 text-[#162B4E] shadow-sm">
                      {active ? <Check className="text-[#162B4E]" size={18} /> : <span className="h-3 w-3 rounded-full bg-[#D8D1C4]" />}
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#162B4E]">
                        {option.label[language]}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#4B5F82]">
                        {option.note[language]}
                      </p>
                    </div>
                    <p className="rounded-2xl bg-[#F7F3EB] px-4 py-3 text-sm font-medium text-[#31496D]">
                      {option.example[language]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="sticky bottom-0 mt-8 pb-2 pt-8">
            <div className="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-[#FCFAF6]/95 p-5 shadow-[0_26px_80px_rgba(22,43,78,0.10)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-[#162B4E]">
                  {t("styleOnboardingFooterTitle")}
                </p>
                <p className="mt-1 text-sm text-[#4B5F82]">
                  {t("styleOnboardingFooterDescription")}
                </p>
              </div>

              <div className="flex gap-3">
                {!mandatory && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl border border-[#D9D2C4] px-5 py-3 text-sm font-semibold text-[#162B4E] transition hover:bg-white"
                  >
                    {t("cancel")}
                  </button>
                )}
                <button
                  type="button"
                  disabled={selected.length === 0 || saving}
                  onClick={() => void handleSave()}
                  className="rounded-2xl bg-[#162B4E] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? t("savingStyles") : t("confirmStyles")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
