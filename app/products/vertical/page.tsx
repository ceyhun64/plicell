import Navbar from "@/components/layout/navbar";
import Vertical from "@/components/modules/products/category/vertical";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function VerticalPage() {
  return (
    <div>
      <Navbar />
      <Vertical />
            <Banner />
      
      <Footer />
    </div>
  );
}
