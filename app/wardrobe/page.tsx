"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Heart, Plus, X } from "lucide-react";

type GarmentCategory = "top" | "bottom" | "shoes" | "outerwear";
type GarmentSeason = "all" | "summer" | "winter";

type Garment = {
  _id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  season: GarmentSeason;
  imageUrl: string;
};

export default function Wardrobe() {
  const router = useRouter();

  const [garments, setGarments] = useState<Garment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<GarmentCategory>("top");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState<GarmentSeason>("all");
  const [imageUrl, setImageUrl] = useState("");

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

  const addGarment = async () => {
    if (!name || !color || !imageUrl) {
      setError("Todos los campos son obligatorios");
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
        season,
        imageUrl,
      }),
    });

    setShowAddModal(false);
    setName("");
    setColor("");
    setImageUrl("");
    setError("");
    fetchGarments();
  };

  const deleteGarment = async (id: string) => {
    const confirmDelete = confirm(
      "Esta prenda no podrá ser restaurada. ¿Eliminar?"
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
          ← Volver
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
        Mi Armario
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

          <div className="bg-white p-8 rounded-3xl w-[400px] relative">

            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h2 className="text-2xl font-semibold mb-6">
              Agregar Prenda
            </h2>

            <div className="space-y-4">

              <input
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              >
                <option value="top">Parte superior</option>
                <option value="bottom">Parte inferior</option>
                <option value="shoes">Calzado</option>
                <option value="outerwear">Abrigo</option>
              </select>

              <input
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />

              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              >
                <option value="all">Todo el año</option>
                <option value="summer">Verano</option>
                <option value="winter">Invierno</option>
              </select>

              <input
                placeholder="URL imagen"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImageUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full"
              />

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                onClick={addGarment}
                className="w-full bg-[#162B4E] text-white py-2 rounded-lg"
              >
                Guardar
              </button>

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
              Categoría: {selectedGarment.category}
            </p>

            <p className="text-gray-600 capitalize mb-6">
              Temporada: {selectedGarment.season}
            </p>

            <div className="flex gap-4">

              <button
                onClick={() => deleteGarment(selectedGarment._id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Eliminar
              </button>

              <button className="flex-1 bg-[#162B4E] text-white py-2 rounded-lg">
                Favorito
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}
