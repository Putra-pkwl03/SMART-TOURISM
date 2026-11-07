import type { Metadata } from "next";
import { Suspense } from "react";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import SessionActivityMonitor from "@/app/components/auth/SessionActivityMonitor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat',
    display: 'swap',
});

export const metadata: Metadata = {
  title: "SmartMandala",
  description: "Smart system untuk manajemen desa wisata dan peringatan bencana",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/logo1.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <SessionActivityMonitor />
        </Suspense>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
