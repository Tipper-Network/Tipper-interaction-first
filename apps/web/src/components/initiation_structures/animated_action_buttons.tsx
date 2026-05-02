"use client";

import React from "react";
import CreateCommunityButton from "@/features/communities/components/create_community_modal/create_community_button";
import RequestEntityInitiationButton from "@/components/initiation_structures/request_attention_button";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { UserRole__Enum } from "@/features/auth/stores/auth-store";
/**
 * Component that renders animated expand buttons for initiating community
 * and requesting entity initiation, based on user authentication and role.
 */
export default function AnimatedActionButtons() {
  const { user, profile } = useAuthStore();
  const showButtons =
    user?.user_role === UserRole__Enum.ADMIN ||
    user?.user_role === UserRole__Enum.VERIFIED;
  return (
    <div className=" flex flex-col  sm:flex-row gap-4 justify-center items-center">
      {/* Render hidden buttons so we can trigger them programmatically */}

      <div className="">
        {showButtons && <CreateCommunityButton expandButton={true} />}
        {!showButtons && (
          <RequestEntityInitiationButton
            expandButton={true}
            title="Request your entity to be initiated"
          />
        )}
      </div>
    </div>
  );
}
