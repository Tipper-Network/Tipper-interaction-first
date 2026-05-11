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
  ArchetypesIcon: {
    src: "/assets/icons/icons/Archetype_Icon.svg",
    alt: "Archetype",
  },
  ValuesIcon: {
    src: "/assets/icons/Values_Icon.svg",
    alt: "Values",
  },
  InterestsIcon: {
    src: "/assets/icons/Interests_Icon.svg",
    alt: "Interests",
  },
  EntityProfileIcon: {
    src: "/assets/icons/Entity_Profile_Icon.svg",
    alt: "Profile",
  },
  PersonasIcon: {
    src: "/assets/icons/Persona_Icon.svg",
    alt: "Persona",
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
  ArchetypesIcon,
  ValuesIcon,
  InterestsIcon,
  EntityProfileIcon,
  PersonasIcon,
} = icons;
