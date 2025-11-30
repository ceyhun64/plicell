"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Ruler,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MeasureModal from "./measureModal";
import DescriptionandReview from "./descriptionAndReview";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { addToGuestCart } from "@/utils/cart";
import { useFavorite } from "@/contexts/favoriteContext";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ProfileModal from "./profileModal";
import ProductDetailSkeleton from "./productDetailSkeleton";

interface ProductData {
  id: number;
  title: string;
  mainImage: string;
  subImage: string;
  subImage2?: string;
  subImage3?: string;
  description: string;
  pricePerM2: number;
  rating: number;
  reviewCount?: number;
  category: string;
  device?: string;
  subCategory?: string;
  room?: string;
  categoryId?: number;
}

const profiles = [
  { name: "ANTRASİT", src: "/profiles/antrasit.webp" },
  { name: "BEYAZ", src: "/profiles/beyaz.webp" },
  { name: "GRİ", src: "/profiles/gri.webp" },
  { name: "KAHVE", src: "/profiles/kahve.webp" },
  { name: "KREM", src: "/profiles/krem.webp" },
  { name: "SİYAH", src: "/profiles/siyah.webp" },
];

export default function ProductDetailPage() {
  const params = useParams() as { id?: string };
  const productId = Number(params.id);
  const router = useRouter();

  const cartDropdownRef = useRef<{ open: () => void; refreshCart: () => void }>(
    null
  );

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState(profiles[0].name);
  const [quantity, setQuantity] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState("vidali");
  const [en, setEn] = useState(0);
  const [boy, setBoy] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [showMeasureModal, setShowMeasureModal] = useState(false);

  const [openProfileImage, setOpenProfileImage] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<
    string | null
  >(null);
  const { isFavorited, addFavorite, removeFavorite } = useFavorite();

  const [categoryProducts, setCategoryProducts] = useState<ProductData[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Ürün bulunamadı");
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(`/api/products/category/${product.categoryId}`);
        if (!res.ok) throw new Error("Kategori ürünleri çekilemedi");
        const data = await res.json();
        setCategoryProducts(
          data.products.filter((p: ProductData) => p.id !== product.id)
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategoryProducts();
  }, [product]);

  // ✅ M² hesaplama - gerçek değer
  const calculatedM2 = useMemo(() => {
    if (!en || !boy || en <= 0 || boy <= 0) return 0;
    const m2 = (en * boy) / 10000;
    return m2;
  }, [en, boy]);

  // ✅ Fiyat hesaplama için m² - minimum 1
  const priceM2 = useMemo(() => {
    if (calculatedM2 === 0) return 0;
    return calculatedM2 < 1 ? 1 : calculatedM2;
  }, [calculatedM2]);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return priceM2 * product.pricePerM2 * quantity;
  }, [priceM2, product, quantity]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/account/check", {
          credentials: "include",
        });
        if (!res.ok) return setIsLoggedIn(false);
        const data = await res.json();
        setIsLoggedIn(!!data.user?.id);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleAddToCart = async () => {
    if (!accepted) {
      toast.error("Lütfen ölçülerinizi onaylayın.");
      return;
    }

    if (!product || en <= 0 || boy <= 0) {
      toast.error("Lütfen geçerli ölçüler girin.");
      return;
    }

    // ✅ Backend'e minimum 1 m² gönder ama en/boy değerleri orijinal kalsın
    const item = {
      productId: product.id,
      quantity,
      note: note ?? undefined,
      profile: selectedProfile,
      width: en, // ✅ Orijinal en değeri
      height: boy, // ✅ Orijinal boy değeri
      m2: priceM2, // ✅ Fiyat hesaplama için kullanılan m² (minimum 1)
      device: selectedDevice,
      title: product.title,
      pricePerM2: product.pricePerM2,
      image: product.mainImage,
    };

    if (!isLoggedIn) {
      addToGuestCart(item);
      toast.success("Ürün sepete eklendi.");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Ürün sepete eklendi! Toplam: ₺${totalPrice.toFixed(2)}`);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        cartDropdownRef.current?.open?.();
        cartDropdownRef.current?.refreshCart?.();
      } else {
        toast.error(data.error || "Sepete eklenemedi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Sepete ekleme sırasında bir hata oluştu.");
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    if (isFavorited(product.id)) {
      removeFavorite(product.id);
      toast.success("Favorilerden kaldırıldı");
    } else {
      addFavorite(product.id);
      toast.success("Favorilere eklendi");
    }
  };

  const handleQuantityChange = (delta: number) =>
    setQuantity((prev) => Math.max(1, prev + delta));

  const handleProfileClick = (profileSrc: string) => {
    setSelectedProfileImage(profileSrc);
    setOpenProfileImage(true);
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        Ürün bulunamadı.
      </div>
    );
  }

  const favorited = isFavorited(product.id);
  const images = [
    product.mainImage,
    product.subImage,
    product.subImage2,
    product.subImage3,
  ].filter(Boolean);

  return (
    <div className="bg-white min-h-screen mb-2 mt-1">
      <div className="container mx-auto px-3 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-8 mt-0 md:mt-6">
          {/* Görseller */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-4 lg:sticky lg:top-20 lg:self-start">
            {/* Thumbnails */}
            <div className="flex flex-row lg:flex-col gap-2 md:gap-3 justify-start overflow-x-auto lg:overflow-visible p-1 lg:p-0 scrollbar-none">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative w-19 h-24 md:w-33 md:h-41 border-2 rounded-xs overflow-hidden transition-all duration-300 flex-shrink-0",
                    activeIndex === i ? "border-rose-500" : "border-gray-200"
                  )}
                >
                  <Image
                    src={img!}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* Ana görsel */}
            <motion.div
              className="relative w-full min-h-[350px] sm:min-h-[420px] rounded-xs overflow-hidden cursor-zoom-in"
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
                  src={images[activeIndex] || product.mainImage}
                  alt={product.title}
                  width={700}
                  height={500}
                  style={{ width: "100%", height: "100%" }}
                  className="object-contain"
                />
              </ImageZoom>

              {/* Slide controls */}
              <div className="absolute top-1/2 left-[-2] md:left-3 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous Slide"
                  className="bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm"
                >
                  <ChevronLeft size={28} />
                </Button>
              </div>

              <div className="absolute top-1/2 right-[-2] md:right-3 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="Next Slide"
                  className="bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm"
                >
                  <ChevronRight size={28} />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Ürün Detayları */}
          <div className="flex flex-col gap-4 md:gap-6 p-2 py-5 sm:p-6 md:p-8 backdrop-blur-xl bg-gradient-to-br from-yellow-50/50 via-white/90 to-yellow-50/50 transition-all duration-300 rounded-xs shadow-md border border-rose-100">
            {/* Başlık */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-5xl font-serif font-extrabold tracking-tight leading-snug text-gray-900 drop-shadow-md">
                {product.title}
              </h1>

              <div className="flex gap-2 mt-1 flex-wrap">
                {product.category && (
                  <span className="inline-block bg-rose-100 text-rose-800 text-xs md:text-sm font-semibold px-2 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                )}
                {product.room && (
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs md:text-sm font-semibold px-2 py-1 rounded-full shadow-sm">
                    {product.room}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-gray-300/40" />

            <p className="text-gray-700 leading-relaxed text-sm md:text-base drop-shadow-sm border-l-4 border-rose-300/60 pl-3">
              {product.description}
            </p>
            <Separator className="bg-gray-300/40" />

            {categoryProducts.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                  Ürünün Diğer Renkleri
                </h2>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categoryProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/products/${p.id}`)}
                      className="relative w-20 h-24 rounded-xs cursor-pointer overflow-hidden transition-all flex-shrink-0"
                    >
                      <Image
                        src={p.mainImage}
                        alt={p.title}
                        fill
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Özelleştirme */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold text-gray-800 drop-shadow-sm border-b pb-2 border-rose-100">
                Özelleştirme Seçenekleri
              </h3>

              <section>
                <h2 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                  Profil Seçimi
                </h2>

                <div className="grid grid-cols-6 gap-2 md:gap-4 lg:flex lg:items-center lg:space-x-4 lg:overflow-x-auto lg:pb-3 lg:p-3 text-xs">
                  {profiles.map((profile) => {
                    const isActive = selectedProfile === profile.name;

                    return (
                      <div
                        key={profile.name}
                        onClick={() => {
                          setSelectedProfile(profile.name);
                          handleProfileClick(profile.src);
                        }}
                        className={`relative w-full aspect-square cursor-pointer overflow-hidden transition-all duration-300 ${
                          isActive
                            ? "ring-offset-2 scale-105 shadow-lg"
                            : "hover:ring-1 hover:ring-gray-300"
                        }`}
                      >
                        <Image
                          src={profile.src}
                          alt={profile.name}
                          width={120}
                          height={120}
                          className="object-cover w-full h-full rounded-xs"
                          unoptimized
                        />
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-rose-950/50 rounded-xs">
                            <Check
                              size={24}
                              className="text-white drop-shadow-lg"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <Separator className="bg-gray-300/40" />

              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider pb-2">
                  Aparat Seçimi
                </h3>
                <Select
                  value={selectedDevice}
                  onValueChange={(value) => setSelectedDevice(value)}
                >
                  <SelectTrigger className="h-12 rounded-full border-gray-300 shadow-md hover:border-rose-400 transition text-base">
                    <SelectValue placeholder="Aparat Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vidali">
                      Vidalı Sistem (Güçlü Montaj)
                    </SelectItem>
                    <SelectItem value="yayli">
                      Yaylı Sistem (Kolay Montaj)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </section>
            </div>

            <Separator className="bg-gray-300/40" />

            {/* Ölçü Girişi */}
            <div className="flex flex-col gap-4 p-4 bg-rose-50/70 rounded-xs shadow-inner border border-rose-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Ruler size={20} className="text-rose-700" /> Ölçülerinizi Girin
              </h3>

              <Button
                variant="outline"
                className="h-12 text-xs md:text-sm rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all"
                onClick={() => setShowMeasureModal(true)}
              >
                Ölçü Nasıl Alınır? (Detaylı Anlatım)
              </Button>

              <div className="flex gap-1 md:gap-2 mt-2 font-sans">
                <Input
                  type="number"
                  placeholder="EN (cm)"
                  value={en || ""}
                  onChange={(e) => setEn(Number(e.target.value))}
                  className="flex-1 rounded-full bg-white shadow-md text-base focus:ring-4 focus:ring-rose-400 transition border-gray-300"
                  min={1}
                />

                <Input
                  type="number"
                  placeholder="BOY (cm)"
                  value={boy || ""}
                  onChange={(e) => setBoy(Number(e.target.value))}
                  className="flex-1 rounded-full bg-white shadow-md text-base focus:ring-4 focus:ring-rose-400 transition border-gray-300"
                  min={1}
                />

                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex-1  rounded-full bg-rose-100 text-center flex items-center justify-center text-sm font-extrabold text-rose-800 border-2 border-rose-300 shadow-lg"
                >
                  <span className="text-sm md:text-base">
                    {calculatedM2 > 0 ? calculatedM2.toFixed(2) : "0.00"} m²
                    {calculatedM2 > 0 && calculatedM2 < 1 && (
                      <span className="text-xs block text-rose-600 mt-0.5">
                        (Min. 1 m² fiyatlandırılır)
                      </span>
                    )}
                  </span>
                </motion.div>
              </div>

              <Input
                placeholder="Sipariş Notu (Örn: Rengi teyit ediniz)"
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-rose-400 transition mt-1 text-sm border-gray-300"
              />

              <div className="flex items-center gap-3 mt-1 p-2 bg-rose-100/50 rounded-md">
                <Checkbox
                  id="measure_accept"
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(Boolean(v))}
                  className="border-rose-400 text-rose-700 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600 data-[state=checked]:text-white"
                />

                <label
                  htmlFor="measure_accept"
                  className="text-xs md:text-sm font-medium text-rose-800 cursor-pointer"
                >
                  Ölçülerimin doğru olduğunu{" "}
                  <span className="font-bold underline decoration-rose-500/50">
                    onaylıyorum.
                  </span>
                </label>
              </div>
            </div>

            <Separator className="bg-gray-300/40" />

            {/* Fiyat ve Aksiyonlar */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between p-5 bg-rose-50 backdrop-blur-lg rounded-xs border border-rose-200 shadow-lg ring-1 ring-inset ring-rose-500/10">
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-gray-600 uppercase">
                    Toplam Fiyat
                  </span>
                  <p className="text-3xl font-extrabold text-rose-700 drop-shadow-lg leading-none mt-1 font-sans">
                    ₺{totalPrice.toFixed(2)}
                  </p>
                  <span className="text-xs text-gray-500 mt-2 font-sans">
                    ({calculatedM2 > 0 ? calculatedM2.toFixed(2) : "0.00"} m² x{" "}
                    {quantity} adet)
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white rounded-full p-1 shadow-inner border border-gray-200">
                  <Button
                    onClick={() => handleQuantityChange(-1)}
                    className="rounded-full bg-rose-50 hover:bg-rose-100 transition w-10 h-10 text-gray-900 shadow-md p-0"
                    variant="outline"
                  >
                    <Minus size={20} />
                  </Button>

                  <span className="text-2xl font-bold text-gray-900 w-8 text-center">
                    {quantity}
                  </span>

                  <Button
                    onClick={() => handleQuantityChange(1)}
                    className="rounded-full bg-rose-700 hover:bg-rose-800 transition w-10 h-10 text-white shadow-md p-0"
                  >
                    <Plus size={20} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!accepted || en <= 0 || boy <= 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Sepete Ekle"
                  className="flex-1 bg-gradient-to-br from-[#7B0323] to-[#9F1B40] hover:from-[#7B0323]/90 hover:to-[#9F1B40]/90 text-white py-0 md:py-2 rounded-full shadow-2xl text-xl font-extrabold transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={24} />
                  Sepete Ekle
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFavoriteToggle}
                  className="h-14 w-14 rounded-full hover:bg-rose-50 transition-all flex items-center justify-center"
                >
                  <Heart
                    size={28}
                    strokeWidth={2}
                    fill={favorited ? "#7B0323" : "none"}
                    className={cn(
                      "transition-all duration-300",
                      favorited ? "text-[#7B0323] scale-110" : "text-gray-400"
                    )}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 sm:my-16" />

        <DescriptionandReview
          productId={product.id}
          productTitle={product.title}
        />
        <MeasureModal
          open={showMeasureModal}
          onClose={() => setShowMeasureModal(false)}
          onConfirm={() => toast.success("Ölçü onayı alındı.")}
          accepted={accepted}
          setAccepted={setAccepted}
        />
        <ProfileModal
          open={openProfileImage}
          image={selectedProfileImage}
          profile={selectedProfile}
          onClose={() => setOpenProfileImage(false)}
        />
      </div>
    </div>
  );
}
