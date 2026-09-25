/**
 * The single Supabase client used everywhere - public pages AND the admin
 * panel. There is no server-side/service-role client anywhere in this app,
 * because the app has no server (this is a static export deployed to GitHub
 * Pages / Vercel with zero API routes). Both the anon key used here and the
 * project URL are safe to expose client-side: write access is gated entirely
 * by Supabase Auth + Row Level Security policies (see supabase/schema.sql),
 * not by hiding a secret key.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
