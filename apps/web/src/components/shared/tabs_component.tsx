"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/utils";

export type TabsComponentTab = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type TabsComponentProps = {
  tabs: TabsComponentTab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  render: (activeValue: string) => React.ReactNode;
  /**
   * When changing tabs, scroll the page so the tabs component is at the top of the viewport.
   * Useful when tab content is tall and you want the new content fully in view.
   */
  scrollToTopOnValueChange?: boolean;
  /**
   * Pixels to offset from the top (e.g. for fixed headers).
   */
  scrollOffset?: number;
  scrollBehavior?: ScrollBehavior;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  emptyState?: React.ReactNode;
};

const TabsComponent = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  render,
  scrollToTopOnValueChange = false,
  scrollOffset = 0,
  scrollBehavior = "smooth",
  className,
  listClassName,
  triggerClassName,
  contentClassName,
  emptyState = null,
}: TabsComponentProps) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const normalized = React.useMemo(() => {
    return Array.isArray(tabs)
      ? tabs.filter(
          (t) => t && typeof t.value === "string" && t.value.length > 0
        )
      : [];
  }, [tabs]);

  const first = normalized[0]?.value ?? "";
  const initial = defaultValue ?? first;
  const isControlled = typeof value === "string";
  const [internalValue, setInternalValue] = React.useState<string>(initial);
  const activeValue = (isControlled ? value : internalValue) ?? initial;

  // If the tab list changes, keep the selected value valid.
  React.useEffect(() => {
    if (isControlled) return;
    if (normalized.length === 0) return;
    const current = internalValue || initial;
    const valid = normalized.some((t) => t.value === current);
    if (!valid) setInternalValue(initial);
  }, [isControlled, normalized, internalValue, initial]);

  if (normalized.length === 0) return <>{emptyState}</>;

  return (
    <div ref={rootRef} className={cn("w-full", className)}>
      <Tabs
        defaultValue={initial}
        value={activeValue}
        onValueChange={(next) => {
          if (!isControlled) setInternalValue(next);
          onValueChange?.(next);

          if (scrollToTopOnValueChange) {
            const el = rootRef.current;
            if (!el) return;
            const top =
              el.getBoundingClientRect().top + window.scrollY - scrollOffset;
            window.scrollTo({ top, behavior: scrollBehavior });
          }
        }}
        className="w-full"
      >
        <div className="border-b border-border">
          <TabsList
            className={cn(
              "w-full justify-start bg-transparent h-auto p-0 flex-wrap",
              listClassName
            )}
          >
            {normalized.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                disabled={t.disabled}
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:bg-transparent px-4 py-3 text-sm",
                  triggerClassName
                )}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent
          value={activeValue}
          className={cn("m-0 pt-4", contentClassName)}
        >
          {render(activeValue)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsComponent;
