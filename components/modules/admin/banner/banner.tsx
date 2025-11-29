"use client";

import React, { useState, useEffect, useMemo } from "react";
// ... Diğer import'lar
import Sidebar from "@/components/modules/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Yükleme ikonu için örnek

// ... Banner ve DeleteDialogProps interface'leri aynı kalır
interface Banner {
  id: number;
  title: string;
  subtitle: string;
}

interface DeleteDialogProps {
  onConfirm: () => void;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  onConfirm,
  trigger,
  title = "Silme İşlemi",
  description = "Bu işlemi yapmak istediğine emin misin?",
}) => {
  const [open, setOpen] = useState(false);
  // Silme butonu için ekstra loading state eklenebilir.
  // const [isDeleting, setIsDeleting] = useState(false);

  // onConfirm'e basıldığında bekleme durumunu yönetmek daha iyi olabilir.
  const handleConfirm = () => {
    // setIsDeleting(true); // eğer onConfirm async değilse burada bekleme olmaz
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white text-gray-800 border rounded-xs shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#001e59]">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm} // Fonksiyon değiştirildi
          >
            Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function Banners(): React.ReactElement {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");

  // Yükleme durumu eklendi
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const isMobile = useIsMobile();
  const ITEMS_PER_PAGE = 15; // Sabit bir değişken tanımlandı

  // --- Veri Çekme ---
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/banner");
      const data = await res.json();
      if (res.ok && data.banners) setBanners(data.banners);
    } catch (err) {
      console.error("Bannerlar alınamadı:", err);
      toast.error("Bannerlar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // --- Filtreleme ve Sayfalama (useMemo ile performans iyileştirmesi) ---
  const filtered = useMemo(() => {
    return banners.filter((b) =>
      b.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [banners, search]);

  const paginated = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, ITEMS_PER_PAGE]);

  // Sayfalama, filtreleme değiştiğinde 1'e sıfırlanmalı
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // --- İşlemler (CRUD) ---

  const handleAddBanner = async () => {
    if (!newTitle.trim() || !newSubtitle.trim()) {
      toast.error("Tüm alanlar zorunludur.");
      return;
    }

    setIsAdding(true);
    try {
      // JSON formatında gönderme (API'nizin bunu desteklediğini varsayarak)
      const res = await fetch("/api/banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          subtitle: newSubtitle,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setBanners((prev) => [...prev, data.banner]);
        setNewTitle("");
        setNewSubtitle("");
        toast.success("Banner başarıyla eklendi");
      } else {
        toast.error(data.message || "Banner eklenemedi");
      }
    } catch (err) {
      console.error(err);
      toast.error("Banner ekleme hatası");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("id:", id);
      const res = await fetch(`/api/banner/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // opsiyonel, bazı durumlarda gerekli
        },
      });

      const data = await res.json();

      if (res.ok) {
        // State güncellemesi
        setBanners((prev) => prev.filter((b) => b.id !== id));
        setSelectedIds((prev) => prev.filter((x) => x !== id));

        toast.success(data.message || "Banner başarıyla silindi");
      } else {
        toast.error(data.message || "Silinemedi");
      }
    } catch (err) {
      console.error("Banner silme hatası:", err);
      toast.error("Silme hatası oluştu");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Promise.all, tüm silme işlemlerinin paralel bitmesini bekler
      const deletePromises = selectedIds.map((id) =>
        fetch(`/api/banner/${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const successfulDeletes = results.filter((r) => r.ok).length;

      if (successfulDeletes > 0) {
        const deletedIdsSet = new Set(
          results.filter((r) => r.ok).map((r, index) => selectedIds[index])
        );

        setBanners((prev) => prev.filter((b) => !deletedIdsSet.has(b.id)));
        toast.success(`${successfulDeletes} adet banner başarıyla silindi.`);
      } else {
        toast.error("Hiçbir banner silinemedi.");
      }
      setSelectedIds([]); // Her durumda seçimi temizle
    } catch (err) {
      console.error(err);
      toast.error("Toplu silme hatası");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />

      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
        {/* Başlık + Yeni Banner Ekle */}
        <div className="flex flex-col sm:flex-row justify-center md:justify-between md:items-start items-center mb-6 mt-3 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#001e59]">
            Başlık Yönetimi
          </h1>
        </div>
        <div className="bg-white border p-4 rounded-xs shadow-md w-full mb-4">
          <h2 className="font-semibold text-lg mb-2">Yeni Banner Ekle</h2>
          <Input
            placeholder="Başlık"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mb-2"
            disabled={isAdding} // Ekleme yapılırken devre dışı bırak
          />

          <Input
            placeholder="Alt Başlık"
            value={newSubtitle}
            onChange={(e) => setNewSubtitle(e.target.value)}
            className="mb-3"
            disabled={isAdding} // Ekleme yapılırken devre dışı bırak
          />

          <Button
            className="w-25 bg-[#001e59] text-white"
            onClick={handleAddBanner}
            disabled={isAdding || !newTitle.trim() || !newSubtitle.trim()} // Buton durumu iyileştirildi
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ekleniyor...
              </>
            ) : (
              "Ekle"
            )}
          </Button>
        </div>

        {/* Kart / İçerik Durumu */}
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-[#001e59]" />
            <p className="text-lg text-gray-600">Bannerlar yükleniyor...</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">
            {search
              ? "Arama kriterlerinize uygun banner bulunamadı."
              : "Henüz hiç başlık eklenmemiş."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtered.map((banner) => (
              <div
                key={banner.id}
                className="w-full bg-white border rounded-lg shadow-md p-6 flex flex-col justify-between relative"
              >
               
                {/* Başlık ve alt başlık */}
                <h2 className="text-lg font-bold mb-2">{banner.title}</h2>
                <p className="text-gray-600 mb-4">{banner.subtitle}</p>

                {/* Silme butonu */}
                <DeleteDialog
                  onConfirm={() => handleDelete(banner.id)}
                  trigger={
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2 w-25" 
                    >
                      Sil
                    </Button>
                  }
                  title="Banner Sil"
                  description={`"${banner.title}" başlıklı banner silinecektir. Emin misiniz?`}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
