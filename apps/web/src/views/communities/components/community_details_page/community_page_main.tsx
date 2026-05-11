"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
const PollsTab = dynamic(
  () => import("@/features/polls/components/polls_tab"),
  {
    loading: () => <p>Loading polls...</p>,
    ssr: false,
  }
);
// const GroupChatGrid = dynamic(
//   () => import("@/features/chats/components/group_chat_grid"),
//   {
//     loading: () => <p>Loading chats...</p>,
//     ssr: false,
//   }
// );
const ThoughtsTab = dynamic(
  () => import("@/features/thoughts/components/thought_tab"),
  {
    loading: () => <p>Loading thoughts...</p>,
    ssr: false,
  }
);
const CommunityQNATab = dynamic(
  () => import("@/features/community_qna/components/community_qna_tab"),
  {
    loading: () => <p>Loading Community QNA...</p>,
    ssr: false,
  }
);

import { useCommunityDetails } from "../../hooks/community_hooks";
import { joinCommunity } from "../../api/communities_api";
import CommunityPageDetails from "@/features/communities/components/community_details_page/community_page_details";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import CommunityPageRight from "./community_page_right";

import ProfileBanner from "@/features/onboarding/components/user_onboarding_form/profile_banner";
import ShareButton from "@/features/share/components/share_button";

interface CommunityPageMainProps {
  communityId: string;
}

const CommunityPageMain: React.FC<CommunityPageMainProps> = ({
  communityId,
}) => {
  const { data, isLoading, isError, refetch } =
    useCommunityDetails(communityId);
  const [hasJoined, setHasJoined] = useState(false);

  // console.log(communityId);
  // console.log(data);

  useEffect(() => {
    if (data?.has_joined !== undefined) {
      setHasJoined(data.has_joined);
    }
  }, [data]);
  console.log(data);
  const handleJoin = async () => {
    try {
      await joinCommunity(communityId);

      setHasJoined((prev) => !prev);

      toast.success(
        hasJoined ? "Left the community." : "Joined the community 🎉"
      );

      // Refetch updated state
      await refetch();
    } catch (err) {
      console.error("Join/Leave failed:", err);
      toast.error("Action failed", {
        description: "Please log in or try again later.",
        action: {
          label: "Retry",
          onClick: handleJoin,
        },
      });
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError || !data)
    return (
      <div className="text-center py-10">Failed to load community details.</div>
    );
  // const has_joined = data.has_joined;
  const tabs = [
    {
      label: "Thoughts",
      value: "thoughts",
    },
    {
      label: "Polls",
      value: "polls",
    },
    {
      label: "Community QNA",
      value: "community-qna",
    },
  ];
  console.log("data: ", data);
  const userClaim = data.user_claim;
  return (
    <div className="w-full ">
      {/* Community Details Header */}

      <div className="mb-6">
        <CommunityPageDetails
          data={data.community}
          userClaim={userClaim}
          onJoin={handleJoin}
          has_joined={hasJoined}
          entityId={data.community.entity_id}
          communityId={communityId}
        />
      </div>
      <div className="max-w-6xl mx-auto">
        <ProfileBanner />
      </div>

      {/* Main Content Area - Responsive Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content - Left Side */}
        <div className="flex-1 xl:w-4/5">
          <div className=" flex justify-center">
            <ShareButton
              destination={`/explore/entity_communities/${data.community.slug}`}
            />
          </div>
          <Tabs
            defaultValue="thoughts"
            className="w-full max-h-screen min-h-96 overflow-y-scroll"
          >
            <TabsList className="flex flex-row items-center gap-3 bg-transparent p-0 h-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl px-4 py-1 text-sm font-medium transition-all shadow-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-primary-tint  data-[state=inactive]:text-primary-shade"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="polls" className="w-full">
              <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                <PollsTab community_id={communityId} hasJoined={hasJoined} />
              </div>
            </TabsContent>
            <TabsContent value="thoughts" className="w-full">
              <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                <ThoughtsTab community_id={communityId} hasJoined={hasJoined} />
              </div>
            </TabsContent>
            <TabsContent value="community-qna" className="w-full">
              <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                <CommunityQNATab
                  community_id={communityId}
                  hasJoined={hasJoined}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="xl:w-1/5 xl:min-w-80">
          <CommunityPageRight mockActivities={[]} mockTopics={[]} />
        </div>
      </div>
    </div>
  );
};

export default CommunityPageMain;
