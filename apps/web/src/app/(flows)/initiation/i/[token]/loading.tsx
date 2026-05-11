import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-md mx-auto pt-8 space-y-6">
      <Skeleton className="h-32 w-32 rounded-full mx-auto" />
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mx-auto" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
