import React from "react";
import Navbar from "@/components/layout/navbar";
import PersonalData from "@/components/modules/contracts/personalData";
import Footer from "@/components/layout/footer";

export default function PersonalDataPage() {
  return (
    <div>
      <Navbar />
      <PersonalData />
      <Footer />
    </div>
  );
}
