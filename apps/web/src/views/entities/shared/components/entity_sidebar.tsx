"use client";

import { useCallback, useEffect } from "react";
import {
  Building2,
  Users,
  Handshake,
  Settings,
  FileText,
  BarChart3,
  QrCode,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useEntityDetails } from "@/views/entities/shared/hooks/entities_hooks";

interface EntitySidebarProps {
  entityId: string;
}

const EntitySideBar = ({ entityId }: EntitySidebarProps) => {
  const pathname = usePathname();
  const { data: entity } = useEntityDetails(entityId);
  const { isMobile, setOpenMobile } = useSidebar();

  const closeSidebar = useCallback(() => {
    // Only auto-close on mobile (sheet). Desktop sidebar should remain open.
    if (!isMobile) return;
    setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  // Ensure the mobile sheet closes even if navigation happens without a click handler.
  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, pathname, setOpenMobile]);

  // Extract entity_type from entity data or default to 'business'
  const entityType = entity?.entity_type?.toLowerCase() || "business";

  // Build navigation items based on entity ID
  // Items are organized by: Core Management, Content & Engagement, Growth & Insights
  const items = [
    {
      title: "Profile",
      group: "Core Management",
      url: `/entities/${entityId}/${entityType}/profile`,
      icon: Building2,
      description: "Manage your entity profile",
      badge: null,
      section: "core",
      disabled: false,
    },
    {
      group: "Core Management",
      title: "Partnerships",
      url: `/entities/${entityId}/partnerships`,
      icon: Handshake,
      description: "Manage partnerships & invitations",
      badge: null,
      section: "core",
      disabled: true,
    },
    {
      group: "Content & Engagement",
      title: "Community",
      url: `/entities/${entityId}/community`,
      icon: Users,
      description: "Manage community & members",
      badge: null,
      section: "content",
      disabled: true,
    },
    {
      group: "Content & Engagement",
      title: "Posts & Content",
      url: `/entity/${entityId}/posts`,
      icon: FileText,
      description: "Manage posts and content",
      badge: null,
      section: "content",
      disabled: true,
    },
    // {
    //   group: "Content & Engagement",
    //   title: "Public Elements",
    //   url: `/entities/${entityId}/public`,
    //   icon: FileText,
    //   description: "Manage public elements",
    //   badge: null,
    //   section: "content",
    //   disabled: false,
    // },
    {
      group: "Growth & Insights",
      title: "Analytics",
      url: `/entities/${entityId}/analytics`,
      icon: BarChart3,
      description: "View analytics and insights",
      badge: null,
      section: "insights",
      disabled: true,
    },
    {
      group: "Growth & Insights",
      title: "QR Code",
      url: `/entities/${entityId}/qr-code`,
      icon: QrCode,
      description: "Download QR code",
      badge: null,
      section: "insights",
      disabled: false,
    },
    {
      group: "Core Management",
      title: "Settings",
      url: `/entities/${entityId}/settings`,
      icon: Settings,
      description: "Entity settings",
      badge: null,
      section: "core",
      disabled: true,
    },
  ];

  return (
    <Sidebar variant="inset" className="border-r" side="right">
      <SidebarHeader className="border-b p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-base md:text-lg font-semibold">
              {entity?.name || "Entity"}
            </h2>
            <p className="text-xs text-muted-foreground">Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="">
        {Object.entries(
          items.reduce(
            (acc, item) => {
              const group = item.group || "Other";
              if (!acc[group]) acc[group] = [];
              acc[group].push(item);
              return acc;
            },
            {} as Record<string, Array<(typeof items)[number]>>
          )
        ).map(([groupName, groupItems]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupItems.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/");
                  const content = (
                    <>
                      <item.icon className="h-3 w-3 md:h-4 md:w-4" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm md:text-base font-medium">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground hidden md:block">
                          {item.description}
                        </span>
                      </div>
                      <div>
                        {item?.badge ? (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            {item?.badge}
                          </Badge>
                        ) : null}
                      </div>
                    </>
                  );

                  return (
                    <SidebarMenuItem key={item.title} className="">
                      <SidebarMenuButton
                        asChild={!item.disabled}
                        isActive={isActive}
                        className="w-full justify-start disabled:opacity-50 disabled:cursor-not-allowed h-fit data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                        disabled={item.disabled}
                      >
                        {item.disabled ? (
                          <div className="flex items-center gap-2 md:gap-3  ">
                            {content}
                          </div>
                        ) : (
                          <Link
                            href={item.url}
                            onClick={closeSidebar}
                            className="flex items-center gap-2 md:gap-3 "
                          >
                            {content}
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4 items-center justify-center">
        <Link
          href="/"
          onClick={closeSidebar}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity "
        >
          <Image
            src="/assets/logos/Tipper_Logos_Alternate_Ruby.svg"
            alt="Tipper Network"
            width={150}
            height={150}
            className="h-12 "
          />
        </Link>
        <div className="text-xs text-muted-foreground">
          <p>Entity Management</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default EntitySideBar;
