"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";

export interface Community {
  id: string;
  community_name: string;
  users_count: string;
  slug: string;
  image: string;
  interests: string;
}

export interface CommunityListProps {
  communities: Community[];
}
//sommething ocmmented for git
const CommunityGrid: React.FC<CommunityListProps> = ({ communities }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3   2xl:grid-cols-4 gap-4 sm:gap-6">
      {communities.map((community) => (
        <Link
          key={community.slug}
          // href={`${community.id}`}
          href={`/explore/entity_communities/${community.slug}`}
          className="block border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
        >
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-1 truncate capitalize text-wrap">
                {community.community_name}
              </h2>
              <div className="flex flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Image
                  alt={community.community_name}
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-cover rounded-lg flex-shrink-0"
                  src={
                    community?.image ||
                    "/assets/icons/Tipper_Icons_People_Transparent_Ruby.svg"
                  }
                  width={96}
                  height={96}
                />
                <div className="flex flex-col justify-start items-start md:items-center md:justify-center flex-wrap text-center  sm:text-left min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {community.users_count} members
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {community.interests}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CommunityGrid;
