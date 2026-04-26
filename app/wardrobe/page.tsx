"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Heart, ImagePlus, LoaderCircle, Plus, Sparkles, Upload, X } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";

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
};

type GarmentAnalysis = {
  name: string;
  category: GarmentCategory;
  color: string;
  style: string;
  season: GarmentSeason;
  material: string;
};

export default function Wardrobe() {
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [garments, setGarments] = useState<Garment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [error, setError] = useState("");
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<GarmentCategory>("top");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [material, setMaterial] = useState("");
  const [season, setSeason] = useState<GarmentSeason>("all");
  const [imageUrl, setImageUrl] = useState("");

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

  const fetchGarments = async () => {
    const res = await fetch("/api/wardrobe", { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    setGarments(Array.isArray(data) ? (data as Garment[]) : []);
  };

  useEffect(() => {
    const loadGarments = async () => {
      await fetchGarments();
    };

    void loadGarments();
  }, []);

  const resetGarmentForm = () => {
    setShowAddModal(false);
    setName("");
    setCategory("top");
    setColor("");
    setStyle("");
    setMaterial("");
    setSeason("all");
    setImageUrl("");
    setError("");
    setAnalysisMessage("");
    setIsAnalyzingImage(false);
    setIsDragActive(false);
  };

  const analyzeGarmentImage = async (nextImageUrl: string) => {
    if (!nextImageUrl) return;

    setIsAnalyzingImage(true);
    setError("");
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

      setName(data.name || "");
      setCategory(
        data.category === "bottom" ||
          data.category === "shoes" ||
          data.category === "outerwear"
          ? data.category
          : "top"
      );
      setColor(data.color || "");
      setStyle(data.style || "");
      setMaterial(data.material || "");
      setSeason(
        data.season === "summer" || data.season === "winter" ? data.season : "all"
      );
      setAnalysisMessage(t("aiSuggestionsReady"));
    } catch (analysisError) {
      setError(
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
        setError(t("analyzeImageError"));
        return;
      }

      setImageUrl(result);
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
    if (!name || !color || !imageUrl) {
      setError(t("allFieldsRequired"));
      return;
    }

    await fetch("/api/wardrobe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name,
        category,
        color,
        style,
        material,
        season,
        imageUrl,
      }),
    });

    resetGarmentForm();
    void fetchGarments();
  };

  const deleteGarment = async (id: string) => {
    const confirmDelete = confirm(
      t("deleteGarmentConfirm")
    );
    if (!confirmDelete) return;

    await fetch(`/api/wardrobe/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setSelectedGarment(null);
    fetchGarments();
  };

  return (
    <main className="min-h-screen bg-[#F5EFE3] px-8 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#162B4E] text-white rounded-lg"
        >
          ← {t("back")}
        </button>

        <div className="flex gap-4">

          <button className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition">
            <Heart />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="p-3 bg-[#162B4E] text-white rounded-full shadow-lg hover:scale-110 transition"
          >
            <Plus />
          </button>

        </div>
      </div>

      <h1 className="text-4xl font-semibold text-[#162B4E] mb-8">
        {t("myWardrobe")}
      </h1>

      {/* GRID */}
      <div className="grid md:grid-cols-4 gap-6">
        {garments.map((g) => (
          <div
            key={g._id}
            onClick={() => setSelectedGarment(g)}
            className="bg-white p-4 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
          >
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={g.imageUrl}
                alt={g.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <p className="mt-3 font-semibold">{g.name}</p>
          </div>
        ))}
      </div>

      {/* MODAL AGREGAR */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="relative w-[min(960px,calc(100vw-2rem))] max-h-[90vh] overflow-y-auto rounded-[32px] bg-[#fcfaf6] p-6 shadow-2xl sm:p-8">

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
              <p className="max-w-2xl text-[15px] leading-7 text-[#4b5f82]">
                {t("addGarmentHelp")}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.95fr]">
              <section className="space-y-5 rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgba(22,43,78,0.08)] sm:p-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[#162B4E]">
                    {t("uploadGarmentImage")}
                  </h3>
                  <p className="text-sm leading-6 text-[#5b6b87]">
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

                  {imageUrl ? (
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
                          src={imageUrl}
                          alt={name || t("addGarment")}
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

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
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

                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-[#162B4E]">
                      {t("name")}
                    </label>
                    <input
                      placeholder={t("namePlaceholder")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] placeholder:text-[#8b99b3] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-[#162B4E]">
                      {t("categoryLabel")}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as GarmentCategory)}
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
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] placeholder:text-[#8b99b3] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-[#162B4E]">
                        {t("seasonLabel")}
                      </label>
                      <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value as GarmentSeason)}
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
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
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
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
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
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="min-w-0 flex-1 rounded-2xl border border-[#d7dfef] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#162B4E] placeholder:text-[#8b99b3] focus:border-[#4d77c3] focus:outline-none focus:ring-4 focus:ring-[#dbe7ff]"
                      />
                      <button
                        type="button"
                        onClick={() => void analyzeGarmentImage(imageUrl)}
                        disabled={!imageUrl || isAnalyzingImage}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#e8eef9] px-4 py-3 text-sm font-semibold text-[#162B4E] transition hover:bg-[#dfe8f7] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Sparkles size={16} />
                        {t("analyzeAgain")}
                      </button>
                    </div>
                    <p className="text-sm leading-6 text-[#5b6b87]">
                      {t("imageUrlHint")}
                    </p>
                  </div>

                  <button
                    onClick={addGarment}
                    disabled={isAnalyzingImage}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#162B4E] px-5 py-3.5 text-base font-semibold text-white transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isAnalyzingImage && <LoaderCircle className="animate-spin" size={18} />}
                    {t("saveGarment")}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE PRENDA */}
      {selectedGarment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-3xl w-[450px] relative">

            <button
              onClick={() => setSelectedGarment(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mb-6">
              <img
                src={selectedGarment.imageUrl}
                alt={selectedGarment.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              {selectedGarment.name}
            </h2>

            <p className="text-gray-600 capitalize">
              {t("category", {
                value:
                  selectedGarment.category === "top"
                    ? t("top")
                    : selectedGarment.category === "bottom"
                    ? t("bottom")
                    : selectedGarment.category === "shoes"
                    ? t("shoes")
                    : t("outerwear"),
              })}
            </p>

            <p className="text-gray-600 capitalize mb-6">
              {t("season", {
                value:
                  selectedGarment.season === "all"
                    ? t("allYear")
                    : selectedGarment.season === "summer"
                    ? t("summer")
                    : t("winter"),
              })}
            </p>

            {selectedGarment.style && (
              <p className="text-gray-600 capitalize">
                {t("style")}: {selectedGarment.style}
              </p>
            )}

            {selectedGarment.material && (
              <p className="mb-6 text-gray-600 capitalize">
                {t("material")}: {selectedGarment.material}
              </p>
            )}

            <div className="flex gap-4">

              <button
                onClick={() => deleteGarment(selectedGarment._id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                {t("delete")}
              </button>

              <button className="flex-1 bg-[#162B4E] text-white py-2 rounded-lg">
                {t("favorite")}
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}
