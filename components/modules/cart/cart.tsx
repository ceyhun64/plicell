"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import CartItem from "./cartItem";
import CartSummary from "./cartSummary";
import { Button } from "../../ui/button";
import { ShoppingBag } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  pricePerM2: number;
  mainImage: string;
  category: string;
}

export interface CartItemType {
  id: number;
  product: Product;
  quantity: number;
  note?: string | null;
  profile?: string;
  width?: number;
  height?: number;
  device?: string;
  m2?: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", { credentials: "include" });

      if (res.status === 401) {
        setIsLoggedIn(false);
        setCartItems([]);
        return;
      }

      if (!res.ok) throw new Error("Sepet verisi alınamadı");

      setIsLoggedIn(true);
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Sepet çekme hatası:", error);
      toast.error("Sepet yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (id: number, delta: number) => {
    const item = cartItems.find((c) => c.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: "include",
      });

      const updatedItem = await res.json();

      if (res.ok) {
        setCartItems((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, quantity: updatedItem.quantity } : c
          )
        );
        toast.success(`Miktar güncellendi: ${updatedItem.quantity}`);
      } else {
        toast.error(updatedItem.error || "Güncelleme başarısız");
      }
    } catch {
      toast.error("Miktar güncellenemedi");
    }
  };

  const handleRemove = async (id: number) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems((prev) => prev.filter((c) => c.id !== id));
        toast.success("Ürün sepetten kaldırıldı");
      } else {
        toast.error(data.error || "Ürün kaldırılamadı");
      }
    } catch {
      toast.error("Ürün kaldırılamadı");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.pricePerM2 || 0;
    const quantity = item.quantity || 1;
    const m2 = item.m2 || 1;
    return acc + price * quantity * m2;
  }, 0);

  if (isLoading) return <Spinner />;

  // 🔹 Boş sepet tasarımı
  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center mt-16 space-y-4 text-gray-500">
      <ShoppingBag className="h-12 w-12 text-gray-400 animate-bounce" />
      <p className="text-lg font-semibold">Sepetiniz boş</p>
      <p className="text-sm text-gray-400 text-center px-4">
        Sepetinize ürün eklemek için ürünleri keşfedin ve alışverişe başlayın.
      </p>
      <Link href="/products">
        <Button variant="outline" className="mt-2 rounded-full">
          Ürünleri Keşfet
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-3 md:px-40 py-8  md:py-16 mb-12">
      {isLoggedIn && cartItems.length > 0 && (
        <h2 className="relative text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 font-serif">
          <span className="absolute inset-0 -z-10 bg-pink-200 rounded-lg opacity-20 blur-xl"></span>
          Sepetim
        </h2>
      )}
      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center mt-16 space-y-4 text-gray-500">
          <ShoppingBag className="h-12 w-12 text-gray-400 animate-bounce" />
          <p className="text-lg font-semibold">
            Sepetinizi görmek için giriş yapın
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-2 rounded-xs">
              Giriş Yap
            </Button>
          </Link>
        </div>
      ) : cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => handleQuantityChange(item.id, 1)}
                onDecrease={() => handleQuantityChange(item.id, -1)}
                onRemove={() => handleRemove(item.id)}
              />
            ))}
          </div>

          <CartSummary subtotal={subtotal} />
        </div>
      )}
    </div>
  );
}
