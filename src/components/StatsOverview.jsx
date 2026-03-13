import { useState, useEffect } from 'react';
// JAVÍTÁS: Egy szinttel feljebb van a gyökérben
import { supabase } from '../supabaseClient'; 
// JAVÍTÁS: Két szinttel feljebb, majd styles mappa
import styles from '../styles/StatsOverview.module.css';

export default function StatsOverview({ lang, onCardClick }) {
  const [stats, setStats] = useState({
    teas: 0,
    categories: 0,
    tags: 0,
    recipes: 0
  });
  const [loading, setLoading] = useState(true);

  const labels = {
    hu: { teas: "Teák", categories: "Kategóriák", tags: "Címkék", recipes: "Receptek" },
    en: { teas: "Teas", categories: "Categories", tags: "Tags", recipes: "Recipes" }
  };

  const l = labels[lang] || labels.hu;

  useEffect(() => {
    async function getStats() {
      setLoading(true);
      // Párhuzamosan lekérjük az összes tábla darabszámát
      const [teas, cats, tags, recipes] = await Promise.all([
        supabase.from('teas').select('*', { count: 'exact', head: true }),
        supabase.from('tea_categories').select('*', { count: 'exact', head: true }),
        supabase.from('tags').select('*', { count: 'exact', head: true }),
        supabase.from('recipes').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        teas: teas.count || 0,
        categories: cats.count || 0,
        tags: tags.count || 0,
        recipes: recipes.count || 0
      });
      setLoading(false);
    }

    getStats();
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
          onClick={() => onCardClick(item.id)}
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