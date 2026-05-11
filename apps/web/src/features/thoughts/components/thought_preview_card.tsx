import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useThoughtMedia } from "../hooks/thoughts_hooks";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Image as ImageIcon } from "lucide-react";

import React from "react";
interface ThoughtPreviewProps {
  thought: any;
  onClick: () => void;
}
const ThoughtPreviewCard: React.FC<ThoughtPreviewProps> = ({
  thought,
  onClick,
}) => {
  const { data: media } = useThoughtMedia(thought.id);
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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

  const displayMedia = media?.slice(0, 4) || [];
  const hasMoreMedia = media && media.length > 4;

  return (
    <Card
      onClick={onClick}
      className="mb-4 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-secondary/50 bg-white"
    >
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback className="bg-secondary text-white text-xs">
              {getInitials("Anonymous User")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">Anonymous User</p>
            <p className="text-xs text-muted-foreground">
              {timeAgo(thought.created_at)}
            </p>
          </div>
        </div>

        {/* Thought Description */}
        <p className="text-sm text-foreground leading-relaxed mb-3">
          {truncateText(thought.description, 200)}
        </p>

        <div className="flex items-center justify-end gap-2">
          {displayMedia.map((url: string, index: number) => (
            <div
              key={index}
              className="relative  overflow-hidden bg-gray-100 w-30 h-30 rounded-md"
            >
              <Image
                src={url}
                alt={`Thought media ${index + 1}`}
                height={200}
                width={200}
                className="object-cover "
              />
              {hasMoreMedia && index === 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    +{media.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Thought   Engagement Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
          <div className="flex items-center gap-1.5 hover:text-secondary transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">{thought.comments_count}</span>
          </div>
          {media && media.length > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <ImageIcon className="w-4 h-4" />
              <span className="font-medium">{media.length}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ThoughtPreviewCard;
