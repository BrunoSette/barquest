import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";
import { GoogleTagManager } from "@next/third-parties/google";

import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "BarQuest - Your Ultimate Prep Tool",
  description: "Your Ultimate Prep Tool for the Ontario Bar Exam",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <GoogleTagManager gtmId="GTM-53LR5KCC" />
        <SpeedInsights />
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
