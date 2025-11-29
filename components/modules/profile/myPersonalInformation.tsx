"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Sidebar from "./sideBar";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface UserData {
  name: string;
  surname: string;
  phone?: string | null;
  email: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  countryCode?: string;
}

export default function KisiselBilgilerim() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    countryCode: "90",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Kullanıcı verisini API'den çek ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", { method: "GET" });
        if (!res.ok) throw new Error("Kullanıcı bilgileri alınamadı");
        const data = await res.json();

        const userData = data.user;
        setUser(userData);
        setFormData({
          firstName: userData.name || "",
          lastName: userData.surname || "",
          phone: userData.phone?.replace("+90", "") || "",
          email: userData.email || "",
          countryCode: "90",
        });
      } catch (error) {
        console.error(error);
        toast.error("Kullanıcı bilgileri yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // --- Bilgileri Güncelle ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
            ? `+${formData.countryCode}${formData.phone}`
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Güncelleme başarısız oldu");
        return;
      }

      toast.success("Bilgiler başarıyla güncellendi!");
      setUser(data.user);
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  // --- Skeleton Ekranı ---
  if (loading)
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 justify-center items-start px-3 py-16 md:px-8 md:pt-16">
          <div className="w-full max-w-2xl space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Card className="shadow-xl border border-gray-200 rounded-xs overflow-hidden bg-white">
              <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-xs" />
                  </div>
                ))}
                <div className="md:col-span-2 mt-6">
                  <Skeleton className="h-10 w-48 rounded-xs" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Yetkisiz Erişim
      </div>
    );

  // --- Normal İçerik ---
  return (
    <div className="flex flex-col md:flex-row min-h-screen ">
      <Sidebar />

      <div className="flex flex-1 justify-center items-start px-4 py-14 md:px-10 md:pt-20 bg-gradient-to-b from-white via-amber-950/10 to-white">
        <div className="w-full max-w-3xl space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left space-y-2"
          >
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Kişisel Bilgilerim
            </h2>
            <p className="text-gray-600 text-lg">
              Profil bilgilerinizi buradan güncelleyebilirsiniz
            </p>
          </motion.div>

          {/* Modern Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="backdrop-blur-xl bg-white/60 shadow-2xl border border-white/40 rounded-xs"
          >
            <CardContent className="p-10">
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans"
                onSubmit={handleSave}
              >
                {/* Ad */}
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-gray-700 font-medium"
                  >
                    <span className="text-red-500">*</span> Ad
                  </Label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
                      size={20}
                    />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="pl-12 py-3 rounded-xl border-gray-300 group-hover:border-rose-300 focus:ring-2 focus:ring-rose-300"
                      required
                    />
                  </div>
                </div>

                {/* Soyad */}
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-gray-700 font-medium"
                  >
                    <span className="text-red-500">*</span> Soyad
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="py-3 rounded-xl border-gray-300 hover:border-rose-300 focus:ring-2 focus:ring-rose-300"
                    required
                  />
                </div>

                {/* Telefon */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Telefon
                  </Label>
                  <div className="flex rounded-xl border border-gray-300 bg-white overflow-hidden hover:border-rose-300 transition">
                    <div className="flex items-center justify-center px-4 text-sm text-gray-600 bg-gray-100 border-r">
                      +{formData.countryCode}
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="5xx xxx xx xx"
                      className="flex-1 border-none focus:ring-0 px-4"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* E-posta */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    <span className="text-red-500">*</span> E-posta
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
                      size={20}
                    />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-100 text-gray-500 cursor-not-allowed pl-12 py-3 rounded-xl"
                    />
                  </div>
                </div>

                {/* Kaydet Butonu */}
                <div className="md:col-span-2 flex justify-start mt-4">
                  <Button
                    type="submit"
                    className="flex items-center gap-3 px-8 py-3 text-lg rounded-full shadow-lg bg-gradient-to-br from-[#7B0323] to-[#B3133C] hover:opacity-90 transition"
                    disabled={saving}
                  >
                    {saving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <Save size={18} className="text-white" />
                      </motion.div>
                    ) : (
                      <Save size={18} className="text-white" />
                    )}
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
