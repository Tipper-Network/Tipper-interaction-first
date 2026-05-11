import React from "react";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
import { CAREERS } from "@/content/pages/tipper_standards/careers";

export default function CareersPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">
          {CAREERS.headline}
          <br /> {CAREERS.headlineLineBreak}
        </h1>

        <div className="flex justify-center">
          <WhatsAppChatButton
            phoneNumber={WHATSAPP_TIPPER_PHONE}
            message={CAREERS.whatsappMessage}
            buttonText={CAREERS.ctaButtonText}
            className="w-full md:w-auto"
          />
        </div>

        <p className="text-xl text-gray-600">{CAREERS.body}</p>
      </div>
    </div>
  );
}
