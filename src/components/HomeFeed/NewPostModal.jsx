import { useState } from 'react';
import styles from '../../styles/pages/HomeFeed/NewPostModal.module.css';
import Button from '../commons/Button';
import { useLanguage } from '../../context/LanguageContext';
import strings from '../../locales';

export default function NewPostModal({ open, onClose, onSubmit }) {
  const { lang } = useLanguage();
  const s = strings[lang].newPostModal;
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ content, image });
      setContent('');
      setImage(null);
      setPreview(null);
      onClose();
    } catch (err) {
      setError(err.message || s.error);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{s.title}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder={s.placeholder}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && <img src={preview} alt={s.previewAlt} className={styles.preview} />}
          {error && <div className={styles.error}>{error}</div>}
          <Button
            type="submit"
            disabled={loading}
            className={styles.submit}
            variant="primary"
            icon={null}
          >
            {loading ? s.sending : s.send}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className={styles.close}
            variant="secondary"
            icon={null}
          >
            {s.close}
          </Button>
        </form>
      </div>
    </div>
  );
}
