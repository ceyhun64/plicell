"use client";

import { usePathname } from "next/navigation";
import SocialSidebar from "@/components/layout/socialSidebar";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Sidebar'ın görünmemesi gereken sayfalar
  const hiddenPaths = ["/admin", "/checkout", "/reset-password", "/forgot-password"];
  const showSidebar = !hiddenPaths.some((path) => pathname?.startsWith(path));

  return (
    <>
      {children}
      {showSidebar && <SocialSidebar />}
    </>
  );
}
