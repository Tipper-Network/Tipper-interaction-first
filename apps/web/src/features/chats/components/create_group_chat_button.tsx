"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NeutralDialog } from "@/components/neutral_dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { useCreateGroupChat } from "../hooks/chats_hooks";
import { ToolTipWrapper } from "@/components/toolTip_Wrapper";
import {
  CreateGroupChatSchema,
  type CreateGroupChatFormData,
} from "../types/group_chat_schema";

interface GroupChatCreateButtonProps {
  communityId: string;
  disabled?: boolean;
}

const GroupChatCreateButton: React.FC<GroupChatCreateButtonProps> = ({
  communityId,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const createGroupChatMutation = useCreateGroupChat(communityId);

  const form = useForm<CreateGroupChatFormData>({
    resolver: zodResolver(CreateGroupChatSchema),
    defaultValues: {
      groupChatName: "",
    },
  });

  const handleCreateGroupChat = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (data: CreateGroupChatFormData) => {
    try {
      await createGroupChatMutation.mutateAsync({
        groupChatName: data.groupChatName,
      });
      toast.success("Group chat created successfully!");
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Group Chat creation failed:", error);
      toast.error(
        (error as Error).message ||
          "Failed to create group chat. Please try again."
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
      <ToolTipWrapper
        disabled={disabled}
        tooltipTitle="you have to join the community to create a group chat"
      >
        <Button
          onClick={handleCreateGroupChat}
          variant="simple"
          disabled={disabled}
          className=""
        >
          Create Group Chat
        </Button>
      </ToolTipWrapper>
      <NeutralDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Group Chat"
        description="Create a New group chat in your community"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="groupChatName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Chat Name</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full border rounded p-2 text-sm"
                      rows={4}
                      placeholder="group chat name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={createGroupChatMutation.isPending}
                className="btn-primary"
              >
                {createGroupChatMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </NeutralDialog>
    </>
  );
};

export default GroupChatCreateButton;
