"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type DragEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import type { TranslationKey } from "@/app/i18n";

type GarmentCategory = "top" | "bottom" | "shoes" | "outerwear";
type GarmentSeason = "all" | "summer" | "winter";

type Garment = {
  _id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  style?: string;
  material?: string;
  season: GarmentSeason;
  imageUrl: string;
  isFavorite?: boolean;
  favorite?: boolean;
};

type GarmentAnalysis = {
  name: string;
  category: GarmentCategory;
  color: string;
  style: string;
  season: GarmentSeason;
  material: string;
};

type GarmentDraft = {
  name: string;
  category: GarmentCategory;
  color: string;
  style: string;
  material: string;
  season: GarmentSeason;
  imageUrl: string;
  isFavorite: boolean;
};

const defaultDraft = (): GarmentDraft => ({
  name: "",
  category: "top",
  color: "",
  style: "",
  material: "",
  season: "all",
  imageUrl: "",
  isFavorite: false,
});

const garmentToDraft = (garment: Garment): GarmentDraft => ({
  name: garment.name,
  category: garment.category,
  color: garment.color,
  style: garment.style ?? "",
  material: garment.material ?? "",
  season: garment.season,
  imageUrl: garment.imageUrl,
  isFavorite: Boolean(garment.isFavorite ?? garment.favorite),
});

const normalizeGarment = (garment: Garment): Garment => ({
  ...garment,
  isFavorite: Boolean(garment.isFavorite ?? garment.favorite),
  favorite: Boolean(garment.isFavorite ?? garment.favorite),
  style: garment.style ?? "",
  material: garment.material ?? "",
});

export default function Wardrobe() {
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [garments, setGarments] = useState<Garment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [garmentPendingDelete, setGarmentPendingDelete] = useState<Garment | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);
  const [favoriteFeedback, setFavoriteFeedback] = useState("");
  const [addError, setAddError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [addDraft, setAddDraft] = useState<GarmentDraft>(defaultDraft);
  const [editDraft, setEditDraft] = useState<GarmentDraft>(defaultDraft);

  const categoryOptions: Array<{ value: GarmentCategory; label: string }> = [
    { value: "top", label: t("top") },
    { value: "bottom", label: t("bottom") },
    { value: "shoes", label: t("shoes") },
    { value: "outerwear", label: t("outerwear") },
  ];

  const seasonOptions: Array<{ value: GarmentSeason; label: string }> = [
    { value: "all", label: t("allYear") },
    { value: "summer", label: t("summer") },
    { value: "winter", label: t("winter") },
  ];

  const getCategoryLabel = (value: GarmentCategory) =>
    categoryOptions.find((option) => option.value === value)?.label ?? value;

  const getSeasonLabel = (value: GarmentSeason) =>
    seasonOptions.find((option) => option.value === value)?.label ?? value;

  const syncGarmentInState = (updatedGarment: Garment) => {
    const normalized = normalizeGarment(updatedGarment);

    setGarments((current) =>
      current.map((garment) =>
        garment._id === normalized._id ? normalized : garment
      )
    );
    setSelectedGarment((current) =>
      current?._id === normalized._id ? normalized : current
    );
    setGarmentPendingDelete((current) =>
      current?._id === normalized._id ? normalized : current
    );
  };

  const fetchGarments = useCallback(async () => {
    const res = await fetch("/api/wardrobe", { credentials: "include" });
    if (!res.ok) return;

    const data = await res.json();
    setGarments(
      Array.isArray(data)
        ? (data as Garment[]).map(normalizeGarment)
        : []
    );
  }, []);

  useEffect(() => {
    void fetchGarments();
  }, [fetchGarments]);

  useEffect(() => {
    if (!favoriteFeedback) return;

    const timeoutId = window.setTimeout(() => {
      setFavoriteFeedback("");
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [favoriteFeedback]);

  const filteredGarments = showFavoritesOnly
    ? garments.filter((garment) => garment.isFavorite)
    : garments;

  const resetGarmentForm = () => {
    setShowAddModal(false);
    setAddDraft(defaultDraft());
    setAddError("");
    setAnalysisMessage("");
    setIsAnalyzingImage(false);
    setIsDragActive(false);
  };

  const openGarmentDetail = (garment: Garment) => {
    const normalized = normalizeGarment(garment);
    setSelectedGarment(normalized);
    setEditDraft(garmentToDraft(normalized));
    setIsEditMode(false);
    setDetailError("");
  };

  const analyzeGarmentImage = async (nextImageUrl: string) => {
    if (!nextImageUrl) return;

    setIsAnalyzingImage(true);
    setAddError("");
    setAnalysisMessage("");

    try {
      const res = await fetch("/api/garment-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          imageUrl: nextImageUrl,
        }),
      });

      const data = (await res.json()) as Partial<GarmentAnalysis> & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || t("analyzeImageError"));
      }

      setAddDraft((current) => ({
        ...current,
        imageUrl: nextImageUrl,
        name: data.name || "",
        category:
          data.category === "bottom" ||
          data.category === "shoes" ||
          data.category === "outerwear"
            ? data.category
            : "top",
        color: data.color || "",
        style: data.style || "",
        material: data.material || "",
        season:
          data.season === "summer" || data.season === "winter"
            ? data.season
            : "all",
      }));
      setAnalysisMessage(t("aiSuggestionsReady"));
    } catch (analysisError) {
      setAddError(
        analysisError instanceof Error
          ? analysisError.message
          : t("analyzeImageError")
      );
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleSelectedFile = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        setAddError(t("analyzeImageError"));
        return;
      }

      setAddDraft((current) => ({ ...current, imageUrl: result }));
      void analyzeGarmentImage(result);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    handleSelectedFile(file);
  };

  const addGarment = async () => {
    if (!addDraft.name || !addDraft.color || !addDraft.imageUrl) {
      setAddError(t("allFieldsRequired"));
      return;
    }

    setAddError("");

    const res = await fetch("/api/wardrobe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(addDraft),
    });

    if (!res.ok) {
      setAddError(t("saveChangesError"));
      return;
    }

    resetGarmentForm();
    void fetchGarments();
  };

  const saveGarmentChanges = async () => {
    if (!selectedGarment) return;

    if (!editDraft.name || !editDraft.color || !editDraft.imageUrl) {
      setDetailError(t("saveChangesError"));
      return;
    }

    setIsSavingEdit(true);
    setDetailError("");

    try {
      const res = await fetch(`/api/wardrobe/${selectedGarment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editDraft),
      });

      const data = (await res.json()) as Garment & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || t("updateGarmentError"));
      }

      syncGarmentInState(data);
      setEditDraft(garmentToDraft(normalizeGarment(data)));
      setIsEditMode(false);
    } catch (saveError) {
      setDetailError(
        saveError instanceof Error ? saveError.message : t("updateGarmentError")
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const toggleFavorite = async (garment: Garment) => {
    const nextFavorite = !Boolean(garment.isFavorite);
    const previousGarment = normalizeGarment(garment);
    const optimisticGarment = {
      ...previousGarment,
      isFavorite: nextFavorite,
      favorite: nextFavorite,
    };

    syncGarmentInState(optimisticGarment);
    setTogglingFavoriteId(garment._id);
    setFavoriteFeedback(nextFavorite ? t("favoriteAdded") : t("favoriteRemoved"));

    if (selectedGarment?._id === garment._id && isEditMode) {
      setEditDraft((current) => ({ ...current, isFavorite: nextFavorite }));
    }

    try {
      const res = await fetch(`/api/wardrobe/${garment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isFavorite: nextFavorite }),
      });

      const data = (await res.json()) as Garment & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || t("updateGarmentError"));
      }

      syncGarmentInState(data);
    } catch {
      syncGarmentInState(previousGarment);
      setFavoriteFeedback("");
      setDetailError(t("updateGarmentError"));
    } finally {
      setTogglingFavoriteId(null);
    }
  };

  const deleteGarment = async () => {
    if (!garmentPendingDelete) return;

    setIsDeleting(true);
    setDetailError("");

    try {
      const res = await fetch(`/api/wardrobe/${garmentPendingDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(t("deleteGarmentError"));
      }

      setGarments((current) =>
        current.filter((garment) => garment._id !== garmentPendingDelete._id)
      );
      setSelectedGarment((current) =>
        current?._id === garmentPendingDelete._id ? null : current
      );
      setGarmentPendingDelete(null);
      setIsEditMode(false);
    } catch (deleteError) {
      setDetailError(
        deleteError instanceof Error ? deleteError.message : t("deleteGarmentError")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const detailGarment = selectedGarment ? normalizeGarment(selectedGarment) : null;

  return (
    <main className="min-h-screen bg-[#F5EFE3] px-5 py-6 text-[#162B4E] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center rounded-full border border-[#d9d2c4] bg-white/80 px-4 py-2 text-sm font-medium text-[#162B4E] shadow-sm transition hover:border-[#162B4E] hover:bg-white"
            >
              ← {t("back")}
            </button>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#162B4E]">
                {t("myWardrobe")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4B5F82]">
                {showFavoritesOnly ? t("noFavoriteGarments") : t("wardrobeEmptyHint")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <IconButton
              active={showFavoritesOnly}
              label={t("favoritesOnly")}
              onClick={() => setShowFavoritesOnly((current) => !current)}
            >
              <Heart
                className={showFavoritesOnly ? "fill-current" : ""}
                size={18}
              />
            </IconButton>

            <IconButton
              label={t("addGarment")}
              onClick={() => setShowAddModal(true)}
              filled
            >
              <Plus size={18} />
            </IconButton>
          </div>
        </div>

        {favoriteFeedback && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 shadow-sm transition-all duration-200">
            <Heart className="fill-current" size={15} />
            {favoriteFeedback}
          </div>
        )}

        {filteredGarments.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-[32px] border border-dashed border-[#d6cfbf] bg-[#FCFAF6] px-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
            <div className="max-w-md">
              <p className="text-xl font-semibold text-[#162B4E]">
                {showFavoritesOnly ? t("noFavoriteGarments") : t("noGarmentsYet")}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#4B5F82]">
                {t("wardrobeEmptyHint")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredGarments.map((garment) => {
              const normalizedGarment = normalizeGarment(garment);

              return (
                <article
                  key={normalizedGarment._id}
                  onClick={() => openGarmentDetail(normalizedGarment)}
                  className="group flex h-full min-h-[360px] cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/70 bg-[#FCFAF6] shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_top,#fffaf0,transparent_70%)]">
                    <img
                      src={normalizedGarment.imageUrl}
                      alt={normalizedGarment.name}
                      className="h-full w-full object-contain p-5"
                    />

                    <button
                      type="button"
                      aria-label={t("favorite")}
                      title={t("favorite")}
                      onClick={(event) => {
                        event.stopPropagation();
                        void toggleFavorite(normalizedGarment);
                      }}
                      className={`absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/92 shadow-sm backdrop-blur transition-all duration-200 ${
                        normalizedGarment.isFavorite
                          ? "scale-105 border-rose-200 text-red-500 shadow-lg"
                          : "border-[#E3DDD2] text-[#6E7F9F] hover:scale-105 hover:text-red-500"
                      }`}
                    >
                      {togglingFavoriteId === normalizedGarment._id ? (
                        <LoaderCircle className="animate-spin" size={18} />
                      ) : (
                        <Heart
                          className={normalizedGarment.isFavorite ? "fill-current text-red-500" : ""}
                          size={18}
                        />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                    <div className="space-y-2">
                      <h2 className="line-clamp-2 text-lg font-semibold text-[#162B4E]">
                        {normalizedGarment.name}
                      </h2>
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#6E7F9F]">
                        {getCategoryLabel(normalizedGarment.category)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#EEF3FB] px-3 py-1.5 text-sm font-medium text-[#27406F]">
                        {normalizedGarment.color}
                      </span>
                      <span className="text-sm font-medium text-[#6E7F9F]">
                        {t("details")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-[min(960px,100%)] overflow-y-auto rounded-[32px] bg-[#FCFAF6] p-6 shadow-2xl sm:p-8">
            <button
              onClick={resetGarmentForm}
              className="absolute right-5 top-5 rounded-full bg-white p-2 text-[#162B4E] shadow-md transition hover:scale-105"
            >
              <X />
            </button>

            <div className="mb-8 space-y-2 pr-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#162B4E]/8 px-4 py-2 text-sm font-medium text-[#162B4E]">
                <Sparkles size={16} />
                {t("aiWardrobeAssistant")}
              </div>
              <h2 className="text-3xl font-semibold text-[#162B4E]">
                {t("addGarment")}
              </h2>
              <p className="max-w-2xl text-[15px] leading-7 text-[#4B5F82]">
                {t("addGarmentHelp")}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.95fr]">
              <section className="space-y-5 rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgba(22,43,78,0.08)] sm:p-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[#162B4E]">
                    {t("uploadGarmentImage")}
                  </h3>
                  <p className="text-sm leading-6 text-[#5B6B87]">
                    {t("uploadGarmentHintSecondary")}
                  </p>
                </div>

                <label
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragActive(true);
                  }}
                  onDragLeave={() => setIsDragActive(false)}
                  onDrop={handleDrop}
                  className={`group flex min-h-[320px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed transition ${
                    isDragActive
                      ? "border-[#4d77c3] bg-[#eef4ff]"
                      : "border-[#d4deef] bg-[#f8fbff]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {addDraft.imageUrl ? (
                    <div className="flex h-full w-full flex-col">
                      <div className="flex items-center justify-between border-b border-[#e6ecf7] px-5 py-4">
                        <div className="flex items-center gap-3 text-[#162B4E]">
                          <ImagePlus size={18} />
                          <span className="text-sm font-medium">
                            {t("uploadGarmentImage")}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            fileInputRef.current?.click();
                          }}
                          className="rounded-full bg-[#162B4E] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          {t("analyzeAgain")}
                        </button>
                      </div>

                      <div className="flex flex-1 items-center justify-center bg-[#f8fbff] p-5">
                        <img
                          src={addDraft.imageUrl}
                          alt={addDraft.name || t("addGarment")}
                          className="max-h-[240px] w-full rounded-[20px] object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex max-w-sm flex-col items-center px-8 py-10 text-center">
                      <div className="mb-5 rounded-full bg-white p-5 text-[#4d77c3] shadow-[0_12px_30px_rgba(77,119,195,0.16)]">
                        <Upload size={34} />
                      </div>
                      <p className="text-lg font-semibold text-[#162B4E]">
                        {t("uploadGarmentImage")}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[#61708d]">
                        {t("uploadGarmentHint")}
                      </p>
                    </div>
                  )}
                </label>

                {isAnalyzingImage && (
                  <div className="flex items-center gap-3 rounded-2xl bg-[#162B4E] px-4 py-3 text-sm font-medium text-white">
                    <LoaderCircle className="animate-spin" size={18} />
                    {t("analyzingImage")}
                  </div>
                )}

                {analysisMessage && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {analysisMessage}
                  </div>
                )}

                {addError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {addError}
                  </div>
                )}
              </section>

              <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgba(22,43,78,0.08)] sm:p-6">
                <div className="mb-6 space-y-2">
                  <h3 className="text-xl font-semibold text-[#162B4E]">
                    {t("garmentDetails")}
                  </h3>
                  <p className="text-sm leading-6 text-[#5b6b87]">
                    {t("garmentDetailsHint")}
                  </p>
                </div>

                <GarmentFormFields
                  draft={addDraft}
                  onChange={setAddDraft}
                  categoryOptions={categoryOptions}
                  seasonOptions={seasonOptions}
                  t={t}
                  analyzeAction={
                    <button
                      type="button"
                      onClick={() => void analyzeGarmentImage(addDraft.imageUrl)}
                      disabled={!addDraft.imageUrl || isAnalyzingImage}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e8eef9] px-4 py-3 text-sm font-semibold text-[#162B4E] transition hover:bg-[#dfe8f7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Sparkles size={16} />
                      {t("analyzeAgain")}
                    </button>
                  }
                />

                <button
                  onClick={addGarment}
                  disabled={isAnalyzingImage}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#162B4E] px-5 py-3.5 text-base font-semibold text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isAnalyzingImage && <LoaderCircle className="animate-spin" size={18} />}
                  {t("saveGarment")}
                </button>
              </section>
            </div>
          </div>
        </div>
      )}

      {detailGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-[min(1100px,100%)] overflow-y-auto rounded-[32px] bg-[#FCFAF6] p-5 shadow-2xl sm:p-7">
            <button
              onClick={() => {
                setSelectedGarment(null);
                setIsEditMode(false);
                setDetailError("");
              }}
              className="absolute right-5 top-5 rounded-full bg-white p-2 text-[#162B4E] shadow-md transition hover:scale-105"
            >
              <X />
            </button>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
              <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgba(22,43,78,0.08)] sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#6e7f9f]">
                      {isEditMode ? t("edit") : t("details")}
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-[#162B4E]">
                      {detailGarment.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <IconButton
                      small
                      active={detailGarment.isFavorite}
                      loading={togglingFavoriteId === detailGarment._id}
                      label={t("favorite")}
                      onClick={() => void toggleFavorite(detailGarment)}
                    >
                      <Heart
                        className={detailGarment.isFavorite ? "fill-current text-red-500" : ""}
                        size={17}
                      />
                    </IconButton>
                    <IconButton
                      small
                      active={isEditMode}
                      label={t("edit")}
                      onClick={() => {
                        setEditDraft(garmentToDraft(detailGarment));
                        setIsEditMode((current) => !current);
                        setDetailError("");
                      }}
                    >
                      <Pencil size={17} />
                    </IconButton>
                    <IconButton
                      small
                      destructive
                      label={t("delete")}
                      onClick={() => setGarmentPendingDelete(detailGarment)}
                    >
                      <Trash2 size={17} />
                    </IconButton>
                  </div>
                </div>

                <div className="aspect-square overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top,#fffaf0,transparent_70%)]">
                  <img
                    src={detailGarment.imageUrl}
                    alt={detailGarment.name}
                    className="h-full w-full object-contain p-6"
                  />
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgba(22,43,78,0.08)] sm:p-6">
                {isEditMode ? (
                  <>
                    <div className="mb-6 space-y-2">
                      <h3 className="text-xl font-semibold text-[#162B4E]">
                        {t("edit")}
                      </h3>
                      <p className="text-sm leading-6 text-[#5b6b87]">
                        {t("garmentDetailsHint")}
                      </p>
                    </div>

                    <GarmentFormFields
                      draft={editDraft}
                      onChange={setEditDraft}
                      categoryOptions={categoryOptions}
                      seasonOptions={seasonOptions}
                      t={t}
                    />

                    {detailError && (
                      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {detailError}
                      </div>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => {
                          setEditDraft(garmentToDraft(detailGarment));
                          setIsEditMode(false);
                          setDetailError("");
                        }}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#d6dfef] px-5 py-3.5 text-sm font-semibold text-[#162B4E] transition hover:bg-[#f5f8ff]"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        onClick={saveGarmentChanges}
                        disabled={isSavingEdit}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#162B4E] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSavingEdit && (
                          <LoaderCircle className="animate-spin" size={16} />
                        )}
                        {t("saveChanges")}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-3">
                      <DetailRow label={t("categoryLabel")} value={getCategoryLabel(detailGarment.category)} />
                      <DetailRow label={t("color")} value={detailGarment.color} />
                      <DetailRow label={t("seasonLabel")} value={getSeasonLabel(detailGarment.season)} />
                      <DetailRow
                        label={t("style")}
                        value={detailGarment.style || "—"}
                      />
                      <DetailRow
                        label={t("material")}
                        value={detailGarment.material || "—"}
                      />
                    </div>

                    {detailError && (
                      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {detailError}
                      </div>
                    )}

                    <div className="mt-8 rounded-[24px] border border-[#e6ecf7] bg-[#f8fbff] p-5">
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#6e7f9f]">
                        {t("favorite")}
                      </p>
                      <p className="mt-2 text-base font-medium text-[#162B4E]">
                        {detailGarment.isFavorite ? t("favoriteAdded") : t("notFavoriteYet")}
                      </p>
                    </div>
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {garmentPendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-[#FCFAF6] p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#162B4E]">
                  {t("deleteGarmentTitle")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5F82]">
                  {t("deleteGarmentDescription")}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#e6ecf7] bg-white px-4 py-3">
              <p className="font-semibold text-[#162B4E]">
                {garmentPendingDelete.name}
              </p>
              <p className="mt-1 text-sm text-[#6E7F9F]">
                {getCategoryLabel(garmentPendingDelete.category)}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setGarmentPendingDelete(null)}
                disabled={isDeleting}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#d6dfef] px-5 py-3 text-sm font-semibold text-[#162B4E] transition hover:bg-[#f5f8ff] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {t("cancel")}
              </button>
              <button
                onClick={deleteGarment}
                disabled={isDeleting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isDeleting && <LoaderCircle className="animate-spin" size={16} />}
                {t("deleteGarmentAction")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function IconButton({
  children,
  label,
  onClick,
  active = false,
  filled = false,
  destructive = false,
  small = false,
  loading = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  filled?: boolean;
  destructive?: boolean;
  small?: boolean;
  loading?: boolean;
}) {
  const sizeClasses = small ? "h-11 w-11" : "h-12 w-12";

  let colorClasses =
    "border-white/70 bg-white text-[#162B4E] hover:border-[#162B4E] hover:text-[#162B4E]";

  if (filled) {
    colorClasses =
      "border-[#162B4E] bg-[#162B4E] text-white hover:opacity-90";
  } else if (destructive) {
    colorClasses =
      "border-red-200 bg-red-50 text-red-600 hover:bg-red-100";
  } else if (active) {
    colorClasses =
      "border-rose-200 bg-rose-50 text-red-500 hover:bg-rose-100";
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border shadow-sm transition-all duration-200 ${sizeClasses} ${colorClasses}`}
    >
      {loading ? <LoaderCircle className="animate-spin" size={small ? 17 : 18} /> : children}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#e6ecf7] bg-[#f8fbff] px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6e7f9f]">
        {label}
      </p>
      <p className="mt-2 text-base font-medium text-[#162B4E]">
        {value}
      </p>
    </div>
  );
}

function GarmentFormFields({
  draft,
  onChange,
  categoryOptions,
  seasonOptions,
  t,
  analyzeAction,
}: {
  draft: GarmentDraft;
  onChange: Dispatch<SetStateAction<GarmentDraft>>;
  categoryOptions: Array<{ value: GarmentCategory; label: string }>;
  seasonOptions: Array<{ value: GarmentSeason; label: string }>;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  analyzeAction?: ReactNode;
}) {
  const updateField = <Key extends keyof GarmentDraft>(
    key: Key,
    value: GarmentDraft[Key]
  ) => {
    onChange((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-[#162B4E]">
          {t("name")}
        </label>
        <input
          placeholder={t("namePlaceholder")}
          value={draft.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="w-full rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] placeholder:text-[#8b99b3] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold text-[#162B4E]">
          {t("categoryLabel")}
        </label>
        <select
          value={draft.category}
          onChange={(event) =>
            updateField("category", event.target.value as GarmentCategory)
          }
          className="w-full rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[#162B4E]">
            {t("color")}
          </label>
          <input
            placeholder={t("colorPlaceholder")}
            value={draft.color}
            onChange={(event) => updateField("color", event.target.value)}
            className="w-full rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] placeholder:text-[#8b99b3] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-[#162B4E]">
            {t("seasonLabel")}
          </label>
          <select
            value={draft.season}
            onChange={(event) =>
              updateField("season", event.target.value as GarmentSeason)
            }
            className="w-full rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
          >
            {seasonOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#162B4E]">
            {t("style")}
            <span className="text-xs font-medium text-[#8391ab]">
              {t("optionalField")}
            </span>
          </label>
          <input
            placeholder={t("stylePlaceholder")}
            value={draft.style}
            onChange={(event) => updateField("style", event.target.value)}
            className="w-full rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] placeholder:text-[#8b99b3] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
          />
        </div>

        <div className="grid gap-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#162B4E]">
            {t("material")}
            <span className="text-xs font-medium text-[#8391ab]">
              {t("optionalField")}
            </span>
          </label>
          <input
            placeholder={t("materialPlaceholder")}
            value={draft.material}
            onChange={(event) => updateField("material", event.target.value)}
            className="w-full rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] placeholder:text-[#8b99b3] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#162B4E]">
          {t("imageUrl")}
          <span className="text-xs font-medium text-[#8391ab]">
            {t("optionalField")}
          </span>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder={t("imageUrl")}
            value={draft.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            className="min-w-0 flex-1 rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] placeholder:text-[#8b99b3] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
          />
          {analyzeAction}
        </div>
        <p className="text-sm leading-6 text-[#5b6b87]">
          {t("imageUrlHint")}
        </p>
      </div>
    </div>
  );
}
