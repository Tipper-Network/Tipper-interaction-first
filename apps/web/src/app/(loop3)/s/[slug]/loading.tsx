import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-md mx-auto pt-16 space-y-6 text-center">
      <Skeleton className="h-20 w-20 rounded-full mx-auto" />
      <Skeleton className="h-7 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-2/3 mx-auto" />
    </div>
  );
}
