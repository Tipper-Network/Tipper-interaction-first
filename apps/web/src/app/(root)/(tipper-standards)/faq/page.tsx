import React from "react";
import FaqComponent from "./FaqComponent";
import { FAQ } from "@/content/pages/tipper_standards/faq";

export default function FAQPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{FAQ.title}</h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        {FAQ.intro}
      </p>
      <FaqComponent faqs={FAQ.items} />
    </div>
  );
}
