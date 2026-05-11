"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Schedule {
  [day: string]: string[];
}

interface WeeklyScheduleInputProps {
  value?: Schedule;
  onChange?: (value: Schedule) => void;
}

const defaultSchedule: Schedule = {
  mon: [],
  tue: [],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
  sun: [],
};

const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function WeeklyScheduleInput({
  value,
  onChange,
}: WeeklyScheduleInputProps) {
  // Ensure all days have arrays, even if value is partial or has undefined values
  const normalizedValue = value
    ? {
        ...defaultSchedule,
        ...Object.fromEntries(
          Object.entries(value).map(([day, ranges]) => [
            day,
            Array.isArray(ranges) ? ranges : [],
          ])
        ),
      }
    : defaultSchedule;

  const [schedule, setSchedule] = useState<Schedule>(normalizedValue);

  // Sync schedule when value prop changes
  useEffect(() => {
    if (value) {
      const normalized = {
        ...defaultSchedule,
        ...Object.fromEntries(
          Object.entries(value).map(([day, ranges]) => [
            day,
            Array.isArray(ranges) ? ranges : [],
          ])
        ),
      };
      setSchedule(normalized);
    }
  }, [value]);

  const updateRange = (
    day: string,
    index: number,
    start: string,
    end: string
  ) => {
    const newSchedule = { ...schedule };
    // Ensure day has an array before accessing
    if (!Array.isArray(newSchedule[day])) {
      newSchedule[day] = [];
    }
    newSchedule[day][index] = `${start}-${end}`;
    setSchedule(newSchedule);
    onChange?.(newSchedule);
  };

  const addRange = (day: string) => {
    const newSchedule = { ...schedule };
    // Ensure day has an array before pushing
    if (!Array.isArray(newSchedule[day])) {
      newSchedule[day] = [];
    }
    newSchedule[day].push("09:00-17:00");
    setSchedule(newSchedule);
    onChange?.(newSchedule);
  };

  const removeRange = (day: string, index: number) => {
    const newSchedule = { ...schedule };
    // Ensure day has an array before splicing
    if (!Array.isArray(newSchedule[day])) {
      newSchedule[day] = [];
    } else {
      newSchedule[day].splice(index, 1);
    }
    setSchedule(newSchedule);
    onChange?.(newSchedule);
  };

  const toggleClosed = (day: string) => {
    const newSchedule = { ...schedule };
    const currentRanges = Array.isArray(newSchedule[day])
      ? newSchedule[day]
      : [];
    if (currentRanges.length === 0) {
      newSchedule[day] = ["09:00-17:00"];
    } else {
      newSchedule[day] = [];
    }
    setSchedule(newSchedule);
    onChange?.(newSchedule);
  };

  return (
    <div className="space-y-3">
      {daysOfWeek.map((day) => {
        // Ensure ranges is always an array
        const ranges = Array.isArray(schedule[day]) ? schedule[day] : [];
        return (
          <div key={day} className="flex flex-col gap-2 border-b pb-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{day.toUpperCase()}</span>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={ranges.length === 0}
                  onChange={() => toggleClosed(day)}
                />
                Closed
              </label>
            </div>

            {ranges.map((range, idx) => {
              const [start, end] = range.split("-");
              return (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    type="time"
                    value={start}
                    onChange={(e) => updateRange(day, idx, e.target.value, end)}
                    className="w-auto"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="time"
                    value={end}
                    onChange={(e) =>
                      updateRange(day, idx, start, e.target.value)
                    }
                    className="w-auto"
                  />
                  <Button
                    onClick={() => removeRange(day, idx)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    X
                  </Button>
                </div>
              );
            })}

            {ranges.length > 0 && (
              <Button
                onClick={() => addRange(day)}
                variant="outline"
                size="sm"
                className="text-sm text-secondary mt-1"
              >
                + Add Range
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
