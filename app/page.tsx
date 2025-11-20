import Navbar from "@/components/layout/navbar";
import CategoriesSection from "@/components/modules/home/categories";
import HeroSection from "@/components/modules/home/carousel";
import Footer from "@/components/layout/footer";
import Products from "@/components/modules/home/products";
import ProductsRow from "@/components/modules/home/newArrivals";
import Subscribe from "@/components/modules/home/subscribe";
import ShopServices from "@/components/modules/home/services";
import MeasurementAndWhy from "@/components/modules/home/measurement";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Products />
      <CategoriesSection />
      <ShopServices />
      <ProductsRow />
      <MeasurementAndWhy />
      <Subscribe />
      <Footer />
    </div>
  );
}
