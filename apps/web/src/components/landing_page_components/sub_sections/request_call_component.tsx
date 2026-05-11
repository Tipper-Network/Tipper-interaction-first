import React from "react";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import Link from "next/link";
import Image from "next/image";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
import { WHATSAPP_CEO_PHONE } from "@/lib/constants/randoms";
import { cn } from "@/lib/utils/utils";

const RequestCallComponent = () => {
  const WHATSAPP_MESSAGE =
    "Hello! I'd like to request that my entity be initiated on Tipper. Can you help me get started?";

  return (
    <div className="relative flex flex-col items-center  overflow-hidden justify-center px-6 pb-20">
      {/* Decorative mascots */}
      {/* Purple cloud-like character pointing (bottom-left) */}
      <div className="absolute -bottom-16  -left-10 z-10 pointer-events-none   -rotate-12">
        <Image
          src="/assets/mascots/Tipper_Mascots_Rad_Pointing_Right.svg"
          alt=""
          width={200}
          height={200}
          className="w-40 h-40 sm:w-56 sm:h-56"
        />
      </div>

      {/* Red blob-like character waving (bottom-right) */}
      <div className="absolute -bottom-16 -right-16 z-10 pointer-events-none   -rotate-12">
        <Image
          src="/assets/mascots/Tipper_Mascots_Twig_Raising_Hands.svg"
          alt=""
          width={200}
          height={200}
          className="w-40 h-40 sm:w-56 sm:h-56"
        />
      </div>

      {/* Main content */}
      <div className="space-y-3 flex flex-col items-center justify-center w-full max-w-md z-20">
        {/* Direct Call Section */}
        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-tertiary text-xl sm:text-2xl font-semibold text-center">
            Call The Dude in Charge Directly
          </h3>
          <Link
            href={`tel:${WHATSAPP_CEO_PHONE}`}
            className="text-tertiary text-xl sm:text-2xl font-medium hover:underline transition-colors"
          >
            {WHATSAPP_CEO_PHONE}
          </Link>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center ">
          <span className="text-muted-foreground text-base">or</span>
        </div>

        {/* WhatsApp Button */}
        <div className=" max-w-sm">
          <WhatsAppChatButton
            phoneNumber={WHATSAPP_TIPPER_PHONE}
            message={WHATSAPP_MESSAGE}
            buttonText="Talk To Us"
            className={cn(
              "px-8 rounded-2xl text-xl font-semibold text-white h-10",
              "bg-tertiary hover:bg-tertiary/90",
              "flex items-center justify-center gap-3",
              "shadow-lg hover:shadow-xl transition-all"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestCallComponent;
