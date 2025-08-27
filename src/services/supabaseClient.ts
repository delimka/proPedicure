import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Ensure a single Supabase client instance
export const supabase = (() => {
  const g = globalThis as any;
  if (g.__supabase) return g.__supabase;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // manage tokens in cookies yourself
      persistSession: false,
      // Keeps tokens fresh once a session is set in memory
      autoRefreshToken: true,
      //  (set to true only if you use magic links / OAuth redirects on the client)
      detectSessionInUrl: false,
    },
  });

  g.__supabase = client;
  return client;
})();
