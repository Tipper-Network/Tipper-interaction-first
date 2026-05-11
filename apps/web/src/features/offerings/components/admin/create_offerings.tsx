import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  OfferingStatus__Enum,
  OfferingFormat__Enum,
  OfferingType__Enum,
} from "@/lib/shared/enums/offering_enums";
import React from "react";
import { useCreateOffering } from "../../hooks/offerings_hooks";
import { CreateOfferingInput } from "../../api/types";
import { toast } from "sonner";

const OFFERING_TYPES = Object.values(
  OfferingType__Enum
) as OfferingType__Enum[];

const CreateOfferings = ({ entityId }: { entityId: string }) => {
  const [newLabel, setNewLabel] = React.useState("");
  const [newType, setNewType] = React.useState<OfferingType__Enum>(
    OfferingType__Enum.MENU
  );

  const createMut = useCreateOffering(entityId);

  const canCreate = newLabel.trim().length > 0 && !createMut.isPending;
  const onCreate = async () => {
    const payload: CreateOfferingInput = {
      offeringType: newType,
      label: newLabel.trim(),
      format: OfferingFormat__Enum.PDF,
      status: OfferingStatus__Enum.DRAFT,
      isPublic: false,
      isSearchable: true,
    };
    try {
      await createMut.mutateAsync(payload);
      toast.success("Offering created");
      setNewLabel("");
      setNewType(OfferingType__Enum.MENU);
    } catch (e: any) {
      toast.error("Failed to create offering", {
        description: e?.message ?? String(e),
      });
    }
  };
  return (
    <>
      <div className="text-xs text-muted-foreground">
        Create offerings and attach media (PDF/images). Toggle visibility in the
        panel above.
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {OFFERING_TYPES.map((t) => (
          <Button
            key={t}
            type="button"
            variant={t === newType ? "secondary" : "outline"}
            className="h-8 rounded-full px-3 text-xs"
            onClick={() => setNewType(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="New offering label (e.g. Menu, Services, Catalog)"
        />
        <Button
          type="button"
          className="rounded-full"
          disabled={!canCreate}
          onClick={onCreate}
        >
          {createMut.isPending ? "Creating..." : "Add"}
        </Button>
      </div>
    </>
  );
};

export default CreateOfferings;
