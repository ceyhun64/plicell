// components/Navbar.tsx (Güncellenmiş)
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  Heart,
  User,
  MapPin,
  Package,
  LogIn,
  UserPlus,
  LayoutGrid,
  Layers,
  Sparkles,
  PhoneOutgoing,
  MessageCircleQuestion,
  Feather,
} from "lucide-react";
// motion ve AnimatePresence artık gerekli değil
// import { motion, AnimatePresence } from "framer-motion";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { GradientText } from "../ui/shadcn-io/gradient-text/index";
import CartDropdown from "./cartDropdown";
import { getGuestCartCount } from "@/utils/cart";
import { useFavorite } from "@/contexts/favoriteContext";
import Image from "next/image";

// Yeni import
import MobileNavSheet from "./mobileNavSheet";

export default function Navbar() {
  const links = [
    {
      label: "Anasayfa",
      href: "/",
      icon: LayoutGrid, // LayoutGrid
    },
    {
      label: "Koleksiyon",
      href: "/products",
      icon: Layers, // Layers
      subItems: [
        { label: "Tüm Perdeler", href: "/products" },
        { label: "Dikey", href: "/products/vertical" },
        { label: "Ahşap Jaluzi", href: "/products/wooden" },
        { label: "Metal Jaluzi", href: "/products/metal" },
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
        { label: "Perde Aksesuarları", href: "/products/accessories" },
      ],
    },
    {
      label: "Hakkımızda",
      href: "/about",
      icon: Sparkles, // Sparkles
    },
    {
      label: "Bize Ulaşın",
      href: "/contact",
      icon: PhoneOutgoing, // PhoneOutgoing
    },
    {
      label: "S.S.S",
      href: "/faq",
      icon: MessageCircleQuestion, // MessageCircleQuestion
    },
    {
      label: "Moda Blog",
      href: "/blog",
      icon: Feather, // Feather
    },
  ];

  const [favoriteCount, setFavoriteCount] = useState(0);

  const pathname = usePathname() || "/";
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );
  const cartDropdownRef = useRef<{ open: () => void }>(null);
  const { favorites } = useFavorite();

  // Favori ve Kullanıcı kontrolü useEffect'leri aynı kalır...

  useEffect(() => {
    // Sayfa yüklendiğinde API’den favori sayısını al
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites", { credentials: "include" });
        if (res.status === 401) {
          setFavoriteCount(0); // login değilse hata verme
          return;
        }
        if (!res.ok) return;
        const data = await res.json();
        setFavoriteCount(data.length);
      } catch {
        setFavoriteCount(0);
      }
    };

    fetchFavorites();

    // Event listener ekle
    const handleFavoriteChange = (e: any) => {
      setFavoriteCount((prev) => prev + e.detail);
    };

    window.addEventListener("favoriteChanged", handleFavoriteChange);

    return () => {
      window.removeEventListener("favoriteChanged", handleFavoriteChange);
    };
  }, []);

  useEffect(() => {
    // Component mount olduğunda API'yi çağır
    const checkUser = async () => {
      try {
        const res = await fetch("/api/account/check");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Kullanıcı kontrolü hatası:", error);
        setUser(null);
      }
    };
    checkUser();
  }, []);
  // 🔹 Yeni: guest cart dinle
  useEffect(() => {
    if (!user) {
      // Guest sepetini dinle ve güncelle
      const updateCart = () => {
        const count = getGuestCartCount();
        const event = new CustomEvent("cartCountUpdated", { detail: count });
        window.dispatchEvent(event);
      };

      updateCart();
      window.addEventListener("cartUpdated", updateCart);
      return () => window.removeEventListener("cartUpdated", updateCart);
    }
  }, [user]);
  // Scroll event for shadow / blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-20 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white/80 backdrop-blur-lg shadow-2xl border-b"
            : "py-5 bg-white/80"
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-10 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-18 h-12 md:w-22 md:h-14 lg:w-26 lg:h-16">
              <Image
                src="/logo/logo.png"
                alt="Moda Perde 6"
                fill
                quality={100}
                className="object-contain"
                sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 208px"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 h-full items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-4">
                {links.map((link, i) => {
                  const isActive =
                    link.href === "/products"
                      ? pathname.startsWith("/products")
                      : pathname === link.href;

                  return (
                    <NavigationMenuItem key={i} className="relative">
                      {link.subItems ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`px-4 py-2 font-medium relative
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#7B0323]
                after:transition-all after:duration-300
                ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`}
                            >
                              {link.label}
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-lg border border-gray-200 mt-2">
                            {link.subItems.map((item, j) => {
                              const isSubActive = pathname === item.href;
                              return (
                                <DropdownMenuItem key={j} asChild>
                                  <Link
                                    href={item.href}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200
                      ${
                        isSubActive
                          ? "text-[#7B0323] font-semibold"
                          : "hover:text-[#7B0323] hover:bg-[#7B0323]/10"
                      }`}
                                  >
                                    {item.label}
                                  </Link>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link href={link.href}>
                          <Button
                            variant="ghost"
                            className={`px-4 py-2 font-medium relative
              after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#7B0323]
              after:transition-all after:duration-300
              ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`}
                          >
                            {link.label}
                          </Button>
                        </Link>
                      )}
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <Link href={"/search"}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Ara"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            {/* User / Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Kullanıcı">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Profilim</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile/addresses"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Adreslerim</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile/orders"
                        className="flex items-center gap-2"
                      >
                        <Package className="h-4 w-4" />
                        <span>Siparişlerim</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        <span>Giriş Yap</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/register"
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Kayıt Ol</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Favorites */}
            <Link href="/favorites" aria-label="Favoriler" className="relative">
              <Button variant="ghost" size="icon-sm">
                <Heart className="h-5 w-5" />
              </Button>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <CartDropdown />
            {/* Mobile Menu Button (Menu ikonunu kullanıyoruz) */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(true)} // Açmak için true
                aria-label="Mobil menüyü aç"
              >
                <Menu className="h-5 w-5" /> {/* Sadece Menü ikonu */}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sheet Bileşeni (Yeni Mobil Menü) */}
      <MobileNavSheet
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)} // Kapatmak için false
        links={links as any} // Link türünü uyumluluk için "as any" kullanıyoruz
      />
    </>
  );
}
