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
  const pathname = usePathname(); // Mevcut sayfa

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
      className={`sticky top-20 p-6 border border-gray-100 rounded-xs shadow-sm bg-white w-full max-w-xs transition-all duration-300 hover:shadow-md ${
        scrolled
          ? "py-3 bg-white/80 backdrop-blur-lg shadow-md border-b"
          : "py-5 bg-white/80"
      }`}
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-[#7B0323]">
        <Funnel size={20} className="text-[#7B0323]" /> Filtrele
      </h2>

      <div className="flex flex-col gap-2 font-sans">
        {productCategories.map((category) => {
          const isSelected =
            pathname === category.href ||
            (category.subItems?.some((sub) => sub.href === pathname) ?? false);

          const isOpen = openCategory === category.label || isSelected;

          return (
            <div key={category.label} className="flex flex-col gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCategoryClick(category)}
                className={`group w-full justify-between rounded-xs border border-transparent hover:border-[#7B0323] hover:bg-[#7B0323] hover:text-white transition-all text-sm font-medium ${
                  isSelected
                    ? "bg-gradient-to-r from-[#7B0323] to-[#9F1B40] text-white"
                    : "text-black"
                }`}
              >
                <span>{category.label}</span>
                {category.subItems && (
                  <span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#7B0323]" />
                    )}
                  </span>
                )}
              </Button>

              {category.subItems && isOpen && (
                <div className="ml-4 flex flex-col gap-1 mt-1">
                  {category.subItems.map((sub) => {
                    const isSubSelected = pathname === sub.href;
                    return (
                      <Button
                        key={sub.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubCategoryClick(sub)}
                        className={`w-full text-sm justify-between hover:bg-[#7B0323] hover:text-white transition-all ${
                          isSubSelected
                            ? "bg-[#7B0323] text-white"
                            : "text-[#7B0323]"
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

        {/* Fiyat */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Fiyat</h2>
          <Slider
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            max={3000}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Min: {minPrice}₺</span>
            <span>Max: {maxPrice}₺</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
