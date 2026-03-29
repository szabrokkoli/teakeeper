import { supabase } from './supabaseClient';
import { uploadImage } from './uploadImage';

export async function getProfilesByIds(userIds) {
  if (!userIds || userIds.length === 0) return {};
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('user_id, username, avatar_url')
    .in('user_id', userIds);
  if (error || !profiles) return {};
  const authorsMap = {};
  profiles.forEach(profile => {
    authorsMap[profile.user_id] = profile;
  });
  return authorsMap;
}

export async function getProfileById(id) {
  if (!id) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', id)
    .single();
  if (error || !data) return null;
  return { profile: data };
}

export async function updateProfile(userId, updates) {
  if (!userId) throw new Error('Missing userId');
  let avatarUrl = updates.avatar_url || null;

  if (updates.avatarFile) {
    avatarUrl = await uploadImage(updates.avatarFile, 'avatars');
  }

  const updateData = {
    username: updates.username,
    bio: updates.bio,
    ...(avatarUrl ? { avatar_url: avatarUrl } : {})
  };

  Object.keys(updateData).forEach(
    key => (updateData[key] === undefined || updateData[key] === null) && delete updateData[key]
  );

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
