import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/config";
import { demoCompany } from "@/lib/demo";
import { supabaseAdmin } from "@/lib/supabase/admin";

const fieldMap = {
  name: "name",
  businessType: "business_type",
  website: "website",
  country: "country",
  size: "size",
  monthlyOrders: "monthly_orders",
  description: "description",
  additionalDetails: "additional_details",
  showAssessmentScores: "show_assessment_scores",
  messagingUrl: "messaging_url",
  instagramUrl: "instagram_url",
  tiktokUrl: "tiktok_url",
  xUrl: "x_url",
  phone: "phone",
  email: "email",
  whatsapp: "whatsapp",
  linkedin: "linkedin_url",
  bannerUrl: "banner_url",
  logoUrl: "logo_url",
  role: "role"
} as const;

function normalizeValue(key: string, value: unknown) {
  if (value === "" || value === undefined) return null;
  if (key === "monthly_orders") {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }
  if (key === "show_assessment_scores") {
    return Boolean(value);
  }
  return value as string;
}

export async function POST(req: Request) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, publicProfileEnabled } = body || {};

  if (!slug) {
    return NextResponse.json({ error: "Company slug is required" }, { status: 400 });
  }

  const updates: Record<string, string | number | null> = {};

  Object.entries(fieldMap).forEach(([inputKey, column]) => {
    if (inputKey in body) {
      updates[column] = normalizeValue(column, body[inputKey]);
    }
  });

  if (!supabaseAdmin || isDemoMode) {
    return NextResponse.json({
      ok: true,
      company: { ...demoCompany, ...updates, slug },
      publicProfileEnabled: typeof publicProfileEnabled === "boolean" ? publicProfileEnabled : true,
      demoMode: true
    });
  }

  try {
    const selectFields =
      "id, name, slug, website, country, business_type, size, monthly_orders, description, additional_details, show_assessment_scores, messaging_url, instagram_url, tiktok_url, x_url, phone, email, whatsapp, linkedin_url, banner_url, logo_url, role";

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("companies")
      .select(selectFields)
      .eq("slug", slug)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existing) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    let updatedCompany = existing;

    if (Object.keys(updates).length > 0) {
      const { data: company, error: updateError } = await supabaseAdmin
        .from("companies")
        .update(updates)
        .eq("id", existing.id)
        .select(selectFields)
        .maybeSingle();

      if (updateError) throw updateError;
      if (!company) throw new Error("Failed to update company");
      updatedCompany = company;
    }

    let visibility = publicProfileEnabled;
    let showScores =
      updates.show_assessment_scores === undefined
        ? existing.show_assessment_scores ?? false
        : Boolean(updates.show_assessment_scores);

    if (typeof publicProfileEnabled === "boolean") {
      const { error: visibilityError } = await supabaseAdmin
        .from("card_tokens")
        .update({ public_profile_enabled: publicProfileEnabled })
        .eq("company_id", existing.id);

      if (visibilityError) throw visibilityError;
    } else {
      const { data: tokenRow } = await supabaseAdmin
        .from("card_tokens")
        .select("public_profile_enabled")
        .eq("company_id", existing.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      visibility = tokenRow?.public_profile_enabled ?? false;
    }

    return NextResponse.json({
      ok: true,
      company: updatedCompany,
      publicProfileEnabled: visibility ?? false,
      showAssessmentScores: showScores
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

