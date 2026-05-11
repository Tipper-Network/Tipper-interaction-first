"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import type { EntityProfileFormData } from "../entity_profile_setup_types";
import { normalizeInstagramHandle } from "@/lib/utils/utils";

interface ContactSectionProps {
  form: UseFormReturn<EntityProfileFormData>;
  editMode: boolean;
  entity: {
    email?: string | null;
    phone?: string | null;
    instagram_url?: string | null;
  };
}

const ContactSection = React.memo<ContactSectionProps>(
  ({ form, editMode, entity }) => {
    return (
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <p className="text-sm text-muted-foreground">
          Provide your contact details so customers can reach you. This
          information will be displayed on your public profile.
        </p>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <p className="text-xs text-muted-foreground">
            The primary email address for inquiries and customer communications.
          </p>
          {editMode ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="Example: contact@yourbusiness.com or info@restaurant.com"
                />
              )}
            />
          ) : (
            <p className="text-sm">{entity.email || "No email provided"}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram_url" className="text-sm font-medium">
            Business Instagram Handle
          </Label>
          <p className="text-xs text-muted-foreground">
            The Instagram handle of your business. You can enter it with or
            without the @ symbol.
          </p>
          {editMode ? (
            <FormField
              control={form.control}
              name="instagram_url"
              render={({ field }) => (
                <Input
                  {...field}
                  id="instagram_url"
                  type="text"
                  placeholder="Example: @yourbusiness or yourbusiness"
                  onBlur={(e) => {
                    // Normalize the handle on blur - remove @, URLs, etc., then add @ back
                    const normalized = normalizeInstagramHandle(e.target.value);
                    const formattedValue = normalized ? `@${normalized}` : "";
                    // Only update if the formatted value is different from current
                    if (formattedValue !== field.value) {
                      field.onChange(formattedValue);
                    }
                    field.onBlur();
                  }}
                />
              )}
            />
          ) : (
            <p className="text-sm">
              {entity.instagram_url
                ? `${normalizeInstagramHandle(entity.instagram_url)}`
                : "No Instagram handle provided"}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Business Phone Number
          </Label>
          <p className="text-xs text-muted-foreground">
            The main phone number customers can use to contact your business
            directly.
          </p>
          {editMode ? (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <PhoneInput
                  value={field.value || ""}
                  onChange={field.onChange}
                  defaultCountry="lb"
                />
              )}
            />
          ) : (
            <p className="text-sm">{entity.phone || "No phone provided"}</p>
          )}
        </div>
      </div>
    );
  }
);

ContactSection.displayName = "ContactSection";

export default ContactSection;
