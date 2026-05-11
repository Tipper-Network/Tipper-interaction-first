import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import WhatsAppCommunityButton from "@/components/button_external_links/whatsapp_community_button";

export default function FooterCtaBanner() {
  return (
    <section className="w-full px-4 pb-20 pt-2">
      <div className="mx-auto w-full  ">
        <div className="relative  rounded-3xl bg-primary-tint/40 px-6 pb-16 pt-12 text-center shadow-sm sm:px-10 sm:pb-64 md:px-14 md:pb-72 md:pt-14 overflow-visible">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            <span className="text-tertiary  ">Find</span>,{" "}
            <span className="text-primary">Share</span>, and{" "}
            <span className="text-secondary">Shape</span> your world
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-foreground/80 sm:text-lg">
            Whether your vibe is through moments, spaces, or people{" "}
            <span className="font-semibold text-foreground">
              Start it here.
            </span>
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/explore"
              className="group inline-flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-full bg-secondary px-8 text-base font-semibold text-white shadow-sm transition hover:bg-secondary-shade focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B6CFF]/40"
            >
              <span>Start Exploring</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <WhatsAppCommunityButton
              className="h-12 min-w-[260px] rounded-full bg-tertiary px-8 py-0 text-white font-semibold  shadow-sm transition hover:bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D7B4]/40"
              communityLink="https://chat.whatsapp.com/HHiRZer2Uvw94B5fHh4Q8q"
              buttonText="Whatsapp Community"
              srcLink="/brands/Whatsapp.svg"
            />
          </div>

          {/* Mascots / Illustration */}
          <div className="  pointer-events-none absolute inset-x-0  -bottom-20 flex justify-center ">
            <div className=" w-[70%] h-full">
              <Image
                src="/assets/mascots/Group-landing.png"
                alt=""
                width={1000}
                height={420}
                // priority={false}
                className="  h-auto w-[min(1100px,92vw)] select-none object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
