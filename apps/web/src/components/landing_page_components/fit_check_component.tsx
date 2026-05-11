import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import { Button } from "../ui/button";
import {
  TopWaveComponent,
  BottomWaveComponent,
} from "./sub_sections/top_bottom_wave_components";

const FitCheckComponent = () => {
  const handleClick = () => {
    console.log("clicked");
  };
  const infoObject = [
    {
      title: "Initiators?",
      description:
        "I Treat Participation As Practice. I Claim My Spot Responsibly, Show Up Fully, Grow Consistently, And Share The Journey Honestly.",
      image: "/assets/mascots/Tipper_Mascots_Rad_Pointing_Left.svg",

      className: "bg-secondary-tint  text-primary p-6 shadow-sm sm:p-8",
      titleClassName: " text-secondary-shade   ",
      imageClassName: " absolute bottom-0 right-0",
      descriptionClassName: "text-secondary-shade font-medium",
    },
    {
      title: "Pioneers?",
      description:
        "I Don't Wait For Culture To Change. I Adopt Structure Early, Test Boundaries, Give Feedback, And Raise The Standard For Everyone After Me.",
      image: "/assets/mascots/Tipper_Mascots_Twig.svg",
      className: "bg-primary-tint  p-6 shadow-sm sm:p-8 ",
      titleClassName: " text-primary-shade  ",
      imageClassName: " absolute bottom-0 right-[50%] translate-x-1/2 ",
      descriptionClassName: "text-primary-shade font-medium",
    },
    {
      title: "Innovators?",
      description:
        "I Design Systems That Reward Commitment, Build With Culture, And Turn The Community Into Measurable Growth.",
      image: "/assets/mascots/Tipper_Mascots_Pax_Direction_Right.svg",
      className: "bg-tertiary-tint tp-6 shadow-sm sm:p-8",
      titleClassName: "text-tertiary-shade",
      imageClassName: " absolute bottom-0 left-0",
      descriptionClassName: "text-tertiary-shade font-medium",
    },
  ];
  return (
    <section className="relative  bg-primary-tint/50 overflow-hidden  px-4 py-16 sm:px-6 sm:py-20">
        <TopWaveComponent />
      <div className="relative mx-auto ">
        {/* Title Section */}
        
        <div className="mb-4  mt-4 text-center sm:mb-12">
          <h1 className="mb-2 text-center flex md:flex-row flex-col items-center justify-center text-4xl font-bold  text-foreground sm:text-5xl md:text-6xl">
            <div className="  md:-mt-10 ">
              <Image
                src="/assets/logos/Tipper_Logos_Primary_Ruby.svg"
                alt=""
                width={300}
                height={300}
                className=""
              />
            </div>
            Fit Check
          </h1>
          <p className="text-lg font-medium text-foreground   md:text-xl">
            You&apos;re Not Who We&apos;re Looking For{" "}
            <span className="text-tertiary  text-2xl block">Unless...</span>
          </p>
        </div>

        {/* Three Boxes Section */}
        <div className="flex flex-col md:flex-row md:gap-6 justify-center   items-center  ">
          {infoObject.map((item) => {
            return (
              <div key={item.title} className=" mb-12 sm:gap-4 max-w-72  h-fit">
                <div
                  className={cn(
                    "relative rounded-3xl   p-6 shadow-sm sm:p-8 h-full ",
                    item.className
                  )}
                >
                  <h3
                    className={cn(
                      "mb-4 text-xl font-bold sm:text-2xl",
                      item.titleClassName
                    )}
                  >
                    {item.title}{" "}
                  </h3>
                  <p
                    className={cn(
                      "mb-6 text-sm leading-relaxed  sm:text-base",
                      item.descriptionClassName
                    )}
                  >
                    {item.description}
                  </p>
                  <div className="h-10 "></div>

                  <div
                    className={cn("flex justify-center", item.imageClassName)}
                  >
                    <Image
                      src={item.image}
                      alt={`${item.title} mascot`}
                      width={60}
                      height={60}
                      className="h-20 w-20 sm:h-24 sm:w-24"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        {/* <div className="text-center">
          <p className="mb-4 text-lg font-medium text-foreground sm:text-xl md:text-2xl">
            If You Are Not!!
          </p>
     
        </div> */}
      </div>
      <BottomWaveComponent />
    </section>
  );
};

export default FitCheckComponent;
