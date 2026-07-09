import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "admin";
    };
  }
}

const DEFAULT_DEV_SECRET = "insecure-dev-secret-do-not-use-in-prod";
const secret = process.env.NEXTAUTH_SECRET || DEFAULT_DEV_SECRET;

if (secret === DEFAULT_DEV_SECRET) {
  if (process.env.NODE_ENV === "production") {
    // In production, refuse to start without a real secret — admins otherwise
    // risk shipping a JWT signed with a publicly known key.
    throw new Error(
      "[auth] NEXTAUTH_SECRET must be set in production. Refusing to start.",
    );
  }
  // eslint-disable-next-line no-console
  console.warn(
    "[auth] NEXTAUTH_SECRET is unset — falling back to a public dev secret. " +
      "Set NEXTAUTH_SECRET in .env before deploying.",
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "Admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role = "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};

export function auth() {
  return getServerSession(authOptions);
}
