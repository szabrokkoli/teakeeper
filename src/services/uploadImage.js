import imageCompression from 'browser-image-compression';
import { supabase } from './supabaseClient';

export async function uploadImage(file, bucket = 'post-images') {
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
      .from(bucket)
      .upload(fileName, compressedFile);

    if (error) throw error;

    const url = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName).data.publicUrl;
    return url;
  } catch (error) {
    throw error;
  }
}
