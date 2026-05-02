import EntitySideBar from "@/components/entity/entity_sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { fetchEntityDetails } from "@/features/entities/shared/api/entities_api";
import EntityOnboardingRedirect from "@/features/entities/shared/components/onboarding/entity_onboarding_redirect";
import { getSessionUser } from "@/features/auth/api/auth_api";
import { UserRole__Enum } from "@/features/auth/stores/auth-store";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard - Tipper",
  description: "Admin panel for managing communities and entities",
};

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export default async function EntityLayout({ params, children }: Props) {
  const paramsData = await params;
  const entityId = paramsData.id;

  const entity = await fetchEntityDetails(entityId);
  console.log("entityId", entityId);

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-14 md:h-16 shrink-0 items-center justify-between gap-2 border-b px-3 md:px-4">
          <div className="flex items-center gap-2">
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
            {entity?.name || "Entity Management"}
          </h1>
          {entityId && <SidebarTrigger className="-ml-1" />}
          {/* {entityId && (
              <Separator orientation="vertical" className="mr-2 h-4" />
            )} */}
        </header>
        <Separator />
        <div className="flex flex-1 flex-col gap-3 md:gap-4 p-3 md:p-4">
          <QueryProvider>
            {/* {entityId && <EntityOnboardingRedirect entityId={entityId} />} */}
            {children}
          </QueryProvider>
        </div>
      </SidebarInset>
      {entityId && <EntitySideBar entityId={entityId} />}
    </SidebarProvider>
  );
}
