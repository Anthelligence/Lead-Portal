import type { NextAuthConfig, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { DEMO_NEXTAUTH_SECRET, isDemoMode, supabaseServiceRoleKey, supabaseUrl } from "@/lib/config";
import { demoUser } from "@/lib/demo";

const emailServer = process.env.EMAIL_SERVER;
const emailFrom = process.env.EMAIL_FROM;

const providers: NextAuthConfig["providers"] = [];

if (emailServer && emailFrom) {
  providers.push(
    EmailProvider({
      server: emailServer,
      from: emailFrom
    })
  );
} else {
  console.warn("Email provider not configured: set EMAIL_SERVER and EMAIL_FROM");
}

// Always ensure we have at least one provider so demo environments do not 500.
providers.push(
  CredentialsProvider({
    name: "Demo account",
    credentials: {
      email: { label: "Email", type: "email", placeholder: demoUser.email },
      code: { label: "Access code (any)", type: "text" }
    },
    async authorize(credentials) {
      return {
        id: demoUser.id,
        name: demoUser.name,
        email: (credentials?.email as string) || demoUser.email
      };
    }
  })
);

const usingSupabase = Boolean(supabaseUrl && supabaseServiceRoleKey) && !isDemoMode;

export const authOptions: NextAuthConfig = {
  adapter: usingSupabase
    ? SupabaseAdapter({
        url: supabaseUrl!,
        secret: supabaseServiceRoleKey!
      })
    : undefined,
  session: {
    strategy: usingSupabase ? "database" : "jwt"
  },
  providers,
  secret: DEMO_NEXTAUTH_SECRET,
  pages: {
    signIn: "/"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({
      session,
      token,
      user
    }: {
      session: Session;
      token: JWT;
      user?: User | null;
    }) {
      if (session.user) {
        session.user.id = (user as any)?.id || (token as any)?.id;
      }
      return session;
    }
  }
};

