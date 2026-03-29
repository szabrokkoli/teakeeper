import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserProfileCard from '../components/commons/UserProfileCard';
import { getProfileById } from '../services/profileService';

export default function UserProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const data = await getProfileById(id);
      setProfile(data?.profile || null);
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  if (loading) return <div>Betöltés...</div>;
  if (!profile) return <div>Profil nem található.</div>;

  // TODO: teasCount, recipesCount dinamikus lekérése
  return (
    <UserProfileCard user={{ email: profile.email }} profile={profile} teasCount={3} recipesCount={2} />
  );
}
