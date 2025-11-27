import Navbar from "@/components/layout/navbar";
import Accessories from "@/components/modules/products/category/accessories";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function AccessoriesPage() {
  return (
    <div>
      <Navbar />
      <Accessories />
      <Banner />

      <Footer />
    </div>
  );
}
