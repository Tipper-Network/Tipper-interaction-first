"use client";
import { NeutralDialog } from "@/components/neutral_dialog";
import { Button } from "@/components/ui/button";
import { useNavigationGuard } from "next-navigation-guard";
import React, { useState } from "react";

const NavGuardModal = ({
  handleConfirmChanges,
  handleDiscardChanges,
  // dataToBeHandled
  enabled,
  confirmationMessage,
}: {
  handleConfirmChanges: () => void | Promise<void>;
  handleDiscardChanges: () => void;
  // dataToBeHandled: any
  enabled: boolean;
  confirmationMessage?: string;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navGuard = useNavigationGuard({
    enabled,
    // confirm: () => {
    //   // Check if the URL only changed in hash
    //   const currentPath = window.location.pathname + window.location.search;
    //   const newPath = window.location.href.split('#')[0];
    //   if (currentPath === newPath) {
    //     return true; // Allow hash changes
    //   }
    //   return window.confirm(confirmationMessage || "Are you sure you want to leave?");
    // }
  });

  const confirmSaving = async () => {
    setError(null);
    try {
      setIsSaving(true);
      await handleConfirmChanges();
      navGuard.accept();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes");
      // keep modal open; do not accept navigation
    } finally {
      setIsSaving(false);
    }
  };
  const discardSaving = () => {
    handleDiscardChanges();
    navGuard.accept();
  };

  return (
    <>
      <NeutralDialog
        open={navGuard.active}
        onOpenChange={(open) => {
          // closing the modal means "do not navigate"
          if (!open) navGuard.reject();
        }}
        title="Are you sure?"
        description={
          confirmationMessage ||
          "Are You Sure You Want To Leave The Page With Unsaved Changes?"
        }
        // closeButton={true}
      >
        <div className="flex flex-col gap-3">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => navGuard.reject()}
              disabled={isSaving}
            >
              Stay
            </Button>
            <Button
              variant="secondary"
              onClick={discardSaving}
              disabled={isSaving}
            >
              Discard & leave
            </Button>
            <Button onClick={confirmSaving} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save & leave"}
            </Button>
          </div>
        </div>
      </NeutralDialog>
    </>
  );
};

export default NavGuardModal;
