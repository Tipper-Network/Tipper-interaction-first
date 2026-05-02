"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";
import { UploadPreview } from "./preview_component";

type UploadMediaPreviewProps = {
  files: File[];
  /**
   * Max number of thumbnails to show before collapsing into "+N".
   */
  maxThumbs?: number;
  className?: string;
  thumbClassName?: string;
};

export default function UploadMediaPreview({
  files,
  maxThumbs = 3,
  className,
  thumbClassName,
}: UploadMediaPreviewProps) {
  const list = Array.isArray(files) ? files : [];
  if (list.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {list.slice(0, maxThumbs).map((f) => (
        <UploadPreview
          key={`${f.name}-${f.size}-${f.lastModified}`}
          file={f}
          className={cn("cursor-pointer", thumbClassName)}
        />
      ))}

      {list.length > maxThumbs ? (
        <div className="h-16 w-16 rounded-md bg-background/70 ring-1 ring-border flex items-center justify-center text-[10px] text-muted-foreground">
          +{list.length - maxThumbs}
        </div>
      ) : null}
    </div>
  );
}
