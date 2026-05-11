import { UpdateEntityPayload } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Replace entity tags (EntityTag join table).
 * Payload mirrors values format: { tags: [{ tag_id: string }] }
 */
export const updateEntityTags = async (
  entityId: string,
  payload: { tags: { tag_id: string }[] }
) => {
  if (!API_BASE_URL) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined.");
  }

  const res = await fetch(`${API_BASE_URL}/entities/${entityId}/tags`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update entity tags: ${errorText}`);
  }

  return res.json();
};

/**
 * Updates an entity profile via PATCH.
 *
 * @param entityId - Entity id.
 * @param payload - Patch payload.
 * @returns Parsed JSON response from the backend.
 * @throws Error if base URL is missing or the request fails.
 */
export const updateEntityProfile = async (
  entityId: string,
  payload: UpdateEntityPayload
) => {
  if (!API_BASE_URL) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined.");
  }

  const res = await fetch(`${API_BASE_URL}/entities/${entityId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update entity: ${errorText}`);
  }

  return res.json();
};

export type UpdateEntityLinksPayloadType = {
  website?: string;
  menuUrl?: string;
  googleMapsUrl?: string;
};

export const updateEntityLinks = async (
  entityId: string,
  payload: UpdateEntityLinksPayloadType
) => {
  if (!API_BASE_URL) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined.");
  }

  const res = await fetch(`${API_BASE_URL}/entities/${entityId}/links`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update entity links: ${errorText}`);
  }

  return res.json();
};

export type UpdateEntityContactPayloadType = {
  instagram_url?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    neighborhood?: string;
    city?: string;
    country?: string;
  };
};

export const updateEntityContact = async (
  entityId: string,
  payload: UpdateEntityContactPayloadType
) => {
  if (!API_BASE_URL) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined.");
  }

  const res = await fetch(`${API_BASE_URL}/entities/${entityId}/contact`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update entity contact: ${errorText}`);
  }

  return res.json();
};

export type UpdateEntityMetadataPayloadType = {
  links?: UpdateEntityLinksPayloadType;
  publicProfile?: {
    instagramEnabled?: boolean;
    phoneEnabled?: boolean;
    emailEnabled?: boolean;
    addressEnabled?: boolean;
    websiteEnabled?: boolean;
    menuEnabled?: boolean;
    googleMapsEnabled?: boolean;
    imagesEnabled?: boolean;
  };
};

export const updateEntityMetadata = async (
  entityId: string,
  payload: UpdateEntityMetadataPayloadType
) => {
  if (!API_BASE_URL) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined.");
  }

  const res = await fetch(`${API_BASE_URL}/entities/${entityId}/metadata`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update entity metadata: ${errorText}`);
  }

  return res.json();
};

export type UpdateEntityDetailsPayloadType = {
  contact?: UpdateEntityContactPayloadType;
  address?: UpdateEntityContactPayloadType["address"];
  links?: UpdateEntityLinksPayloadType;
  publicProfile?: UpdateEntityMetadataPayloadType["publicProfile"];
};

export const updateEntityDetails = async (
  entityId: string,
  payload: UpdateEntityDetailsPayloadType
) => {
  if (!API_BASE_URL) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined.");
  }

  const res = await fetch(`${API_BASE_URL}/entities/${entityId}/details`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update entity details: ${errorText}`);
  }

  return res.json();
};
