import { z } from "zod";

const emptyToUndefined = (v: unknown) => {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length === 0 ? undefined : t;
};

const normalizeUrl = (v: unknown) => {
  const t = emptyToUndefined(v);
  if (typeof t !== "string") return undefined;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
};

const isLikelyPublicUrl = (urlString: string) => {
  try {
    const url = new URL(urlString);
    const host = url.hostname;
    // Allow localhost + IPs in dev, otherwise require a dot in the hostname.
    if (host === "localhost") return true;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true; // IPv4
    if (host.includes(":")) return true; // IPv6
    return host.includes(".");
  } catch {
    return false;
  }
};

const strictWebsiteUrl = z
  .string()
  .url({ message: "Invalid website URL" })
  .refine(isLikelyPublicUrl, {
    message: "Please enter a full website like example.com",
  });

const strictMenuUrl = z
  .string()
  .url({ message: "Invalid menu URL" })
  .refine(isLikelyPublicUrl, {
    message: "Please enter a full URL like example.com/menu",
  });

const normalizeGoogleMapsShare = (v: unknown) => {
  const t = emptyToUndefined(v);
  if (typeof t !== "string") return undefined;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^maps\.app\.goo\.gl\//i.test(t)) return `https://${t}`;
  // allow token-only
  return `https://maps.app.goo.gl/${t.replace(/^\/+/, "")}`;
};

export const EntityDetailsDraftSchema = z.object({
  contact: z
    .object({
      instagram_url: z.preprocess(emptyToUndefined, z.string().optional()),
      phone: z.preprocess(emptyToUndefined, z.string().optional()),
      email: z.preprocess(emptyToUndefined, z.string().email().optional()),
    })
    .optional(),

  address: z
    .object({
      street: z.preprocess(emptyToUndefined, z.string().optional()),
      neighborhood: z.preprocess(emptyToUndefined, z.string().optional()),
      city: z.preprocess(emptyToUndefined, z.string().optional()),
      country: z.preprocess(emptyToUndefined, z.string().optional()),
    })
    .optional(),

  links: z
    .object({
      website: z.preprocess(normalizeUrl, strictWebsiteUrl.optional()),
      menuUrl: z.preprocess(normalizeUrl, strictMenuUrl.optional()),
      googleMapsUrl: z.preprocess(
        normalizeGoogleMapsShare,
        z.string().url({ message: "Invalid Google Maps share URL" }).optional()
      ),
    })
    .optional(),

  publicProfile: z
    .object({
      instagramEnabled: z.boolean().optional(),
      phoneEnabled: z.boolean().optional(),
      emailEnabled: z.boolean().optional(),
      addressEnabled: z.boolean().optional(),
      websiteEnabled: z.boolean().optional(),
      menuEnabled: z.boolean().optional(),
      googleMapsEnabled: z.boolean().optional(),
    })
    .optional(),
});

// Important: use `z.input` for react-hook-form typings when using preprocess()
export type EntityDetailsDraft = z.input<typeof EntityDetailsDraftSchema>;
export type EntityDetailsPayload = z.output<typeof EntityDetailsDraftSchema>;
