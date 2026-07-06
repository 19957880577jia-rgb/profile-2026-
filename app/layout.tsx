import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Profile 2026",
  description: "Interactive portfolio built with Next.js, Tailwind CSS, and GSAP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
