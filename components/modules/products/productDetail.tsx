"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  X,
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
import { Spinner } from "@/components/ui/spinner";
import { addToGuestCart } from "@/utils/cart"; // en üste import et
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ProfileModal from "./profileModal";
import { Skeleton } from "@/components/ui/skeleton";

// Interface ve Profiles kısmı değişmedi

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
}

const profiles = [
  { name: "ANTRASİT", src: "/profiles/antrasit.png" },
  { name: "BEYAZ", src: "/profiles/beyaz.png" },
  // { name: "BRONZ", src: "/profiles/parlak_bronz.webp" },
  { name: "GRİ", src: "/profiles/gri.png" },
  { name: "KAHVE", src: "/profiles/kahve.png" },
  { name: "KREM", src: "/profiles/krem.png" },
  { name: "SİYAH", src: "/profiles/siyah.png" },
];

export default function ProductDetailPage() {
  const params = useParams() as { id?: string };
  const productId = Number(params.id);

  const cartDropdownRef = useRef<{ open: () => void; refreshCart: () => void }>(
    null
  );
  // ✅ Tüm state hook'ları en üstte
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

  const [categoryProducts, setCategoryProducts] = useState<ProductData[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!product) return;

    const fetchFavorite = async () => {
      try {
        const res = await fetch("/api/favorites");

        if (!res.ok) return;
        const data: { productId: number }[] = await res.json();
        const fav = data.find((f) => Number(f.productId) === product.id);
        setIsFavorite(!!fav);
      } catch (err) {
        console.error("Favori durumu çekilemedi", err);
      } finally {
        setLoadingFavorite(false);
      }
    };

    fetchFavorite();
  }, [product]);

  // ✅ API'den ürünü çek
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Ürün bulunamadı");
        const data = await res.json();
        console.log("data:", data);
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
        const res = await fetch("/api/products");
        const data = await res.json();
        console.log("data:", data);
        if (res.ok && data.products) {
          // Aynı kategorideki ürünleri filtrele
          const filtered = data.products.filter((p: ProductData) => {
            // Ana kategori eşleşmeli
            const categoryMatch =
              p.category.trim().toLowerCase() ===
              product.category.trim().toLowerCase();

            // Eğer ürünün subCategory'si varsa, onu da kontrol et
            const subCategoryMatch = product.subCategory
              ? p.subCategory?.trim().toLowerCase() ===
                product.subCategory?.trim().toLowerCase()
              : true; // alt kategori yoksa sadece ana kategori yeterli

            return categoryMatch && subCategoryMatch;
          });

          setCategoryProducts(filtered);
        }
      } catch (error) {
        console.error("Kategori ürünleri çekilemedi:", error);
      }
    };

    fetchCategoryProducts();
  }, [product]);

  const calculatedM2 = useMemo(() => {
    const m2 = (en * boy) / 10000;
    if (isNaN(m2) || m2 <= 0) return 1;
    return m2 < 1 ? 1 : m2;
  }, [en, boy]);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return calculatedM2 * product.pricePerM2 * quantity;
  }, [calculatedM2, product, quantity]);

  // ✅ Login kontrolü
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/account/check", {
          credentials: "include", // ⚡ Burayı ekle
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

    if (!product) return;

    const item = {
      productId: product.id,
      quantity,
      note: note ?? undefined, // ✅ null ise undefined yap
      profile: selectedProfile,
      width: en,
      height: boy,
      m2: calculatedM2,
      device: selectedDevice,
      title: product.title,
      pricePerM2: product.pricePerM2,
      image: product.mainImage,
    };

    // 👇 Eğer kullanıcı login değilse localStorage kullan
    if (!isLoggedIn) {
      addToGuestCart(item);
      toast.success("Ürün sepete eklendi.");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return;
    }

    // 👇 Login ise backend'e gönder
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

  const handleFavoriteToggle = async () => {
    if (!isLoggedIn) return;

    if (!product) return;
    try {
      if (!isFavorite) {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
          credentials: "include",
        });

        if (res.ok) setIsFavorite(true);
      } else {
        const res = await fetch(`/api/favorites/${product.id}`, {
          method: "DELETE",
          credentials: "include", // ⚡ Burayı ekle
        });

        if (res.ok) setIsFavorite(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChange = (delta: number) =>
    setQuantity((prev) => Math.max(1, prev + delta));

  const handleProfileClick = (profileSrc: string) => {
    setSelectedProfileImage(profileSrc);
    setOpenProfileImage(true);
  };
  console.log("product:", product);
  // ✅ Loading ve 404
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 animate-pulse">
        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left image skeleton */}
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[450px] rounded-md" />

            <div className="flex gap-3 overflow-auto">
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
              <Skeleton className="w-20 h-20 rounded-md" />
            </div>
          </div>

          {/* Right panel skeleton */}
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />

            <Skeleton className="h-32 w-full rounded-md" />

            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>

            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        Ürün bulunamadı.
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen mb-2 mt-1">
      <div className="container mx-auto px-3 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-8 mt-0 md:mt-6">
          {/* Görseller */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-4 lg:sticky lg:top-20 lg:self-start">
            {/* Thumbnails (Mobil: Yatay kaydırma, Küçük Boyut) */}
            <div className="flex flex-row lg:flex-col gap-2 md:gap-3 justify-start overflow-x-auto lg:overflow-visible p-1 lg:p-0 scrollbar-none">
              {[
                product.mainImage,
                product.subImage,
                product.subImage2,
                product.subImage3,
              ]
                .filter(Boolean)
                .map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setActiveIndex(i);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative w-19 h-24 md:w-33 md:h-41 border-2 rounded-xs overflow-hidden transition-all duration-300 flex-shrink-0"
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
                  src={
                    [
                      product.mainImage,
                      product.subImage,
                      product.subImage2,
                      product.subImage3,
                    ].filter(Boolean)[activeIndex] || product.mainImage
                  }
                  alt={product.title}
                  width={700}
                  height={500}
                  style={{ width: "100%", height: "100%" }}
                  className="object-contain"
                />
              </ImageZoom>

              {/* Önceki Slide */}
              <div className="absolute top-1/2 left-[-2] md:left-3 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === 0
                        ? [
                            product.mainImage,
                            product.subImage,
                            product.subImage2,
                            product.subImage3,
                          ].filter(Boolean).length - 1
                        : prev - 1
                    )
                  }
                  aria-label="Previous Slide"
                  className="bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm"
                >
                  <ChevronLeft size={28} />
                </Button>
              </div>

              {/* Sonraki Slide */}
              <div className="absolute top-1/2 right-[-2] md:right-3 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev ===
                      [
                        product.mainImage,
                        product.subImage,
                        product.subImage2,
                        product.subImage3,
                      ].filter(Boolean).length -
                        1
                        ? 0
                        : prev + 1
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
          {/* Ürün Detayları ve Aksiyonlar */}
          <div className=" flex flex-col gap-4 md:gap-6 p-2 py-5 sm:p-6 md:p-8 backdrop-blur-xl bg-gradient-to-br from-rose-50/70 via-white/90 to-rose-50/70 transition-all duration-300 rounded-xs shadow-md border border-rose-100">
            {/* Ürün Başlığı */}
            {/* Ürün Başlığı */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-5xl font-serif font-extrabold tracking-tight leading-snug text-gray-900 drop-shadow-md">
                {product.title}
              </h1>

              {/* ✅ Category & Room Badges */}
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

            {/* Açıklama */}
            <p className="text-gray-700 leading-relaxed text-sm  md:text-base drop-shadow-sm border-l-4 border-rose-300/60 pl-3">
              {product.description}
            </p>

            <Separator className="bg-gray-300/40" />

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
                          handleProfileClick(profile.src); // Modal açma
                        }}
                        className={`
            relative w-full aspect-square cursor-pointer overflow-hidden transition-all duration-300
            ${
              isActive
                ? " ring-offset-2 scale-105 shadow-lg"
                : "hover:ring-1 hover:ring-gray-300"
            }
          `}
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

              {/* ⚙️ Aparat Seçimi - DAHA NET BAŞLIK */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider  pb-2">
                  Aparat Seçimi
                </h3>
                <Select
                  value={selectedDevice}
                  onValueChange={(value) => console.log(value)} // setSelectedDevice
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

            {/* 📐 Ölçü Girişi ve Hesaplama */}
            <div className="flex flex-col gap-4 p-4 bg-rose-50/70 rounded-xs shadow-inner border border-rose-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Ruler size={20} className="text-rose-700" /> Ölçülerinizi Girin
              </h3>

              {/* Ölçü Nasıl Alınır Butonu */}
              <Button
                variant="outline"
                className="h-12 rounded-xl text-gray-800 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all"
                onClick={() => setShowMeasureModal(true)}
              >
                Ölçü Nasıl Alınır?
              </Button>

              {/* Ölçü Inputları ve M² */}
              <div className="flex gap-1 md:gap-2 mt-2">
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
                  className="flex-1 rounded-full bg-rose-100 text-center flex items-center justify-center text-sm font-extrabold text-rose-800 border-2 border-rose-300 shadow-lg"
                >
                  <span className="text-sm md:text-base">
                    {calculatedM2.toFixed(2)} m²
                  </span>
                </motion.div>
              </div>

              {/* Not */}
              <Input
                placeholder="Sipariş Notu (Örn: Rengi teyit ediniz)"
                value={note || ""}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-rose-400 transition mt-1 text-sm border-gray-300"
              />

              {/* Ölçü Onayı */}
              <div className="flex items-center gap-3 mt-1 p-2 bg-rose-100/50 rounded-md">
                <Checkbox
                  id="measure_accept"
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(Boolean(v))}
                  className=" border-rose-400  text-rose-700  data-[state=checked]:bg-rose-600  data-[state=checked]:border-rose-600  data-[state=checked]:text-white  "
                />

                <label
                  htmlFor="measurement-check"
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

            {/* Fiyat ve Aksiyonlar (Daha Büyük ve Göz Alıcı) */}
            <div className="flex flex-col gap-4 mt-2">
              {/* Fiyat Kartı */}
              <div className="flex items-center justify-between p-5 bg-rose-50 backdrop-blur-lg rounded-xs border border-rose-200 shadow-lg ring-1 ring-inset ring-rose-500/10">
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-gray-600 uppercase">
                    Toplam Fiyat
                  </span>
                  <p className="text-3xl font-extrabold text-rose-700 drop-shadow-lg leading-none mt-1">
                    ₺{totalPrice}
                  </p>
                  <span className="text-xs text-gray-500 mt-2">
                    ({calculatedM2.toFixed(2)} m² x {quantity} adet) + KDV Dahil
                  </span>
                </div>

                {/* Miktar */}
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

              {/* Sepet & Favori */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={!accepted || en <= 0 || boy <= 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-br from-[#7B0323] to-[#9F1B40] hover:from-[#7B0323]/90 hover:to-[#9F1B40]/90 text-white py-0  md:py-2 rounded-full shadow-2xl text-xl font-extrabold transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={24} className="" />
                  Sepete Ekle
                </motion.button>

                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Favoriye Ekle"
                  onClick={handleFavoriteToggle}
                  className="h-14 w-14 rounded-full border-rose-400 bg-white/70 hover:bg-rose-50 transition-all shadow-md"
                  disabled={loadingFavorite}
                >
                  <Heart
                    size={26}
                    strokeWidth={2}
                    fill={isFavorite ? "#9F1B40" : "none"} // Daha koyu kırmızı
                    color={isFavorite ? "#9F1B40" : "currentColor"}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-10 sm:my-16" />

        {/* Açıklama ve Yorumlar bileşeni */}
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
