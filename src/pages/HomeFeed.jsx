import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/HomeFeed.module.css';
import { useLanguage } from '../context/LanguageContext';
import { fetchPosts } from '../services/postService';
import { supabase } from '../services/supabaseClient';
import PostCard from '../components/HomeFeed/PostCard';

const localStrings = {
  hu: {
    title: "Tea Dolgok",
    loading: "Érdekes posztok betöltése...",
    noResults: "Nincsenek új posztok :(",
    error: "Hiba történt a posztok betöltésekor.",
    relativeTime: {
      justNow: 'épp most',
      minute: 'perce',
      hour: 'órája',
      day: 'napja',
      unknown: 'ismeretlen idő'
    }
  },
  en: {
    title: "Tea Stuff",
    loading: "Loading funny posts...",
    noResults: "No new posts :(",
    error: "Could not load posts :o",
    relativeTime: {
      justNow: 'just now',
      minute: 'minutes ago',
      hour: 'hours ago',
      day: 'days ago',
      unknown: 'unknown time'
    }
  }
};

export default function HomeFeed() {
  const { lang } = useLanguage();
  const s = localStrings[lang];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPosts()
      .then(async data => {
        console.log('Lekért posztok:', data);
        // szerző UUID-k lekérdezése
        const authorIds = (data || []).map(post => post.author);
        let authorsMap = {};
        if (authorIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('user_id, username, avatar_url')
            .in('user_id', authorIds);
          if (!profilesError && profiles) {
            profiles.forEach(profile => {
              authorsMap[profile.user_id] = profile;
            });
          }
        }
        // posztok szerző nevét hozzárendezzük
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
      {loading && <div>{s.loading}</div>}
      {error && <div style={{ color: 'var(--color-error)' }}>{s.error}</div>}
      {!loading && !error && posts.length === 0 && <div>{s.noResults}</div>}
      {!loading && !error && posts.length > 0 && (
        <div className={styles.postList}>
          {posts.map(post => (
            <PostCard key={post.id} post={{
              author: post.authorName || 'Ismeretlen',
              date: post.created_at || '', // <--- ITT A JAVÍTÁS: A teljes időbélyeget átadjuk!
              content: post.content,
              imageUrl: post.image_url,
              likes: post.likes_count,
              comments: post.comments_count,
              avatarUrl: post.avatarUrl
            }} />
          ))}
        </div>
      )}
    </section>
  );
}