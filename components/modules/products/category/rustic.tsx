"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import ProductCard from "../productCard";
import Filter from "../filter";
import ProductTopBar from "../productTopbar";
import { cn } from "@/lib/utils";
import ProductSkeleton from "../productSkeleton";

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

export default function Vertical() {
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [roomFilter, setRoomFilter] = useState<string>("Tümü");
  const [sort, setSort] = useState<"az" | "za" | "priceLow" | "priceHigh">(
    "az"
  );
  // GridCols tek bir state olarak hem mobil hem masaüstü değeri tutacak.
  // Varsayılan olarak mobil 2, masaüstü 3 ayarını yansıtması için 3 veya 2 ile başlayabiliriz.
  // Geniş ekranda daha çok ürün gösterileceği için 3 ile başlayalım.
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4>(3);
  // mobileGridCols state'i kaldırıldı.
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/category/7");
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
  console.log("products:", products);

  // room zaten API'den geliyor, ek işlem yok
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
    // Mobil (Varsayılan): Eğer currentCols 1 ise grid-cols-1, değilse grid-cols-2
    // (Çünkü mobil grid seçenekleri sadece 1 ve 2)
    const mobileCols = currentCols === 1 ? "grid-cols-1" : "grid-cols-2";

    // Tablet/Masaüstü (sm:): currentCols değerine göre
    let desktopCols = "";
    if (currentCols === 2) {
      desktopCols = "sm:grid-cols-2";
    } else if (currentCols === 3) {
      desktopCols = "sm:grid-cols-3";
    } else if (currentCols === 4) {
      desktopCols = "sm:grid-cols-4";
    } else {
      // currentCols 1 ise masaüstünde varsayılan 3 sütuna düşme davranışı sergileyebiliriz
      // ya da sadece 2'ye zorlayabiliriz. Burada 2 olarak varsayalım
      desktopCols = "sm:grid-cols-2";
    }

    return `${mobileCols} ${desktopCols}`;
  };

  return (
    <div className="max-w-8xl mx-auto mb-20">
      {/* Banner */}
      <div className="relative w-full h-[50vh] md:h-[70vh] md:mb-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/categories/rustic.webp"
            alt="Rustik Perde Banner"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Modern Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-orange-950/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-orange-800/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-12 md:pb-16 max-w-3xl md:max-w-7xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 w-fit">
            <div className="h-px w-8 sm:w-12 bg-orange-400"></div>
            <span className="text-orange-400 text-xs sm:text-sm md:text-base font-medium tracking-widest uppercase">
              Doğal Dokular
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-3 sm:mb-4 md:mb-6 tracking-tight">
            Rustik Perde
            <span className="block text-lg sm:text-xl md:text-4xl lg:text-5xl font-light text-orange-200 mt-1 sm:mt-2 md:mt-4">
              Geleneksel Şıklık
            </span>
          </h1>

          <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-full sm:max-w-2xl mb-6 sm:mb-8 leading-relaxed">
            Doğal dokular ve geleneksel estetiğin modern yorumuyla rustik perde
            koleksiyonumuzu keşfedin.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 text-white">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                {products.length}+
              </span>
              <span className="text-xs sm:text-sm md:text-base text-white/80 mt-1">
                Ürün Çeşidi
              </span>
            </div>
            <div className="w-px h-10 sm:h-16 bg-white/20"></div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                100%
              </span>
              <span className="text-xs sm:text-sm md:text-base text-white/80 mt-1">
                Kalite Garantisi
              </span>
            </div>
            <div className="w-px h-10 sm:h-16 bg-white/20"></div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                24/7
              </span>
              <span className="text-xs sm:text-sm md:text-base text-white/80 mt-1">
                Müşteri Desteği
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 sm:gap-2 animate-bounce">
          <span className="text-white/60 text-xs uppercase tracking-wider">
            Aşağı Kaydır
          </span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1 sm:p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-white via-amber-950/10 to-white md:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="hidden md:block md:w-64 flex-shrink-0">
            <Filter
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
            />
          </aside>

          {/* Right Side */}
          <main className="flex-1">
            <ProductTopBar
              productRooms={productRooms}
              roomFilter={roomFilter}
              setRoomFilter={setRoomFilter}
              // gridCols artık tek bir state
              gridCols={gridCols}
              setGridCols={setGridCols}
              sort={sort}
              setSort={setSort}
            />

            <div className="mt-4 md:mt-6 px-2 md:px-0 ">
              {filteredProducts.length > 0 ? (
                <div
                  className={cn(
                    "grid gap-2 md:gap-6 font-sans",
                    // Dinamik grid sınıfı ataması:
                    getGridClasses(gridCols)
                  )}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-500 text-lg bg-white rounded-xs border border-gray-100 shadow-sm">
                  Bu kategoride ürün bulunamadı.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
