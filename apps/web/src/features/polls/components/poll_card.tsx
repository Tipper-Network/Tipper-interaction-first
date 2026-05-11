import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Vote } from "lucide-react";
import React from "react";

const PollCard = ({
  poll,
  onClick,
}: {
  poll: any;
  onClick: (poll: any) => void;
}) => {
  const timeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };
  return (
    <>
      <Card
        onClick={() => onClick(poll)}
        className=" overflow-hidden bg-primary-tint  rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 border -secondary/50"
      >
        <div className="p-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-primary-shade capitalize line-clamp-2">
                    {poll.poll_title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeAgo(poll.created_at)}
                  </p>
                </div>
                {poll.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 ml-13">
                    {poll.description}
                  </p>
                )}
              </div>
            </div>

            {/* <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" /> */}
          </div>

          {/* {poll.total_votes !== undefined && (
                          <div className=" mt-3 pt-3 border-t flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">
                              {poll.total_votes}{" "}
                              {poll.total_votes === 1 ? "vote" : "votes"}
                            </span>
                            {poll.options_count && (
                              <>
                                <span>•</span>
                                <span>{poll.options_count} options</span>
                              </>
                            )}
                          </div>
                        )} */}
        </div>
      </Card>
    </>
  );
};

export default PollCard;
