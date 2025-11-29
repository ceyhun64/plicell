"use client";

import React, { useState } from "react";
import {
  Box,
  Users,
  ShoppingCart,
  Package,
  LogOut,
  Menu,
  X,
  FileText,
  Info,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

export default function AdminSidebar(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Yönetici Paneli",
      icon: Box,
      href: "/admin/dashboard",
    },
    {
      id: "products",
      label: "Ürünler",
      icon: Package,
      href: "/admin/products",
    },
    {
      id: "orders",
      label: "Siparişler",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    { id: "users", label: "Kullanıcılar", icon: Users, href: "/admin/users" },
    { id: "blogs", label: "Bloglar", icon: FileText, href: "/admin/blogs" },
    {
      id: "subscribers",
      label: "Aboneler",
      icon: Users,
      href: "/admin/subscribers",
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: Settings,
      href: "/admin/banner",
    },
  ];

  const active = menuItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  )?.id;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        toast.error("Çıkış yapılırken bir hata oluştu");
        return;
      }

      toast.success("Başarıyla çıkış yapıldı!");

      setTimeout(() => {
        router.push("/admin");
      }, 1000); // Toast görünmesi için delay
    } catch (error) {
      toast.error("Sunucu hatası! Çıkış yapılamadı.");
    }
  };

  const AdminInfo = (
    <div className="flex flex-col gap-2 p-4 border-t border-gray-200  rounded-md shadow-sm font-sans">
      {/* Kullanıcı Adı */}
      <span className="font-semibold text-gray-900 ">
        Feridun Polat
      </span>

      {/* Uyarı Mesajı */}
      <div className="flex items-center gap-2 text-amber-700  bg-yellow-50  p-2 rounded-md">
        <Info size={24} />
        <p className="text-sm">
          Lütfen admin sayfasından ayrılmadan önce çıkış yapınız.
        </p>
      </div>

      {/* Çıkış Butonu */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 mt-2 w-full py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-shadow shadow-md hover:shadow-lg"
      >
        <LogOut size={16} /> Çıkış Yap
      </button>
    </div>
  );

  // Desktop Sidebar
  const DesktopSidebar = (
    <>
      <AnimatePresence>
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed left-0 top-0 w-64 h-screen bg-white shadow-lg flex flex-col justify-between border-r border-gray-200 hidden md:flex"
        >
          <div>
            <div className="px-6 py-6 border-b border-gray-200 flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                ModaPerde<span className="text-[#7B0323]"> Admin</span>
              </span>
            </div>

            <nav className="flex flex-col mt-4 px-3 space-y-1">
              {menuItems.map(({ id, label, icon: Icon, href }) => {
                const isActive = active === id;
                return (
                  <Link
                    key={id}
                    href={href}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#7B0323]/20 text-[#001e59] shadow-inner font-semibold"
                        : "text-gray-600 hover:text-[#001e59] hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-[#7B0323]"
                          : "text-gray-400 group-hover:text-[#7B0323]"
                      }`}
                    />
                    <span className="text-sm">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {AdminInfo}
        </motion.aside>
      </AnimatePresence>
    </>
  );

  // Mobile Sidebar
  const MobileSidebar = (
    <>
      {!isOpen && (
        <Button
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 w-12 h-12 p-3 bg-white rounded-full shadow-lg text-[#001e59] border border-gray-300 hover:bg-gray-100 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md shadow-xl md:hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
              <span className="text-xl font-bold text-gray-900">
                ModaPerde<span className="text-[#7B0323]"> Admin</span>
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto mt-4 px-4 space-y-1">
              {menuItems.map(({ id, label, icon: Icon, href }) => {
                const isActive = active === id;
                return (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#7B0323]/20 text-[#001e59] shadow-inner font-semibold"
                        : "text-gray-600 hover:text-[#001e59] hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-[#7B0323]"
                          : "text-gray-400 group-hover:text-[#7B0323]"
                      }`}
                    />
                    <span className="text-sm">{label}</span>
                  </Link>
                );
              })}
            </nav>

            {AdminInfo}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <div className="hidden md:block">{DesktopSidebar}</div>
      <div className="block md:hidden">{MobileSidebar}</div>
    </>
  );
}
