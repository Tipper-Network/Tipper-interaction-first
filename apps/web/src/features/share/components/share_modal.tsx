"use client";

import { useState } from "react";
import { Check, Copy, Link } from "lucide-react";
import { NeutralDialog } from "@/components/neutral_dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QrCodeStyling from "@/features/qr_code/components/qr_code_styling";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Full share URL including shareToken param */
  shareUrl: string;
  /** Modal title. Defaults to "Share". */
  title?: string;
}

/**
 * Displays a shareable QR code and a copy-link button.
 * Generic — works for communities, entity profiles, events, etc.
 * The QR encodes the full shareUrl so scanners land on the right
 * destination with the token already in the URL.
 */
export default function ShareModal({
  open,
  onOpenChange,
  shareUrl,
  title = "Share",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <NeutralDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      className="max-w-sm"
    >
      <div className="flex flex-col items-center gap-6">
        {/* QR Code — encodes full shareUrl (destination + token) */}
        <div className="w-full flex justify-center">
          <QrCodeStyling href={shareUrl} />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Scan this QR code to share. Anyone who scans will be linked to your
          invite.
        </p>

        {/* Copy link */}
        <div className="w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              readOnly
              value={shareUrl}
              className="pl-8 text-xs truncate"
              aria-label="Share link"
            />
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => void handleCopy()}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-tertiary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </NeutralDialog>
  );
}
