"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import LocationMapPicker from "@/components/LocationMapPicker";
import type { EntityProfileFormData } from "../entity_profile_setup_types";

interface LocationSectionProps {
  form: UseFormReturn<EntityProfileFormData>;
  editMode: boolean;
  entity: {
    address?: {
      street?: string | null;
      neighborhood?: string | null;
      city?: string | null;
      country?: string | null;
    } | null;
    operates_online?: boolean | null;
    latitude?: number | null;
    longitude?: number | null;
  };
}

// Separate component for location map to optimize re-renders
const LocationMapSection = React.memo<{
  form: UseFormReturn<EntityProfileFormData>;
}>(({ form }) => {
  // Only watch operates_online field - more performant than watching entire form
  const operatesOnline = useWatch({
    control: form.control,
    name: "operates_online",
    defaultValue: false,
  });

  if (operatesOnline) return null;

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Business Location on Map
        </Label>
        <p className="text-sm text-muted-foreground">
          Pin your exact location on the map. This helps customers find you
          using GPS navigation and enables location-based search features. Click
          on the map to set your coordinates.
        </p>
        <FormField
          control={form.control}
          name="latitude"
          render={({ field: latField }) => (
            <FormField
              control={form.control}
              name="longitude"
              render={({ field: lngField }) => (
                <>
                  <LocationMapPicker
                    initialLocation={
                      latField.value && lngField.value
                        ? {
                            latitude: latField.value,
                            longitude: lngField.value,
                          }
                        : undefined
                    }
                    onLocationSelect={(location) => {
                      const { latitude, longitude } = location.coordinates;
                      latField.onChange(latitude);
                      lngField.onChange(longitude);
                    }}
                  />
                  <div className="text-sm text-muted-foreground">
                    Current coordinates: Latitude: {latField.value || "Not set"}
                    , Longitude: {lngField.value || "Not set"}
                  </div>
                </>
              )}
            />
          )}
        />
      </div>
    </div>
  );
});

LocationMapSection.displayName = "LocationMapSection";

const LocationSection = React.memo<LocationSectionProps>(
  ({ form, editMode, entity }) => {
    return (
      <div>
        {/* Location Information Section */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Location Information</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your physical location details. This helps customers find
                you and enables location-based features.
              </p>
            </div>

            {!editMode && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Business Type:
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {entity.operates_online ? "Online" : "Offline"}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="street" className="text-sm font-medium">
              Street Address
            </Label>
            <p className="text-xs text-muted-foreground">
              The street address where your business is located, including
              building number and street name.
            </p>
            {editMode ? (
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="street"
                    placeholder="Example: 123 Main Street or 456 Oak Avenue, Suite 200"
                  />
                )}
              />
            ) : (
              <p className="text-sm">
                {entity.address?.street || "No street address provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="text-sm font-medium">
              Neighborhood / District
            </Label>
            <p className="text-xs text-muted-foreground">
              The neighborhood, district, or area name where your business is
              located.
            </p>
            {editMode ? (
              <FormField
                control={form.control}
                name="address.neighborhood"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="neighborhood"
                    placeholder="Example: Downtown, SoHo, Shoreditch, or Central Business District"
                  />
                )}
              />
            ) : (
              <p className="text-sm">
                {entity.address?.neighborhood || "No neighborhood provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              City
            </Label>
            <p className="text-xs text-muted-foreground">
              The city where your business is located.
            </p>
            {editMode ? (
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="city"
                    placeholder="Example: New York, London, Toronto, or Sydney"
                  />
                )}
              />
            ) : (
              <p className="text-sm">
                {entity.address?.city || "No city provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium">
              Country
            </Label>
            <p className="text-xs text-muted-foreground">
              The country where your business operates.
            </p>
            {editMode ? (
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="country"
                    placeholder="Example: United States, United Kingdom, Canada, or Australia"
                  />
                )}
              />
            ) : (
              <p className="text-sm">
                {entity.address?.country || "No country provided"}
              </p>
            )}
          </div>
        </div>

        <div>
          {/* Online/Offline Business Toggle */}
          {editMode && (
            <FormField
              control={form.control}
              name="operates_online"
              render={({ field }) => (
                <div className="flex items-center justify-end gap-2 p-4">
                  <p className="text-xs text-muted-foreground text-right">
                    {field.value
                      ? "Online business - no location needed"
                      : "Physical location required"}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${
                        !field.value
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      Offline
                    </span>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue("latitude", undefined, {
                            shouldDirty: true,
                          });
                          form.setValue("longitude", undefined, {
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                    <span
                      className={`text-sm font-medium ${
                        field.value ? "text-foreground" : "text-destructive"
                      }`}
                    >
                      Online
                    </span>
                  </div>
                </div>
              )}
            />
          )}
        </div>

        {/* Location Coordinates Section */}
        {editMode && <LocationMapSection form={form} />}
      </div>
    );
  }
);

LocationSection.displayName = "LocationSection";

export default LocationSection;
