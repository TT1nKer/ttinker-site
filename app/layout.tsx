import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TT1nKer — Things I’m Making",
  description: "A computer engineering student learning in public through vibe-coded tools, half-finished experiments, hardware side quests, and too many repositories.",
  openGraph: {
    title: "TT1nKer — Things I’m Making",
    description: "Vibe-coded tools, half-finished experiments, and hardware side quests.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TT1nKer — Things I’m Making",
    description: "Vibe-coded tools, half-finished experiments, and hardware side quests.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
