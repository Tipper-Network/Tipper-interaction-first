"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/utils";
import { Loader2 } from "lucide-react";

export type AdminOfferingToggle = {
  id: string;
  label: string;
  isPublic: boolean;
};

export type AdminManageProfileViewProps = {
  /**
   * Only fixed section in this panel.
   */
  imagesEnabled: boolean;
  onImagesToggle: (checked: boolean) => void;

  /**
   * Everything else comes from the backend offerings table.
   * We do NOT assume offering names/types here.
   */
  offerings: AdminOfferingToggle[];
  onOfferingToggle: (offeringId: string, checked: boolean) => void;

  /**
   * Whether there is anything to persist (images toggle and/or offerings).
   * Controls the Save button state/label.
   */
  hasChanges?: boolean;

  onSave?: () => Promise<void> | void;
  isSaving?: boolean;
  className?: string;
  title?: string;
};

function splitIntoColumns<T>(items: T[]) {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)] as const;
}

const AdminManageProfileView = ({
  imagesEnabled,
  onImagesToggle,
  offerings,
  onOfferingToggle,
  hasChanges = false,
  onSave,
  isSaving = false,
  className,
  title = "What would you like on your profile?",
}: AdminManageProfileViewProps) => {
  const normalizedOfferings = (offerings ?? []).filter(
    (o) => o && typeof o.id === "string" && o.id.length > 0
  );

  const [left, right] = splitIntoColumns(normalizedOfferings);

  return (
    <div
      className={cn(
        "w-full rounded-3xl bg-primary/10 px-4 py-4 ring-1 ring-border",
        className
      )}
    >
      <div className="text-center">
        <div className="text-sm font-semibold text-foreground">{title}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {/* Fixed: Images */}
          <div className="flex items-center justify-between rounded-full bg-background/80 px-3 py-2 shadow-sm ring-1 ring-border">
            <div className="text-xs font-medium text-foreground">Images</div>
            <Switch
              checked={imagesEnabled}
              onCheckedChange={(checked) => onImagesToggle(checked)}
              disabled={isSaving}
            />
          </div>

          {left.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-full bg-background/80 px-3 py-2 shadow-sm ring-1 ring-border"
            >
              <div className="text-xs font-medium text-foreground">
                {o.label}
              </div>
              <Switch
                checked={o.isPublic}
                onCheckedChange={(checked) => onOfferingToggle(o.id, checked)}
                disabled={isSaving}
              />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {right.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-full bg-background/80 px-3 py-2 shadow-sm ring-1 ring-border"
            >
              <div className="text-xs font-medium text-foreground">
                {o.label}
              </div>
              <Switch
                checked={o.isPublic}
                onCheckedChange={(checked) => onOfferingToggle(o.id, checked)}
                disabled={isSaving}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <Button
          type="button"
          disabled={isSaving || !hasChanges}
          className="h-8 rounded-full px-5 text-xs font-semibold"
          onClick={() => {
            if (!hasChanges) return;
            onSave?.();
          }}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : hasChanges ? (
            "Save Changes"
          ) : (
            "Saved"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminManageProfileView;
