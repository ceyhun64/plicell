import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTopButton from "@/components/layout/scrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moda Perde",
  description:
    "Evinize şıklık ve konfor katan modern perde koleksiyonlarını keşfedin. Fon, blackout, stor ve tül perdelerle dekorasyonunuza zarif dokunuşlar ekleyin.",
  openGraph: {
    title: "Moda Perde",
    description:
      "Evinize şıklık ve konfor katan modern perde koleksiyonlarını keşfedin. Fon, blackout, stor ve tül perdelerle dekorasyonunuza zarif dokunuşlar ekleyin.",
    images: [
      {
        url: "/og-image.png", // Buraya projenizdeki uygun bir görselin yolunu koyun
        width: 630,
        height: 630,
        alt: "Moda Perde Koleksiyonu",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollToTopButton />
        {children}
      </body>
    </html>
  );
}
