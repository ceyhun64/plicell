"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  message?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function Topbar({
  message = "Ev dekorasyonunuz için özel perde koleksiyonları!",
  ctaText = "Hemen İncele",
  ctaLink = "/products",
}: TopbarProps) {
  return (
    <div className="w-full bg-white/90 backdrop-blur-md shadow-sm top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-center py-3 px-4 sm:px-10 gap-4">
        {/* Mesaj */}
        <p className="flex-1 min-w-0 text-xs sm:text-sm font-medium text-[#7B0323] font-sans text-left break-words">
          {message}
        </p>

        {/* CTA Buton */}
        <Button
          size="sm"
          onClick={() => (window.location.href = ctaLink)}
          className="flex-shrink-0 rounded-full px-4 py-2 text-sm bg-gradient-to-r from-rose-500 to-rose-700 text-white hover:from-rose-600 hover:to-rose-900 shadow-md transition-all"
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
}
