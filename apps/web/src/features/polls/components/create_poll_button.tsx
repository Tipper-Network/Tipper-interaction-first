"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NeutralDialog } from "@/components/neutral_dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import Image from "next/image";
import { useCreatePoll } from "../hooks/polls_hook";
import { ToolTipWrapper } from "@/components/toolTip_Wrapper";
import { Plus } from "lucide-react";

interface PollCreateButtonProps {
  communityId: string;
  disabled?: boolean;
}

const PollCreateButton: React.FC<PollCreateButtonProps> = ({
  communityId,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const createPollMutation = useCreatePoll(communityId);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) =>
    setOptions(options.filter((_, i) => i !== index));

  // handle create poll
  const handleCreatePoll = () => {
    setIsOpen(true);
  };

  // submit poll
  const submitPoll = () => {
    createPollMutation.mutate(
      {
        community_id: communityId,
        poll_title: title,
        description,
        poll_options: options.filter((opt) => opt.trim() !== ""),
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setTitle("");
          setDescription("");
          setOptions(["", ""]);
          toast.success("Poll created successfully!");
        },
        onError: (err) => {
          console.error("Poll creation error:", err);
          toast.error("Failed to create poll. Please try again.");
        },
      }
    );
  };

  return (
    <>
      <ToolTipWrapper
        disabled={disabled}
        tooltipTitle={"Join the community to create a poll"}
        variant="clickable"
      >
        <div className="flex bg-primary-tint rounded-full px-2  mb-2 text-primary-shade items-center justify-center gap-x-2">
          <Plus className="w-5 h-5" />
          <Button
            onClick={handleCreatePoll}
            className="text-primary-shade"
            disabled={disabled}
            variant="simple"
          >
            Create Poll
          </Button>
        </div>
      </ToolTipWrapper>

      <NeutralDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Create a Poll"
        description="Create a poll for your community"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Poll Title</label>
            <input
              className="w-full border rounded p-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Poll Description
            </label>
            <Textarea
              className="w-full border rounded p-2 text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <Button
                    variant="icon"
                    onClick={() => removeOption(index)}
                    className=" w-fit"
                  >
                    <Image
                      src="/icons/delete.svg"
                      alt="remove"
                      width={100}
                      height={100}
                      className="w-8 h-8"
                    />
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={addOption}
              className="text-secondary-shade text-sm"
            >
              + Add Option
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={submitPoll}
              disabled={createPollMutation.isPending}
              className="btn-primary"
            >
              {createPollMutation.isPending ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </div>
      </NeutralDialog>
    </>
  );
};

export default PollCreateButton;
