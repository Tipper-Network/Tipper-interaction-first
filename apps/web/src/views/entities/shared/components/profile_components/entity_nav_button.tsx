import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { FRONTEND_URL } from "@/lib/constants/randoms";

export type EntityNavButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  leftIcon?: boolean;
  rightIcon?: boolean;
  mainIcon?: React.ReactNode;
  className?: string;
};

export function EntityNavButton({
  label,
  href,
  onClick,
  leftIcon,
  rightIcon,
  mainIcon,
  className,
}: EntityNavButtonProps) {
  const base = (
    <div
      className={cn(
        "w-full rounded-full  px-4 shadow-sm  font-semibold text-lg ring-1 ring-border bg-background flex items-center justify-evenly",
        className
      )}
    >
      <div>
        {leftIcon ? (
          <div className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      <div className="flex items-center  gap-2 min-w-0">
        {mainIcon ? <div className="shrink-0">{mainIcon}</div> : null}
        <div className="   truncate">{label}</div>
      </div>
      <div>
        {rightIcon ? (
          <div className="shrink-0 ">
            <ArrowRight className="h-4 w-4" />
          </div>
        ) : null}
      </div>
    </div>
  );
  const frontendUrl = FRONTEND_URL();
  if (href) {
    return (
      <Link href={`${frontendUrl}${href}`} className="block max-w-64 p-1">
        {base}
      </Link>
    );
  }

  return (
    <Button type="button" className=" text-left max-w-64 p-1" onClick={onClick}>
      {base}
    </Button>
  );
}
