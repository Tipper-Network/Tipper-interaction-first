import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import Image from "next/image";
import { useEntityLogo } from "../../hooks/entities_media_hooks";
export type ProfileHeaderProps = {
  name: string;
  subtitle?: string;
  entityId: string;
  fallbackAvatarUrl?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
};

export function ProfileHeader({
  name,
  subtitle,
  entityId,
  fallbackAvatarUrl = "/assets/logos/Tipper_Logos_Brandmark_Ruby.svg",
  actionLabel,
  onActionClick,
  className,
}: ProfileHeaderProps) {
  const { data: logoData } = useEntityLogo(entityId);
  const logoSrc = logoData?.url ?? fallbackAvatarUrl;
  return (
    <div
      className={cn("w-full flex flex-col items-center text-center", className)}
    >
      <div className="h-16 w-16 rounded-full bg-white shadow-sm ring-1 ring-border overflow-hidden flex items-center justify-center">
        <Image
          src={logoSrc}
          alt={`${name} avatar`}
          className="h-full w-full object-cover"
          width={64}
          height={64}
        />
      </div>

      <div className="mt-3 space-y-1">
        <h1 className="text-2xl font-semibold leading-tight text-foreground">
          {name}
        </h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground leading-snug max-w-[28ch] mx-auto">
            {subtitle}
          </p>
        ) : null}
      </div>

      {actionLabel ? (
        <Button
          type="button"
          size="sm"
          className="mt-3 rounded-full px-5"
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
