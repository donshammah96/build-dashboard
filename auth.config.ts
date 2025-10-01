import type { NextAuthConfig } from 'next-auth';
import type { Session } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      // Store user data in JWT token when user signs in
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },
    session({ session, token }) {
      // Pass user data from JWT token to session
      if (token && session.user) {
        session.user.id = token.id as string;
        if (token.image) {
          session.user.image = token.image as string;
        }
      }
      return session;
    }
  },
  providers: [],
} satisfies NextAuthConfig;