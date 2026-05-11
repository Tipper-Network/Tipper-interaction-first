"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

interface Faq {
  question: string;
  answer: string;
}

interface FaqsComponentProps {
  faqs: Faq[];
}

export default function FaqsComponent({ faqs }: FaqsComponentProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <Card key={index} className="overflow-hidden">
          <button
            onClick={() => toggleFaq(index)}
            className="w-full p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 pr-4">
                {faq.question}
              </CardTitle>
              <div className="flex-shrink-0">
                <span className="text-gray-500 transition-transform">
                  {openIndex === index ? "▼" : "▶"}
                </span>
              </div>
            </div>
          </button>

          {openIndex === index && (
            <div className="px-6 pb-6">
              <Separator className="mb-4" />
              <CardContent className="text-gray-700 leading-relaxed">
                {faq.answer}
              </CardContent>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
