"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
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

type Step = "intro" | "styles";

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
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialStyles);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [step, setStep] = useState<Step>(mandatory ? "intro" : "styles");
  const wasOpenRef = useRef(false);
  const resolvedGender = normalizeGender(gender);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setSelectedStyles(initialStyles);
      setSaveError("");
      setStep(mandatory ? "intro" : "styles");
    }

    wasOpenRef.current = isOpen;
  }, [initialStyles, isOpen, mandatory]);

  const options = useMemo(() => getStyleOptions(resolvedGender), [resolvedGender]);

  const introSlides = useMemo(
    () => [
      {
        title: t("onboardingWelcomeTitle"),
        body: t("onboardingWelcomeBody"),
      },
      {
        title: t("onboardingAiTitle"),
        body: t("onboardingAiBody"),
      },
      {
        title: t("onboardingStyleTitle"),
        body: t("onboardingStyleBody"),
      },
    ],
    [t]
  );

  if (!isOpen) return null;

  const toggleStyle = (styleId: string) => {
    setSaveError("");
    setSelectedStyles((current) =>
      current.includes(styleId)
        ? current.filter((value) => value !== styleId)
        : [...current, styleId]
    );
  };

  const handleConfirmStyles = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("CLICK DETECTED");
    console.log("Selected styles:", selectedStyles);

    if (!selectedStyles || selectedStyles.length === 0) {
      console.warn("No styles selected");
      setSaveError(t("stylesMultiSelectHint"));
      return;
    }

    console.log("Saving styles:", selectedStyles);
    setSaving(true);
    setSaveError("");

    try {
      await onSave(selectedStyles);
    } catch (error) {
      console.error("Error saving styles:", error);
      setSaveError(t("styleSaveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998]" />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm sm:p-6">
        <div
          onClick={(event) => event.stopPropagation()}
          className="relative flex max-h-[90vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-[36px] border border-white/70 bg-[#FCFAF6] shadow-[0_40px_120px_rgba(22,43,78,0.18)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#EEE5D7] px-5 py-5 sm:px-8 sm:py-6">
            <div className="relative max-w-3xl overflow-hidden">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#162B4E] shadow-sm">
                <Sparkles size={16} />
                {t("styleOnboardingEyebrow")}
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#162B4E] sm:text-4xl">
                {step === "intro"
                  ? t("styleOnboardingTitle")
                  : title ?? t("selectYourStylesTitle")}
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#4B5F82]">
                {step === "intro"
                  ? t("styleOnboardingDescription")
                  : description ?? t("selectYourStylesBody")}
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

          {step === "intro" ? (
            <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-4 md:grid-cols-3">
                {introSlides.map((slide, index) => (
                  <section
                    key={slide.title}
                    className="rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_18px_60px_rgba(22,43,78,0.08)]"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#162B4E]/8 text-lg font-semibold text-[#162B4E]">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-semibold text-[#162B4E]">
                      {slide.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[#4B5F82]">
                      {slide.body}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setStep("styles")}
                  className="rounded-2xl bg-[#162B4E] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  {t("continue")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#162B4E] px-4 py-2 text-sm font-medium text-white">
                    {resolvedGender === "female" ? t("genderFemale") : t("genderMale")}
                  </span>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#162B4E] shadow-sm">
                    {t("stylesSelectedCount", { count: selectedStyles.length })}
                  </span>
                  <span className="text-sm text-[#4B5F82]">
                    {t("stylesMultiSelectHint")}
                  </span>
                </div>

                {saveError && (
                  <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {saveError}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {options.map((option) => {
                    const active = selectedStyles.includes(option.id);

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
                            alt={option.label}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute right-4 top-4 z-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/94 text-[#162B4E] shadow-sm">
                            {active ? (
                              <Check className="text-[#162B4E]" size={18} />
                            ) : (
                              <span className="h-3 w-3 rounded-full bg-[#D8D1C4]" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 p-4 sm:p-5">
                          <h3 className="text-xl font-semibold text-[#162B4E] sm:text-2xl">
                            {option.label}
                          </h3>
                          <p className="text-sm leading-6 text-[#4B5F82]">
                            {option.note[language]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#EEE5D7] px-5 py-4 sm:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                      disabled={selectedStyles.length === 0 || saving}
                      onClick={handleConfirmStyles}
                      className="rounded-2xl bg-[#162B4E] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? t("savingStyles") : t("confirmStyles")}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
