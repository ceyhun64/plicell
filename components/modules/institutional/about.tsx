"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  Instagram,
  TrendingUp,
  Zap,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

// --- YARDIMCI BİLEŞENLER ---

// Modernize Edilmiş İletişim Kartı (Mobil İyileştirmeler)
const ContactCard = ({
  icon: Icon,
  text,
}: {
  icon: typeof MapPin;
  text: string;
}) => (
  <div
    className="flex items-center gap-3 p-4 rounded-xs shadow-lg bg-white 
               border border-rose-500/10 hover:shadow-2xl transition-all duration-300 
               transform hover:scale-[1.02] hover:ring-2 ring-rose-500/50 cursor-pointer" // p-5 -> p-4 yapıldı
  >
    <Icon className="w-5 h-5 text-rose-900 flex-shrink-0" />{" "}
    {/* İkon boyutu küçültüldü */}
    <span className="text-gray-800 font-medium text-sm">{text}</span>{" "}
    {/* Metin boyutu sm'ye çekildi */}
  </div>
);

// Ana İçerik Bloğu Bileşeni (Mobil İyileştirmeler)
const ContentSection = ({
  title,
  text,
  image,
  alt,
  list,
  reverse,
}: {
  title: string;
  text?: string;
  image: string;
  alt: string;
  list?: string[];
  reverse: boolean;
}) => (
  <div
    // gap-12 -> gap-8 (Mobil aralık daraltıldı)
    // py-10 -> py-8 (Dikey padding daraltıldı)
    className={`grid gap-8 md:grid-cols-2 items-center ${
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    } py-8`}
  >
    {/* Görsel Bloğu */}
    <div className={`order-1 ${reverse ? "md:order-2" : "md:order-1"}`}>
      <div className="overflow-hidden rounded-xs shadow-2xl shadow-gray-400/20">
        <Image
          src={image}
          alt={alt}
          width={1200}
          height={800}
          // h-64 sm:h-80 md:h-96: Mobil cihazlarda h-64 bırakıldı.
          className="w-full h-64 object-cover sm:h-80 md:h-96 transform hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>
    </div>

    {/* Metin Bloğu */}
    <div
      className={`order-2 ${
        reverse ? "md:order-1" : "md:order-2"
      } flex flex-col justify-center space-y-4 md:space-y-6`} // Mobil dikey boşluk daraltıldı
    >
      <h2
        // text-4xl -> text-3xl (Mobil başlık boyutu düşürüldü)
        className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug"
      >
        {title}
      </h2>
      {text && (
        // text-lg -> text-base (Mobil metin boyutu düşürüldü)
        <p className="text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
          {text}
        </p>
      )}
      {list && (
        <ul className="space-y-2 pt-1 md:space-y-3 md:pt-2">
          {" "}
          {/* Mobil liste boşluğu daraltıldı */}
          {list.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-gray-700 text-sm md:text-base"
            >
              {" "}
              {/* Metin boyutu sm'ye çekildi */}
              <CheckCircle className="w-4 h-4 text-rose-600 mt-1 flex-shrink-0" />{" "}
              {/* İkon boyutu küçültüldü */}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

// --- ANA BİLEŞEN ---

export default function AboutPage() {
  const sections = [
    // ... (sections verileri aynı kaldı)
    {
      title: "Üretimde Kalite, Tasarımda Özgünlük",
      text: `Moda Perde ve Moda Tekstil, tekstil ve perde sistemleri sektöründe
        yenilikçi, kaliteli ve güvenilir çözümler sunmayı misyon edinmiştir. 
        Modern üretim tesislerimizde plise, zebra ve özel tekstil ürünleri, 
        en ileri teknolojilerle üretilmektedir. 
        
        Üretim süreçlerimizde kalite kontrol, estetik ve işlevselliği bir araya
        getiriyoruz. Evlerden ofislere, otellerden mağazalara kadar geniş bir
        müşteri kitlesine hitap eden ürünlerimizle, yaşam alanlarınıza değer katıyoruz.`,
      image: "/about/about1.webp",
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
      image: "/about/about2.webp",
      alt: "Moda Tekstil kumaş ve ürün görselleri",
      reverse: true,
    },
    {
      title: "Misyon & Vizyon",
      text: `Misyonumuz, kaliteli ve güvenilir perde sistemlerini ulaşılabilir kılmak,
        müşteri memnuniyetini en üst seviyede tutmak ve sektörde fark yaratmaktır.`,
      image: "/about/about3.webp",
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

  const contactItems = [
    { icon: MapPin, text: "Mustafa Kökmen Blv. 91, Gaziantep, Nizip Türkiye" },
    { icon: Phone, text: "+90 533 387 40 74" },
    { icon: Globe, text: "modaperde.com" },
    { icon: Mail, text: "info@modaperde.com" },
    { icon: Instagram, text: "@nataliaperde" },
    { icon: Zap, text: "Hızlı Cevap: 1 İş Günü İçinde Dönüş" },
  ];

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* py-20 -> py-12 (Dikey sayfa paddingi azaltıldı) */}
      {/* space-y-28 -> space-y-16 (Ana bölümler arası boşluk azaltıldı) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 ">
        {/* BAŞLIK VE GİRİŞ - Mobil Optimizasyon */}
        <header className="text-center space-y-3">
          {" "}
          {/* Boşluk daraltıldı */}
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
            {" "}
            {/* Boyut küçültüldü */}
            HİKAYEMİZ
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            {" "}
            {/* text-5xl -> text-4xl */}
            Yaşam Alanlarına Dokunuş
          </h1>
          <p className="max-w-3xl mx-auto text-base md:text-xl text-gray-500 pt-2">
            {" "}
            {/* text-xl -> text-base */}
            Moda Perde olarak, her bir detayı özenle tasarlayarak mekanlarınızı
            fonksiyonel sanat eserlerine dönüştürüyoruz.
          </p>
        </header>

        {/* HAKKIMIZDA BÖLÜMLERİ - Mobil Optimizasyon */}
        <section className="space-y-20 md:space-y-32">
          {" "}
          {/* Bölümler arası boşluk daraltıldı */}
          {sections.map((sec, idx) => (
            <ContentSection key={idx} {...sec} />
          ))}
        </section>

        {/* NEDEN BİZ? - Mobil Optimizasyon */}
        <section className="space-y-8 pt-8 md:pt-16">
          {" "}
          {/* Dikey boşluklar daraltıldı */}
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900">
            {" "}
            {/* Başlık boyutu düşürüldü */}
            Neden Moda Perde?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {" "}
            {/* gap-8 -> gap-6 (Kart arası boşluk) */}
            <div className="p-6 rounded-xs bg-gray-50 border border-gray-200 shadow-xl text-center transform hover:translate-y-[-5px] transition-transform duration-300">
              {" "}
              {/* p-8 -> p-6 (İç padding daraltıldı) */}
              <TrendingUp className="w-7 h-7 mx-auto mb-3 text-rose-600" />{" "}
              {/* İkon boyutu ve alt boşluk küçültüldü */}
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Sektör Lideri Teknoloji
              </h3>{" "}
              {/* Başlık boyutu düşürüldü */}
              <p className="text-gray-600 text-xs">
                En son üretim teknikleri ile dayanıklı ve estetik ürünler.
              </p>{" "}
              {/* Metin boyutu küçültüldü */}
            </div>
            <div className="p-6 rounded-xs bg-gray-50 border border-gray-200 shadow-xl text-center transform hover:translate-y-[-5px] transition-transform duration-300">
              <Zap className="w-7 h-7 mx-auto mb-3 text-rose-600" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Doğrudan Üretici Fiyatı
              </h3>
              <p className="text-gray-600 text-xs">
                Aracısız alışverişin getirdiği rekabetçi ve uygun fiyatlar.
              </p>
            </div>
            <div className="p-6 rounded-xs bg-gray-50 border border-gray-200 shadow-xl text-center transform hover:translate-y-[-5px] transition-transform duration-300">
              <CheckCircle className="w-7 h-7 mx-auto mb-3 text-rose-600" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                100% Müşteri Odaklılık
              </h3>
              <p className="text-gray-600 text-xs">
                Memnuniyet garantisi ve hızlı, güvenilir destek.
              </p>
            </div>
          </div>
        </section>

        {/* İLETİŞİM KARTLARI - Mobil Optimizasyon */}
        <section className="pt-10 md:pt-20 font-sans">
          {" "}
          {/* Dikey boşluk daraltıldı */}
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
            {" "}
            {/* Başlık boyutu ve alt boşluk daraltıldı */}
            Bize Ulaşın
          </h2>
          {/* sm:grid-cols-2 kaldırıldı: Küçük ekranlarda dikey sıralama daha iyi okunabilirlik sağlar. */}
          {/* md:grid-cols-3 korundu: Tablet ve üzeri için 3 sütun korundu. */}
          <div className="grid gap-4 lg:grid-cols-3">
            {" "}
            {/* gap-6 -> gap-4 (Kart arası boşluk daraltıldı) */}
            {contactItems.map((item, idx) => (
              <ContactCard key={idx} {...item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
