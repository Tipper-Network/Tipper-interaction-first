import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function FeaturePage() {
  const features = [
    {
      title: "Digital Presence",
      description:
        "Create a comprehensive digital profile for your business with detailed information, photos, and contact details.",
      icon: "🌐",
    },
    {
      title: "QR Code Generation",
      description:
        "Generate unique QR codes that link directly to your business profile, making it easy for customers to find you.",
      icon: "📱",
    },
    {
      title: "Community Engagement",
      description:
        "Connect with customers through reviews, ratings, and direct communication channels.",
      icon: "💬",
    },
    {
      title: "Event Management",
      description:
        "Create and manage events, promotions, and special offers to attract and retain customers.",
      icon: "🎉",
    },
    {
      title: "Partnership Network",
      description:
        "Connect with other businesses in your industry to create partnerships and expand your reach.",
      icon: "🤝",
    },
    {
      title: "Analytics & Insights",
      description:
        "Track your performance, customer engagement, and growth metrics with detailed analytics.",
      icon: "📊",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Tipper Network Features
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        Discover the powerful features that help businesses establish a strong
        digital presence, engage with customers, and grow their network in the
        digital age.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="p-6">
            <CardHeader className="flex items-center space-x-4">
              <span className="text-2xl">{feature.icon}</span>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
              <p className="text-gray-700">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
