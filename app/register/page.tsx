import React from "react";
import Navbar from "@/components/layout/navbar";
import RegisterForm from "@/components/modules/auth/register";
import Footer from "@/components/layout/footer";

export default function Registerpage() {
  return (
    <>
      <Navbar />
      <RegisterForm />
      <Footer />
    </>
  );
}
