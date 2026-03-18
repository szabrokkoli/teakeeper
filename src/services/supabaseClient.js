import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vvxajvakrznrzvkfmtey.supabase.co';
const supabaseKey = 'sb_publishable_9VaF-uUkuVMy8YXrPMpC6w_KaLJTeIw';

export const supabase = createClient(supabaseUrl, supabaseKey);
