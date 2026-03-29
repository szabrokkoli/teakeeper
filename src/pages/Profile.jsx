import { useState } from 'react';
import { updateProfile } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/commons/Button';
import Modal from '../components/commons/Modal';
import InputGroup from '../components/commons/InputGroup';
import { FaKey, FaSignOutAlt, FaEdit, FaLock, FaEye } from 'react-icons/fa';
import styles from '../styles/pages/Profile/Profile.module.css';
import strings from '../locales';
import UserProfileCard from '../components/commons/UserProfileCard';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, setProfile, signOut } = useAuth();
  const { lang } = useLanguage();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [editName, setEditName] = useState(profile?.username || '');
  const [editAvatar, setEditAvatar] = useState(profile?.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
  const [editBio, setEditBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const isAdmin = profile?.role === 'admin';
  const s = strings[lang].profile;
  const previewLabel = s.preview;

  const avatarUrl = profile?.avatar_url || '';

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, {
        username: editName || profile?.username,
        bio: editBio,
        avatarFile: avatarFile
      });
      setProfile(updated); // helyi context frissítése
      setEditOpen(false);
    } catch (err) {
      alert(err.message || 'Hiba a profil mentésekor');
    } finally {
      setSaving(false);
    }
  };

  // Jelszóváltás (mock, implementáld a supabase auth-tal)
  const handleChangePw = async () => {
    setPwMsg('');
    if (pw1.length < 6 || pw1 !== pw2) {
      setPwMsg(s.passwordError);
      return;
    }
    setPwMsg(s.passwordUpdated);
    setPw1(''); setPw2('');
    setTimeout(() => setPwOpen(false), 1000);
  };

  return (
    <>
      <h1 className={styles.profileTitle}>{s.title}</h1>
      <UserProfileCard user={user} profile={profile} />

      <div className={styles.actionButtonStack}>
        <div className={styles.actionButtonRow}>
          <Button className={styles.profileActionButton} icon={<FaEdit />} onClick={() => setEditOpen(true)}>
            {s.editProfile}
          </Button>
          <Button className={styles.profileActionButton} icon={<FaLock />} onClick={() => setPwOpen(true)}>
            {s.changePassword}
          </Button>
        </div>
        {isAdmin && (
          <Button className={styles.profileActionButton} variant="primary" icon={<FaKey />} onClick={() => navigate('/admin')}>
            {s.admin}
          </Button>
        )}
        <Button className={styles.profileActionButton} variant="danger" icon={<FaSignOutAlt />} onClick={signOut}>
          {s.logout}
        </Button>
      </div>

      {/* Profil szerkesztő modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <h2>{s.editProfileTitle}</h2>
        <InputGroup
          label={s.username}
          value={editName}
          onChange={e => setEditName(e.target.value)}
          inputProps={{ type: 'text', maxLength: 32 }}
        />
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>{s.avatarUrl}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ marginBottom: 8 }}
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              style={{ maxWidth: 80, maxHeight: 80, borderRadius: '50%', border: '1px solid #ccc', marginTop: 4 }}
            />
          )}
        </div>
        <InputGroup
          label={s.bio}
          value={editBio}
          onChange={e => setEditBio(e.target.value)}
          inputProps={{ type: 'text', maxLength: 160 }}
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: 16 }}>
          <Button onClick={handleSave} variant="primary" disabled={saving} icon={null}>
            {saving ? s.saving : s.save}
          </Button>
          <Button onClick={() => setEditOpen(false)} variant="secondary" icon={null}>
            {s.cancel}
          </Button>
        </div>
      </Modal>

      {/* Jelszóváltó modal */}
      <Modal open={pwOpen} onClose={() => setPwOpen(false)}>
        <h2>{s.passwordTitle}</h2>
        <InputGroup
          label={s.newPassword}
          value={pw1}
          onChange={e => setPw1(e.target.value)}
          inputProps={{ type: 'password', autoComplete: 'new-password' }}
        />
        <InputGroup
          label={s.repeatNewPassword}
          value={pw2}
          onChange={e => setPw2(e.target.value)}
          inputProps={{ type: 'password', autoComplete: 'new-password' }}
        />
        {pwMsg && <div style={{ color: pwMsg === s.passwordUpdated ? 'green' : 'red', marginBottom: 8 }}>{pwMsg}</div>}
        <div style={{ display: 'flex', gap: '1rem', marginTop: 16 }}>
          <Button onClick={handleChangePw} variant="primary" icon={null}>
            {s.savePassword}
          </Button>
          <Button onClick={() => setPwOpen(false)} variant="secondary" icon={null}>
            {s.cancel}
          </Button>
        </div>
      </Modal>
    </>
  );
}
