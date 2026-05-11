"use client";

import { useEntityDetails } from "../../shared/hooks/entities_hooks";
import { Separator } from "@/components/ui/separator";
import InstagramUrlLink from "@/components/button_external_links/InstagramUrlLink";

interface EntityPageDetailsProps {
  entityId: string;
}

const AdminEntityDetailsComponent = ({ entityId }: EntityPageDetailsProps) => {
  const { data: entity, isLoading, isError } = useEntityDetails(entityId);
  if (isLoading) {
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading entity details...
      </div>
    );
  }

  if (isError || !entity) {
    return (
      <div className="p-6 text-destructive">
        Failed to load entity details. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Entity Name
          </p>
          <p className="text-base text-foreground">{entity.name || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Entity Email
          </p>
          <p className="text-base text-foreground">{entity.email || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Entity Phone
          </p>
          <p className="text-base text-foreground">{entity.phone || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Instagram URL
          </p>
          {entity.instagram_url ? (
            <InstagramUrlLink instagram_url={entity.instagram_url} />
          ) : (
            <p className="text-base text-foreground">N/A</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Entity ID
          </p>
          <p className="text-sm font-mono text-foreground">{entity.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Entity Status
          </p>
          <p className="text-sm text-foreground capitalize">
            {entity.entity_status || "N/A"}
          </p>
        </div>
        {entity.description && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Description
            </p>
            <p className="text-sm text-foreground">{entity.description}</p>
          </div>
        )}
        {(entity.address?.city ||
          entity.address?.neighborhood ||
          entity.address?.street ||
          entity.address?.country) && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Location
            </p>
            <p className="text-sm text-foreground">
              {[
                entity.address?.street,
                entity.address?.neighborhood,
                entity.address?.city,
                entity.address?.country,
              ]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEntityDetailsComponent;
