"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { NeutralDialog } from "@/components/neutral_dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InitiatorFormData } from "../types/initiation_types";

interface InitiatorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InitiatorFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function InitiatorFormModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: InitiatorFormModalProps) {
  const [form, setForm] = useState<InitiatorFormData>({
    why_initiating: "",
    relationship_context: "",
  });

  const valid =
    form.why_initiating.trim().length >= 20 &&
    form.relationship_context.trim().length >= 5;

  async function handleSubmit() {
    if (!valid || isSubmitting) return;
    await onSubmit(form);
    setForm({ why_initiating: "", relationship_context: "" });
  }

  return (
    <NeutralDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Invite someone"
      className="max-w-md"
    >
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          The community will read this before voting. Be specific — a
          thoughtful reason goes further than a vague one.
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="why_initiating">
            Why are you initiating this person?
          </Label>
          <Textarea
            id="why_initiating"
            placeholder="e.g. She's been building a fintech product for 6 months and needs the focused environment. I've seen her work — it's real."
            rows={4}
            value={form.why_initiating}
            onChange={(e) =>
              setForm((f) => ({ ...f, why_initiating: e.target.value }))
            }
          />
          <p className="text-xs text-muted-foreground text-right">
            {form.why_initiating.trim().length} / 20 min
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="relationship_context">
            How do you know them?
          </Label>
          <Textarea
            id="relationship_context"
            placeholder="e.g. We've been coworking at the same café for three months. I trust her energy."
            rows={3}
            value={form.relationship_context}
            onChange={(e) =>
              setForm((f) => ({ ...f, relationship_context: e.target.value }))
            }
          />
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!valid || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating QR…
            </>
          ) : (
            <>
              Generate invite QR
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </NeutralDialog>
  );
}
