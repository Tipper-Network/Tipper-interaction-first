import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { HOW_IT_WORKS } from "@/content/pages/tipper_standards/how_it_works";

export default async function HowItWorksPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center">
        {HOW_IT_WORKS.title.prefix}
        <span className="text-primary px-2">{HOW_IT_WORKS.title.highlight}</span>
        {HOW_IT_WORKS.title.suffix}
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        {HOW_IT_WORKS.intro}
      </p>
      <div className="relative">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step, index) => (
            <Card
              key={index}
              className={`p-6 relative ${
                step.status === "coming-soon"
                  ? "border-2 border-secondary"
                  : "border-2 border-primary/20"
              }`}
            >
              <div className="absolute -top-3 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    step.status === "active"
                      ? "bg-tertiary-tint text-tertiary-shade"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {step.status === "active"
                    ? HOW_IT_WORKS.statusLabels.active
                    : HOW_IT_WORKS.statusLabels.comingSoon}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-2 font-medium">
                {step.timeline}
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-4 ${
                  step.status === "active"
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.step}
              </div>

              <CardHeader className="flex items-center space-x-4 px-0">
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="px-0">
                <p className="text-gray-700">{step.description}</p>
                {step.status === "coming-soon" && (
                  <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
                    <p className="text-sm text-secondary-foreground">
                      <strong>{HOW_IT_WORKS.statusLabels.roadmapPrefix}</strong>{" "}
                      {HOW_IT_WORKS.statusLabels.roadmapSuffix}{" "}
                      {step.timeline.split("(")[1]?.replace(")", "")}.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
