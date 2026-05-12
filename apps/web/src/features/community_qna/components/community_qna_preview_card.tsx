"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ArrowUp, ArrowDown, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface CommunityQNAPreviewCardProps {
  communityQNA: {
    id: string;
    question: string;
    tags: string[];
    created_at: string;
    upvotes_count: number;
    downvotes_count: number;
    responses_count: number;
    user?: {
      id: string;
      email: string;
      profile: {
        first_name: string;
        last_name: string;
      };
    };
  };
  onClick: () => void;
}
const CommunityQNAPreviewCard: React.FC<CommunityQNAPreviewCardProps> = ({
  communityQNA,
  onClick,
}) => {
  const timeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <Card
      onClick={onClick}
      className="mb-4 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-secondary/50 bg-white"
    >
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-secondary text-white text-xs">
              {communityQNA?.user?.profile?.first_name?.charAt(0) ||
                "T" + communityQNA?.user?.profile?.last_name?.charAt(0) ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">
              {communityQNA.user?.profile?.first_name +
                " " +
                communityQNA.user?.profile?.last_name.charAt(0) ||
                "Anonymous User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {timeAgo(communityQNA.created_at)}
            </p>
          </div>
        </div>

        {/* Question Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {truncateText(communityQNA.question, 100)}
        </h3>

        {/* Tags */}
        {communityQNA.tags && communityQNA.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {communityQNA.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {communityQNA.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{communityQNA.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
          <div className="flex items-center gap-1.5 hover:text-tertiary transition-colors">
            <ArrowUp className="w-4 h-4" />
            <span className="font-medium">{communityQNA.upvotes_count}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <ArrowDown className="w-4 h-4" />
            <span className="font-medium">{communityQNA.downvotes_count}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-secondary transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">{communityQNA.responses_count}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommunityQNAPreviewCard;
