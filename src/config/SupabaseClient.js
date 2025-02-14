import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are loaded correctly
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
