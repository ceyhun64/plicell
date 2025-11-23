"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileQuestion } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface Blog {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
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

  // BLOG BULUNAMADI DURUMU
  if (blogs.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <Card className="relative p-10 rounded-xs shadow-2xl border border-gray-200 max-w-xl mx-auto text-center bg-white/70 backdrop-blur-md">
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
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-br from-[#7B0323] to-[#B3133C] text-white font-medium hover:opacity-90 transition"
          >
            Ana Sayfaya Dön
          </Link>
        </Card>
      </div>
    );

  // BLOGLAR VARSA LISTELE
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
        Bloglar
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={{
              pathname: `/blog/${blog.id}`,
              query: { blog: JSON.stringify(blog) },
            }}
          >
            <Card className="hover:shadow-2xl transition-shadow cursor-pointer flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl">
              <div className="md:w-1/3">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 md:h-full object-cover rounded-xl"
                />
              </div>
              <div className="md:w-2/3 p-4 flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm mb-2">{blog.date}</p>
                  <p className="text-gray-700 text-sm">{blog.excerpt}</p>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
