"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthModal({ type, onClose, onSuccess }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("hombre");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animateError, setAnimateError] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const triggerError = (message: string) => {
    setError(message);
    setAnimateError(true);
    setTimeout(() => setAnimateError(false), 400);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (type === "register" && !name.trim())
      return triggerError("El nombre completo es obligatorio.");

    if (!email.trim())
      return triggerError("El email es obligatorio.");

    if (!validateEmail(email))
      return triggerError("Ingresá un email válido.");

    if (!password)
      return triggerError("La contraseña es obligatoria.");

    if (password.length < 8)
      return triggerError("Debe tener mínimo 8 caracteres.");

    if (type === "register" && password !== confirmPassword)
      return triggerError("Las contraseñas no coinciden.");

    setLoading(true);

    const endpoint = type === "login" ? "/api/login" : "/api/register";

    const body =
      type === "login"
        ? { email, password }
        : { name, email, password, gender };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      if (type === "register") {
        setSuccess("Cuenta creada con éxito 🎉");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      triggerError(data.error || "Error en el servidor.");
    }
  };

  const inputStyle =
    "w-full border border-gray-300 bg-gray-50 text-[#162B4E] placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#162B4E] transition";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-2xl p-8 w-96 space-y-4 shadow-xl ${
          animateError ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-2xl font-semibold text-[#162B4E] text-center">
          {type === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg animate-fadeIn">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 text-sm px-4 py-2 rounded-lg animate-fadeIn">
            {success}
          </div>
        )}

        {type === "register" && (
          <input
            type="text"
            placeholder="Nombre completo *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputStyle}
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputStyle} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#162B4E] transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {type === "register" && (
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña *"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputStyle} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#162B4E] transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        {type === "register" && (
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={inputStyle}
          >
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#162B4E] text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {loading
            ? "Procesando..."
            : type === "login"
            ? "Entrar"
            : "Registrarse"}
        </button>

        <button
          onClick={onClose}
          className="text-sm text-[#162B4E] hover:underline w-full text-center"
        >
          Cancelar
        </button>
      </div>

      <style jsx>{`
        @keyframes shake {
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake { animation: shake 0.3s ease; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
      `}</style>
    </div>
  );
}