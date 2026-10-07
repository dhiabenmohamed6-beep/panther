import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compareSync } from "bcrypt-ts-edge";
import { z } from "zod";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: THIRTY_DAYS,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rememberMe = user.rememberMe ?? false;
      }
      // Without an explicit exp the session cookie is dropped when the browser
      // closes, which is what "Remember me" unchecked means.
      if (token.rememberMe) {
        token.exp = Math.floor(Date.now() / 1000) + THIRTY_DAYS;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnAccount = nextUrl.pathname.startsWith("/account");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;
        return auth.user.role === "ADMIN";
      }

      if (isOnAccount) {
        return isLoggedIn;
      }

      return true;
    },  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
            rememberMe: z.union([z.boolean(), z.string()]).optional(),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password, rememberMe } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) return null;

        const passwordsMatch = compareSync(password, user.password);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          rememberMe: rememberMe === true || rememberMe === "true",
        };
      },
    }),
  ],
});

declare module "next-auth" {
  interface User {
    role: string;
    rememberMe?: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

declare module "next-auth" {
  interface JWT {
    id: string;
    role: string;
    rememberMe?: boolean;
  }
}