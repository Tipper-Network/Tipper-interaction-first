import { isDev, isStaging, isProd } from "@/lib/utils/env_utils";
export const WHATSAPP_TIPPER_PHONE = "+96179010379"; // Replace with actual number
export const WHATSAPP_CEO_PHONE = "+96178883966"; // Replace with actual number

export const FRONTEND_URL = (): string => {
  if (isDev()) {
    return "http://localhost:3000";
  } else if (isStaging()) {
    return "https://staging.tippernetwork.com";
  } else if (isProd()) {
    return "https://tippernetwork.com";
  } else {
    return "https://tippernetwork.com";
  }
};
