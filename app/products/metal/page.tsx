import Navbar from "@/components/layout/navbar";
import Metal from "@/components/modules/products/category/metal";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function MetalPage() {
  return (
    <div>
      <Navbar />
      <Metal />
            <Banner />
      
      <Footer />
    </div>
  );
}
