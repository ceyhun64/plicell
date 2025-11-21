"use client";

import { useState, useEffect, useCallback } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "../products/productCard";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton"; 

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
}

// --- İSKELET BİLEŞENLERİ TANIMLAMA ---

const ProductCardSkeleton = () => (
  <div className="flex flex-col space-y-3 p-2">
    {/* Resim Yerine Geçen İskelet */}
    <Skeleton className="h-[250px] w-full rounded-xs md:h-[350px]" />
    {/* Başlık ve Metin Yerine Geçen İskeletler */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const CarouselSkeleton = () => {
    // Görünür olması beklenen maksimum kart sayısı (örn: xl'de 4 kart)
    const VISIBLE_SKELETON_COUNT = 4; 
    
    return (
        <div className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[550px] pt-4">
            <div className="flex gap-2 sm:gap-4 lg:gap-6 overflow-hidden">
                {/* Her bir kartı simüle eden iskelet öğeleri */}
                {Array.from({ length: VISIBLE_SKELETON_COUNT }).map((_, index) => (
                    <div 
                        key={index}
                        // Orijinal CarouselItem sınıflarını taklit ediyoruz
                        className={`
                            shrink-0 grow-0 basis-full 
                            sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 
                            p-1 h-full
                        `}
                    >
                        <ProductCardSkeleton />
                    </div>
                ))}
            </div>
            {/* Oklar ve ilerleme çubuğu için yer tutucular */}
            <Skeleton className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full z-20" />
            <Skeleton className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full z-20" />
            <div className="absolute -bottom-10 md:bottom-0 left-0 right-0 flex justify-center space-x-2 pb-4 z-10">
                <Skeleton className="h-1 w-8 rounded-full bg-gray-300" />
                <Skeleton className="h-1 w-4 rounded-full bg-gray-300" />
                <Skeleton className="h-1 w-4 rounded-full bg-gray-300" />
            </div>
        </div>
    );
};
// ------------------------------------


export default function YeniUrunlerCarousel() {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  const updateCurrent = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    setCount(api.scrollSnapList().length);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    updateCurrent();
    api.on("select", updateCurrent);
    api.on("reInit", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
      api.off("reInit", updateCurrent);
    };
  }, [api, updateCurrent]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // GECİKME KALDIRILDI
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

  // Yüklenme durumu kontrolü güncellendi
  if (loading) {
    return (
      <div className="container mx-auto px-2 lg:px-16 py-12 relative bg-gradient-to-b from-white via-amber-950/20 mb-2">
        {/* Başlık İskeleti */}
        <div className="flex justify-between items-center mb-6 px-4">
            <div>
                <Skeleton className="h-8 w-64 md:h-10 md:w-96 mb-2" />
                <Skeleton className="h-4 w-48 md:w-64" />
            </div>
        </div>
        
        {/* Karusel İskeletini Göster */}
        <CarouselSkeleton />
      </div>
    );
  }

  // Yükleme bittiğinde normal içerik gösterilir
  return (
    <div className="container mx-auto px-2 lg:px-16 py-12 relative bg-gradient-to-b from-white via-amber-950/20 mb-2">
      {/* Başlık */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-extrabold tracking-tight mb-2 text-gray-900 font-[Playfair_Display]">
            Yeni Gelenler
          </h2>
          <p className='text-xs md:text-lg text-gray-600 mb-2 max-w-lg font-["Mozilla_Headline"]'>
            En yeni ürünlerimiz burada. Yeniliklere göz atın.
          </p>
        </div>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[550px]">
        <Carousel
          opts={{ align: "start", loop: true }}
          setApi={setApi}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-1 cursor-pointer h-full"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Sol / Sağ Ok */}
          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 rounded-full p-2 shadow-md z-20" />
          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 rounded-full p-2 shadow-md z-20" />
        </Carousel>

        {/* Alt Progress Bar */}
        <div className="absolute -bottom-10 md:bottom-0 left-0 right-0 flex justify-center space-x-2 pb-4 z-10">
          {api &&
            Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api.scrollTo(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  current === index ? "bg-gray-900 w-8" : "bg-gray-300 w-4"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
}