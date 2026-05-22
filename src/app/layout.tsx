import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProfileProvider } from "@/contexts/ProfileContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Git4Data | Master Version Control",
  description: "Legendary Git learning path for Data Analysts and Data Scientists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
