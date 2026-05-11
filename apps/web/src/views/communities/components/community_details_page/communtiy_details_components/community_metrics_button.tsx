import React from "react";
import { Users, MessageCircle, TrendingUp, Tag } from "lucide-react";

const CommunityMetricsButton = ({
  users_count,
  active_count,
  trending_count,
  interests_count,
}: {
  users_count: number;
  active_count: number;
  trending_count: number;
  interests_count: number;
}) => {
  // Format numbers for display
  const membersCount = users_count
    ? users_count >= 1000
      ? `${(users_count / 1000).toFixed(1)}k`
      : users_count.toString()
    : "X";
  const activeCount = active_count
    ? active_count >= 1000
      ? `${(active_count / 1000).toFixed(1)}k`
      : active_count.toString()
    : "X";
  const trendingCount = trending_count
    ? trending_count >= 1000
      ? `${(trending_count / 1000).toFixed(1)}k`
      : trending_count.toString()
    : "X";
  const interestsCount = interests_count
    ? interests_count >= 1000
      ? `${(interests_count / 1000).toFixed(1)}k`
      : interests_count.toString()
    : "X";
  return (
    <div>
      {/* Metric Buttons - Four buttons in a grid */}
      <div className="flex  justify-around md:justify-center gap-1 md:gap-4 pb-2 w-full text-xs">
        {/* Members - Light teal */}
        <div className="bg-tertiary-tint rounded-lg gap-2 p-1 px-2 text-center flex items-center justify-center">
          <p className=" font-medium text-tertiary">{membersCount} Members</p>
        </div>

        {/* Active - Light pink */}
        <div className="bg-primary-tint rounded-lg gap-2 p-1 px-2 text-center flex items-center justify-center">
          <p className=" font-medium text-primary">{activeCount} Active</p>
        </div>

        {/* Trending - Light purple */}
        <div className="bg-secondary-tint rounded-lg gap-2 p-1 px-2 text-center flex items-center justify-center">
          <p className="font-medium text-purple-secondary">
            {trendingCount} Trending
          </p>
        </div>

        {/* Interests - Light green */}
        <div className="bg-tertiary-tint rounded-lg gap-2 p-1 px-2 text-center flex items-center justify-center">
          <p className=" font-medium text-tertiary-shade">
            {interestsCount} Interests
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityMetricsButton;
