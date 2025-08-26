import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
});

export const getDbTables = async () => {
  const { data, error } = await supabase.from('').select('*');

  const definitions = (data as any).definitions;

  const tableStrings = Object.entries(definitions).map(([tableName, tableDef]: any) => {
    const columns = Object.keys(tableDef.properties).map(
      (colName) => `${colName} (${tableDef.properties[colName].type})`,
    );
    return `- ${tableName}: ${columns.join(', ')}`;
  });

  const tableCtx = tableStrings.join('\n');

  return {
    tableCtx,
    error,
    tableStrings,
  };
};
