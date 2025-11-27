// components/navbar/CollectionMegaMenu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneOutgoing, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import Image from "next/image"; // Resimler için Image bileşeni
import { motion } from "framer-motion"; // Animasyonlar için

// Menü verilerinin tip tanımı (Navbar'dan gelen yapıya göre)
interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
  subItems?: { label: string; href: string }[];
}

interface CollectionMegaMenuProps {
  collectionOpen: boolean;
  setCollectionOpen: (isOpen: boolean) => void;
  collectionLink: NavLink;
}

// Daha modern ve elegant stil için sabitler
const PRIMARY_COLOR = "#7B0323"; // Derin Kırmızı / Bordo
const ACTIVE_COLOR = "#C70039"; // Vurgu Kırmızı

// Kategori verilerinin tipini tanımlayalım (Sizin verdiğiniz örneğe uygun)
interface CategoryData {
  name: string;
  desc: string;
  image: string;
  href: string;
}

// Navbar'dan gelen subItems verisini görsellerle eşleştiren yardımcı fonksiyon/veri.
// Bu liste, collectionLink.subItems'a uygun bir eşleştirme tablosudur.
const CATEGORY_MAP: { [key: string]: CategoryData } = {
  Dikey: {
    name: "Dikey",
    desc: "Modern ve fonksiyonel çözümler",
    image: "/categoryBanners/vertical.jpg",
    href: "/products/vertical",
  },
  "Ahşap Jaluzi": {
    name: "Ahşap Jaluzi",
    desc: "Doğal ve sıcak görünüm",
    image: "/categoryBanners/wooden.jpg",
    href: "/products/wooden",
  },
  "Metal Jaluzi": {
    name: "Metal Jaluzi",
    desc: "Dayanıklı modern tasarım",
    image: "/categoryBanners/metal.jpg",
    href: "/products/metal",
  },
  "Perde Aksesuarları": {
    name: "Aksesuarlar",
    desc: "Tamamlayıcı detaylar",
    image: "/categoryBanners/accessories.jpg",
    href: "/products/accessories",
  },
  Stor: {
    name: "Stor Perde",
    desc: "Minimalist modern çözümler",
    image: "/categoryBanners/stor.jpg",
    href: "/products/roller",
  },
  Zebra: {
    name: "Zebra Perde",
    desc: "Zarif ışık kontrolü",
    image: "/categoryBanners/zebra.jpg",
    href: "/products/zebra",
  },
  Rüstik: {
    name: "Rüstik",
    desc: "Doğal estetik",
    image: "/categoryBanners/rustic.jpeg",
    href: "/products/rustic",
  },
  Tüller: {
    name: "Tüller",
    desc: "Hafif ve şık dokular",
    image: "/categoryBanners/sheer.jpg",
    href: "/products/sheer",
  },
  Fon: {
    name: "Fon",
    desc: "Güçlü dekoratif etki",
    image: "/categoryBanners/drapes.avif",
    href: "/products/drapes",
  },
  Plise: {
    name: "Plise",
    desc: "Enerji tasarruflu modern yapı",
    image: "/categoryBanners/plicell.jpg",
    href: "/products/picell",
  },
};

// Mega Menüye özel, daha küçük ve yatay tasarımlı görsel kart bileşeni
function CompactMegaMenuCard({
  item,
  setCollectionOpen,
  pathname,
}: {
  item: { label: string; href: string };
  setCollectionOpen: (isOpen: boolean) => void;
  pathname: string;
}) {
  // collectionLink.subItems'dan gelen label ile eşleştirme yapılıyor
  const data = CATEGORY_MAP[item.label] || {
    name: item.label,
    desc: "Ürünleri incele",
    image: "/categoryBanners/default.jpg", // Varsayılan resim yolu
    href: item.href,
  };
  const isActive = pathname === item.href;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "tween", duration: 0.2 }}
    >
      <Link href={data.href} onClick={() => setCollectionOpen(false)}>
        <div
          className={`relative flex items-center gap-3 p-2 rounded-xs transition-all duration-300 border border-gray-100 group shadow-sm ${
            isActive
              ? `bg-red-50 ring-2 ring-red-200 `
              : "hover:bg-gray-50 hover:shadow-md"
          }`}
        >
          {/* Resim Alanı (Küçük Daire/Kare) */}
          <div
            className={`relative w-20 h-16 overflow-hidden rounded-xs flex-shrink-0 transition-all duration-300 ${
              isActive
                ? "ring-2 ring-white shadow-lg"
                : "group-hover:ring-2 group-hover:ring-red-100"
            }`}
          >
            <Image
              src={data.image}
              alt={data.name}
              fill
              quality={100}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              sizes="60px"
            />
            {/* Hafif bir gölge overlay'i */}
          </div>

          {/* Metin Alanı */}
          <div className="flex flex-col min-w-0 flex-1">
            <h3
              className={`text-base font-semibold truncate transition-colors duration-300 ${
                isActive
                  ? `text-gray-900`
                  : "text-gray-800 group-hover:text-red-800"
              }`}
              style={{ color: isActive ? PRIMARY_COLOR : undefined }}
            >
              {data.name}
            </h3>
            <p className="text-xs text-gray-400 truncate mt-0.5">{data.desc}</p>
          </div>
          <ArrowRight
            className={`w-4 h-4 text-gray-400 ml-auto transition-colors duration-300 ${
              isActive ? "text-red-500" : "group-hover:text-red-700"
            }`}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function CollectionMegaMenu({
  collectionOpen,
  setCollectionOpen,
  collectionLink,
}: CollectionMegaMenuProps) {
  const pathname = usePathname() || "/";
  const menuRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklama olayını yönetme (Kod aynı kaldı)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isCollectionButton = (event.target as HTMLElement).closest(
        '[data-id="collection-button"]'
      );

      if (
        collectionOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !isCollectionButton
      ) {
        setCollectionOpen(false);
      }
    };

    if (collectionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collectionOpen, setCollectionOpen]);

  return (
    // Sticky Collection Mega Menu
    <div
      ref={menuRef}
      className={`sticky top-[72px] md:top-[88px] z-40 bg-white transition-all duration-500  overflow-hidden shadow-2xl/50 shadow-gray-200 ${
        collectionOpen
          ? "max-h-[600px] opacity-100" // Yükseklik korundu
          : "max-h-0 opacity-0 pointer-events-none"
      }`}
      style={{
        boxShadow: collectionOpen ? "0 10px 30px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {/* Başlık ve Tümünü Gör Butonu */}
        <div className="flex justify-between items-end border-b pb-6 mb-8 border-gray-100">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Perde Koleksiyonları
            </h3>
            <p className="text-base text-gray-500">
              Evinizin ambiyansını değiştirecek modern ve sofistike çözümler.
            </p>
          </div>
          <Link href="/products" onClick={() => setCollectionOpen(false)}>
            <Button
              variant="outline"
              className={`transition-all duration-300 font-semibold rounded-full px-5`}
              style={{
                borderColor: PRIMARY_COLOR,
                color: PRIMARY_COLOR,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = PRIMARY_COLOR;
              }}
            >
              Tüm Koleksiyonu Keşfet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Koleksiyon Linkleri Grid (Kompakt Resimli Kartlar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collectionLink.subItems?.map((item, idx) => {
            return (
              <CompactMegaMenuCard
                key={idx}
                item={item}
                setCollectionOpen={setCollectionOpen}
                pathname={pathname}
              />
            );
          })}
        </div>

        {/* İletişim / Ek Bilgi Alanı */}
        <div className="mt-4 pt-6 border-t border-gray-100">
          <Link
            href="/contact"
            className={`flex items-center gap-5 p-5 bg-gradient-to-r from-white to-red-50 rounded-xl transition-all duration-300 border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-lg hover:shadow-red-500/10`}
            onClick={() => setCollectionOpen(false)}
          >
            <PhoneOutgoing
              className="w-7 h-7 text-red-700 flex-shrink-0"
              strokeWidth={1.5}
            />
            <div>
              <p className="font-bold text-lg text-gray-900 leading-snug">
                Özel Projeler ve Ölçü Desteği
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Uzmanlarımızla anında iletişime geçin ve ücretsiz danışmanlık
                alın.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 ml-auto text-red-500 flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
