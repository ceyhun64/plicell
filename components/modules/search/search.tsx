"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "../products/productCard";
import { Input } from "@/components/ui/input";
import { X, Search, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/ui/spinner";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text/index";
import Image from "next/image";

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
  
    <div className="relative bg-gradient-to-b from-white via-amber-950/20 to-white">
      {/* Sticky Navbar */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200"
            : "py-5 bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-6">
          {/* Logo */}
          {!isMobile && (
            <div className="flex-shrink-0 text-center md:text-left">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-18 h-12 md:w-22 md:h-14 lg:w-26 lg:h-16">
                  <Image
                    src="/logo/logo.webp"
                    alt="Moda Perde"
                    fill
                    quality={100}
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>
          )}

          {/* Arama ve Geri Butonu */}
          <div className="flex-1 flex items-center gap-3 w-full md:w-auto px-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Ürün ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 text-base rounded-full border border-gray-200 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
                  aria-label="Aramayı temizle"
                >
                  <Trash className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => router.back()}
              className="p-3 rounded-full hover:bg-gray-100 transition shadow-sm"
              aria-label="Arama sayfasını kapat"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Ürün Grid */}
      <div className="max-w-7xl mx-auto px-2 md:px-10 mt-4 bg-gradient-to-b font-sans">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:p-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 text-lg bg-white rounded-xl border border-gray-100 shadow-md">
            Aramanıza uygun ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
