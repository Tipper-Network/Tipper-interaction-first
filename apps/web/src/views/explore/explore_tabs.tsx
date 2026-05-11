"use client";

import EntityCommunityPage from "@/app/(root)/explore/entity_communities/entity_community_content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { EntityType__Enum } from "@tipper/shared";
import { useRouter, usePathname } from "next/navigation";
import { EntityTypeList } from "./entity_type_list";
import { OtherEntityTypesList } from "./other_entity_types_list";
import ExplanationPage from "../../app/(root)/explore/explanation/explanation_page";
import {
  OTHER_ENTITY_TYPES,
  ENTITY_TYPE_LABELS,
  ACTIVE_ENTITY_TYPES,
} from "./tabs_types_management";

const ExploreTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Get current active tab from URL or default to first entity type
  const getActiveTab = () => {
    if (pathname?.includes("/explore/entity_communities")) {
      return "entity_communities";
    }
    if (pathname?.includes("/explore/explanation")) {
      return "explanation";
    }
    // Check if pathname matches an entity type (new route structure)
    for (const entityType of ACTIVE_ENTITY_TYPES) {
      const entityTypeLower = entityType.toLowerCase();
      if (
        pathname?.includes(`/explore/entities/${entityTypeLower}`) ||
        pathname?.includes(`/explore/${entityTypeLower}`) // Support old routes for redirects
      ) {
        return entityTypeLower;
      }
    }
    // Default to entity_communities
    return "explanation";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (value: string) => {
    if (value === "entity_communities") {
      router.push("/explore/entity_communities");
    } else if (value === "explanation") {
      router.push("/explore/explanation");
    } else {
      router.push(`/explore/entities/${value}`);
    }
  };

  return (
    <div className="w-full flex ">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
        defaultValue="explanation"
      >
        <div className="border-b border-gray-200 w-full">
          <TabsList className="w-full justify-center bg-transparent h-auto p-0 flex-wrap">
            <TabsTrigger
              value="explanation"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:bg-transparent px-6 py-3"
            >
              Wut is this ???{" "}
            </TabsTrigger>
            <TabsTrigger
              value="entity_communities"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:bg-transparent px-6 py-3"
            >
              Local Hubs/Communities
            </TabsTrigger>
            {ACTIVE_ENTITY_TYPES.map((entityType) => {
              const value = entityType.toLowerCase();
              return (
                <TabsTrigger
                  key={entityType}
                  value={value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:bg-transparent px-6 py-3"
                >
                  {ENTITY_TYPE_LABELS[entityType as EntityType__Enum]}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="explanation">
            <ExplanationPage />
          </TabsContent>
          <TabsContent value="entity_communities" className="m-0">
            <EntityCommunityPage />
          </TabsContent>
          {ACTIVE_ENTITY_TYPES.map((entityType) => {
            const value = entityType.toLowerCase();
            // Use special component for "OTHER" tab that shows all non-business, non-creative types
            if (entityType === EntityType__Enum.OTHER) {
              return (
                <TabsContent key={entityType} value={value} className="m-0">
                  <OtherEntityTypesList
                    otherEntityTypes={OTHER_ENTITY_TYPES.filter(
                      (t) => t !== EntityType__Enum.BUSINESS
                    )}
                  />
                </TabsContent>
              );
            }
            // Regular component for other entity types
            return (
              <TabsContent key={entityType} value={value} className="m-0">
                <EntityTypeList entityType={entityType} />
              </TabsContent>
            );
          })}
        </div>
      </Tabs>
    </div>
  );
};

export default ExploreTabs;
