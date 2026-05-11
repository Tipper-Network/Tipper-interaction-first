import React from "react";
import FaqComponent from "./FaqComponent";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Tipper Network?",
      answer:
        "Tipper Network is a digital platform that helps businesses establish a strong online presence, connect with customers, and grow through community engagement and partnerships.",
    },
    {
      question: "How much does it cost to join?",
      answer:
        "We offer a free starter plan for small businesses. For advanced features, we have Professional ($29/month) and Enterprise (custom pricing) plans available.",
    },
    {
      question: "How do QR codes work?",
      answer:
        "Each business gets a unique QR code that customers can scan to instantly access their profile, menu, events, and contact information.",
    },
    {
      question: "Can I manage multiple locations?",
      answer:
        "Yes! Our Enterprise plan supports multi-location management, allowing you to manage profiles for all your business locations from one dashboard.",
    },
    {
      question: "What kind of analytics do you provide?",
      answer:
        "We provide insights on profile views, customer engagement, event attendance, and community interactions to help you understand your digital performance.",
    },
    {
      question: "How do partnerships work?",
      answer:
        "Connect with other businesses in your industry to create joint events, cross-promotions, and collaborative marketing opportunities.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Our platform is fully responsive and works great on mobile devices. We're also developing dedicated mobile apps for enhanced user experience.",
    },
    {
      question: "What support do you offer?",
      answer:
        "We provide email support for all users, priority support for Professional and Enterprise plans, and dedicated account management for Enterprise customers.",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        Find answers to common questions about Tipper Network and how it can
        help your business grow.
      </p>
      <FaqComponent faqs={faqs} />
    </div>
  );
}
