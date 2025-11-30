import type { Metadata, Viewport } from "next";
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

const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  preload: true,
});

// ✅ SEO İyileştirmeleri
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7B0323",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://plicell.vercel.app"), // 🔥 Kendi domain'inizi yazın

  title: {
    default:
      "Moda Perde | Online Perde Mağazası – Plicell, Zebra, Stor ve Ahşap Jaluzi Perde Modelleri",
    template: "%s | Moda Perde", // Alt sayfalarda kullanılır
  },

  description:
    "Moda Perde – Kaliteli, şık ve uygun fiyatlı perde modelleri. Tül, stor, zebra, fon, plicell ve ahşap jaluzi perdelerle evinize zarafet katın. Ücretsiz kargo ve hızlı teslimat ile Türkiye'nin güvenilir online perde mağazası!",

  keywords: [
    "perde",
    "online perde",
    "perde modelleri",
    "plicell perde",
    "zebra perde",
    "stor perde",
    "ahşap jaluzi",
    "metal jaluzi",
    "tül perde",
    "fon perde",
    "dikey perde",
    "rüstik perde",
    "perde aksesuarları",
    "lazer kesim stor",
    "ucuz perde",
    "kaliteli perde",
    "Moda Perde",
    "online perde satış",
    "uygun fiyatlı perde",
  ],

  authors: [{ name: "Moda Perde" }],
  creator: "Moda Perde",
  publisher: "Moda Perde",

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://plicell.vercel.app",
    siteName: "Moda Perde",
    title: "Moda Perde | Online Perde Mağazası – En Kaliteli Perde Modelleri",
    description:
      "Plicell, zebra, stor, ahşap jaluzi, tül ve fon perde modelleriyle evinize zarafet katın. Ücretsiz kargo ve güvenli alışveriş imkanı!",
    images: [
      {
        url: "/og-image.webp", // 1200x630 boyutunda olmalı
        width: 1200,
        height: 630,
        alt: "Moda Perde - Online Perde Mağazası",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Moda Perde | Online Perde Mağazası",
    description:
      "Kaliteli ve şık perde modelleri ile evinize zarafet katın. Ücretsiz kargo!",
    images: ["/og-image.webp"],
    creator: "@modaperde", // Twitter hesabınız varsa
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://plicell.vercel.app",
  },

  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE", // Google Search Console'dan alın
    // yandex: "YANDEX_VERIFICATION_CODE", // İsterseniz ekleyin
  },

  category: "e-commerce",

  other: {
    "og:phone_number": "+90-XXX-XXX-XXXX", // Telefon numaranızı ekleyin
    "og:email": "info@modaperde6.com", // E-posta adresinizi ekleyin
    "og:locality": "Uşak", // Şehriniz
    "og:region": "TR", // Ülke kodu
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Yapılandırılmış Veri (JSON-LD) - Google için kritik!
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Moda Perde",
    description:
      "Türkiye'nin en kaliteli online perde mağazası. Plicell, zebra, stor, ahşap jaluzi ve daha fazlası.",
    url: "https://plicell.vercel.app",
    logo: "https://plicell.vercel.app/logo/logo.webp",
    image: "https://plicell.vercel.app/og-image.webp",
    telephone: "+90-XXX-XXX-XXXX", // Telefon numaranızı ekleyin
    email: "info@modaperde6.com", // E-posta adresinizi ekleyin
    address: {
      "@type": "PostalAddress",
      streetAddress: "Adres Bilginiz", // Tam adresinizi ekleyin
      addressLocality: "Uşak",
      addressRegion: "Uşak",
      postalCode: "64000",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "38.6823", // Koordinatlarınızı ekleyin
      longitude: "29.4082",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "₺₺",
    paymentAccepted: "Cash, Credit Card",
    currenciesAccepted: "TRY",
    sameAs: [
      "https://www.facebook.com/modaperde", // Sosyal medya hesaplarınızı ekleyin
      "https://www.instagram.com/modaperde",
      "https://twitter.com/modaperde",
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Moda Perde",
    url: "https://plicell.vercel.app",
    logo: "https://plicell.vercel.app/logo/logo.webp",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-XXX-XXX-XXXX",
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: "Turkish",
    },
    sameAs: [
      "https://www.facebook.com/modaperde",
      "https://www.instagram.com/modaperde",
      "https://twitter.com/modaperde",
    ],
  };

  return (
    <html lang="tr" className={`${playfairDisplay.variable}`}>
      <head>
        {/* ✅ Preconnect & DNS Prefetch - Performans */}
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ✅ Favicon ve App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* ✅ Yapılandırılmış Veri (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

      
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
