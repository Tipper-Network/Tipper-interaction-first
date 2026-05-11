import { EntityMediaRole__Enum } from "@/lib/shared/enums/media_enums";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface UploadEntityMediaInput {
  media: File;
  entityId: string;
  role: EntityMediaRole__Enum;
}

export const uploadEntityMedia = async (data: UploadEntityMediaInput) => {
  try {
    const formData = new FormData();
    formData.append("role", data.role);
    formData.append("files", data.media);

    const response = await fetch(
      `${API_BASE_URL}/entities/${data.entityId}/media`,
      {
        method: "POST",
        credentials: "include",
        // Do not set Content-Type manually for multipart/form-data
        body: formData,
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error uploading entity media:", error);
    throw error;
  }
};

export interface UpdateEntityLogoInput {
  entityId: string;
  file: File;
}

export async function updateEntityLogo(data: UpdateEntityLogoInput) {
  const formData = new FormData();
  formData.append("file", data.file);

  const res = await fetch(
    `${API_BASE_URL}/entities/${data.entityId}/media/logo`,
    {
      method: "PUT",
      credentials: "include",
      body: formData,
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Failed to update logo: ${res.status} ${errText}`);
  }

  return await res.json();
}

export type GetEntityLogoResponse = {
  entityId: string;
  role: EntityMediaRole__Enum;
  key: string | null;
  url: string | null;
};

export async function getEntityLogo(
  entityId: string
): Promise<GetEntityLogoResponse> {
  const res = await fetch(`${API_BASE_URL}/entities/${entityId}/media/logo`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Failed to get entity logo: ${res.status} ${errText}`);
  }

  return await res.json();
}

export type EntityGallerySlot = {
  slot: 1 | 2 | 3;
  key: string | null;
  url: string | null;
};

export type GetEntityGalleryResponse = {
  entityId: string;
  role: EntityMediaRole__Enum;
  slots: EntityGallerySlot[];
};

export async function getEntityGallery(
  entityId: string
): Promise<GetEntityGalleryResponse> {
  const res = await fetch(
    `${API_BASE_URL}/entities/${entityId}/media/gallery`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Failed to get entity gallery: ${res.status} ${errText}`);
  }

  return await res.json();
}

export interface UpdateEntityGallerySlotInput {
  entityId: string;
  slot: 1 | 2 | 3;
  file: File;
}

export async function updateEntityGallerySlot(
  data: UpdateEntityGallerySlotInput
) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  if (!data.file) {
    throw new Error("File is required");
  }

  const formData = new FormData();
  formData.append("file", data.file);

  console.log(`[updateEntityGallerySlot] Uploading to:`, {
    url: `${API_BASE_URL}/entities/${data.entityId}/media/gallery/${data.slot}`,
    slot: data.slot,
    fileName: data.file.name,
    fileSize: data.file.size,
    fileType: data.file.type,
  });

  try {
    const res = await fetch(
      `${API_BASE_URL}/entities/${data.entityId}/media/gallery/${data.slot}`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      console.error(`[updateEntityGallerySlot] Request failed:`, {
        status: res.status,
        statusText: res.statusText,
        error: errText,
      });
      throw new Error(
        `Failed to update gallery slot ${data.slot}: ${res.status} ${errText}`
      );
    }

    const result = await res.json();
    console.log(`[updateEntityGallerySlot] Success:`, result);
    return result;
  } catch (error) {
    console.error(`[updateEntityGallerySlot] Network or parsing error:`, error);
    throw error;
  }
}
