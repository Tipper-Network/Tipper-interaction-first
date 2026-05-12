"use client";

import React from "react";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import WhatsAppCommunityButton from "@/components/button_external_links/whatsapp_community_button";
import { CONTACT } from "@/content/pages/tipper_standards/contact";

function EmailButton({
  email,
  subject,
  label,
}: {
  email: string;
  subject: string;
  label: string;
}) {
  return (
    <a
      href={`mailto:${email}?subject=${subject}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-white hover:bg-secondary/80 transition-colors"
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
      {label}
    </a>
  );
}

export default function ContactUsPage() {
  return (
    <div className="min-h-screen w-full bg-background px-6 py-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-12 text-center">
        <h1 className="text-3xl font-bold">
          Get{" "}
          <span className="text-primary">In Touch</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          {CONTACT.intro}
        </p>
      </div>

      {/* 2×2 contact card grid */}
      <div className="grid gap-5 sm:grid-cols-2 max-w-2xl mx-auto">
        {CONTACT.options.map((option, index) => (
          <div
            key={index}
            className="bg-primary-tint rounded-3xl p-6 flex flex-col justify-between min-h-[180px] gap-4"
          >
            <div className="flex flex-col gap-2">
              <span className="text-2xl">{option.icon}</span>
              <h3 className="font-semibold text-sm text-foreground">
                {option.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </div>

            {/* CTA pill */}
            <div>
              {option.type === "whatsapp-chat" &&
                "phoneNumber" in option &&
                "message" in option && (
                  <WhatsAppChatButton
                    phoneNumber={option.phoneNumber!}
                    message={option.message!}
                    buttonText={CONTACT.chatCta}
                    className="!w-auto !inline-flex px-3 py-1.5 rounded-full text-xs font-medium"
                  />
                )}

              {option.type === "whatsapp-community" &&
                "communityLink" in option && (
                  <WhatsAppCommunityButton
                    communityLink={option.communityLink!}
                    buttonText={CONTACT.whatsappCommunityButtonText}
                    srcLink="/brands/Whatsapp.svg"
                    className="!w-auto !inline-flex px-3 py-1.5 rounded-full text-xs font-medium bg-tertiary text-dark hover:bg-tertiary/80 transition-colors"
                  />
                )}

              {option.type === "email" && "email" in option && (
                <EmailButton
                  email={option.email!}
                  subject={CONTACT.emailSubject}
                  label={CONTACT.emailCta}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Office hours — subtle footer row */}
      <div className="mt-14 max-w-2xl mx-auto grid sm:grid-cols-2 gap-6 text-center">
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">
            {CONTACT.officeHours.hours.title}
          </p>
          {CONTACT.officeHours.hours.items.map((item, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              {item}
            </p>
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">
            {CONTACT.officeHours.response.title}
          </p>
          {CONTACT.officeHours.response.items.map((item, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
