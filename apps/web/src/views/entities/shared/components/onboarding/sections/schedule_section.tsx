"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import WeeklyScheduleInput from "../entity_schedule_input";
import { Schedule } from "../entity_schedule_input";
import type { EntityProfileFormData } from "../entity_profile_setup_types";

interface ScheduleSectionProps {
  form: UseFormReturn<EntityProfileFormData>;
  editMode: boolean;
  entity: {
    schedule?: Schedule | Record<string, string[]> | null;
  };
}

const ScheduleSection = React.memo<ScheduleSectionProps>(
  ({ form, editMode, entity }) => {
    return (
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Operating Hours</h3>
        <p className="text-sm text-muted-foreground">
          Set your weekly schedule and general operating hours. This helps
          customers know when you&apos;re open and available.
        </p>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Weekly Schedule</Label>
          <p className="text-xs text-muted-foreground">
            Define your operating hours for each day of the week. You can set
            multiple time ranges per day (e.g., 9:00 AM - 12:00 PM and 2:00 PM -
            6:00 PM).
          </p>
          {editMode ? (
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => {
                const scheduleValue = field.value ||
                  entity?.schedule || {
                    mon: [],
                    tue: [],
                    wed: [],
                    thu: [],
                    fri: [],
                    sat: [],
                    sun: [],
                  };
                return (
                  <WeeklyScheduleInput
                    value={scheduleValue}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">
              {entity.schedule && typeof entity.schedule === "object"
                ? Object.entries(entity.schedule as Schedule)
                    .map(([day, ranges]) => {
                      const dayRanges = Array.isArray(ranges) ? ranges : [];
                      return `${day.toUpperCase()}: ${
                        dayRanges && dayRanges.length > 0
                          ? dayRanges.join(", ")
                          : "Closed"
                      }`;
                    })
                    .join(" | ")
                : "No schedule set"}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ScheduleSection.displayName = "ScheduleSection";

export default ScheduleSection;
