"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCreateCommunityQNA } from "../hooks/community_qna_hook";
import { NeutralDialog } from "@/components/neutral_dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  CreateCommunityQNAFormSchema,
  type CreateCommunityQNAFormData,
} from "../types/community_qna_schema";

interface CreateCommunityQNAButtonProps {
  communityId: string;
  disabled?: boolean;
}

const CreateCommunityQNAButton: React.FC<CreateCommunityQNAButtonProps> = ({
  communityId,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const createCommunityQNA = useCreateCommunityQNA(communityId);

  const form = useForm<CreateCommunityQNAFormData>({
    resolver: zodResolver(CreateCommunityQNAFormSchema),
    defaultValues: {
      question: "",
      tags: "",
    },
  });

  const handleSubmit = async (data: CreateCommunityQNAFormData) => {
    try {
      // Transform tags from comma-separated string to array
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [];

      await createCommunityQNA.mutateAsync({
        question: data.question,
        tags: tagsArray,
      });
      form.reset();
      setIsOpen(false);
      toast.success("Question posted successfully!");
    } catch (error: any) {
      console.error("Failed to create CommunityQNA:", error);
      toast.error(
        error?.message || "Failed to create question. Please try again."
      );
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        New Question
      </Button>

      <NeutralDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Ask a Question"
      >
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What would you like to ask?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., general, help, feature"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add tags to help categorize your question
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || createCommunityQNA.isPending
                }
              >
                {form.formState.isSubmitting || createCommunityQNA.isPending
                  ? "Posting..."
                  : "Post Question"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </NeutralDialog>
    </>
  );
};

export default CreateCommunityQNAButton;
