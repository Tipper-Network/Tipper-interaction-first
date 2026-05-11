"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import QRCodeStyling, {
  Options,
  FileExtension,
  DotType,
  CornerDotType,
  CornerSquareType,
} from "qr-code-styling";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QRCustomizationPanel from "./qr_customization_panel";
import {
  DotType__Enum,
  CornerSquareType__Enum,
  CornerDotType__Enum,
} from "@/styles/default-styles";

interface QrCodeStylingProps {
  href?: string;
  downloadUrl?: string;
  slug?: string;
  entityType?: string;
  logo?: string;
  preferedSection?: string;
  downloadStatus?: boolean;
  stylingOptions?: {
    dotsType?: DotType__Enum;
    dotsColor?: string;
    cornersSquareType?: CornerSquareType__Enum;
    cornersSquareColor?: string;
    cornersDotType?: CornerDotType__Enum;
    cornersDotColor?: string;
    backgroundColor?: string;
  };
  downloadButton?: boolean;
}

export default function QrCodeStyling(props: QrCodeStylingProps) {
  const {
    href,
    downloadUrl,
    slug,
    entityType,
    logo,
    stylingOptions,
    downloadButton = false,
  } = props;
  const [fileExt, setFileExt] = useState<FileExtension>("png");
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Make it responsive
  const getQRWidth = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 300; // Mobile
      if (window.innerWidth < 1024) return 400; // Tablet
      return 400; // Desktop
    }
    return 400; // Default
  };

  const width = getQRWidth();

  // Construct the full QR code URL
  const qrCodeUrl = useMemo(() => {
    if (href) return href;

    // Use the new route structure: /explore/entities/[entity-type]/[slug]/welcome
    if (slug && entityType) {
      const normalizedEntityType = entityType.toLowerCase();
      const baseUrl =
        downloadUrl?.trim().replace(/\/+$/, "") ||
        (typeof window !== "undefined" ? window.location.origin : "");
      return `${baseUrl}/explore/entities/${normalizedEntityType}/${slug}/welcome`;
    }

    // Fallback to old structure if entityType not provided (backwards compatibility)
    const normalizedBase =
      downloadUrl?.trim().replace(/\/+$/, "") ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/explore/businesses/${slug}/welcome`
        : "");

    if (normalizedBase && slug) {
      return `${normalizedBase}/${slug}/welcome`;
    }

    return normalizedBase || "";
  }, [href, downloadUrl, slug, entityType]);

  // QR Code styling options
  const logoUrl = logo || "/assets/logos/Tipper_Logos_Brandmark_Ruby.svg";

  const options = useMemo<Options>(
    () => ({
      width: width,
      height: width,
      type: "svg" as const,
      data: qrCodeUrl || "",
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte" as const,
        errorCorrectionLevel: "H" as const,
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.2,
        margin: 8,
        crossOrigin: "anonymous" as const,
      },
      dotsOptions: {
        type: stylingOptions?.dotsType,
        color: stylingOptions?.dotsColor,
      },
      backgroundOptions: {
        color: stylingOptions?.backgroundColor,
      },
      cornersSquareOptions: {
        type: stylingOptions?.cornersSquareType,
        color: stylingOptions?.cornersSquareColor,
      },
      cornersDotOptions: {
        type: stylingOptions?.cornersDotType,
        color: stylingOptions?.cornersDotColor,
      },
      image: logoUrl,
    }),
    [qrCodeUrl, width, logoUrl, stylingOptions]
  );

  // Initialize QR code
  useEffect(() => {
    if (!qrCodeUrl) return;
    const qr = new QRCodeStyling(options);
    setQrCode(qr);
  }, [options, qrCodeUrl]);

  // Append QR code to DOM
  useEffect(() => {
    if (!qrCode || !ref.current) return;
    ref.current.innerHTML = "";
    qrCode.append(ref.current);
  }, [qrCode]);

  // Update QR code when options change
  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [qrCode, options]);

  const onExtensionChange = (value: string) => {
    setFileExt(value as FileExtension);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: fileExt,
      name: `${slug ?? "tipper"}-QRcode`,
    });
  };

  if (!qrCodeUrl) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-muted-foreground">No URL available for QR code</p>
      </div>
    );
  }

  return (
    <div className=" flex flex-col items-center justify-center gap-4 p-4 lg:p-6 min-h-[400px]">
      <div
        className="flex items-center justify-center min-w- h-full bg-white rounded-lg"
        id="qr-code-container"
        ref={ref}
      />
      {downloadButton && (
        <>
          <div className="flex flex-col gap-4  ">
            <div className="flex gap-2">
              <Select value={fileExt} onValueChange={onExtensionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {/*  turning the svg option off because it's not downloading the logo. need to dive into it later  */}
                  {/* <SelectItem value="svg">SVG</SelectItem> */}
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onDownloadClick} className="px-6 py-2">
                Download
              </Button>
            </div>

            {qrCodeUrl && (
              <a
                href={qrCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground text-center break-all"
              >
                {qrCodeUrl}
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
