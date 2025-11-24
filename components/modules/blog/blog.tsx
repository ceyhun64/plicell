"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileQuestion } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";

interface Blog {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Bloglar alınamadı");
      const data = await res.json();
      const blogsWithExcerpt = data.blogs.map((b: any) => ({
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

  if (loading) return <Spinner />;

  if (blogs.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <Card className="relative p-10 shadow-xl border border-gray-200 max-w-xl mx-auto text-center bg-white/70 backdrop-blur-md">
          <div className="mb-4">
            <FileQuestion className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Henüz blog bulunamadı
          </h2>
          <p className="text-gray-600 mb-6">
            Yeni içerikler çok yakında burada olacak. Takipte kalın!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-br from-[#7B0323] to-[#B3133C] text-white font-medium hover:opacity-90 transition rounded-md"
          >
            Ana Sayfaya Dön
          </Link>
        </Card>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-white via-amber-950/20 to-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        <h2 className="relative text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12 font-serif">
          <span className="absolute inset-0 -z-10 bg-pink-200 opacity-20 blur-xl"></span>
          Bloglar
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <motion.form
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="backdrop-blur-xl bg-white/60 rounded-xs shadow-2xl border border-white/40 space-y-6"
            >
              <Link
                key={blog.id}
                href={{
                  pathname: `/blog/${blog.id}`,
                  query: { blog: JSON.stringify(blog) },
                }}
              >
                <Card className="flex flex-col hover:shadow-2xl transition-transform duration-300 cursor-pointer  overflow-hidden group ">
                  {/* Kartın en üstünde resim */}
                  <div className="w-full h-52 md:h-64 relative overflow-hidden -mt-6">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* İçerik bölümü */}
                  <div className="flex flex-col justify-between px-5 ">
                    <CardHeader className="p-0 mb-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {blog.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col">
                      <p className="text-gray-500 text-sm mb-2">
                        {new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </CardContent>
                    <div className="mt-4">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#7B0323] to-[#B3133C] text-white text-sm font-medium rounded-full hover:opacity-90 transition">
                        Devamını Oku
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.form>
          ))}
        </div>
      </div>
    </div>
  );
}
