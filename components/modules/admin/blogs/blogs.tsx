"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
import AddBlogDialog from "./addBlog";
import UpdateBlogDialog from "./updateBlog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
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

interface Blog {
  id: number; // primitive number
  title: string; // primitive string
  content: string;
  image: string;
  category: string;
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white text-gray-800 rounded-xs border border-gray-200 shadow-lg font-sans">
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
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function Blogs(): React.ReactElement {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useIsMobile();

  // API’den blogları çek
  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (res.ok && data.blogs) setBlogs(data.blogs);
    } catch (err) {
      console.error("Bloglar alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filtreleme + Arama
  const filteredBlogs = blogs
    .filter((b) =>
      filter === "all"
        ? true
        : (b.category as string).toLowerCase() === filter.toLowerCase()
    )
    .filter((b) =>
      (b.title as string).toLowerCase().includes(search.toLowerCase())
    );

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  // Tek blog silme
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => Number(b.id) !== id));
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
        toast.success("Blog başarıyla silindi");
      } else {
        const data = await res.json();
        toast.error(data.message || "Blog silinemedi ");
      }
    } catch (err) {
      console.error(err);
      toast.error("Blog silinirken bir hata oluştu ");
    }
  };

  // Toplu silme
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    try {
      await Promise.all(
        selectedIds.map((id) => fetch(`/api/blog/${id}`, { method: "DELETE" }))
      );
      setBlogs((prev) =>
        prev.filter((b) => !selectedIds.includes(Number(b.id)))
      );
      setSelectedIds([]);
      toast.success(`${selectedIds.length} blog başarıyla silindi `);
    } catch (err) {
      console.error(err);
      toast.error("Seçilen bloglar silinirken bir hata oluşt ");
    }
  };

  // Tümünü seç
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedBlogs.map((b) => Number(b.id)));
    } else {
      setSelectedIds([]);
    }
  };

  // Tek blog seç
  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
        {/* Başlık */}
        <div className="flex flex-col sm:flex-row justify-center md:justify-between md:items-start items-center mb-6 mt-3 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#001e59]">
            Blog Yönetimi
          </h1>
        </div>

        {/* Üst Araç Çubuğu */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <DeleteDialog
              onConfirm={handleDeleteSelected}
              trigger={
                <Button
                  className={`w-full sm:w-auto rounded-xs shadow-sm transition-all ${
                    selectedIds.length > 0
                      ? "bg-[#001e59] hover:bg-[#003080] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={selectedIds.length === 0}
                >
                  Seçilenleri Sil ({selectedIds.length})
                </Button>
              }
              title="Seçilen Blogları Sil"
              description={`Toplam ${selectedIds.length} blogu silmek istediğine emin misin?`}
            />

            <AddBlogDialog
              onAdd={(newBlog) => setBlogs((prev) => [...prev, newBlog])}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            {/* 🔸 Dinamik Kategori Filtresi (Select) */}
            <Select onValueChange={(val) => setFilter(val)} value={filter}>
              <SelectTrigger className="w-full sm:w-48 bg-white border border-gray-300 rounded-xs text-gray-900 focus:ring-2 focus:ring-[#001e59]/20">
                <SelectValue placeholder="Kategori seç" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-xs text-gray-900">
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {Array.from(
                  new Set(blogs.map((b) => b.category).filter(Boolean))
                ).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Blog başlığına göre ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xs bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-[#001e59]/20"
            />
          </div>
        </div>

        {/* Blog Tablosu */}
        <div className="bg-white border border-gray-200 rounded-xs shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === paginatedBlogs.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                  ID
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                  Başlık
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 hidden sm:table-cell">
                  Kategori
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-center">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Blog bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((blog) => (
                  <motion.tr
                    key={Number(blog.id)}
                    className="hover:bg-gray-50 transition-all duration-150"
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(Number(blog.id))}
                        onChange={() => handleSelectOne(Number(blog.id))}
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                      {Number(blog.id)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 font-medium text-gray-900">
                      {blog.title as string}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 hidden sm:table-cell">
                      <Badge variant="outline">
                        {blog.category || "Kategori yok"}
                      </Badge>
                    </td>

                    <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-center">
                      <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <UpdateBlogDialog
                          blog={blog}
                          onUpdate={(updated) =>
                            setBlogs((prev) =>
                              prev.map((b) =>
                                Number(b.id) === Number(updated.id)
                                  ? updated
                                  : b
                              )
                            )
                          }
                        />

                        <DeleteDialog
                          onConfirm={() => handleDelete(Number(blog.id))}
                          trigger={
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white rounded-xs shadow-sm"
                            >
                              Sil
                            </Button>
                          }
                          title="Blogu Sil"
                          description={`"${blog.title}" adlı blogu silmek istediğine emin misin?`}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
        <div className="mt-6 flex justify-center">
          <DefaultPagination
            totalItems={filteredBlogs.length}
            itemsPerPage={15}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}
