"use client";

import React, { useEffect, useState, memo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileQuestion, ScrollText, Calendar, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Blog {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
  createdAt: string;
}

// ----------------------------------------------------
// İSKELET BİLEŞENİ (Değişiklik Yok - Zaten Modern)
// ----------------------------------------------------
const BlogCardSkeleton = memo(() => (
  <div className="flex flex-col rounded-xl shadow-lg border border-gray-100 bg-white/70 animate-pulse overflow-hidden">
    {/* Resim İskeleti */}
    <Skeleton className="w-full h-52 md:h-64 bg-gray-200" />
    <div className="p-6 space-y-4">
      {/* Başlık İskeleti */}
      <Skeleton className="h-6 w-4/5 rounded-full bg-gray-200" />
      {/* Tarih İskeleti */}
      <Skeleton className="h-3 w-1/4 rounded-full bg-gray-100" />
      {/* Metin İskeletleri */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-full bg-gray-100" />
        <Skeleton className="h-4 w-11/12 rounded-full bg-gray-100" />
        <Skeleton className="h-4 w-4/5 rounded-full bg-gray-100" />
      </div>
      {/* Buton İskeleti */}
      <Skeleton className="h-8 w-32 rounded-full bg-rose-100" />
    </div>
  </div>
));
BlogCardSkeleton.displayName = "BlogCardSkeleton";
// ----------------------------------------------------

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Bloglar alınamadı");
      const data = await res.json();

      const mockData =
        Array.isArray(data.blogs) && data.blogs.length > 0
          ? data.blogs
          : [
              {
                id: 1,
                title: "Stor Perde Seçiminde 5 Altın Kural",
                content:
                  "Stor perdeler, modern yaşam alanlarının vazgeçilmezi. Ancak doğru seçimi yapmak için kumaş türü, ışık geçirgenliği ve montaj kolaylığı gibi faktörleri göz önünde bulundurmalısınız. Bu rehberde, eviniz için en iyi stor perdeyi seçmenize yardımcı olacak 5 altın kuralı inceliyoruz.",
                image: "http://picsum.photos/800/600?random=1",
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
              },
              {
                id: 2,
                title: "2025 Perde Trendleri: Minimalizm ve Doğallık",
                content:
                  "2025 yılında perde modasına minimalizm ve doğal tonlar hakim. Bambu, keten ve organik pamuk gibi doğal kumaşlar öne çıkarken, pastel ve toprak renkleri popülerliğini koruyor. Ev dekorasyonunuzu güncelleyecek en yeni trendleri keşfedin.",
                image: "http://picsum.photos/800/600?random=2",
                createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
              },
              {
                id: 3,
                title: "Zebra Perde Kullanımında Bilinmesi Gerekenler",
                content:
                  "Zebra perdeler, şeritli yapısıyla hem tül hem de güneşlik görevi görür. Kullanım kolaylıkları sayesinde popüler olsalar da, temizliği ve mekanizması hakkında bazı önemli noktaları bilmek gerekir.",
                image: "http://picsum.photos/800/600?random=3",
                createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
              },
              {
                id: 4,
                title: "Çocuk Odası Perdeleri: Güvenlik ve Eğlence",
                content:
                  "Çocuk odası perdeleri seçerken öncelik her zaman güvenlik olmalıdır. Zincirsiz veya motorlu sistemler tercih edilmeli, ayrıca odaya neşe katacak eğlenceli desenler kullanılabilir.",
                image: "http://picsum.photos/800/600?random=4",
                createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
              },
            ];

      const blogsWithExcerpt = mockData.map((b: any) => ({
        ...b,
        excerpt: b.content.slice(0, 120) + "...",
      }));
      setBlogs(blogsWithExcerpt);
    } catch (err: any) {
      toast.error(err.message || "Bloglar alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Yüklenme durumu (Loading State)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-amber-950/5 to-white py-16 lg:py-24 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-5 w-32 mx-auto rounded-full bg-gray-200 mb-2" />
            <Skeleton className="h-10 w-1/2 md:w-1/4 mx-auto rounded-lg bg-gray-300" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Veri yoksa (Empty State)
  if (blogs.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6 bg-gradient-to-b from-white via-amber-950/5 to-white font-sans">
        <Card className="relative p-10 rounded-xl shadow-2xl shadow-rose-200/50 border border-gray-100 max-w-xl mx-auto text-center bg-white">
          <div className="mb-6">
            <FileQuestion className="w-16 h-16 mx-auto text-rose-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            İçerik Bulunamadı
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Yeni ve bilgilendirici blog yazıları çok yakında burada olacak.
            Takipte kalın!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all rounded-full shadow-lg shadow-rose-600/30 text-base"
          >
            Ana Sayfaya Dön
          </Link>
        </Card>
      </div>
    );

  // Veri yüklendiğinde (Content State)
  return (
    <div className="bg-gradient-to-b from-white via-amber-950/5 to-white py-10 lg:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        {/* BAŞLIK KISMI */}
        <div className="text-center mb-12">
          <p className="flex items-center justify-center text-xs md:text-sm font-semibold uppercase tracking-widest text-rose-600 mb-2">
            <ScrollText className="w-5 h-5 mr-2" />
            Perde Dünyasından Haberler
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Blog Yazılarımız ve İpuçları
          </h2>
        </div>

        {/* KARTLAR */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <Link
                href={{
                  pathname: `/blog/${blog.id}`,
                  query: { blog: JSON.stringify(blog) },
                }}
              >
                <Card
                  // EN ÖNEMLİ DEĞİŞİKLİK: rounded-xs -> rounded-xl yapıldı ve p-0 eklendi.
                  className="flex flex-col h-full rounded-xs p-0 
                                shadow-xl shadow-gray-100 border border-gray-100 bg-white/70 backdrop-blur-sm 
                                transition-all duration-300 overflow-hidden 
                                group-hover:shadow-2xl group-hover:shadow-rose-100/50 group-hover:-translate-y-1"
                >
                  {/* Kartın en üstünde resim */}
                  {/* Değişiklik: Resim container'ı artık kartın üst kenar yuvarlaklığına uyum sağlamak için sadece üst köşeleri yuvarlatıyor. */}
                  <div className="w-full h-52 md:h-64 relative overflow-hidden rounded-t-xs">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* İçerik bölümü */}
                  <div className="flex flex-col justify-between p-6">
                    <CardHeader className="p-0 mb-3">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4 mr-1.5 text-rose-500" />
                        {new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <CardTitle className="text-xl font-extrabold text-gray-900 line-clamp-2 transition-colors duration-300 group-hover:text-rose-600">
                        {blog.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0 flex flex-col mb-4">
                      <p className="text-gray-700 text-base line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </CardContent>

                    {/* Okuma Butonu */}
                    <div className="mt-2">
                      <span className="inline-flex items-center text-base font-semibold text-rose-600 group-hover:text-rose-700 transition-all duration-300">
                        Devamını Oku
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
