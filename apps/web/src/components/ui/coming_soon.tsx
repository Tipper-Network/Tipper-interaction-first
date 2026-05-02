"use client";

import React from "react";
import Image from "next/image";

interface ComingSoonProps {
  className?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ className = "w-full" }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl ${className}`}
      style={{
        backgroundColor:
          "color-mix(in srgb, hsl(var(--primary-shade)) 10%, white 90%)",
      }}
    >
      {/* Text Content */}
      <div className="text-center mb-2 text-primary-shade">
        <p className="text-sm ">Exciting new features are ready to take off!</p>
        <h2 className="text-lg font-bold ">Stay Tuned!</h2>
      </div>

      {/* Mascots Image */}
      <div className="flex justify-center px-4 ">
        <Image
          src="/assets/mascots/Group-landing.png"
          alt="Exciting features coming soon"
          width={1000}
          height={420}
          className="h-auto w-[min(1100px,92vw)] select-none object-cover"
        />
      </div>
    </div>
  );
};

export default ComingSoon;
