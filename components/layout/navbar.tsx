"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Menu,
  Heart,
  User,
  MapPin,
  Package,
  LogIn,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { GradientText } from "../ui/shadcn-io/gradient-text/index";
import CartDropdown from "./cartDropdown";
import { getGuestCartCount } from "@/utils/cart";
import { useFavorite } from "@/contexts/favoriteContext";
export default function Navbar() {
  const links = [
    {
      label: "Anasayfa",
      href: "/",
    },
    {
      label: "Ürünler",
      href: "/products",
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
    },
    {
      label: "İletişim",
      href: "/contact",
    },
    {
      label: "S.S.S",
      href: "/faq",
    },
  ];

  const [favoriteCount, setFavoriteCount] = useState(0);

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );
  const cartDropdownRef = useRef<{ open: () => void }>(null);
  const { favorites } = useFavorite();

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

  // Body scroll lock on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`sticky top-0 z-20 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-white/80 backdrop-blur-lg shadow-md border-b"
          : "py-5 bg-white/80"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-10  max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold font-[Playfair_Display]">
          <GradientText
            className="text-xl font-serif tracking-tighter"
            text="Moda Perde"
            gradient="linear-gradient(90deg, #4A0217 0%, #800020 60%, #C70039 100%)"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 h-full items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-1">
              {links.map((link, i) => (
                <NavigationMenuItem key={i}>
                  {link.subItems ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="px-4 py-2 font-medium"
                        >
                          {link.label}
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        {link.subItems.map((item, j) => (
                          <DropdownMenuItem key={j} asChild>
                            <Link href={item.href}>{item.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href={link.href}>
                      <Button variant="ghost">{link.label}</Button>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-0 md:gap-4">
          {/* Search */}
          <Link href={"/search"}>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Ara"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          {/* User / Profile Dropdown */}
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
                    <Link href="/register" className="flex items-center gap-2">
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
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Mobil menüyü kapat" : "Mobil menüyü aç"}
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
            className="fixed inset-0 bg-white/85 backdrop-blur-xl flex flex-col items-center justify-center gap-10 md:hidden z-[999] h-screen overflow-y-auto"
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
                    aria-label={`${link.label} sayfasına git`}
                    title={link.label}
                  >
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="text-zinc-900 text-2xl font-semibold tracking-wide hover:text-amber-400"
                      >
                        {link.label}
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
  );
}
