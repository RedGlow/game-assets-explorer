import type { Metadata } from "next";
import "./globals.css";

import { CustomFlowbiteTheme, Flowbite } from "flowbite-react";
import { Inter } from "next/font/google";

import { NavigationBar } from "./NavigationBar";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Game Assets",
  description: "Search for game assets",
};

const customTheme: CustomFlowbiteTheme = {
  navbar: {
    root: {
      base: "bg-primary-lighter px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 mt-4 mb-4",
      inner: {
        base: "mx-auto flex flex-wrap items-center justify-between w-full",
      },
    },
    link: {
      active: {
        on: "bg-tertiary text-white dark:text-white md:bg-transparent md:text-tertiary",
      },
    },
  },
  button: {
    color: {
      info: "text-tertiary-darker hover:text-tertiary-lighter bg-primary-dark border border-transparent enabled:hover:bg-primary-darker focus:ring-4 focus:ring-primary-light dark:bg-primary-dark dark:enabled:hover:bg-primary-lighter dark:focus:ring-primary-darker",
      gray: "text-tertiary-darker bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-tertiary-dark :ring-cyan-700 focus:text-cyan-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 focus:ring-2",
    },
  },
  dropdown: {
    floating: {
      item: {
        base: "flex items-center justify-start py-2 px-4 text-sm text-tertiary cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
      },
    },
  },
  breadcrumb: {
    root: {
      base: "bg-primary-lighter py-2 px-4",
    },
    item: {
      href: {
        off: "flex items-center text-sm font-medium text-tertiary dark:text-gray-400",
        on: "flex items-center text-sm font-medium text-tertiary-darker hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
      },
    },
  },
  checkbox: {
    root: {
      color: {
        default:
          "focus:ring-tertiary dark:ring-offset-tertiary dark:focus:ring-tertiary text-tertiary",
      },
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <Flowbite theme={{ theme: customTheme }}>
      <html lang="en">
        <body className={`${inter.className} container mx-auto pt-8`}>
          <NavigationBar user={session?.user} />
          {children}
        </body>
      </html>
    </Flowbite>
  );
}
