"use client";

import React from "react";

export default function MeasurementSteps() {
  const measureSteps = [
    "Camın içine, doğramaya monte edilen sistemde milimetrik ölçü almak oldukça önemlidir.",
    "Camın sabit bölümünün içten içe ölçüsünü alın. Ölçü, cam contasından başlamalıdır.",
    "Eğer ölçüm açılan bir cam kanadına aitse, menteşe tarafında boşluk kalmaması için 1-2 cm daraltarak ölçü alın.",
    "Tüm cam kanatları için ayrı ayrı ölçüm alın. Her cam farklı ölçüde olabilir.",
    "Camın üst kısmından alt contasına kadar olan yüksekliği ölçün.",
  ];

  const CardItem = ({
    step,
    index,
    isLast,
  }: {
    step: string;
    index: number;
    isLast: boolean;
  }) => (
    <div className="flex flex-col items-center relative text-center sm:flex-1 group">
      <div className="relative flex flex-col items-center text-center p-6 rounded-xs border border-white/20 backdrop-blur-lg bg-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500">
        <div className="w-14 h-14 flex items-center justify-center mb-4 rounded-full bg-amber-950/40 shadow-lg text-white font-bold text-lg">
          {index + 1}
        </div>
        <p className="text-sm text-[#7B0323]/90 mt-1">{step}</p>
      </div>

      {/* Dalgalı çizgi */}
      {!isLast && (
        <>
          {/* Masaüstü yatay */}
          <div className="hidden sm:block absolute top-1/2 left-full w-16 h-4 ml-2">
            <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path
                d="M0 5 Q 25 0 50 5 T 100 5"
                stroke="#7B0323"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
          {/* Mobil dikey */}
          <div className="block sm:hidden w-4 h-16 mt-2">
            <svg className="w-full h-full" viewBox="0 0 10 100" preserveAspectRatio="none">
              <path
                d="M5 0 Q 0 25 5 50 T 5 100"
                stroke="#7B0323"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );

  return (
    <section className="max-w-8xl mx-auto px-4 py-16 bg-gradient-to-br from-amber-950/10 via-white to-amber-950/10  mb-24">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 drop-shadow-lg font-serif">
        Ölçü Nasıl Alınır?
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-16 relative px-4 sm:px-12">
        {measureSteps.map((step, idx) => (
          <CardItem
            key={idx}
            step={step}
            index={idx}
            isLast={idx === measureSteps.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
