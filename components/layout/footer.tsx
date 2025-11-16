"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-gray-800 py-12 border-b-4 border-[#7B0323] bg-white">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row md:justify-between gap-10">
        {/* Hakkımızda Bölümü */}
        <div className="flex-1">
          <div className="text-2xl font-bold mb-3 font-[Playfair_Display]">
            <Link href="/home">Plicell</Link>
          </div>
          <p className="text-sm leading-relaxed font-['Mozilla_Headline'] mb-4 md:mb-6">
            Müşterilerimize en iyi ürünleri ve hizmetleri sunmaya kendimizi
            adadık. Kalite ve müşteri memnuniyeti önceliklerimizdir.
          </p>
          <Button className="mt-2 md:mt-6" variant="outline" size="sm">
            Daha Fazla Bilgi
          </Button>
        </div>

        {/* Hızlı Linkler Bölümü */}
        <div className="flex-1">
          <h3 className="text-gray-900 text-lg font-semibold mb-4 font-['Mozilla_Headline']">
            Hızlı Linkler
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:text-black transition-colors font-['Mozilla_Headline']"
              >
                Anasayfa
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition-colors font-['Mozilla_Headline']"
              >
                Ürünler
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition-colors font-['Mozilla_Headline']"
              >
                Hakkımızda
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition-colors font-['Mozilla_Headline']"
              >
                İletişim
              </a>
            </li>
          </ul>
        </div>

        {/* Sosyal Medya Bölümü */}
        <div className="flex-1">
          <h3 className="text-gray-900 text-lg font-semibold mb-4 font-['Mozilla_Headline']">
            Bizi Takip Edin
          </h3>
          <div className="flex space-x-4 justify-start md:justify-start mb-4">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github size={24} className="text-gray-800" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={24} className="text-gray-800" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={24} className="text-gray-800" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} className="text-gray-800" />
              </a>
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Plicell. Tüm hakları saklıdır.
          </p>
        </div>
      </div>

      {/* Geliştirici bilgisi */}
      <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        Developed By{" "}
        <a
          href="https://bionluk.com/ceyhunturkmen"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-900 hover:underline"
        >
          Ceyhun Türkmen
        </a>
      </div>
    </footer>
  );
}
