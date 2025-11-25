import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 animate-pulse">
      {/* ızgara: Sol (Görseller) ve Sağ (Detaylar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol Bölüm: Görseller ve Thumbnails */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:sticky lg:top-20 lg:self-start">
          {/* Thumbnails Skeleton */}
          <div className="flex flex-row lg:flex-col gap-3 justify-start overflow-x-auto lg:overflow-visible p-1 lg:p-0">
            {/* Not: w-19 ve w-33 gibi özel boyutlar projenize özel sınıflar olmalıdır. */}
            <Skeleton className="w-19 h-24 md:w-33 md:h-41 rounded-xs" />
            <Skeleton className="w-19 h-24 md:w-33 md:h-41 rounded-xs" />
            <Skeleton className="w-19 h-24 md:w-33 md:h-41 rounded-xs" />
            <Skeleton className="w-19 h-24 md:w-33 md:h-41 rounded-xs" />
          </div>

          {/* Ana Görsel Skeleton */}
          <div className="relative w-full min-h-[350px] md:min-h-[620px] rounded-xs overflow-hidden">
            <Skeleton className="w-full h-full" />

            {/* Navigasyon okları */}
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200/50" />
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200/50" />
            </div>
          </div>
        </div>

        {/* Sağ Bölüm: Ürün Detayları Skeleton */}
        <div className="flex flex-col gap-6 p-2 py-5 sm:p-6 md:p-8 rounded-xs shadow-md border border-gray-100">
          {/* Başlık ve Etiketler */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Açıklama Skeleton */}
          <div className="flex flex-col gap-2 border-l-4 border-gray-300/60 pl-3">
            {/* Orijinal bileşendeki border-l-4 yapısını taklit etmek iyi bir detaydır. */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Ürünün Diğer Renkleri Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-1/3 mb-2" /> {/* Başlık */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Skeleton className="w-20 h-24 rounded-xs flex-shrink-0" />
              <Skeleton className="w-20 h-24 rounded-xs flex-shrink-0" />
              <Skeleton className="w-20 h-24 rounded-xs flex-shrink-0" />
              <Skeleton className="w-20 h-24 rounded-xs flex-shrink-0" />
            </div>
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Özelleştirme: Profil Seçimi ve Aparat */}
          <div className="flex flex-col gap-6">
            <Skeleton className="h-6 w-1/4" /> {/* Profil Seçimi Başlığı */}
            <div className="grid grid-cols-6 gap-2 md:gap-4 lg:flex lg:items-center lg:space-x-4">
              {/* 4 tane profil görseli simülasyonu (orijinal 6'lı grid ama 4 yeterli) */}
              <Skeleton className="w-16 h-16 aspect-square rounded-xs" />
              <Skeleton className="w-16 h-16 aspect-square rounded-xs" />
              <Skeleton className="w-16 h-16 aspect-square rounded-xs" />
              <Skeleton className="w-16 h-16 aspect-square rounded-xs" />
            </div>
            <Separator className="bg-gray-200/60" />
            <Skeleton className="h-6 w-1/4" /> {/* Aparat Seçimi Başlığı */}
            <Skeleton className="h-12 w-full rounded-full" />{" "}
            {/* Aparat Select */}
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Ölçü Girişi Skeleton */}
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xs shadow-inner border border-gray-100">
            <Skeleton className="h-6 w-2/3" /> {/* Ölçü Başlığı */}
            <Skeleton className="h-12 w-full rounded-full" />{" "}
            {/* Ölçü Nasıl Alınır Butonu */}
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-12 rounded-full" /> {/* EN */}
              <Skeleton className="flex-1 h-12 rounded-full" /> {/* BOY */}
              <Skeleton className="flex-1 h-12 rounded-full" /> {/* m² */}
            </div>
            <Skeleton className="h-10 w-full rounded-lg mt-1" /> {/* Not */}
            <Skeleton className="h-5 w-2/3 mt-1" /> {/* Checkbox/Onay */}
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Fiyat ve Sepet Butonları Skeleton */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between p-5 rounded-xs border border-gray-200 shadow-lg">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" /> {/* Toplam Fiyat Etiketi */}
                <Skeleton className="h-8 w-32 mt-1" /> {/* Fiyat değeri */}
                <Skeleton className="h-3 w-40 mt-2" /> {/* m² x adet bilgisi */}
              </div>
              <Skeleton className="h-10 w-28 rounded-full" />{" "}
              {/* Miktar Kontrol */}
            </div>

            <div className="flex gap-3">
              <Skeleton className="flex-1 h-14 rounded-full" />{" "}
              {/* Sepete Ekle */}
              <Skeleton className="h-14 w-14 rounded-full" /> {/* Favori */}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-10 sm:my-16" />

      {/* Açıklama ve Yorumlar bileşeni iskeleti */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-1/3" /> {/* Sekmeler Başlık */}
        <Skeleton className="h-40 w-full" /> {/* İçerik Alanı */}
      </div>
    </div>
  );
}
