import React, { useState } from 'react';
import styles from '../../styles/pages/HomeFeed/NewPostModal.module.css';

export default function NewPostModal({ open, onClose, onSubmit }) {
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
      setError(err.message || 'Hiba történt');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Új poszt</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder="Írd meg a posztod..."
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
          {preview && <img src={preview} alt="Kép előnézet" className={styles.preview} />}
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? 'Mentés...' : 'Küldés'}
          </button>
          <button type="button" onClick={onClose} className={styles.close}>Bezárás</button>
        </form>
      </div>
    </div>
  );
}
