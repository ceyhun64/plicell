"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/account/forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Bir hata oluştu, tekrar deneyin.");
      } else {
        setMessage(data.message || "Şifre sıfırlama linki gönderildi.");
      }
    } catch (err) {
      console.error("Forgot password hatası:", err);
      setMessage("Sunucu hatası, tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-amber-950/10 to-white dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-800 rounded-xs shadow-2xl p-10 flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
          Şifremi Unuttum
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Şifrenizi almak için sistemimize kayıt olduğunuz e-posta adresinizi
          girin.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
            E-posta Adresiniz
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#7B0323] to-[#5E021A]   text-white font-semibold shadow-lg transition-transform transform hover:scale-105 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Gönderiliyor..." : "Şifre Yenileme Linki Gönder"}
          </Button>

          {message && (
            <p
              className={`text-center text-sm ${
                message.toLowerCase().includes("başarılı") ||
                message.toLowerCase().includes("gönderildi")
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
