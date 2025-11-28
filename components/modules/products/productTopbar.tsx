"use client";
import { cn } from "@/lib/utils";
import {
  Columns2,
  Columns3,
  Columns4,
  StretchHorizontal,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import MobileFilter from "./mobileFilter";
import { Button } from "@/components/ui/button";

interface ProductTopBarProps {
  productRooms: string[];
  roomFilter: string;
  setRoomFilter: (room: string) => void;
  gridCols: 1 | 2 | 3 | 4;
  setGridCols: (cols: 1 | 2 | 3 | 4) => void;
  sort: "az" | "za" | "priceLow" | "priceHigh";
  setSort: (sort: "az" | "za" | "priceLow" | "priceHigh") => void;
}

const ProductTopBar: React.FC<ProductTopBarProps> = ({
  productRooms,
  roomFilter,
  setRoomFilter,
  gridCols,
  setGridCols,
  sort,
  setSort,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // Başlangıçta kapalı
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const desktopGridOptions: Array<2 | 3 | 4> = [2, 3, 4];
  const mobileGridOptions: Array<1 | 2> = [1, 2];

  return (
    <>
      {/* Desktop: Üstte sticky */}
      <div
        className={cn(
          "hidden md:block sticky top-17 md:top-22 z-11 w-full px-4 md:px-6 transition-all duration-300",
          scrolled
            ? "py-3 bg-white/80 backdrop-blur-lg shadow-2xl border-b"
            : "py-5 bg-white/80"
        )}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Oda butonları */}
          <div className="flex gap-1 scrollbar-hide py-1">
            {productRooms.map((room) => (
              <button
                key={room}
                onClick={() => setRoomFilter(room)}
                className={cn(
                  "px-5 py-2 rounded-xs font-medium flex-shrink-0 transition-all duration-200 transform hover:scale-105 whitespace-nowrap",
                  roomFilter === room
                    ? "bg-gradient-to-r from-[#7B0323] to-[#9F1B40] text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                )}
              >
                {room}
              </button>
            ))}
          </div>

          {/* Grid ve sıralama */}
          <div className="flex gap-2 items-center">
            {desktopGridOptions.map((cols) => (
              <button
                key={cols}
                onClick={() => setGridCols(cols as 2 | 3 | 4)}
                className={cn(
                  "p-3 rounded-xs transition-transform duration-200 hover:scale-110 flex items-center justify-center",
                  gridCols === cols
                    ? "bg-gradient-to-br from-[#7B0323] to-[#9F1B40] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {cols === 2 ? (
                  <Columns2 size={20} />
                ) : cols === 3 ? (
                  <Columns3 size={20} />
                ) : (
                  <Columns4 size={20} />
                )}
              </button>
            ))}

            <Select
              value={sort}
              onValueChange={(v) => setSort(v as typeof sort)}
            >
              <SelectTrigger className="w-40 md:w-64 bg-white/80 backdrop-blur-sm border-none rounded-xs shadow-sm hover:shadow-md transition-all">
                <SelectValue placeholder="Sırala" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-gray-200">
                <SelectItem value="az">İsme Göre Artan</SelectItem>
                <SelectItem value="za">İsme Göre Azalan</SelectItem>
                <SelectItem value="priceLow">Fiyata Göre Artan</SelectItem>
                <SelectItem value="priceHigh">Fiyata Göre Azalan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Mobile: Altta sol tarafta FAB (Floating Action Button) stili */}
      <div className="md:hidden ">
        {/* Floating Filter Button - Sol altta, social icons'ın üstünde */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "fixed bottom-23 left-0 z-40 px-3 py-2 rounded-r-full shadow-xl",
            "bg-gradient-to-r from-[#7B0323] to-[#9F1B40] text-white font-medium",
            "hover:scale-105 active:scale-95 transition-all duration-200"
          )}
        >
          Filtrele
        </button>

        {/* Filter Panel - Alttan açılan sheet */}
        {mobileOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-gray-200 p-6 pb-8 animate-in slide-in-from-bottom duration-300">
              <div className="flex flex-col gap-4">
                {/* Başlık */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filtreler
                  </h3>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown className="h-6 w-6" />
                  </button>
                </div>

                {/* Oda + Kategori */}
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select
                      value={roomFilter}
                      onValueChange={(v) => setRoomFilter(v)}
                    >
                      <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg h-12 shadow-sm hover:shadow-md transition-all">
                        <SelectValue placeholder="Oda Seçimi" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Tümü">Tüm Odalar</SelectItem>
                        <SelectGroup>
                          {productRooms
                            .filter((room) => room !== "Tümü")
                            .map((room) => (
                              <SelectItem key={room} value={room}>
                                {room}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <MobileFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                  />
                </div>

                {/* Grid Options */}
                <div className="flex gap-3 items-center">
                  <span className="text-sm font-medium text-gray-700 min-w-fit">
                    Görünüm:
                  </span>
                  <div className="flex gap-2 flex-1">
                    {mobileGridOptions.map((cols) => (
                      <Button
                        key={cols}
                        size={"icon-sm"}
                        onClick={() => setGridCols(cols as 1 | 2)}
                        className={cn(
                          "flex-1 rounded-lg transition-all duration-200 flex items-center justify-center",
                          gridCols === cols
                            ? "bg-gradient-to-br from-[#7B0323] to-[#9F1B40] text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {cols === 1 ? (
                          <StretchHorizontal size={24} />
                        ) : (
                          <Columns2 size={24} />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sıralama */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Sıralama:
                  </span>
                  <Select
                    value={sort}
                    onValueChange={(v) => setSort(v as typeof sort)}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg h-12 shadow-sm hover:shadow-md transition-all">
                      <SelectValue placeholder="Sırala" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-lg border border-gray-200">
                      <SelectItem value="az">İsme Göre Artan</SelectItem>
                      <SelectItem value="za">İsme Göre Azalan</SelectItem>
                      <SelectItem value="priceLow">
                        Fiyata Göre Artan
                      </SelectItem>
                      <SelectItem value="priceHigh">
                        Fiyata Göre Azalan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Uygula Butonu */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#7B0323] to-[#9F1B40] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 mt-2 mb-14"
                >
                  Filtreleri Uygula
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductTopBar;
