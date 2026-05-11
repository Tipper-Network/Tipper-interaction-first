import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";

const ExplanationPage = () => {
  // how and what we are doing.

  //// what is teh value for a business, group and a personal brand
  // wain btitsarraf hay il information ?

  const entityTypes = [
    {
      title: "Business",
      description: [
        "Create a space where customers become part of your story.",
        "Use Tipper to share updates, offer experiences, host events, and build a community around your work.",
        "If your business is more than transactions, this is where relationships grow.",
      ],
      mainClassName:
        "bg-tertiary-tint/40 bg-gradient-to-r text-tertiary-shade from-tertiary/5 via-tertiary/10 to-tertiary/5 border-l-4 border-l-tertiary",
      mascot: "/assets/mascots/Tipper_Mascots_Pax_Direction_Left.svg",
      mascotClassName: "w-16 h-16 sm:w-20 sm:h-20  -bottom-5 -right-5",
      prompt:
        "Do you run a place where people gather, buy, or experience something?",
    },
    {
      title: "Groups",
      description: [
        "Bring people together around a shared interest or mission.",
        "Use Tipper to organize activities, share knowledge, and grow your community.",
        "If people gather around what you care about, a group gives them a home.",
      ],
      mainClassName:
        "bg-primary-tint/40 bg-gradient-to-r text-primary-shade from-primary/5 via-primary/10 to-primary/5 border-l-4 border-l-primary",
      mascot: "/assets/mascots/Tipper_Mascots_Twig_Raising_Hands.svg",
      prompt: "Do people already organize around an interest you care about?",
    },
    {
      title: "Personal Brands & Creators",
      description: [
        "Create a space where your work and voice can be discovered.",
        "Use Tipper to share projects, connect with supporters, and grow your audience.",
        "If your work reflects who you are, this is where people follow the journey.",
      ],
      mainClassName:
        "bg-secondary-tint/40 bg-gradient-to-r text-secondary-shade from-secondary/5 via-secondary/10 to-secondary/5 border-l-4 border-l-secondary",
      mascot: "/assets/mascots/Tipper_Mascots_Rad_Pointing_Left.svg",
      prompt: "Is your work something people follow or support?",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl flex text-center justify-center items-center font-bold mb-2">
          What is
          <Image
            src="/assets/logos/Tipper_Logos_Primary_Ruby.svg"
            alt="Tipper Network"
            width={150}
            height={150}
            className="h-12 w-auto md:h-16"
          />
          ?
        </h1>
        <p className="text-muted-foreground text-lg">
          Build With Intention, move with Sovereignty and express with freedom.
        </p>
        <h2 className="text-2xl font-bold mb-2">
          “How do you want to show up on Tipper?”
        </h2>
      </div>

      <div className="space-y-4 w-full">
        {entityTypes.map((type, index) => (
          <Card
            key={index}
            className={cn(
              type.mainClassName,
              "rounded-xl shadow-md hover:shadow-lg transition-all duration-200 pr-10 relative overflow-hidden "
            )}
          >
            <CardContent className="p-6 ">
              <div className="flex items-center gap-6 w-full">
                <div className="flex-1">
                  <h3 className={cn("text-xl font-bold mb-3")}>{type.title}</h3>
                  <div className=" font-normal max-w-2xl">
                    {type.description.map((line, lineIndex) => (
                      <p
                        key={lineIndex}
                        className={cn("leading-relaxed", "opacity-90")}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{type.prompt}</p>
                </div>
                <div
                  className={cn(
                    "absolute -bottom-8 -right-5 z-10 pointer-events-none  ",
                    type.mascotClassName
                  )}
                >
                  <Image
                    src={type.mascot}
                    alt="mascot icon"
                    width={200}
                    height={200}
                    className="w-20 h-20 sm:w-24 sm:h-24"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExplanationPage;
