import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";

interface IconProps {
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Factory function to create icon components
 * This eliminates code duplication by generating icon components from a config
 */
const createIcon = (
  src: string,
  defaultAlt: string,
  displayName: string
): React.FC<IconProps> => {
  const IconComponent = ({
    size = 24,
    className,
    alt = defaultAlt,
  }: IconProps) => {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn(className)}
      />
    );
  };

  IconComponent.displayName = displayName;
  return IconComponent;
};

// Icon configurations - using object for type-safe, human-readable access
const iconConfigs = {
  ArrowLeftIcon: {
    src: "/assets/utility_icons/Arrow_Left.svg",
    alt: "Arrow Left",
  },
  ArrowRightIcon: {
    src: "/assets/utility_icons/Arrow_Right.svg",
    alt: "Arrow Right",
  },
  BusinessProfileIcon: {
    src: "/assets/utility_icons/Business_Profile_Icon.svg",
    alt: "Business Profile",
  },
  CommunityIcon: {
    src: "/assets/utility_icons/Community_Icon.svg",
    alt: "Community",
  },
  EditButtonRubyShadeIcon: {
    src: "/assets/utility_icons/Edit_Button_Ruby_Shade.svg",
    alt: "Edit",
  },
  EventsIcon: {
    src: "/assets/utility_icons/Events.svg",
    alt: "Events",
  },
  FiBrTimeForwardIcon: {
    src: "/assets/utility_icons/Fi_Br_Time_Forward.svg",
    alt: "Time Forward",
  },
  HeaderIcon: {
    src: "/assets/utility_icons/Header_Icon.svg",
    alt: "Header",
  },
  InventoryIcon: {
    src: "/assets/utility_icons/Inventory.svg",
    alt: "Inventory",
  },
  MenuIcon: {
    src: "/assets/utility_icons/Menu_Icon.svg",
    alt: "Menu",
  },
  OffButtonIcon: {
    src: "/assets/utility_icons/Off_Button.svg",
    alt: "Off",
  },
  OnButtonIcon: {
    src: "/assets/utility_icons/On_Button.svg",
    alt: "On",
  },
  PartnershipIcon: {
    src: "/assets/utility_icons/Partnership_Icon.svg",
    alt: "Partnership",
  },
  RedoButtonIcon: {
    src: "/assets/utility_icons/Redo_Button.svg",
    alt: "Redo",
  },
  RequestPartnershipIcon: {
    src: "/assets/utility_icons/Request_Partnership.svg",
    alt: "Request Partnership",
  },
  SectionsIcon: {
    src: "/assets/utility_icons/Sections_Icon.svg",
    alt: "Sections",
  },
  ServicesIcon: {
    src: "/assets/utility_icons/Services.svg",
    alt: "Services",
  },
  StylingIcon: {
    src: "/assets/utility_icons/Styling_Icon.svg",
    alt: "Styling",
  },
  UndoButtonIcon: {
    src: "/assets/utility_icons/Undo_Button.svg",
    alt: "Undo",
  },
} as const;

// Generate all icon components automatically from config
// This eliminates manual export statements and prevents index errors
//
// Object.entries() returns an array of [key, value] pairs:
//   [["AddIconAmethyst", { src: "...", alt: "Add" }], ["AddIconRuby", { ... }], ...]
//
// reduce() returns whatever you return from the callback!
// The initialValue (2nd argument) determines the type of the accumulator:
//
// Examples:
//   .reduce((acc, item) => acc + item, 0)        → returns NUMBER (sum)
//   .reduce((acc, item) => [...acc, item], [])   → returns ARRAY
//   .reduce((acc, item) => ({ ...acc, [key]: value }), {}) → returns OBJECT (this case)
//
// In our case:
//   - Initial value: {} (object) → acc starts as object
//   - We build up: { AddIconAmethyst: Component, AddIconRuby: Component, ... }
//   - We return: acc (the object)
//   - Final result: OBJECT with icon names as keys, components as values
//
// How it works:
//   1st iteration: acc = {}, processes "AddIconAmethyst" → acc = { AddIconAmethyst: IconComponent }
//   2nd iteration: acc = { AddIconAmethyst: ... }, processes "AddIconRuby" → acc = { AddIconAmethyst: ..., AddIconRuby: ... }
//   ...and so on
//
// Final result (icons) is an OBJECT:
//   {
//     AddIconAmethyst: React.FC<IconProps>,  // ← React component function
//     AddIconRuby: React.FC<IconProps>,      // ← React component function
//     AddIconEmerald: React.FC<IconProps>,    // ← React component function
//     ...
//   }
//
// Each value is a React component (function), not JSX. You call it like: <AddIconAmethyst />
const icons = Object.entries(iconConfigs).reduce(
  (acc, [name, config]) => {
    acc[name as keyof typeof iconConfigs] = createIcon(
      config.src,
      config.alt,
      name
    );
    return acc; // Return the updated accumulator for next iteration
  },
  {} as Record<keyof typeof iconConfigs, React.FC<IconProps>> // Initial value - THIS determines return type!
);

// Export all icons
export const {
  ArrowLeftIcon,
  ArrowRightIcon,
  BusinessProfileIcon,
  CommunityIcon,
  EditButtonRubyShadeIcon,
  EventsIcon,
  FiBrTimeForwardIcon,
  HeaderIcon,
  InventoryIcon,
  MenuIcon,
  OffButtonIcon,
  OnButtonIcon,
  PartnershipIcon,
  RedoButtonIcon,
  RequestPartnershipIcon,
  SectionsIcon,
  ServicesIcon,
  StylingIcon,
  UndoButtonIcon,
} = icons;
