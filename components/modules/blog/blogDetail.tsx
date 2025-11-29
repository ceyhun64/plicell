"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Blog {
  id: number;
  title: string;
  date: string;
  content: string;
  image: string;
  // createdAt alanını BlogPage'deki gibi kullanalım
  createdAt: string;
}

export default function BlogDetailPage() {
  const searchParams = useSearchParams();
  const blogParam = searchParams?.get("blog") ?? null;

  let blog: Blog | null = null;
  if (blogParam) {
    try {
      // blog verisini güvenli bir şekilde ayrıştır
      blog = JSON.parse(blogParam);
    } catch (err) {
      console.error("Blog parametresi ayrıştırılamadı:", err);
    }
  }

  // Blog içeriği bulunamazsa veya parse edilemezse (Empty/Error State)
  if (!blog)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-amber-950/5 to-white font-sans">
        <Card className="relative p-10 rounded-xl shadow-2xl shadow-rose-200/50 border border-gray-100 max-w-xl mx-auto text-center bg-white">
          <div className="mb-6">
            <ArrowLeft className="w-16 h-16 mx-auto text-rose-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Geri Dönüş Gerekiyor
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Blog içeriği yüklenemedi veya bulunamadı. Lütfen ana blog sayfasına
            geri dönün.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-3 bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all rounded-full shadow-lg shadow-rose-600/30 text-base"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Tüm Blogları Gör
          </Link>
        </Card>
      </div>
    );

  // Normal İçerik Durumu

  // Tarihi formatlama (BlogPage'deki ile tutarlı)
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white "
    >
      {/* ---------------- HERO (Görsel ve Başlık) ---------------- */}
      <div className="relative w-full h-[400px] md:h-[550px] lg:h-[700px] overflow-hidden">
        {/* Resim */}
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes="100vw"
          priority
          className="object-cover w-full h-full brightness-[0.70]"
        />

        {/* Gradient Overlay (Rose Temalı Alt Gölge) */}
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-black/20 to-transparent" />

        {/* İçerik */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 md:pb-20 max-w-4xl mx-auto text-center">
          {/* Tarih ve Kategori Vurgusu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center text-sm font-semibold uppercase tracking-widest text-rose-300 mb-4 font-sans"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {formattedDate}
          </motion.div>

          {/* Başlık */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white font-extrabold text-4xl md:text-6xl tracking-tight leading-snug drop-shadow-lg"
          >
            {blog.title}
          </motion.h1>
        </div>

        {/* Geri Dön Butonu (Modern Konumlandırma) */}
        <Link
          href="/blog"
          className="absolute top-8 left-8 p-3 rounded-full bg-white/30 text-white backdrop-blur-sm 
                       hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-lg z-10"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* ---------------- CONTENT (İçerik) ---------------- */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-gray-800 text-lg md:text-xl leading-loose tracking-normal font-light"
        >
          {/* İçeriği paragraf ve boşluklara ayırma */}
          {blog.content.split("\n").map((line, i) =>
            line.trim() === "" ? (
              // Boş satırları daha kontrollü bir boşlukla değiştir
              <div key={i} className="h-6 md:h-8" />
            ) : (
              // Paragraflara stil uygulama
              <p
                key={i}
                className="mb-6 md:mb-8 text-gray-700 first-letter:text-4xl first-letter:font-bold first-letter:text-rose-600 first-letter:mr-1 first-letter:float-left"
              >
                {line}
              </p>
            )
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
