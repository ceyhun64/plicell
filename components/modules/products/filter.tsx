"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Funnel, ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { usePathname, useRouter } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
  subItems?: MenuItem[];
}

interface FilterProps {
  colorFilter: string;
  setColorFilter: (color: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
}

const productCategories: MenuItem[] = [
  { label: "Tüm Perdeler", href: "/products" },
  { label: "Dikey", href: "/products/vertical" },
  { label: "Ahşap Jaluzi", href: "/products/wooden" },
  { label: "Metal Jaluzi", href: "/products/metal" },
  { label: "Perde Aksesuarları", href: "/products/accessories" },
  {
    label: "Stor",
    href: "/products/roller",
    subItems: [
      { label: "Lazer Kesim Stor", href: "/products/roller/laser-cut" },
    ],
  },
  { label: "Zebra", href: "/products/zebra" },
  { label: "Rüstik", href: "/products/rustic" },
  { label: "Tüller", href: "/products/sheer" },
  { label: "Fon", href: "/products/drapes" },
  { label: "Plise", href: "/products/plicell" },
];

const Filter: React.FC<FilterProps> = ({
  colorFilter,
  setColorFilter,
  maxPrice,
  setMaxPrice,
  minPrice,
  setMinPrice,
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (label: string) => {
    setOpenCategory((prev) => (prev === label ? null : label));
  };

  const handleCategoryClick = (item: MenuItem) => {
    if (!item.subItems) {
      router.push(item.href);
    } else {
      toggleCategory(item.label);
    }
  };

  const handleSubCategoryClick = (sub: MenuItem) => {
    router.push(sub.href);
  };

  return (
    <div
      className={`sticky top-30 p-6 rounded-sm transition-all duration-300 w-full max-w-xs
        ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl border border-gray-200/50"
            : "bg-white shadow-md border border-gray-100"
        }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pb-4 border-b border-gray-100">
        <Funnel size={18} className="text-[#7B0323]" />
        <h2 className="text-lg font-semibold text-gray-900">Filtrele</h2>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-1.5">
        {productCategories.map((category) => {
          const isSelected =
            pathname === category.href ||
            (category.subItems?.some((sub) => sub.href === pathname) ?? false);
          const isOpen = openCategory === category.label || isSelected;

          return (
            <div key={category.label} className="flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-between px-3 py-2 h-auto rounded-md transition-all duration-200 ${
                  isSelected
                    ? "bg-[#7B0323] text-white hover:bg-[#7B0323]/90"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#7B0323]"
                }`}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(category.href);
                  }}
                  className="w-full text-left text-sm font-medium"
                >
                  {category.label}
                </span>

                {category.subItems && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category.label);
                    }}
                    className="flex items-center ml-2"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                )}
              </Button>

              {/* Sub Categories */}
              {category.subItems && isOpen && (
                <div className="ml-4 flex flex-col gap-1 mt-1 pl-3 border-l-2 border-gray-100">
                  {category.subItems.map((sub) => {
                    const isSubSelected = pathname === sub.href;
                    return (
                      <Button
                        key={sub.label}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSubCategoryClick(sub)}
                        className={`w-full justify-start px-3 py-1.5 h-auto text-sm rounded-md transition-all duration-200 ${
                          isSubSelected
                            ? "bg-[#7B0323]/10 text-[#7B0323] font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-[#7B0323]"
                        }`}
                      >
                        {sub.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Price Filter */}
      <div className="mt-0 pt-6 border-t border-gray-100 font-sans">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Fiyat Aralığı
        </h3>
        <Slider
          value={[minPrice, maxPrice]}
          onValueChange={([min, max]) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          max={3000}
          step={10}
          className="w-full mb-3"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 ">{minPrice}₺</span>
          <div className="h-px w-8 bg-gray-200"></div>
          <span className="text-sm font-medium text-gray-700">{maxPrice}₺</span>
        </div>
      </div>
    </div>
  );
};

export default Filter;
