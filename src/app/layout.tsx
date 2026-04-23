
import { BootstrapClient } from "@/components/BootstrapClient";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/style.scss";
import "@/styles/globals.css";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
export const metadata: Metadata = {
  title: {
    default: "Rocket AI",
    template: "%s | Rocket AI",
  },
  description: "Rocket AI",
  icons: {
    apple: `${baseUrl}/images/favicon_io/apple-touch-icon.png`,
    icon: [
      {
        url: `${baseUrl}/images/favicon_io/favicon-32x32.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `${baseUrl}/images/favicon_io/favicon-16x16.png`,
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
  manifest: `${baseUrl}/images/favicon_io/site.webmanifest`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}
