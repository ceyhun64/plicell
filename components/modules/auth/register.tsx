"use client";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  onLoginClick?: () => void; // kayıt sonrası login sayfasına yönlendirme
}

export default function RegisterForm({ onLoginClick }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Kayıt başarısız!");
      } else {
        toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
        if (onLoginClick) onLoginClick();
        router.push("/login"); // yönlendirme
      }
    } catch (err) {
      console.error(err);
      toast.error("Sunucu hatası, tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 my-24 md:mt-0">
      <div className="w-full max-w-5xl grid md:grid-cols-2 border-gray-200 rounded-xs overflow-hidden">
        {/* Sol taraf - Kayıt Formu */}
        <div className="p-2 md:p-10 flex flex-col justify-center h-full">
          <h2 className="text-xl md:text-4xl font-serif font-extrabold mb-8">
            Hesap Oluştur
          </h2>

          <form onSubmit={handleRegister}>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 rounded-xs border border-gray-200 focus:border-black focus:ring-0"
              />
            </div>

            <div className="mb-4">
              <Label
                htmlFor="surname"
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
              >
                Soyad
              </Label>
              <Input
                id="surname"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="mt-1 rounded-xs border border-gray-200 focus:border-black focus:ring-0"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 rounded-xs border border-gray-200 focus:border-black focus:ring-0"
              />
            </div>

            <div className="mb-4 relative">
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
                className="mt-1 pr-10 rounded-xs border border-gray-200 focus:border-black focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3  mt-4.5  flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mb-6 relative">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
              >
                Şifreyi Onayla
              </Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 pr-10 rounded-xs border  border-gray-200 focus:border-black focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3  mt-4.5   flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              className={`w-full rounded-full bg-[#7B0323] hover:bg-[#7B0323]/90 text-white py-6 text-lg font-semibold ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Kayıt yapılıyor..." : "Hesap Oluştur"}
            </Button>

          </form>
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
