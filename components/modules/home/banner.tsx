"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface BannerProps {
  title?: string;
  subtitle?: string;
}

export default function Banner({
  title = "BÜYÜK KAMPANYA!",
  subtitle = "Bu Hafta Açılışa Özel Tüm Perdelerde %10 İndirim",
}: BannerProps) {
  return (
    <section className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] overflow-hidden shadow-2xl mb-12">
      {/* Arka Plan */}
      <Image
        src="/categoryBanners/all.jpg"
        alt="Kampanya Banner"
        fill
        className="object-cover brightness-90"
      />

      {/* Dinamik Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/50 animate-pulse" />

      {/* İçerik - Ortalanmış */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-12 md:p-16 space-y-6">
        {/* Başlık */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl md:text-8xl font-extrabold text-white drop-shadow-2xl tracking-wide uppercase"
        >
          {title}
        </motion.h2>

        {/* Alt başlık */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg sm:text-xl md:text-2xl text-white drop-shadow-md font-medium"
        >
          {subtitle}
        </motion.p>

        {/* CTA Buton */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={() => (window.location.href = "/products")}
            className="bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white shadow-lg shadow-rose-700/50 text-lg px-8 py-6 transform transition-all hover:scale-110 rounded-full"
          >
            Fırsatı Yakala
          </Button>
        </motion.div>

        {/* Uçan baloncuk animasyonu */}
        <motion.div
          className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-rose-500/30"
          animate={{ y: [-10, -30, -10], x: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-yellow-400/20"
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
