import React from "react";
import Navbar from "@/components/layout/navbar";
import LoginForm from "@/components/modules/auth/login";
import Footer from "@/components/layout/footer";

export default function Loginpage() {
  return (
    <>
      <Navbar />
      <LoginForm />
      <Footer />
    </>
  );
}