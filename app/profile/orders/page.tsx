import React from "react";

import Navbar from "@/components/layout/navbar";
import Orders from "@/components/modules/profile/orders";
import Footer from "@/components/layout/footer";

export default function OrdersPage() {
  return (
    <div>
      <Navbar />
      <Orders />
      <Footer />
    </div>
  );
}
