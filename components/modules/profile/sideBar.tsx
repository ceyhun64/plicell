"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, MapPin, Package, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface User {
  name: string;
  surname: string;
}

interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: Record<string, MenuItem[]> = {
    "Kişisel Bilgiler": [
      {
        name: "Kişisel Bilgilerim",
        path: "/profile",
        icon: <User size={16} />,
      },
      {
        name: "Adreslerim",
        path: "/profile/addresses",
        icon: <MapPin size={16} />,
      },
    ],
    "Sipariş Bilgileri": [
      {
        name: "Siparişlerim",
        path: "/profile/orders",
        icon: <Package size={16} />,
      },
    ],
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/account/check");
        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("Kullanıcı bilgisi alınamadı", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Bilgi güncelleme event’ini dinle
    const handleUserUpdated = () => {
      fetchUser();
    };

    window.addEventListener("user-updated", handleUserUpdated);

    if (!isMobile) setIsOpen(true);
    else setIsOpen(false);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdated);
    };
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast.error("Çıkış yaptınız."); // 🔹 Toast ekledik
      router.push("/");
    } catch (err) {
      console.error("Çıkış yapılamadı", err);
      toast.error("Çıkış sırasında bir hata oluştu."); // 🔹 Hata toast
    }
  };

  return (
    <Card className="flex flex-col  justify-start bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm w-full max-w-md md:w-80 md:min-h-screen">
      <CardContent className="px-6 py-1 md:p-8 flex flex-col justify-start space-y-8 h-full">
        {/* Kullanıcı Bilgisi + Toggle */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* User Info */}
          <div>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            ) : (
              <>
                {/* Premium User Name */}
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  {user ? `${user.name} ${user.surname}` : "Misafir Kullanıcı"}
                </h2>

                {/* Logout Button */}
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 mt-2 px-2 py-1 rounded-md transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Çıkış Yap</span>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Accordion Arrow */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </div>

        {/* Accordion Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-8 mt-2"
            >
              {Object.entries(menuItems).map(([kategori, items]) => (
                <div key={kategori} className="space-y-3">
                  {/* Category Title */}
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider pl-1">
                    {kategori}
                  </h3>

                  {/* Menu Items */}
                  <ul className="flex flex-col gap-1">
                    {items.map((item) => {
                      const isActive = pathname === item.path;

                      return (
                        <motion.li
                          key={item.path}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Link
                            href={item.path}
                            className={`
                          group flex items-center gap-3 text-sm p-3 rounded-xl transition-all relative overflow-hidden
                          ${
                            isActive
                              ? "bg-rose-50 text-rose-700 font-semibold"
                              : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                          >
                            {/* Active Highlight Bar */}
                            {isActive && (
                              <div className="absolute left-0 top-0 h-full w-1 bg-rose-600 rounded-r-lg"></div>
                            )}

                            <span className="text-gray-600 group-hover:text-gray-900">
                              {item.icon}
                            </span>
                            <span>{item.name}</span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
