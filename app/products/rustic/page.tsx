import Navbar from "@/components/layout/navbar";
import Rustic from "@/components/modules/products/category/rustic";
import Footer from "@/components/layout/footer";
import Banner from "@/components/modules/home/banner";

export default function RusticPage() {
  return (
    <div>
      <Navbar />
      <Rustic />
            <Banner />
      
      <Footer />
    </div>
  );
}
