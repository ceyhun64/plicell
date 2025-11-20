"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react"; // Info kaldırıldı
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cities from "@/public/city.json";

// Kullanılmayan alanlar (zip, phone, country) opsiyonel yapıldı,
// neighborhood formda zorunlu olduğu için zorunluluk kaldırıldı (API'ye göre).
export interface AddressFormData {
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district: string;
  neighborhood: string; // Formda zorunlu olduğu için opsiyonel değil
  zip?: string; // Formda yok, opsiyonel
  phone?: string; // Formda yok, opsiyonel
  country?: string; // Formda yok, opsiyonel (varsayılan Türkiye)
  email?: string; // ✅ Yeni eklendi
}

export interface AddressFormProps {
  formData: AddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  onSave: () => void;
}

interface City {
  id: string;
  name: string;
}
interface District {
  id: string;
  name: string;
}
interface Neighborhood {
  id: string;
  name: string;
}

export default function AdresForm({
  formData,
  setFormData,
  onSave,
}: AddressFormProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  useEffect(() => {
    // city.json'dan şehir adlarını yükle
    const cityArray: City[] = Object.entries(Cities).map(([id, name]) => ({
      id,
      name,
    }));
    setCities(cityArray);
  }, []);

  // İlçe fetch (Şehir seçimi değiştiğinde)
  useEffect(() => {
    if (!formData.city) {
      setDistricts([]);
      setNeighborhoods([]);
      setFormData((prev) => ({ ...prev, district: "", neighborhood: "" }));
      return;
    }

    // Seçilen şehrin ID'sini bul
    const selectedCityId = cities.find((c) => c.name === formData.city)?.id;
    if (!selectedCityId) return;

    fetch(`/api/location/ilceler/${selectedCityId}`)
      .then((res) => {
        if (!res.ok) throw new Error("İlçe verisi alınamadı");
        return res.json();
      })
      .then((data: District[]) => {
        setDistricts(data);
        setNeighborhoods([]);
        // İlçe listesi yenilendiği için ilçe ve mahalle sıfırlanmalı
        setFormData((prev) => ({ ...prev, district: "", neighborhood: "" }));
      })
      .catch(console.error);
  }, [formData.city, cities, setFormData]);

  // Mahalle fetch (İlçe seçimi değiştiğinde)
  useEffect(() => {
    if (!formData.district) {
      setNeighborhoods([]);
      setFormData((prev) => ({ ...prev, neighborhood: "" }));
      return;
    }

    // Seçilen ilçenin ID'sini bul
    const selectedDistrict = districts.find(
      (d) => d.name === formData.district
    );
    if (!selectedDistrict) return;

    fetch(`/api/location/mahalleler/${selectedDistrict.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Mahalle verisi alınamadı");
        return res.json();
      })
      .then((data: Neighborhood[]) => {
        setNeighborhoods(data);
        // Mahalle listesi yenilendiği için mahalle sıfırlanmalı
        setFormData((prev) => ({ ...prev, neighborhood: "" }));
      })
      .catch(console.error);
  }, [formData.district, districts, setFormData]);

  // Şehir Select Value'sunda name yerine ID kullanıldığı için,
  // onValueChange'de selectedCity.name'i atıyoruz.
  // İlçe Select Value'sunda ID kullanıldığı için,
  // onValueChange'de selectedDistrict.name'i atıyoruz.
  // Mahalle Select Value'sunda name kullanıldığı için,
  // onValueChange'de sadece name'i atıyoruz (Select'in kendisinden geliyor).

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      {/* Adres Başlığı */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="title" className="text-gray-700 font-medium">
          Adres Başlığı *
        </Label>
        <Input
          id="title"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Örneğin: Ev, İş..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      {/* Ad */}
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-gray-700 font-medium">
          Ad *
        </Label>
        <Input
          id="firstName"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Adınız"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
      </div>

      {/* Soyad */}
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-gray-700 font-medium">
          Soyad *
        </Label>
        <Input
          id="lastName"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Soyadınız"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">
          E-posta *
        </Label>
        <Input
          id="email"
          type="email"
          className="rounded-lg h-11 text-[15px]"
          placeholder="ornek@mail.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      {/* Şehir */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-gray-700 font-medium">
          Şehir *
        </Label>
        <Select
          value={cities.find((c) => c.name === formData.city)?.id || ""}
          onValueChange={(value) => {
            const selectedCity = cities.find((c) => c.id === value);
            setFormData((prev) => ({
              ...prev,
              city: selectedCity?.name || "",
              district: "",
              neighborhood: "",
            }));
          }}
          required
        >
          <SelectTrigger className="w-full h-11 rounded-lg text-[15px]">
            <SelectValue placeholder="Şehir seçiniz" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* İlçe */}
      <div className="space-y-2">
        <Label htmlFor="district" className="text-gray-700 font-medium">
          İlçe *
        </Label>
        <Select
          value={
            districts
              .find((d) => d.name === formData.district)
              ?.id.toString() || ""
          }
          onValueChange={(value) => {
            const selectedDistrict = districts.find(
              (d) => d.id.toString() === value
            );
            setFormData((prev) => ({
              ...prev,
              district: selectedDistrict?.name || "",
              neighborhood: "",
            }));
          }}
          disabled={!formData.city || districts.length === 0}
          required
        >
          <SelectTrigger className="w-full h-11 rounded-lg text-[15px]">
            <SelectValue placeholder="İlçe seçiniz" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((d) => (
              <SelectItem key={d.id} value={d.id.toString()}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mahalle */}
      <div className="space-y-2">
        <Label htmlFor="neighborhood" className="text-gray-700 font-medium">
          Mahalle *
        </Label>
        <Select
          value={formData.neighborhood}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, neighborhood: value || "" }))
          }
          disabled={!formData.district || neighborhoods.length === 0}
          required
        >
          <SelectTrigger className="w-full h-11 rounded-lg text-[15px]">
            <SelectValue placeholder="Mahalle seçiniz" />
          </SelectTrigger>
          <SelectContent>
            {neighborhoods.map((n) => (
              <SelectItem key={n.id} value={n.name}>
                {n.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posta Kodu */}
      <div className="space-y-2">
        <Label htmlFor="zip" className="text-gray-700 font-medium">
          Posta Kodu *
        </Label>
        <Input
          id="zipCode"
          className="rounded-lg h-11 text-[15px]"
          placeholder="00000"
          value={formData.zip}
          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
          required
        />
      </div>

      {/* Telefon */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700 font-medium">
          Telefon *
        </Label>
        <Input
          id="telefon"
          className="rounded-lg h-11 text-[15px]"
          placeholder="05XX XXX XX XX"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      {/* Adres Detayı */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address" className="text-gray-700 font-medium">
          Detaylı Adres *
        </Label>
        <Input
          id="address"
          className="rounded-lg h-11 text-[15px]"
          placeholder="Mahalle/Sokak/Cadde/Bina No"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
        />
      </div>

      {/* Kaydet */}
      <div className="md:col-span-2 flex justify-start mt-4">
        <Button
          type="submit"
          className="flex items-center gap-3 px-8 py-3 text-lg rounded-full shadow-lg bg-gradient-to-br from-[#7B0323] to-[#B3133C] hover:opacity-90 transition"
        >
          <Save size={18} /> Kaydet
        </Button>
      </div>
    </form>
  );
}
