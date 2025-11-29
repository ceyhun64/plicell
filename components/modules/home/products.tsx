"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "../products/productCard";
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton bileşeni eklendi
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import { ArrowRight, Sparkles } from "lucide-react";

interface ProductData {
  id: number;
  title: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  description: string;
  pricePerM2: number;
  rating: number;
  reviewCount?: number;
  category: string;
  subCategory?: string;
  roomId?: number;
}

// Ürün kartları için bir iskelet bileşeni oluşturalım
// Bu, ProductCard'ın beklenen boyutuna benzemelidir
const ProductCardSkeleton = () => (
  <div className="flex flex-col space-y-3 p-2">
    {/* Resim Yerine Geçen İskelet */}
    <Skeleton className="h-[250px] w-full rounded-xs md:h-[350px]" />
    {/* Başlık Yerine Geçen İskelet */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export default function Products() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        console.log("data:", data);
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Ürünleri çekerken hata:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Yüklenme durumunda iskeletler gösterilir
  if (loading) {
    // Toplam 9 adet ürün kartı iskeleti göstereceğiz
    const skeletonCount = 9;

    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-amber-950/20 to-white text-gray-900 font-sans flex flex-col items-center justify-center px-2 py-12 lg:p-16">
        <div className="container mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          {/* Sol metin ve buton İskeletleri */}
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:sticky top-30 self-start max-w-md w-full">
            {/* Başlık İskeleti: Mobil cihazlarda daha kısa bir başlık uzunluğunu simüle edebiliriz */}
            <Skeleton className="h-8 w-full md:h-10 md:w-3/4 mb-4" />
            {/* Paragraf İskeletleri: Mobil cihazlarda da doğal görünüm için */}
            <div className="space-y-2 mb-8 max-w-lg w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            {/* Buton İskeleti: Mobil cihazlarda merkezlenmiş ve tam genişlikte görünebilir */}
            <div className="w-full flex justify-center lg:justify-start">
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
          </div>
          {/* Ürün kartları İskeletleri */}
          <div className="flex-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 w-full">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Yükleme bittiğinde normal içerik gösterilir
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-950/10 to-white text-gray-900 font-serif flex flex-col items-center justify-center px-2 py-12 lg:p-16">
      <div className="container mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        {/* Sol metin ve buton */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:sticky top-30 self-start max-w-md">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 font-[Playfair_Display]">
            Şık ve{" "}
            <GradientText
              text="Modern"
              gradient="linear-gradient(90deg, #B8860B 0%, #FFD700 35%, #F6E27A 60%, #B8860B 100%)"
            />{" "}
            Perdeler
          </h2>

          <p className='text-sm md:text-xl text-gray-700 mb-8 max-w-lg '>
            Evinizin her odasına uygun perde koleksiyonumuzu keşfedin. Fon, tül,
            blackout ve stor perdelerle mekanlarınızı daha şık ve konforlu hâle
            getirin. Yüksek kaliteli kumaşlar ve modern tasarımlar sayesinde
            evinizin dekorasyonunu tamamlayabilir, ışık kontrolünü ve
            mahremiyeti kolayca sağlayabilirsiniz. Farklı renk ve desen
            seçenekleriyle her zevke uygun seçenekler sunuyoruz.
          </p>

          <Link href="/products">
            <Button
              size="lg"
              className="
          group relative overflow-hidden
          rounded-full px-8 py-6 text-base font-semibold
          bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700
          text-white
          border-none
          shadow-lg shadow-amber-500/30
          hover:shadow-2xl hover:shadow-amber-500/50
          transition-all duration-500
          hover:scale-105
          active:scale-95
        "
            >
              <span className="relative z-10 flex items-center gap-2">
                Tüm Koleksiyonu Gör
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </Link>
        </div>

        {/* Ürün kartları */}
        <div className="flex-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 font-sans">
          {products.slice(0, 9).map((product, index) => (
            <div
              key={index}
              className="group cursor-pointer overflow-hidden rounded-xs hover:shadow-2xl transition-shadow duration-500 relative"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
