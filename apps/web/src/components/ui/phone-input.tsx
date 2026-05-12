"use client";

import * as React from "react";
import {
  PhoneInput as BasePhoneInput,
  type PhoneInputProps as BasePhoneInputProps,
  type ParsedCountry,
} from "react-international-phone";
import "react-international-phone/style.css";

import { cn } from "@/lib/utils/utils";

export interface PhoneInputProps extends Omit<
  BasePhoneInputProps,
  "value" | "onChange"
> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  defaultCountry?: string;
}

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof BasePhoneInput>,
  PhoneInputProps
>(({ className, value, onChange, defaultCountry = "us", ...props }, ref) => {
  const handleChange = (
    phone: string,
    meta: { country: ParsedCountry; inputValue: string }
  ) => {
    // The library already returns phone in E.164 format
    // Just pass it through to our onChange handler
    onChange?.(phone);
  };

  return (
    <BasePhoneInput
      ref={ref}
      value={value || ""}
      onChange={handleChange}
      defaultCountry={defaultCountry}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      inputClassName={cn(
        "flex-1 bg-transparent outline-none border-none focus:outline-none focus:ring-0",
        "placeholder:text-muted-foreground"
      )}
      countrySelectorStyleProps={{
        buttonClassName: cn(
          "border-0 bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0",
          "data-[state=open]:bg-transparent"
        ),
      }}
      {...props}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
