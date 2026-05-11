"use client";

import React, { useState } from "react";
import StepEntityArchetype from "./steps/entity_archetype_step";
import StepEntityValues from "./steps/entity_values_step";
import StepEntityInterests from "./steps/entity_interests_step";
import { createEntityIdentity } from "@/views/entities/shared/api/entities_api";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, PersonStanding, Globe } from "lucide-react";
import { EntityType__Enum } from "@tipper/shared";
import { useEntityDetails } from "@/views/entities/shared/hooks/entities_hooks";
import { getEntityProfileUrl } from "@/views/entities/shared/utils/entity_routes";

const selectedArchetypes: string[] = [];
const selectedValues: string[] = [];
const selectedInterests: string[] = [];

interface EntityOnboardingFormProps {
  entityId: string;
  entityType?: EntityType__Enum;
}

export default function EntityOnboardingForm({
  entityId,
  // entityType = EntityType__Enum.BUSINESS,
}: EntityOnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interests: selectedInterests,
    archetypes: selectedArchetypes,
    values: selectedValues,
  });

  const {
    data: entity,
    isLoading,
    isError,
    refetch: refetchEntity,
  } = useEntityDetails(entityId);
  const entityType = entity?.entity_type;
  const router = useRouter();

  const STEPS = [
    {
      id: 1,
      title: "Archetypes",
      description: "Entity Archetypes",
      icon: PersonStanding,
      color: "secondary",
    },
    {
      id: 2,
      title: "Principles",
      description: "Core Principles",
      icon: Shield,
      color: "tertiary",
    },
    {
      id: 3,
      title: "Projected Expression",
      description: "Projected Expression",
      icon: Globe,
      color: "tertiary",
    },
  ];

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createEntityIdentity(entityId, {
        interests: formData.interests.map((id: string) => ({
          interest_id: id,
        })),
        archetypes: formData.archetypes.map((id: string) => ({
          archetype_id: id,
        })), // Backend expects "archetypes" with "archetype_id"
        values: formData.values.map((id: string) => ({ value_id: id })),
      });

      // Refetch entity to get the updated entity_type (which may have been changed in profile setup)
      const { data: updatedEntity } = await refetchEntity();
      console.log("updatedEntity", updatedEntity);
      // Navigate to entity profile with entity type using utility function
      // Use the updated entity type from the refetched data
      const finalEntityType = updatedEntity?.entity_type
        ? (updatedEntity.entity_type.toUpperCase() as EntityType__Enum)
        : EntityType__Enum.BUSINESS;
      const profileUrl = getEntityProfileUrl(entityId, finalEntityType);
      router.push(profileUrl);
    } catch (err) {
      console.error("Mutation failed:", err);
    }
  };

  const currentStep = STEPS.find((s) => s.id === step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
              <h1 className="h4-bold sm:h3-bold text-foreground">
                Tipper Network
              </h1>
            </div>
            <div className="text-right min-w-[100px] sm:min-w-[120px]">
              <p className="p-medium-12 sm:p-medium-14 text-muted-foreground">
                Step {step} of 3
              </p>
              <p className="p-regular-10 sm:p-regular-12 text-muted-foreground">
                {currentStep?.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-background border-b border-border h-12 sm:h-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            {STEPS.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step >= stepItem.id;
              const isCurrent = step === stepItem.id;

              return (
                <div key={stepItem.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full transition-all duration-200 ${
                      isCurrent
                        ? `bg-${stepItem.color} text-${stepItem.color}-foreground`
                        : isActive
                          ? `bg-${stepItem.color}/10 text-${stepItem.color}`
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="p-medium-10 sm:p-medium-12 hidden md:block">
                      {stepItem.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-4 sm:w-8 h-0.5 mx-1 sm:mx-2 ${
                        step > stepItem.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-4 sm:py-6 lg:py-8">
        {step === 1 && (
          <StepEntityArchetype
            selected={formData.archetypes}
            onChange={(val) => handleChange("archetypes", val)}
            onSubmit={nextStep}
          />
        )}
        {step === 2 && (
          <StepEntityValues
            selected={formData.values}
            onChange={(val) => handleChange("values", val)}
            onSubmit={nextStep}
            onBack={prevStep}
          />
        )}

        {step === 3 && (
          <StepEntityInterests
            selected={formData.interests}
            onChange={(val) => handleChange("interests", val)}
            onBack={prevStep}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-background border-t border-border mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="text-center">
            <p className="p-regular-12 sm:p-regular-14 text-muted-foreground">
              Your information is secure and will only be used to personalize
              your experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
