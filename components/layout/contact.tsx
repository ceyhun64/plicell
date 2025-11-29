"use client";

import React, { useState } from "react";
// UI Bileşenlerini İçe Aktarma
// NOT: Bu component'in çalışması için dışarıdan sağlanan Button, Input, Textarea ve sonner/toast gibi bileşenlere ihtiyacı vardır.
// Label bileşeni, bağımlılığı kaldırmak için standart HTML <label> etiketiyle değiştirildi.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, User, Send, Compass } from "lucide-react"; // Compass ikonu eklendi
import { motion } from "framer-motion";
// import { Label } from "../ui/label"; // Hata veren harici bileşen kaldırıldı.
import { toast } from "sonner";

// --- YARDIMCI BİLEŞENLER ---

const ContactInfoCard = ({
  icon: Icon,
  title,
  content,
}: {
  icon: typeof MapPin;
  title: string;
  content: string | React.JSX.Element;
}) => (
  // Rose temasını koruyarak modern kart stili
  <div className="flex items-start gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-xs border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-rose-100">
    <Icon className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <div className="text-gray-600 leading-snug text-sm">{content}</div>
    </div>
  </div>
);

// Form alanları için yardımcı component
// Harici Label bileşeni yerine standart HTML <label> kullanıldı.
const InputField = ({
  id,
  name,
  type = "text",
  placeholder,
  value,
  Icon,
  required = true,
  handleChange, // handleChange prop olarak eklendi
}: {
  id: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  Icon: typeof User;
  required?: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void; // Tip tanımı eklendi
}) => (
  <div className="space-y-2">
    {/* Standart HTML <label> etiketi kullanıldı */}
    <label htmlFor={id} className="text-gray-700 font-medium text-sm block">
      {required && <span className="text-rose-600 mr-1">*</span>}
      {placeholder}
    </label>
    <div className="relative group">
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors"
        size={18}
      />
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        // Modern Tailwind Stilleri: Temiz, köşeleri yuvarlatılmış, rose odaklı
        className="pl-11 py-5 rounded-lg border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all text-gray-800 placeholder:text-gray-500 w-full"
      />
    </div>
  </div>
);

// --- ANA BİLEŞEN ---

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Form alanlarını doğrulama
      if (
        !formData.name ||
        !formData.phone ||
        !formData.email ||
        !formData.message
      ) {
        toast.error("Lütfen tüm zorunlu alanları doldurun.");
        setIsLoading(false);
        return;
      }

      // API çağrısı
      // NOT: Bu bir mock API çağrısıdır, gerçek mail gönderme işlemi sunucu tarafında yapılmalıdır.
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: ["modaperdeofficial@gmail.com"],
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
        toast.error(
          data.error ||
            "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin."
        );
      } else {
        toast.success(
          "Mesajınız başarıyla gönderildi! Size en kısa sürede dönüş yapacağız."
        );
        setFormData({ name: "", phone: "", email: "", message: "" });
      }
    } catch {
      toast.error("Sunucu hatası, lütfen internet bağlantınızı kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: MapPin,
      title: "Adres",
      content: "Mustafa Kökmen Blv. 91, 27700 Gaziantep, Nizip Türkiye",
    },
    {
      icon: Phone,
      title: "Telefon",
      content: (
        <a href="tel:+905333874074" className="hover:text-rose-600 transition">
          +90 533 387 40 74
        </a>
      ),
    },
    {
      icon: Mail,
      title: "E-posta",
      content: (
        <a
          href="mailto:modaperdeofficial@gmail.com"
          className="hover:text-rose-600 transition"
        >
          modaperdeofficial@gmail.com
        </a>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-amber-950/10 to-white py-10 md:py-16 font-inter">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        {/* 1. SATIR: Başlık + Bilgiler (sol), Form (sağ) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* SOL TARAF: BAŞLIK ve İLETİŞİM BİLGİLERİ */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
                Bize Ulaşın
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Aklınızdaki Projeyi Konuşalım
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Perde sistemleri ve tekstil çözümlerimiz hakkında bilgi almak
                için formu doldurabilirsiniz. Uzman ekibimiz size hızla dönüş
                yapacaktır.
              </p>
            </div>

            <div className="space-y-4 font-sans">
              {contactDetails.map((item, index) => (
                <ContactInfoCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  content={item.content}
                />
              ))}
            </div>
          </motion.div>

          {/* SAĞ TARAF: FORM */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 sm:p-10 rounded-xs shadow-2xl shadow-rose-400/20 border border-gray-100 space-y-6 font-sans"
          >
            <div className="space-y-6">
              <InputField
                id="name"
                name="name"
                placeholder="Adınız Soyadınız"
                value={formData.name}
                Icon={User}
                handleChange={handleChange}
              />
              <InputField
                id="phone"
                name="phone"
                type="tel"
                placeholder="Telefon Numaranız"
                value={formData.phone}
                Icon={Phone}
                handleChange={handleChange}
              />
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="E-posta Adresiniz"
                value={formData.email}
                Icon={Mail}
                handleChange={handleChange}
              />
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-gray-700 font-medium text-sm block"
                >
                  <span className="text-rose-600 mr-1">*</span> Mesajınız
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Detaylı mesajınızı buraya yazabilirsiniz..."
                  required
                  className="rounded-lg border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all text-gray-800 placeholder:text-gray-500 w-full"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-3 md:py-4 text-lg font-semibold shadow-lg shadow-rose-600/30 
                     bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5 animate-spin" /> Gönderiliyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" /> Gönder
                </span>
              )}
            </Button>
          </motion.form>
        </div>

        {/* 2. SATIR: HARİTA (IFRAME) */}
        <div className="overflow-hidden rounded-xs shadow-xl border border-rose-500/10 transition-shadow hover:shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3426.3942668546624!2d37.813051!3d37.0145675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15318f938be54e21%3A0x61bafd6c8b6f9376!2sModa%20Perde%20Ferudun%20Polat%20Homedesign!5e1!3m2!1str!2str!4v1764056635735!5m2!1str!2str"
            className="w-full h-[450px] md:h-[500px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Moda Perde Konumu Haritası"
          />
        </div>
      </div>
    </div>
  );
}
