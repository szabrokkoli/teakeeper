import { supabase } from './supabaseClient';

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, image_url, likes_count, comments_count, created_at, updated_at, author')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}


export async function createPost({ content, imageUrl, author }) {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        content,
        image_url: imageUrl || null,
        author,
        created_at: new Date().toISOString()
      }
    ]);
    
  if (error) throw error;
  return data;
}

