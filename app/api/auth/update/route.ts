import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/config";
import { demoUser } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { userId, email, name } = body || {};

  if (!userId) {
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!supabaseAdmin || isDemoMode) {
    return NextResponse.json({
      ok: true,
      user: {
        id: userId || demoUser.id,
        email: email || demoUser.email,
        name: name || demoUser.name
      },
      demoMode: true
    });
  }

  try {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("users")
      .update({ email, name })
      .eq("id", userId)
      .select("id, name, email")
      .maybeSingle();

    if (updateError) throw updateError;
    if (!updated) {
      throw new Error("Failed to update user");
    }

    return NextResponse.json({ ok: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

