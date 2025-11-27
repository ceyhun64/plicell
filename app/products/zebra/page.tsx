import Navbar from "@/components/layout/navbar";
import Zebra from "@/components/modules/products/category/zebra";
import Banner from "@/components/modules/home/banner";

import Footer from "@/components/layout/footer";

export default function ZebraPage() {
  return (
    <div>
      <Navbar />
      <Zebra />
      <Banner />

      <Footer />
    </div>
  );
}
