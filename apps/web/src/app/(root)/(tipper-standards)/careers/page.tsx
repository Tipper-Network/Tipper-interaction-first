import React from "react";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";

export default function CareersPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">
          If you have Merit??? Don&apos;t hesitate!
          <br /> talk to us.
        </h1>

        <div className="flex justify-center">
          <WhatsAppChatButton
            phoneNumber={WHATSAPP_TIPPER_PHONE}
            message="Hi! I have Merit and I'm interested in career opportunities at Tipper Network."
            buttonText="Contact the Dude In Charge"
            className="w-full md:w-auto"
          />
        </div>

        <p className="text-xl text-gray-600">
          If you don&apos;t know what merit is, join Tipper and explore yourself
          in this world with us and discover your interests and build your
          merit.
        </p>
      </div>
    </div>
  );
}
