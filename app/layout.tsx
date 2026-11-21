import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ttinker.net"),
  title: "TT1nKer · 个人项目与随记",
  description: "TT1nKer 的个人主页。浏览程序、网络与计算实验，阅读留白博客。",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon-tt-question-v1.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-tt-question-v1.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-tt-question-v1.png",
    apple: [{ url: "/apple-touch-tt-question-v1.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "TT1nKer · 个人项目与随记",
    description: "TT1nKer 的个人主页。浏览程序、网络与计算实验，阅读留白博客。",
    type: "website",
    url: "/",
    images: [
      {
        url: "/home-atlas/social.png",
        width: 1200,
        height: 630,
        alt: "TT1nKer · 个人项目与随记",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TT1nKer · 个人项目与随记",
    description: "TT1nKer 的个人主页。浏览程序、网络与计算实验，阅读留白博客。",
    images: ["/home-atlas/social.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
