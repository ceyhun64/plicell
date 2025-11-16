"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, X } from "lucide-react";
import MeasureModal from "./measureModal";
import DescriptionandReview from "./descriptionAndReview";
import { toast } from "sonner";
import products from "@/data/products.json";
import { cn } from "@/lib/utils";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  image2?: string;
  image3?: string;
  image4?: string;
  description: string;
  stock: number;
  rating: number;
  category?: string;
}

const profiles = [
  { name: "ANTRASİT", src: "/profiles/antrasit_gri.webp" },
  { name: "BEYAZ", src: "/profiles/beyaz.webp" },
  { name: "BRONZ", src: "/profiles/parlak_bronz.webp" },
  { name: "GRİ", src: "/profiles/gri.webp" },
  { name: "KAHVE", src: "/profiles/kahverengi.webp" },
  { name: "KREM", src: "/profiles/krem.webp" },
  { name: "SİYAH", src: "/profiles/siyah.webp" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const product = products.find((p: Product) => p.id === productId);

  const [mainImage, setMainImage] = useState<string>(
    product?.image || "/placeholder.png"
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMainModal, setShowMainModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(profiles[0].name);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<
    string | null
  >(null);
  const [quantity, setQuantity] = useState(1);
  const [en, setEn] = useState(0);
  const [boy, setBoy] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [acceptedMeasurement, setAcceptedMeasurement] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-xl">Ürün bulunamadı.</p>
      </div>
    );
  }

  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating % 1 >= 0.5;

  const calculatedM2 = useMemo(() => {
    const m2 = (en * boy) / 10000;
    return m2 <= 0 ? 1 : m2;
  }, [en, boy]);

  const totalPrice = useMemo(() => {
    const priceNumber = Number(product.price.replace(/[₺,]/g, ""));
    return (priceNumber * calculatedM2 * quantity).toFixed(2);
  }, [product, calculatedM2, quantity]);

  const handleAddToCart = () => {
    if (!acceptedMeasurement) {
      toast.error("Lütfen ölçülerinizi onaylayın.");
      return;
    }
    toast.success(`Ürün sepete eklendi! Toplam: ₺${totalPrice}`);
  };

  const handleProfileClick = (profileSrc: string) => {
    setSelectedProfileImage(profileSrc);
    setOpenProfileModal(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 mt-4">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
          {/* Görseller */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4">
              {[product.image, product.image2, product.image3, product.image4]
                .filter(Boolean)
                .map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setMainImage(img!);
                      setActiveIndex(i);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-30 border overflow-hidden rounded-none transition-transform ${
                      mainImage === img ? "ring-2 ring-green-500" : ""
                    }`}
                  >
                    <Image
                      src={img!}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
            </div>
            {/* Ana görsel */}
            <motion.div
              className="relative w-full rounded-none overflow-hidden cursor-zoom-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: "600px" }}
            >
              <ImageZoom // **Burada ImageZoom'u sarmalayıcı olarak kullanıyoruz.**
                backdropClassName={cn(
                  '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/60'
                )}
              >
                <Image
                  src={mainImage}
                  alt={product.name}
                  width={600}
                  height={400}
                  style={{ width: "100%", height: "auto" }}
                  className="object-contain"
                />
              </ImageZoom>
            </motion.div>
          </div>

          <div className="flex flex-col gap-8 p-6 bg-white rounded-none shadow-lg">
            {/* Ürün Başlığı & Fiyat */}
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-green-600">
                {product.price}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              {[...Array(fullStars)].map((_, i) => (
                <span
                  key={i}
                  className="text-yellow-500 text-2xl drop-shadow-md"
                >
                  ★
                </span>
              ))}
              {halfStar && (
                <span className="text-yellow-500 text-2xl drop-shadow-md">
                  ☆
                </span>
              )}
              {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
                <span key={i} className="text-gray-300 text-2xl">
                  ★
                </span>
              ))}
              <span className="ml-2 text-gray-500 text-sm">
                {product.rating.toFixed(1)} / 5
              </span>
            </div>

            {/* Stok */}
            <p className="text-gray-700 text-lg">
              <span className="font-semibold">Stok:</span>{" "}
              {product.stock > 0 ? `${product.stock} adet` : "Stokta yok"}
            </p>

            {/* Açıklama */}
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Ürün Detayları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm border-t border-b py-6">
              <div>
                <span className="font-semibold">Boyut:</span> 150x200 cm
              </div>
              <div>
                <span className="font-semibold">Malzeme:</span> Polyester
              </div>
              <div>
                <span className="font-semibold">Renk:</span> Gri
              </div>
              <div>
                <span className="font-semibold">Model:</span> Modern
              </div>
              <div>
                <span className="font-semibold">Ağırlık:</span> 1.5 kg
              </div>
              <div>
                <span className="font-semibold">Teslimat:</span> 2-4 gün
              </div>
            </div>

            {/* Ölçü ve Profil */}
            <div className="flex flex-col gap-4">
              {/* Ölçü Girdileri */}
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="EN (cm)"
                  value={en}
                  onChange={(e) => setEn(Number(e.target.value))}
                  className="flex-1 rounded-xl border-gray-300 shadow-md focus:ring-2 focus:ring-green-400 transition"
                />
                <Input
                  type="number"
                  placeholder="BOY (cm)"
                  value={boy}
                  onChange={(e) => setBoy(Number(e.target.value))}
                  className="flex-1 rounded-xl border-gray-300 shadow-md focus:ring-2 focus:ring-green-400 transition"
                />
                <Input
                  readOnly
                  value={`${calculatedM2} m²`}
                  className="flex-1 rounded-xl bg-gray-100 text-center shadow-inner"
                />
              </div>

              {/* Profiller */}
              <div className="grid grid-cols-4 gap-4">
                {profiles.map((profile) => (
                  <div
                    key={profile.name}
                    onClick={() => handleProfileClick(profile.src)}
                    className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 shadow hover:scale-105 hover:shadow-lg ${
                      selectedProfile === profile.name
                        ? "ring-2 ring-blue-600 shadow-xl scale-105"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={profile.src}
                      alt={profile.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Not & Miktar */}
              <Input
                placeholder="Not (opsiyonel)"
                value={note ?? ""}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-xl border-gray-300 shadow-md focus:ring-2 focus:ring-green-400 transition"
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-full bg-gray-200 hover:bg-gray-300 transition w-12 h-12 text-xl"
                >
                  –
                </Button>
                <span className="text-xl font-semibold">{quantity}</span>
                <Button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="rounded-full bg-gray-200 hover:bg-gray-300 transition w-12 h-12 text-xl"
                >
                  +
                </Button>
              </div>

              {/* Ölçü Onayı */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={acceptedMeasurement}
                  onCheckedChange={(val) =>
                    setAcceptedMeasurement(Boolean(val))
                  }
                />
                <span className="text-sm font-medium text-gray-600">
                  Ölçülerimi onaylıyorum
                </span>
              </div>
            </div>

            {/* Sepet & Favori */}
            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl shadow-lg text-lg font-semibold transition transform hover:scale-105"
              >
                Sepete Ekle
              </Button>
              <Button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition transform hover:scale-105 flex justify-center items-center"
              >
                <Heart fill={isFavorite ? "red" : "none"} size={28} />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <DescriptionandReview
          productId={product.id}
          productTitle={product.name}
        />
      </div>

      {/* Profil modal */}
      {openProfileModal && selectedProfileImage && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"
          onClick={() => setOpenProfileModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden w-96 h-96"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenProfileModal(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-1"
            >
              <X size={24} />
            </button>
            <Image
              src={selectedProfileImage}
              alt="Profil"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <MeasureModal open={false} onClose={() => {}} onConfirm={() => {}} />
    </div>
  );
}
