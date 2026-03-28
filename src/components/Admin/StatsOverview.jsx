import { useState, useEffect } from 'react';
import { getStats } from '../../services/statsService';
import styles from '../../styles/pages/AdminDashboard/StatsOverview.module.css';
import strings from '../../locales';

export default function StatsOverview({ lang, onCardClick }) {
  const [stats, setStats] = useState({
    teas: 0,
    categories: 0,
    tags: 0,
    recipes: 0
  });
  const [loading, setLoading] = useState(true);
  const l = strings[lang]?.statsOverview || strings.hu.statsOverview;

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const stats = await getStats();
      setStats(stats);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statItems = [
    { id: 'teas', label: l.teas, value: stats.teas },
    { id: 'categories', label: l.categories, value: stats.categories },
    { id: 'tags', label: l.tags, value: stats.tags },
    { id: 'recipes', label: l.recipes, value: stats.recipes },
  ];

  return (
    <div className={styles.statsGrid}>
      {statItems.map((item) => (
        <div 
          key={item.id} 
          className={styles.statCard}
        >
          <span className={styles.statLabel}>{item.label}</span>
          <span className={styles.statValue}>
            {loading ? "..." : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
