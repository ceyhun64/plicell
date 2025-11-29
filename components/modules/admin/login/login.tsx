"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text/index";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const logoutExistingSession = async () => {
      await signOut({ redirect: false }); // Mevcut session'ı kapat
    };
    logoutExistingSession();
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error(" Hatalı email veya şifre!");
        return;
      }

      if (res?.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        if (sessionData?.user?.role !== "ADMIN") {
          toast.error(" Bu alan sadece adminler içindir!");
          return;
        }

        toast.success(" Giriş başarılı! Yönlendiriliyorsunuz...");
        setTimeout(() => router.push("/admin/dashboard"), 1000);
      }
    } catch (err) {
      toast.error(" Giriş sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-xs shadow-2xl p-10 flex flex-col gap-6"
      >
        {/* Logo / Başlık */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-18 h-12 md:w-22 md:h-14 lg:w-26 lg:h-16">
              <Image
                src="/logo/logo.webp"
                alt="Moda Perde 6"
                fill
                quality={100}
                className="object-contain"
                sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 208px"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 ">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Yönetici girişi için kimlik doğrulaması yapın
          </p>
        </div>

        <Separator className="my-4" />

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-gray-700  font-medium"
            >
              <Mail size={16} /> E-posta
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@Moda Perde.com"
              required
              className="rounded-lg "
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <Label
              htmlFor="password"
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <Lock size={16} /> Şifre
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-lg pr-10"
            />
            <button
              type="button"
              className="absolute right-3 mt-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7B0323] to-[#5E021A] hover:from-[##7B0323]/90 hover:to-[#5E021A]/90 text-white font-semibold py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Yükleniyor..." : "Giriş Yap"}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Moda Perde Admin System
        </p>
      </motion.div>
    </div>
  );
}
