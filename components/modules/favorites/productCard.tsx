"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useFavorite } from "@/contexts/favoriteContext";

interface ProductData {
  id: number;
  title: string;
  pricePerM2: number;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  room?: string;
}

interface ProductCardProps {
  id: number;
  onRemove?: (productId: number) => void; // opsiyonel, Favorites sayfası için
}

const roomColors: Record<string, string> = {
  Salon: "bg-gray-500",
  "Çocuk Odası": "bg-pink-500",
  Mutfak: "bg-green-500",
  "Yatak Odası": "bg-purple-500",
  "Oturma Odası": "bg-orange-500",
  Banyo: "bg-cyan-500",
  Tümü: "bg-blue-500",
};

export default function ProductCard({ id, onRemove }: ProductCardProps) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const imageRef = useRef<HTMLDivElement>(null);

  // Favorite context
  const { favorites, addFavorite, removeFavorite, isFavorited } = useFavorite();
  const favorited = isFavorited(id);

  // Ürünü çek
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) return;
        const data: { product: ProductData } = await res.json();
        setProduct(data.product);
        setCurrentImage(data.product.mainImage);
      } catch (err) {
        console.error("Ürün çekme hatası:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorited) {
      removeFavorite(id);
      if (onRemove) onRemove(id);
    } else {
      addFavorite(id);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !product) return;
    const { top, height } = imageRef.current.getBoundingClientRect();
    const relativeY = event.clientY - top;

    const segment1 = height * 0.33;
    const segment2 = height * 0.66;
    let nextImage = product.mainImage;

    if (relativeY < segment1) nextImage = product.subImage || product.mainImage;
    else if (relativeY < segment2)
      nextImage = product.subImage2 || product.mainImage;
    else nextImage = product.subImage3 || product.mainImage;

    if (nextImage !== currentImage) setCurrentImage(nextImage);
  };

  const handleMouseLeave = () => {
    if (product) setCurrentImage(product.mainImage);
  };

  if (!product) return null;

  return (
    <Card className="p-0 m-0 rounded-xs overflow-hidden hover:shadow-2xl transition-shadow duration-500 w-full relative">
      <Link href={`/products/${product.id}`}>
        <CardContent className="flex flex-col p-0 m-0 relative">
          {product.room && (
            <span
              className={`absolute top-1 right-1 md:top-3 md:right-3 text-white text-xs font-extralight px-2 py-1 rounded-xs shadow-md z-2 ${
                roomColors[product.room] || "bg-gray-500"
              }`}
            >
              {product.room}
            </span>
          )}

          <div
            ref={imageRef}
            className="relative w-full aspect-square cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={currentImage}
              alt={product.title}
              width={350}
              height={350}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="p-4 relative">
            <p className="text-xs md:text-sm font-medium text-gray-900 transition-colors group-hover:text-red-600">
              {product.title}
            </p>
            <p className="text-gray-600 text-xs md:text-sm">
              {product.pricePerM2}₺ / m²
            </p>

            <button
              className="absolute top-4 right-2 p-1 rounded-full bg-white hover:bg-red-50 transition"
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-4 w-4 transition-colors duration-300 ${
                  favorited ? "text-red-500" : "text-gray-300"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
