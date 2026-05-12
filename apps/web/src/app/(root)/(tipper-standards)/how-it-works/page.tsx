import Image from "next/image";
import React from "react";
import { HOW_IT_WORKS } from "@/content/pages/tipper_standards/how_it_works";

const STEP_OPACITIES = [
  "bg-primary/10",
  "bg-primary/22",
  "bg-primary/35",
  "bg-primary/50",
  "bg-primary/65",
  "bg-primary/80",
];

const STEP_TEXT = [
  "text-foreground",
  "text-foreground",
  "text-foreground",
  "text-foreground",
  "text-white",
  "text-white",
];

const STEP_MUTED = [
  "text-muted-foreground",
  "text-muted-foreground",
  "text-muted-foreground",
  "text-foreground/70",
  "text-white/80",
  "text-white/80",
];

export default async function HowItWorksPage() {
  return (
    <div className="min-h-screen w-full bg-background px-6 py-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-12 text-center">
        <div className="flex items-center gap-1">
          <h1 className="text-3xl font-bold text-foreground">How&nbsp;</h1>
          <Image
            src="/assets/logos/Tipper_Logos_Brandmark_Ruby.svg"
            alt="Tipper"
            width={32}
            height={32}
          />
          <h1 className="text-3xl font-bold text-foreground">ipper Works</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          {HOW_IT_WORKS.intro}
        </p>
      </div>

      {/* Steps — progressive color stack */}
      <div className="flex flex-col gap-3 max-w-2xl mx-auto">
        {HOW_IT_WORKS.steps.map((step, index) => (
          <div
            key={index}
            className={`${STEP_OPACITIES[index]} rounded-2xl px-6 py-5 flex items-start gap-4`}
          >
            {/* Step number badge */}
            <div
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                index < 4
                  ? "border-primary/30 text-primary"
                  : "border-white/60 text-white"
              }`}
            >
              {step.step}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className={`font-semibold text-sm ${STEP_TEXT[index]}`}>
                  {step.title}
                </h3>
                <span
                  className={`text-xs shrink-0 px-2 py-0.5 rounded-full font-medium ${
                    step.status === "active"
                      ? index < 4
                        ? "bg-tertiary-tint text-tertiary-shade"
                        : "bg-white/20 text-white"
                      : index < 4
                        ? "bg-primary/10 text-primary"
                        : "bg-white/20 text-white"
                  }`}
                >
                  {step.status === "active"
                    ? HOW_IT_WORKS.statusLabels.active
                    : HOW_IT_WORKS.statusLabels.comingSoon}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${STEP_MUTED[index]}`}>
                {step.description}
              </p>
              <p
                className={`text-xs font-medium mt-1 ${
                  index < 4 ? "text-primary/60" : "text-white/60"
                }`}
              >
                {step.timeline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
