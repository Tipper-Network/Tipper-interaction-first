"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground group-[.toaster]:border-primary/20 group-[.toaster]:shadow-lg",
          title:
            "group toast group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground",
          description: "group-[.toast]:text-primary-foreground/90",
          actionButton:
            "group-[.toast]:bg-primary-foreground group-[.toast]:text-primary",
          cancelButton:
            "group-[.toast]:bg-primary-foreground/10 group-[.toast]:text-primary-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
