"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChangeEvent } from "react";

export interface Product {
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

export interface ProductTableProps {
  products: Product[];
  selectedIds: number[];
  onDeleteClick: (product: Product) => void;
  onUpdateClick: (product: Product) => void;
  onSelectAll: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: number) => void;
}

export default function ProductTable({
  products,
  selectedIds,
  onDeleteClick,
  onUpdateClick,
  onSelectAll,
  onSelectOne,
}: ProductTableProps) {
  const isValidImage = (image?: string) => !!image && image.trim() !== "";
console.log("products",products)
  const getSafeImagePath = (image?: string) => {
    if (!isValidImage(image)) return "/placeholder.png";
    return image!.startsWith("http")
      ? image!
      : "/" + image!.replace(/^\/+/, "");
  };
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    // ' ' yerine 'T' koyuyoruz, böylece JS bunu doğru parse ediyor
    const isoDateStr = dateStr.replace(" ", "T");
    const d = new Date(isoDateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("tr-TR");
  };

  return (
    <ScrollArea className="w-full rounded-xs border border-gray-200 bg-white shadow-md p-2 font-sans">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto w-full ">
        <Table className="min-w-[1000px] text-sm">
          <TableHeader className="bg-gray-50 text-[#001e59]">
            <TableRow>
              <TableHead className="w-10 text-center">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onChange={onSelectAll}
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Görseller</TableHead>
              <TableHead>Ürün Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Oda</TableHead>
              <TableHead>Fiyat (m²)</TableHead>
              <TableHead>Puan</TableHead>
              <TableHead>Yorum</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead>Güncellenme</TableHead>
              <TableHead className="text-center">İşlemler</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <motion.tr
                key={product.id}
                className="hover:bg-gray-50 border-b border-gray-100 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Checkbox */}
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => onSelectOne(product.id)}
                    className="cursor-pointer"
                  />
                </TableCell>

                <TableCell>{product.id}</TableCell>

                {/* Images */}
                <TableCell>
                  <div className="relative w-12 h-12 rounded-xs overflow-hidden border flex-shrink-0">
                    <Image
                      src={getSafeImagePath(product.mainImage)}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell className="font-medium">{product.title}</TableCell>

                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {product.subCategory
                      ? `${product.category} - ${product.subCategory}`
                      : product.category}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {product.room || "—"}
                  </Badge>
                </TableCell>

                <TableCell>{product.pricePerM2.toLocaleString()} ₺</TableCell>
                <TableCell>{product.rating} ⭐</TableCell>
                <TableCell>{product.reviewCount || 0}</TableCell>

                <TableCell className="text-gray-500">
                  {formatDate(product.createdAt)}
                </TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(product.updatedAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-center flex gap-2 justify-center">
                  <Button
                    size="sm"
                    className="bg-[#7B0323] hover:bg-[#001e59] text-white text-xs rounded-xs"
                    onClick={() => onUpdateClick(product)}
                  >
                    Güncelle
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#ff3b30] hover:bg-[#ff453a] text-white text-xs rounded-xs"
                    onClick={() => onDeleteClick(product)}
                  >
                    Sil
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden flex flex-col gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white shadow-md rounded-xs border p-4 flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top */}
            <div className="flex gap-3 items-center">
              <div className="relative w-20 h-20 rounded-xs overflow-hidden border flex-shrink-0">
                <Image
                  src={getSafeImagePath(product.mainImage)}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p className="font-semibold text-[#001e59]">{product.title}</p>

                <Badge variant="outline" className="capitalize w-max">
                  {product.subCategory
                    ? `${product.category} - ${product.subCategory}`
                    : product.category}
                </Badge>

                <Badge className="w-max capitalize" variant="secondary">
                  {product.room || "—"}
                </Badge>

                <p className="text-[#001e59] font-semibold">
                  {product.pricePerM2.toLocaleString()} ₺ / m²
                </p>
              </div>

              <input
                type="checkbox"
                checked={selectedIds.includes(product.id)}
                onChange={() => onSelectOne(product.id)}
                className="cursor-pointer"
              />
            </div>

            {/* Stats */}
            <div className="flex justify-between text-sm text-gray-500">
              <p>Puan: {product.rating} ⭐</p>
              <p>Yorum: {product.reviewCount || 0}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-end mt-2">
              <Button
                size="sm"
                className="bg-[#7B0323] hover:bg-[#001e59] text-white text-xs rounded-xs"
                onClick={() => onUpdateClick(product)}
              >
                Güncelle
              </Button>
              <Button
                size="sm"
                className="bg-[#ff3b30] hover:bg-[#ff453a] text-white text-xs rounded-xs"
                onClick={() => onDeleteClick(product)}
              >
                Sil
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
