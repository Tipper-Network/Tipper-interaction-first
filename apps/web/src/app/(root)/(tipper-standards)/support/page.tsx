import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import React from "react";

export default async function SupportPage() {
  const supportOptions = [
    {
      title: "Help Center",
      description:
        "Browse our comprehensive knowledge base with articles, tutorials, and guides.",
      icon: "📚",
      action: "Browse Articles",
      link: "#",
    },
    {
      title: "Contact Support",
      description:
        "Get in touch with our support team for personalized assistance.",
      icon: "💬",
      action: "Contact Us",
      link: "#",
    },
    {
      title: "Live Chat",
      description:
        "Chat with our support team in real-time for immediate help.",
      icon: "💻",
      action: "Start Chat",
      link: "#",
    },
    {
      title: "Video Tutorials",
      description:
        "Watch step-by-step video guides to master Tipper Network features.",
      icon: "🎥",
      action: "Watch Videos",
      link: "#",
    },
    {
      title: "Community Forum",
      description:
        "Connect with other users and share tips in our community forum.",
      icon: "👥",
      action: "Join Forum",
      link: "#",
    },
    {
      title: "Feature Requests",
      description:
        "Suggest new features or improvements to help us enhance the platform.",
      icon: "💡",
      action: "Submit Request",
      link: "#",
    },
  ];

  const quickLinks = [
    "Getting Started Guide",
    "Account Setup",
    "QR Code Generation",
    "Event Management",
    "Analytics Dashboard",
    "Billing & Subscriptions",
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Support Center</h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        We&apos;re here to help you get the most out of Tipper Network. Choose
        the support option that works best for you.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {supportOptions.map((option, index) => (
          <Card key={index} className="p-6">
            <CardHeader className="text-center">
              <span className="text-3xl mb-2 block">{option.icon}</span>
              <CardTitle>{option.title}</CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="text-center">
              <p className="text-gray-700 mb-4">{option.description}</p>
              <Button variant="outline" className="w-full">
                {option.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {quickLinks.map((link, index) => (
                <Button key={index} variant="ghost" className="justify-start">
                  {link}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
