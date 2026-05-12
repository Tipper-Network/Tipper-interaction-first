import React from "react";
import Image from "next/image";
import WhatsAppChatButton from "@/components/button_external_links/whatsapp_chat_button";
import { Button } from "@/components/ui/button";
import { WHATSAPP_TIPPER_PHONE } from "@/lib/constants/randoms";
import { ABOUT } from "@/content/pages/tipper_standards/about";

const VALUE_COLORS = [
  "bg-secondary-tint",
  "bg-tertiary-tint",
  "bg-tertiary-tint",
];

const MILESTONE_COLORS = [
  "bg-primary-tint",
  "bg-secondary-tint",
  "bg-tertiary-tint",
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen w- bg-background overflow-hidden flex flex-col items-center justify-center content-center">
      {/* ── Hero ── */}
      <section className="flex flex-col items-center gap-4 px-6 pt-16 pb-12 text-center">
        <div className="flex items-center gap-1">
          <h1 className="text-4xl font-bold text-foreground">About&nbsp;</h1>
          <Image
            src="/assets/logos/Tipper_Logos_Brandmark_Ruby.svg"
            alt="Tipper"
            width={36}
            height={36}
          />
          <h1 className="text-4xl font-bold text-foreground">ipper</h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          {ABOUT.hero.description}
        </p>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="px-6 pb-14 max-w-3xl mx-auto">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="bg-primary-tint rounded-3xl p-8 flex flex-col gap-3 min-h-[160px]">
            <span className="text-3xl">{ABOUT.mission.icon}</span>
            <h3 className="font-semibold text-foreground">
              {ABOUT.mission.sectionTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ABOUT.mission.body}
            </p>
          </div>
          <div className="bg-primary-tint rounded-3xl p-8 flex flex-col gap-3 min-h-[160px]">
            <span className="text-3xl">{ABOUT.vision.icon}</span>
            <h3 className="font-semibold text-foreground">
              {ABOUT.vision.sectionTitle}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ABOUT.vision.body}
            </p>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Our{" "}
          <span className="text-primary">{ABOUT.values.sectionTitle.replace("Our ", "")}</span>
        </h2>
        <div className="grid gap-4 grid-cols-3">
          {ABOUT.values.items.map((value, index) => (
            <div
              key={index}
              className={`${VALUE_COLORS[index % VALUE_COLORS.length]} rounded-3xl p-6 flex flex-col gap-2 min-h-[140px]`}
            >
              <span className="text-2xl">{value.icon}</span>
              <h3 className="font-semibold text-sm text-foreground">
                {value.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Journey (wave band) ── */}
      <section className="relative w-full py-20 bg-primary-tint [clip-path:ellipse(120%_100%_at_50%_50%)]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">
            Our{" "}
            <span className="text-primary">
              {ABOUT.milestones.sectionTitle.replace("Our ", "")}
            </span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT.milestones.items.map((milestone, index) => (
              <div
                key={index}
                className={`${MILESTONE_COLORS[index % MILESTONE_COLORS.length]} rounded-3xl p-6 flex flex-col gap-2`}
              >
                <span className="text-primary font-bold text-lg">
                  {milestone.year}
                </span>
                <h3 className="font-semibold text-sm text-foreground">
                  {milestone.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Team ── */}
      <section className="px-6 py-16 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">
          Our{" "}
          <span className="text-foreground">
            {ABOUT.team.sectionTitle.replace("Our ", "")}
          </span>
        </h2>
        {ABOUT.team.items.map((member, index) => (
          <div key={index} className="flex flex-col items-center gap-3 mt-4">
            <p className="text-primary font-semibold">{member.role}</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {member.description}
            </p>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      {/* <section className="px-6 pb-20 text-center max-w-xl mx-auto flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">{ABOUT.cta.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {ABOUT.CTA.body}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <WhatsAppChatButton
            phoneNumber={WHATSAPP_TIPPER_PHONE}
            message={ABOUT.CTA.whatsappMessage}
            buttonText={ABOUT.CTA.whatsappButtonText}
            className="sm:w-auto"
          />
          <Button variant="outline" className="sm:w-auto">
            {ABOUT.CTA.secondaryButton}
          </Button>
        </div>
      </section> */}
      <section className=" relative pb-20 md:pt-10 w-fit px-4  pt-2 md:mb-20">
      <div className="mx-auto w-full  ">
        <div className="relative  rounded-3xl bg-primary-tint/60 px-6 pb-16 pt-12 text-center shadow-sm sm:px-10 sm:pb-64 md:px-14 md:pb-72 md:pt-14 overflow-visible">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {ABOUT.CTA.title}
            <span className="font-semibold text-foreground">
              {ABOUT.CTA.TitleSpan}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-foreground/80 sm:text-lg">
            {ABOUT.CTA.body}{" "}
            <span className="font-semibold text-foreground">
              {ABOUT.CTA.TitleLineBreak}
            </span>
          </p>

          <WhatsAppChatButton
            phoneNumber={WHATSAPP_TIPPER_PHONE}
            message={ABOUT.CTA.whatsappMessage}
            buttonText={ABOUT.CTA.whatsappButtonText}
            className=" py-2 md:w-auto"
          />
        </div>

        {/* Mascots / Illustration */}
         <div className="  pointer-events-none absolute inset-x-0  -bottom-20 flex justify-center ">
          <div className=" w-full h-fit">
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
    </section> 
    </div>
  );
}
