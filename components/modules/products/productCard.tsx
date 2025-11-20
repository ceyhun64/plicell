"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

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

interface Favorite {
  id: number;
  productId: number;
}

// Roomlara göre renk eşleme
const roomColors: Record<string, string> = {
  Salon: "bg-gray-500",
  "Çocuk Odası": "bg-pink-500",
  Mutfak: "bg-green-500",
  "Yatak Odası": "bg-purple-500",
  "Oturma Odası": "bg-orange-500",
  Banyo: "bg-cyan-500",
  Tümü: "bg-blue-500",
};

export default function ProductCard({ product }: { product: ProductData }) {
  const [currentImage, setCurrentImage] = useState(product.mainImage);
  const imageRef = useRef<HTMLDivElement>(null);
  const [favorited, setFavorited] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Component mount olduğunda API'yi çağır
    const checkUser = async () => {
      try {
        const res = await fetch("/api/account/check");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Kullanıcı kontrolü hatası:", error);
        setUser(null);
      }
    };
    checkUser();
  }, []);
  useEffect(() => {
    if (!user) return; // giriş yoksa API çağrısını atla

    const checkFavorite = async () => {
      try {
        const res = await fetch("/api/favorites", {
          credentials: "include", // cookie varsa gönder
        });
        if (!res.ok) return;
        const data: Favorite[] = await res.json();
        const fav = data.find(
          (f) => Number(f.productId) === Number(product.id)
        );
        if (fav) setFavorited(true);
      } catch (err) {
        console.error(err);
      }
    };
    checkFavorite();
  }, [product.id, user]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Favori eklemek için giriş yapmanız gerekiyor.");
      return;
    }

    try {
      if (!favorited) {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
          credentials: "include",
        });
        if (res.ok) {
          setFavorited(true);
          window.dispatchEvent(
            new CustomEvent("favoriteChanged", { detail: 1 })
          );
        }
      } else {
        const res = await fetch(`/api/favorites/${product.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setFavorited(false);
          window.dispatchEvent(
            new CustomEvent("favoriteChanged", { detail: -1 })
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { top, height } = imageRef.current.getBoundingClientRect();
    const relativeY = event.clientY - top;

    const segment1 = height * 0.33;
    const segment2 = height * 0.66;

    let nextImage = product.mainImage;

    if (relativeY >= 0 && relativeY < segment1) {
      nextImage = product.subImage || product.mainImage;
    } else if (relativeY >= segment1 && relativeY < segment2) {
      nextImage = product.subImage2 || product.mainImage;
    } else if (relativeY >= segment2 && relativeY <= height) {
      nextImage = product.subImage3 || product.mainImage;
    }

    if (nextImage !== currentImage) {
      setCurrentImage(nextImage);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(product.mainImage);
  };

  return (
    <Card className="p-0 m-0 rounded-xs overflow-hidden hover:shadow-2xl transition-shadow duration-500 w-full relative">
      <Link href={`/products/${product.id}`}>
        <CardContent className="flex flex-col p-0 m-0 relative">
          {/* ROOM BADGE */}
          {product.room && (
            <span
              className={`absolute top-1 right-1 md:top-3 md:right-3 text-white text-xs font-extralight  px-2 py-1 rounded-xs shadow-md z-2 ${
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
              onClick={toggleFavorite} // 🔹 Butona click handler eklendi
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
