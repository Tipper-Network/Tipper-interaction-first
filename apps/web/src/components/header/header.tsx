"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AuthModal from "@/features/auth/components/auth_modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useAuthStore,
  UserRole__Enum,
} from "@/features/auth/stores/auth-store";
import {
  EntityAccessDropdown,
  MobileEntityAccess,
} from "@/components/entity/entity_access_dropdown";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const url = process.env.NEXT_PUBLIC_FRONTEND_ORIGIN;
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const pathname = usePathname();
  const isActive = (location: string) => {
    if (location === "/") {
      return pathname === location;
    }
    return pathname.startsWith(location);
  };
  console.log(user?.user_role);
  return (
    <header className="  rounded-xl  px-2 sm:px-6 lg:px-8 bg-background border-b border-border top-0 z-50 relative">
      <div className="   flex justify-between items-center h-16 lg:h-20">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/assets/logos/Tipper_Logos_Primary_Ruby.svg"
            alt="Tipper Network"
            width={150}
            height={150}
            className="h-12 w-auto md:h-16"
          />
        </Link>

        {/* Desktop Navigation Section */}
        <nav className="hidden md:flex items-center space-x-8 p-medium-16">
          <Link
            href="/"
            className={cn(
              " transition-colors",
              isActive("/")
                ? "text-primary"
                : "text-foreground hover:text-primary"
            )}
          >
            Home
          </Link>
          {/* <Link
            href="/explore"
            className={cn(
              " transition-colors",
              isActive("/explore")
                ? "text-primary"
                : "text-foreground hover:text-primary"
            )}
          >
            Explore
          </Link> */}
          {user?.user_role === UserRole__Enum.ADMIN && (
            <Link
              href={`${url}/admin`}
              className={cn(
                " transition-colors",
                isActive(`/admin`)
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              Admin Panel
            </Link>
          )}

          {user && <EntityAccessDropdown />}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <AuthModal
            title="Sign In/Up"
            className="md:bg-primary  text-md text-primary-foreground px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-primary/90 transition-colors  md:text-base font-medium"
          />

          {/* Mobile Menu Sheet */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger className="md:hidden">
              <div className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Image
                  src="/icons/menu2.svg"
                  width={24}
                  alt="menu"
                  height={24}
                  className="cursor-pointer"
                />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-6 mt-6">
                {/* Navigation Links */}
                <nav className="flex flex-col space-y-4">
                  {/* <Link
                    href="/explore"
                    className="p-medium-16 text-foreground hover:text-primary transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    Explore
                  </Link> */}

                  <Separator orientation="horizontal" className="my-2" />
                  {user?.user_role === UserRole__Enum.ADMIN && (
                    <Link
                      href={`${url}/admin`}
                      className="p-medium-16 text-foreground hover:text-primary transition-colors py-2"
                      onClick={closeMobileMenu}
                    >
                      Admin Panel
                    </Link>
                  )}
                </nav>

                {/* Mobile Entity Access */}
                {user && (
                  <div className="pt-4 border-t border-border">
                    <MobileEntityAccess onNavigate={closeMobileMenu} />
                  </div>
                )}
                <Separator orientation="horizontal" className=" border-2" />

                <Link
                  href="/about-us"
                  className="p-medium-16 text-foreground hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  About Us
                </Link>
                <Link
                  href="/how-it-works"
                  className="p-medium-16 text-foreground hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  How It Works
                </Link>
                <Link
                  href="/contact-us"
                  className="p-medium-16 text-foreground hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Contact Us
                </Link>
                {/* Logo Section */}
                <div className="pt-4 border-t border-border">
                  <Image
                    src="/assets/logos/Tipper_Logos_Primary_Ruby.svg"
                    height={100}
                    width={150}
                    alt="logo"
                    className="mx-auto"
                  />
                </div>

                {/* Auth Section */}
                <div className="pt-4 border-t border-border">
                  <div className="flex flex-col space-y-3">
                    <AuthModal
                      title="Sign in/up"
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors p-medium-16"
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
