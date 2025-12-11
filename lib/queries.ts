import { isDemoMode } from "@/lib/config";
import { demoAssessment, demoCompany, demoTokenState, demoUser } from "@/lib/demo";
import { supabaseAdmin } from "./supabase/admin";

export async function getTokenState(token: string) {
  if (!supabaseAdmin || isDemoMode) {
    return token === demoTokenState.token ? demoTokenState : null;
  }

  const { data, error } = await supabaseAdmin
    .from("card_tokens")
    .select(
      "id, token, claimed, claimed_at, company_id, public_profile_enabled, companies:company_id (slug, name)"
    )
    .eq("token", token)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCompanyBySlug(slug: string) {
  if (!supabaseAdmin || isDemoMode) {
    return slug === demoCompany.slug
      ? {
          ...demoCompany,
          assessment_results: {
            total_score: demoAssessment.total_score,
            profile_label: demoAssessment.profile_label,
            strengths: demoAssessment.strengths,
            opportunities: demoAssessment.opportunities
          }
        }
      : null;
  }

  const { data, error } = await supabaseAdmin
    .from("companies")
    .select(
      "id, name, slug, website, country, business_type, size, monthly_orders, description, additional_details, show_assessment_scores, messaging_url, instagram_url, tiktok_url, x_url, phone, email, whatsapp, linkedin_url, banner_url, logo_url, role, assessment_results (total_score, profile_label, strengths, opportunities)"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPublicProfile(slug: string) {
  if (!supabaseAdmin || isDemoMode) {
    return slug === demoCompany.slug
      ? {
          company: demoCompany,
          assessment: demoAssessment
        }
      : null;
  }

  const { data: company, error } = await supabaseAdmin
    .from("companies")
    .select(
      "id, name, slug, website, country, business_type, size, monthly_orders, description, additional_details, show_assessment_scores, messaging_url, instagram_url, tiktok_url, x_url, phone, email, whatsapp, linkedin_url, banner_url, logo_url, role"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!company) return null;

  const { data: latestAssessment } = await supabaseAdmin
    .from("assessment_results")
    .select("total_score, profile_label, strengths, opportunities")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { company, assessment: latestAssessment };
}

export async function getProfileSettings(slug: string) {
  if (!supabaseAdmin || isDemoMode) {
    return {
      company: demoCompany,
      assessment: demoAssessment,
      publicProfileEnabled: true
    };
  }

  const { data: company, error } = await supabaseAdmin
    .from("companies")
    .select(
      "id, name, slug, website, country, business_type, size, monthly_orders, description, additional_details, show_assessment_scores, messaging_url, instagram_url, tiktok_url, x_url, phone, email, whatsapp, linkedin_url, banner_url, logo_url, role"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!company) return null;

  const { data: latestAssessment } = await supabaseAdmin
    .from("assessment_results")
    .select("total_score, profile_label, strengths, opportunities")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: tokenRow } = await supabaseAdmin
    .from("card_tokens")
    .select("public_profile_enabled")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    company,
    assessment: latestAssessment,
    publicProfileEnabled: tokenRow?.public_profile_enabled ?? false
  };
}

export async function getAccountSettings(userId: string | null) {
  if (!userId) return null;

  if (!supabaseAdmin || isDemoMode) {
    return {
      id: userId || demoUser.id,
      name: demoUser.name,
      email: demoUser.email
    };
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, name, email")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

