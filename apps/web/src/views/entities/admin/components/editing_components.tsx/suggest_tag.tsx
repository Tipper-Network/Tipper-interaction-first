import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TagType__Enum } from "@/lib/shared/enums/tags_enums";
import { useSuggestTag } from "@/features/tags/hooks/tags_hooks";
import { toast } from "sonner";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";

const SuggestTag = ({
  tagTypes,
}: {
  tagTypes: { value: TagType__Enum; label: string }[];
}) => {
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLabel, setSuggestLabel] = useState("");
  const [suggestType, setSuggestType] = useState<TagType__Enum | undefined>();
  const suggestMutation = useSuggestTag();

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="mt-2"
        onClick={() => setSuggestOpen(true)}
      >
        Suggest tag
      </Button>
      <Dialog
        open={suggestOpen}
        onOpenChange={(next) => {
          setSuggestOpen(next);
          if (!next) {
            setSuggestLabel("");
            setSuggestType(undefined);
          }
        }}
      >
        <DialogContent className="sm:max-w-[420px] p-6 [&>button]:hidden">
          {/* Custom red X close button in top right */}
          <DialogClose className="absolute right-4 top-4 rounded-full bg-red-500 text-white p-1.5 hover:bg-red-600 transition-colors z-10">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-primary text-xl font-semibold">
              Suggest a tag
            </DialogTitle>
            <p className="text-sm text-foreground">
              Your suggestion will be reviewed by admins before it can be used.
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Label</label>
              <Input
                value={suggestLabel}
                onChange={(e) => setSuggestLabel(e.target.value)}
                placeholder="e.g. Gluten-Free Options"
                className="rounded-full border border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">
                Type (optional)
              </label>
              <Select
                value={suggestType}
                onValueChange={(v) => setSuggestType(v as TagType__Enum)}
              >
                <SelectTrigger className="rounded-full border border-gray-300">
                  <SelectValue placeholder="Choose a type" />
                </SelectTrigger>
                <SelectContent>
                  {tagTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSuggestOpen(false)}
              disabled={suggestMutation.isPending}
              className="rounded-lg bg-white border border-gray-300 text-foreground hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={
                suggestMutation.isPending || suggestLabel.trim().length < 2
              }
              onClick={async () => {
                try {
                  await suggestMutation.mutateAsync({
                    label: suggestLabel,
                    type: suggestType,
                  });
                  toast.success("Tag suggested for review");
                  setSuggestOpen(false);
                } catch (e: any) {
                  toast.error("Failed to suggest tag", {
                    description: e?.message ?? String(e),
                  });
                }
              }}
              className="rounded-lg bg-pink-200 hover:bg-pink-300 text-white"
            >
              {suggestMutation.isPending ? "Submitting…" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuggestTag;
