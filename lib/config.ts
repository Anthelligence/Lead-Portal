export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey) && Boolean(supabaseServiceRoleKey);

// DEMO_MODE defaults to true unless explicitly set to "false".
// This prevents auth redirects and lets all pages load with demo data.
const demoFlag = process.env.DEMO_MODE;
export const isDemoMode = demoFlag ? demoFlag !== "false" : true;

export const DEMO_TOKEN = "ctl-demo-000";
export const DEMO_NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "demo-nextauth-secret";

