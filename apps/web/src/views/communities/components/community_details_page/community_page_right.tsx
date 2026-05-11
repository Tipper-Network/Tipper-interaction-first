"use client";

import { Calendar, Clock, MapPin, MessageCircle } from "lucide-react";
import ComingSoon from "@/components/ui/coming_soon";

interface CommunityPageRightProps {
  mockActivities?: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
  }>;
  mockTopics?: string[];
}

const CommunityPageRight = ({
  mockActivities,
  mockTopics,
}: CommunityPageRightProps) => {
  return (
    <div className="w-full lg:min-w-80 lg:space-y-4  space-y-2 mt-2">
      {/* Upcoming Activities */}

      <div className="  w-full border border-border rounded-xl p-6 shadow-sm scrollbar-hide flex-nowrap">
        <div className="flex items-center gap-2 mb-4 flex-col text-primary-shade">
          <h3 className="h3-bold ">Activities Feature</h3>
          <div className="flex items-center gap-2 bg-primary-tint rounded-3xl p-2">
            <Clock className="h-5 w-5 text-muted-foreground  " />
            <p className="text-sm text-muted-foreground block">
              launching soon...
            </p>
          </div>

          <ComingSoon />
        </div>
      </div>
    </div>
  );
};

export default CommunityPageRight;
