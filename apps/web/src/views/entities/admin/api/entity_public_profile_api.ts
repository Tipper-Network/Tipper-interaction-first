export type UpdateEntityPublicProfileFlagsInput = {
  entityId: string;
  flags: {
    imagesEnabled?: boolean;
    instagramEnabled?: boolean;
    phoneEnabled?: boolean;
    emailEnabled?: boolean;
    addressEnabled?: boolean;
    websiteEnabled?: boolean;
    menuEnabled?: boolean;
    googleMapsEnabled?: boolean;
  };
};

export type UpdateEntityOfferingsPublicInput = {
  entityId: string;
  offerings: Array<{
    id: string;
    isPublic: boolean;
  }>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateEntityPublicProfileFlags(
  input: UpdateEntityPublicProfileFlagsInput
) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const res = await fetch(
    `${API_BASE_URL}/entities/${input.entityId}/public_profile`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input.flags),
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(
      `Failed to update public profile flags: ${res.status} ${errorText}`
    );
  }

  return await res.json();
}

export async function updateEntityOfferingsPublic(
  input: UpdateEntityOfferingsPublicInput
) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const res = await fetch(
    `${API_BASE_URL}/entities/${input.entityId}/offerings/public`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ offerings: input.offerings }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to update offerings: ${res.status} ${errorText}`);
  }

  return await res.json();
}
