import React from "react";

import Navbar from "@/components/layout/navbar";
import BankAccount from "@/components/modules/institutional/bank_accounts";
import Footer from "@/components/layout/footer";

export default function BankAccountPage() {
  return (
    <div>
      <Navbar />
      <BankAccount />
      <Footer />
    </div>
  );
}
