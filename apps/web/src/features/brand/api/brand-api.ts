import type { QRStyle } from "@/features/qr_code/validation/qrcode-validation";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ResolvedBrand = {
  colors: Record<string, unknown>;
  qrStyle: Record<string, unknown>;
};

export async function fetchResolvedBrandByEntityId(
  entityId: string
): Promise<ResolvedBrand> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const res = await fetch(`${API_BASE_URL}/brand/entity/${entityId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch brand: ${res.status} ${errorText}`);
  }

  return await res.json();
}

export async function replaceQrStyleForEntity(
  entityId: string,
  qrStyle: QRStyle
) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const res = await fetch(`${API_BASE_URL}/brand/entity/${entityId}/qr-style`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(qrStyle),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to update QR style: ${res.status} ${errorText}`);
  }

  return await res.json();
}
