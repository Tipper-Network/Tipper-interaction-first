import Image from "next/image";
import React from "react";
import { OUR_FEATURES } from "@/content/pages/tipper_standards/our_features";

export default async function FeaturePage() {
  return (
    <div className="min-h-screen w-full bg-background px-6 py-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logos/Tipper_Logos_Brandmark_Ruby.svg"
            alt="Tipper"
            width={36}
            height={36}
          />
          <h1 className="text-3xl font-bold text-foreground">
            Tipper Features
          </h1>
        </div>
        <p className="text-center text-muted-foreground max-w-xl text-base leading-relaxed">
          Discover the powerful features that help businesses establish a strong
          digital presence, engage with customers, and grow their network in the
          digital age.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {OUR_FEATURES.map((feature: any, index: number) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </div>
  );
}
const FeatureCard = ({ feature }: { feature: any }) => {
  return (
    <div
      className={`${feature.color} rounded-3xl p-8 flex flex-col gap-3 min-h-[200px]`}
    >
      <span className="text-3xl">{feature.icon}</span>
      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
};
