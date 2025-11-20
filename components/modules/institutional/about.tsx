"use client";

import React from "react";
import { MapPin, Phone, Globe, Mail, Instagram } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const sections = [
    {
      title: "Üretimde Kalite, Tasarımda Özgünlük",
      text: `Moda Perde ve Moda Tekstil, tekstil ve perde sistemleri sektöründe
        yenilikçi, kaliteli ve güvenilir çözümler sunmayı misyon edinmiştir. 
        Modern üretim tesislerimizde plise, zebra ve özel tekstil ürünleri, 
        en ileri teknolojilerle üretilmektedir.  
        
        Üretim süreçlerimizde kalite kontrol, estetik ve işlevselliği bir araya
        getiriyoruz. Evlerden ofislere, otellerden mağazalara kadar geniş bir
        müşteri kitlesine hitap eden ürünlerimizle, yaşam alanlarınıza değer katıyoruz.`,
      image: "/heroes/2.webp",
      alt: "Moda modern üretim tesisimiz",
      reverse: false,
    },
    {
      title: "Üreticiden Tüketiciye: Doğrudan ve Güvenilir Alışveriş",
      text: `Sunduğumuz ürünleri doğrudan üretim tesisimizden müşterilerimize ulaştırıyoruz. 
        Böylece aracıları ortadan kaldırarak, kaliteyi uygun fiyatlarla sunuyoruz. 

        Her müşterimizin memnuniyetini ön planda tutarak, ürünlerimizi zamanında teslim ediyoruz.
        Kalite kontrol süreçlerimiz ile tüm ürünlerimiz en yüksek standartlarda müşteriye ulaştırılır.
        
        Moda Perde ve Moda Tekstil olarak amacımız sadece ürün satmak değil; 
        aynı zamanda yaşam alanlarına estetik ve fonksiyonel çözümler sunmaktır.`,
      image: "/heroes/8.webp",
      alt: "Moda Tekstil kumaş ve ürün görselleri",
      reverse: true,
    },
    {
      title: "Misyon & Vizyon",
      text: `Misyonumuz, kaliteli ve güvenilir perde sistemlerini ulaşılabilir kılmak,
        müşteri memnuniyetini en üst seviyede tutmak ve sektörde fark yaratmaktır. 
        Vizyonumuz ise Türkiye genelinde ve dünya çapında tanınan, 
        modern ve yenilikçi perde çözümleri sunan bir marka olmaktır.`,
      image: "/heroes/9.webp",
      alt: "Moda Plise Perde Sistemleri",
      list: [
        "Yüksek Kalite: En iyi malzemeleri, en son teknolojiyle işliyoruz.",
        "Uzman Kadro: Alanında deneyimli üretim, tasarım ve satış ekibi.",
        "Estetik & Fonksiyonel: Hem görsel hem işlevsel çözümler.",
        "Zamanında Teslimat: Söz verdiğimiz tarihlerde üretim.",
        "Sürdürülebilir Üretim: Çevre dostu malzemeler ve yöntemler kullanıyoruz.",
      ],
      reverse: false,
    },
  ];

  const ImageBlock = ({ src, alt }: { src: string; alt: string }) => (
    <div className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={500}
        className="w-full h-60 sm:h-80 md:h-96 object-cover"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-24 font-sans">
      {/* Başlık */}
      <header className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif">
          Hakkımızda
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Moda Perde - 20 Kasım 2025
        </p>
      </header>

      {/* Hakkımızda bölümü */}
      <section className="space-y-24 text-gray-700">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className={`grid gap-10 md:grid-cols-2 items-center ${
              sec.reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <ImageBlock src={sec.image} alt={sec.alt} />
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900">
                {sec.title}
              </h2>
              {sec.text && (
                <p className="text-base md:text-lg leading-relaxed">
                  {sec.text}
                </p>
              )}
              {sec.list && (
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  {sec.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* İletişim Kartları */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: MapPin,
            text: "BAMYASUYU MAH. KÖSEOĞLU SK. NO: 6B HALİLİYE / ŞANLIURFA",
          },
          { icon: Phone, text: "+90 530 130 30 84" },
          { icon: Globe, text: "Modaplicell.com" },
          { icon: Mail, text: "info@Modaplicell.com" },
          { icon: Instagram, text: "Modaplicell" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow bg-white"
            >
              <Icon className="w-6 h-6 text-[#7B0323]" />
              <span className="text-gray-700 font-medium">{item.text}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
