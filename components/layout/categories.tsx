"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    name: "Tül Perde",
    image: "/categories/1.jpg",
    href: "/",
  },
  {
    id: 2,
    name: "Fon Perde",
    image: "/categories/2.jpg",
    href: "/",
  },
  {
    id: 3,
    name: "Stor Perde",
    image: "/categories/3.avif",
    href: "/",
  },
  {
    id: 4,
    name: "Zebra Perde",
    image: "/categories/4.webp",
    href: "/",
  },
  {
    id: 5,
    name: "Blackout Perde",
    image: "/categories/5.jpg",
    href: "/",
  },
  {
    id: 6,
    name: "Panel Perde",
    image: "/categories/6.webp",
    href: "/",
  },
];

export default function CategoriesSection() {
  return (
    <section className="container mx-auto px-4 md:px-12 py-8 max-w-8xl ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {categories.map((category) => (
          <Link key={category.id} href={category.href}>
            <Card className="relative cursor-pointer overflow-hidden group rounded-none shadow-lg hover:shadow-2xl transition-all duration-500 p-0 m-0">
              <CardContent className="p-0 m-0 relative">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-none">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Ultra-modern frosted overlay */}
                  <div className="absolute inset-0 bg-black/40  flex items-center justify-center rounded-none transition-all duration-500 group-hover:bg-black/40">
                    <p className="text-white text-xl sm:text-2xl font-extralight text-center px-3 drop-shadow-lg">
                      {category.name}
                    </p>
                  </div>

                  {/* Glow border on hover */}
                  <div className="absolute inset-0 pointer-events-none rounded-none  transition-all duration-500" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
