import OnboardingModal from "@/features/onboarding/components/onboarding_modal/user_onboarding_modal";
import { UserInterestsList } from "@/views/users/components/user_interests_list";
import { UserProfileCard } from "@/views/users/components/user_profile_card";
import { UserValuesList } from "@/views/users/components/user_values_list";
import ProfileBanner from "@/features/onboarding/components/user_onboarding_form/profile_banner";

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <ProfileBanner />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <UserProfileCard />
            </div>

            <div className="lg:col-span-2 space-y-8">
              <UserValuesList />
              <UserInterestsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
