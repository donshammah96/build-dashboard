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
    session({ session, user}): Promise<Session> {
      if (session.user && user.id && user.image) {
        session.user.id = user.id;
        session.user.image = user.image;
        return Promise.resolve(session);
      }
      return Promise.resolve(session);
    }
  },
  providers: [],
} satisfies NextAuthConfig;