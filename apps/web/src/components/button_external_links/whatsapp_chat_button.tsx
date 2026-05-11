"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { WhatsappIcon } from "@/icons/links_button_icons";

interface WhatsAppChatButtonProps {
  phoneNumber?: string;
  message: string;
  buttonText: string;
  className?: string;
}

export default function WhatsAppChatButton({
  phoneNumber,
  message,
  buttonText,
  className,
}: WhatsAppChatButtonProps) {
  // Format phone number: remove all non-digit characters and ensure it starts with country code
  const formattedPhone = phoneNumber?.replace(/\D/g, "");

  // Better mobile detection
  const userAgent = navigator.userAgent;
  const maxTouchPoints = navigator.maxTouchPoints;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    ) ||
    (maxTouchPoints && maxTouchPoints > 2);

  const whatsappUrl = `https://wa.me/${formattedPhone || ""}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <Link
        href={whatsappUrl}
        target="_blank"
        className={cn(
          "w-full hover:bg-tertiary-tint bg-tertiary flex justify-center gap-2 rounded-lg items-center  p-1",
          className
        )}
      >
        <WhatsappIcon size={24} />
        {buttonText}
      </Link>
    </>
  );
}
