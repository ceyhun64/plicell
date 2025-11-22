import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 animate-pulse">
      {/* ızgara: Sol (Görseller) ve Sağ (Detaylar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol Bölüm: Görseller ve Thumbnails */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:sticky lg:top-20 lg:self-start">
          {/* Thumbnails (Küçük Resimler) Skeleton */}
          <div className="flex flex-row lg:flex-col gap-3 justify-start overflow-x-auto lg:overflow-visible p-1 lg:p-0">
            <Skeleton className="w-19 h-24 md:w-33 md:h-41 rounded-xs" />
            <Skeleton className="w-19 h-24 md:w-33 md:h-41  rounded-xs" />
            <Skeleton className="w-19 h-24 md:w-33 md:h-41  rounded-xs" />
            <Skeleton className="w-19 h-24 md:w-33 md:h-41  rounded-xs" />
          </div>

          {/* Ana Görsel Alanı Skeleton */}
          <div className="relative w-full min-h-[350px] md:min-h-[620px] rounded-xs overflow-hidden">
            <Skeleton className="w-full h-full" />

            {/* Navigasyon Okları için Yer Tutucu (İsteğe Bağlı) */}
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200/50" />
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200/50" />
            </div>
          </div>
        </div>

        {/* Sağ Bölüm: Ürün Detayları Skeleton */}
        <div className="flex flex-col gap-6 p-2 py-5 sm:p-6 md:p-8 rounded-xs shadow-md border border-gray-100">
          {/* Başlık ve Etiketler Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3 mt-1" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Açıklama/Tanıtım Metni Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Profil Seçimi ve Aparat Seçimi Skeleton */}
          <div className="flex flex-col gap-6">
            <Skeleton className="h-6 w-1/3" /> {/* Profil Seçimi Başlığı */}
            <div className="flex gap-4">
              <Skeleton className="w-16 h-16 aspect-square rounded-xs" />
              <Skeleton className="w-16 h-16 aspect-square rounded-xs" />
              <Skeleton className="w-16 h-16 aspect-square rounded-xs" />
            </div>
            <Separator className="bg-gray-200/60" />
            <Skeleton className="h-12 w-full rounded-full" />{" "}
            {/* Aparat Select */}
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Ölçü Girişi ve Hesaplama Skeleton */}
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xs shadow-inner border border-gray-100">
            <Skeleton className="h-6 w-2/3" /> {/* Ölçü Başlığı */}
            <Skeleton className="h-12 w-full rounded-xl" />{" "}
            {/* Ölçü Nasıl Alınır Butonu */}
            <div className="flex gap-2">
              <Skeleton className="flex-1 h-12 rounded-full" /> {/* EN Input */}
              <Skeleton className="flex-1 h-12 rounded-full" />{" "}
              {/* BOY Input */}
              <Skeleton className="flex-1 h-12 rounded-full" />{" "}
              {/* M² Göstergesi */}
            </div>
            <Skeleton className="h-10 w-full rounded-lg" /> {/* Not Input */}
            <Skeleton className="h-5 w-2/3 mt-1" /> {/* Onay Checkbox Metni */}
          </div>

          <Separator className="bg-gray-200/60" />

          {/* Fiyat ve Sepet Butonu Skeleton */}
          <div className="flex flex-col gap-4 mt-2">
            {/* Fiyat Kartı Skeleton */}
            <div className="flex items-center justify-between p-5 rounded-xs border border-gray-200 shadow-lg">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" /> {/* Toplam Fiyat Etiketi */}
                <Skeleton className="h-8 w-32 mt-1" /> {/* Fiyat Değeri */}
                <Skeleton className="h-3 w-40 mt-2" /> {/* m² / adet bilgisi */}
              </div>
              <Skeleton className="h-10 w-28 rounded-full" />{" "}
              {/* Miktar Kontrolü */}
            </div>

            {/* Butonlar Skeleton */}
            <div className="flex gap-3">
              <Skeleton className="flex-1 h-14 rounded-full" />{" "}
              {/* Sepete Ekle Butonu */}
              <Skeleton className="h-14 w-14 rounded-full" />{" "}
              {/* Favori Butonu */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
