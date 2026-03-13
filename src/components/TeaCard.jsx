import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/TeaCard.module.css';

export default function TeaCard({ tea }) {
  const { lang } = useLanguage();

  // A Supabase egy beágyazott tömböt ad vissza (tea_tags[].tag), 
  // ezt egy kicsit "kilapítjuk", hogy könnyebb legyen rajta végigmenni.
  // Ha nincsenek címkék, üres tömböt adunk vissza.
  const tags = tea.tea_tags?.map(relation => relation.tag) || [];

  return (
    <div className={styles.card}>
      {/* Kép (ha van) */}
      {tea.image_url && (
        <img 
          src={tea.image_url} 
          alt={tea.name[lang]} 
          className={styles.image} 
        />
      )}

      <div className={styles.content}>
        {/* Kategória és Név */}
        <div className={styles.header}>
          <span className={styles.category}>
            {tea.tea_categories?.name}
          </span>
          <h3 className={styles.title}>{tea.name[lang]}</h3>
        </div>

        <p className={styles.description}>
          {tea.description?.[lang]}
        </p>

        {/* Címkék (Tags) megjelenítése */}
        {tags.length > 0 && (
          <div className={styles.tagsContainer}>
            {tags.map((tag) => (
              <span key={tag.id} className={styles.badge}>
                {tag.name[lang]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}