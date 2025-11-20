import React from "react";
import Navbar from "@/components/layout/navbar";
import PaymentOptions from "@/components/modules/contracts/paymentOptions";
import Footer from "@/components/layout/footer";

export default function PaymentOptionsPage() {
  return (
    <div>
      <Navbar />
      <PaymentOptions />
      <Footer />
    </div>
  );
}
