"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onLoginSuccess?: (user: { name?: string; email?: string }) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      setIsLoading(false);

      if (result?.error) {
        setLoginMessage("Email veya şifre hatalı");
        setIsSuccess(false);
        return;
      }

      if (result?.ok) {
        setLoginMessage("Giriş başarılı!");
        setIsSuccess(true);

        const loggedInUser = { email }; // API'den name vs. çekilebilir
        if (onLoginSuccess) onLoginSuccess(loggedInUser);

        // 🔹 Favorileri veritabanına ekle
        const localFavs: number[] = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        if (localFavs.length > 0) {
          await Promise.all(
            localFavs.map((productId) =>
              fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
                credentials: "include",
              })
            )
          );
          localStorage.removeItem("favorites");
        }

        // 🔹 Guest cart'ı veritabanına ekle
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        if (guestCart.length > 0) {
          await Promise.all(
            guestCart.map((item: any) =>
              fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
                credentials: "include",
              })
            )
          );
          localStorage.removeItem("guestCart");
        }

        setTimeout(() => {
          router.push("/"); // yönlendirme
        }, 500);
      }
    } catch (error) {
      console.error(error);
      setLoginMessage("Giriş sırasında bir hata oluştu.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 mt-24 md:mt-0">
      <div className="w-full max-w-5xl grid md:grid-cols-2 border-gray-200 rounded-xs overflow-hidden">
        {/* Sol taraf - Giriş */}
        <div className="p-2 md:p-10 flex flex-col justify-center h-full">
          <h2 className="text-xl md:text-4xl font-serif font-extrabold mb-8">
            Giriş Yap
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
              >
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 rounded-xs border border-gray-200 focus:border-black focus:ring-0"
              />
            </div>

            <div className="mb-6 relative">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
              >
                Şifre
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 rounded-xs border border-gray-200 focus:border-black focus:ring-0"
              />
              <button
                type="button"
                className="absolute right-3 mt-4.5  inset-y-0 flex items-center text-gray-400 hover:text-gray-600 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Link
              href="/forgot-password"
              className="mt-2 text-sm font-semibold hover:underline block text-right"
            >
              Şifrenizi mi unuttunuz?
            </Link>

            <Button
              type="submit"
              className={`w-full rounded-full bg-[#7B0323] hover:bg-[#7B0323]/90 text-white py-6 text-lg font-semibold mt-4 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>

            {loginMessage && (
              <p
                className={`text-center mt-2 text-sm ${
                  isSuccess ? "text-green-500" : "text-red-500"
                }`}
              >
                {loginMessage}
              </p>
            )}
          </form>
        </div>

        {/* Sağ taraf - Kayıt */}
        <div
          className="p-2 md:p-10 md:mt-0 mt-4 flex flex-col justify-center h-full
                  border-t md:border-t-0 md:border-l border-[#7B0323]"
        >
          <h2 className="text-xl md:text-4xl font-serif font-extrabold mb-8 mt-10 md:mt-0">
            Yeni misiniz?
          </h2>
          <p className="text-gray-600 mb-6 font-['Mozilla_Headline']">
            Bizimle hesap oluşturun ve şunları yapabilirsiniz:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-8 font-['Mozilla_Headline']">
            <li>Daha hızlı alışveriş yapabilirsiniz</li>
            <li>Birden fazla teslimat adresi kaydedebilirsiniz</li>
            <li>Sipariş geçmişinize erişebilirsiniz</li>
            <li>Yeni siparişleri takip edebilirsiniz</li>
            <li>İstek listenize ürün kaydedebilirsiniz</li>
          </ul>
          <Button className="w-full rounded-full bg-black hover:bg-gray-900 text-white py-6 text-lg font-semibold">
            <Link href="/register">Hesap Oluştur</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
