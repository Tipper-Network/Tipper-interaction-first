"use client";

import React from "react";
import Link from "next/link";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import type { ProfileDetailItem } from "@/views/entities/shared/components/profile_components/profile_details_card";
import InstagramUrlLink from "@/components/button_external_links/InstagramUrlLink";
import GoogleMapsUrl from "@/components/button_external_links/google_maps_url";
import {
  EmailClickedIcon,
  EmailIcon,
  InstagramClickedIcon,
  InstagramIcon,
  MenuIcon,
  MenuClickedIcon,
  WhatsappClickedIcon,
  WhatsappIcon,
  AddressIcon,
  AddressClickedIcon,
  GoogleMapsIcon,
  GoogleMapsClickedIcon,
  WebsiteIcon,
  WebsiteClickedIcon,
} from "@/icons/links_button_icons";
import WebsiteLink from "@/components/button_external_links/website_link";

export type EntityDetailItemsInput = {
  instagram_url?: string | null;
  phone?: string | null;
  email?: string | null;
  // Canonical: address lives on entity root as JSON
  address?: {
    street?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    country?: string | null;
  };

  // Canonical source for optional links
  metadata?: {
    links?: {
      website?: string | null;
      menuUrl?: string | null;
      googleMapsToken?: string | null;
    };
    publicProfile?: {
      instagramEnabled?: boolean | null;
      phoneEnabled?: boolean | null;
      emailEnabled?: boolean | null;
      addressEnabled?: boolean | null;
      websiteEnabled?: boolean | null;
      menuEnabled?: boolean | null;
      googleMapsEnabled?: boolean | null;
    };
  } | null;
};

function buildAddress(entity: EntityDetailItemsInput): string | null {
  const street = entity.address?.street;
  const neighborhood = entity.address?.neighborhood;
  const city = entity.address?.city;
  const country = entity.address?.country;

  const addressString = [street, neighborhood, city, country]
    .filter(Boolean)
    .join(", ");
  return addressString && addressString.length > 0 ? addressString : null;
}

export function getEntityProfileDetailItems(
  entity: EntityDetailItemsInput,
  opts?: {
    /**
     * If true, hide items based on metadata.publicProfile.*Enabled.
     * If false (admin/owner views), show items whenever values exist.
     */
    respectVisibility?: boolean;
  }
): ProfileDetailItem[] {
  const address = buildAddress(entity);
  const links = entity.metadata?.links ?? null;
  const publicProfile = entity.metadata?.publicProfile ?? null;

  const respectVisibility = opts?.respectVisibility ?? true;
  const isEnabled = (
    flag: boolean | null | undefined,
    defaultValue: boolean
  ) => (respectVisibility ? (flag ?? defaultValue) : true);

  const googleMapsToken =
    links?.googleMapsToken ?? entity.metadata?.links?.googleMapsToken ?? null;
  const menuUrl = links?.menuUrl ?? entity.metadata?.links?.menuUrl ?? null;
  const websiteUrl = links?.website ?? entity.metadata?.links?.website ?? null;

  return [
    entity.instagram_url && isEnabled(publicProfile?.instagramEnabled, true)
      ? {
          icon: <InstagramIcon />,
          iconClicked: <InstagramClickedIcon />,
          value: <InstagramUrlLink instagram_url={entity.instagram_url} />,
        }
      : null,

    entity.phone && isEnabled(publicProfile?.phoneEnabled, true)
      ? {
          icon: <WhatsappIcon />,
          iconClicked: <WhatsappClickedIcon />,
          value: (
            <WhatsAppChatButton
              phoneNumber={entity.phone}
              message="Hiiiiiiii, whats up."
              buttonText="Message Us"
              className="w-fit px-2"
            />
          ),
        }
      : null,

    address && isEnabled(publicProfile?.addressEnabled, true)
      ? {
          icon: <AddressIcon />,
          iconClicked: <AddressClickedIcon />,
          value: address,
        }
      : null,

    googleMapsToken && isEnabled(publicProfile?.googleMapsEnabled, false)
      ? {
          icon: <GoogleMapsIcon />,
          iconClicked: <GoogleMapsClickedIcon />,
          value: <GoogleMapsUrl googleMapsToken={googleMapsToken} />,
          className: "h-18 w-18",
        }
      : null,

    entity.email && isEnabled(publicProfile?.emailEnabled, false)
      ? {
          icon: <EmailIcon />,
          iconClicked: <EmailClickedIcon />,
          value: (
            <a
              href={`mailto:${entity.email}`}
              className="font-medium underline decoration-muted-foreground/40 underline-offset-4"
            >
              {entity.email}
            </a>
          ),
        }
      : null,

    menuUrl && isEnabled(publicProfile?.menuEnabled, false)
      ? {
          icon: <MenuIcon />,
          iconClicked: <MenuClickedIcon />,
          label: "Menu",
          value: (
            <a
              href={menuUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline decoration-muted-foreground/40 underline-offset-4"
            >
              View menu
            </a>
          ),
        }
      : null,
    websiteUrl && isEnabled(publicProfile?.websiteEnabled, false)
      ? {
          icon: <WebsiteIcon />,
          iconClicked: <WebsiteClickedIcon />,
          value: (
            <WebsiteLink websiteUrl={websiteUrl} buttonText="Visit website" />
          ),
        }
      : null,
  ].filter(Boolean) as ProfileDetailItem[];
}
