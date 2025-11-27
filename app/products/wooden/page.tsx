import Navbar from "@/components/layout/navbar";
import Wooden from "@/components/modules/products/category/wooden";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function WoodenPage() {
  return (
    <div>
      <Navbar />
      <Wooden />
            <Banner />
      
      <Footer />
    </div>
  );
}
