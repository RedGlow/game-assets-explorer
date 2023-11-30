"use client";

import { Navbar } from 'flowbite-react';
import { usePathname } from 'next/navigation';

enum Area {
  Contents,
  Search,
}

export function NavigationBar() {
  const pathname = usePathname();
  const area = pathname.startsWith("/contents") ? Area.Contents : Area.Search;
  return (
    <Navbar fluid rounded className="h-16">
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/contents" active={area == Area.Contents}>
          Navigate
        </Navbar.Link>
        <Navbar.Link href="/search" active={area == Area.Search}>
          Search
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
