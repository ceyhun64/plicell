"use client";

import React, { useState, ChangeEvent, forwardRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export interface ProductFormData {
  title: string;
  description: string;
  pricePerM2: number;
  rating: number;
  reviewCount: number;
  category: string;
  subCategory?: string;
  room?: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  pricePerM2: number;
  rating: number;
  reviewCount?: number;
  category: string;
  subCategory?: string;
  room?: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
}

interface ProductDialogProps {
  onSubmit: (
    formData: ProductFormData,
    mainFile: File | null,
    subFile?: File | null,
    subFile2?: File | null,
    subFile3?: File | null,
    productId?: number
  ) => void;
  product?: Product; // Eğer varsa formu doldur (güncelleme)
  className?: string;
}

const ProductDialog = forwardRef<HTMLDivElement, ProductDialogProps>(
  ({ onSubmit, product, className }, ref) => {
    const [open, setOpen] = useState(false);

    const [productData, setProductData] = useState<ProductFormData>({
      title: "",
      description: "",
      pricePerM2: 0,
      rating: 0,
      reviewCount: 0,
      category: "",
      subCategory: "",
      room: "",
    });

    // 🔹 Sadece File | null kullan
    const [mainFile, setMainFile] = useState<File | null>(null);
    const [sub1, setSub1] = useState<File | null>(null);
    const [sub2, setSub2] = useState<File | null>(null);
    const [sub3, setSub3] = useState<File | null>(null);

    // Mevcut URL'ler preview için
    const [mainUrl, setMainUrl] = useState<string | null>(null);
    const [subUrl1, setSubUrl1] = useState<string | null>(null);
    const [subUrl2, setSubUrl2] = useState<string | null>(null);
    const [subUrl3, setSubUrl3] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const categories = [
      "Dikey Perde",
      "Ahşap Jaluzi",
      "Metal Jaluzi",
      "Perde Aksesuarları",
      "Stor Perde",
      "Zebra Perde",
      "Rüstik",
      "Tüller",
      "Fon",
      "Plise",
    ];

    const roomOptions = [
      "Salon",
      "Mutfak",
      "Yatak Odası",
      "Banyo",
      "Çocuk Odası",
      "Oturma Odası",
      "Ofis",
    ];

    useEffect(() => {
      if (product) {
        setProductData({
          title: product.title,
          description: product.description,
          pricePerM2: product.pricePerM2,
          rating: product.rating,
          reviewCount: product.reviewCount || 0,
          category: product.category,
          subCategory: product.subCategory || "",
          room: product.room || "",
        });

        setMainFile(null);
        setSub1(null);
        setSub2(null);
        setSub3(null);

        // Preview için mevcut URL'leri ata
        setMainUrl(product.mainImage || null);
        setSubUrl1(product.subImage || null);
        setSubUrl2(product.subImage2 || null);
        setSubUrl3(product.subImage3 || null);

        setOpen(true);
      } else {
        resetForm();
      }
    }, [product]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setProductData((prev) => ({
        ...prev,
        [name]:
          name === "pricePerM2" || name === "rating" || name === "reviewCount"
            ? Number(value)
            : value,
      }));
    };

    const handleFile = (e: ChangeEvent<HTMLInputElement>, setFile: any) => {
      const file = e.target.files?.[0] || null;
      setFile(file);
    };

    const resetForm = () => {
      setProductData({
        title: "",
        description: "",
        pricePerM2: 0,
        rating: 0,
        reviewCount: 0,
        category: "",
        subCategory: "",
        room: "",
      });
      setMainFile(null);
      setSub1(null);
      setSub2(null);
      setSub3(null);
      setMainUrl(null);
      setSubUrl1(null);
      setSubUrl2(null);
      setSubUrl3(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!productData.title || !productData.category) return;

      setLoading(true);
      onSubmit(productData, mainFile, sub1, sub2, sub3, product?.id);
      setLoading(false);
      resetForm();
      setOpen(false);
    };

    const preview = (file: File | null, url?: string | null) => {
      if (file) return URL.createObjectURL(file);
      return url || null;
    };

    return (
      <>
        {!product && (
          <Button
            className={`bg-[#92e676] hover:bg-[#001e59] text-white font-medium ${className}`}
            onClick={() => setOpen(true)}
          >
            Yeni Ürün Ekle
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white text-gray-900 max-w-5xl w-full rounded-lg shadow-2xl sm:max-h-[90vh] sm:overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#001e59]">
                {product ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Sol Form Alanı */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol: Form alanları */}
                <div className="space-y-4 bg-gray-50 p-5 rounded-lg border">
                  <InputGroup
                    label="Ürün Adı"
                    value={productData.title}
                    name="title"
                    onChange={handleChange}
                    required
                  />
                  <InputGroup
                    label="Açıklama"
                    value={productData.description}
                    name="description"
                    onChange={handleChange}
                    placeholder="Ürün açıklaması"
                  />
                  <InputGroup
                    label="Fiyat (m²)"
                    value={productData.pricePerM2}
                    name="pricePerM2"
                    onChange={handleChange}
                    type="number"
                    min={0}
                    required
                  />

                  <div>
                    <Label>Kategori</Label>
                    <Select
                      value={productData.category}
                      onValueChange={(val) =>
                        setProductData((prev) => ({ ...prev, category: val }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Oda</Label>
                    <Select
                      value={productData.room || ""}
                      onValueChange={(val) =>
                        setProductData((prev) => ({ ...prev, room: val }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Oda seç" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomOptions.map((room) => (
                          <SelectItem key={room} value={room}>
                            {room}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FileInput
                      label="Ana Görsel"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFile(e, setMainFile)
                      }
                    />
                    <FileInput
                      label="Alt Görsel 1"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFile(e, setSub1)
                      }
                    />
                    <FileInput
                      label="Alt Görsel 2"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFile(e, setSub2)
                      }
                    />
                    <FileInput
                      label="Alt Görsel 3"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFile(e, setSub3)
                      }
                    />
                  </div>
                </div>

                {/* Sağ: Önizleme alanı */}
                <div className="bg-gray-50 p-5 rounded-lg border flex flex-col md:flex-row gap-6 w-full">
                  {/* Sol: Görseller */}
                  <div className="grid grid-cols-2 gap-3 w-full md:w-1/2">
                    {[
                      { file: mainFile, url: mainUrl },
                      { file: sub1, url: subUrl1 },
                      { file: sub2, url: subUrl2 },
                      { file: sub3, url: subUrl3 },
                    ].map((img, i) => (
                      <div
                        key={i}
                        className="relative w-full h-40 border rounded-lg overflow-hidden hover:scale-105 transition-transform"
                      >
                        {preview(img.file, img.url) ? (
                          <Image
                            src={preview(img.file, img.url)!}
                            alt="preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Görsel {i + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Sağ: Ürün Bilgileri */}
                  <div className="flex flex-col justify-start md:w-1/2 space-y-2">
                    <p className="text-2xl font-bold text-[#001e59]">
                      {productData.title || "Ürün adı"}
                    </p>
                    {productData.description && (
                      <p className="text-gray-700 text-base">
                        {productData.description}
                      </p>
                    )}
                    <p className="text-gray-600 text-lg">
                      {productData.category || "Kategori Yok"}
                    </p>
                    {productData.room && (
                      <p className="text-gray-500 text-lg">
                        {productData.room}
                      </p>
                    )}
                    <p className="text-[#001e59] font-semibold text-xl">
                      {productData.pricePerM2 > 0
                        ? `${productData.pricePerM2} TL / m²`
                        : "Fiyat Yok"}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? product
                      ? "Güncelleniyor..."
                      : "Ekleniyor..."
                    : product
                    ? "Güncelle"
                    : "Ekle"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);
const InputGroup = ({ label, ...props }: any) => (
  <div>
    <Label>{label}</Label>
    <Input className="w-full" {...props} />
  </div>
);

const FileInput = ({ label, onChange }: any) => (
  <div>
    <Label>{label}</Label>
    <Input type="file" accept="image/*" onChange={onChange} />
  </div>
);

export default ProductDialog;
