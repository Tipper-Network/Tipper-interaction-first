"use client";

import { useUserValues } from "../hooks/users_hooks";
import { Heart, Plus } from "lucide-react";

export const UserValuesList = () => {
  const { data: values, isLoading, error } = useUserValues();
  if (isLoading)
    return (
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-24"></div>
          <div className="space-y-2">
            <div key="skeleton-1" className="h-12 bg-muted rounded"></div>
            <div key="skeleton-2" className="h-12 bg-muted rounded"></div>
            <div key="skeleton-3" className="h-12 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <p className="p-medium-16 text-destructive">Error loading values</p>
      </div>
    );

  return (
    <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
      {/* Header with Values */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <h3 className="h3-bold text-foreground">Values</h3>
        {values.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {values.map((value: any) => (
              <div
                key={value.id}
                className="flex items-center justify-between p-1 h-8 bg-primary-tint hover:cursor-pointer border border-border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-baseline">
                  <span className="p-medium-14 text-foreground">
                    {value.value.value_name}
                  </span>
                </div>
                {/* <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all">
                  <span className="text-muted-foreground text-sm">×</span>
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {values.length === 0 && (
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="p-medium-16 text-muted-foreground mb-2">
            No values added yet
          </p>
          <p className="p-regular-14 text-muted-foreground mb-4">
            Add your core values to help others understand what matters to you
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors p-medium-14">
            Add Your First Value
          </button>
        </div>
      )}
    </div>
  );
};
