import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils/utils";
import { WhatsappIcon } from "@/icons/links_button_icons";

interface WhatsAppCommunityButtonProps {
  communityLink: string;
  buttonText: string;
  variant?: "default" | "outline";
  className?: string;
  srcLink: string;
}

export default function WhatsAppCommunityButton({
  communityLink,
  buttonText,
  className,
  variant,
  srcLink,
}: WhatsAppCommunityButtonProps) {
  return (
    <Link
      href={communityLink}
      target="_blank"
      className={cn(
        "  hover:-translate-y-[1px] hover:shadow-lg hover:transition-all rounded-md flex items-center justify-center gap-2 px-2 max-w-xl w-fit py-2 text-lg h-12 font-semibold ",
        className
      )}
    >
      {/* <Image src={srcLink} alt="WhatsApp" width={30} height={30} /> */}
      <WhatsappIcon size={30} />
      {buttonText}
    </Link>
  );
}
