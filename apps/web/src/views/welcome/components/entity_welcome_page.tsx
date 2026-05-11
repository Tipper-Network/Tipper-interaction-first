"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { WELCOME_PAGE } from "@/content/pages/views/welcome_page";
import {
  Building2,
  Users,
  UtensilsCrossed,
  Calendar,
  Package,
  Activity,
  ArrowRight,
  Menu,
  User,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EntityWelcomePageProps {
  entity: {
    id: string;
    name: string;
    slug: string;
    entity_type: string;
    logo_url?: string | null;
    description?: string | null;
    entity_community_slug?: string | null;

    [key: string]: any; // Allow additional fields
  };
}

export default function EntityWelcomePage({ entity }: EntityWelcomePageProps) {
  const entityType = entity.entity_type?.toLowerCase() || "business";
  const { user, profile } = useAuthStore();

  // Build links based on available entity features
  const links = useMemo(() => {
    const linkList: Array<{
      label: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      available: boolean;
    }> = [];

    // Main entity profile - always available
    linkList.push({
      label: WELCOME_PAGE.links.viewProfile,
      href: `/explore/entities/${entityType}/${entity.slug}`,

      icon: Building2,
      available: true,
    });

    // Community - if entity_community_slug exists
    if (entity.entity_community_slug) {
      linkList.push({
        label: WELCOME_PAGE.links.community,
        href: `/explore/entity_communities/${entity.entity_community_slug}`,
        icon: Users,
        available: true,
      });
    }

    // // Menu - always show, will be available when route is implemented
    // linkList.push({
    //   label: "Menu",
    //   href: `/explore/entities/${entityType}/${entity.slug}#menu`,
    //   icon: UtensilsCrossed,
    //   available: entity.has_menu === true, // Only available if explicitly set to true
    // });

    // // Events - always show, will be available when route is implemented
    // linkList.push({
    //   label: "Events",
    //   href: `/explore/entities/${entityType}/${entity.slug}#events`,
    //   icon: Calendar,
    //   available: false, // Placeholder for future implementation
    // });

    // // Services - show if has_services flag exists
    // linkList.push({
    //   label: "Services",
    //   href: `/explore/entities/${entityType}/${entity.slug}#services`,
    //   icon: Activity,
    //   available: entity.has_services === true,
    // });

    // // Inventory - show if has_inventory flag exists
    // linkList.push({
    //   label: "Inventory",
    //   href: `/explore/entities/${entityType}/${entity.slug}#inventory`,
    //   icon: Package,
    //   available: entity.has_inventory === true,
    // });

    return linkList;
  }, [entity, entityType]);

  return (
    <div className="min-h-screen bg-white flex flex-col lg:justify-center lg:items-center">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20  lg:px-8 lg:pb-8  lg:max-w-5xl lg:w-full">
        <div className="w-full max-w-md lg:max-w-3xl space-y-8 lg:space-y-12">
          {/* Business Logo and Welcome Section */}
          <div className="flex flex-col items-center text-center space-y-4 lg:space-y-6">
            {/* Circular Logo */}
            <div className="relative w-24 h-24 lg:w-36 lg:h-36 rounded-full bg-primary flex items-center justify-center overflow-hidden shadow-md lg:shadow-lg">
              {entity.logo_url ? (
                <Image
                  src={entity.logo_url}
                  alt={entity.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 lg:h-20 lg:w-20 text-white" />
              )}
            </div>

            {/* Welcome Text */}
            <div className="space-y-2 lg:space-y-3">
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                {WELCOME_PAGE.heading} <span className="text-primary">{entity.name}</span>
              </h1>
              {entity.description && (
                <p className="text-sm lg:text-lg text-muted-foreground max-w-md lg:max-w-2xl">
                  {entity.description}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-3 lg:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4">
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  href={link.available ? link.href : "#"}
                  className={`flex rounded-2xl px-4 py-4 lg:px-6 lg:py-5 transition-all shadow-sm lg:shadow-md min-h-[60px] items-center ${
                    link.available
                      ? "bg-primary-tint hover:bg-primary-tint/80 cursor-pointer"
                      : "bg-primary-tint opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10 flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary-shade" />
                      </div>
                      <span className="font-medium text-primary-shade">
                        {link.label}
                      </span>
                    </div>
                    {link.available ? (
                      <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 text-primary-shade" />
                    ) : (
                      <span className="text-xs lg:text-sm text-muted-foreground">
                        {WELCOME_PAGE.comingSoon}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Mascots Illustration */}
      <div className="w-full px-4 pb-4 lg:pb-8 flex justify-center">
        <div className="flex items-end gap-2 lg:gap-4 max-w-md lg:max-w-2xl">
          <Image
            src="/assets/mascots/Group.svg"
            alt={WELCOME_PAGE.mascotAlt}
            width={60}
            height={60}
            className="h-16 w-auto lg:h-24 lg:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
