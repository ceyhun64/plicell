import React from "react";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  return (
    <div className="w-full bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-6 sm:px-10">
        <p className="text-sm sm:text-md font-medium text-zinc-900 font-sans">
          100% organic cotton muslin sets are waiting for you
        </p>
        {/* Optional Action Button */}
        <Button
          size="sm"
          className="bg-amber-400 text-white hover:bg-amber-500 transition-all"
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
}
