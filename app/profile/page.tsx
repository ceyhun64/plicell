import React from "react";

import Navbar from "@/components/layout/navbar";
import MyPersonalInformation from "@/components/modules/profile/myPersonalInformation";
import Footer from "@/components/layout/footer";

export default function MyPersonalInformationPage() {
  return (
    <div>
      <Navbar />
      <MyPersonalInformation />
      <Footer />
    </div>
  );
}
