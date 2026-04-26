"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";

type AuthModalProps = {
  type: "login" | "register";
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({ type, onClose, onSuccess }: AuthModalProps) {
  const { t } = useLanguage();
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (type === "register" && !name.trim())
      return triggerError(t("fullNameRequired"));

    if (!email.trim())
      return triggerError(t("emailRequired"));

    if (!validateEmail(email))
      return triggerError(t("validEmail"));

    if (!password)
      return triggerError(t("passwordRequired"));

    if (password.length < 8)
      return triggerError(t("passwordMin"));

    if (type === "register" && password !== confirmPassword)
      return triggerError(t("passwordsMismatch"));

    setLoading(true);

    const endpoint = type === "login" ? "/api/login" : "/api/register";

    const body =
      type === "login"
        ? { email: email.trim(), password }
        : { name: name.trim(), email: email.trim(), password, gender };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (type === "register") {
          setSuccess(t("accountCreated"));
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          onSuccess();
        }
      } else {
        triggerError(data.error || t("serverError"));
      }
    } catch {
      triggerError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full border border-gray-300 bg-gray-50 text-[#162B4E] placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#162B4E] transition";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className={`bg-white rounded-2xl p-8 w-96 space-y-4 shadow-xl ${
          animateError ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-2xl font-semibold text-[#162B4E] text-center">
          {type === "login" ? t("login") : t("createAccount")}
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
            placeholder={t("fullNamePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputStyle}
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("passwordPlaceholder")}
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
              placeholder={t("confirmPasswordPlaceholder")}
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
            <option value="hombre">{t("genderMale")}</option>
            <option value="mujer">{t("genderFemale")}</option>
          </select>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#162B4E] text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {loading
            ? t("processing")
            : type === "login"
            ? t("enter")
            : t("register")}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="text-sm text-[#162B4E] hover:underline w-full text-center"
        >
          {t("cancel")}
        </button>
      </form>
 
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
