import Navbar from "@/components/layout/navbar";
import LaserCut from "@/components/modules/products/subCategory/laserCut";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function LaserCutPage() {
  return (
    <div>
      <Navbar />
      <LaserCut />
            <Banner />
      
      <Footer />
    </div>
  );
}
