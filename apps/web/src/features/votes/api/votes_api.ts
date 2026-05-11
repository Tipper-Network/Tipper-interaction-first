import { VoteType__Enum } from "@/lib/shared/enum_types";

type CastVoteParams = {
  voteBoxId: string;
  voteType: VoteType__Enum;
};

/**
 * Casts a vote via the Next.js API route.
 *
 * @param params - Vote payload.
 * @param params.voteBoxId - Vote box id.
 * @param params.voteType - Vote type enum.
 * @returns Parsed JSON response from the API route.
 */
export async function castVote(params: CastVoteParams) {
  return fetch("/api/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  }).then((res) => res.json());
}
