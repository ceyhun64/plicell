// BasketSummaryCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCart, GuestCartItem } from "@/utils/cart";
import {
  ShoppingCart,
  Package,
  Edit3,
  Info,
  Receipt,
  TrendingUp,
  CheckCircle2,
  Truck,
} from "lucide-react";

// KDV Oranı
const KDV_RATE = 0.1; // %10

interface Product {
  id: number;
  title: string;
  pricePerM2: number;
  mainImage: string;
  oldPrice?: number;
}

interface BasketItem {
  id: number;
  product: Product;
  quantity: number;
  note?: string | null;
  profile?: string;
  width?: number;
  height?: number;
  device?: string;
}

interface BasketSummaryCardProps {
  basketItemsData?: BasketItem[];
  subTotal?: number;
  selectedCargoFee: number;
  totalPrice?: number;
}

export default function BasketSummaryCard({
  basketItemsData = [],
  subTotal = 0,
  selectedCargoFee,
  totalPrice = 0,
}: BasketSummaryCardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [guestItems, setGuestItems] = useState<GuestCartItem[]>([]);
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Giriş durumunu kontrol et
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("/api/account/check", { method: "GET" });
        const data = await res.json();
        setIsLoggedIn(!!data.user);
      } catch (error) {
        console.error("Oturum kontrolü başarısız:", error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  // Cart verisini yükle
  useEffect(() => {
    if (isLoggedIn === null) return;

    const fetchCart = async () => {
      if (isLoggedIn) {
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            const items: BasketItem[] = data.map((item: any, i: number) => ({
              id: i,
              product: {
                id: item.product.id,
                title: item.product.title,
                pricePerM2: item.product.pricePerM2,
                mainImage: item.product.mainImage,
                oldPrice: item.product.oldPrice,
              },
              quantity: item.quantity,
              note: item.note ?? undefined,
              profile: item.profile,
              width: item.width,
              height: item.height,
              device: item.device,
            }));
            setBasketItems(items);
            setGuestItems([]);
          } else {
            setBasketItems([]);
          }
        } catch (err) {
          console.error("Cart fetch error:", err);
          setBasketItems([]);
        }
      } else {
        const localCart = getCart();
        setGuestItems(localCart);
        setBasketItems([]);
      }
    };

    fetchCart();

    const handleCartUpdated = () => {
      fetchCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [isLoggedIn]);

  // Gösterilecek ürünleri belirle
  const itemsToRender =
    isLoggedIn && basketItems.length > 0
      ? basketItems
      : guestItems.map((item, i) => ({
          id: i,
          product: {
            id: item.productId,
            title: item.title,
            pricePerM2: item.pricePerM2,
            mainImage: item.image,
          },
          quantity: item.quantity,
          note: item.note ?? undefined,
          profile: item.profile,
          width: item.width,
          height: item.height,
          device: item.device,
        }));

  // M² hesaplama - minimum 1 m²
  const calculateArea = (width?: number, height?: number): number => {
    if (!width || !height) return 1;
    const area = (width * height) / 10000;
    return area < 1 ? 1 : area;
  };

  // Ara toplamı hesapla
  const calculatedSubTotal = itemsToRender.reduce((acc, item) => {
    const area = calculateArea(item.width, item.height);
    return acc + item.product.pricePerM2 * area * item.quantity;
  }, 0);

  // KDV'yi hesapla
  const calculatedKdv = calculatedSubTotal * KDV_RATE;

  // Toplamı hesapla
  const calculatedTotal = calculatedSubTotal + calculatedKdv;

  const getItemDetails = (item: BasketItem): string[] => {
    const details: string[] = [];
    if (item.note) details.push(`Not: "${item.note}"`);
    if (item.profile) details.push(`Profil: ${item.profile}`);
    if (item.width && item.height) {
      const realArea = (item.width * item.height) / 10000;
      const pricingArea = calculateArea(item.width, item.height);

      if (realArea < 1) {
        details.push(
          `${item.width} x ${item.height} cm (${realArea.toFixed(
            2
          )} m² → 1.00 m²)`
        );
      } else {
        details.push(
          `${item.width} x ${item.height} cm (${pricingArea.toFixed(2)} m²)`
        );
      }

      if (item.device) details.push(`Aparat: ${item.device}`);
    }
    return details;
  };

  if (isLoggedIn === null) {
    return (
      <Card className="sticky top-6">
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Sepet yükleniyor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!itemsToRender || itemsToRender.length === 0) {
    return (
      <Card className="sticky top-6">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Sepetiniz Boş</p>
              <p className="text-sm text-gray-500">
                Alışverişe başlamak için ürün ekleyin
              </p>
            </div>
            <Link href="/" className="w-full">
              <Button className="w-full">Alışverişe Başla</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedItems = isExpanded ? itemsToRender : itemsToRender.slice(0, 3);
  const hasMoreItems = itemsToRender.length > 3;

  return (
    <Card className="sticky top-6 shadow-lg border-2">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Sipariş Özeti
          </CardTitle>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              {itemsToRender.length} Ürün
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ürün Listesi */}
        <div className="space-y-3 max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {displayedItems.map((item) => {
            const product: Product = item.product;
            const details = getItemDetails(item);
            const area = calculateArea(item.width, item.height);
            const itemPrice = product.pricePerM2 * area * item.quantity;

            return (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                {/* Ürün Görseli */}
                <div className="relative w-15 h-20 bg-white rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200 group">
                  <Image
                    src={product.mainImage}
                    alt={product.title}
                    width={64}
                    height={64}
                    className="object-contain transition-transform group-hover:scale-110"
                  />
               
                </div>

                {/* Ürün Bilgileri */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                    {product.title}
                  </p>
                  {details.length > 0 && (
                    <div className="text-xs text-gray-600 space-y-0.5">
                      {details.map((detail, idx) => (
                        <p key={idx} className="line-clamp-1">
                          {detail}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fiyat */}
                <div className="text-right flex flex-col items-end justify-center">
                  <span className="text-base font-bold text-gray-900">
                    ₺{itemPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ₺{product.pricePerM2}/m²
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Daha Fazla Göster Butonu */}
        {hasMoreItems && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isExpanded
              ? "Daha Az Göster ↑"
              : `+${itemsToRender.length - 3} Ürün Daha Göster ↓`}
          </button>
        )}

        <Separator className="my-4" />

        {/* Fiyat Detayları */}
        <div className="space-y-3">
          {/* Ara Toplam */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
              <Receipt className="w-4 h-4" />
              Ara Toplam
            </span>
            <span className="text-base font-semibold text-gray-900">
              ₺{calculatedSubTotal.toFixed(2)}
            </span>
          </div>

          {/* Kargo */}
          <div className="flex justify-between items-center bg-green-50 -mx-6 px-6 py-3 border-y border-green-100">
            <span className="text-sm text-green-800 flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4" />
              Kargo Ücreti
            </span>
            <span className="text-base font-bold text-green-700">
              {selectedCargoFee === 0
                ? "ÜCRETSİZ"
                : `₺${selectedCargoFee.toFixed(2)}`}
            </span>
          </div>

          {/* KDV */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              KDV (%10)
            </span>
            <span className="text-base font-semibold text-gray-900">
              ₺{calculatedKdv.toFixed(2)}
            </span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Genel Toplam */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -mx-6 px-6 py-5 rounded-b-lg">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <p className="text-xs font-medium mb-1 opacity-90">
                Ödenecek Tutar
              </p>
              <p className="text-3xl font-bold tracking-tight">
                ₺{calculatedTotal.toFixed(2)}
              </p>
              <p className="text-xs mt-1 opacity-75">(KDV Dahil)</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-white opacity-90" />
          </div>
        </div>

        {/* Bilgilendirme */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 -mx-6 mx-6">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-800">
            <p className="font-medium mb-1">Önemli Bilgiler</p>
            <ul className="space-y-1">
              <li>• Fiyatlara KDV dahildir</li>
              <li>• Ödeme sonrası siparişiniz onaylanacaktır</li>
              <li>• Kargo ücretsizdir</li>
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 border-t">
        {/* Sepeti Düzenle */}
        <Link href="/cart" className="w-full">
          <Button
            variant="outline"
            className="w-full h-11 border-2 hover:bg-gray-50 font-medium group"
          >
            <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Sepeti Düzenle
          </Button>
        </Link>

        {/* Güvenli Ödeme Badge */}
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500 pt-2">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span>Güvenli Ödeme</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span>256-bit SSL</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span>PCI DSS</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
