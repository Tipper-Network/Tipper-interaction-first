import React from "react";
import ExplanationPage from "./explanation_page";
import ExploreTabs from "@/views/explore/explore_tabs";

export default function Page() {
  return (
    <>
      {" "}
      <div className="w-full">
        <div className="container flex flex-col w-full justify-center items-center">
          <ExploreTabs />
        </div>
      </div>{" "}
    </>
  );
}
