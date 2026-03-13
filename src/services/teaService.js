import { supabase } from '../supabaseClient';

export const teaService = {
  // 1. Fetch all teas (with optional ordering)
  async getAllTeas() {
    const { data, error } = await supabase
      .from('teas')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // 2. Fetch a single tea by ID (for the Details page)
  async getTeaById(id) {
    const { data, error } = await supabase
      .from('teas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // 3. Add a new tea (for the Admin spec)
  async createTea(teaData) {
    const { data, error } = await supabase
      .from('teas')
      .insert([teaData]);

    if (error) throw error;
    return data;
  }
};