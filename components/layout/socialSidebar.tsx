"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Instagram, Facebook, Phone } from "lucide-react";

export default function SocialSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  // LocalStorage’dan ilk durumu oku
  useEffect(() => {
    const stored = localStorage.getItem("socialSidebarOpen");
    if (stored !== null) {
      setIsOpen(stored === "true");
    }
  }, []);

  // Durum değişirse localStorage’a kaydet
  useEffect(() => {
    localStorage.setItem("socialSidebarOpen", String(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const whatsappNumber = "+90 533 387 40 74";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`;

  const socialIcons = [
    {
      name: "Instagram",
      link: "https://www.instagram.com/nataliaperde",
      icon: <Instagram size={24} />,
      bg: "bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976]",
    },
    {
      name: "Facebook",
      link: "https://www.facebook.com/share/1GzHckQSvz",
      icon: <Facebook size={24} />,
      bg: "bg-[#1877f2]",
    },
    {
      name: "WhatsApp",
      link: whatsappLink,
      icon: <Phone size={24} />,
      bg: "bg-[#25D366]",
    },
    {
      name: "Telefon",
      link: `tel:${whatsappNumber}`,
      icon: <Phone size={24} />,
      bg: "bg-[#075E54]",
    },
  ];

  return (
    <div className="fixed left-4 bottom-6 z-50 flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col items-center gap-3 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
              staggerChildren: 0.08,
            }}
          >
            {socialIcons.map((icon) => (
              <motion.a
                key={icon.name}
                href={icon.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.15,
                  rotate: [0, -8, 8, 0],
                  boxShadow: `0 0 18px ${icon.bg}90`,
                }}
                transition={{ duration: 0.4 }}
                className={`p-2 md:p-3 rounded-full text-white flex items-center justify-center ${icon.bg} shadow-lg backdrop-blur-md`}
                aria-label={icon.name}
              >
                {React.cloneElement(icon.icon, {
                  size: 20,
                  className: "md:w-6 md:h-6 w-5 h-5",
                })}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleSidebar}
        whileTap={{ scale: 0.92 }}
        className="p-3 rounded-full bg-[#7B0323] border-2 border-white hover:bg-[#7B0323] transition-colors text-white"
        style={{ marginTop: isOpen ? 12 : 0 }}
        aria-label={isOpen ? "Kapat" : "Aç"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          <Plus size={24} />
        </motion.div>
      </motion.button>
    </div>
  );
}
