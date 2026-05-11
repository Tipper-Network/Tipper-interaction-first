"use client";

import React, { useState } from "react";
import { MessageCircle, Users, Calendar, MessageSquare } from "lucide-react";
import ChatBox from "./chat_box";
import { useInfiniteGroupChats } from "../hooks/chats_hooks";
import { Button } from "@/components/ui/button";
import GroupChatCreateButton from "./create_group_chat_button";
import { cn } from "@/lib/utils/utils";
import { toast } from "sonner";

interface GroupChatGridProps {
  communityId: string;
  hasJoined: boolean;
}

const GroupChatGrid: React.FC<GroupChatGridProps> = ({
  communityId,
  hasJoined,
}) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGroupChats(communityId);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  if (isLoading) {
    return <p>Loading group chats...</p>;
  }

  if (isError) {
    return <p>Failed to load group chats.</p>;
  }

  const groupChats = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="lg:h3-bold text-xl font-bold text-foreground">
          Community Chats
        </h3>
        <div className="min-w-fit">
          <GroupChatCreateButton
            communityId={communityId}
            disabled={!hasJoined}
          />
        </div>
      </div>
      <p className="p-regular-16 text-muted-foreground mb-6">
        Join conversations and connect with community members
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {groupChats.map((chat) => (
          <div
            key={chat.id}
            className={`p-6 border border-border rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary/20 ${
              selectedChatId === chat.id
                ? "border-primary bg-primary/10"
                : "bg-background"
            }`}
            onClick={() => {
              if (!hasJoined) {
                toast("You must join the community to join group chats.", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                  },
                });
                return;
              }
              setSelectedChatId(chat.id);
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-tint rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="p-medium-14">{chat.members_count}</span>
              </div>
            </div>

            <h3 className="h3-bold text-foreground mb-2">
              {chat?.groupchat_name}
            </h3>
            <p className="p-regular-14 text-muted-foreground mb-3 ">
              {chat?.last_message || "No messages yet"}
            </p>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="p-medium-12">
                {chat?.last_message_time || "—"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="btn-primary"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}

      {selectedChatId && (
        <>
          <div className="mt-8 bg-background border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="h3-bold text-foreground">
                {
                  groupChats.find((chat) => chat.id === selectedChatId)
                    ?.groupchat_name
                }
              </h3>
              <button
                onClick={() => setSelectedChatId(null)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors p-medium-14"
              >
                ← Back to chat list
              </button>
            </div>
          </div>

          <div className="mt-8">
            <ChatBox groupchatId={selectedChatId} />
          </div>
        </>
      )}
    </div>
  );
};

export default GroupChatGrid;
