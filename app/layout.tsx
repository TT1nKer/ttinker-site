import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ttinker.net"),
  title: "TT1nKer | Systems Software Portfolio",
  description: "Systems software projects by TT1nKer, with source code and implementation details across networking, compilers, hardware optimization, and simulation.",
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
    title: "TT1nKer | Systems Software Portfolio",
    description: "Systems software projects by TT1nKer, with source code and implementation details across networking, compilers, hardware optimization, and simulation.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/portfolio/social.png",
        width: 1200,
        height: 630,
        alt: "TT1nKer | Systems Software Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TT1nKer | Systems Software Portfolio",
    description: "Systems software projects by TT1nKer, with source code and implementation details across networking, compilers, hardware optimization, and simulation.",
    images: ["/portfolio/social.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
