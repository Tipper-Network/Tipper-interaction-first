"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NeutralDialog } from "./neutral_dialog";
import { Button } from "./ui/button";
import { AlertCircle, Shield, LogIn, X } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import AuthWizard from "@/features/auth/components/auth_wizard";

type AccessReason = "not_authenticated" | "not_admin" | null;

export function AdminAccessModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState<AccessReason>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    const accessReason = searchParams.get("reason") as AccessReason;
    const redirect = searchParams.get("redirect");

    if (accessReason) {
      setReason(accessReason);
      setShowModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check if user is authenticated but not admin
    if (!loading && user && user.user_role !== "ADMIN") {
      // Check if we're on the landing page and came from an admin route
      const redirect = searchParams.get("redirect");
      if (redirect?.startsWith("/admin") && !reason) {
        setReason("not_admin");
        setShowModal(true);
      }
    }
  }, [user, loading, searchParams, reason]);

  const handleClose = () => {
    setShowModal(false);
    setReason(null);
    // Remove the reason and redirect params from URL
    const params = new URLSearchParams(window.location.search);
    params.delete("reason");
    params.delete("redirect");
    router.replace(params.toString() ? `?${params.toString()}` : "/", {
      scroll: false,
    });
  };

  const handleSignIn = () => {
    setShowModal(false); // Close the admin access modal first
    setShowAuthModal(true); // Then open the auth modal
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowModal(false);
    // Check if there's a redirect URL
    const redirect = searchParams.get("redirect");
    if (redirect) {
      // Remove query params and redirect
      router.push(redirect);
    } else {
      // Just remove query params
      router.replace("/");
    }
  };

  const getModalContent = () => {
    if (reason === "not_authenticated") {
      return {
        title: "Sign In Required",
        icon: <LogIn className="h-12 w-12 text-primary mb-4" />,
        message:
          "You need to sign in to access the admin area. Please sign in to continue.",
        actionLabel: "Sign In",
        onAction: handleSignIn,
      };
    }

    if (reason === "not_admin") {
      return {
        title: "Admin Access Required",
        icon: <Shield className="h-12 w-12 text-destructive mb-4" />,
        message:
          "You don't have permission to access the admin area. Admin access is restricted to authorized personnel only.",
        actionLabel: "Go to Home",
        onAction: handleClose,
      };
    }

    return null;
  };

  const content = getModalContent();

  if (!content) return null;

  return (
    <>
      <NeutralDialog
        open={showModal}
        onOpenChange={setShowModal}
        // closeButton={true}
        title={content.title}
      >
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          {content.icon}
          <p className="text-muted-foreground mb-6 max-w-md">
            {content.message}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            {reason === "not_authenticated" && (
              <Button
                onClick={handleSignIn}
                className="min-w-[100px] bg-primary hover:bg-primary/90 text-dark font-semibold"
              >
                {content.actionLabel}
              </Button>
            )}
            {reason === "not_admin" && (
              <Button onClick={content.onAction} className="min-w-[100px]">
                {content.actionLabel}
              </Button>
            )}
          </div>
        </div>
      </NeutralDialog>

      {/* Auth Modal - Rendered outside NeutralDialog with higher z-index */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-background border border-border rounded-2xl p-8 w-full max-w-md relative shadow-lg">
            <Button
              onClick={() => setShowAuthModal(false)}
              variant="ghost"
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors z-10"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </Button>

            <AuthWizard
              mode="signin"
              returnUrl={"/admin/dashboard"}
              onSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
