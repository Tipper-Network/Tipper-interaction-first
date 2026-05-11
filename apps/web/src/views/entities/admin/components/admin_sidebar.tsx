"use client";

import { useCallback, useEffect } from "react";
import { Home, Inbox, Users, Settings, Shield, Tag } from "lucide-react";
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

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    description: "Overview and statistics",
    badge: null,
  },
  {
    title: "Communities",
    url: "/admin/communities",
    icon: Inbox,
    description: "Manage communities",
    badge: null,
  },
  {
    title: "Entities",
    url: "/admin/entities",
    icon: Users,
    description: "Manage entities",
    badge: null,
  },
  {
    title: "Tags",
    url: "/admin/tags",
    icon: Tag,
    description: "Manage tags",
    badge: null,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    description: "System settings",
    badge: null,
  },
];

const AdminSideBar = () => {
  const pathname = usePathname();
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

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="border-b p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <h2 className="text-base md:text-lg font-semibold">Admin Panel</h2>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title} className="">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="w-full justify-start data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                    >
                      <Link
                        href={item.url}
                        onClick={closeSidebar}
                        className="flex items-center gap-2 md:gap-3 h-auto"
                      >
                        <item.icon
                          className={`h-3 w-3 md:h-4 md:w-4 ${
                            isActive ? "text-primary" : ""
                          }`}
                        />
                        <div className="flex flex-col items-start">
                          <span className="text-sm md:text-base font-medium">
                            {item.title}
                          </span>
                          <span className="text-xs text-muted-foreground hidden md:block">
                            {item.description}
                          </span>
                        </div>
                        {item?.badge ? (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            {item?.badge}
                          </Badge>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Link
          href="/"
          onClick={closeSidebar}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity "
        >
          <Image
            src="/assets/logos/Tipper_Logos_Primary_Ruby.svg"
            alt="Tipper Network"
            width={150}
            height={150}
            className="h-12 "
          />
        </Link>
        <div className="text-xs text-muted-foreground">
          <p>Tipper Admin v1.0</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSideBar;
