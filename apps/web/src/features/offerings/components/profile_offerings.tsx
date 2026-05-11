import React from "react";
import TabsComponent from "@/components/shared/tabs_component";
import PublicOffering from "./public_offerings";
import type { Offering } from "../api/types";
import {
  useEntityOfferings,
  useOfferingMediaTabsData,
} from "../hooks/offerings_hooks";

type ProfileOfferingsProps = {
  entityId: string;
  /**
   * Optional override (used by admin preview so unsaved isPublic toggles reflect immediately).
   * If omitted, we fetch offerings for the entity.
   */
  offerings?: Offering[];
};

const ProfileOfferings = ({ entityId, offerings }: ProfileOfferingsProps) => {
  const { data } = useEntityOfferings(entityId);
  const source = Array.isArray(offerings)
    ? offerings
    : Array.isArray(data)
      ? data
      : [];

  const publicOfferings = React.useMemo(() => {
    return source.filter((o) => o && o.isPublic !== false);
  }, [source]);

  const tabIds = React.useMemo(
    () => publicOfferings.map((o) => o.id),
    [publicOfferings]
  );
  const [active, setActive] = React.useState<string>(tabIds[0] ?? "");

  React.useEffect(() => {
    if (!active && tabIds[0]) setActive(tabIds[0]);
    if (active && tabIds.length > 0 && !tabIds.includes(active))
      setActive(tabIds[0]);
  }, [active, tabIds]);

  const media = useOfferingMediaTabsData({
    entityId,
    values: tabIds,
    activeValue: active,
    prefetchAll: false,
  });

  return (
    <div className="w-full">
      <TabsComponent
        tabs={publicOfferings.map((o) => ({ value: o.id, label: o.label }))}
        value={active}
        onValueChange={setActive}
        scrollToTopOnValueChange
        emptyState={
          <div className="text-sm text-muted-foreground">
            No public offerings yet.
          </div>
        }
        render={(activeValue) => {
          const offering = publicOfferings.find((o) => o.id === activeValue);
          if (!offering) return null;
          return (
            <PublicOffering
              offering={{
                ...offering,
                offeringMedia: media.dataByValue[activeValue] ?? [],
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default ProfileOfferings;
