"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/account/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Bir hata oluştu");
        setIsLoading(false);
        return;
      }

      setMessage("✅ Şifreniz başarıyla güncellendi!");

      setTimeout(() => {
        router.push("/login"); // Login sayfasına yönlendir
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Sunucu hatası, tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-amber-950/10 to-white dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-800 rounded-xs shadow-2xl p-8 md:p-10 flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
          Şifre Sıfırlama
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400">
          Şifrenizi sıfırlamak için yeni şifrenizi girin.
        </p>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Yeni Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#7B0323] to-[#5E021A] text-white font-semibold shadow-lg hover:scale-105 transition-transform ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Güncelleniyor..." : "Şifreyi Sıfırla"}
          </Button>

          {message && (
            <p
              className={`text-center mt-2 text-sm ${
                message.toLowerCase().includes("başarı")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-sm text-red-600 hover:underline dark:text-red-400"
          >
            Giriş Ekranına Dön
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Moda Perde
        </p>
      </motion.div>
    </div>
  );
}
