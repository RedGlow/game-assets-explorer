import type { NextAuthConfig } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

import { isAllowed } from './lib/users';

export const authConfig = {
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const allowed = await isAllowed(auth?.user?.email || "");
      const isOnContents = nextUrl.pathname.startsWith("/contents");
      const isOnSearch = nextUrl.pathname.startsWith("/search");
      const isOnNotAllowed = nextUrl.pathname.startsWith("/not-allowed");

      if(isOnNotAllowed) {
        return true;
      }

      if (isLoggedIn && !allowed) {
        // Show that the user logged in but is not allowed
        return Response.redirect(new URL("/not-allowed", nextUrl));
      }

      if (isOnContents || isOnSearch) {
        return isLoggedIn;
      } else if (isLoggedIn && allowed) {
        return Response.redirect(new URL("/contents", nextUrl));
      }

      return false;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
