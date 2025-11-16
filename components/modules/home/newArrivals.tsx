"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Component/UI Imports
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Veriyi import edin (önceki konuşmalarda oluşturulan ve güncellenen ürün listesi)
// NOT: products.json dosyasının uygulamanızın '@/data/' dizininde bulunması gerekir.
import products from "@/data/products.json";

// Ürün tipi tanımı (TypeScript için önerilir)
interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  image2: string;
  image3: string;
  image4: string;
  description: string;
  stock: number;
  rating: number;
}

// products.json dosyasından gelen veriyi Product[] tipine dönüştürelim
const productList: Product[] = products as Product[];

export default function YeniUrunlerCarousel() {
  // Carousel API'sini ve o an seçili olan slaytın indeksini tutmak için state'ler
  const [api, setApi] = useState<any>(null); // EmblaCarousel API tipini 'any' olarak varsayalım
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    // Carousel yüklendiğinde mevcut index'i ayarla
    setCurrent(api.selectedScrollSnap());

    // Slayt değiştiğinde mevcut index'i güncelle
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Sayfa bazlı görünümde toplam nokta sayısı, görünür öğe sayısına göre hesaplanmalıdır.
    // Ancak bu örnekte, Embla'nın `selectedScrollSnap`'i kaydırma pozisyonunu döndürür.
    // Bu yüzden sadece `productList.length` kadar nokta oluşturacağız.

    // Cleanup fonksiyonu: Component kaldırıldığında event listener'ı temizle
    return () => {
      api.off("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    };
  }, [api]);

  return (
    <div className="container mx-auto px-2 py-12 lg:p-16 relative bg-gradient-to-b from-white via-amber-50 to-white mb-12">
      {/* Başlık */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-extrabold tracking-tight mb-2 text-gray-900 font-[Playfair_Display]">
            Yeni Gelenler
          </h2>
          <p className='text-xs md:text-lg text-gray-600 mb-2 max-w-lg font-["Mozilla_Headline"]'>
            En yeni ürünlerimiz burada. Yeniliklere göz atın.
          </p>
        </div>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative pb-10">
        <Carousel
          opts={{ align: "start", loop: true }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {productList.map((product, index) => (
              <CarouselItem
                key={index}
                className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1 cursor-pointer">
                  <Card className="p-0 m-0 rounded-none overflow-hidden hover:shadow-2xl transition-shadow duration-500 group">
                    <CardContent className="flex flex-col p-0 m-0">
                      <div className="relative w-full aspect-square">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={350}
                          height={600}
                          className="object-cover w-full h-full"
                          priority={index < 4}
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-900 transition-colors group-hover:text-red-600">
                          {product.name}
                        </p>
                        <p className="text-gray-600">{product.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 rounded-full p-2 shadow-md z-20" />
          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 rounded-full p-2 shadow-md z-20" />
        </Carousel>

        {/* Alt ilerleme göstergesi */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 pb-4">
          {api &&
            api
              .scrollSnapList()
              .map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => api.scrollTo(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    current === index ? "bg-gray-900 w-8" : "bg-gray-300 w-4"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
