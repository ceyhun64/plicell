"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "../products/productCard";

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

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-950/20 to-white text-gray-900 font-sans flex flex-col items-center justify-center px-2 py-12 lg:p-16">
      <div className="container mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        {/* Sol metin ve buton */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:sticky top-30 self-start max-w-md">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 font-[Playfair_Display]">
            Şık ve Modern Perdeler
          </h2>
          <p className='text-sm md:text-xl text-gray-700 mb-8 max-w-lg font-["Mozilla_Headline"]'>
            Evinizin her odasına uygun perde koleksiyonumuzu keşfedin. Fon, tül,
            blackout ve stor perdelerle mekanlarınızı daha şık ve konforlu hâle
            getirin. Yüksek kaliteli kumaşlar ve modern tasarımlar sayesinde
            evinizin dekorasyonunu tamamlayabilir, ışık kontrolünü ve
            mahremiyeti kolayca sağlayabilirsiniz. Farklı renk ve desen
            seçenekleriyle her zevke uygun seçenekler sunuyoruz.
          </p>

          <Link href={"/products"}>
            <Button className="rounded-full" size="lg" variant="outline">
              Tüm Koleksiyonu Gör
            </Button>
          </Link>
        </div>

        {/* Ürün kartları */}
        <div className="flex-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
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
