// src/utils/getSessionUser.ts
import { supabase } from '../lib/supabase';

export const getSessionUser = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
};
