"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 mt-24 md:mt-0">
      <div className="w-full max-w-5xl grid md:grid-cols-2 border-gray-200 rounded-2xl overflow-hidden">
        {/* Sol taraf - Kayıt Formu */}
        <div className="p-2 md:p-10 flex flex-col justify-center h-full">
          <h2 className="text-xl md:text-4xl font-serif font-extrabold mb-8">
            Hesap Oluştur
          </h2>

          <div className="mb-4">
            <Label
              htmlFor="name"
              className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
            >
              İsim
            </Label>
            <Input
              id="name"
              type="text"
              className="mt-1 rounded-md border border-gray-200 focus:border-black focus:ring-0"
            />
          </div>

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
              className="mt-1 rounded-md border border-gray-200 focus:border-black focus:ring-0"
            />
          </div>

          <div className="mb-4">
            <Label
              htmlFor="password"
              className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
            >
              Şifre
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="mt-1 pr-10 rounded-md border border-gray-200 focus:border-black focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
            >
              Şifreyi Onayla
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="mt-1 pr-10 rounded-md border border-gray-200 focus:border-black focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button className="w-full rounded-full bg-[#7B0323] hover:bg-gray-900 text-white py-6 text-lg font-semibold">
            Hesap Oluştur
          </Button>
        </div>

        {/* Sağ taraf - Zaten hesabınız var mı? */}
        <div
          className="p-2 md:p-10 md:mt-0 mt-4 flex flex-col justify-center h-full
                     border-t md:border-t-0 md:border-l border-[#7B0323]"
        >
          <h2 className="text-xl md:text-4xl font-serif font-extrabold mb-8 mt-10 md:mt-0">
            Zaten hesabınız var mı?
          </h2>
          <p className="text-gray-600 mb-6 font-['Mozilla_Headline']">
            Hesabınıza giriş yaparak:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-8 font-['Mozilla_Headline']">
            <li>Sipariş geçmişinize erişebilirsiniz</li>
            <li>Siparişlerinizi takip edebilirsiniz</li>
            <li>Kaydedilmiş adreslerinizi yönetebilirsiniz</li>
            <li>Daha hızlı ödeme yapabilirsiniz</li>
          </ul>
          <Button className="w-full rounded-full bg-black hover:bg-gray-900 text-white py-6 text-lg font-semibold">
            <Link href="/login">Giriş Yap</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
