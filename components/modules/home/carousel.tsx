"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroes = [
  {
    id: 1,
    title: "Modern Perdelerle Ev Dekorasyonu",
    description:
      "Evinize şıklık ve konfor katacak en yeni perde koleksiyonumuzu keşfedin.",
    image: "/heroes/2.webp",
    buttonText: "Hemen İncele",
  },
  {
    id: 2,
    title: "Fon Perde ile Zarif Dokunuşlar",
    description:
      "Odanızın havasını değiştirecek şık ve modern fon perde seçeneklerimizi görün.",
    image: "/heroes/8.webp",
    buttonText: "Fon Perdeleri Gör",
  },
  {
    id: 3,
    title: "Blackout Perdelerle Konforlu Uyku",
    description:
      "Işığı tamamen engelleyen blackout perdelerle hem estetik hem de fonksiyonel çözümler.",
    image: "/heroes/17.webp",
    buttonText: "Blackout Koleksiyonu",
  },
  {
    id: 4,
    title: "Tül ve Stor Perdelerle Ferah Mekanlar",
    description:
      "Doğal ışığı korurken dekoratif dokunuşlar sağlayan tül ve stor perdelerimizi keşfedin.",
    image: "/heroes/9.webp",
    buttonText: "Tül & Stor Perdeler",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? heroes.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === heroes.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
      {heroes.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === current
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full "
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
            quality={100}
          />
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

          {/* Text blok */}
          <div className="absolute bottom-8 left-4 sm:left-8 p-6 sm:p-12 max-w-xs sm:max-w-lg rounded-xs text-white backdrop-blur-sm bg-white/5 flex flex-col items-start">
            <h1 className="scroll-m-20 text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-left font-[Playfair_Display] drop-shadow-lg">
              {slide.title}
            </h1>
            <p className='text-sm sm:text-lg mt-3 sm:mt-5 font-["Mozilla_Headline"] drop-shadow'>
              {slide.description}
            </p>

            <Button className="cursor-pointer mt-4 bg-[#7B0323] hover:bg-[#7B0323]/70 text-white py-3 sm:py-4 px-5 sm:px-8 rounded-full text-sm sm:text-lg font-semibold shadow-lg">
              {slide.buttonText}
            </Button>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <div className="absolute top-2/3 md:top-1/2 left-[-2] md:left-3  transform -translate-y-1/2 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm"
        >
          <ChevronLeft size={28} />
        </Button>
      </div>
      <div className="absolute top-2/3 md:top-1/2 right-[-2] md:right-3 transform -translate-y-1/2 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm"
        >
          <ChevronRight size={28} />
        </Button>
      </div>
    </div>
  );
}
