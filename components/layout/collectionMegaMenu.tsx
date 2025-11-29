"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneOutgoing, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

// --- TYPES ---
interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
  subItems?: { label: string; href: string }[];
}

interface CategoryData {
  name: string;
  desc: string;
  image: string;
  href: string;
}

interface CollectionMegaMenuProps {
  collectionOpen: boolean;
  setCollectionOpen: (isOpen: boolean) => void;
  collectionLink: NavLink;
}

const CATEGORY_MAP: { [key: string]: CategoryData } = {
  Dikey: {
    name: "Dikey",
    desc: "Modern ve fonksiyonel çözümler",
    image: "/categories/vertical.webp",
    href: "/products/vertical",
  },
  "Ahşap Jaluzi": {
    name: "Ahşap Jaluzi",
    desc: "Doğal ve sıcak görünüm",
    image: "/categories/wooden.webp",
    href: "/products/wooden",
  },
  "Metal Jaluzi": {
    name: "Metal Jaluzi",
    desc: "Dayanıklı modern tasarım",
    image: "/categories/metal.webp",
    href: "/products/metal",
  },
  "Perde Aksesuarları": {
    name: "Aksesuarlar",
    desc: "Tamamlayıcı detaylar",
    image: "/categories/accessories.webp",
    href: "/products/accessories",
  },
  Stor: {
    name: "Stor Perde",
    desc: "Minimalist modern çözümler",
    image: "/categories/stor.webp",
    href: "/products/roller",
  },
  Zebra: {
    name: "Zebra Perde",
    desc: "Zarif ışık kontrolü",
    image: "/categories/zebra.webp",
    href: "/products/zebra",
  },
  Rüstik: {
    name: "Rüstik",
    desc: "Doğal estetik",
    image: "/categories/rustic.webp",
    href: "/products/rustic",
  },
  Tüller: {
    name: "Tüller",
    desc: "Hafif ve şık dokular",
    image: "/categories/sheer.webp",
    href: "/products/sheer",
  },
  Fon: {
    name: "Fon",
    desc: "Güçlü dekoratif etki",
    image: "/categories/drapes.webp",
    href: "/products/drapes",
  },
  Plise: {
    name: "Plise",
    desc: "Enerji tasarruflu modern yapı",
    image: "/categories/plicell.webp",
    href: "/products/picell",
  },
};

const CARD_VARIANT = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

// --- Category Card ---
function CategoryCard({
  item,
  pathname,
  closeMenu,
}: {
  item: { label: string; href: string };
  pathname: string;
  closeMenu: () => void;
}) {
  const data = CATEGORY_MAP[item.label] || {
    name: item.label,
    desc: "Tüm ürünleri keşfedin",
    image: "/categories/default.webp",
    href: item.href,
  };

  const active = pathname === data.href;

  return (
    <motion.div variants={CARD_VARIANT}>
      <Link
        href={data.href}
        onClick={closeMenu}
        className="group block rounded-sm overflow-hidden bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 transition-all hover:shadow-lg"
      >
        {/* Image */}
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="(max-width: 768px) 100vw,
           (max-width: 1200px) 50vw,
           20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Text */}
        <div className="p-3">
          <h3
            className={`text-sm font-semibold mb-1
            ${
              active
                ? "text-[#7B0323]"
                : "text-gray-800 group-hover:text-[#7B0323]"
            }`}
          >
            {data.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">{data.desc}</p>
        </div>
      </Link>
    </motion.div>
  );
}

// --- Main Component ---
export default function CollectionMegaMenu({
  collectionOpen,
  setCollectionOpen,
  collectionLink,
}: CollectionMegaMenuProps) {
  const pathname = usePathname() || "/";
  const ref = useRef<HTMLDivElement>(null);

  // Click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const isButton = (e.target as HTMLElement).closest(
        '[data-id="collection-button"]'
      );
      if (!isButton && ref.current && !ref.current.contains(e.target as Node)) {
        setCollectionOpen(false);
      }
    };

    if (collectionOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [collectionOpen, setCollectionOpen]);

  return (
    <AnimatePresence>
      {collectionOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="sticky left-0 right-0 top-[74px] md:top-[85px] z-50 bg-white/80 backdrop-blur-2xl border-b shadow-xl"
        >
          {/* Close Button */}
          <button
            onClick={() => setCollectionOpen(false)}
            className="absolute top-4 right-6 p-2 rounded-full bg-white/70 hover:bg-white shadow transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Perde Koleksiyonları
                </h3>
                <p className="text-gray-500 mt-1">
                  İç mekanınıza modern bir dokunuş katın.
                </p>
              </div>

              <Link
                href="/products"
                onClick={() => setCollectionOpen(false)}
                className="px-5 py-2.5 font-medium rounded-full border border-[#7B0323] text-[#7B0323] hover:bg-[#7B0323] hover:text-white transition"
              >
                Tümünü Gör
              </Link>
            </div>

            {/* Category Grid */}
            <motion.div
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
            >
              {collectionLink.subItems?.map((item, index) => (
                <CategoryCard
                  key={index}
                  item={item}
                  pathname={pathname}
                  closeMenu={() => setCollectionOpen(false)}
                />
              ))}
            </motion.div>

            {/* Support Area */}
            <Link
              href="/contact"
              onClick={() => setCollectionOpen(false)}
              className="flex items-center gap-5 mt-10 p-6 rounded-2xl border bg-gradient-to-r from-white to-red-50 hover:shadow-lg transition"
            >
              <PhoneOutgoing className="text-[#7B0323] w-7 h-7 flex-shrink-0" />
              <div>
                <p className="font-semibold text-lg text-gray-900">
                  Ücretsiz ölçü ve proje desteği
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Uzmanlarımızla hemen görüşün.
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-[#7B0323] ml-auto" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
