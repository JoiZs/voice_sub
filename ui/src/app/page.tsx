"use client";

import Display from "@/components/display";
import Footer from "@/components/footer";
import Nav from "@/components/nav";

export default function Home() {
  return (
    <div className="w-full h-full max-w-lg m-auto flex justify-center items-center flex-col">
      <Nav />
      <Display />
      <Footer />
    </div>
  );
}
