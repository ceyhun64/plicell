"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// heroes verisi (Değişiklik yok)
const heroes = [
  {
    id: 1,
    title: "Lazer Kesim Stor Sanatsal Işık",
    description:
      "Modern bir dokunuşla ışık oyunları yaratın. Eşsiz desenleriyle mekanınıza derinlik katan stor perdeler.",
    image: "/heroes/102.webp",
    buttonText: "Lazer Kesim Storları Keşfet",
    href: "/products/roller/laser-cut",
  },
  // {
  //   id: 2,
  //   title: "Doğal Ahşap Jaluzi",
  //   description:
  //     "Sıcak bir atmosfer ve mükemmel ışık kontrolü. Evinizin karakterini doğal ahşap dokusuyla güçlendirin.",
  //   image: "/heroes/110.webp",
  //   buttonText: "Ahşap Jaluzileri Gör",
  //   href: "/products/wooden",
  // },
  // {
  //   id: 3,
  //   title: "Zebra Perde: İkisi Bir Arada",
  //   description:
  //     "Şeffaf ve opak bantlarıyla gün ışığını dilediğiniz gibi ayarlayın. Pratik ve modern bir çözüm!",
  //   image: "/heroes/111.webp",
  //   buttonText: "Zebra Perde Modelleri",
  //   href: "/products/zebra",
  // },
  // {
  //   id: 4,
  //   title: "Minimalist Plise Perdeler",
  //   description:
  //     "Katlanabilir, zarif yapısıyla hem cam üstü hem de tavan uygulamalarına uygun, minimalist tasarım.",
  //   image: "/heroes/112.webp",
  //   buttonText: "Plise Çözümlerini İncele",
  //   href: "/products/plicell",
  // },
  // {
  //   id: 5,
  //   title: "Rüstik: Otantik Dokunuşlar",
  //   description:
  //     "Evinize otantik ve bohem bir hava katın. Klasik görünümü en yeni kumaş teknolojisiyle birleştirin.",
  //   image: "/heroes/116.webp",
  //   buttonText: "Rüstik Perdeleri Gör",
  //   href: "/products/rustic",
  // },
  // {
  //   id: 6,
  //   title: "Dikey Perdeler: Büyük Cam Çözümü",
  //   description:
  //     "Geniş cam yüzeylerde şık bir çözüm. 180 derece dönebilen dikey panellerle ışığı kusursuz yönetin.",
  //   image: "/heroes/123.webp",
  //   buttonText: "Dikey Perde Çeşitleri",
  //   href: "/products/vertical",
  // },
  // {
  //   id: 7,
  //   title: "Fon Perdeler: Mekana Derinlik",
  //   description:
  //     "Tül perdelerinizle mükemmel uyum sağlayacak, renk ve doku zenginliği sunan dekoratif çözümler.",
  //   image: "/heroes/124.webp",
  //   buttonText: "Fon Perde Koleksiyonu",
  //   href: "/products/drapes",
  // },
  // {
  //   id: 8,
  //   title: "Metal Jaluzi: Keskin Çizgiler",
  //   description:
  //     "Minimalist ve endüstriyel tasarımlar için ideal. Dayanıklı yapısıyla net ve kontrollü ışık sağlar.",
  //   image: "/heroes/128.webp",
  //   buttonText: "Metal Jaluzileri Keşfet",
  //   href: "/products/metal",
  // },
  // {
  //   id: 9,
  //   title: "Klasik Stor Perdeler",
  //   description:
  //     "Mekanınızda temiz, düz bir görünüm isteyenler için. Yüzlerce renk ve kumaş seçeneği tek bir yerde.",
  //   image: "/heroes/134.webp",
  //   buttonText: "Tüm Stor Perdeler",
  //   href: "/products/roller",
  // },
  // {
  //   id: 10,
  //   title: "Zarif Tül Perde Modelleri",
  //   description:
  //     "Güneş ışığını filtreleyerek odaya davet eden, ince ve zarif dokularla huzurlu bir atmosfer yaratın.",
  //   image: "/heroes/135.webp",
  //   buttonText: "Tül Perde Modelleri",
  //   href: "/products/sheer",
  // },
  // {
  //   id: 11,
  //   title: "Perde Aksesuarları",
  //   description:
  //     "Perdelerinizin ömrünü uzatan ve kullanım konforunu artıran kaliteli montaj ve dekorasyon ürünleri.",
  //   image: "/heroes/136.webp",
  //   buttonText: "Aksesuarları Gör",
  //   href: "/products/accessories",
  // },
  // {
  //   id: 12,
  //   title: "Tüm Perde Çeşitleri",
  //   description:
  //     "Klasikten moderne, fon perdeden jaluziye kadar tüm perde koleksiyonlarımızı bu sayfada keşfedin.",
  //   image: "/heroes/140.webp",
  //   buttonText: "Tüm Perdeleri Gör",
  //   href: "/products",
  // },
  // {
  //   id: 13,
  //   title: "Soft Işık Dağılımı (Tül)",
  //   description:
  //     "İç mekânlarınızı daha yumuşak ve dengeli bir aydınlığa kavuşturan tül perde çeşitleri.",
  //   image: "/heroes/144.webp",
  //   buttonText: "Tül Perdeleri Gör",
  //   href: "/products/sheer",
  // },
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
              quality={100}
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
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-left drop-shadow-xl  break-words">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-lg mt-3 sm:mt-5 font-light opacity-95 drop-shadow-md break-words">
                {slide.description}
              </p>

              <Button
                asChild
                className="mt-6 bg-[#7B0323] hover:bg-[#A30530] text-white  px-6 sm:px-10 rounded-full text-sm sm:text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span>{slide.buttonText}</span>
              </Button>
            </Link>
          </div>
        );
      })}

      {/* Navigasyon Düğmeleri */}
      <div className="absolute top-2/5 md:top-1/2 left-3 transform -translate-y-1/2 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300 ">
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
      <div className="absolute top-2/5 md:top-1/2 right-3 transform -translate-y-1/2 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
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
