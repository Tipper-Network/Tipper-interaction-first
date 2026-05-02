"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useAdminSuggestedTags,
  useAdminUpdateTagStatus,
} from "@/features/tags/hooks/tags_hooks";
import { TagStatus__Enum } from "@/lib/shared/enums/tags_enums";
import { useState } from "react";

export default function AdminTagsPage() {
  const { data, isLoading, isError, error } = useAdminSuggestedTags();
  const update = useAdminUpdateTagStatus();
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading suggested tags…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-destructive">
        Failed to load suggested tags:{" "}
        {(error as any)?.message ?? String(error)}
      </div>
    );
  }

  const tags = Array.isArray(data) ? data : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tag suggestions</h1>
        <p className="text-muted-foreground">
          Review user-suggested tags. Approving makes them ACTIVE and
          selectable.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending review</CardTitle>
          <CardDescription>
            {tags.length} suggestion{tags.length === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tags.length === 0 ? (
            <div className="text-sm text-muted-foreground">No suggestions.</div>
          ) : null}

          {tags.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-xl border p-3"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{t.label}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {t.slug}
                </div>
                <div className="mt-1 flex gap-2">
                  <Badge variant="secondary">{t.type}</Badge>
                  <Badge variant="outline">{t.status}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="bg-tertiary hover:bg-tertiary-shade hover:text-white"
                  disabled={update.isPending || processingId === t.id}
                  onClick={async () => {
                    setProcessingId(t.id);
                    try {
                      await update.mutateAsync({
                        tagId: t.id,
                        status: TagStatus__Enum.ACTIVE,
                      });
                    } finally {
                      setProcessingId(null);
                    }
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  disabled={update.isPending || processingId === t.id}
                  onClick={async () => {
                    setProcessingId(t.id);
                    try {
                      await update.mutateAsync({
                        tagId: t.id,
                        status: TagStatus__Enum.REJECTED,
                      });
                    } finally {
                      setProcessingId(null);
                    }
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
