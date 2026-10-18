import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // For development prototype: automatically log in the test user
        // without proper password hashing to save time and friction, 
        // OR allow any password for them
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (user) {
          // Dev shortcut: we accept 'dummy' or ignore password check for test@example.com
          if (user.email === "test@example.com") {
            return { id: user.id, name: user.name, email: user.email };
          }
          
          // Proper path for real users
          if (user.passwordHash && credentials.password) {
            const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
            if (isValid) {
              return { id: user.id, name: user.name, email: user.email };
            }
          }
        }
        
        // Return null if user data could not be retrieved
        return null; // returning null rejects login
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const protectedPaths = ["/dashboard", "/practice", "/dev"];
      const isProtected = protectedPaths.some((path) => nextUrl.pathname.startsWith(path));
      
      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirects to sign-in
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});
