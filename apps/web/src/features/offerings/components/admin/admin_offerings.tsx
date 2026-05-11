"use client";

import React from "react";
import TabsComponent from "@/components/shared/tabs_component";
import type { Offering, CreateOfferingInput } from "../../api/types";
import {
  useCreateOffering,
  useDeleteOffering,
  useUpdateOffering,
} from "../../hooks/offerings_hooks";
import {
  OfferingFormat__Enum,
  OfferingStatus__Enum,
  OfferingType__Enum,
} from "@tipper/shared";
import OfferingRow from "./offering_row";
import CreateOfferings from "./create_offerings";

type AdminOfferingsProps = {
  entityId: string;
  offerings: Offering[];
  isLoading?: boolean;
  isError?: boolean;
  offeringStatus?: OfferingStatus__Enum;
};

export default function AdminOfferings({
  entityId,
  offerings,
  isLoading = false,
  isError = false,
}: AdminOfferingsProps) {
  const createMut = useCreateOffering(entityId);
  const updateMut = useUpdateOffering(entityId);
  const deleteMut = useDeleteOffering(entityId);

  const sorted = React.useMemo(() => {
    const list = Array.isArray(offerings) ? offerings : [];
    return [...list].sort((a, b) => a.label.localeCompare(b.label));
  }, [offerings]);

  const tabIds = React.useMemo(() => sorted.map((o) => o.id), [sorted]);
  const [active, setActive] = React.useState<string>(tabIds[0] ?? "");

  React.useEffect(() => {
    if (!active && tabIds[0]) setActive(tabIds[0]);
    if (active && tabIds.length > 0 && !tabIds.includes(active))
      setActive(tabIds[0]);
  }, [active, tabIds]);

  return (
    <div className="w-full rounded-3xl bg-background/80 ring-1 ring-border px-4 py-4">
      <div className="text-sm font-semibold text-foreground">Offerings</div>
      <CreateOfferings entityId={entityId} />

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading offerings…
          </div>
        ) : null}
        {isError ? (
          <div className="text-sm text-destructive">
            Failed to load offerings.
          </div>
        ) : null}

        <TabsComponent
          tabs={sorted.map((o) => ({ value: o.id, label: o.label }))}
          value={active}
          onValueChange={setActive}
          scrollToTopOnValueChange
          emptyState={
            !isLoading && !isError ? (
              <div className="text-sm text-muted-foreground">
                No offerings yet. Add one above.
              </div>
            ) : null
          }
          render={(activeValue) => {
            const o = sorted.find((x) => x.id === activeValue);
            if (!o) return null;
            return (
              <OfferingRow
                entityId={entityId}
                offering={o}
                onRename={async (label) => {
                  await updateMut.mutateAsync({
                    offeringId: o.id,
                    payload: { label },
                  });
                }}
                onDelete={async () => {
                  await deleteMut.mutateAsync(o.id);
                }}
                isMutating={
                  updateMut.isPending ||
                  deleteMut.isPending ||
                  createMut.isPending
                }
              />
            );
          }}
        />
      </div>
    </div>
  );
}
