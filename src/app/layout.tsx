import type { Metadata } from "next";
import './globals.css';

import {
    CustomFlowbiteTheme, Flowbite, Navbar, NavbarCollapse, NavbarLink, NavbarToggle
} from 'flowbite-react';
import { Inter } from 'next/font/google';

import { LayoutProps } from '../../.next/types/app/layout';
import { NavigationBar } from './NavigationBar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Game Assets",
  description: "Search for game assets",
};

const customTheme: CustomFlowbiteTheme = {
  navbar: {
    root: {
      base: "bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 flex",
    },
  },
};

export default function RootLayout({ children, params }: LayoutProps) {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <html lang="en">
        <body className={`${inter.className} container mx-auto pt-8`}>
          <NavigationBar />
          {children}
        </body>
      </html>
    </Flowbite>
  );
}
