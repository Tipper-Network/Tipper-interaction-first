import React from "react";
import BlogComponent from "./BlogComponent";
import { RESOURCES } from "@/content/pages/tipper_standards/resources";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{RESOURCES.title}</h1>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        {RESOURCES.intro}
      </p>
      <BlogComponent blogPosts={RESOURCES.posts} />
    </div>
  );
}
