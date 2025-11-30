"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import CartItem from "./cartItem";
import CartSummary from "./cartSummary";
import { Button } from "../../ui/button";
import { ShoppingBag } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
  GuestCartItem,
} from "@/utils/cart";

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

  const checkLogin = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/account/check", {
        credentials: "include",
      });

      if (!res.ok) {
        setIsLoggedIn(false);
        return false;
      }

      const data = await res.json();
      const logged = !!data?.user?.id;
      setIsLoggedIn(logged);
      return logged;
    } catch {
      setIsLoggedIn(false);
      return false;
    }
  }, []);

  const loadGuestCart = useCallback(() => {
    try {
      const cart = getCart();
      const guestCart = cart.map((item: GuestCartItem) => ({
        id: item.productId,
        quantity: item.quantity,
        product: {
          id: item.productId,
          title: item.title,
          pricePerM2: item.pricePerM2,
          mainImage: item.image,
          category: "Plicell",
        },
        m2: item.m2,
        width: item.width,
        height: item.height,
        profile: item.profile,
        device: item.device,
        note: item.note,
      }));
      setCartItems(guestCart);
    } catch (err) {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart", { credentials: "include" });

      if (!res.ok) throw new Error("Sepet verisi alınamadı");

      const data = await res.json();
      setCartItems(data);
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const logged = await checkLogin();
      if (logged) fetchCart();
      else loadGuestCart();
    })();
  }, [checkLogin, fetchCart, loadGuestCart]);

  // ---------- Quantity Update ----------
  const handleQuantityChange = async (id: number, delta: number) => {
    if (!isLoggedIn) {
      // GUEST CART
      updateGuestCartQuantity(id, delta);
      loadGuestCart();
      return;
    }

    // LOGGED-IN CART
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
      } else {
        toast.error(updatedItem.error || "Güncelleme başarısız");
      }
    } catch {
      toast.error("Miktar güncellenemedi");
    }
  };

  // ---------- Remove ----------
  const handleRemove = async (id: number) => {
    if (!isLoggedIn) {
      removeFromGuestCart(id);
      loadGuestCart();
      return;
    }

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((c) => c.id !== id));
        toast.success("Ürün sepetten kaldırıldı");
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 md:px-40 py-8 md:py-16 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 font-serif">
          Sepetim
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol taraf skeleton ürün listesi */}
          <div className="flex-1 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border rounded-lg shadow-sm"
              >
                <Skeleton className="w-24 h-24 rounded-md" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="w-10 h-10 rounded-md" />
              </div>
            ))}
          </div>

          {/* Sağ taraf summary skeleton */}
          <div className="w-full md:w-80 p-6 border rounded-lg shadow-md space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

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
    <div className="container mx-auto px-3 md:px-40 py-8 md:py-16 mb-12">
      {cartItems.length > 0 && (
        <h2 className="relative text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 font-serif">
          <span className="absolute inset-0 -z-10 bg-pink-200 rounded-lg opacity-20 blur-xl"></span>
          Sepetim
        </h2>
      )}

      {cartItems.length === 0 ? (
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
