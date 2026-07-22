import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TT1nKer",
  description: "Hardware, systems, AI.",
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
    description: "Hardware, systems, AI.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TT1nKer",
    description: "Hardware, systems, AI.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
