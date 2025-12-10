import { NextResponse } from "next/server";
import { getTokenState } from "@/lib/queries";

export async function POST(request: Request) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  try {
    const state = await getTokenState(token);
    if (!state) {
      return NextResponse.json({ found: false });
    }
    return NextResponse.json({ found: true, state });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

