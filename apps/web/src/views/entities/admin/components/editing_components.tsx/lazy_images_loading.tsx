import { cn } from "@/lib/utils/utils";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const isPresignedS3Url = (url: string) => {
  return url.startsWith("https://");
};
// Lazy-loaded image component that only loads when in viewport
export default function LazyGalleryImage({
  src,
  alt,
  slot,
  className,
}: {
  src: string | null;
  alt: string;
  slot: 1 | 2 | 3;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!src || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "50px" } // Start loading 50px before entering viewport
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  if (!src) return null;

  // Use regular img tag for presigned S3 URLs (Next.js Image can't optimize them)
  const useRegularImg = isPresignedS3Url(src);

  return (
    <div ref={imgRef} className={cn("relative", className)}>
      {!isInView ? (
        <div className="h-full w-full bg-muted animate-pulse" />
      ) : (
        <>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          {useRegularImg ? (
            <img
              src={src}
              alt={alt}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsLoaded(false);
              }}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={164}
              height={164}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsLoaded(false);
              }}
            />
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-xs text-muted-foreground">
              Failed to load
            </div>
          )}
        </>
      )}
    </div>
  );
}
