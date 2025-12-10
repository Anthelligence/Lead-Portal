import { NextResponse } from "next/server";
import crypto from "crypto";
import { DEMO_TOKEN, isDemoMode } from "@/lib/config";
import { supabaseAdmin } from "@/lib/supabase/admin";

function generateToken() {
  const part = () => String(crypto.randomInt(0, 1000)).padStart(3, "0");
  return `ctl-${part()}-${part()}`;
}

export async function POST() {
  try {
    if (!supabaseAdmin || isDemoMode) {
      return NextResponse.json({ token: DEMO_TOKEN, demoMode: true });
    }

    for (let i = 0; i < 5; i++) {
      const token = generateToken();
      const { data, error } = await supabaseAdmin
        .from("card_tokens")
        .insert({ token })
        .select("token")
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({ token: data.token });
      }

      // If the token already exists, try again with a new one
      if (error && error.code === "23505") {
        continue;
      }

      if (error) {
        throw error;
      }
    }

    return NextResponse.json({ error: "Unable to create a demo token right now" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create demo token" }, { status: 500 });
  }
}


