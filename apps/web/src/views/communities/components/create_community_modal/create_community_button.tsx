"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NeutralDialog } from "@/components/neutral_dialog";
import { CommunityCreationSteps } from "@/components/NeutralStepsComponent";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { createCommunity } from "../../api/communities_api";
import { normalizeInstagramHandle } from "@/lib/utils/utils";
import CommunityStepEntityInfo from "./steps/entity_info_step";
import CommunityStepLocation from "./steps/location_step";
import { motion, AnimatePresence } from "framer-motion";

import { STEPS } from "@/lib/constants/community";
import type { UserInitiateCommunityForEntity } from "./types/community_types";
import { UserInitiateCommunityForEntitySchema } from "./types/community_types";
import Image from "next/image";
import Link from "next/link";

type ExistingEntityInfo = {
  message?: string;
  communitySlug?: string | null;
  entitySlug?: string | null;
};

interface CreateCommunityButtonProps {
  expandButton?: boolean;
}
export default function CreateCommunityButton({
  expandButton = false,
}: CreateCommunityButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingEntityInfo, setExistingEntityInfo] =
    useState<ExistingEntityInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Expand the button
    setIsExpanded(true);

    // After 3 seconds, retract it
    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  const { user } = useAuthStore();

  const form = useForm<UserInitiateCommunityForEntity>({
    resolver: zodResolver(UserInitiateCommunityForEntitySchema),
    defaultValues: {
      city: "",
      neighborhood: "",
      street: "",
      operates_online: false,
      coordinates: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        timestamp: 0,
      },
      entityName: "",
      description: "",
      // businessTypeId: "",
      entityEmail: "",
      entityPhoneNumber: "",
      instagram_url: "@",
    },
  });

  const { handleSubmit, trigger, reset, watch } = form;
  const operatesOnline = watch("operates_online");

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return [
          "entityName",
          "description",
          "entityEmail",
          "instagram_url",
          "entityPhoneNumber",
          "operates_online",
        ] as const;
      case 2:
        return ["city", "neighborhood", "street", "coordinates"] as const;
      default:
        return [] as const;
    }
  };

  // Custom submit handler that validates only relevant fields
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // When operates_online is true and we're on step 1, only validate step 1 fields
    if (currentStep === 1 && operatesOnline) {
      const step1Fields = getFieldsForStep(1);
      const isValid = await trigger(step1Fields);
      if (isValid) {
        // Get form values and submit
        const formValues = form.getValues();
        await onSubmit(formValues);
      }
    } else {
      // For normal flow, use React Hook Form's handleSubmit
      handleSubmit(onSubmit)(e);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const valid = await trigger(fieldsToValidate);
    if (valid) {
      // If on step 1 and operates_online is true, skip step 2 and go directly to submit
      if (currentStep === 1 && operatesOnline) {
        // Get form values and submit directly
        const formValues = form.getValues();
        await onSubmit(formValues);
      } else {
        setCurrentStep((s) => s + 1);
      }
    }
  };

  const prevStep = () => setCurrentStep((s) => s - 1);

  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentStep(1);
    reset();
  };

  const onSubmit = async (data: UserInitiateCommunityForEntity) => {
    // Only validate step 2 fields if operates_online is false
    if (!data.operates_online) {
      const step2Fields = getFieldsForStep(2);
      const isValid = await trigger(step2Fields);
      if (!isValid) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const normalizedInstagram = data.instagram_url
        ? normalizeInstagramHandle(data.instagram_url)
        : undefined;

      // Prepare the payload - omit location fields when operates_online is true
      const payload: Parameters<typeof createCommunity>[0] = {
        name: data.entityName.trim(),
        description: data.description.trim(),
        entityEmail: data.entityEmail,
        operates_online: data.operates_online,
        instagram_url: normalizedInstagram || undefined,
        entityPhoneNumber: data.entityPhoneNumber?.trim() || undefined,
      };

      // Only include location fields if not operating online
      if (!data.operates_online) {
        payload.city = data.city?.trim() || undefined;
        payload.neighborhood = data.neighborhood?.trim() || undefined;
        payload.street = data.street?.trim() || undefined;
        payload.latitude = Number(data.coordinates?.latitude);
        payload.longitude = Number(data.coordinates?.longitude);
        payload.accuracy = Number(data.coordinates?.accuracy ?? 0);
      }

      console.log("Submitting community creation:", payload);
      const response = await createCommunity(payload);

      if (response?.success === false) {
        setExistingEntityInfo({
          message: response.message,
          communitySlug: response.community_slug ?? null,
          entitySlug: response.entity_slug ?? null,
        });
        return;
      }

      toast.success("Community created successfully!");
      handleClose();
    } catch (error) {
      console.error("Community creation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create community.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {expandButton ? (
        <motion.button
          className="relative overflow-hidden bg-primary text font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow"
          initial={{ width: 56, height: 56 }}
          animate={{
            width: isExpanded ? "auto" : 56,
            height: 56,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex items-center  ">
            {!isExpanded && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isExpanded ? 1 : 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center "
              >
                <Image
                  src="/assets/icons/Tipper_Icons_Event_Circle_Ruby.svg"
                  alt="initiate Space "
                  width={200}
                  height={200}
                />
              </motion.div>
            )}
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="whitespace-nowrap flex items-center text-white gap-3 px-3"
                >
                  <Image
                    src="/assets/icons/Tipper_Icons_Event_Circle_Ruby.svg"
                    alt="initiate a Space "
                    width={40}
                    height={40}
                  />
                  Initiate a Space
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      ) : (
        <div className="text-white">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-primary hover:bg-primary hover:border-2  hover:border-white  hover:text-white font-bold text-lg lg:text-2xl px-4 py-2 md:text-xl md:px-12 md:py-6 rounded-full shadow-2xl flex items-center justify-center"
          >
            <Image
              className="w-8 h-8"
              src="/assets/icons/Tipper_Icons_Event_Circle_Ruby.svg"
              alt="initiate  a Space "
              width={200}
              height={20}
            />
            Initiate a Space
          </Button>
        </div>
      )}

      <NeutralDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Initiate a Space"
        description="Start Building Momentum around your Intention"
      >
        <FormProvider {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <CommunityCreationSteps
              steps={STEPS}
              currentStep={currentStep}
              showStepTitles
              showDescriptions
            />

            <Card>
              <CardHeader>
                <CardTitle>
                  Step {currentStep}: {STEPS[currentStep - 1]?.title}
                </CardTitle>
                <CardDescription>
                  {STEPS[currentStep - 1]?.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {currentStep === 1 && <CommunityStepEntityInfo />}
                {currentStep === 2 && <CommunityStepLocation />}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>

              {currentStep === 1 && operatesOnline ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Community"}
                </Button>
              ) : currentStep < STEPS.length ? (
                <Button type="button" onClick={nextStep}>
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Community"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </NeutralDialog>
      <NeutralDialog
        open={!!existingEntityInfo}
        onOpenChange={(open) => {
          if (!open) setExistingEntityInfo(null);
        }}
        title="Business Already Has a Community"
        description={
          existingEntityInfo?.message ||
          "We found an existing community linked to this business."
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Head over to the existing community to continue engaging with it.
          </p>
          <Button
            asChild
            disabled={!existingEntityInfo?.communitySlug}
            className="w-full"
          >
            <Link
              href={
                existingEntityInfo?.communitySlug
                  ? `/explore/entity_communities/${existingEntityInfo.communitySlug}`
                  : "#"
              }
            >
              Go to Community
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setExistingEntityInfo(null)}
          >
            Close
          </Button>
        </div>
      </NeutralDialog>
    </>
  );
}
