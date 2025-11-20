import React from "react";

import Navbar from "@/components/layout/navbar";
import Measurement from "@/components/modules/institutional/measurement";
import Footer from "@/components/layout/footer";

export default function MeasurementPage() {
  return (
    <div>
      <Navbar />
      <Measurement />
      <Footer />
    </div>
  );
}
