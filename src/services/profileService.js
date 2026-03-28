import { supabase } from './supabaseClient';

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
