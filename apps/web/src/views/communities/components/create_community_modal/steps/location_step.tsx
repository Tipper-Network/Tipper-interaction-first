"use client";

import {
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MapPin } from "lucide-react";
import LocationMapPicker from "@/components/LocationMapPicker";
import { useFormContext } from "react-hook-form";

export default function CommunityStepLocation() {
  const form = useFormContext();
  const { setValue, watch, control } = form;

  const operatesOnline = watch("operates_online");
  const coordinates = watch("coordinates");

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City *</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Enter your city"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="neighborhood"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Neighborhood (optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Enter your neighborhood or district"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street (optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Enter your street"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 mt-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-semibold">Select Location on Map</h3>
        </div>

        {!operatesOnline && (
          <LocationMapPicker
            onLocationSelect={(locationData) =>
              setValue("coordinates", {
                latitude: locationData.coordinates.latitude,
                longitude: locationData.coordinates.longitude,
                accuracy: locationData.accuracy,
                altitude: locationData.altitude,
                altitudeAccuracy: locationData.altitudeAccuracy,
                timestamp: locationData.timestamp,
              })
            }
          />
        )}

        {!operatesOnline && coordinates?.latitude !== 0 && (
          <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-sm font-medium text-secondary">
              📍 Location Selected: {coordinates.latitude.toFixed(6)},{" "}
              {coordinates.longitude.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
