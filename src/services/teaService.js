import { supabase } from '../supabaseClient';

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
            name
          )
        )
      `);
    
    if (error) throw error;
    return data || [];
  },

  async getTeaById(id) {
    const { data, error } = await supabase
      .from('teas')
      .select(`
        *,
        tea_categories ( name ),
        tea_tags (
          tag:tags (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createTea(teaData) {
    const { data, error } = await supabase
      .from('teas')
      .insert([teaData])
      .select();

    if (error) throw error;
    return data;
  }
};