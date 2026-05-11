"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import type { EntityProfileFormData } from "../entity_profile_setup_types";

interface OwnerSectionProps {
  form: UseFormReturn<EntityProfileFormData>;
  editMode: boolean;
  entity: {
    owner_name?: string | null;
    owner_phone_number?: string | null;
  };
}

const OwnerSection = React.memo<OwnerSectionProps>(
  ({ form, editMode, entity }) => {
    return (
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Owner Information</h3>
        <p className="text-sm text-muted-foreground">
          Contact details for the primary owner or manager of the entity. This
          information is used for administrative purposes.
        </p>

        <div className="space-y-2">
          <Label htmlFor="owner_name" className="text-sm font-medium">
            Owner / Manager Name
          </Label>
          <p className="text-xs text-muted-foreground">
            The full name of the primary owner or manager responsible for this
            entity.
          </p>
          {editMode ? (
            <FormField
              control={form.control}
              name="owner_name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="owner_name"
                  placeholder="Example: John Smith or Maria Garcia"
                />
              )}
            />
          ) : (
            <p className="text-sm">
              {entity.owner_name || "No owner name provided"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner_phone_number" className="text-sm font-medium">
            Owner / Manager Phone Number
          </Label>
          <p className="text-xs text-muted-foreground">
            Direct contact number for the owner or manager. This may be used for
            urgent matters or verification.
          </p>
          {editMode ? (
            <FormField
              control={form.control}
              name="owner_phone_number"
              render={({ field }) => (
                <PhoneInput
                  value={field.value || ""}
                  onChange={field.onChange}
                  defaultCountry="lb"
                />
              )}
            />
          ) : (
            <p className="text-sm">
              {entity.owner_phone_number || "No owner phone number provided"}
            </p>
          )}
        </div>
      </div>
    );
  }
);

OwnerSection.displayName = "OwnerSection";

export default OwnerSection;
