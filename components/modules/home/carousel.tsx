"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Kahraman verisi (Değişiklik yok)
const heroes = [
  {
    id: 1,
    title: "Modern Perdelerle Dekorasyon",
    description:
      "Evinize şıklık ve konfor katacak en yeni perde koleksiyonumuzu keşfedin.",
    image: "/heroes/2.webp",
    buttonText: "Hemen İncele",
    href: "/products",
  },
  {
    id: 2,
    title: "Zebra Perde ile Zarif Dokunuşlar",
    description:
      "Odanızın havasını değiştirecek şık ve modern fon perde seçeneklerimizi görün.",
    image: "/heroes/8.webp",
    buttonText: "Zebra Perdeleri Gör",
    href: "/products/zebra",
  },
  {
    id: 3,
    title: "Fon Perdelerle Konforlu Uyku",
    description:
      "Işığı tamamen engelleyen blackout perdelerle hem estetik hem de fonksiyonel çözümler.",
    image: "/heroes/17.webp",
    buttonText: "Fon Koleksiyonu",
    href: "/products/drapes",
  },
  {
    id: 4,
    title: "Tül Perdelerle Ferah Mekanlar",
    description:
      "Doğal ışığı korurken dekoratif dokunuşlar sağlayan tül ve stor perdelerimizi keşfedin.",
    image: "/heroes/9.webp",
    buttonText: "Tül Perdeleri Gör",
    href: "/products/sheer",
  },
];

const SLIDE_INTERVAL_MS = 6000; // Otomatik geçiş süresi (5 saniyeden 6 saniyeye çıkarıldı)

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  // Navigasyon fonksiyonları için useCallback kullanımı
  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? heroes.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === heroes.length - 1 ? 0 : prev + 1));
  }, []);

  // Otomatik slayt geçişi ve temizleme
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [nextSlide]); // Bağımlılık olarak nextSlide eklendi

  // Klavye erişilebilirliği için event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [prevSlide, nextSlide]);

  return (
    <div
      className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden group"
      aria-roledescription="carousel"
      aria-label="Ürün Tanıtım Kaydırıcısı"
    >
      {heroes.map((slide, index) => {
        const isActive = index === current;

        return (
          <div
            key={slide.id}
            // Sadece tek bir slaytı gösterip diğerlerini gizlemek için daha temiz bir yol
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={!isActive} // Erişilebilirlik için gizli
            role="group"
            aria-label={`${index + 1} / ${heroes.length}`}
          >
            {/* Görüntü */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              style={{ objectFit: "cover" }} // layout="fill" yerine modern Next.js 13+ style kullanımı
              priority={index === 0} // İlk slayt için öncelik
            />

            {/* Gradyan Kaplama */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40  to-transparent"></div>

            {/* Metin ve Buton Blok */}
            <Link
              href={slide.href}
              className="absolute bottom-6 left-4 md:left-10 p-6 sm:p-10 rounded-xs text-white backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors duration-300 flex flex-col items-start z-20 max-w-[90%] sm:max-w-[500px] w-auto break-words"
              tabIndex={isActive ? 0 : -1}
              aria-label={`${slide.title} sayfasına git`}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-left drop-shadow-xl font-serif break-words">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg mt-3 sm:mt-5 font-light opacity-95 drop-shadow-md break-words">
                {slide.description}
              </p>

              <Button
                asChild
                className="mt-6 bg-[#7B0323] hover:bg-[#A30530] text-white py-3 sm:py-4 px-6 sm:px-10 rounded-full text-sm sm:text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span>{slide.buttonText}</span>
              </Button>
            </Link>
          </div>
        );
      })}

      {/* Navigasyon Düğmeleri */}
      <div className="absolute top-1/2 left-3 transform -translate-y-1/2 z-30 opacity-70 group-hover:opacity-100 transition-opacity duration-300 ">
        <Button
          variant="secondary" // Daha belirgin bir buton stili
          size="icon"
          onClick={prevSlide}
          aria-label="Önceki Slayt"
          className="bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-md shadow-lg h-12 w-12 text-black transition-transform duration-200 hover:scale-105"
        >
          <ChevronLeft size={28} />
        </Button>
      </div>
      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 z-30 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="secondary"
          size="icon"
          onClick={nextSlide}
          aria-label="Sonraki Slayt"
          className="bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-md shadow-lg h-12 w-12 text-black transition-transform duration-200 hover:scale-105"
        >
          <ChevronRight size={28} />
        </Button>
      </div>

    </div>
  );
}
