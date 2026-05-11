import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/header/header";
import AuthModal from "@/features/auth/components/auth_modal";

export default function Loop3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 xl:px-20 sm:px-12 px-4">
        {children}
      </main>
      <AuthModal title="Sign in" />
      <Toaster />
    </div>
  );
}
