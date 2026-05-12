"use client";

import React from "react";
import Link from "next/link";

interface BlogPost {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  link: string;
}

interface BlogComponentProps {
  blogPosts: BlogPost[];
}

const CARD_COLORS = [
  "bg-secondary-tint",
  "bg-primary-tint",
  "bg-tertiary-tint",
  "bg-tertiary-tint",
  "bg-secondary-tint",
  "bg-primary-tint",
];

export default function BlogComponent({ blogPosts }: BlogComponentProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
      {blogPosts.map((post, index) => (
        <Link
          key={index}
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CARD_COLORS[index % CARD_COLORS.length]} rounded-3xl p-6 flex flex-col justify-between gap-4 min-h-[200px] hover:opacity-90 transition-opacity`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                {post.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {post.readTime}
              </span>
            </div>
            <h3 className="font-semibold text-sm text-foreground leading-snug">
              {post.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">
              {post.author}
            </span>
            <span>{post.date}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
