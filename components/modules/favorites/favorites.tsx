"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Favorite {
  id: number;
  productId: number;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const checkLoginAndFetch = async () => {
      try {
        const favRes = await fetch("/api/favorites", {
          method: "GET",
          credentials: "include",
        });

        if (favRes.status === 401) {
          setIsLoggedIn(false);
        } else if (favRes.ok) {
          setIsLoggedIn(true);
          const favData: Favorite[] = await favRes.json();
          setFavorites(favData);
        } else {
          throw new Error(`Favori API hatası: ${favRes.status}`);
        }
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    checkLoginAndFetch();
  }, []);

  const handleRemove = (productId: number) => {
    setFavorites((prev) => prev.filter((f) => f.productId !== productId));
  };

  const handleLoginButtonClick = () => setIsLoginModalOpen(true);

  const FavoriteSkeleton = () => (
    <div className="flex flex-col gap-3 rounded-xs border border-gray-200 shadow-md p-3">
      <Skeleton className="w-full h-60 rounded-xs" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-20 py-8  md:py-16 mb-12 ">
      {isLoggedIn && favorites.length > 0 && (
        <h2 className="relative text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 font-serif">
          <span className="absolute inset-0 -z-10 bg-pink-200 rounded-lg opacity-20 blur-xl"></span>
          Favorilerim
        </h2>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <FavoriteSkeleton key={i} />
          ))}
        </div>
      ) : !isLoggedIn ? (
        <div className="flex flex-col items-center justify-center mt-16 space-y-4 text-gray-500">
          <Heart className="h-12 w-12 text-gray-400 animate-bounce" />
          <p className="text-lg font-semibold">
            Favorilere erişmek için giriş yapın
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={handleLoginButtonClick}
          >
            Giriş Yap
          </Button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 space-y-4 text-gray-500">
          <Heart className="h-12 w-12 text-gray-400 animate-bounce" />
          <p className="text-lg font-semibold">Henüz favori ürün eklemediniz</p>
          <p className="text-sm text-gray-400 text-center  px-4">
            Favorilerinize ürün eklemek için ürünleri keşfedin ve kalp ikonuna
            tıklayın.
          </p>
          <Button
            variant="outline"
            className="mt-2 rounded-full"
            onClick={() => (window.location.href = "/products")}
          >
            Ürünleri Keşfet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {favorites.map((fav) => (
            <ProductCard
              key={fav.productId}
              id={fav.productId}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
