import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/db/queries";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

import { SpeedInsights } from "@vercel/speed-insights/next";

// const user = await getUser();
// console.log("User Name:", user?.name);
// console.log("User email:", user?.email);
// console.log("user", user);

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
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-53LR5KCC');
            `,
          }}
        />
        <Script
          id="livesession-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window['__ls_namespace'] = '__ls';
              window['__ls_script_url'] = 'https://cdn.livesession.io/track.js';
              !function(w, d, t, u, n) {
                if (n in w) {if(w.console && w.console.log) { w.console.log('LiveSession namespace conflict. Please set window["__ls_namespace"].');} return;}
                if (w[n]) return; var f = w[n] = function() { f.push ? f.push.apply(f, arguments) : f.store.push(arguments)};
                if (!w[n]) w[n] = f; f.store = []; f.v = "1.1";
                var ls = d.createElement(t); ls.async = true; ls.src = u;
                var s = d.getElementsByTagName(t)[0]; s.parentNode.insertBefore(ls, s);
              }(window, document, 'script', window['__ls_script_url'], window['__ls_namespace']);
              __ls("init", "5d0a0836.cccb0f37", { keystrokes: false });
              __ls("newPageView");
              __ls("identify", { 
                name: "Bruno Fixed", 
                email: "brunosette@gmail.com", 
              });
            `,
          }}
        />
      </head>
      <body className="min-h-[100dvh] bg-gray-50">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-53LR5KCC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <GoogleTagManager gtmId="GTM-53LR5KCC" />
        <SpeedInsights />
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
