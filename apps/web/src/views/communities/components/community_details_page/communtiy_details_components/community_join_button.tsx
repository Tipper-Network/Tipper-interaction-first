import { ToolTipWrapper } from "@/components/tool_tip_wrapper";
import { Button } from "@/components/ui/button";
import React from "react";

const JoinCommunityButton = ({
  hasVisited,
  onJoin,
  has_joined,
  membershipStatus,
}: {
  hasVisited: boolean;
  onJoin: () => void;
  has_joined: boolean;
  membershipStatus: string;
}) => {
  return (
    <div className="flex justify-center">
      <ToolTipWrapper
        tooltipTitle="You know you can join and engage with this space..."
        variant="clickable"
        // disabled={}
      >
        <div className=" ">
          {/* Join/Leave Button - Only show if visited */}
          {hasVisited ? (
            <div className="mb-6 text-center">
              {has_joined
                ? `you are ${membershipStatus}`
                : "you are not a member of this community yet"}

              <Button onClick={onJoin} className="text-white">
                {has_joined ? "Leave Community" : "Connect With The Community"}
              </Button>
            </div>
          ) : (
            <strong className="text-center flex p-2 bg-white text-secondary-shade rounded-lg ">
              {" "}
              Find a qr code to scan... ps: ask a member{" "}
            </strong>
          )}
        </div>
      </ToolTipWrapper>
    </div>
  );
};

export default JoinCommunityButton;
