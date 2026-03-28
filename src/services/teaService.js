import { supabase } from './supabaseClient.js';

export const teaService = {
  async getAllTeas() {
    const { data, error } = await supabase
      .from('teas')
      .select(`
        *,
        tea_categories ( name ),
        tea_tags (
          tag:tags (
            id,
            name,
            color
          )
        )
      `);
    
    if (error) throw error;
    return data || [];
  },

  async getAllCategories() {
    const { data, error } = await supabase
      .from('tea_categories')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getAllTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*');
    if (error) throw error;
    return data || [];
  },
};