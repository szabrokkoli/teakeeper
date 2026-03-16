import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vvxajvakrznrzvkfmtey.supabase.co'; // Replace with your actual Supabase URL
const supabaseKey = 'sb_publishable_9VaF-uUkuVMy8YXrPMpC6w_KaLJTeIw'; // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
