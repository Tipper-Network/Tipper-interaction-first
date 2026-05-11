import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import WhatsAppCommunityButton from "@/components/button_external_links/whatsapp_community_button";

export default function ContactUsPage() {
  const contactOptions: Array<{
    title: string;
    description: string;
    icon: string;
    type: string;
    phoneNumber?: string;
    message?: string;
    communityLink?: string;
    email?: string;
  }> = [
    {
      title: "WhatsApp Support",
      description:
        "Get instant help and support through WhatsApp. Our team is available to answer your questions and provide assistance.",
      icon: "💬",
      type: "whatsapp-chat",
      phoneNumber: "96178883966",
      message: "Hi! I need help with Tipper Network. Can you assist me?",
    },
    {
      title: "Join Our Community",
      description:
        "Connect with other users, share experiences, and get tips from the Tipper Network community.",
      icon: "👥",
      type: "whatsapp-community",
      communityLink: "https://chat.whatsapp.com/HHiRZer2Uvw94B5fHh4Q8q",
    },
    {
      title: "Email Support",
      description:
        "Send us a detailed message and we'll get back to you within 24 hours.",
      icon: "📧",
      type: "email",
      email: "psyfer@tippernetwork.com",
    },
    {
      title: "Business Inquiries",
      description:
        "For enterprise partnerships, custom solutions, and business development opportunities.",
      icon: "🤝",
      type: "whatsapp-chat",
      phoneNumber: "0096178883966",
      message:
        "Hi! I'm interested in business opportunities with Tipper Network. Can we discuss potential partnerships?",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Get in Touch</h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        We&apos;re here to help! Choose the best way to reach us based on your
        needs.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
        {contactOptions.map((option, index) => (
          <Card key={index} className="p-6">
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">{option.icon}</div>
              <CardTitle className="text-xl">{option.title}</CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="text-center">
              <p className="text-gray-700 mb-6">{option.description}</p>

              {option.type === "whatsapp-chat" &&
                option.phoneNumber &&
                option.message && (
                  <WhatsAppChatButton
                    phoneNumber={option.phoneNumber}
                    message={option.message}
                    buttonText="Start Chat"
                    className="w-full"
                  />
                )}

              {option.type === "whatsapp-community" && option.communityLink && (
                <WhatsAppCommunityButton
                  className="bg-tertiary hover:bg-tertiary-tint text-dark font-semibold text-lg px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                  communityLink="https://chat.whatsapp.com/HHiRZer2Uvw94B5fHh4Q8q"
                  buttonText="Whatsapp Community"
                  srcLink="/brands/Whatsapp.svg"
                />
              )}

              {option.type === "email" && (
                <a
                  href={`mailto:${option.email}?subject=Tipper Network Support`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary  rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  Send Email
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-16 max-w-4xl mx-auto">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-center">
              Office Hours & Response Times
            </CardTitle>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Support Hours</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>Monday - Friday: 9:00 AM - 6:00 PM (GMT+3)</li>
                  <li>Saturday: 10:00 AM - 4:00 PM (GMT+3)</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response Times</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>WhatsApp: Within 1 hour</li>
                  <li>Email: Within 24 hours</li>
                  <li>Community: Real-time discussions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
