"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductTable from "./productTable";
import { toast } from "sonner";
import ProductDialog, { ProductFormData } from "./productDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Product {
  id: number;
  title: string;
  description: string;
  pricePerM2: number;
  rating: number;
  reviewCount?: number;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  category: string;
  subCategory?: string;
  room?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Products(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const isMobile = useIsMobile();

  // ===================== API FETCH =====================
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) setProducts(data.products);
      else toast.error(data.error);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
      toast.error("Ürünler alınırken hata oluştu!");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Dialog kapandığında seçili ürün temizlenir
  useEffect(() => {
    if (!addDialogOpen) setSelectedProduct(null);
    if (!deleteDialogOpen) setProductToDelete(null);
  }, [addDialogOpen, deleteDialogOpen]);

  // ===================== FILTRELEME =====================
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

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/\s+/g, "-");

  const filteredProducts = products
    .filter((p) =>
      filter === "all" ? true : normalize(p.category) === normalize(filter)
    )
    .filter((p) =>
      filter.toLowerCase() === "plicell" && subFilter !== "all"
        ? normalize(p.subCategory || "") === normalize(subFilter)
        : true
    )
    .filter((p) =>
      roomFilter === "all"
        ? true
        : normalize(p.room || "") === normalize(roomFilter)
    )
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  // ===================== ÜRÜN EKLE / GÜNCELLE =====================
  const handleSubmitProduct = async (
    formData: ProductFormData,
    mainFile: File | null,
    subFile?: File | null,
    subFile2?: File | null,
    subFile3?: File | null,
    productId?: number
  ) => {
    try {
      const dataForm = new FormData();
      dataForm.append("title", formData.title);
      dataForm.append("description", formData.description);
      dataForm.append("pricePerM2", String(formData.pricePerM2));
      dataForm.append("rating", String(formData.rating));
      dataForm.append("reviewCount", String(formData.reviewCount || 0));
      dataForm.append("category", formData.category);
      if (formData.subCategory)
        dataForm.append("subCategory", formData.subCategory);
      if (formData.room) dataForm.append("room", formData.room);
      if (mainFile) dataForm.append("file", mainFile);
      if (subFile) dataForm.append("subImageFile", subFile);
      if (subFile2) dataForm.append("subImage2File", subFile2);
      if (subFile3) dataForm.append("subImage3File", subFile3);

      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: dataForm });
      const data = await res.json();

      if (res.ok) {
        toast.success(
          productId ? "Ürün başarıyla güncellendi!" : "Ürün başarıyla eklendi!"
        );
        fetchProducts();
        setAddDialogOpen(false);
        setSelectedProduct(null);
      } else {
        toast.error(data.error || "İşlem başarısız!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sunucu hatası oluştu!");
    }
  };

  // ===================== SİLME İŞLEMLERİ =====================
  const confirmDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Ürün silindi!");
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      } else {
        const data = await res.json();
        toast.error(data.error || "Silme başarısız");
      }
    } catch (err) {
      console.error(err);
      toast.error("Beklenmedik bir hata oluştu.");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      setSelectedIds([]);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/products/${id}`, { method: "DELETE" })
        )
      );
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      toast.success("Seçilen ürünler silindi!");
    } catch (err) {
      console.error(err);
      toast.error("Seçilen ürünler silinirken hata oluştu!");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // ===================== SEÇİM İŞLEMLERİ =====================
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(paginatedProducts.map((p) => p.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // ===================== RENDER =====================
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar: mobilde collapsible veya üstte hamburger olabilir */}
      <Sidebar />

      <main
        className={`flex-1 p-4 md:p-8 transition-all ${
          isMobile ? "" : "md:ml-64"
        }`}
      >
        {/* Başlık */}
        <div className="flex flex-col sm:flex-row justify-center md:justify-between md:items-start items-center mb-6 mt-3 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#001e59]">
            Ürün Yönetimi
          </h1>
        </div>

        {/* Araç Çubuğu */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              className={`px-4 py-2 rounded-xs text-sm font-medium transition-all shadow-sm ${
                selectedIds.length > 0
                  ? "bg-[#001e59] text-white hover:bg-[#002e88]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={selectedIds.length === 0}
              onClick={confirmDeleteSelected}
            >
              Seçilenleri Sil ({selectedIds.length})
            </Button>

            <ProductDialog
              className="px-4 py-2"
              onSubmit={handleSubmitProduct}
              product={selectedProduct ?? undefined}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select onValueChange={setFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-48 bg-white border border-gray-200 text-gray-800 rounded-xs shadow-sm">
                <SelectValue placeholder="Kategori seç" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 text-gray-800 rounded-xs">
                <SelectItem value="all">Tüm Ürünler</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* {filter.toLowerCase() === "plicell" && (
          <Select onValueChange={setSubFilter} defaultValue="all">
            <SelectTrigger className="w-full sm:w-48 bg-white border border-gray-200 text-gray-800 rounded-xs shadow-sm">
              <SelectValue placeholder="Alt kategori seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="Bella">Bella</SelectItem>
              <SelectItem value="Valeria">Valeria</SelectItem>
              <SelectItem value="Spark">Spark</SelectItem>
              <SelectItem value="Merlin">Merlin</SelectItem>
              <SelectItem value="Duble Linen">Duble Linen</SelectItem>
              <SelectItem value="Elegant">Elegant</SelectItem>
              <SelectItem value="Dimout">Dimout</SelectItem>
              <SelectItem value="Blackout">Blackout</SelectItem>
              <SelectItem value="Honeycomb20">Honeycomb20</SelectItem>
              <SelectItem value="Honeycomb16">Honeycomb16</SelectItem>
            </SelectContent>
          </Select>
        )} */}

            <Select onValueChange={setRoomFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-48 bg-white border border-gray-200 text-gray-800 rounded-xs shadow-sm">
                <SelectValue placeholder="Oda seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Odalar</SelectItem>
                {roomOptions.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Ürün adına göre ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-white border border-gray-200 rounded-xs text-gray-800 shadow-sm focus:ring-2 focus:ring-[#001e59] focus:outline-none"
            />
          </div>
        </div>

        {/* Ürün Tablosu */}
        <div className="overflow-x-auto">
          <ProductTable
            products={paginatedProducts}
            onDeleteClick={confirmDeleteProduct}
            onUpdateClick={(product) => setSelectedProduct(product)}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            selectedIds={selectedIds}
          />
        </div>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Ürünü Sil</DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-sm text-gray-600">
              {productToDelete
                ? `"${productToDelete.title}" adlı ürünü silmek istiyor musunuz?`
                : selectedIds.length > 0
                ? `${selectedIds.length} ürün silinecek.`
                : "Ürün seçilmedi."}
            </p>
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={
                  productToDelete
                    ? handleDeleteProduct
                    : handleDeleteSelectedProducts
                }
              >
                Sil
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <DefaultPagination
            totalItems={filteredProducts.length}
            itemsPerPage={15}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}
