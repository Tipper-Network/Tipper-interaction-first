import React from "react";
import Image from "next/image";
import SubstackRss from "@/components/substack_rss";
import { RESOURCES } from "@/content/pages/tipper_standards/resources";

export default function BlogPage() {
  return (
    <div className="min-h-screen w-full bg-background px-6 py-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-12 text-center">
        <div className="flex items-center gap-1">
          <Image
            src="/assets/logos/Tipper_Logos_Brandmark_Ruby.svg"
            alt="Tipper"
            width={60}
            height={60}
          />
          <h1 className="text-3xl font-bold text-foreground">Tipper Articles.</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          {RESOURCES.intro}
        </p>
      </div>

      <SubstackRss />
    </div>
  );
}
