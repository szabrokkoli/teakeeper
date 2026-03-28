
import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/HomeFeed/HomeFeed.module.css';
import { useLanguage } from '../context/LanguageContext';
import { getAllPosts } from '../services/postService';
import { getProfilesByIds } from '../services/profileService';
import PostCard from '../components/HomeFeed/PostCard';
import FloatingActionButton from '../components/commons/FloatingActionButton';
import NewPostModal from '../components/HomeFeed/NewPostModal';
import { uploadImage, createPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import PostCardSkeleton from '../components/HomeFeed/PostCardSkeleton';
import strings from '../locales';

export default function HomeFeed() {
  const { lang } = useLanguage();
  const s = strings[lang].homeFeed;
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllPosts()
      .then(async data => {
        const authorIds = (data || []).map(post => post.author);
        let authorsMap = {};
        if (authorIds.length > 0) {
          authorsMap = await getProfilesByIds(authorIds);
        }
        const postsWithAuthors = (data || []).map(post => ({
          ...post,
          authorName: authorsMap[post.author]?.username || post.author,
          avatarUrl: authorsMap[post.author]?.avatar_url || null
        }));
        setPosts(postsWithAuthors);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || s.error);
        setLoading(false);
      });
  }, [lang]);

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{s.title}</h1>
      {loading && (
        <div className={styles.postList}>
          {[...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      )}
      {error && <div style={{ color: 'var(--color-error)' }}>{s.error}</div>}
      {!loading && !error && posts.length === 0 && <div>{s.noResults}</div>}
      {!loading && !error && posts.length > 0 && (
        <div className={styles.postList}>
          {posts.map(post => (
            <PostCard key={post.id} post={{
              id: post.id,
              author: post.authorName || 'Ismeretlen',
              date: post.created_at || '',
              content: post.content,
              imageUrl: post.image_url,
              likes: post.likes_count,
              comments: post.comments_count,
              avatarUrl: post.avatarUrl
            }} />
          ))}
        </div>
      )}
      <FloatingActionButton onClick={() => setShowModal(true)} />
      <NewPostModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async ({ content, image }) => {
          if (!user) {
            setError(s.loginRequired);
            return;
          }
          let imageUrl = null;
          if (image) {
            imageUrl = await uploadImage(image);
          }
          await createPost({ content, imageUrl, author: user.id });
          setShowModal(false);
          setLoading(true);
          getAllPosts()
            .then(async data => {
              const authorIds = (data || []).map(post => post.author);
              let authorsMap = {};
              if (authorIds.length > 0) {
                authorsMap = await getProfilesByIds(authorIds);
              }
              const postsWithAuthors = (data || []).map(post => ({
                ...post,
                authorName: authorsMap[post.author]?.username || post.author,
                avatarUrl: authorsMap[post.author]?.avatar_url || null
              }));
              setPosts(postsWithAuthors);
              setLoading(false);
            })
            .catch(err => {
              setError(err.message || s.error);
              setLoading(false);
            });
        }}
      />
    </section>
  );
}