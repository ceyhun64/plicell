"use client";
import { cn } from "@/lib/utils";
import {
  Columns2,
  Columns3,
  Columns4,
  StretchHorizontal,
  Filter,
  ChevronDown,
  ChevronUp,
  Sliders,
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
  const [mobileOpen, setMobileOpen] = useState(true); // mobil panel açık/kapalı
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const desktopGridOptions: Array<2 | 3 | 4> = [2, 3, 4];
  const mobileGridOptions: Array<1 | 2> = [1, 2];

  return (
    <div
      className={cn(
        "sticky top-15 z-10 w-full px-4 md:px-6 transition-all duration-300",
        scrolled
          ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm border-b"
          : "py-3 bg-white/80 backdrop-blur-lg shadow-sm"
      )}
    >
      {/* Mobil: Filtrele butonu */}
      <div className="md:hidden flex justify-center py-0 sticky top-0 z-20">
        <Button
          size="icon-sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "w-full max-w-xs flex items-center justify-center h-4 px-4 py-0 border-none bg-transparent text-[#7B0323] hover:bg-transparent transition"
          )}
        >
          
          {mobileOpen ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>

      {/* Mobil panel */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-3 py-2">
          {/* Oda + Kategori */}
          <div className="w-full flex items-center gap-2">
            <div className="flex-1">
              <Select
                value={roomFilter}
                onValueChange={(v) => setRoomFilter(v)}
              >
                <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-none rounded-xs shadow-sm hover:shadow-md transition-all">
                  <SelectValue placeholder="Oda Seçimi" />
                </SelectTrigger>
                <SelectContent className="bg-white ">
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

          {/* Grid */}
          <div className="flex gap-2 items-center">
            {mobileGridOptions.map((cols) => (
              <button
                key={cols}
                onClick={() => setGridCols(cols as 1 | 2)}
                className={cn(
                  "p-3  duration-200 hover:scale-110 flex items-center justify-center bg-white/80 backdrop-blur-sm border-none rounded-xs shadow-sm hover:shadow-md transition-all",
                  gridCols === cols
                    ? "bg-gradient-to-br from-[#7B0323] to-[#9F1B40] text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-200"
                )}
              >
                {cols === 1 ? (
                  <StretchHorizontal size={20} />
                ) : (
                  <Columns2 size={20} />
                )}
              </button>
            ))}
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as typeof sort)}
            >
              <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-none rounded-xs shadow-sm hover:shadow-md transition-all">
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

          {/* Sıralama */}
        </div>
      )}

      {/* Masaüstü */}
      <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3">
        {/* 1. Satır: Masaüstü oda butonları */}
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

        {/* 2. Satır: Grid ve sıralama */}
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

          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
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
  );
};

export default ProductTopBar;
