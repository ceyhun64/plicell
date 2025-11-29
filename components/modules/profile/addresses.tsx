"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sideBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, PlusCircle, Save, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AdresForm from "./addressForm";

interface Address {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  city: string;
  neighborhood?: string;
  zip?: string;
  phone?: string;
  country?: string;
  email?: string;
  tcno?: string; // 🚨 API'deki tcno alanı eklendi
}

interface AddressFormData {
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district: string;
  neighborhood: string;
  zip?: string;
  phone?: string;
  country?: string; // POST API'sinde zorunlu, bu yüzden opsiyonel yapmadım.
  email?: string;
  tcno?: string; // 🚨 API'deki tcno alanı eklendi
}

export default function Adreslerim() {
  const [adresler, setAdresler] = useState<Address[]>([]);
  const [yeniAdresForm, setYeniAdresForm] = useState(false);
  const [duzenleForm, setDuzenleForm] = useState(false);
  const [duzenlenenAdres, setDuzenlenenAdres] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  const initialFormData: AddressFormData = {
    title: "",
    firstName: "",
    lastName: "",
    address: "",
    district: "",
    city: "",
    neighborhood: "",
    zip: "",
    phone: "",
    country: "Türkiye", // Varsayılan ülke
    email: "",
    tcno: "", // 🚨 Varsayılan tcno
  };

  const [ekleFormData, setEkleFormData] =
    useState<AddressFormData>(initialFormData);

  const [duzenleFormData, setDuzenleFormData] =
    useState<AddressFormData>(initialFormData);

  // 🔹 Adresleri Yükle (GET API'sine göre güncellendi)
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/address", { method: "GET" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Adresler yüklenemedi.");

        const addressesWithDefaults: Address[] = (data.addresses || []).map(
          (a: Address) => ({
            ...a,
            neighborhood: a.neighborhood || "",
            zip: a.zip || "",
            phone: a.phone || "",
            country: a.country || "Türkiye",
            tcno: a.tcno || "", // 🚨 tcno varsayılan ataması
          })
        );
        setAdresler(addressesWithDefaults);
      } catch (error) {
        console.error(error);
        toast.error("Adresler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // 🔹 Adres Silme (Kodda değişiklik yok, API ile uyumlu)
  const handleSil = async (id: number) => {
    try {
      const res = await fetch(`/api/address/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Adres silinemedi.");
      setAdresler((prev) => prev.filter((a) => a.id !== id));
      toast.success("Adres başarıyla silindi.");
    } catch (error) {
      console.error(error);
      toast.error("Adres silinirken bir hata oluştu.");
    }
  };

  // 🔹 Yeni Adres Ekle (POST API zorunlu alanlarına göre güncellendi)
  const handleEkleKaydet = async () => {
    // POST API'sindeki zorunlu alanlar: firstName, lastName, address, district, city, country
    if (
      !ekleFormData.firstName ||
      !ekleFormData.lastName ||
      !ekleFormData.address ||
      !ekleFormData.district ||
      !ekleFormData.city ||
      !ekleFormData.country
    ) {
      // 🚨 Zorunlu alan kontrolü API'ye göre ayarlandı
      toast.error(
        "Lütfen alıcı adı/soyadı, adres, il, ilçe ve ülke gibi tüm zorunlu alanları doldurun."
      );
      return;
    }

    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // FormData'yı olduğu gibi gönderiyoruz
        body: JSON.stringify(ekleFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Adres eklenemedi.");

      // Yeni eklenen adresin alanlarını varsayılanlarla dolduruyoruz
      const newAddress: Address = {
        ...data.address,
        neighborhood: data.address.neighborhood || "",
        zip: data.address.zip || "",
        phone: data.address.phone || "",
        country: data.address.country || "Türkiye",
        tcno: data.address.tcno || "", // 🚨 tcno ataması
      };

      setAdresler((prev) => [newAddress, ...prev]);
      toast.success("Adres başarıyla eklendi.");
      setYeniAdresForm(false);
      setEkleFormData(initialFormData); // Formu temizle
    } catch (error) {
      console.error(error);
      toast.error("Adres eklenirken bir hata oluştu.");
    }
  };

  // 🔹 Adres Düzenleme
  const handleDuzenle = (adres: Address) => {
    setDuzenlenenAdres(adres);
    setDuzenleFormData({
      title: adres.title,
      firstName: adres.firstName,
      lastName: adres.lastName,
      address: adres.address,
      district: adres.district,
      city: adres.city,
      neighborhood: adres.neighborhood || "",
      zip: adres.zip || "",
      phone: adres.phone || "",
      country: adres.country || "Türkiye",
      email: adres.email,
      tcno: adres.tcno || "", // 🚨 tcno değeri
    });
    setDuzenleForm(true);
    setYeniAdresForm(false); // Yeni adres formunu kapat
  };

  // 🔹 Adres Düzenleme Kaydet (PATCH API zorunlu alanlarına göre güncellendi)
  const handleDuzenleKaydet = async () => {
    if (!duzenlenenAdres) return;

    // PATCH API'sindeki alanlar isteğe bağlı olarak gönderilebilir, ancak
    // kullanıcının formu boş bırakıp kaydetmesini engellemek için mevcut frontend
    // zorunlu alan kontrolünü kullanıyoruz. Daha temiz bir UX için zorunlu alanlar
    // POST API'si ile aynı olmalıdır.
    if (
      !duzenleFormData.firstName ||
      !duzenleFormData.lastName ||
      !duzenleFormData.address ||
      !duzenleFormData.district ||
      !duzenleFormData.city ||
      !duzenleFormData.country
    ) {
      // 🚨 Zorunlu alan kontrolü güncellendi
      toast.error(
        "Lütfen alıcı adı/soyadı, adres, il, ilçe ve ülke gibi tüm zorunlu alanları doldurun."
      );
      return;
    }

    try {
      const res = await fetch(`/api/address/${duzenlenenAdres.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // FormData'yı olduğu gibi gönderiyoruz
        body: JSON.stringify(duzenleFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Adres güncellenemedi.");

      // Güncellenen adresin alanlarını varsayılanlarla dolduruyoruz
      const updatedAddress: Address = {
        ...data.address,
        neighborhood: data.address.neighborhood || "",
        zip: data.address.zip || "",
        phone: data.address.phone || "",
        country: data.address.country || "Türkiye",
        tcno: data.address.tcno || "", // 🚨 tcno ataması
      };

      setAdresler((prev) =>
        prev.map((a) => (a.id === duzenlenenAdres.id ? updatedAddress : a))
      );
      toast.success("Adres başarıyla güncellendi.");
      setDuzenleForm(false);
      setDuzenlenenAdres(null);
    } catch (error) {
      console.error(error);
      toast.error("Adres güncellenirken bir hata oluştu.");
    }
  };

  // 🔸 Skeleton Yükleme (Kodda değişiklik yok)
  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 justify-center items-start px-3 py-16 md:px-8 md:pt-16">
          <div className="w-full max-w-2xl space-y-6">
            {[...Array(2)].map((_, i) => (
              <Card
                key={i}
                className="shadow-xl border border-gray-200 rounded-xs bg-white"
              >
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex justify-end gap-2 pt-4">
                    <Skeleton className="h-8 w-8 rounded-xs" />
                    <Skeleton className="h-8 w-8 rounded-xs" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🔸 Normal render
  return (
    <div className="flex flex-col md:flex-row min-h-screen ">
      <Sidebar />

      <div className="flex flex-1 justify-center items-start px-4 md:px-10 py-20 bg-gradient-to-b from-white via-amber-950/10 to-white">
        <div className="w-full max-w-3xl space-y-10">
          {/* Başlık */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Sol kısım */}
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                Adreslerim
              </h2>
              <p className="text-gray-600 text-lg">
                Kayıtlı adreslerinizi buradan yönetin, düzenleyin veya yenisini
                ekleyin.
              </p>
            </div>

            {/* Sağ kısım (buton) */}
            <Button
              onClick={() => {
                setYeniAdresForm((prev) => !prev);
                setDuzenleForm(false);
                setEkleFormData(initialFormData);
              }}
              className=" flex items-center gap-2 border border-gray-300  shadow-sm bg-gradient-to-br from-[#7B0323] to-[#B3133C] text-white hover:text-white/90 px-4 py-2 rounded-full hover:opacity-90 transition"
              variant="ghost"
            >
              {yeniAdresForm ? (
                <X size={20} />
              ) : (
                <>
                  <PlusCircle size={20} />
                  <span className="font-medium">Yeni Adres Ekle</span>
                </>
              )}
            </Button>
          </motion.div>

          {/* Formlar */}
          <AnimatePresence>
            {yeniAdresForm && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="shadow-xl border border-gray-200 bg-white rounded-xs">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-6">
                      Yeni Adres Ekle
                    </h3>
                    <AdresForm
                      formData={ekleFormData}
                      setFormData={setEkleFormData}
                      onSave={handleEkleKaydet}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {duzenleForm && duzenlenenAdres && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="shadow-xl border border-gray-200 bg-white rounded-xs">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-6">
                      {duzenlenenAdres.title} adresini düzenle
                    </h3>
                    <AdresForm
                      formData={duzenleFormData}
                      setFormData={setDuzenleFormData}
                      onSave={handleDuzenleKaydet}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Adresler */}
          {!yeniAdresForm && !duzenleForm && (
            <div className="flex flex-col gap-5 font-sans">
              {adresler.length > 0 ? (
                adresler.map((a) => (
                  <Card
                    key={a.id}
                    className="
                    bg-white border border-gray-200 rounded-xs shadow-md 
                    hover:shadow-lg transition-shadow
                  "
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        {/* Sol Bilgi */}
                        <div className="space-y-1.5">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {a.title}
                          </h3>

                          <p className="text-gray-700">
                            {a.firstName} {a.lastName}
                          </p>

                          <p className="text-gray-600">{a.address}</p>

                          <p className="text-gray-600">
                            {a.neighborhood && `${a.neighborhood}, `}
                            {a.district} — {a.city} {a.zip}
                          </p>

                          {/* 🚨 tcno'yu opsiyonel olarak göster */}
                          {a.tcno && (
                            <p className="text-sm text-gray-500">
                              TC: {a.tcno}
                            </p>
                          )}

                          {a.phone && (
                            <p className="text-gray-600">{a.phone}</p>
                          )}

                          <p className="text-gray-600">{a.country}</p>
                        </div>

                        {/* Sağ Butonlar */}
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleDuzenle(a)}
                            className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
                          >
                            <Edit className="w-5 h-5" />
                          </Button>

                          <Button
                            onClick={() => handleSil(a.id)}
                            className="w-10 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
                  <p className="text-gray-700 text-lg">
                    Henüz bir adres eklemediniz.
                  </p>
                  <p className="text-gray-500 mt-1">
                    Yeni adres ekleyerek başlayabilirsiniz.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
