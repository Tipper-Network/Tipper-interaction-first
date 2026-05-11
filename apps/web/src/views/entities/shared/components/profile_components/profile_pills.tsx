import React from "react";
import { cn } from "@/lib/utils/utils";

export type ProfilePillsProps = {
  title: string;
  pills: string[];
  className?: string;
  pillClassName?: string;
};

export function ProfilePills({
  title,
  pills,
  className,
  pillClassName,
}: ProfilePillsProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-white/70 shadow-sm ring-1 ring-border px-4 py-3 h-fit",
        className
      )}
    >
      <div className="flex flex-col items-center justify-between gap-3">
        <div className="text-sm font-semibold ">{title}</div>
        <div className="flex flex-wrap justify-end gap-2">
          {pills.map((p) => (
            <span
              key={p}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium ",
                pillClassName
              )}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
