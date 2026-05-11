"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ShareModal from "@/features/share/components/share_modal";
import InitiatorFormModal from "./initiator_form_modal";
import { createInitiatorInvite } from "../api/initiation_api";
import type { InitiatorFormData } from "../types/initiation_types";

interface InitiationButtonProps {
  community_id: string;
  /** Called after a QR is successfully generated so the panel can refetch */
  onInviteCreated?: () => void;
}

type Step = "idle" | "form" | "qr";

export default function InitiationButton({
  community_id,
  onInviteCreated,
}: InitiationButtonProps) {
  const [step, setStep] = useState<Step>("idle");
  const [inviteUrl, setInviteUrl] = useState("");

  const { mutateAsync: createInvite, isPending } = useMutation({
    mutationFn: (form: InitiatorFormData) =>
      createInitiatorInvite(community_id, form),
    onSuccess: ({ invite_url }) => {
      setInviteUrl(invite_url);
      setStep("qr");
      onInviteCreated?.();
    },
    onError: () => {
      toast.error("Couldn't generate the invite. Try again.");
      setStep("idle");
    },
  });

  return (
    <>
      {/* ── Trigger button ── */}
      <Button
        onClick={() => setStep("form")}
        className="gap-2"
        variant="default"
      >
        <UserPlus className="h-4 w-4" />
        Invite someone
      </Button>

      {/* ── Step 1: Who/Why form ── */}
      <InitiatorFormModal
        open={step === "form"}
        onOpenChange={(open) => {
          if (!open) setStep("idle");
        }}
        onSubmit={async (data) => {
          await createInvite(data);
        }}
        isSubmitting={isPending}
      />

      {/* ── Step 2: QR code (reuses existing ShareModal) ── */}
      <ShareModal
        open={step === "qr"}
        onOpenChange={(open) => {
          if (!open) setStep("idle");
        }}
        shareUrl={inviteUrl}
        title="Your invite QR"
      />
    </>
  );
}
