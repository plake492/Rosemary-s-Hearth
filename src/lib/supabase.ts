import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('Missing SUPABASE_KEY environment variable');
}
if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
