import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseServerClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        const cookieStore = cookies();
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        const cookieStore = cookies();
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: any) {
        const cookieStore = cookies();
        cookieStore.set(name, "", { ...options, maxAge: 0 });
      }
    }
  });
}

