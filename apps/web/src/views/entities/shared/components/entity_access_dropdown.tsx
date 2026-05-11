"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, ChevronDown, ExternalLink } from "lucide-react";
import { useUserEntities } from "@/views/entities/shared/hooks/entities_hooks";
import { getEntityProfileUrl } from "@/views/entities/shared/utils/entity_routes";
import Image from "next/image";
import Link from "next/link";

export function EntityAccessDropdown() {
  const router = useRouter();
  const { data: userEntities = [], isLoading } = useUserEntities();
  console.log("userEntities", userEntities);
  if (isLoading) {
    return null;
  }

  if (!userEntities || userEntities.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-foreground hover:text-primary"
        >
          <Building2 className="h-4 w-4" />
          <span className="hidden md:inline">My Entities</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Your Entities</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userEntities.map((entity: any) => {
          return (
            <DropdownMenuItem
              key={entity.id}
              onClick={() => {
                router.push(getEntityProfileUrl(entity.id, entity.entity_type));
              }}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                {entity?.logo_url ? (
                  <Image
                    src={entity.logo_url}
                    alt={entity?.name}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-3 w-3 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entity?.name}</p>
                  {/* <p className="text-xs text-muted-foreground capitalize">
                    {role.user_entity_position?.toLowerCase() || "Member"}
                  </p> */}
                </div>
                <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mobile-friendly version for the sheet menu
export function MobileEntityAccess({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const { data: userEntities = [], isLoading } = useUserEntities();

  if (isLoading) {
    return null;
  }

  if (!userEntities || userEntities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        My Entities
      </p>
      {userEntities.map((item: any) => {
        const entity = item.entity;
        const role = item.role;
        return (
          <Link
            key={entity.id}
            href={getEntityProfileUrl(entity.id, entity.entity_type)}
            onClick={onNavigate}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {entity.logo_url ? (
              <Image
                src={entity.logo_url}
                alt={entity.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{entity.name}</p>
              {/* <p className="text-xs text-muted-foreground capitalize">
                {role.user_entity_position?.toLowerCase() || "Member"}
              </p> */}
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
}
