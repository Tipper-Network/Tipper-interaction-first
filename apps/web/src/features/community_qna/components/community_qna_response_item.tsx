"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ArrowUp, ArrowDown, MessageSquare, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  CommunityQNAResponseReplySchema,
  type CommunityQNAResponseReplyFormData,
} from "../types/community_qna_response_schema";

interface CommunityQNAResponseItemProps {
  response: {
    id: string;
    response: string;
    created_at: string;
    user?: {
      id: string;
      email: string;
      profile: {
        first_name: string;
        last_name: string;
      };
    };
    child_responses?: CommunityQNAResponseItemProps["response"][];
  };
  depth?: number;
  onReply: (parentId: string, reply: string) => void;
  disabled?: boolean;
}

const CommunityQNAResponseItem: React.FC<CommunityQNAResponseItemProps> = ({
  response,
  depth = 0,
  onReply,
  disabled = false,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const replyForm = useForm<CommunityQNAResponseReplyFormData>({
    resolver: zodResolver(CommunityQNAResponseReplySchema),
    defaultValues: {
      reply: "",
    },
  });

  const getInitials = (email?: string) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  const timeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  const handleSubmitReply = (data: CommunityQNAResponseReplyFormData) => {
    onReply(response.id, data.reply);
    replyForm.reset();
    setShowReplyForm(false);
  };

  const maxDepth = 3;
  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? " border-l-2 border-muted mt-4" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-secondary text-white text-xs">
            {response.user?.profile?.first_name?.charAt(0) +
              response.user?.profile?.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Author & Time */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {response.user?.profile?.first_name +
                " " +
                response.user?.profile?.last_name.charAt(0) || "Anonymous User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(response.created_at)}
            </span>
          </div>

          {/* Response Content */}
          <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">
            {response.response}
          </p>

          {/* Reply Form */}
          {showReplyForm && canReply && (
            <FormProvider {...replyForm}>
              <form
                onSubmit={replyForm.handleSubmit(handleSubmitReply)}
                className="mt-3 space-y-2"
              >
                <FormField
                  control={replyForm.control}
                  name="reply"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write a reply..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={replyForm.formState.isSubmitting || disabled}
                  >
                    {replyForm.formState.isSubmitting
                      ? "Posting..."
                      : "Post Reply"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowReplyForm(false);
                      replyForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}

          {/* Nested Replies */}
          {response.child_responses && response.child_responses.length > 0 && (
            <div className="mt-4">
              {response.child_responses.map((child) => (
                <CommunityQNAResponseItem
                  key={child.id}
                  response={child}
                  depth={depth + 1}
                  onReply={onReply}
                  disabled={disabled}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityQNAResponseItem;
