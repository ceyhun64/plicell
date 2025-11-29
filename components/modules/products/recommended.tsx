"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "../products/productCard";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

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

// ----------------- Skeleton Bileşenleri -----------------
const ProductCardSkeleton = () => (
  <div className="flex flex-col space-y-3 p-2 animate-pulse">
    <Skeleton className="h-[250px] w-full rounded-md md:h-[350px]" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const CarouselSkeleton = () => {
  const SKELETON_COUNT = 4;
  return (
    <div className="relative w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[550px] pt-4">
      <div className="flex gap-2 sm:gap-4 lg:gap-6 overflow-hidden">
        {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
          <div
            key={idx}
            className={clsx(
              "shrink-0 grow-0 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 p-1 h-full"
            )}
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
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
// --------------------------------------------------------

export default function Recommended() {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  const updateCurrent = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
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
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (error) {
        console.error("Ürünleri çekerken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const slideCount = useMemo(() => api?.scrollSnapList().length || 0, [api]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-16 py-12 relative bg-gradient-to-b from-white via-amber-50/20 mb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-64 md:h-10 md:w-96 mb-2" />
            <Skeleton className="h-4 w-48 md:w-64" />
          </div>
        </div>
        <CarouselSkeleton />
      </div>
    );
  }

  return (
    <section className="container mx-auto px-3 lg:px-16 py-6 md:mt-6 relative bg-gradient-to-b from-white via-amber-50/20">
      {/* Başlık */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-gray-900 font-serif ">
            Önerilen Ürünler
          </h2>
          <p className="text-xs md:text-lg text-gray-600 mb-2 max-w-lg font-serif ">
            Bunları alan müşterilerimiz, bu ürünleri de tercih etti.
          </p>
        </div>
      </header>

      {/* Carousel */}
      <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[550px] font-sans">
        <Carousel
          opts={{ align: "start", loop: true }}
          setApi={setApi}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 p-2 cursor-pointer h-full"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 flex bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 rounded-full p-2 shadow-md z-20 transition-transform duration-300 hover:scale-110"
            aria-label="Önceki ürün"
          />
          <CarouselNext
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 flex bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 rounded-full p-2 shadow-md z-20 transition-transform duration-300 hover:scale-110"
            aria-label="Sonraki ürün"
          />
        </Carousel>

        {/* Progress Bar */}
        <div className="absolute md:bottom-1 left-0 right-0 flex justify-center space-x-2 pb-4 z-10">
          {Array.from({ length: slideCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={clsx(
                "h-1 rounded-full transition-all duration-300",
                current === idx ? "bg-gray-900 w-8" : "bg-gray-300 w-4"
              )}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
