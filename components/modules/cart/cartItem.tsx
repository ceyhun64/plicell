// Updated CartItem component with mobile image on the left
"use client";

import React from "react";
import { Trash2, Plus, Minus, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartItemType } from "./cart";

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const { product, quantity, note, profile, device, width, height, m2 } = item;
  const finalPrice = (product.pricePerM2 || 0) * (m2 || 1) * quantity;

  return (
    <div className="flex flex-row sm:flex-row w-full gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-xs border border-gray-100 shadow-md hover:shadow-lg transition-shadow font-sans">
      {/* Product Image */}
      <div className="relative w-24 h-30 md:w-28 md:h-32 flex-shrink-0 rounded-xs overflow-hidden">
        <Image
          src={product.mainImage}
          alt={product.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
            {product.title}
          </h3>
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Product Details */}
        <div className="mt-1 text-xs sm:text-sm text-gray-600 space-y-1">
          {note && <p className="truncate">Not: {note}</p>}
          {profile && <p className="truncate">Profil: {profile}</p>}
          {device && <p className="truncate">Aparat: {device}</p>}
          {width && height && (
            <p className="truncate">
              Ölçü: {width}cm x {height}cm (m²: {m2})
            </p>
          )}
        </div>

        {/* Quantity & Price */}
        <div className="mt-3 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden text-sm">
            <button
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40"
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900 text-sm sm:text-base">
              {quantity}
            </span>
            <button
              onClick={onIncrease}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Price & Edit */}
          <div className="flex flex-col items-start sm:items-end text-left sm:text-right text-sm sm:text-base mt-1 sm:mt-0">
            <span className="font-bold text-gray-900">
              ₺{finalPrice.toFixed(2)}
            </span>
            <Link href={`/products/${product.id}`}>
              <button className="flex items-center text-gray-500 hover:text-gray-800 mt-1 text-xs sm:text-sm transition-colors">
                <span className="mr-1">Düzenle</span>
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
