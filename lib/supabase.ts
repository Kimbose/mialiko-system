import { createBrowserClient } from '@supabase/ssr';

// Ondoa alama za mshangao na weka mbadala wa maandishi matupu ili isilete kosa wakati wa build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mtambo huu utatengenezwa salama bila kufeli hata kama variables hazipo kipindi cha ujenzi (build)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);