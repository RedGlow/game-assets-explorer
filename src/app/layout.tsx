import type { Metadata } from "next";
import './globals.css';

import { CustomFlowbiteTheme } from 'flowbite-react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Game Assets",
  description: "Search for game assets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} container mx-auto pt-8`}>{children}</body>
    </html>
  );
}
