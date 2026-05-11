import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DullFacebookIcon,
  DullInstagramIcon,
  DullLinkedinIcon,
} from "@/icons/links_button_icons";
import FooterFeedbackSection from "./footer_feedback_section";
const Footer = () => {
  return (
    <footer className="px-2 sm:px-6 lg:px-8 py-8 lg:py-10 flex flex-col justify-center items-center max-w-screen mx-auto">
      <div className="w-full">
        {/* Mobile: Single column, Desktop: 2 columns */}
        <div className="grid grid-cols-2 lg:flex  justify-between gap-8 ">
          {/* product section Column */}
          <div className="text-left ">
            <div className="text-dark font-semibold mb-4 text-lg">Product</div>
            <div className="flex flex-col space-y-3">
              <Link
                href="/feature"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                How it works
              </Link>
              {/* <Link
                href="/pricing"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                Pricing
              </Link> */}
            </div>
          </div>

          {/* company section Column */}
          <div className="text-left ">
            <div className="text-dark font-semibold mb-4 text-lg">Company</div>
            <div className="flex flex-col space-y-3">
              <Link
                href="/about-us"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                About us
              </Link>
              <Link
                href="/careers"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                Careers
              </Link>
              <Link
                href="/contact-us"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Community Section - Full Width */}
          <div className="text-left">
            <div className="text-dark font-semibold mb-4 text-lg">
              Community
            </div>
            <div className="flex flex-col space-y-3">
              <Link
                href="/faq"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                FAQ
              </Link>
              <Link
                href="/resources"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                SMB Resources
              </Link>
              <a
                href="https://chat.whatsapp.com/HHiRZer2Uvw94B5fHh4Q8q"
                target="_blank"
                className="text-dark font-normal opacity-[0.6] hover:opacity-100 transition-opacity text-sm md:text-base"
              >
                Join Community
              </a>
            </div>
          </div>
          {/* feedback section */}
          <div className="text-left">
            <FooterFeedbackSection />
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200 opacity-20 w-full my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/assets/logos/Tipper_Logos_Alternate_Ruby.svg"
              alt="Tipper Network"
              width={200}
              height={200}
              className="h-16 w-auto md:h-20"
            />
          </Link>

          {/* Legal Links and Social Media */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="cursor-pointer hover:text-gray-800 transition-colors">
                Terms
              </div>
              <Link
                href="/privacypolicy"
                className="cursor-pointer hover:text-gray-800 transition-colors"
              >
                Privacy
              </Link>
              <div className="cursor-pointer hover:text-gray-800 transition-colors">
                Cookies
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.facebook.com/search/top?q=tipper%20network"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DullFacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/tipper.network"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DullInstagramIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/tipper-network/?viewAsMember=false"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DullLinkedinIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
