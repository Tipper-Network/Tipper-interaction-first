import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-2xl mx-auto pt-8 space-y-6">
      <Skeleton className="h-9 w-1/3" />
      <Skeleton className="h-5 w-full" />
      <div className="grid grid-cols-1 gap-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
