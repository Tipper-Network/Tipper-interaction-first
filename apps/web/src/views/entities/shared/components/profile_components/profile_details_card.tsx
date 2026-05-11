"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export type ProfileDetailItem = {
  /**
   * Hidden by default. Shown only when the icon is active.
   */
  label?: string;
  value: React.ReactNode;
  className?: string;
  iconClicked?: React.ReactNode;
  icon?: React.ReactNode;
};

export type ProfileDetailsCardProps = {
  items: ProfileDetailItem[];
  className?: string;
  defaultActiveIndex?: number | null;
};

export function ProfileDetailsCard({
  items,
  className,
  defaultActiveIndex = 0,
}: ProfileDetailsCardProps) {
  const normalizedItems = items.filter(Boolean);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(
    defaultActiveIndex
  );

  const activeItem =
    activeIndex !== null ? normalizedItems[activeIndex] : normalizedItems[0];

  const onIconClick = (idx: number) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-white/70  shadow-sm ring-1 justify-center items-center ring-border px-4 py-3",
        className
      )}
    >
      {/* icons row */}
      <div className="flex items-center justify-center gap-2">
        {normalizedItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <Button
              key={idx}
              type="button"
              variant={"ghost"}
              size="icon"
              className={cn("rounded-full ")}
              aria-pressed={isActive}
              onClick={() => onIconClick(idx)}
            >
              {isActive ? item.iconClicked : item.icon}

              <span className="sr-only">{item.label ?? "Detail"}</span>
            </Button>
          );
        })}
      </div>

      {/* exposed value area */}
      <div className="w-full flex items-center justify-center">
        <div className="mt-3 min-h-[2.5rem] rounded-xl px-4 py-2  w-fit bg-primary text-white">
          {activeItem ? (
            <div className="text-center w-full">
              {activeItem.label ? (
                <div className="text-sm uppercase tracking-wide ">
                  {activeItem.label}
                </div>
              ) : null}
              <div className="text-sm  break-words">{activeItem.value}</div>
            </div>
          ) : (
            <div className="text-center text-xs text-muted-foreground">
              Tap an icon to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
