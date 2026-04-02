import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://mlktbfbtiihodwuppahd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.warn('[SUPABASE] SUPABASE_SERVICE_KEY not set — logo uploads will fail');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey || '');
