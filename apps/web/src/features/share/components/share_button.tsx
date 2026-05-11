"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useInviteToken } from "../hooks/use_invite_token";
import ShareModal from "./share_modal";

interface ShareButtonProps {
  /**
   * Base URL **path** that will be shared (e.g. `/community/my-slug` or
   * `/entities/abc123/business/profile`).
   * The invite token is appended as `?shareToken=<token>`.
   */
  destination: string;
  /**
   * Optional title shown inside the share modal.
   * Defaults to "Share".
   */
  modalTitle?: string;
  /**
   * Whether the current user is allowed to share.
   * When false (or the user is unauthenticated) the button is hidden.
   * Defaults to `true`.
   */
  canShare?: boolean;
  /** Button label. Defaults to "Share". */
  label?: string;
}

/**
 * Generic share button — works for communities, entity profiles,
 * events, activities, etc.
 *
 * On click it fetches (or creates) the caller's invite token and
 * builds a fully-qualified share URL, then opens the ShareModal.
 */
export default function ShareButton({
  destination,
  modalTitle = "Share The Community",
  canShare = true,
  label = "Share Community ",
}: ShareButtonProps) {
  const { user } = useAuthStore();
  const { getOrCreateToken, isCreating } = useInviteToken();
  const [modalOpen, setModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Hide when unauthenticated or caller says the user can't share
  if (!user || !canShare) return null;

  const handleClick = async () => {
    setFetchError(null);
    try {
      const token = await getOrCreateToken();
      const base = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const path = destination.startsWith("/")
        ? destination
        : `/${destination}`;
      setShareUrl(`${base}${path}?shareToken=${token.token}`);
      setModalOpen(true);
    } catch {
      setFetchError("Could not generate share link. Please try again.");
    }
  };

  return (
    <>
      <Button
        onClick={() => void handleClick()}
        disabled={isCreating}
        aria-label="Share Community"
        className="bg-primary text-white hover:bg-primary/90 rounded-full py-0 my-0 mb-2"
      >
        <Share2 className="h-4 w-4 mr-2" />
        {isCreating ? "Generating..." : label}
      </Button>

      {fetchError && (
        <p className="text-xs text-destructive mt-1">{fetchError}</p>
      )}

      {shareUrl && (
        <ShareModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          shareUrl={shareUrl}
          title={modalTitle}
        />
      )}
    </>
  );
}
