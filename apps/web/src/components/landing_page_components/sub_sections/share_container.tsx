"use client";

import React, { useState } from "react";
import QRCode from "react-qr-code";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import WhatsAppChatButton from "../../button_external_links/whatsapp_chat_button";
import { Button } from "@/components/ui/button";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
import QrCodeStyling from "@/features/qr_code/components/qr_code_styling";
import { DEFAULT_BRAND } from "@/styles/default-styles";
const ShareContainer = () => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="bg-background border border-border rounded-2xl py-4 w-full shadow-lg max-w-lg ">
      {/* Header */}
      <div className="text-center  ">
        <div className="w-12 h-12 bg-primary-tint rounded-full flex items-center justify-center mx-auto mb-3">
          <Share2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="h3-bold text-foreground mb-2">Share this page</h3>
      </div>

      {/* QR Code Section */}
      <div className="text-center mb-4">
        <div className="bg-white p-4 rounded-xl inline-block shadow-sm">
          {/* <QRCode value={url} size={120} /> */}
          <QrCodeStyling
            logo={"/assets/logos/Tipper_Logos_Brandmark_Ruby.svg"}
            slug="share-this-page"
            stylingOptions={{
              dotsType: DEFAULT_BRAND.qrStyle.dotsType,
              dotsColor: DEFAULT_BRAND.colors.primary,
              cornersSquareType: DEFAULT_BRAND.qrStyle.cornersSquareType,
              cornersSquareColor: DEFAULT_BRAND.colors.primary,
              cornersDotType: DEFAULT_BRAND.qrStyle.cornersDotType,
              cornersDotColor: DEFAULT_BRAND.colors.primary,
              backgroundColor: DEFAULT_BRAND.colors.background,
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="lg:space-y-4 space-y-2 px-2">
        {/* WhatsApp Share */}

        <WhatsAppChatButton
          phoneNumber={WHATSAPP_TIPPER_PHONE}
          message={`Check out this page: ${url}`}
          buttonText="Share on Whatsapp"
        />

        {/* Copy Link */}
        <Button
          onClick={handleCopy}
          className={`w-full px-4 py-3 rounded-lg flex items-center   justify-center gap-3  p-medium-16 ${
            copied
              ? "bg-secondary text-secondary-foreground"
              : "bg-muted text-muted-foreground hover:bg-dark/20 hover:text-dark"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-5 w-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ShareContainer;
