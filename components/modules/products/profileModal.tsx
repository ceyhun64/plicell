"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface ProfilePreviewModalProps {
  open: boolean;
  image: string | null;
  profile: string | null;
  onClose: () => void;
}

export default function ProfilePreviewModal({
  open,
  image,
  onClose,
  profile,
}: ProfilePreviewModalProps) {
  if (!open || !image) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        className="relative bg-white overflow-hidden shadow-2xl max-w-[90%] md:max-w-xl rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
        >
          <X size={22} className="text-gray-700" />
        </button>

        <Image
          src={image}
          alt="Seçilen Profil"
          width={500}
          height={500}
          className="object-contain w-full h-100 md:h-120 "
          unoptimized
        />

        {profile && (
          <div className="text-center py-2 font-semibold text-gray-800 text-lg border-t">
            {profile}
          </div>
        )}
      </div>
    </div>
  );
}
