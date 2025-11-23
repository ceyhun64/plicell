"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export default function AboneOl() {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // başarı veya hata

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("");

    if (!email.trim()) {
      setStatus("Lütfen geçerli bir e-posta girin.");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Bir hata oluştu.");
        return;
      }

      toast.success("Başarıyla abone oldunuz! ");
      setEmail(""); // input temizle
    } catch (error) {
      setStatus("Bir hata oluştu, daha sonra tekrar deneyin.");
    }
  };

  return (
    <section className="bg-[#7B0323] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#7B0323]/40 to-[#5E021A]/40 pointer-events-none rounded-3xl"></div>

      {/* Sol taraf */}
      <div className="relative text-white max-w-md z-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 font-[Playfair_Display] drop-shadow-lg">
          Bültenimize Kaydolun
        </h2>
        <p className="text-gray-50 mb-6 max-w-lg font-['Mozilla_Headline'] drop-shadow-sm">
          Mağazamızdan en son haberler ve fırsatlardan haberdar olun.
        </p>
      </div>

      {/* Form */}
      <form
        className="relative w-full md:w-[600px] z-10"
        onSubmit={handleSubmit}
      >
        <Input
          type="email"
          placeholder="E-posta adresinizi girin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full py-5 px-6 pr-20 text-gray-900 bg-white shadow-md focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 transition"
          required
        />

        <Button
          variant="default"
          size="icon"
          type="submit"
          aria-label="Abone ol"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-400 hover:bg-red-300 text-black rounded-full p-3 shadow-lg transition-transform hover:scale-110"
        >
          <ArrowRight className="text-black" />
        </Button>

        {/* Status mesajı */}
        {status && (
          <p className="mt-3 text-sm text-white/90 font-medium">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}
