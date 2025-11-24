"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

interface Blog {
  id: number;
  title: string;
  date: string;
  content: string;
  image: string;
}

export default function BlogDetailPage() {
  const searchParams = useSearchParams();
  const blogParam = searchParams?.get("blog") ?? null;

  let blog: Blog | null = null;
  if (blogParam) {
    try {
      blog = JSON.parse(blogParam);
    } catch (err) {
      console.error("Blog parametresi ayrıştırılamadı:", err);
    }
  }

  if (!blog)
    return (
      <p className="text-center mt-20 text-xl font-medium text-gray-600">
        Blog içeriği bulunamadı.
      </p>
    );

  return (
    <div className="pb-24 bg-white">
      {/* ---------------- HERO ---------------- */}
      <div className="relative w-full h-[200px] md:h-[500px] lg:h-[620px] overflow-hidden">
        {/* Image */}
        <img
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.75]"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/90" />

        {/* Text */}
        <div className="absolute bottom-20 left-0 right-0 mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-white font-extrabold text-4xl md:text-6xl tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-gray-300 mt-5 text-lg font-medium tracking-wide">
            {blog.date}
          </p>
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <div className="text-gray-800 text-lg md:text-xl leading-relaxed tracking-wide font-light">
          {blog.content.split("\n").map((line, i) =>
            line.trim() === "" ? (
              <div key={i} className="h-6" />
            ) : (
              <p key={i} className="mb-8">
                {line}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
