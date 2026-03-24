import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // NO BACKEND: Instantly log the user in to provide a seamless frontend-only experience
        // The session will automatically be remembered by NextAuth's JWT cookies
        return {
          id: 'local-user-' + Math.random().toString(36).substr(2, 9),
          name: credentials.email.split('@')[0], 
          email: credentials.email,
          role: 'USER',
        };
      }
    })
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'supersecret_fallback_key',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
