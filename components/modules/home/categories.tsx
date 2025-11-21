"use client";
import React, { useState, useEffect } from "react"; // useState ve useEffect eklendi
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Kategori verilerinin tipini tanımlayalım
interface CategoryData {
  id: number;
  name: string;
  desc: string;
  image: string;
  href: string;
}

const initialCategories: CategoryData[] = [
  {
    id: 1,
    name: "Dikey Perde",
    desc: "Modern ve fonksiyonel çözümler",
    image: "/categoryBanners/vertical.jpg",
    href: "/products/vertical",
  },
  {
    id: 2,
    name: "Ahşap Jaluzi",
    desc: "Doğal ve sıcak görünüm",
    image: "/categoryBanners/wooden.jpg",
    href: "/products/wooden",
  },
  {
    id: 3,
    name: "Metal Jaluzi",
    desc: "Dayanıklı modern tasarım",
    image: "/categoryBanners/metal.jpg",
    href: "/products/metal",
  },
  {
    id: 4,
    name: "Perde Aksesuarları",
    desc: "Tamamlayıcı detaylar",
    image: "/categoryBanners/accessories.jpg",
    href: "/products/accessories",
  },
  {
    id: 5,
    name: "Stor Perde",
    desc: "Minimalist modern çözümler",
    image: "/categoryBanners/stor.jpg",
    href: "/products/roller",
  },
  {
    id: 6,
    name: "Zebra Perde",
    desc: "Zarif ışık kontrolü",
    image: "/categoryBanners/zebra.jpg",
    href: "/products/zebra",
  },
  {
    id: 7,
    name: "Rüstik",
    desc: "Doğal estetik",
    image: "/categoryBanners/rustic.jpeg",
    href: "/products/rustic",
  },
  {
    id: 8,
    name: "Tüller",
    desc: "Hafif ve şık dokular",
    image: "/categoryBanners/sheer.jpg",
    href: "/products/sheer",
  },
  {
    id: 9,
    name: "Fon",
    desc: "Güçlü dekoratif etki",
    image: "/categoryBanners/drapes.avif",
    href: "/products/drapes",
  },
  {
    id: 10,
    name: "Plise",
    desc: "Enerji tasarruflu modern yapı",
    image: "/categoryBanners/plicell.jpg",
    href: "/products/picell",
  },
];

// --- İSKELET BİLEŞENİ TANIMLAMA ---
const CategoryCardSkeleton = () => (
  // PremiumCategoryCard'ın boyutlarını taklit eder
  <div className="rounded-xs shadow-xl p-0 m-0 bg-transparent border-none">
    <div className="relative w-full aspect-[5/3] overflow-hidden rounded-xs">
      <Skeleton className="w-full h-full" />
    </div>
    {/* Metin için yer tutucu iskelet */}
    <div className="absolute inset-0 flex flex-col items-end justify-end pr-4 pb-4">
      {/* Kategori Adı İskeleti */}
      <Skeleton className="h-6 w-32" />
    </div>
  </div>
);
// ------------------------------------

export default function CategoriesSection() {
  // Yükleme durumunu simüle etmek için state eklendi
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    // Normalde API'den veri çekimi burada olur.
    async function fetchCategories() {
      try {
        // Simülasyon için 1 saniyelik gecikme (Gerçek API çağrısı yerine)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCategories(initialCategories); // Veriler yüklenmiş gibi varsayalım
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
        setCategories(initialCategories); // Hata durumunda bile varsayılan veriyi göster
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Kart sayısı sabit olduğu için 10 adet iskelet kullanabiliriz
  const SKELETON_COUNT = 10;
  const skeletons = Array.from({ length: SKELETON_COUNT }).map((_, index) => (
    <CategoryCardSkeleton key={index} />
  ));

  // Yükleme durumunda iskeletleri görüntüle
  if (loading) {
    return (
      <section className="container mx-auto px-4 md:px-12 py-12 max-w-8xl space-y-6">
        {/* 1. Satır — 3 İskelet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {skeletons.slice(0, 3)}
        </div>

        {/* 2. Satır — 4 İskelet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {skeletons.slice(3, 7)}
        </div>

        {/* 3. Satır — 3 İskelet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {skeletons.slice(7, 10)}
        </div>
      </section>
    );
  }

  // Yükleme bittiğinde normal içerik gösterilir
  return (
    <section className="container mx-auto px-4 md:px-12 py-12 max-w-8xl space-y-6">
      {/* 1. Satır — 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.slice(0, 3).map((c) => (
          <PremiumCategoryCard key={c.id} category={c} />
        ))}
      </div>

      {/* 2. Satır — 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.slice(3, 7).map((c) => (
          <PremiumCategoryCard key={c.id} category={c} />
        ))}
      </div>

      {/* 3. Satır — 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.slice(7, 10).map((c) => (
          <PremiumCategoryCard key={c.id} category={c} />
        ))}
      </div>
    </section>
  );
}

function PremiumCategoryCard({ category: category }: { category: any }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }}>
      <Link href={category.href}>
        <Card className="relative overflow-hidden group rounded-xs shadow-xl hover:shadow-2xl transition-all duration-500 p-0 m-0 bg-transparent border-none">
          <CardContent className="p-0 m-0 relative !p-0 !m-0">
            <div className="relative w-full aspect-[5/3] overflow-hidden rounded-xs">
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.12 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover w-full h-full"
                />
              </motion.div>

              {/* Gradient Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-end justify-end pr-4 pb-4 text-center">
                <h3 className="text-white text-2xl font-serif drop-shadow-xl tracking-wide group-hover:translate-y-[-4px] transition-all duration-500">
                  {category.name}
                </h3>
                {/* <p className="text-white/80 text-sm mt-1 group-hover:opacity-100 opacity-80 transition-all duration-500">
                  {category.desc}
                </p> */}
              </div>

              {/* Glow Border on Hover */}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
