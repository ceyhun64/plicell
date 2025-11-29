"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import ProductCard from "./productCard";
import Filter from "./filter";
import ProductTopBar from "./productTopbar";
import { cn } from "@/lib/utils";
import ProductSkeleton from "./productSkeleton";

interface ProductData {
  id: number;
  title: string;
  pricePerM2: number;
  mainImage: string;
  category: string;
  subCategory?: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  color?: string;
  room?: string;
}

const productRooms = [
  "Tümü",
  "Salon",
  "Çocuk Odası",
  "Mutfak",
  "Yatak Odası",
  "Oturma Odası",
];

export default function AllProducts() {
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [roomFilter, setRoomFilter] = useState<string>("Tümü");
  const [sort, setSort] = useState<"az" | "za" | "priceLow" | "priceHigh">(
    "az"
  );
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4>(3);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
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

  const productsWithRoom: ProductData[] = products;

  const filteredProducts = useMemo(() => {
    let filtered = productsWithRoom.filter((p) => {
      const colorCheck = colorFilter === "all" || p.color === colorFilter;
      const priceCheck = p.pricePerM2 >= minPrice && p.pricePerM2 <= maxPrice;
      const roomCheck = roomFilter === "Tümü" || p.room === roomFilter;
      return colorCheck && priceCheck && roomCheck;
    });

    switch (sort) {
      case "az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "priceLow":
        filtered.sort((a, b) => a.pricePerM2 - b.pricePerM2);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.pricePerM2 - a.pricePerM2);
        break;
    }

    return filtered;
  }, [colorFilter, minPrice, maxPrice, roomFilter, sort, productsWithRoom]);

  if (loading) {
    return <ProductSkeleton />;
  }

  const getGridClasses = (currentCols: 1 | 2 | 3 | 4) => {
    const mobileCols = currentCols === 1 ? "grid-cols-1" : "grid-cols-2";
    let desktopCols = "";
    if (currentCols === 2) {
      desktopCols = "sm:grid-cols-2";
    } else if (currentCols === 3) {
      desktopCols = "sm:grid-cols-3";
    } else if (currentCols === 4) {
      desktopCols = "sm:grid-cols-4";
    } else {
      desktopCols = "sm:grid-cols-2";
    }
    return `${mobileCols} ${desktopCols}`;
  };

  return (
    <div className="max-w-8xl mx-auto mb-20">
      {/* Ultra Modern Hero Banner */}
      <div className="relative w-full h-[60vh] md:h-[75vh] mb-8 md:mb-12 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/categories/all.webp"
            alt="Tüm Perdeler Banner"
            fill
            className="object-cover scale-100 md:scale-105 transition-transform duration-700"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-800/40 to-pink-700/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Decorative Blurs */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl hidden sm:block"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl hidden sm:block"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 max-w-3xl md:max-w-6xl mx-auto text-center md:text-left">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 justify-center md:justify-start">
            <div className="h-px w-12 bg-amber-400"></div>
            <span className="text-amber-300 text-xs sm:text-sm font-medium uppercase tracking-widest">
              ✦ Tüm Koleksiyon ✦
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 md:mb-4 leading-snug break-words">
            Tüm Perdeler
          </h1>
          <p className="text-amber-200/90 text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8">
            Her Zevke Uygun Modern ve Şık Çözümler
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-xl mx-auto md:mx-0 font-sans">
            {[
              {
                label: "Farklı Model",
                value: `${products.length}+`,
                color: "text-amber-400",
              },
              { label: "Kalite", value: "100%", color: "text-purple-400" },
              { label: "Müşteri Puanı", value: "5★", color: "text-pink-400" },
              { label: "Destek", value: "24/7", color: "text-blue-400" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center md:items-start p-4 bg-white/10 backdrop-blur-md rounded- border border-white/20 hover:scale-105 hover:shadow-lg transition-transform duration-300"
              >
                <span
                  className={`text-2xl md:text-3xl font-bold ${stat.color}`}
                >
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm text-white/70 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/60 text-xs uppercase tracking-wider">
            Keşfet
          </span>
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 md:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="hidden md:block md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Filter
                colorFilter={colorFilter}
                setColorFilter={setColorFilter}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
              />
            </div>
          </aside>

          {/* Right Side */}
          <main className="flex-1">
            <ProductTopBar
              productRooms={productRooms}
              roomFilter={roomFilter}
              setRoomFilter={setRoomFilter}
              gridCols={gridCols}
              setGridCols={setGridCols}
              sort={sort}
              setSort={setSort}
            />

            <div className="mt-0 md:mt-8 px-2 md:px-0">
              {filteredProducts.length > 0 ? (
                <div
                  className={cn(
                    "grid gap-4 md:gap-6 font-sans",
                    getGridClasses(gridCols)
                  )}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="relative p-12 md:p-20 text-center bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-purple-100 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-12 h-12 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      Ürün Bulunamadı
                    </h3>
                    <p className="text-gray-500 text-lg max-w-md mx-auto">
                      Aradığınız kriterlere uygun ürün bulunmamaktadır. Lütfen
                      filtreleri değiştirerek tekrar deneyin.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
