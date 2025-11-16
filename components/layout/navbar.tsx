"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  X,
  ArrowRight,
  Menu,
  Trash2, // Çöp kutusu ikonu için eklendi
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";


export default function Navbar() {
  const links = [
    { name: "Tüm Ürünler", href: "/shop" },
    { name: "Plicell", href: "/plants" },
    { name: "Zebra", href: "/accessories" },
    { name: "Stor", href: "/accessories" },
    { name: "Ahşap Jaluzi", href: "/accessories" },
  ];

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll event for shadow / blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Search Bar */}
      {searchOpen && (
        <div className="border-b bg-gray-100/50 py-4 px-8 ">
          <div className="flex items-center max-w-6xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Ürünleri, kategorileri, markaları ara..."
                className="w-full pl-12 pr-16 py-3 rounded-full border-none outline-none bg-white focus:ring-green-500"
                autoFocus
              />
              <Button
                type="button"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center text-white"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Kapat"
              onClick={() => setSearchOpen(false)}
              className="ml-4"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white/60 backdrop-blur-lg shadow-md border-b"
            : "py-5 bg-white/60"
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-10  max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold font-[Playfair_Display]">
            Plicell
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 h-full items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-6">
                {links.map((link, i) => (
                  <NavigationMenuItem key={i}>
                    <Link href={link.href}>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 font-medium text-gray-800 hover:text-gray-900 transition"
                      >
                        {link.name}
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 md:gap-4">
            {/* Search */}
            <Button variant="ghost" size="icon" aria-label="Ara">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Kullanıcı">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/login">Giriş Yap</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Kayıt Ol</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="
      z-[2000] p-4 w-full max-w-sm h-full fixed top-0 right-0
      bg-white/90 backdrop-blur-md
      border-l border-gray-100
      flex flex-col
      overflow-hidden
    "
              >
                {/* Header */}
                <SheetHeader className="pb-2 border-b border-gray-100 mb-2">
                  <SheetTitle className="text-2xl font-bold text-gray-900">
                    Sepetim
                  </SheetTitle>
                  <SheetDescription className="text-gray-800 text-xs">
                    Ürünlerinizi kontrol edip düzenleyebilirsiniz.
                  </SheetDescription>
                </SheetHeader>

                {/* İçerik scroll alanı */}
                <div className="flex-1 overflow-y-auto space-y-3">
                  {/* Örnek Ürün Kartı */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-gray-200 shadow-sm"
                  >
                    {/* Sol: Ürün Görseli */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                      <img
                        src="/products/1.webp"
                        alt="Ürün"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Orta: Ürün Bilgisi */}
                    <div className="flex-1 mx-4">
                      <p className="text-sm font-semibold text-gray-900">
                        Modern Perde Modeli
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Renk: Gri, 150x200 cm
                      </p>
                      <p className="text-sm font-bold text-gray-800 mt-2">
                        ₺299,00
                      </p>
                    </div>

                    {/* Sağ: Adet Kontrol ve Sil */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-7 h-7 text-gray-600 border-gray-300 hover:bg-gray-100"
                        >
                          -
                        </Button>
                        <span className="text-sm w-5 text-center">1</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-7 h-7 text-gray-600 border-gray-300 hover:bg-gray-100"
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Toplamlar */}
                <div className="border-t border-gray-100 pt-3 mt-3 mb-3 space-y-1 text-gray-800 text-sm">
                  <div className="flex justify-between">
                    Ara Toplam <span>₺498,00</span>
                  </div>
                  <div className="flex justify-between">
                    Kargo <span>₺49,00</span>
                  </div>
                  <div className="flex justify-between font-bold mt-1 text-gray-900">
                    Genel Toplam <span>₺547,00</span>
                  </div>
                </div>

                {/* Footer */}
                <SheetFooter className="flex flex-col gap-3 pt-3">
                  <Link href="/cart">
                    <Button className="w-full py-3 text-sm bg-[#7B0323] text-white rounded-xl shadow-sm hover:bg-[#5E021A] transition flex items-center justify-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Sepete Git
                    </Button>
                  </Link>
                  <Link href="/checkout">
                    <Button className="w-full py-3 text-sm bg-[#7B0323] text-white rounded-xl shadow-sm hover:bg-[#5E021A] transition flex items-center justify-center gap-2">
                      Ödemeye Geç
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full py-3 text-sm text-[#7B0323] border border-[#7B0323] rounded-xl hover:bg-[#FDECEF] transition flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Alışverişe Devam Et
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={
                  mobileOpen ? "Mobil menüyü kapat" : "Mobil menüyü aç"
                }
              >
                {mobileOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Full Screen) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 bg-white/85 backdrop-blur-xl flex flex-col items-center justify-center gap-10 md:hidden z-20 h-screen overflow-y-auto"
              aria-label="Mobil menü"
            >
              {/* Close Button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-5 right-6 text-gray-900 hover:text-amber-400 transition-all"
                aria-label="Menüyü kapat"
                title="Menüyü kapat"
              >
                <X className="h-7 w-7" aria-hidden="true" />
              </button>

              {/* Menu Links */}
              <div className="flex flex-col items-center gap-6">
                {links.map((link, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-label={`${link.name} sayfasına git`}
                      title={link.name}
                    >
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="text-zinc-900 text-2xl font-semibold tracking-wide hover:text-amber-400"
                        >
                          {link.name}
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
