import { NextResponse } from "next/server";
import { DEMO_TOKEN, isDemoMode } from "@/lib/config";
import { demoCompany, demoUser } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/admin";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    token,
    name,
    companyName,
    email,
    country,
    businessType,
    role,
    website,
    size,
    monthlyOrders
  } = body || {};

  if (!token || !name || !companyName || !email || !country || !businessType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    if (!supabaseAdmin || isDemoMode) {
      if (token !== DEMO_TOKEN) {
        return NextResponse.json({ error: "Token not found" }, { status: 404 });
      }

      return NextResponse.json({
        ok: true,
        company: { ...demoCompany, name: companyName },
        user: { ...demoUser, name, email },
        demoMode: true
      });
    }

    // Verify token
    const { data: tokenRow, error: tokenError } = await supabaseAdmin
      .from("card_tokens")
      .select("*")
      .eq("token", token)
      .maybeSingle();
    if (tokenError) throw tokenError;
    if (!tokenRow) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
    if (tokenRow.claimed) {
      return NextResponse.json({ error: "Token already claimed" }, { status: 409 });
    }

    // Upsert user
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .upsert({ email, name }, { onConflict: "email" })
      .select()
      .maybeSingle();
    if (userError) throw userError;
    if (!user) throw new Error("Failed to create user");

    // Create company with unique slug
    const baseSlug = slugify(companyName);
    const slug = tokenRow.token ? `${baseSlug}-${tokenRow.token.slice(0, 6)}` : baseSlug;

    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .insert({
        name: companyName,
        slug,
        country,
        business_type: businessType,
        website,
        size,
        monthly_orders: monthlyOrders ? Number(monthlyOrders) : null,
        email,
        role
      })
      .select()
      .maybeSingle();
    if (companyError) throw companyError;

    // Claim token
    const { error: claimError } = await supabaseAdmin
      .from("card_tokens")
      .update({
        claimed: true,
        claimed_at: new Date().toISOString(),
        company_id: company.id
      })
      .eq("id", tokenRow.id);
    if (claimError) throw claimError;

    return NextResponse.json({ ok: true, company, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

