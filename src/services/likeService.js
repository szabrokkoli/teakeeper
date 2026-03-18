import { supabase } from './supabaseClient';

// Like egy posztot
export async function likePost(postId, userId) {
  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: userId });
  if (error) throw error;
}

// Unlike egy posztot
export async function unlikePost(postId, userId) {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  if (error) throw error;
}

// Lekérdezi, hogy a user like-olta-e a posztot
export async function getPostLikeStatus(postId, userId) {
  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', userId);
  if (error) throw error;
  return data.length > 0;
}

// Lekérdezi a poszt like-ok számát
export async function getPostLikesCount(postId) {
  const { count, error } = await supabase
    .from('post_likes')
    .select('post_id', { count: 'exact', head: true })
    .eq('post_id', postId);
  if (error) throw error;
  return count || 0;
}
