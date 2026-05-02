import AdminSideBar from "@/components/admin/admin_sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Admin Dashboard - Tipper",
  description: "Admin panel for managing communities and entities",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSideBar />
      <SidebarInset>
        <header className="flex h-14 md:h-16 shrink-0 items-center justify-between gap-2 border-b px-3 md:px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div>
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity "
              >
                <Image
                  src="/assets/logos/Tipper_Logos_Primary_Ruby.svg"
                  alt="Tipper Network"
                  width={150}
                  height={150}
                  className="h-12 "
                />
              </Link>
            </div>
          </div>
          <h1 className="text-base md:text-lg font-semibold">
            Admin Dashboard
          </h1>
        </header>
        <Separator />
        <div className="flex flex-1 flex-col gap-3 md:gap-4 p-3 md:p-4">
          <QueryProvider>{children}</QueryProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
