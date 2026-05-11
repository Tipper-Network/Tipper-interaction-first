"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateThought } from "../hooks/thoughts_hooks";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { NeutralDialog } from "@/components/neutral_dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UploadMedia } from "@/components/upload_file";
import { ToolTipWrapper } from "@/components/toolTip_Wrapper";
import {
  CreateThoughtSchema,
  type CreateThoughtFormData,
} from "../types/thought_schema";

interface ThoughtCreateButtonProps {
  communityId: string;
  disabled?: boolean;
}

const ThoughtCreateButton: React.FC<ThoughtCreateButtonProps> = ({
  communityId,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const createThoughtMutation = useCreateThought(communityId);

  const form = useForm<CreateThoughtFormData>({
    resolver: zodResolver(CreateThoughtSchema),
    defaultValues: {
      description: "",
      files: [],
    },
  });

  const handleCreateThought = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (data: CreateThoughtFormData) => {
    try {
      await createThoughtMutation.mutateAsync({
        community_id: communityId,
        description: data.description || "",
        files: data.files || [],
      });
      form.reset();
      setIsOpen(false);
      toast.success("Thought created successfully!");
    } catch (error) {
      console.error("Thought creation failed:", error);
      toast.error("Thought creation failed.");
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
      <ToolTipWrapper
        tooltipTitle="Join the community to share a thought
"
        disabled={disabled}
        variant="clickable"
      >
        <Button
          onClick={handleCreateThought}
          variant="simple"
          disabled={disabled}
        >
          Share a Thought
        </Button>
      </ToolTipWrapper>

      <NeutralDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Create a Thought"
        description="Create a thought for your community"
      >
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thought Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="What's on your mind?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UploadMedia
                      onChange={(files) => field.onChange(files)}
                      multiple
                      accept="image/*,video/*"
                      selected={field.value || []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || createThoughtMutation.isPending
                }
              >
                {form.formState.isSubmitting || createThoughtMutation.isPending
                  ? "Expressing..."
                  : "Express Your Thought"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </NeutralDialog>
    </>
  );
};

export default ThoughtCreateButton;
