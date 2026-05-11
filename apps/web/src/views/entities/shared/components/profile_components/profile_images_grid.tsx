import React from "react";
import { cn } from "@/lib/utils/utils";
import Image from "next/image";
export type ProfileImagesGridProps = {
  title?: string;
  imageUrls?: string[];
  className?: string;
  /**
   * If you don’t have images yet, show placeholder tiles.
   */
  placeholderCount?: number;
};

export function ProfileImagesGrid({
  title = "Images",
  imageUrls = [],
  placeholderCount = 3,
  className,
}: ProfileImagesGridProps) {
  const hasImages = imageUrls.length > 0;
  const tiles = hasImages
    ? imageUrls
    : Array.from({ length: placeholderCount }).map(() => "");

  return (
    <div className={cn("w-full", className)}>
      <div className="text-center text-sm font-semibold text-foreground mb-3">
        {title}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {tiles.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="aspect-square rounded-2xl bg-muted ring-1 ring-border overflow-hidden"
          >
            {url ? (
              <Image
                src={url}
                alt={`image-${idx + 1}`}
                className="h-full w-full object-cover"
                width={500}
                height={500}
                loading="lazy"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
