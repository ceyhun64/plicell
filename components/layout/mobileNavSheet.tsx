// components/MobileNavSheet.tsx
"use client";

import Link from "next/link";
// SheetFooter dahil tüm bileşenler import edildi
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter, // SheetFooter kullanılıyor
} from "@/components/ui/sheet";
import {
  Home,
  Box,
  Info,
  Mail,
  HelpCircle,
  FileText,
  X,
  ChevronDown,
} from "lucide-react"; // Yeni ikon (ChevronDown)
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Button'ın doğru import edildiğini varsayıyoruz

// Arayüzler aynı kalıyor
interface SubLink {
  label: string;
  href: string;
  subItems?: SubLink[];
}

interface NavLink {
  label: string;
  href: string;
  icon: typeof Home;
  subItems?: SubLink[];
}

interface MobileNavSheetProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

export default function MobileNavSheet({
  isOpen,
  onClose,
  links,
}: MobileNavSheetProps) {
  type LinkItem = NavLink | SubLink;

  const MobileLinkItem = ({ link }: { link: LinkItem }) => {
    const Icon = "icon" in link ? link.icon : null;
    const isParent = link.subItems && link.subItems.length > 0;

    // Menü öğelerinin temel stilini tanımlıyoruz
    const baseStyle =
      "flex items-center gap-4 text-zinc-700 font-medium py-3 px-2 rounded-lg transition-all duration-200 hover:bg-amber-50 hover:text-amber-600";
    // Alt öğeler için stil biraz daha sade
    const subItemStyle =
      "text-zinc-600 font-normal py-2 transition-colors duration-200 hover:text-amber-600";

    if (isParent) {
      return (
        // details etiketi yerine, daha modern görünüm için menü öğesini doğrudan render ediyoruz
        <details className="group">
          {/* Summary için daha belirgin ve etkileşimli bir stil */}
          <summary
            className={`${baseStyle} justify-between cursor-pointer list-none`} // list-none ile default oku kaldırıyoruz
          >
            <div className="flex items-center gap-3">
              {Icon && (
                <Icon className="h-5 w-5 text-amber-500 group-hover:text-amber-600" />
              )}
              <span className="text-lg">{link.label}</span>
            </div>
            {/* Ok ikonunu daha sade ChevronDown ile değiştiriyoruz */}
            <ChevronDown className="h-5 w-5 text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          {/* Alt öğe listesi için görsel ayırıcı */}
          <div className="mt-2 pl-6 flex flex-col gap-1 border-l-2 border-amber-300/50">
            {link.subItems!.map((sub, j) => (
              <MobileLinkItem key={j} link={sub} />
            ))}
          </div>
        </details>
      );
    }

    // Alt öğe yoksa normal Link render et
    return (
      <SheetClose asChild>
        <Link
          href={link.href}
          className={`${baseStyle} text-lg`} // Ana bağlantı stilini uyguluyoruz
        >
          {Icon && <Icon className="h-5 w-5 text-amber-500" />}
          {link.label}
        </Link>
      </SheetClose>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-xs flex flex-col p-0 bg-white shadow-xl" // Maksimum genişlik ve hafif gölge eklendi
      >
        {/* HEADER: Sabit, logo ve kapatma butonu */}
        <SheetHeader className="px-6 py-4 border-b border-amber-100 sticky top-0 bg-white z-10">
          <SheetTitle className="sr-only">Mobil Site Navigasyonu</SheetTitle>
          <SheetDescription className="sr-only">
            Ana sayfalar ve ürün kategorileri listesi.
          </SheetDescription>

          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-18 h-12">
                <Image
                  src="/logo/logo.webp"
                  alt="Moda Perde 6"
                  fill
                  quality={100}
                  className="object-contain"
                  sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 208px"
                />
              </div>
            </Link>

            {/* Kapatma Butonu */}
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon" // Daha belirgin bir boyut
                className="hover:bg-amber-100 text-zinc-500 hover:text-amber-600"
                aria-label="Menüyü kapat"
              >
                <X className="h-6 w-6" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* MENÜ BAĞLANTILARI: Kaydırılabilir alan */}
        <div className="flex-1 overflow-y-auto px-4 py-0 space-y-0">
          {/* Yatay padding azaldı, dikey boşluk arttı */}
          {links.map((link, i) => (
            <div key={i} className="flex flex-col space-y-0">
              <MobileLinkItem link={link} />
            </div>
          ))}
        </div>

        {/* FOOTER: Sabit altbilgi alanı */}
        <SheetFooter className="px-6 py-4 border-t border-amber-100 bg-gray-50 flex-col sm:flex-col items-start gap-2">
          <p className="text-sm text-zinc-500 font-medium">Bize Ulaşın</p>
          <p className="text-lg font-semibold text-amber-600">
            +90 555 123 45 67
          </p>
          {/* Sosyal medya/ek bağlantılar buraya eklenebilir */}
          <div className="mt-2 text-xs text-zinc-400">
            © 2025 Moda Perde. Tüm hakları saklıdır.
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
