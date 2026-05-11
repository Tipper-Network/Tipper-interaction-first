"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NeutralDialog } from "@/components/neutral_dialog";
import StepEntityArchetype from "../entity_onboarding_form/steps/entity_archetype_step";
import StepEntityValues from "../entity_onboarding_form/steps/entity_values_step";
import StepEntityInterests from "../entity_onboarding_form/steps/entity_interests_step";
import { createEntityIdentity } from "@/views/entities/shared/api/entities_api";
import { useEntityDetails } from "@/views/entities/shared/hooks/entities_hooks";

interface EntityOnboardingModalProps {  
  open: boolean;
  onClose: () => void;
  step: "archetypes" | "values" | "interests" | null;
  entityId: string;
}

export default function EntityOnboardingModal({
  open,
  onClose,
  step,
  entityId,
}: EntityOnboardingModalProps) {
  const { data: entity, refetch: refetchEntity } = useEntityDetails(entityId);

  // Internal step management - start with the step passed from banner, but allow progression
  const [currentStep, setCurrentStep] = useState<
    "archetypes" | "values" | "interests"
  >("archetypes");

  // Initialize state from existing entity data
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Update current step when step prop changes (when modal opens)
  useEffect(() => {
    if (step && open) {
      setCurrentStep(step);
    }
  }, [step, open]);

  // Update state when entity data loads
  useEffect(() => {
    if (entity) {
      setSelectedArchetypes(
        entity.entity_archetypes?.map((a: any) => a.archetype_id) || []
      );
      setSelectedValues(
        entity.entity_values?.map((v: any) => v.value_id) || []
      );
      setSelectedInterests(
        entity.entity_interests?.map((i: any) => i.interest_id) || []
      );
    }
  }, [entity]);

  const handleNextStep = () => {
    // Progress to next step
    if (currentStep === "archetypes") {
      setCurrentStep("values");
    } else if (currentStep === "values") {
      setCurrentStep("interests");
    }
  };

  const handleBackStep = () => {
    // Go back to previous step
    if (currentStep === "interests") {
      setCurrentStep("values");
    } else if (currentStep === "values") {
      setCurrentStep("archetypes");
    }
  };

  const handleComplete = async () => {
    // Submit all data when user completes the final step
    try {
      await createEntityIdentity(entityId, {
        archetypes: selectedArchetypes.map((id) => ({ archetype_id: id })),
        values: selectedValues.map((id) => ({ value_id: id })),
        interests: selectedInterests.map((id) => ({ interest_id: id })),
      });
      await refetchEntity();
      onClose();
    } catch (error) {
      console.error("Failed to create entity identity:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "archetypes":
        return (
          <StepEntityArchetype
            selected={selectedArchetypes}
            onChange={setSelectedArchetypes}
            onSubmit={handleNextStep}
          />
        );
      case "values":
        return (
          <StepEntityValues
            selected={selectedValues}
            onChange={setSelectedValues}
            onBack={handleBackStep}
            onSubmit={handleNextStep}
          />
        );
      case "interests":
        return (
          <StepEntityInterests
            selected={selectedInterests}
            onChange={setSelectedInterests}
            onBack={handleBackStep}
            onSubmit={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <NeutralDialog open={open} onOpenChange={onClose}>
      <div className="relative">
        {renderStep()}
        <Button
          variant="link"
          className="absolute top-2 right-2 text-primary hover:text-primary-shade z-10"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </NeutralDialog>
  );
}
