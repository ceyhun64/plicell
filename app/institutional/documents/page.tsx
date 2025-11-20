import React from "react";

import Navbar from "@/components/layout/navbar";
import Documents from "@/components/modules/institutional/documents";
import Footer from "@/components/layout/footer";

export default function DocumentsPage() {
  return (
    <div>
      <Navbar />
      <Documents />
      <Footer />
    </div>
  );
}
