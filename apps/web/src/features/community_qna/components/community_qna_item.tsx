"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCommunityQNAResponses,
  useCreateCommunityQNAResponse,
  useReplyToCommunityQNAResponse,
} from "../hooks/communtiy_qna_response_hook";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  X,
  ChevronLeft,
  Tag,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CommunityQNAResponseItem from "./community_qna_response_item";
import {
  CommunityQNAResponseSchema,
  type CommunityQNAResponseFormData,
} from "../types/community_qna_response_schema";

export interface CommunityQNAItemProps {
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
  community_id: string;
  onBack: () => void;
  disabled?: boolean;
}

const CommunityQNAItem: React.FC<CommunityQNAItemProps> = ({
  communityQNA,
  community_id,
  onBack,
  disabled = false,
}) => {
  const responseForm = useForm<CommunityQNAResponseFormData>({
    resolver: zodResolver(CommunityQNAResponseSchema),
    defaultValues: {
      response: "",
    },
  });

  const {
    data: responsesData,
    isLoading: isLoadingResponses,
    error: responsesError,
  } = useCommunityQNAResponses(community_id, communityQNA.id);

  const createResponseMutation = useCreateCommunityQNAResponse(
    communityQNA.id,
    community_id
  );

  const replyMutation = useReplyToCommunityQNAResponse(
    communityQNA.id,
    community_id
  );

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

  const handleSubmitResponse = async (data: CommunityQNAResponseFormData) => {
    if (disabled) return;

    try {
      await createResponseMutation.mutateAsync(data.response);
      responseForm.reset();
    } catch (error) {
      console.error("Failed to create response:", error);
    }
  };

  const handleReply = async (parentId: string, reply: string) => {
    if (disabled) return;

    try {
      await replyMutation.mutateAsync({
        response_id: parentId,
        response: reply,
      });
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  const responses = responsesData?.responses || [];

  return (
    <Card className="mb-4 border bg-white">
      <div className="p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Questions
        </Button>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-secondary text-white">
              {communityQNA.user?.profile?.first_name?.charAt(0) || "T" +
                communityQNA.user?.profile?.last_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">
              {communityQNA.user?.profile?.first_name +
                " " +
                communityQNA.user?.profile?.last_name.charAt(0) ||
                "Anonymous User"}
            </p>
            <p className="text-sm text-muted-foreground">
              {timeAgo(communityQNA.created_at)}
            </p>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {communityQNA.question}
        </h2>

        {/* Tags */}
        {communityQNA.tags && communityQNA.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {communityQNA.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add Response Form */}
        {!disabled && (
          <FormProvider {...responseForm}>
            <form
              onSubmit={responseForm.handleSubmit(handleSubmitResponse)}
              className="mb-6 space-y-3"
            >
              <FormField
                control={responseForm.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Write your answer..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={
                  responseForm.formState.isSubmitting ||
                  createResponseMutation.isPending
                }
                className="w-full sm:w-auto"
              >
                {responseForm.formState.isSubmitting ||
                createResponseMutation.isPending
                  ? "Expressing..."
                  : "Express Your Response"}
              </Button>
            </form>
          </FormProvider>
        )}

        {/* Responses Thread */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            {responses.length} {responses.length === 1 ? "Answer" : "Answers"}
          </h3>

          {isLoadingResponses ? (
            <p className="text-muted-foreground">Loading responses...</p>
          ) : responses.length === 0 ? (
            <p className="text-muted-foreground">
              No answers yet. Be the first to answer!
            </p>
          ) : (
            <div className="space-y-4">
              {responses.map((response: any) => (
                <CommunityQNAResponseItem
                  key={response.id}
                  response={response}
                  onReply={handleReply}
                  disabled={disabled}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommunityQNAItem;
