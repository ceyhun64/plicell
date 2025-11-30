"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CartItemDropdown from "./cartItem";
import {
  getCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
  GuestCartItem,
} from "@/utils/cart";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";

interface Product {
  id: number;
  title: string;
  pricePerM2: number;
  mainImage: string;
  oldPrice?: number;
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

interface CartDropdownProps {
  showCount?: boolean;
  guest?: boolean;
}

const CartDropdown = forwardRef(
  ({ showCount = true, guest = false }: CartDropdownProps, ref) => {
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const debug = (label: string, data?: any) =>
      console.log(`[🧩 CartDropdown DEBUG] ${label}`, data ?? "");

    const checkLogin = useCallback(async (): Promise<boolean> => {
      try {
        const res = await fetch("/api/account/check", {
          method: "GET",
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

    const fetchCart = useCallback(async () => {
      debug("fetchCart() started");
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        debug("fetchCart data", data);
        setCartItems(data);
      } catch (err) {
        debug("fetchCart error", err);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const loadGuestCart = useCallback(() => {
      debug("loadGuestCart() started");
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
        debug("loadGuestCart() error", err);
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      (async () => {
        debug("Initial login + cart load");
        const logged = await checkLogin();
        if (logged && !guest) await fetchCart();
        else loadGuestCart();
      })();
    }, [checkLogin, fetchCart, loadGuestCart, guest]);

    useEffect(() => {
      if (isOpen) {
        if (isLoggedIn && !guest) fetchCart();
        else loadGuestCart();
      }
    }, [isOpen, isLoggedIn, fetchCart, loadGuestCart, guest]);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      refreshCart: () => {
        if (isLoggedIn && !guest) fetchCart();
        else loadGuestCart();
      },
    }));

    useEffect(() => {
      const handleCartUpdate = () => {
        if (isLoggedIn && !guest) fetchCart();
        else loadGuestCart();
      };
      window.addEventListener("cartUpdated", handleCartUpdate);
      return () => window.removeEventListener("cartUpdated", handleCartUpdate);
    }, [isLoggedIn, fetchCart, loadGuestCart, guest]);

    // ✅ FIX: Backend'e quantity göndermeli
    const handleQuantityChange = async (id: number, delta: number) => {
      if (!isLoggedIn) {
        // Guest cart
        updateGuestCartQuantity(id, delta);
        loadGuestCart();
        return;
      }

      // Logged-in cart
      const item = cartItems.find((c) => c.id === id);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);

      try {
        const res = await fetch(`/api/cart/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }), // ✅ quantity gönder, delta değil
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          toast.error(errorData.error || "Miktar güncellenemedi");
          return;
        }

        const updatedItem = await res.json();

        // UI'yi güncelle
        setCartItems((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, quantity: updatedItem.quantity } : c
          )
        );
      } catch (err) {
        console.error("Quantity update error:", err);
        toast.error("Miktar güncellenemedi");
      }
    };

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
        } else {
          toast.error("Ürün kaldırılamadı");
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

    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="relative"
            size="icon-sm"
            aria-label="Sepete git"
          >
            <ShoppingCart className="h-5 w-5" />
            {showCount && cartItems.length > 0 && (
              <span className="absolute -top-2 -right-1.5 h-5 w-5 rounded-full bg-[#7B0323] text-white text-xs flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="z-[2000] p-4 w-full max-w-sm h-full fixed top-0 right-0 bg-white/85 backdrop-blur-md border-l border-gray-100 flex flex-col overflow-hidden overflow-x-hidden"
        >
          {/* Header */}
          <SheetHeader className="pb-2 border-b border-gray-100 mb-2">
            <SheetTitle className="text-2xl font-bold text-gray-900">
              Sepetim
            </SheetTitle>
            <SheetDescription className="text-gray-800 text-xs">
              Ürünlerinizi kontrol edip düzenleyebilirsiniz.
            </SheetDescription>
          </SheetHeader>

          {/* İçerik */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border rounded-lg shadow-sm"
                  >
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="w-8 h-8 rounded-md" />
                  </div>
                ))}

                {/* Summary skeleton */}
                <div className="mt-4 space-y-3 border-t pt-4">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Footer skeleton */}
                <div className="space-y-2 mt-6">
                  <Skeleton className="h-10 w-full rounded-full" />
                  <Skeleton className="h-10 w-full rounded-full" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16 space-y-4 text-gray-500">
                <ShoppingCart className="h-12 w-12 text-gray-400 animate-bounce" />
                <p className="text-lg font-semibold">Sepetiniz boş</p>
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="mt-2 rounded-full"
                    aria-label="Sepete git"
                  >
                    Ürünlere Göz At
                  </Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CartItemDropdown
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                </motion.div>
              ))
            )}
          </div>

          {/* Toplamlar */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 pt-3 mt-3 mb-3 space-y-1 text-gray-800 text-sm font-sans">
              <div className="flex justify-between">
                Ara Toplam <span>₺{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                Kargo <span>₺0,00</span>
              </div>
              <div className="flex justify-between font-bold mt-1 text-gray-900">
                Genel Toplam <span>₺{subtotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <SheetFooter className="flex flex-col gap-3 pt-3 font-sans">
            <Link href="/cart">
              <Button
                aria-label="Sepete Git"
                className="w-full py-3 text-sm bg-[#7B0323] text-white rounded-full shadow-sm hover:bg-[#5E021A] transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Sepete Git
              </Button>
            </Link>
            <Link href="/checkout">
              <Button className="w-full py-3 text-sm bg-[#7B0323] text-white rounded-full shadow-sm hover:bg-[#5E021A] transition flex items-center justify-center gap-2">
                Ödemeye Geç
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <SheetClose asChild>
              <Button className="w-full bg-white py-3 text-sm text-[#7B0323] border border-[#7B0323] rounded-full hover:bg-[#FDECEF] transition flex items-center justify-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                Alışverişe Devam Et
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
);

CartDropdown.displayName = "CartDropdown";

export default CartDropdown;
