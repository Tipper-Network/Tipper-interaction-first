import React from "react";
import Link from "next/link";

interface SubstackPost {
  title: string;
  canonical_url: string;
  post_date: string;
  subtitle: string;
}

const CARD_COLORS = [
  "bg-secondary-tint",
  "bg-primary-tint",
  "bg-tertiary-tint",
  "bg-tertiary-tint",
  "bg-secondary-tint",
  "bg-primary-tint",
];

async function fetchSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const res = await fetch(
      "https://psyferblock.substack.com/api/v1/posts?limit=6",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function SubstackRss() {
  const posts = await fetchSubstackPosts();

  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm py-12">
        Could not load posts. Check back soon.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
      {posts.map((post, index) => (
        <Link
          key={post.canonical_url}
          href={post.canonical_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CARD_COLORS[index % CARD_COLORS.length]} rounded-3xl p-6 flex flex-col justify-between gap-4 min-h-[200px] hover:opacity-90 transition-opacity`}
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm text-foreground leading-snug">
              {post.title}
            </h3>
            {post.subtitle && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {post.subtitle}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(post.post_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </Link>
      ))}
    </div>
  );
}
