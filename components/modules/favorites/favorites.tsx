"use client";

import React from "react";
import ProductCard from "./productCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/contexts/favoriteContext";

export default function Favorites() {
  const { favorites, removeFavorite, loading } = useFavorite();

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
    <div className="max-w-7xl mx-auto px-2 md:px-20 py-8 md:py-16 mb-12">
      {/* Başlık yalnızca favori varsa */}
      {!loading && favorites.length > 0 && (
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
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 space-y-4 text-gray-500">
          <Heart className="h-12 w-12 text-gray-400 animate-bounce" />
          <p className="text-lg font-semibold">Henüz favori ürün eklemediniz</p>
          <p className="text-sm text-gray-400 text-center px-4">
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 font-sans">
          {favorites
            .filter((productId) => productId != null) // null veya undefined olanları at
            .map((productId) => (
              <ProductCard
                key={productId}
                id={productId}
                onRemove={removeFavorite}
              />
            ))}
        </div>
      )}
    </div>
  );
}
