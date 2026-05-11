import { BusinessTypeGroup } from "../types";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getBusinessTypes = async (): Promise<BusinessTypeGroup[]> => {
  const res = await fetch(`${API_BASE_URL}/entities/business_types`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch entity types: ${res.status} ${errorText}`);
  }
  return await res.json();
};
