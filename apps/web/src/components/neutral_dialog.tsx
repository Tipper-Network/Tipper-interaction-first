import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/utils";
import { X } from "lucide-react";
import { Button } from "./ui/button";

type DialogProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // closeButton?: boolean;
  maxHeight?: string;
  childrenClassName?: string;
  width?: string;
  className?: string;
  closingButtonMessage?: string;
  titleClassName?: string;
};
export function NeutralDialog({
  title,
  description,
  children,
  open,
  onOpenChange,
  // closeButton = false,
  childrenClassName,
  maxHeight = "",
  className,
  closingButtonMessage,
  titleClassName,
}: DialogProps) {
  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "md:mx-2 w-full max-w-[90vw] max-h-[90vh] overflow-y-auto ",

            className
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className=" px-1 sm:px-4 py-4 border-b border-gray-100">
            <div className=" relative flex flex-col items-center justify-center  ">
              {/* {closeButton && (
                <DialogClose className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close dialog</span>
                </DialogClose>
              )} */}

              <DialogTitle
                className={cn(
                  "text-xl md:text-2xl font-semibold",
                  titleClassName || "text-gray-900"
                )}
              >
                {title && title}
              </DialogTitle>

              {description && (
                <DialogDescription className="mt-1 px-4 text-sm text-gray-500">
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
          <div className="relative ">
            {/* Scrollable content area */}
            <div
              className={cn(
                "px-4 sm:px-6 py-4",
                childrenClassName,
                maxHeight,
                "overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              )}
            >
              {children}
            </div>
            <div className="absolute bottom-4 right-4">
              {closingButtonMessage && (
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  {closingButtonMessage}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
