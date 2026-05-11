import { VoteType__Enum } from "@/lib/shared/enum_types";
import { VoteWidget } from "./vote_widget";
import { Minus, ThumbsDown, ThumbsUp } from "lucide-react";
// import { HelpingHand } from "lucide-react";

export function EvaluativeVote(props: {
  voteBoxId: string;
  userVote?: VoteType__Enum.HELPFUL | VoteType__Enum.NOT_HELPFUL;
}) {
  return (
    <VoteWidget
      voteBoxId={props.voteBoxId}
      userVote={props.userVote}
      options={[
        { type: VoteType__Enum.HELPFUL, label: "Helpful", icon: <ThumbsUp /> },
        {
          type: VoteType__Enum.NOT_HELPFUL,
          label: "Not helpful",
          icon: <ThumbsDown />,
        },
        { type: VoteType__Enum.NEUTRAL, label: "Neutral", icon: <Minus /> },
      ]}
    />
  );
}
