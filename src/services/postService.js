import { supabase } from './supabaseClient';

/**
 * Lekéri az összes posztot, szerző adataival.
 * @returns {Promise<Array>} posztok tömbje
 */
export async function fetchPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, image_url, likes_count, comments_count, created_at, updated_at, author')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Lekér egy posztot id alapján
 * @param {string} id
 * @returns {Promise<Object>} poszt
 */
export async function fetchPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select(`id, content, image_url, likes_count, comments_count, created_at, updated_at, profiles:author (user_id, username, avatar_url)`)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
