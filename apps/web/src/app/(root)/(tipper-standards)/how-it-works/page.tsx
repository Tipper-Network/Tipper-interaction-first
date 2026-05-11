import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

export default async function HowItWorksPage() {
  const tipperSteps = [
    {
      step: 1,
      title: "Community Discovery & Interest Mapping",
      description:
        "Users explore local communities based on shared interests. Businesses and community spaces become discoverable through organic engagement rather than ads or listings.",
      icon: "/icons/discovery.svg",
      status: "active",
      timeline: "Phase 1 - Discovery (Q4 2025)",
    },
    {
      step: 2,
      title: "Interest-Based Search & Visibility",
      description:
        "Enable users to search and filter communities, spots, and businesses based on their interests. Visibility is driven by activity, relevance, and participation rather than paid reach.",
      icon: "/icons/search.svg",
      status: "active",
      timeline: "Phase 1 - Discovery (Q4 2025)",
    },
    {
      step: 3,
      title: "Business Onboarding & Presence",
      description:
        "Small and medium businesses join Tipper, create their profiles, and define what they offer. Each profile becomes part of the local community map and contributes to the interest network.",
      icon: "/icons/onboarding.svg",
      status: "coming-soon",
      timeline: "Phase 2 - Activation (Q1 2026)",
    },
    {
      step: 4,
      title: "Events & Activity Structures",
      description:
        "Entities organize and promote local events, activities, and experiences. These create recurring touchpoints for engagement between users and businesses within shared communities.",
      icon: "/icons/events.svg",
      status: "coming-soon",
      timeline: "Phase 3 - Engagement (Q2 2026)",
    },
    {
      step: 5,
      title: "Partnerships & Collaborations",
      description:
        "SMBs connect with each other to create bundled offers, shared promotions, and multi-entity events — driving mutual growth within their community ecosystem.",
      icon: "/icons/partnerships.svg",
      status: "coming-soon",
      timeline: "Phase 4 - Growth (Q3 2026)",
    },
    {
      step: 6,
      title: "Digital Growth & Industry Integration",
      description:
        "Businesses leverage insights, data, and network effects within the Tipper ecosystem to optimize visibility, understand customer behavior, and integrate deeper into their industries.",
      icon: "/icons/growth.svg",
      status: "coming-soon",
      timeline: "Phase 5 - Scale (Q4 2026)",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className=" text-4xl font-bold text-center mb-8 flex items-center justify-center">
        How
        <span className="text-primary px-2">Tipper</span>
        Works
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        The Tipper Network empowers businesses to establish a strong digital
        presence, engage with customers, and grow through meaningful
        connections.
      </p>
      <div className="relative">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tipperSteps.map((step, index) => (
            <Card
              key={index}
              className={`p-6 relative ${
                step.status === "coming-soon"
                  ? "border-2 border-secondary"
                  : "border-2 border-primary/20"
              }`}
            >
              {/* Status Badge */}
              <div className="absolute -top-3 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    step.status === "active"
                      ? "bg-tertiary-tint text-tertiary-shade"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {step.status === "active" ? "✓ Active" : "🚧 Coming Soon"}
                </span>
              </div>

              {/* Timeline Phase */}
              <div className="text-xs text-gray-500 mb-2 font-medium">
                {step.timeline}
              </div>

              {/* Step Number */}
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
                      <strong>Roadmap:</strong> This feature is currently in
                      development and will be available in{" "}
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
