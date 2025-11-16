import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductDetail from "@/components/modules/products/productDetail";

export default function Productpage({ params }) {
  return (
    <>
      <Navbar />
      <ProductDetail id={params.id} />
      <Footer />
    </>
  );
}
