import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";

export default function InitiationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-center pt-8 pb-4 px-4">
        <Image
          src="/assets/logos/Tipper_Logos_Alternate_Ruby.svg"
          alt="Tipper"
          width={120}
          height={40}
          priority
        />
      </header>

      <main className="flex-1 flex flex-col items-center px-4">
        {children}
      </main>

      <Toaster />
    </div>
  );
}
