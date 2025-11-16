import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import products from "@/data/products.json";
import { Heart } from "lucide-react";

export default function Products() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-white text-gray-900 font-sans flex flex-col items-center justify-center px-2 py-12 lg:p-16">
      <div className="container mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        {/* Sol metin ve buton */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:sticky top-20 self-start max-w-md">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 font-[Playfair_Display]">
            Şık ve Modern Perdeler
          </h2>
          <p className='text-sm md:text-xl text-gray-600 mb-8 max-w-lg font-["Mozilla_Headline"]'>
            Evinizin her odasına uygun perde koleksiyonumuzu keşfedin. Fon, tül,
            blackout ve stor perdelerle mekanlarınızı daha şık ve konforlu hâle
            getirin.
          </p>
          <Button size="sm" variant="outline">
            Tüm Koleksiyonu Gör
          </Button>
        </div>

        {/* Ürün kartları */}
        <div className="flex-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer overflow-hidden rounded-none hover:shadow-2xl transition-shadow duration-500 relative"
            >
              <Link href={`/products/${product.id}`}>
                <Card className="p-0 m-0 rounded-none overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                  <CardContent className="flex flex-col p-0 m-0 relative">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={350}
                        height={600}
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 relative">
                      <p className="text-xs md:text-sm font-medium text-gray-900 transition-colors group-hover:text-red-600">
                        {product.name}
                      </p>
                      <p className="text-gray-600 text-xs md:text-sm">{product.price}</p>

                      {/* Favori ikonu */}
                      <button className="absolute top-4 right-2 p-1 rounded-full bg-white  hover:bg-red-50 transition">
                        <Heart className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
