import React from "react";

const TopWaveComponent = () => {
  return (
    <div
      className="absolute left-0 top-0 h-24 w-full sm:h-32"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,60 C300,20 600,100 900,50 C1050,25 1150,75 1200,50 L1200,0 L0,0 Z' fill='white'/%3E%3C/svg%3E")`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

const BottomWaveComponent = () => {
  return (
    <div
      className="absolute left-0 bottom-0 h-24 w-full sm:h-32"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,60 C300,100 600,20 900,70 C1050,95 1150,45 1200,70 L1200,120 L0,120 Z' fill='white'/%3E%3C/svg%3E")`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

export { TopWaveComponent, BottomWaveComponent };
