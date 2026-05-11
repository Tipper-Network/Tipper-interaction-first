"use client";

import { Button } from "@/components/ui/button";
import { NeutralDialog } from "@/components/neutral_dialog";
import VibesStep from "./vibes_step";

interface ExistingVibe {
  id: string;
  vibe_name: string;
  vibe_category?: string;
}

interface VibesModalProps {
  open: boolean;
  onClose: () => void;
  communityId: string;
  existingVibes?: ExistingVibe[];
  onVibesAdded?: () => void;
}

export default function VibesModal({
  open,
  onClose,
  communityId,
  existingVibes = [],
  onVibesAdded,
}: VibesModalProps) {
  if (!open) return null;

  return (
    <div className="">
      <div className="w-full relative">
        <NeutralDialog open={open} onOpenChange={onClose}>
          <VibesStep
            onComplete={() => {
              onClose();
              onVibesAdded?.();
            }}
            communityId={communityId}
            existingVibes={existingVibes}
          />
          <Button
            variant="link"
            className="absolute top-2 right-2 text-primary hover:text-primary-shade"
            onClick={onClose}
          >
            No Thanks
          </Button>
        </NeutralDialog>
      </div>
    </div>
  );
}
