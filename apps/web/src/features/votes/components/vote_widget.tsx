import React from "react";
import { VoteType__Enum } from "@/lib/shared/enum_types";
import { useCastVote } from "../hooks/votes_hooks";
import { ToolTipWrapper } from "@/components/toolTip_Wrapper";
import { Button } from "@/components/ui/button";

type VoteOption = {
  type: VoteType__Enum;
  label: string;
  icon?: React.ReactNode;
};

type VoteWidgetProps = {
  voteBoxId: string;
  userVote?: VoteType__Enum | null;
  options: VoteOption[];
};

export function VoteWidget({ voteBoxId, userVote, options }: VoteWidgetProps) {
  const { mutate: castVote, isPending } = useCastVote();

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <ToolTipWrapper key={option.type} tooltipTitle={option.label}>
          <Button
            key={option.type}
            disabled={isPending}
            aria-pressed={userVote === option.type}
            onClick={() =>
              castVote({
                voteBoxId,
                voteType: option.type,
              })
            }
          >
            {option.icon}
            {/* {option.label} */}
          </Button>
        </ToolTipWrapper>
      ))}
    </div>
  );
}
