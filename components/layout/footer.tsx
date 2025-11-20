"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Phone, ChevronDown } from "lucide-react"; // ChevronDown eklendi
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GradientText } from "../ui/shadcn-io/gradient-text/indext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const isMobile = useIsMobile();

  const contractsLinks = [
    { href: "/contracts/kvkk", label: "KVKK Aydınlatma Metni" },
    { href: "/contracts/distance_sale", label: "Mesafeli Satış Sözleşmesi" },
    { href: "/contracts/personal_data", label: "Kişisel Veriler Onay Metni" },
    { href: "/contracts/payment_options", label: "Ödeme Seçenekleri" },
  ];

  const infoLinks = [
    { href: "/info/why", label: "Plise Perdeler Neden Tercih Edilmeli?" },
    {
      href: "/info/advantage",
      label: "Plise Perde Nedir? Avantajları Nelerdir?",
    },
    { href: "/info/measure", label: "Plise Perde Ölçüsü Nasıl Alınır?" },
    { href: "/info/terms", label: "Şartlar ve Koşullar" },
  ];

  const [openSections, setOpenSections] = useState({
    sozlesmeler: false,
    bilgi: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Chevron ikonu için rotasyon varyantları
  const chevronVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  return (
    <footer className="bg-white border-b-4 border-[#7B0323] text-gray-800 py-12 relative">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Hakkımızda - Mobil de Açık Kalacak Varsayımı (İsteğe bağlı) */}
        <div>
          <AnimatePresence initial={false}>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:block" // Masaüstünde her zaman göster
            >
              <div className="md:block">
                <div className="text-2xl font-bold mb-3 font-[Playfair_Display]">
                  <Link href="/home">Moda Perde</Link>
                </div>
                <p className="text-sm leading-relaxed font-['Mozilla_Headline'] mb-4 md:mb-6">
                  Müşterilerimize en iyi ürünleri ve hizmetleri sunmaya
                  kendimizi adadık. Kalite ve müşteri memnuniyeti
                  önceliklerimizdir.
                </p>
                <Link href={"/about"}>
                  <Button
                    className="mt-2 md:mt-6 rounded-full"
                    variant="outline"
                    size="sm"
                  >
                    Daha Fazla Bilgi
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sözleşmeler (Accordion Eklendi) */}
        <div>
          <button
            onClick={() => toggleSection("sozlesmeler")}
            className="md:hidden w-full flex justify-between items-center text-left font-semibold mb-2"
          >
            Sözleşmeler
            <motion.div
              variants={chevronVariants}
              animate={openSections.sozlesmeler ? "open" : "closed"}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </button>

          <h3 className="text-gray-900 text-lg font-semibold mb-4 font-['Mozilla_Headline'] hidden md:block">
            Sözleşmeler
          </h3>

          <AnimatePresence initial={false}>
            {(!isMobile || openSections.sozlesmeler) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:block"
              >
                <ul className="space-y-2">
                  {contractsLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hover:text-black transition-colors font-['Mozilla_Headline'] text-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bilgi (Accordion Eklendi) */}
        <div>
          <button
            onClick={() => toggleSection("bilgi")}
            className="md:hidden w-full flex justify-between items-center text-left font-semibold mb-2"
          >
            Bilgi
            <motion.div
              variants={chevronVariants}
              animate={openSections.bilgi ? "open" : "closed"}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </button>

          <h3 className="text-gray-900 text-lg font-semibold mb-4 font-['Mozilla_Headline'] hidden md:block">
            Bilgi
          </h3>

          <AnimatePresence initial={false}>
            {(!isMobile || openSections.bilgi) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:block"
              >
                <ul className="space-y-2">
                  {infoLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hover:text-black transition-colors font-['Mozilla_Headline'] text-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sosyal Medya (Accordion Eklendi) */}
        <div>
          <h3 className="text-gray-900 text-lg font-semibold mb-4 font-['Mozilla_Headline'] ">
            Bizi Takip Edin
          </h3>

          <AnimatePresence initial={true}>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:block"
            >
              <div className="flex space-x-4 mb-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram size={24} className="text-gray-800" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook size={24} className="text-gray-800" />
                </a>
                <a href="tel:+905301303084" aria-label="Telefon">
                  <Phone size={24} className="text-gray-800" />
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                &copy; {currentYear} Moda Perde. Tüm hakları saklıdır.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Alt Bar */}
      <div className="container mx-auto mt-12 flex flex-col md:flex-row justify-between items-center px-6 md:px-12 border-t border-gray-200 gap-6 md:gap-0 pt-6">
        <p className="text-sm text-gray-500 text-center md:text-left">
          Developed By{" "}
          <a
            href="https://wa.me/905541496377"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:underline"
          >
            <GradientText
              className="text-xl font-bold font-mono tracking-tighter"
              text=".jhun{}"
            />
          </a>
        </p>

        <div className="flex justify-center md:justify-end">
          <Image
            src="/iyzico/logo_band_colored@3x.webp"
            alt="iyzico ile güvenli ödeme"
            width={400}
            height={100}
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
