import React from 'react';
import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getPostLikeStatus, likePost, unlikePost, getPostLikesCount } from '../../services/likeService';
import styles from '../../styles/pages/HomeFeed/PostCard.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { getRelativeTime } from '../../utils/relativeTime';

export default function PostCard({ post }) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [showImageModal, setShowImageModal] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likes || 0);
  const [loadingLike, setLoadingLike] = React.useState(false);

  React.useEffect(() => {
    if (post.id) {
      getPostLikesCount(post.id).then(setLikeCount);
      if (user) {
        getPostLikeStatus(post.id, user.id).then(setLiked);
      } else {
        setLiked(false);
      }
    }
  }, [user, post.id]);

  const handleLike = async () => {
    if (!user || loadingLike) return;
    setLoadingLike(true);
    try {
      if (liked) {
        await unlikePost(post.id, user.id);
        setLiked(false);
        setLikeCount((c) => c - 1);
      } else {
        await likePost(post.id, user.id);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch (e) {
      // Hibakezelés
    }
    setLoadingLike(false);
  };

  return (
    <div className={styles.card}>
      {post?.imageUrl && (
        <button
          className={styles.imageButton}
          onClick={() => setShowImageModal(true)}
          style={{ padding: 0, border: 'none', background: 'none' }}
        >
          <img src={post.imageUrl} alt="post visual" className={styles.image} />
        </button>
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.authorBlock}>
            {post.avatarUrl ? (
              <img src={post.avatarUrl} alt="avatar" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder} />
            )}
            <span className={styles.author}>{post.author}</span>
          </div>
          <span className={styles.date}>{getRelativeTime(post.date, lang)}</span>
        </div>
        <div className={styles.text}>{post.content}</div>
        <div className={styles.statsRow}>
          <span className={styles.stat}>
            <span
              className={styles.likeIcon}
              onClick={handleLike}
              style={{ cursor: loadingLike ? 'default' : 'pointer' }}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              {liked ? (
                <FaHeart className={styles.icon} style={{ color: 'var(--color-primary)' }} />
              ) : (
                <FaRegHeart className={styles.icon} />
              )}
            </span>
            {likeCount}
          </span>
          <span className={styles.stat}>
            <FaRegComment className={styles.icon} /> {post.comments || 0}
          </span>
        </div>
      </div>
      <div className={showImageModal ? `${styles.imageModal} ${styles.show}` : styles.imageModal} onClick={() => setShowImageModal(false)}>
        <img src={post.imageUrl} alt="post visual" className={showImageModal ? `${styles.modalImage} ${styles.show}` : styles.modalImage} />
      </div>
    </div>
  );
}
