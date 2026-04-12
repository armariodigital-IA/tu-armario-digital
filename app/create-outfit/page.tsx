"use client";

export default function CreateOutfitHome() {
  return (
    <main className="min-h-screen bg-[#F5EFE3] px-10 py-12">

      <h1 className="text-5xl font-semibold text-center text-[#162B4E] mb-16">
        ¿Cómo querés crear tu outfit?
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

        {/* MANUAL */}
        <div
          onClick={() => (window.location.href = "/create-outfit/manual")}
          className="bg-white rounded-3xl p-12 shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <h2 className="text-3xl font-semibold text-[#162B4E] mb-6">
            Crear manualmente
          </h2>

          <p className="text-gray-600 text-lg">
            Elegí cada prenda de tu armario digital y armá tu outfit perfecto.
          </p>
        </div>

        {/* IA */}
        <div
          onClick={() => (window.location.href = "/create-outfit-ai")}
          className="bg-gradient-to-b from-[#162B4E] to-[#0f1d35] text-white rounded-3xl p-12 shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <h2 className="text-3xl font-semibold mb-6">
            Generar con IA
          </h2>

          <p className="text-lg opacity-90">
            Respondé algunas preguntas y dejá que la IA cree tu outfit usando
            tus prendas y el clima actual.
          </p>
        </div>

      </div>
    </main>
  );
}