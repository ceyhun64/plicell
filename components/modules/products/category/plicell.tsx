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
        const res = await fetch("/api/products/category/10");
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
      <div className="relative w-full h-40 md:h-60 mb-0 md:mb-6 overflow-hidden rounded-xs">
        <Image
          src="/categoryBanners/plicell.jpg"
          alt="Plicell Perde Banner"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-12 max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-white drop-shadow-xl">
            Plise Perde
          </h1>
        </div>
      </div>

      <div className="bg-gradient-to-b from-white via-amber-950/10 to-white px-1 md:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="hidden md:block md:w-64 flex-shrink-0">
            <Filter
              selectedCategory="vertical"
              selectedSubCategory={null}
              onSelectCategory={() => {}}
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

            <div className="mt-4 md:mt-6">
              {filteredProducts.length > 0 ? (
                <div
                  className={cn(
                    "grid gap-6 font-sans",
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
