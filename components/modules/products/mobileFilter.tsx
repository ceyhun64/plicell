"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";

interface FilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const productCategories = [
  { label: "Tüm Perdeler", href: "/products" },
  { label: "Dikey Perde", href: "/products/vertical" },
  { label: "Ahşap Jaluzi", href: "/products/wooden" },
  { label: "Metal Jaluzi", href: "/products/metal" },
  { label: "Perde Aksesuarları", href: "/products/accessories" },
  {
    label: "Stor Perde",
    href: "/products/roller",
    subItems: [
      { label: "Lazer Kesim Stor", href: "/products/roller/laser-cut" },
    ],
  },
  { label: "Zebra Perde", href: "/products/zebra" },
  { label: "Rüstik", href: "/products/rustic" },
  { label: "Tüller", href: "/products/sheer" },
  { label: "Fon", href: "/products/drapes" },
  { label: "Plise", href: "/products/picell" },
];

const MobileFilter: React.FC<FilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentSelection, setCurrentSelection] =
    useState<string>(selectedCategory);

  // Sayfa değiştiğinde otomatik olarak seçili kategori ayarlansın
  useEffect(() => {
    const matchedCategory = productCategories.find((cat) => {
      if (cat.href === pathname) return true;
      if (cat.subItems?.some((sub) => sub.href === pathname)) return true;
      return false;
    });

    if (matchedCategory) {
      // Eğer alt kategori eşleşiyorsa alt kategoriyi seç
      const matchedSub = matchedCategory.subItems?.find(
        (sub) => sub.href === pathname
      );
      const slug = matchedSub
        ? matchedSub.href.split("/products/")[1]
        : matchedCategory.href.split("/products/")[1] || "all";

      setCurrentSelection(slug);
      onSelectCategory(slug);
    } else {
      setCurrentSelection("all");
      onSelectCategory("all");
    }
  }, [pathname, onSelectCategory]);

  const handleCategoryChange = (value: string) => {
    setCurrentSelection(value);
    onSelectCategory(value);
    router.push(`/products/${value === "all" ? "" : value}`);
  };

  return (
    <div className="md:hidden flex-1">
      <Select value={currentSelection} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg h-12 shadow-sm hover:shadow-md transition-all">
          <SelectValue placeholder="Kategori Seç" />
        </SelectTrigger>
        <SelectContent>
          {productCategories.map((cat) => {
            const slug = cat.href.split("/products/")[1] || "all";

            return (
              <React.Fragment key={slug}>
                <SelectItem value={slug}>{cat.label}</SelectItem>
                {cat.subItems?.map((sub) => {
                  const subSlug = sub.href.split("/products/")[1];
                  return (
                    <SelectItem key={subSlug} value={subSlug}>
                      └ {sub.label}
                    </SelectItem>
                  );
                })}
              </React.Fragment>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MobileFilter;
