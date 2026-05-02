"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AuthWizard from "./auth_wizard";
import { logout } from "../api/auth_api";
import { useAuthStore } from "../stores/auth-store";

type Variant = "landing_page" | "header";

export default function AuthModal({
  title,
  className,
  variant = "header",
}: {
  title: string;
  className?: string;
  variant?: Variant;
}) {
  const { user, profile } = useAuthStore();

  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    window.location.reload();
  };

  const dropDownLinks = [
    {
      title: "Profile",
      link: "/users/profile",
    },
    {
      title: "Settings",
      link: "/users/settings",
    },
  ];

  const returnUrl = usePathname() || "/";
  return (
    <>
      {!isLoggedIn ? (
        <Button
          variant="ghost"
          onClick={() => setAuthModalOpen(true)}
          className={className}
        >
          {variant === "landing_page" && (
            <Sparkles className="mr-3 h-6 w-6 md:h-10 md:w-10" />
          )}
          {title}
          {variant === "landing_page" && (
            <ArrowRight className="ml-3 h-6 w-6 md:h-10 md:w-10" />
          )}
        </Button>
      ) : (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-dark/60 font-bold text-primary text-2xl">
                  {profile?.first_name?.charAt(0).toUpperCase() ||
                    "/assets/Icons/Tipper_Icons_People_Transparent"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 space-x-3 shadow-sm border border-dark/20 bg-white rounded-md z-[100]"
            align="end"
          >
            <DropdownMenuLabel className="font-normal capitalize ">
              <div className="flex flex-col space-y-1 p-3 mt-1 space-x-2">
                <p className="text-md font-medium leading-none">
                  {(profile?.first_name || "U") + " " + profile?.last_name ||
                    "L"}
                </p>
                <p className="text-xs leading-none text-muted-foreground py-1">
                  {user.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground py-1">
                  {/* reputation:{profile?.reputation}   */}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            {dropDownLinks.map((item) => (
              <div key={item.title} className="m-2">
                <DropdownMenuItem
                  onSelect={() => {
                    setDropdownOpen(false);
                    router.push(`${item.link}`);
                  }}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground  border-b p-1 rounded-md border-l "
                >
                  {item.title}
                </DropdownMenuItem>
              </div>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() => {
                handleLogout();
              }}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-1"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {isAuthModalOpen && !isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl p-8 w-full max-w-md relative shadow-lg">
            <Button
              onClick={() => setAuthModalOpen(false)}
              variant="ghost"
              className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-10 w-10 text-muted-foreground" />
            </Button>

            <AuthWizard
              onSuccess={() => {
                setAuthModalOpen(false);
                router.refresh();
              }}
              returnUrl={returnUrl}
            />
          </div>
        </div>
      )}
    </>
  );
}
