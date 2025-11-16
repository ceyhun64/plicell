"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, X, ShoppingCart, Minus, Plus } from "lucide-react";
import MeasureModal from "./measureModal";
import DescriptionandReview from "./descriptionAndReview";
import { toast } from "sonner";
import products from "@/data/products.json";
import { cn } from "@/lib/utils";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";

// Interface ve Profiles kısmı değişmedi

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
  const product = (products as Product[]).find((p) => p.id === productId);

  const [mainImage, setMainImage] = useState<string>(
    product?.image || "/placeholder.png"
  );
  const [activeIndex, setActiveIndex] = useState(0);
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
    return Math.max(0.01, m2);
  }, [en, boy]);

  const totalPrice = useMemo(() => {
    const priceNumber = Number(product.price.replace(/[₺,]/g, ""));
    const finalPrice = priceNumber * calculatedM2 * quantity;
    return finalPrice.toFixed(2);
  }, [product, calculatedM2, quantity]);

  const handleAddToCart = () => {
    if (!acceptedMeasurement) {
      toast.error("Lütfen ölçülerinizi onaylayın.");
      return;
    }
    if (en <= 0 || boy <= 0) {
      toast.error("Lütfen geçerli EN ve BOY ölçüleri girin.");
      return;
    }
    toast.success(`${product.name} sepete eklendi! Toplam: ₺${totalPrice}`);
  };

  const handleProfileClick = (profileSrc: string) => {
    setSelectedProfileImage(profileSrc);
    setOpenProfileModal(true);
  };

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => q + 1);

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mt-4 md:mt-6">
          {/* Görseller */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-6">
            {/* Thumbnails (Mobil: Yatay kaydırma, Küçük Boyut) */}
            <div className="flex lg:flex-col gap-2 md:gap-3 justify-center lg:justify-start overflow-x-auto lg:overflow-visible p-1 lg:p-0">
              {[product.image, product.image2, product.image3, product.image4]
                .filter(Boolean)
                .map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setMainImage(img!);
                      setActiveIndex(i);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative w-30 h-40 border-2 rounded-none overflow-hidden transition-all duration-300 flex-shrink-0",
                      mainImage === img
                        ? "border-rose-700 ring-2 ring-rose-300 shadow-md" // Şarap kırmızısı
                        : "border-gray-200 hover:border-gray-400"
                    )}
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
              className="relative w-full aspect-square md:aspect-auto rounded-none overflow-hidden  cursor-zoom-in "
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageZoom
                backdropClassName={cn(
                  '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                )}
              >
                <Image
                  src={mainImage}
                  alt={product.name}
                  width={700}
                  height={500}
                  style={{ width: "100%", height: "auto" }}
                  className="object-contain"
                />
              </ImageZoom>
            </motion.div>
          </div>

          {/* Ürün Detayları ve Aksiyonlar */}
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:p-8  rounded-none ">
            {/* Ürün Başlığı & Rating */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-lg drop-shadow-sm",
                      i < fullStars
                        ? "text-yellow-500" // Yıldızlar sarı kalabilir veya altın tonlarına çekilebilir
                        : halfStar && i === fullStars
                        ? "text-yellow-500/50"
                        : "text-gray-300"
                    )}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-gray-500 text-xs font-semibold">
                  ({product.rating.toFixed(1)} / 5)
                </span>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-bold ml-auto",
                    product.stock > 0 ? "text-rose-700" : "text-rose-500" // Şarap kırmızısı
                  )}
                >
                  {product.stock > 0
                    ? `Stokta (${product.stock} adet)`
                    : "Stokta Yok"}
                </span>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Açıklama */}
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>

            <Separator className="bg-gray-200" />

            {/* Ölçü ve Profil Seçimi */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Özelleştirme Seçenekleri
              </h3>

              {/* Profil Seçimi - Modern Görünüm */}
              <div className="flex flex-col gap-3">
                <span className="font-semibold text-gray-700 text-sm">
                  Profil Rengi: {selectedProfile}
                </span>
                <div className="flex flex-wrap gap-2">
                  {profiles.map((profile) => (
                    <motion.button
                      key={profile.name}
                      onClick={() => {
                        setSelectedProfile(profile.name);
                        handleProfileClick(profile.src);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "relative w-10 h-10 sm:w-12 sm:h-12 rounded-none overflow-hidden border-2 transition-all duration-200 shadow-md",
                        selectedProfile === profile.name
                          ? "border-rose-700 ring-4 ring-rose-300" // Şarap kırmızısı
                          : "border-gray-300 hover:border-gray-500"
                      )}
                    >
                      <Image
                        src={profile.src}
                        alt={profile.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Ölçü Girdileri */}
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  placeholder="EN (cm)"
                  value={en || ""}
                  onChange={(e) => setEn(Number(e.target.value))}
                  className="flex-1 rounded-none border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-400 transition"
                  min={1}
                />
                <Input
                  type="number"
                  placeholder="BOY (cm)"
                  value={boy || ""}
                  onChange={(e) => setBoy(Number(e.target.value))}
                  className="flex-1 rounded-none border-gray-300 shadow-sm text-sm focus:ring-2 focus:ring-blue-400 transition"
                  min={1}
                />
                <div className="flex-1 rounded-none bg-rose-100 text-center flex items-center justify-center shadow-inner text-xs font-bold text-rose-700">
                  {" "}
                  {/* Şarap kırmızısı */}
                  {calculatedM2.toFixed(2)} m²
                </div>
              </div>

              {/* Not */}
              <Input
                placeholder="Sipariş Notu (opsiyonel)"
                value={note ?? ""}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-none border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 transition mt-1 text-sm"
              />

              {/* Ölçü Onayı */}
              <div className="flex items-center gap-2 mt-1">
                <Checkbox
                  id="measurement-check"
                  checked={acceptedMeasurement}
                  onCheckedChange={(val) =>
                    setAcceptedMeasurement(Boolean(val))
                  }
                  className="w-4 h-4 border-gray-400 data-[state=checked]:bg-rose-700 data-[state=checked]:border-rose-700" // Şarap kırmızısı
                />
                <label
                  htmlFor="measurement-check"
                  className="text-xs font-medium text-gray-700 cursor-pointer"
                >
                  Ölçülerimin doğru olduğunu onaylıyorum.
                </label>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Fiyat, Miktar ve Aksiyonlar */}
            <div className="flex flex-col gap-4 mt-1">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-rose-50 rounded-none border border-rose-200">
                {" "}
                {/* Şarap kırmızısı */}
                <div className="flex flex-col">
                  <span className="text-base font-medium text-gray-600">
                    Toplam Fiyat
                  </span>
                  <p className="text-4xl sm:text-5xl font-extrabold text-rose-700">
                    {" "}
                    {/* Şarap kırmızısı */}₺{totalPrice}
                  </p>
                  <span className="text-xs text-gray-500 mt-1">
                    ({calculatedM2.toFixed(2)} m² x {quantity} adet)
                  </span>
                </div>
                {/* Miktar Kontrolü */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={decreaseQuantity}
                    className="rounded-sm bg-white/80 hover:bg-gray-300 transition w-8 h-8 sm:w-10 sm:h-10 text-gray-900 shadow-sm p-0"
                    aria-label="Miktarı Azalt"
                  >
                    <Minus size={18} />
                  </Button>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 w-6 sm:w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    onClick={increaseQuantity}
                    className="rounded-sm bg-white/80 hover:bg-gray-300 transition w-8 h-8 sm:w-10 sm:h-10 text-gray-900n shadow-sm  p-0"
                    aria-label="Miktarı Artır"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              </div>

              {/* Sepet & Favori */}
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-rose-800 hover:bg-rose-900 text-white py-3 sm:py-4 rounded-sm shadow-lg text-lg font-bold transition transform hover:scale-[1.01] flex items-center justify-center gap-2" // Şarap kırmızısı
                  disabled={!acceptedMeasurement || en <= 0 || boy <= 0}
                >
                  <ShoppingCart size={20} className="mr-1" /> Sepete Ekle
                </Button>
                <motion.button
                  onClick={() => setIsFavorite(!isFavorite)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-12 h-auto bg-white border-2 rounded-sm shadow-md transition flex justify-center items-center p-2",
                    isFavorite
                      ? "border-rose-700" // Şarap kırmızısı
                      : "border-gray-200 hover:border-gray-400"
                  )}
                  aria-label="Favorilere Ekle"
                >
                  <Heart
                    fill={isFavorite ? "#b91c1c" : "currentColor"} // Şarap kırmızısı HEX kodu (rose-700'e yakın)
                    className={isFavorite ? "text-rose-700" : "text-gray-700"} // Şarap kırmızısı
                    size={18}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 sm:my-16" />

        {/* Açıklama ve Yorumlar bileşeni */}
        <DescriptionandReview
          productId={product.id}
          productTitle={product.name}
        />
      </div>

      {/* Profil modal (mobil boyuta göre optimize edildi) */}
      {openProfileModal && selectedProfileImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center backdrop-blur-sm p-4"
          onClick={() => setOpenProfileModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-white rounded-none overflow-hidden w-full max-w-sm h-[350px] sm:h-[400px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenProfileModal(false)}
              className="absolute top-3 right-3 bg-white text-gray-800 rounded-full p-2 z-10 shadow-lg hover:bg-gray-100 transition"
            >
              <X size={24} />
            </button>
            <Image
              src={selectedProfileImage}
              alt="Profil Detay"
              fill
              className="object-contain p-2"
            />
          </motion.div>
        </div>
      )}

      <MeasureModal open={false} onClose={() => {}} onConfirm={() => {}} />
    </div>
  );
}
