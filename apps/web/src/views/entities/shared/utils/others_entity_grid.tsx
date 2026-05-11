"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getEntityTypeDisplayName } from "@/views/explore/tabs_types_management";
export interface Entity {
  id: string;
  name: string;
  description: string;
  slug: string;
  address?: {
    city?: string | null;
    country?: string | null;
    street?: string | null;
    neighborhood?: string | null;
  } | null;
  logo_url: string;
  entity_type?: string;
}

export interface EntityListProps {
  entities: Entity[];
}

const OthersEntityGrid: React.FC<EntityListProps> = ({ entities }) => {
  // Group entities by entity_type
  const groupedEntities = useMemo(() => {
    const groups = new Map<string, Entity[]>();

    entities.forEach((entity) => {
      const entityType = (entity.entity_type || "OTHER").toUpperCase();
      if (!groups.has(entityType)) {
        groups.set(entityType, []);
      }
      groups.get(entityType)!.push(entity);
    });

    // Sort groups by entity type name for consistent display
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [entities]);

  if (groupedEntities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No spaces found.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {groupedEntities.map(([entityType, typeEntities]) => (
        <div key={entityType} className="space-y-4">
          {/* Section Header */}
          <div className="border-b border-border pb-2">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              {getEntityTypeDisplayName(entityType)}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {typeEntities.length}{" "}
              {typeEntities.length === 1 ? "space" : "spaces"}
            </p>
          </div>

          {/* Entity Grid for this type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {typeEntities.map((entity) => {
              const entityTypeLower = entityType.toLowerCase();
              return (
                <Link
                  key={entity.id}
                  href={`/explore/entities/${entityTypeLower}/${entity.slug}`}
                  className="block border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <Card className="h-full">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 truncate capitalize text-wrap">
                        {entity.name}
                      </h3>
                      <div className="flex flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <Image
                          width={96}
                          height={96}
                          src={
                            entity.logo_url ||
                            "/assets/icons/Tipper_Icons_Places_Transparent_Ruby.svg"
                          }
                          alt={entity.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex flex-col justify-start items-start md:items-center md:justify-center text-center sm:text-left min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1 line-clamp-2">
                            {entity.description}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {[entity.address?.city, entity.address?.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OthersEntityGrid;
