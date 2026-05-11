"use client";

import React from "react";
import { AdminAccessModal } from "@/components/admin_access_modal";
import EntityHeroSection from "@/components/landing_page_components/entity_hero_section";
import ProfileBanner from "@/features/onboarding/components/user_onboarding_form/profile_banner";
import FooterCtaBanner from "@/components/landing_page_components/footer_cta_banner";
import FitCheckComponent from "@/components/landing_page_components/fit_check_component";

const TestLandingPage = () => {
  // who and why we are doing this.
  return (
    <div className=" min-h-screen w-full flex flex-col items-center justify-between text-white overflow-hidden rounded-2xl relative max-w-screen-lg  ">
      <AdminAccessModal />

      {/* Bu  siness Hero Section (replaces previous animated hero) */}
      <EntityHeroSection />
       <FitCheckComponent />
       <ProfileBanner />

       <FooterCtaBanner />
    </div>
  );
};

export default TestLandingPage;
