import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/utils";
import { updateEntityTags } from "@/features/entities/shared/api/update_entitiy_api";
import { TagStatus__Enum, TagType__Enum } from "@/lib/shared/enums/tags_enums";
import { useSuggestTag, useTags } from "@/features/tags/hooks/tags_hooks";
import { X } from "lucide-react";
import { ProfilePills } from "@/features/entities/shared/components/profile_components/profile_pills";
import SuggestTag from "./suggest_tag";
import { Input } from "@/components/ui/input";
import { NeutralDialog } from "@/components/neutral_dialog";

type EditingProfileTagsProps = {
  entityId: string;
  tags: string[]; // labels for display
  selectedTagIds: string[]; // ids for editing
  isOwnEntity: boolean;
  onUpdated?: () => Promise<any> | void;
  className?: string;
};

const TAG_TYPES: { value: TagType__Enum | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: TagType__Enum.AMENITY, label: "Amenity" },
  { value: TagType__Enum.FEATURE, label: "Feature" },
  { value: TagType__Enum.PRODUCT, label: "Product" },
  { value: TagType__Enum.FOOD, label: "Food" },
  { value: TagType__Enum.SERVICE, label: "Service" },
  { value: TagType__Enum.EXPERIENCE, label: "Experience" },
  { value: TagType__Enum.GENRE, label: "Genre" },
  { value: TagType__Enum.OTHER, label: "Other" },
];

const EditingProfileTags = ({
  entityId,
  tags,
  selectedTagIds,
  isOwnEntity,
  onUpdated,
  className,
}: EditingProfileTagsProps) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TagType__Enum | "ALL">(
    "ALL"
  );
  const [draftSelected, setDraftSelected] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const { data: allTags, isLoading } = useTags({
    status: TagStatus__Enum.ACTIVE,
  });

  useEffect(() => {
    if (!open) return;
    setDraftSelected(selectedTagIds ?? []);
    setSelectedType("ALL");
  }, [open, selectedTagIds]);

  const selectedSet = useMemo(() => new Set(draftSelected), [draftSelected]);

  // const filteredTags = useMemo(() => {
  //   const list = Array.isArray(allTags) ? allTags : [];
  //   if (selectedType === "ALL") return list;
  //   return list.filter((t) => t.type === selectedType);
  // }, [allTags, selectedType]);
  const filteredTags = useMemo(() => {
    const list = Array.isArray(allTags) ? allTags : [];
    const q = searchInput.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => {
      const label = String(t.label ?? "").toLowerCase();
      const slug = String((t as any)?.slug ?? "").toLowerCase();
      return label.includes(q) || slug.includes(q);
    });
  }, [allTags, searchInput]);

  const saveMutation = useMutation({
    mutationFn: async (tagIds: string[]) => {
      return await updateEntityTags(entityId, {
        tags: tagIds.map((id) => ({ tag_id: id })),
      });
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["entity", entityId] }),
        qc.invalidateQueries({ queryKey: ["tags"] }),
      ]);
      await onUpdated?.();
      toast.success("Tags updated");
      setOpen(false);
    },
    onError: (e: any) => {
      toast.error("Failed to update tags", {
        description: e?.message ?? String(e),
      });
    },
  });

  const suggestMutation = useSuggestTag();

  useEffect(() => {
    if (!open) return;
    setDraftSelected(selectedTagIds ?? []);
    setSearchInput("");
  }, [open, selectedTagIds]);

  const toggle = (id: string) => {
    setDraftSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      <ProfilePills
        title="Tags"
        pills={tags}
        className=" text-primary"
        pillClassName=" bg-primary-tint text-white"
      />

      {isOwnEntity ? (
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(true)}>
            Edit tags
          </Button>
        </div>
      ) : null}
      <NeutralDialog
        title="Edit tags"
        description="Select tags that describe this entity. Can't find one? Suggest a
              new tag for admin approval."
        open={open}
        onOpenChange={setOpen}
      >
        <div className="px-4 pb-3">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tags…"
          />
        </div>
        {/* Type filter section */}
        <div className="space-y-3 pb-4">
          <label className="text-sm font-semibold text-foreground">Type</label>
          <div className="flex flex-wrap gap-2">
            {TAG_TYPES.map((type) => {
              const isSelected = selectedType === type.value;
              return (
                <Button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={cn(
                    "rounded-full h-8 px-4 text-sm",
                    isSelected
                      ? "bg-primary text-white hover:bg-primary-shade"
                      : "bg-white border border-primary text-primary hover:bg-primary-tint/20"
                  )}
                >
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tags grid */}
        <div className="flex-1 overflow-auto min-h-[300px] max-h-[400px] border rounded-lg p-4">
          {isLoading ? (
            <div className="py-6 text-sm text-muted-foreground text-center">
              Loading tags…
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground text-center space-y-2">
              <div>Couldn&apos;t find your tag?</div>
              <SuggestTag
                tagTypes={
                  TAG_TYPES.filter((t) => t.value !== "ALL") as {
                    value: TagType__Enum;
                    label: string;
                  }[]
                }
              />
            </div>
          ) : (
            <div className="flex  flex-wrap gap-2">
              {filteredTags.map((t) => {
                const selected = selectedSet.has(t.id);
                return (
                  <Button
                    key={t.id}
                    type="button"
                    onClick={() => toggle(t.id)}
                    className={cn(
                      "rounded-full h-8 text-sm",
                      selected
                        ? "bg-primary text-white hover:bg-primary-shade"
                        : "bg-white border border-gray-300 text-foreground hover:bg-gray-50"
                    )}
                  >
                    {t.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={saveMutation.isPending}
          className="rounded-full bg-white border border-gray-300 text-foreground hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => saveMutation.mutate(draftSelected)}
          disabled={saveMutation.isPending}
          className="rounded-full bg-primary text-white hover:bg-primary-shade"
        >
          {saveMutation.isPending ? "Saving…" : "Save"}
        </Button>
      </NeutralDialog>
    </div>
  );
};

export default EditingProfileTags;
