import React from "react";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import AnimatedActionButtons from "@/components/initiation_structures/animated_action_buttons";
import AuthModal from "@/features/auth/components/auth_modal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="xl:px-20 sm:px-12 px-4 flex justify-center flex-col items-center relative ">
      <div className="relative w-full">
        <Header />
      </div>
      {/* <div className="fixed  bottom-10 right-10 z-50">
        <AnimatedActionButtons />
      </div> */}
      {children}

      <div className="w-full max-w-screen-2xl">
        <Footer />
      </div>
      <Toaster />
    </main>
  );
}
