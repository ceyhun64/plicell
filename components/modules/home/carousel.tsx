"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// heroes verisi (Değişiklik yok)
const heroes = [
  {
    id: 1, //tül
    title: "Işık Süzgeci Tül Perdeler",
    description:
      "Zarafetin ve modernliğin buluşması. Güneş ışığını yumuşak desenlerle süzerek mekanınıza sanatsal bir aydınlık katın. Ferah ve şık bir atmosfer yaratır.",
    image: "/heroes/tul.webp",
    buttonText: "Tül Serisi",
    href: "/products/roller/laser-cut",
  },
  {
    id: 2, //plise
    title: "Plise Perde İle Zarif Katmanlar",
    description:
      "Dar alanlar ve tavan montajları için ideal, katlanabilir zarif çözüm. Pencerelerde minimal bir görünüm sağlarken ışık kontrolünü en üst seviyeye çıkarın.",
    image: "/heroes/plise.webp",
    buttonText: "Tüm Plise Perdeler",
    href: "/products/rustic",
  },
  {
    id: 3, //tüm
    title: "Tüm Perde Modelleri",
    description:
      "Stor, tül, zebra, fon ve daha birçok perde modelini tek yerde inceleyin. Tüm ürün gruplarına hızlıca göz atın.",
    image: "/heroes/tum.webp",
    buttonText: "Tüm Perde Koleksiyonu",
    href: "/products",
  },
  // {
  //   id: 4, //stor
  //   title: "Karartma Stor: Tam Kontrol",
  //   description:
  //     "Yatak odaları ve sunum alanları için %100 ışık kesme performansı. Gün ışığını tamamen bloke ederek konforlu ve kesintisiz bir karanlık sağlayın.",
  //   image: "/heroes/stor.webp",
  //   buttonText: "Storları Gör",
  //   href: "/products/drapes",
  // },
  // {
  //   id: 5, //fon
  //   title: "Mekana Derinlik Kat",
  //   description:
  //     "Tül veya jaluzinizle kombinleyerek pencerenizi çerçeveleyin. Zengin renk ve kadife, keten gibi farklı dokularla odanızın ambiyansını değiştirin.",
  //   image: "/heroes/fon.webp",
  //   buttonText: "Fon Perde Koleksiyonu",
  //   href: "/products/roller",
  // },
  // {
  //   id: 6, //dikey
  //   title: "Dikey & Zebra İle Işığı Yönetin",
  //   description:
  //     "Hem tül hem de güneşlik özelliğini tek bir üründe birleştirin. Işığı tam kontrol altında tutarak modern ve dinamik bir pencere görünümü yaratın.",
  //   image: "/heroes/dikey.webp",
  //   buttonText: "Dikey Perde Modelleri",
  //   href: "/products/vertical",
  // },
];

const SLIDE_INTERVAL_MS = 6000; // Otomatik geçiş süresi (5 saniyeden 6 saniyeye çıkarıldı)

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const isMobile = useIsMobile();

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
      className="relative w-full h-[530px] sm:h-[600px] lg:h-[700px] overflow-hidden group"
      aria-roledescription="carousel"
      aria-label="Ürün Tanıtım Kaydırıcısı"
    >
      {heroes.map((slide, index) => {
        const isActive = index === current;

        return (
          <div
            key={slide.id}
            // Sadece tek bir slaytı gösterip diğerlerini gizlemek için daha temiz bir yol
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out font-serif ${
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
              quality={100}
              style={{ objectFit: "cover" }} // layout="fill" yerine modern Next.js 13+ style kullanımı
              priority={index === 0} // İlk slayt için öncelik
            />

            {/* Gradyan Kaplama */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40  to-transparent"></div>

            {/* Metin ve Buton Blok */}
            <Link
              href={slide.href}
              className="absolute bottom-0 md:bottom-6 md:left-10 p-6 sm:p-10 rounded-xs text-white backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors duration-300 flex flex-col items-start z-20 max-w-[100%] md:max-w-[550px] w-auto break-words"
              tabIndex={isActive ? 0 : -1}
              aria-label={`${slide.title} sayfasına git`}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-left drop-shadow-xl  break-words">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg mt-3 sm:mt-5 font-light opacity-95 drop-shadow-md break-words">
                {slide.description}
              </p>

              <Button
                asChild
                className="mt-6 font-sans bg-[#7B0323] hover:bg-[#A30530] text-white  px-6 sm:px-10 rounded-full text-sm sm:text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span>{slide.buttonText}</span>
              </Button>
            </Link>
          </div>
        );
      })}

      {/* Navigasyon Düğmeleri */}
      <div className="absolute top-1/2 left-1 md:left-3 transform -translate-y-1/2 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300 ">
        <Button
          variant="secondary" // Daha belirgin bir buton stili
          size="icon"
          onClick={prevSlide}
          aria-label="Önceki Slayt"
          className="bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-md shadow-lg h-10 w-10 md:h-12 md:w-12 text-black transition-transform duration-200 hover:scale-105"
        >
          <ChevronLeft size={28} />
        </Button>
      </div>
      <div className="absolute top-1/2 right-1 md:right-3 transform -translate-y-1/2 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="secondary"
          size="icon"
          onClick={nextSlide}
          aria-label="Sonraki Slayt"
          className="bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-md shadow-lg h-10 w-10 md:h-12 md:w-12 text-black transition-transform duration-200 hover:scale-105"
        >
          <ChevronRight size={28} />
        </Button>
      </div>
    </div>
  );
}
