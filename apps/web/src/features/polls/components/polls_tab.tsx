"use client";

import React, { useState } from "react";
import { useInfiniteCommunityPolls } from "../hooks/polls_hook";
import PollItem from "./poll_item";
import PollCreateButton from "./create_poll_button";
import { Vote, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import PollCard from "./poll_card";

interface PollsTabProps {
  community_id: string;
  hasJoined: boolean;
}

const PollsTab: React.FC<PollsTabProps> = ({ community_id, hasJoined }) => {
  const [selectedPoll, setSelectedPoll] = useState<any | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCommunityPolls(community_id);

  if (isLoading) return <p>Loading polls...</p>;
  if (isError) return <p>Failed to load polls.</p>;

  const handlePollClick = (poll: any) => {
    setSelectedPoll(poll);
  };

  return (
    <div className="w-full  p-1 rounded-xl">
      <div className="flex flex-col items-center">
        <h3 className="lg:h3-bold text-xl font-bold text-primary-shade block">
          Polls / Votes
        </h3>
        <div className="min-w-fit">
          <PollCreateButton communityId={community_id} disabled={!hasJoined} />
        </div>
      </div>

      {!selectedPoll ? (
        <>
          {data?.pages &&
          data.pages.length > 0 &&
          data.pages.some((page) => page?.items?.length > 0) ? (
            <>
              {data.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  {page?.items?.map((poll: any) => (
                    <div key={poll.id}>
                      <PollCard
                        poll={poll}
                        onClick={() => handlePollClick(poll)}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Vote className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                No polls found in this community
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to create a poll!
              </p>
            </div>
          )}

          {hasNextPage && (
            <div className="text-center mt-6">
              <Card className="p-4 bg-gray-50 border-dashed hover:bg-gray-100 transition-colors cursor-pointer">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full text-secondary font-medium disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? "Loading more polls..."
                    : "Load More Polls"}
                </Button>
              </Card>
            </div>
          )}
        </>
      ) : (
        <PollItem
          pollId={selectedPoll.id}
          poll_title={selectedPoll.poll_title}
          onBack={() => setSelectedPoll(null)}
          isMember={hasJoined}
        />
      )}
    </div>
  );
};

export default PollsTab;
