import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import ScrollToTopButton from "@/components/layout/scrollToTop";
import { CartProvider } from "@/contexts/cartContext";
import { FavoriteProvider } from "@/contexts/favoriteContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// ✅ Playfair Display'i Next.js ile yükle - HIZLI VE OPTİMİZE
const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  preload: true,
});

export const metadata: Metadata = {
  title:
    "Moda Perde | Online Perde Mağazası – Plicell, Zebra, Store ve Ahşap Jaluzi Perde Modelleri",
  description:
    "Moda Perde – Kaliteli, şık ve uygun fiyatlı perde modelleri. Tül, stor, zebra ve fon perdelerle evinize zarafet katın. Türkiye'nin güvenilir online perde mağazası!",
  openGraph: {
    title: "Moda Perde | Online Perde Mağazası",
    description:
      "Plicell, zebra, stor ve ahşap jaluzi perde modelleriyle evinize zarafet katın.",
    siteName: "Moda Perde",
    images: ["/og-image.webp"],
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${playfairDisplay.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.className} antialiased`}
      >
        <CartProvider>
          <FavoriteProvider>
            <ClientLayoutWrapper>
              <main>{children}</main>
            </ClientLayoutWrapper>
            <ScrollToTopButton />
            <Toaster
              richColors
              position="bottom-right"
              toastOptions={{
                style: { zIndex: 9999 },
              }}
            />
          </FavoriteProvider>
        </CartProvider>
      </body>
    </html>
  );
}
