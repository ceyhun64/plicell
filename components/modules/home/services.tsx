"use client";

import React from "react";
import { Truck, ArrowLeftRight, CreditCard, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { ShieldCheck, Star } from "lucide-react";
const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Güvenli ve Hızlı",
    desc: "Siparişleriniz güvenle ve hızlıca teslim edilir.",
  },
  {
    icon: Star,
    title: "Kalite Garantisi",
    desc: "Tüm ürünlerimiz yüksek kalite standartlarına sahiptir.",
  },
  {
    icon: ShieldCheck,
    title: "Profesyonel Ölçüm",
    desc: "İhtiyacınıza göre doğru ölçü ile perde tasarlanır.",
  },
  {
    icon: Star,
    title: "7/24 Destek",
    desc: "Her zaman yanınızdayız, sorularınızı cevaplıyoruz.",
  },
];
const CardItem = ({ icon: Icon, title, desc }: any) => (
    <div className="relative flex flex-col items-center text-center p-6 rounded-lg border border-white/20 backdrop-blur-md bg-white/10 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500">
      <div className="w-16 h-16 flex items-center justify-center mb-4 rounded-full bg-gradient-to-br from-amber-950/10 to-amber-950/10 shadow-inner">
        <Icon className="w-8 h-8 text-[#7B0323]" />
      </div>
      <h5 className="text-lg font-semibold text-[#7B0323] tracking-wide">
        {title}
      </h5>
      <p className="text-sm text-[#7B0323]/90 mt-1">{desc}</p>
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 pointer-events-none bg-gradient-to-r from-[#7B0323]/20 via-[#FFD700]/20 to-[#7B0323]/20 blur-3xl transition-all duration-500"></div>
    </div>
  );
export default function ShopServices() {
  return (
    <section className="bg-gradient-to-br from-amber-950/10 via-white to-amber-950/10 py-16 px-6 md:px-32">
      {/* Başlık */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 drop-shadow-lg font-serif">
          Neden Bizi Tercih Etmelisiniz?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {whyChooseUs.map((item, idx) => (
            <CardItem key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
