"use client";
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { HiUserCircle } from 'react-icons/hi';

enum Area {
  Contents,
  Search,
}

export interface INavigationBarProps {
  user: User | undefined;
}

export function NavigationBar({ user }: INavigationBarProps) {
  const pathname = usePathname();
  const area = pathname.startsWith("/contents") ? Area.Contents : Area.Search;

  const getUserCircle = useCallback(
    () => <HiUserCircle className="w-10 h-10" />,
    []
  );

  return (
    <Navbar fluid rounded>
      <div className="flex md:order-1">
        {!user && (
          <Button href="/api/auth/signin" className="mr-2">
            Sign in
          </Button>
        )}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt={user?.name || ""}
              img={user?.image || getUserCircle}
              rounded
            />
          }
        >
          {user && (
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
          )}
          {user && (
            <Dropdown.Item href="/api/auth/signout">Sign out</Dropdown.Item>
          )}
          {!user && (
            <Dropdown.Item href="/api/auth/signin">Sign in</Dropdown.Item>
          )}
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          href={user ? "/contents" : "#"}
          active={user && area == Area.Contents}
          disabled={!user}
        >
          Navigate
        </Navbar.Link>
        <Navbar.Link
          href={user ? "/search" : "#"}
          active={user && area == Area.Search}
          disabled={!user}
        >
          Search
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
