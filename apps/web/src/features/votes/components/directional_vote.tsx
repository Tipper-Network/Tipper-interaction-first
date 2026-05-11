import { VoteType__Enum } from "@tipper/shared";
import { VoteWidget } from "./vote_widget";
import { ArrowDownIcon, ArrowUpIcon, Minus } from "lucide-react";

export function DirectionalVote(props: {
  voteBoxId: string;
  userVote?: VoteType__Enum.UP | VoteType__Enum.DOWN;
}) {
  return (
    <VoteWidget
      voteBoxId={props.voteBoxId}
      userVote={props.userVote}
      options={[
        { type: VoteType__Enum.UP, label: "Up", icon: <ArrowUpIcon /> },
        { type: VoteType__Enum.DOWN, label: "Down", icon: <ArrowDownIcon /> },
        { type: VoteType__Enum.NEUTRAL, label: "Neutral", icon: <Minus /> },
      ]}
    />
  );
}
