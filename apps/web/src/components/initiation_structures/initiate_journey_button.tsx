"use client";

import AuthModal from "@/features/auth/components/auth_modal";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import RequestEntityInitiationButton from "@/components/initiation_structures/request_attention_button";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";

const classNameVariants = cva(
  "bg-primary  text-white hover:bg-white hover:border-2  hover:border-primary  hover:text-primary  font-bold text-lg lg:text-2xl px-4  md:text-xl md:px-12  py-5 rounded-full shadow-2xl flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary",
        tertiary:
          " bg-tertiary-tint hover:bg-tertiary text-tertiary   hover:text-white hover:border-tertiary-shade ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const InitiateJourneyButton = () => {
  const { profile } = useAuthStore();

  return (
    <div>
      {profile !== null ? (
        <div className="flex flex-wrap flex-col md:flex-row gap-4 items-center">
          <RequestEntityInitiationButton
            title="Wut are you On??"
            className={cn(classNameVariants({ variant: "tertiary" }))}
            variant="outline"
          />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <AuthModal
            title="Commit!"
            className={cn(classNameVariants({ variant: "default" }))}
            variant="landing_page"
          />
          <RequestEntityInitiationButton
            title="Be Brave... Connect with us!"
            className={cn(classNameVariants({ variant: "tertiary" }))}
            variant="default"
          />
        </div>
      )}
    </div>
  );
};

export default InitiateJourneyButton;
