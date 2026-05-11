"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

export default function BlogComponent({ blogPosts }: BlogComponentProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogPosts.map((post, index) => (
        <Card key={index} className="p-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-primary font-medium">
                {post.category}
              </span>
              <span className="text-sm text-gray-500">{post.readTime}</span>
            </div>
            <CardTitle className="text-lg">{post.title}</CardTitle>
          </CardHeader>
          <Separator className="" />
          <CardContent>
            <div className="flex flex-col items-center justify-between">
              <p className="mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-end w-full text-sm gap-2 text-gray-500 mb-4">
                <span className="text-gray-700  font-medium">
                  By {post.author}
                </span>
                <span className="">{post.date}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href={post.link} className="w-full text-primary">
              Read More
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
