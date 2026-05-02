import { Skeleton } from "./skeleton";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  /**
   * Variant of loading display
   * - "spinner": Simple spinner with text
   * - "skeleton": Full page skeleton layout
   * - "minimal": Minimal centered loading
   */
  variant?: "spinner" | "skeleton" | "minimal";
  /**
   * Optional loading message
   */
  message?: string;
  /**
   * Whether to show full page layout
   */
  fullPage?: boolean;
}

/**
 * Standard loading component for the entire app
 * Can be used as a loading.tsx file or as a component
 */
export function Loading({
  variant = "spinner",
  message,
  fullPage = true,
}: LoadingProps) {
  const content = (() => {
    switch (variant) {
      case "minimal":
        return (
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        );

      case "skeleton":
        return (
          <div className="w-full space-y-6 p-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Additional content */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        );

      case "spinner":
      default:
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                {message || "Loading..."}
              </p>
              <p className="text-xs text-muted-foreground">
                Please wait a moment
              </p>
            </div>
          </div>
        );
    }
  })();

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-4xl mx-auto px-4">{content}</div>
      </div>
    );
  }

  return <div className="w-full">{content}</div>;
}

/**
 * Default loading component for Next.js loading.tsx files
 * This is the standard loading page used app-wide
 */
export default function DefaultLoading() {
  return <Loading variant="spinner" fullPage={true} />;
}
