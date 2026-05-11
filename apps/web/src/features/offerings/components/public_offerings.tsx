"use client";
import React from "react";
import { MediaType__Enum } from "@tipper/shared";
import PreviewComponent from "@/components/shared/preview_component";

type PublicOfferingProps = {
  offering?: {
    id: string;
    label: string;
    description?: string | null;
    offeringMedia?: Array<{
      id: string;
      type: MediaType__Enum;
      url?: string | null;
    }>;
  } | null;
};

const PublicOffering = ({ offering }: PublicOfferingProps) => {
  if (!offering) return null;
  const media = Array.isArray(offering.offeringMedia)
    ? offering.offeringMedia
    : [];
  const pdfs = media.filter(
    (m) => m?.type === MediaType__Enum.DOCUMENT && m?.url
  );
  const images = media.filter(
    (m) => m?.type === MediaType__Enum.IMAGE && m?.url
  );
  const videos = media.filter(
    (m) => m?.type === MediaType__Enum.VIDEO && m?.url
  );
  const others = media.filter(
    (m) => m?.type === MediaType__Enum.OTHER && m?.url
  );
  return (
    <div className="w-full">
      <div className="text-sm font-semibold text-foreground">
        {offering.label}
      </div>

      {offering.description ? (
        <div className="mt-1 text-xs text-muted-foreground">
          {String(offering.description)}
        </div>
      ) : null}

      {pdfs.length > 0 ? (
        <div className="mt-4">
          {pdfs.slice(0, 1).map((m) => (
            <PreviewComponent
              key={m.id}
              file={{
                url: m.url!,
                name: `${offering.label}.pdf`,
                type: "application/pdf",
              }}
              variant="full"
              embedHeight={500}
            />
          ))}
        </div>
      ) : null}

      {videos.length > 0 ? (
        <div className="mt-4 space-y-3">
          {videos.slice(0, 2).map((m) => (
            <PreviewComponent
              key={m.id}
              file={{
                url: m.url!,
                name: `${offering.label}-video`,
                type: "video/*",
              }}
              variant="full"
            />
          ))}
        </div>
      ) : null}

      {images.length > 0 ? (
        <div className="mt-4 space-y-3">
          {images.slice(0, 6).map((m) => (
            <PreviewComponent
              key={m.id}
              file={{
                url: m.url!,
                name: `${offering.label}-image`,
                type: "image/*",
              }}
              variant="full"
            />
          ))}
        </div>
      ) : null}

      {others.length > 0 ? (
        <div className="mt-4 space-y-2">
          {others.slice(0, 6).map((m) => (
            <PreviewComponent
              key={m.id}
              file={{ url: m.url!, name: `${offering.label}-file` }}
              variant="link"
            />
          ))}
        </div>
      ) : null}

      {pdfs.length === 0 &&
      images.length === 0 &&
      videos.length === 0 &&
      others.length === 0 ? (
        <div className="mt-3 text-xs text-muted-foreground">No media yet.</div>
      ) : null}
    </div>
  );
};

export default PublicOffering;
