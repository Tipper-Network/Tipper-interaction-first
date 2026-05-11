"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

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

const EntityGrid: React.FC<EntityListProps> = ({ entities }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {entities.map((entity) => {
        // Use entity_type from entity, fallback to BUSINESS for backwards compatibility
        const entityType = (entity.entity_type || "BUSINESS").toLowerCase();
        return (
          <Link
            key={entity.slug}
            href={`/explore/entities/${entityType}/${entity.slug}`}
            className="block border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <Card className="h-full">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-1 truncate capitalize text-wrap">
                  {entity.name}
                </h2>
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
                  <div className="flex flex-col justify-start items-start md:items-center md:justify-center  text-center sm:text-left min-w-0">
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
  );
};

export default EntityGrid;
