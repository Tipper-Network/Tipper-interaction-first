import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";

const tooltipWrapperVariants = cva("inline-block", {
  variants: {
    variant: {
      informative: "cursor-default",
      clickable: "cursor-pointer hover:opacity-80",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50 ",
      false: "",
    },
  },
  defaultVariants: {
    variant: "informative",
    disabled: false,
  },
});

export interface ToolTipWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipWrapperVariants> {
  tooltipTitle: string;
  children: React.ReactNode;
  notSignedInMessage?: string;
}

const ToolTipWrapper = React.forwardRef<HTMLDivElement, ToolTipWrapperProps>(
  (
    {
      className,
      variant,
      disabled,
      tooltipTitle,
      children,
      notSignedInMessage,
      ...props
    },
    ref
  ) => {
    return (
      <TooltipProvider>
        {!disabled ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                ref={ref}
                className={cn(
                  tooltipWrapperVariants({ variant, disabled, className })
                )}
                {...props}
              >
                {children}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="bg-primary-tint p-2 text-primary-shade rounded-lg px-2">
                {tooltipTitle}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                ref={ref}
                className={cn(
                  tooltipWrapperVariants({ variant, disabled, className })
                )}
                {...props}
              >
                {children}
              </div>
            </TooltipTrigger>
            {notSignedInMessage && (
              <TooltipContent>
                <p className="bg-primary-tint p-1 rounded-lg px-2 ">
                  {notSignedInMessage}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
      </TooltipProvider>
    );
  }
);

ToolTipWrapper.displayName = "ToolTipWrapper";

export { ToolTipWrapper };
