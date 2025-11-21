"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "../ui/label";

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
          recipients: ["info@modaperde.com"],
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
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
                Mustafa Kökmen Blv. 91, 27700 Gaziantep, Nizip Türkiye
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
        </motion.div>

        {/* Right Section (Modern Form) */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="backdrop-blur-xl bg-white/60 p-10 rounded-xs shadow-2xl border border-white/40 space-y-6"
        >
          {/* Form Alanları */}
          <div className="space-y-6">
            {/* Ad Soyad */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Ad Soyad
              </Label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
                  size={20}
                />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız Soyadınız"
                  required
                  className="pl-12 py-3 rounded-xl border-gray-300 group-hover:border-rose-300 focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>

            {/* Telefon */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Telefon
              </Label>
              <div className="relative group">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
                  size={20}
                />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefon Numaranız"
                  required
                  className="pl-12 py-3 rounded-xl border-gray-300 group-hover:border-rose-300 focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> E-posta
              </Label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
                  size={20}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta Adresiniz"
                  required
                  className="pl-12 py-3 rounded-xl border-gray-300 group-hover:border-rose-300 focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>

            {/* Mesaj */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-700 font-medium">
                <span className="text-red-500">*</span> Mesaj
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Mesajınız"
                required
                className="rounded-xl border-gray-300 hover:border-rose-300 focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full py-6 text-lg shadow-lg bg-gradient-to-br from-[#7B0323] to-[#B3133C] hover:opacity-90 transition"
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
        </motion.form>
      </div>
    </div>
  );
}
