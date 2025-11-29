// components/navbar/Navbar.tsx
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
  ChevronDown,
} from "lucide-react";

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
import { usePathname, useRouter } from "next/navigation";
import { GradientText } from "../ui/shadcn-io/gradient-text/index";
import CartDropdown from "./cartDropdown";
import { getGuestCartCount } from "@/utils/cart";
import { useFavorite } from "@/contexts/favoriteContext";
import Image from "next/image";

import MobileNavSheet from "./mobileNavSheet";
import CollectionMegaMenu from "./collectionMegaMenu";
import UserMegaMenu from "./userMegaMenu";

export default function Navbar() {
  const links = [
    {
      label: "Anasayfa",
      href: "/",
      icon: LayoutGrid,
    },
    {
      label: "Koleksiyon",
      href: "/products",
      icon: Layers,
      subItems: [
        { label: "Tüm Perdeler", href: "/products" },
        { label: "Dikey", href: "/products/vertical" },
        { label: "Ahşap Jaluzi", href: "/products/wooden" },
        { label: "Metal Jaluzi", href: "/products/metal" },
        { label: "Stor", href: "/products/roller" },
        { label: "Lazer Kesim Stor", href: "/products/roller/laser-cut" },
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
      icon: Sparkles,
    },
    {
      label: "Bize Ulaşın",
      href: "/contact",
      icon: PhoneOutgoing,
    },
    {
      label: "S.S.S",
      href: "/faq",
      icon: MessageCircleQuestion,
    },
    {
      label: "Moda Blog",
      href: "/blog",
      icon: Feather,
    },
  ];

  const collectionLink = links.find((l) => l.label === "Koleksiyon")!;

  const [favoriteCount, setFavoriteCount] = useState(0);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );
  const cartDropdownRef = useRef<{ open: () => void }>(null);
  const { favorites } = useFavorite();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites", { credentials: "include" });
        if (res.status === 401) {
          setFavoriteCount(0);
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

    const handleFavoriteChange = (e: any) => {
      setFavoriteCount((prev) => prev + e.detail);
    };

    window.addEventListener("favoriteChanged", handleFavoriteChange);

    return () => {
      window.removeEventListener("favoriteChanged", handleFavoriteChange);
    };
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (!user) {
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white/90 backdrop-blur-xl shadow-md border-b border-gray-100"
            : "py-5 bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-10 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-18 h-12 md:w-22 md:h-14 lg:w-26 lg:h-16">
              <Image
                src="/logo/logo.webp"
                alt="Moda Perde 6"
                fill
                quality={100}
                className="object-contain"
                sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 208px"
              />
            </div>
          </Link>

          <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 h-full items-center ">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-4">
                {links.map((link, i) => {
                  const isActive =
                    link.href === "/products"
                      ? pathname.startsWith("/products")
                      : pathname === link.href;

                  return (
                    <NavigationMenuItem key={i} className="relative">
                      {link.label === "Koleksiyon" ? (
                        <>
                          <Button
                            variant="ghost"
                            className={`px-4 py-2 font-medium relative flex items-center gap-1 text-gray-700 hover:text-[#7B0323] transition-colors
                                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#7B0323] after:to-[#C70039]
                                after:transition-all after:duration-300
                                ${
                                  isActive || collectionOpen
                                    ? "after:w-full text-[#7B0323]"
                                    : "after:w-0 hover:after:w-full"
                                }`}
                            onClick={() => setCollectionOpen(!collectionOpen)}
                            data-id="collection-button"
                          >
                            {link.label}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-300 ${
                                collectionOpen ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </>
                      ) : link.subItems ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`px-4 py-2 font-medium relative text-gray-700 hover:text-[#7B0323] transition-colors
                                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#7B0323] after:to-[#C70039]
                                after:transition-all after:duration-300
                                ${
                                  isActive
                                    ? "after:w-full text-[#7B0323]"
                                    : "after:w-0 hover:after:w-full"
                                }`}
                            >
                              {link.label}
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className="bg-white/95 backdrop-blur-md shadow-lg rounded-lg border border-gray-100 mt-2">
                            {link.subItems.map((item, j) => {
                              const isSubActive = pathname === item.href;
                              return (
                                <DropdownMenuItem key={j} asChild>
                                  <Link
                                    href={item.href}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200
                                        ${
                                          isSubActive
                                            ? "text-[#7B0323] font-semibold bg-[#7B0323]/5"
                                            : "hover:text-[#7B0323] hover:bg-[#7B0323]/5"
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
                            className={`px-4 py-2 font-medium relative text-gray-700 hover:text-[#7B0323] transition-colors
                                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-[#7B0323] after:to-[#C70039]
                                after:transition-all after:duration-300
                                ${
                                  isActive
                                    ? "after:w-full text-[#7B0323]"
                                    : "after:w-0 hover:after:w-full"
                                }`}
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

          <div className="flex items-center gap-2 md:gap-4 font-sans">
            <Link href={"/search"}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Ara"
                className="hover:bg-gray-100 transition-colors"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Kullanıcı Menüsü"
              className={`hover:bg-gray-100 transition-colors relative ${
                userMenuOpen ? "bg-gray-100" : ""
              }`}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              data-id="user-button"
            >
              <User className="h-5 w-5 text-gray-700" />
              {user && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500 border border-white"></span>
              )}
            </Button>
            <Link href="/favorites" aria-label="Favoriler" className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Favoriler"
                className="hover:bg-gray-100 transition-colors"
              >
                <Heart className="h-5 w-5 text-gray-700" />
              </Button>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-1.5 h-5 w-5 rounded-full bg-gradient-to-r from-[#7B0323] to-[#C70039] text-white text-xs flex items-center justify-center font-medium shadow-md">
                  {favorites.length}
                </span>
              )}
            </Link>
            <CartDropdown />
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(true)}
                aria-label="Mobil menüyü aç"
                className="hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Koleksiyon Mega Menü */}
      <CollectionMegaMenu
        collectionOpen={collectionOpen}
        setCollectionOpen={setCollectionOpen}
        collectionLink={{
          ...collectionLink,
          subItems: collectionLink.subItems?.filter(
            (item) =>
              item.label !== "Tüm Perdeler" && item.label !== "Lazer Kesim Stor"
          ),
        }}
      />

      {/* Kullanıcı Mega Menü (Burada kalmalı) */}
      <UserMegaMenu
        user={user}
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
        scrolled={scrolled}
        pathname={pathname} // 🚨 YOLU GÖNDERİYORUZ
      />

      <MobileNavSheet
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={links as any}
      />
    </>
  );
}
