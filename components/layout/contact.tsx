"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, User } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [messageStatus, setMessageStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessageStatus(null);

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: ["info@nowartplicell.com"],
          subject: "Web Sitesi İletişim Formu",
          message: `
Ad Soyad: ${formData.name}
Telefon: ${formData.phone}
Email: ${formData.email}
Mesaj: ${formData.message}
          `,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageStatus(data.error || "Bir hata oluştu, tekrar deneyin.");
      } else {
        setMessageStatus("Mesajınız başarıyla gönderildi!");
        setFormData({ name: "", phone: "", email: "", message: "" });
      }
    } catch {
      setMessageStatus("Sunucu hatası, tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-amber-950/5 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Section */}
        <div className="space-y-8 animate-fadeIn">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            İletişime Geçin
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Bizimle iletişime geçmek için formu doldurabilir veya aşağıdaki
            bilgileri kullanabilirsiniz.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#7B0323]" />
              <p className="text-gray-700 leading-tight">
                Şenevler, Adnan Menderes Cd. Helin Apt. Altı, 63320
                Karaköprü/Şanlıurfa
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-[#7B0323]" />
              <p className="text-gray-700">+90 533 387 40 74</p>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-[#7B0323]" />
              <p className="text-gray-700">info@modaperde.com</p>
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-10 rounded-xs shadow-lg border border-rose-100 space-y-6 animate-fadeIn delay-150"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative ">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                name="name"
                placeholder="Adınız Soyadınız"
                value={formData.name}
                onChange={handleChange}
                required
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                name="phone"
                type="tel"
                placeholder="Telefon Numaranız"
                value={formData.phone}
                onChange={handleChange}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              name="email"
              type="email"
              placeholder="E-posta Adresiniz"
              value={formData.email}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>

          <Textarea
            name="message"
            placeholder="Mesajınız"
            value={formData.message}
            onChange={handleChange}
            required
            className="min-h-[140px]"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full py-6 text-lg bg-gradient-to-br from-[#7B0323] to-[#9F1B40]"
          >
            {isLoading ? "Gönderiliyor..." : "Gönder"}
          </Button>

          {messageStatus && (
            <p
              className={`text-center mt-2 text-sm font-medium ${
                messageStatus.includes("başarı")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {messageStatus}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
