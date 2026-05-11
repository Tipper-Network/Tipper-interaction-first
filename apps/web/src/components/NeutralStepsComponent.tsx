"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";
import { CheckCircle } from "lucide-react";
import { ICommunityInitiationStep } from "@/lib/constants/community";

export interface NeutralStepsComponentProps {
  steps: ICommunityInitiationStep[];
  currentStep: number;
  variant?: "dots" | "numbers" | "icons" | "mixed";
  size?: "sm" | "md" | "lg";
  showDescriptions?: boolean;
  showStepTitles?: boolean;
  className?: string;
  stepClassName?: string;
  connectorClassName?: string;
  activeColor?: string;
  inactiveColor?: string;
  completedColor?: string;
}

export function NeutralStepsComponent({
  steps,
  currentStep,
  variant = "mixed",
  size = "md",
  showDescriptions = true,
  showStepTitles = true,
  className = "",
  stepClassName = "",
  connectorClassName = "",
  activeColor = "bg-primary border-primary-shade text-white",
  inactiveColor = "bg-white border-gray-300 text-gray-500",
  completedColor = "bg-tertiary border-tertiary-shade text-white",
}: NeutralStepsComponentProps) {
  const getStepStatus = (
    stepIndex: number
  ): "upcoming" | "current" | "completed" => {
    if (stepIndex < currentStep - 1) return "completed";
    if (stepIndex === currentStep - 1) return "current";
    return "upcoming";
  };

  const getStepIcon = (step: ICommunityInitiationStep, stepIndex: number) => {
    const status = getStepStatus(stepIndex);

    if (status === "completed") {
      return <CheckCircle className="h-full w-full" />;
    }

    if (variant === "numbers") {
      return stepIndex + 1;
    }

    if (variant === "icons" && step.icon) {
      return <step.icon className="h-full w-full" />;
    }

    if (variant === "mixed") {
      if (step.icon) {
        return <step.icon className="h-full w-full" />;
      }
      return stepIndex + 1;
    }

    // Default for dots variant
    return null;
  };

  const getStepSize = () => {
    switch (size) {
      case "sm":
        return { step: "w-6 h-6", icon: "h-4 w-4", connector: "w-8" };
      case "lg":
        return { step: "w-12 h-12", icon: "h-6 w-6", connector: "w-20" };
      default: // md
        return { step: "w-8 h-8", icon: "h-5 w-5", connector: "w-12" };
    }
  };

  const getStepColors = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);

    switch (status) {
      case "completed":
        return completedColor;
      case "current":
        return activeColor;
      default:
        return inactiveColor;
    }
  };

  const sizes = getStepSize();

  return (
    <div className={cn("w-full", className)}>
      {/* Steps Row */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step Circle/Icon */}
            <div
              className={cn(
                "flex items-center justify-center rounded-full border-2 transition-all duration-200",
                sizes.step,
                getStepColors(index),
                stepClassName
              )}
            >
              {getStepIcon(step, index)}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 mx-2 transition-all duration-200",
                  sizes.connector,
                  getStepStatus(index) === "completed"
                    ? "bg-tertiary"
                    : "bg-gray-300",
                  connectorClassName
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Titles and Descriptions */}
      {(showStepTitles || showDescriptions) && (
        <div className="mt-4 text-center">
          {showStepTitles && (
            <h3 className="font-semibold text-gray-900">
              {steps[currentStep - 1]?.title}
            </h3>
          )}
          {showDescriptions && steps[currentStep - 1]?.description && (
            <p className="text-sm text-gray-600 mt-1">
              {steps[currentStep - 1]?.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function OnboardingSteps({
  currentStep,
  steps,
  ...props
}: Omit<NeutralStepsComponentProps, "variant" | "size">) {
  return (
    <NeutralStepsComponent
      steps={steps}
      currentStep={currentStep}
      variant="mixed"
      size="md"
      activeColor="bg-secondary border-secondary text-white"
      completedColor="bg-secondary border-secondary text-white"
      {...props}
    />
  );
}

export function CommunityCreationSteps({
  currentStep,
  steps,
  ...props
}: Omit<NeutralStepsComponentProps, "variant" | "size">) {
  return (
    <NeutralStepsComponent
      steps={steps}
      currentStep={currentStep}
      variant="mixed"
      size="md"
      activeColor="bg-primary border-primary-shade text-white"
      completedColor="bg-tertiary border-tertiary-shade text-white"
      {...props}
    />
  );
}

export function SimpleProgressSteps({
  currentStep,
  steps,
  ...props
}: Omit<NeutralStepsComponentProps, "variant" | "size">) {
  return (
    <NeutralStepsComponent
      steps={steps}
      currentStep={currentStep}
      variant="dots"
      size="sm"
      showStepTitles={false}
      showDescriptions={false}
      {...props}
    />
  );
}
