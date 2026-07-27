import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ttinker.net"),
  title: "TT1nKer",
  description: "System engineer / system artist.",
  icons: {
    icon: [
      { url: "/favicon-tt-question-v1.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-tt-question-v1.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-tt-question-v1.png",
    apple: [{ url: "/apple-touch-tt-question-v1.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "TT1nKer",
    description: "System engineer / system artist.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og-editorial-v2.png",
        width: 1731,
        height: 909,
        alt: "TT1nKer — question-driven systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TT1nKer",
    description: "System engineer / system artist.",
    images: ["/og-editorial-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
