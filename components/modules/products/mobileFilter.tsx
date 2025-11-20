"use client";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

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

  const handleCategoryChange = (value: string) => {
    onSelectCategory(value);
    router.push(`/products/${value === "all" ? "" : value}`);
  };

  return (
    <div className="md:hidden flex-1">
      <Select value={selectedCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-none rounded-xs shadow-sm hover:shadow-md transition-all">
          <SelectValue placeholder="Kategori Seç" />
        </SelectTrigger>
        <SelectContent>
          {productCategories.map((cat) => {
            const slug = cat.href.split("/products/")[1] || "all";

            // Ana kategori
            return (
              <React.Fragment key={slug}>
                <SelectItem value={slug}>{cat.label}</SelectItem>

                {/* Alt kategoriler */}
                {cat.subItems &&
                  cat.subItems.map((sub) => {
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
