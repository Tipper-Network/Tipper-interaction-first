"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useOnboardingStatus } from "@/views/users/hooks/users_hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  X,
  User,
  Shield,
  PersonStanding,
  ArrowRight,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import OnboardingModal from "../onboarding_modal/user_onboarding_modal";
import {
  PersonasIcon,
  EntityProfileIcon,
  ValuesIcon,
  InterestsIcon,
} from "@/icons/cta_icons";

interface StepInfo {
  title: string;
  description: string;
  mainClassName: string;
  buttonClassName: string;
  titleClassName: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  bottomLineClassName: string;
  mascot?: string;
}

const STEP_INFO: Record<string, StepInfo> = {
  profile: {
    title: "Complete Your Profile",
    description:
      "Hey man, you do your thing, but we should probably know you better ",
    icon: EntityProfileIcon,
    mainClassName:
      "bg-primary-tint/40 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5",
    buttonClassName: "bg-primary hover:bg-primary/90",
    titleClassName: "text-primary",
    bottomLineClassName: "from-primary via-primary/50 to-primary",
    mascot: "assets/mascots/Tipper_Mascots_Twig_Pointing_Left.svg",
  },
  personas: {
    title: "Finish selecting Your Personas",
    description:
      "of course understanding what kind of person you are serves a purpose.",
    icon: PersonasIcon,
    mainClassName: "bg-secondary-tint",
    buttonClassName: "bg-secondary hover:bg-secondary/90",
    titleClassName: "text-secondary",
    bottomLineClassName: "from-secondary via-secondary/50 to-secondary",
    mascot: "/assets/mascots/Tipper_Mascots_Rad_Pointing_Left.svg",
  },
  values: {
    title: "Complete Your Values",
    description:
      "you think you know what you believe in, but we are not able to read your mind.",
    icon: ValuesIcon,
    mainClassName: "bg-tertiary-tint",
    buttonClassName: "bg-tertiary hover:bg-tertiary/90",
    titleClassName: "text-tertiary",
    bottomLineClassName: "from-tertiary via-tertiary/50 to-tertiary",
    mascot: "/assets/mascots/Tipper_Mascots_Pax_Direction_Left.svg",
  },
  interests: {
    title: "Finalize your Interests",
    description:
      "it makes sense for us to keep asking about your interests, but you dont have to feel any way about it.",
    icon: InterestsIcon,
    mainClassName: "primary",
    buttonClassName: "bg-primary hover:bg-primary/90",
    titleClassName: "text-primary",
    bottomLineClassName: "from-tertiary via-tertiary/50 to-tertiary",
    mascot: "/assets/mascots/Tipper_Mascots_Twig_Raising_Hands.svg",
  },
};

export default function ProfileBanner() {
  const user = useAuthStore((s) => s.user);
  const { data: onboardingStatus, refetch } = useOnboardingStatus(!!user);
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [modalOpen, setModalOpen] = useState<
    "profile" | "personas" | "values" | "interests" | null
  >(null);

  // Determine which step is incomplete
  const incompleteStep = useMemo(() => {
    if (!onboardingStatus || !user?.email_verified) return null;

    if (!onboardingStatus.profile_setup) return "profile";
    if (!onboardingStatus.personas_setup) return "personas";
    if (!onboardingStatus.values_setup) return "values";
    if (!onboardingStatus.interests_setup) return "interests";
    return null; // All steps complete
  }, [onboardingStatus, user]);

  useEffect(() => {
    // Show banner if user is logged in, email verified, and has incomplete steps
    if (user && user.email_verified && incompleteStep) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [user, incompleteStep]);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setShowBanner(false);
      setIsDismissing(false);
    }, 300);
  };

  const handleSetup = () => {
    if (incompleteStep) {
      setModalOpen(
        incompleteStep as "profile" | "personas" | "values" | "interests"
      );
    }
  };

  const handleModalClose = async () => {
    setModalOpen(null);
    await refetch(); // Refetch onboarding status after modal closes
  };

  if (!showBanner || !incompleteStep) return null;

  const stepInfo = STEP_INFO[incompleteStep];
  const Icon = stepInfo.icon;

  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden w-full   shadow-md mb-4 transition-all duration-300 my-2",
          isDismissing && "opacity-0 translate-y-[-20px]",
          stepInfo.mainClassName
        )}
      >
        <div className="relative flex flex-col items-center overflow-hidden justify-center px-6 py-8 ">
          {/* Decorative mascots */}
          {/* Purple cloud-like character pointing (bottom-left) */}
          <div className="absolute -bottom-20 -right-10 z-10 pointer-events-none overflow-hidden rotate-12">
            <Image
              src={stepInfo.mascot || ""}
              alt="mascot icon"
              width={200}
              height={200}
              className="w-40 h-40 sm:w-56 sm:h-56"
            />
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-30 h-8 w-8 rounded-full "
            onClick={handleDismiss}
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Main content */}
          <div className=" flex items-start justify-start gap-4 md:gap-20  w-full ">
            <div className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-2">
              <Icon size={100} />
            </div>
            {/* Title Section */}
            <div className="flex  flex-col items-start space-y-2 ">
              {/* title and description section */}
              <div className=" space-y-2 max-w-xl">
                <h3
                  className={cn(
                    "text-xl sm:text-2xl font-semibold ",
                    stepInfo.titleClassName
                  )}
                >
                  {stepInfo.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground ">
                  {stepInfo.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-start w-full max-w-md pt-4 content-start">
                <div className=" max-w-sm ">
                  <Button
                    onClick={handleSetup}
                    className={cn(
                      "w-full px-4 rounded-2xl text-md sm:text-xl font-semibold text-white ",
                      stepInfo.buttonClassName,
                      "flex items-center justify-center gap-3",
                      "shadow-lg hover:shadow-xl transition-all"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {incompleteStep === "profile" && "Complete Profile"}
                    {incompleteStep === "personas" && "Select Personas"}
                    {incompleteStep === "values" && "Select Values"}
                    {incompleteStep === "interests" && "Choose Interests"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Maybe later button */}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Maybe later
                </Button>
              </div>
            </div>
          </div>
          <div className="h-10 md:h-0" />
        </div>

        {/* Decorative Gradient Line */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ",
            stepInfo.bottomLineClassName
          )}
        />
      </Card>
      <OnboardingModal
        open={modalOpen !== null}
        onClose={handleModalClose}
        step={modalOpen}
      />
    </>
  );
}
