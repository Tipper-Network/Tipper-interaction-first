"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEntityDetails } from "@/views/entities/shared/hooks/entities_hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { X, ArrowRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import EntityOnboardingModal from "../onboarding_modal/entity_onboarding_modal";
import { getEntityOnboardingUrl } from "@/views/entities/shared/utils/entity_routes";
import { EntityStatus__Enum } from "@tipper/shared";
import {
  ArchetypesIcon,
  ValuesIcon,
  InterestsIcon,
  EntityProfileIcon,
} from "@/icons/cta_icons";

interface StepInfo {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  mainClassName: string;
  buttonClassName: string;
  titleClassName: string;
  bottomLineClassName: string;
  mascot: string;
}

const STEP_INFO: Record<string, StepInfo> = {
  profile: {
    title: "Complete Your Profile Setup",
    description:
      "Finish setting up your entity profile details. Your business won't be public until you complete all onboarding steps.",
    icon: EntityProfileIcon,
    mainClassName:
      "bg-secondary-tint/40 bg-gradient-to-r from-secondary/5 via-secondary/10 to-secondary/5",
    buttonClassName: "bg-secondary hover:bg-secondary/90",
    titleClassName: "text-secondary",
    bottomLineClassName: "from-secondary via-secondary/50 to-secondary",
    mascot: "/assets/mascots/Tipper_Mascots_Rad_Pointing_Left.svg",
  },
  archetypes: {
    title: "Complete Entity Archetypes",
    description:
      "Define what kind of entity you are - this helps others understand your identity and purpose.",
    icon: ArchetypesIcon,
    mainClassName:
      "bg-secondary-tint/40 bg-gradient-to-r from-secondary/5 via-secondary/10 to-secondary/5",
    buttonClassName: "bg-secondary hover:bg-secondary/90",
    titleClassName: "text-secondary",
    bottomLineClassName: "from-secondary via-secondary/50 to-secondary",
    mascot: "/assets/mascots/Tipper_Mascots_Rad_Pointing_Left.svg",
  },
  values: {
    title: "Set Your Core Principles",
    description:
      "Share the values and principles that guide your entity - what you stand for matters.",
    icon: ValuesIcon,
    mainClassName:
      "bg-tertiary-tint/40 bg-gradient-to-r from-tertiary/5 via-tertiary/10 to-tertiary/5",
    buttonClassName: "bg-tertiary hover:bg-tertiary/90",
    titleClassName: "text-tertiary",
    bottomLineClassName: "from-tertiary via-tertiary/50 to-tertiary",
    mascot: "/assets/mascots/Tipper_Mascots_Rad_Pointing_Left.svg",
  },
  interests: {
    title: "Define Your Projected Expression",
    description:
      "Let others know what you're interested in and how you want to be perceived in the network.",
    icon: InterestsIcon,
    mainClassName:
      "bg-tertiary-tint/40 bg-gradient-to-r from-tertiary/5 via-tertiary/10 to-tertiary/5",
    buttonClassName: "bg-tertiary hover:bg-tertiary/90",
    titleClassName: "text-tertiary",
    bottomLineClassName: "from-tertiary via-tertiary/50 to-tertiary",
    mascot: "/assets/mascots/Tipper_Mascots_Pax_Direction_Right.svg",
  },
};

interface EntityProfileBannerProps {
  entityId: string;
}

export default function EntityProfileBanner({
  entityId,
}: EntityProfileBannerProps) {
  const router = useRouter();
  const { data: entity, refetch } = useEntityDetails(entityId);
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [modalOpen, setModalOpen] = useState<
    "profile" | "archetypes" | "values" | "interests" | null
  >(null);

  // Determine which step is incomplete
  const incompleteStep = useMemo(() => {
    if (!entity) return null;

    // First check if profile setup is incomplete (entity_status = CLAIMED)
    if (entity.entity_status === EntityStatus__Enum.CLAIMED) {
      return "profile";
    }

    // If profile is done (FULLY_SETUP), check identity setup
    if (entity.entity_status === EntityStatus__Enum.FULLY_SETUP) {
      const hasArchetypes =
        entity.entity_archetypes && entity.entity_archetypes.length > 0;
      const hasValues = entity.entity_values && entity.entity_values.length > 0;
      const hasInterests =
        entity.entity_interests && entity.entity_interests.length > 0;

      if (!hasArchetypes) return "archetypes";
      if (!hasValues) return "values";
      if (!hasInterests) return "interests";
    }

    return null; // All steps complete
  }, [entity]);

  useEffect(() => {
    // Show banner if entity exists and has incomplete steps
    if (entity && incompleteStep) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [entity, incompleteStep]);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setShowBanner(false);
      setIsDismissing(false);
    }, 300);
  };

  const handleSetup = () => {
    if (!incompleteStep) return;

    // If profile step, redirect to onboarding page
    if (incompleteStep === "profile") {
      router.push(getEntityOnboardingUrl(entityId));
    } else {
      // For identity steps, open modal
      setModalOpen(incompleteStep as "archetypes" | "values" | "interests");
    }
  };

  const handleModalClose = async () => {
    setModalOpen(null);
    await refetch(); // Refetch entity data after modal closes
  };

  if (!showBanner || !incompleteStep || !entity) return null;

  const stepInfo = STEP_INFO[incompleteStep];
  const Icon = stepInfo.icon;

  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden w-full  bg-gradient-to-r from-secondary/5 via-secondary/10 to-secondary/5 shadow-md mb-4 transition-all duration-300 my-2",
          isDismissing && "opacity-0 translate-y-[-20px]",
          stepInfo.mainClassName
        )}
      >
        <div className="relative flex flex-col items-center overflow-hidden justify-center px-6 py-8 ">
          {/* Decorative mascots */}
          {/* Purple cloud-like character pointing (bottom-left) */}
          <div className="absolute -bottom-20 -right-10 z-10 pointer-events-none overflow-hidden rotate-12">
            <Image
              src={stepInfo.mascot}
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
                    {incompleteStep === "archetypes" && "Select Archetypes"}
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
      {modalOpen && modalOpen !== "profile" && (
        <EntityOnboardingModal
          open={modalOpen !== null}
          onClose={handleModalClose}
          step={modalOpen as "archetypes" | "values" | "interests"}
          entityId={entityId}
        />
      )}
    </>
  );
}
