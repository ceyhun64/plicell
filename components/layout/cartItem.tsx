"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItemType } from "./cartDropdown";

interface CartItemDropdownProps {
  item: CartItemType;
  onQuantityChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const CartItemDropdown: React.FC<CartItemDropdownProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  // ✅ Fiyat hesabına quantity'yi de dahil et
  const pricePerUnit = (item.product.pricePerM2 || 0) * (item.m2 || 1);
  const totalPrice = pricePerUnit * (item.quantity || 1);

  return (
    <div className="flex items-center justify-between p-4 bg-white/60 rounded-xs border border-gray-200 shadow-sm font-sans">
      <div className="w-20 h-20 flex-shrink-0 rounded-xs overflow-hidden bg-transparent ">
        <img
          src={item.product.mainImage}
          alt={item.product.title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1 mx-4">
        <p className="text-sm font-semibold text-gray-900">
          {item.product.title}
        </p>
        {item.width && item.height && (
          <p className="text-xs text-gray-500 mt-1">
            {item.width}x{item.height} cm
          </p>
        )}
        {/* ✅ Birim fiyat göster */}
        <p className="text-xs text-gray-500 mt-1">
          Birim: ₺{pricePerUnit.toFixed(2)}
        </p>
        {/* ✅ Toplam fiyat - quantity ile çarpılmış */}
        <p className="text-sm font-bold text-gray-800 mt-1">
          ₺{totalPrice.toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            className="w-7 h-7 text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="text-sm w-5 text-center">{item.quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="w-7 h-7 text-gray-600 border-gray-300 hover:bg-gray-100"
            onClick={() => onQuantityChange(item.id, 1)}
          >
            +
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-red-500 hover:text-red-600"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemDropdown;