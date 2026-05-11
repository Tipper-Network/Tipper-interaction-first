"use client";
import { useSearchParams } from "next/navigation";
import AuthWizard from "@/features/auth/components/auth_wizard";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthWizard mode="verification" returnUrl={returnUrl || undefined} />
    </div>
  );
}
