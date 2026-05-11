import { Suspense } from "react";
import SpaceLandingClient from "./space_landing_client";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SpacePage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<SpaceSkeleton />}>
      <SpaceLandingClient slug={slug} />
    </Suspense>
  );
}

function SpaceSkeleton() {
  return (
    <div className="max-w-lg mx-auto pt-12 px-4 space-y-6">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-5/6" />
      <div className="space-y-3 pt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
