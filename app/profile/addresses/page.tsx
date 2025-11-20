import React from "react";

import Navbar from "@/components/layout/navbar";
import Addresses from "@/components/modules/profile/addresses";
import Footer from "@/components/layout/footer";

export default function AddressesPage() {
  return (
    <div>
      <Navbar />
      <Addresses />
      <Footer />
    </div>
  );
}
