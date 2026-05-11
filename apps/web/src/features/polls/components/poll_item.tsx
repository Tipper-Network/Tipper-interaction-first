// src/features/posts/components/PollView.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchPollOptions, submitVote } from "../api/poll_api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import BackButton from "@/components/back_button";
import { toast } from "sonner";

interface PollViewProps {
  pollId: string;
  poll_title: string;
  onBack: () => void;
  isMember: boolean;
}

interface PollOption {
  id: string;
  content: string;
  vote_count: number;
}

const PROGRESS_COLORS = [
  "bg-primary-tint",
  "bg-secondary-tint",
  "bg-tertiary-tint",
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
  "bg-primary-shade",
  "bg-secondary-shade",
  "bg-tertiary-shade",
];

const PollItem: React.FC<PollViewProps> = ({
  pollId,
  poll_title,
  onBack,
  isMember,
}) => {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const result = await fetchPollOptions(pollId);
        setOptions(result);
      } catch {
        setError("Failed to load poll options");
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [pollId]);

  const handleVote = async (optionId: string) => {
    if (votedOptionId) return;
    try {
      if (!isMember) {
        toast.error("Join the community to vote in polls");
        return;
      }
      await submitVote(pollId, optionId);
      setOptions((prevOptions) =>
        prevOptions.map((opt) =>
          opt.id === optionId ? { ...opt, vote_count: opt.vote_count + 1 } : opt
        )
      );
      setVotedOptionId(optionId);
    } catch (err) {
      console.error("Voting failed", err);
    }
  };

  // Calculate total votes and percentages
  const totalVotes = options.reduce((sum, opt) => sum + opt.vote_count, 0);
  const getPercentage = (voteCount: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto p-6 mt-4">
        <p className="text-center text-muted-foreground">Loading poll...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto p-6 mt-4">
        <p className="text-center text-destructive">{error}</p>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-4">
      {/* Back Button */}
      {/* <Button
        onClick={onBack}
        variant="ghost"
        size="sm"
        className="mb-4 hover:bg-gray-100"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Polls
      </Button> */}
      <BackButton callBackFunction={onBack} buttonText="Polls" />

      {/* Poll Card */}
      <Card className=" bg-primary-tint p-1 overflow-hidden shadow-lg border-0">
        <div className=" p-2 ">
          <h2 className="text-xl font-bold text-primary-shade capitalize">
            {poll_title}
          </h2>
          <div className="flex items-center justify-between"></div>
          {totalVotes > 0 && (
            <p className=" text-primary-shade text-sm mt-2">
              {totalVotes} {totalVotes === 1 ? "vote" : "votes"} total
            </p>
          )}
        </div>

        <div className="mt-1 space-y-2">
          {options.map((option, index) => {
            const percentage = getPercentage(option.vote_count);
            const colorClass = PROGRESS_COLORS[index % PROGRESS_COLORS.length];
            const isSelected = votedOptionId === option.id;

            return (
              <Card
                key={option.id}
                className={`overflow-hidden transition-all duration-200 ${
                  votedOptionId
                    ? "cursor-default"
                    : "cursor-pointer hover:shadow-md hover:border-secondary/30"
                } ${isSelected ? "ring-2 ring-secondary" : ""}`}
                onClick={() => !votedOptionId && handleVote(option.id)}
              >
                <div className="px-2 py-1">
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-foreground capitalize">
                        {option.content}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {option.vote_count}{" "}
                      {option.vote_count === 1 ? "Vote" : "Votes"} ·{" "}
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass} transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Voting Instructions */}
          {!votedOptionId && totalVotes === 0 && (
            <p className="text-center text-muted-foreground text-sm mt-6">
              Click on an option to cast your vote
            </p>
          )}
          {votedOptionId && (
            <div className="text-center mt-6 p-4 bg-tertiary-tint rounded-lg">
              <p className="text-tertiary font-semibold">✓ You voted!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Thank you for participating in this poll
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PollItem;
