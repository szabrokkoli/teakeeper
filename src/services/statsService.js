import { supabase } from './supabaseClient';

export async function getStats() {
  const [teas, cats, tags, recipes] = await Promise.all([
    supabase.from('teas').select('*', { count: 'exact', head: true }),
    supabase.from('tea_categories').select('*', { count: 'exact', head: true }),
    supabase.from('tags').select('*', { count: 'exact', head: true }),
    supabase.from('recipes').select('*', { count: 'exact', head: true })
  ]);

  return {
    teas: teas.count || 0,
    categories: cats.count || 0,
    tags: tags.count || 0,
    recipes: recipes.count || 0
  };
}
