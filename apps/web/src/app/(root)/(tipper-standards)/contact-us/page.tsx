import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import WhatsAppCommunityButton from "@/components/button_external_links/whatsapp_community_button";
import { CONTACT } from "@/content/pages/tipper_standards/contact";

export default function ContactUsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{CONTACT.title}</h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        {CONTACT.intro}
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
        {CONTACT.options.map((option, index) => (
          <Card key={index} className="p-6">
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">{option.icon}</div>
              <CardTitle className="text-xl">{option.title}</CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="text-center">
              <p className="text-gray-700 mb-6">{option.description}</p>

              {option.type === "whatsapp-chat" &&
                "phoneNumber" in option &&
                "message" in option && (
                  <WhatsAppChatButton
                    phoneNumber={option.phoneNumber!}
                    message={option.message!}
                    buttonText={CONTACT.chatCta}
                    className="w-full"
                  />
                )}

              {option.type === "whatsapp-community" &&
                "communityLink" in option && (
                  <WhatsAppCommunityButton
                    className="bg-tertiary hover:bg-tertiary-tint text-dark font-semibold text-lg px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
                    communityLink={option.communityLink!}
                    buttonText={CONTACT.whatsappCommunityButtonText}
                    srcLink="/brands/Whatsapp.svg"
                  />
                )}

              {option.type === "email" && "email" in option && (
                <a
                  href={`mailto:${option.email}?subject=${CONTACT.emailSubject}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  {CONTACT.emailCta}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-center">
              {CONTACT.officeHours.sectionTitle}
            </CardTitle>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">
                  {CONTACT.officeHours.hours.title}
                </h3>
                <ul className="space-y-1 text-gray-600">
                  {CONTACT.officeHours.hours.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {CONTACT.officeHours.response.title}
                </h3>
                <ul className="space-y-1 text-gray-600">
                  {CONTACT.officeHours.response.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
