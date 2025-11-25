import Navbar from "@/components/layout/navbar";
import ProductDetail from "@/components/modules/products/productDetail";
import Recommended from "@/components/modules/products/recommended";
import Footer from "@/components/layout/footer";

export default function ProductDetailPage() {
  return (
    <div>
      <Navbar />
      <ProductDetail />
      <Recommended />
      <Footer />
    </div>
  );
}
