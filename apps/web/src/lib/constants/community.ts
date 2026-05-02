import { Building2, LucideIcon, MapPin } from "lucide-react";

export interface ICommunityInitiationStep {
  id: number | string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  status?: "upcoming" | "current" | "completed";
}

export const STEPS: ICommunityInitiationStep[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Tell us about your entity",
    icon: MapPin,
  },
  {
    id: 2,
    title: "Location Information",
    description: "Tell us about your location",
    icon: Building2,
  },
];
