import React from "react";
import { NavigationGuardProvider } from "next-navigation-guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="">
      <NavigationGuardProvider>{children}</NavigationGuardProvider>
    </main>
  );
}
