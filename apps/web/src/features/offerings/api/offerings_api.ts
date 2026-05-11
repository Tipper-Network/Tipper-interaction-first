import type {
  CreateOfferingInput,
  Offering,
  OfferingMedia,
  UpdateOfferingInput,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function assertBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }
}

export async function listOfferings(entityId: string): Promise<Offering[]> {
  assertBaseUrl();
  const res = await fetch(`${API_BASE_URL}/entities/${entityId}/offerings`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    // throw new Error(`Failed to list offerings: ${res.status} ${errorText}`);
    return [];
  }
  const data = await res.json().catch(() => null);
  return Array.isArray(data) ? (data as Offering[]) : [];
}

export async function getOffering(
  entityId: string,
  offeringId: string
): Promise<Offering> {
  assertBaseUrl();
  const res = await fetch(
    `${API_BASE_URL}/entities/${entityId}/offerings/${offeringId}`,
    { method: "GET", credentials: "include" }
  );
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to get offering: ${res.status} ${errorText}`);
  }
  return (await res.json()) as Offering;
}

export async function createOffering(
  entityId: string,
  payload: CreateOfferingInput
): Promise<Offering> {
  assertBaseUrl();
  const res = await fetch(`${API_BASE_URL}/entities/${entityId}/offerings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to create offering: ${res.status} ${errorText}`);
  }
  return (await res.json()) as Offering;
}

export async function updateOffering(
  entityId: string,
  offeringId: string,
  payload: UpdateOfferingInput
): Promise<Offering> {
  assertBaseUrl();
  const res = await fetch(
    `${API_BASE_URL}/entities/${entityId}/offerings/${offeringId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to update offering: ${res.status} ${errorText}`);
  }
  return (await res.json()) as Offering;
}

export async function deleteOffering(
  entityId: string,
  offeringId: string
): Promise<{ deleted: boolean }> {
  assertBaseUrl();
  const res = await fetch(
    `${API_BASE_URL}/entities/${entityId}/offerings/${offeringId}`,
    { method: "DELETE", credentials: "include" }
  );
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to delete offering: ${res.status} ${errorText}`);
  }
  return (await res.json()) as { deleted: boolean };
}

export async function listOfferingMedia(
  entityId: string,
  offeringId: string
): Promise<OfferingMedia[]> {
  assertBaseUrl();
  const res = await fetch(
    `${API_BASE_URL}/entities/${entityId}/offerings/${offeringId}/media`,
    { method: "GET", credentials: "include" }
  );
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(
      `Failed to list offering media: ${res.status} ${errorText}`
    );
  }
  const data = await res.json();
  return Array.isArray(data) ? (data as OfferingMedia[]) : [];
}

export async function uploadOfferingMedia(params: {
  entityId: string;
  offeringId: string;
  files: File[];
}): Promise<OfferingMedia[]> {
  assertBaseUrl();
  const formData = new FormData();
  params.files.forEach((f) => formData.append("files", f));

  const res = await fetch(
    `${API_BASE_URL}/entities/${params.entityId}/offerings/${params.offeringId}/media`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(
      `Failed to upload offering media: ${res.status} ${errorText}`
    );
  }
  const data = await res.json();
  return Array.isArray(data) ? (data as OfferingMedia[]) : [];
}

export async function deleteOfferingMedia(params: {
  entityId: string;
  offeringId: string;
  mediaId: string;
}): Promise<{ deleted: boolean }> {
  assertBaseUrl();
  const res = await fetch(
    `${API_BASE_URL}/entities/${params.entityId}/offerings/${params.offeringId}/media/${params.mediaId}`,
    { method: "DELETE", credentials: "include" }
  );
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(
      `Failed to delete offering media: ${res.status} ${errorText}`
    );
  }
  return (await res.json()) as { deleted: boolean };
}
