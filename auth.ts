import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options";

// Centralized Auth.js helpers for both routes and server components
const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export { auth, signIn, signOut, handlers };
export const { GET, POST } = handlers;
