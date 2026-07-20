import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TT1nKer — Things I’m Making",
  description: "Hardware, systems, AI. Work in progress.",
  openGraph: {
    title: "TT1nKer — Things I’m Making",
    description: "Hardware, systems, AI. Work in progress.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TT1nKer — Things I’m Making",
    description: "Hardware, systems, AI. Work in progress.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
