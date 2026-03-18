import { supabase } from './supabaseClient';
import imageCompression from 'browser-image-compression';

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, image_url, likes_count, comments_count, created_at, updated_at, author')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function uploadImage(file) {
  if (!file) return null;

  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true
    };

    const compressedFile = await imageCompression(file, options);
    const fileName = `${Date.now()}_${compressedFile.name}`;

    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, compressedFile);

    if (error) throw error;

    const url = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName).data.publicUrl;
      
    return url;
  } catch (error) {
    throw error;
  }
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

