import React from "react";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
import { CAREERS } from "@/content/pages/tipper_standards/careers";
import Image from "next/image";

export default function CareersPage() {
  return (
    <section className=" relative pb-20 md:pt-10 w-fit px-4  pt-2 md:mb-20">
      <div className="mx-auto w-full  ">
        <div className="relative  rounded-3xl bg-primary-tint/60 px-6 pb-16 pt-12 text-center shadow-sm sm:px-10 sm:pb-64 md:px-14 md:pb-72 md:pt-14 overflow-visible">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {CAREERS.headline}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-foreground/80 sm:text-lg">
            {CAREERS.body}{" "}
            <span className="font-semibold text-foreground">
              {CAREERS.headlineLineBreak}
            </span>
          </p>

          <WhatsAppChatButton
            phoneNumber={WHATSAPP_TIPPER_PHONE}
            message={CAREERS.whatsappMessage}
            buttonText={CAREERS.ctaButtonText}
            className=" py-2 md:w-auto"
          />
        </div>

        {/* Mascots / Illustration */}
        <div className="  pointer-events-none absolute inset-x-0  -bottom-20 flex justify-center ">
          <div className=" w-full h-fit">
            <Image
              src="/assets/mascots/Group-landing.png"
              alt=""
              width={1000}
              height={420}
              // priority={false}
              className="  h-auto w-[min(1100px,92vw)] select-none object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
