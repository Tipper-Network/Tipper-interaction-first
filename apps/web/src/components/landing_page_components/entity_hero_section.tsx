import React from "react";
import CreateCommunityButton from "@/views/communities/components/create_community_modal/create_community_button";
import InitiateJourneyButton from "@/components/initiation_structures/initiate_journey_button";
import ShareContainer from "./sub_sections/share_container";
import Image from "next/image";
import AnimatedActionButtons from "../initiation_structures/animated_action_buttons";

const EntityHeroSection = () => {
  return (
    <section className="w-full bg-white text-foreground rounded-2xl py-6 md:py-8">
      <div className=" mx-auto flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-6xl font-bold tracking-tight leading-tight">
          Forget the likes.
          <br />
          Focus on <span className="text-primary">Your </span> work
        </h1>

        {/* Collage placeholder (swap with real assets as needed) */}
        <div className="relative w-full  ">
          <Image
            src="/hero_images.png"
            alt="Tipper landing"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>

        <div className=" flex flex-col items-center md:gap-2">
          <div className="flex flex-col md:flex-row items-center   font-bold md:gap-2 text-foreground   text-xl md:text-4xl pb-4">
            <div className="flex flex-row items-center  font-semibold">
              <div className=" w-20 md:w-36 lg:w-48 md:-mt-4 lg:-mt-6 ">
                <Image
                  src="/assets/logos/Tipper_Logos_Primary_Ruby.svg"
                  alt="Tipper"
                  width={500}
                  height={500}
                  className=""
                />
              </div>
            </div>
            <span className=" font-normal block  ">
              Lets <span className="font-semibold">your Community</span> do all
              the heavy lifting.
            </span>
          </div>

          {/* <div className="flex flex-col sm:flex-row items-center gap-3">
            <InitiateJourneyButton />
            {/* <CreateCommunityButton /> 
          </div> */}
        </div>
        {/* <div className="mt-10 lg:hidden">
          <ShareContainer />
        </div> */}
      </div>
    </section>
  );
};

export default EntityHeroSection;
