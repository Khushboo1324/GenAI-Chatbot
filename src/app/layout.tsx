import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro, Spline_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vivid Joy Chatbot",
  description: "Energetic and Optimistic AI Mentorship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${beVietnam.variable} ${splineSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-be-vietnam bg-surface">{children}</body>
    </html>
  );
}
