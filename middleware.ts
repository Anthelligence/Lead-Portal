import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { DEMO_NEXTAUTH_SECRET, isDemoMode } from "@/lib/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // In demo mode we bypass auth entirely so pages always render.
  if (isDemoMode) {
    return NextResponse.next();
  }

  // Protect portal routes when demo mode is off.
  if (pathname.startsWith("/portal")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || DEMO_NEXTAUTH_SECRET,
      salt: process.env.NEXTAUTH_SECRET || DEMO_NEXTAUTH_SECRET
    });

    if (!token) {
      const signInUrl = new URL("/api/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"]
};

