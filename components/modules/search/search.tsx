"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "../products/productCard";
import { Input } from "@/components/ui/input";
import { X, Search, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/ui/spinner";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text/indext";

interface Product {
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

export default function DefaultSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Ürünler alınamadı");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Ürün çekme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Scroll event for shadow / blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    return products.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  if (isLoading) return <Spinner />;

  return (
    <div>
      {/* Sticky Navbar */}
      <div
        className={`sticky top-0 z-20 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white/80 backdrop-blur-lg shadow-md border-b"
            : "py-5 bg-white/80"
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-10  max-w-7xl mx-auto gap-12">
          {/* Logo */}
          {!isMobile && (
            <div className="flex-shrink-0 w-full md:w-auto text-center md:text-left mb-2 md:mb-0">
              <Link
                href="/"
                className="text-2xl font-bold font-[Playfair_Display]"
              >
                <GradientText
                  className="text-xl font-serif tracking-tighter"
                  text="Moda Perde"
                  gradient="linear-gradient(90deg, #4A0217 0%, #800020 60%, #C70039 100%)"
                />
              </Link>
            </div>
          )}

          {/* Arama ve Geri Butonu */}
          <div className="flex-1 flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Ürün ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-base"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
                  aria-label="Aramayı temizle"
                >
                  <Trash className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => router.back()}
              className="p-3 rounded hover:bg-gray-200 transition"
              aria-label="Arama sayfasını kapat"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Ürün Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2 md:p-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500 text-lg bg-white rounded-xs border border-gray-100 shadow-sm">
            Aramanıza uygun ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
