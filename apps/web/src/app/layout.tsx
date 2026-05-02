import "../styles/global.css";
import { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import QueryProvider from "@/lib/providers/QueryProvider";
// import { RedirectHandler } from "@/features/auth/components/auth_redirect_handler";

export const metadata: Metadata = {
  metadataBase: new URL("https://tippernetwork.com"),
  title: "Tipper Network",
  description: "A Network of communities with entities at their core",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  twitter: {
    card: "summary_large_image",
    title: "Tipper Network",
    description: "A Network of communities with entities at their core",
    images: ["/assets/logos/Tipper_Logos_Alternate_Ruby.svg"],
  },
  openGraph: {
    title: "Tipper Network",
    description: "A Network of communities with entities at their core",
    images: ["/assets/logos/Tipper_Logos_Alternate_Ruby.svg"],
  },
};

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "fallback",
  variable: "--font-work-sans",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={workSans.className}>
        {/* <RedirectHandler /> */}
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
