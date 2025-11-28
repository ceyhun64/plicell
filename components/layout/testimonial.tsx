"use client";
import React, { useEffect, useRef } from "react";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role?: string;
  message: string;
  avatarLetter: string;
  rating: number;
}

const sampleTestimonials: Testimonial[] = [
  {
    name: "Ayşe K.",
    role: "Ev Dekorasyonu",
    message:
      "Moda Perde’den aldığım stor perde tam istediğim gibi! Hızlı kargo ve kaliteli ürün. Ölçüler de mükemmeldi.",
    avatarLetter: "A",
    rating: 5,
  },
  {
    name: "Mehmet T.",
    role: "Salon Dekorasyonu",
    message:
      "Fon perdeler çok güzel ve kaliteli. Salonumun havasını tamamen değiştirdi. Çok memnun kaldım, teşekkürler!",
    avatarLetter: "M",
    rating: 5,
  },
  {
    name: "Elif Y.",
    role: "Yatak Odası",
    message:
      "Harika hizmet! Ölçüm ve kurulum çok kolaydı. Gelen montaj videosu işimizi çok rahatlattı.",
    avatarLetter: "E",
    rating: 5,
  },
  {
    name: "Canan D.",
    role: "Mutfak",
    message:
      "Zebra perdeler çok pratik. Fiyat-performans harika, teslimat hızlı ve paketleme özenliydi.",
    avatarLetter: "C",
    rating: 5,
  },
  {
    name: "Burak Ş.",
    role: "Ofis",
    message:
      "Dikey perdeler ofisimize mükemmel uydu. Kurulumu kendimiz yaptık, sonucundan çok memnunuz. Kalite beklentimizin üstünde.",
    avatarLetter: "B",
    rating: 5,
  },
  {
    name: "Zeynep E.",
    role: "Çocuk Odası",
    message:
      "Karartma (Blackout) perdesi sayesinde çocuğum gündüzleri rahat uyuyor. Kumaş dokusu çok yumuşak ve rengi canlı.",
    avatarLetter: "Z",
    rating: 5,
  },
  {
    name: "Hakan F.",
    role: "Misafir Odası",
    message:
      "Tül perde modelini çok beğendik. Kargolama sürecinde bile destek ekibi çok yardımcı oldu. Ürün kalitesi mükemmel.",
    avatarLetter: "H",
    rating: 5,
  },
  {
    name: "Deniz G.",
    role: "Balkon Kapatma",
    message:
      "Plise perdeler cam balkonuma birebir uyum sağladı. Montajı çok kısa sürdü. Ürünler gayet sağlam ve kaliteli görünüyor.",
    avatarLetter: "D",
    rating: 5,
  },
  {
    name: "Serpil P.",
    role: "Ebeveyn Yatak Odası",
    message:
      "Perdelerimi online alırken tereddüt etmiştim ama kumaş numuneleri çok yardımcı oldu. Sonuç mükemmel, tam istediğim ton ve kalitede.",
    avatarLetter: "S",
    rating: 5,
  },
  {
    name: "Furkan U.",
    role: "Giriş Kapısı",
    message:
      "Sipariş verdiğim güpürlü tül perde elime 2 günde ulaştı. Paketleme özenliydi. Çok hızlı ve kaliteli bir alışveriş oldu.",
    avatarLetter: "F",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 1; // hızı buradan artırabilirsin

    const interval = setInterval(() => {
      if (!scrollContainer) return;
      scrollContainer.scrollLeft += scrollSpeed;

      // Sonsuz döngü
      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth - 1
      ) {
        scrollContainer.scrollLeft = 0;
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-24 bg-gradient-to-b from-white via-[#7B0323]/5 to-white relative overflow-hidden">
      {/* Arkaplan Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#7B0323]/20 blur-[160px]"></div>
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-amber-400/20 blur-[180px]"></div>
      </div>

      <div className="relative max-w-8xl mx-auto px-6">
        <h2 className="text-center text-3xl md:text-5xl font-semibold  text-gray-900 tracking-tight drop-shadow-sm mb-3 font-serif">
          Sizden Gelenler
        </h2>
        <p className="text-sm md:text-lg text-center text-gray-600 mb-14 font-sans">
          Gerçek kullanıcı deneyimlerine göz atın.
        </p>

        {/* Auto Scroll Container */}
        <div
          ref={scrollRef}
          // Mobil cihazlarda daha küçük kartlar ve daha az boşluk: gap-6
          className="flex gap-6 overflow-x-scroll no-scrollbar pb-6"
        >
          {/* Yorum listesi sonsuz döngü için iki kez kopyalanır */}
          {sampleTestimonials.concat(sampleTestimonials).map((t, index) => (
            <div
              key={index}
              // YENİ KART GENİŞLİĞİ: w-64 (256px) - Daha kompakt
              // p-4 (daha az dolgu) ve text-sm (daha küçük yazı) mobil için denenebilir.
              className="flex-shrink-0 w-64 sm:w-72 md:w-[28rem] bg-white/70 backdrop-blur-xl border border-white/40 rounded-xs p-6 relative transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:-rotate-[0.4deg]"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3 text-yellow-400">
                {" "}
                {/* Yıldızlar arası boşluk küçültüldü */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18} // Yıldız boyutu küçültüldü
                    className={
                      i < t.rating ? "fill-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
              </div>

              <p className="text-gray-700 text-base leading-relaxed mb-4 italic">
                {" "}
                {/* Font boyutu küçültüldü: text-base */}"{t.message}"
              </p>

              <div className="flex items-center mt-5 pt-3 border-t border-gray-200/60">
                {" "}
                {/* Üst dolgular azaltıldı */}
                {/* AVATAR BOYUTU KÜÇÜLTÜLDÜ: w-12 h-12 */}
                <div className="w-12 h-12 bg-[#7B0323]/10 text-[#7B0323] rounded-full flex items-center justify-center font-bold text-lg ring-2 ring-[#7B0323]/30">
                  {" "}
                  {/* Font boyutu da küçültüldü */}
                  {t.avatarLetter}
                </div>
                <div className="ml-3">
                  {" "}
                  {/* Sol boşluk küçültüldü */}
                  <p className="font-bold text-gray-900 text-base">
                    {t.name}
                  </p>{" "}
                  {/* Font boyutu küçültüldü */}
                  <p className="text-gray-500 text-xs">{t.role}</p>{" "}
                  {/* Font boyutu küçültüldü */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar Hide Style */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
