import { useState, useEffect } from 'react';
import { teaService } from '../services/teaService';
import { useLanguage } from '../context/LanguageContext';
import TeaCard from '../components/TeaCard';
import TeaCardSkeleton from '../components/TeaCardSkeleton';
import styles from '../styles/TeaInfo.module.css';

const localStrings = {
  hu: {
    title: "Teák felfedezése",
    loading: "Finom teák betöltése...",
    searchPlaceholder: "Keresés...",
    noResults: "Nem találtunk a szűrésnek megfelelő teát.",
    categories: "Összes kategória",
    origins: "Összes származási hely",
    tags: "Minden hatás",
    error: "Hiba történt a teák betöltésekor."
  },
  en: {
    title: "Explore Teas",
    loading: "Loading delicious teas...",
    searchPlaceholder: "Search teas...",
    noResults: "No teas found matching those filters.",
    categories: "All Categories",
    origins: "All Origins",
    tags: "All Effects",
    error: "Could not load teas."
  }
};

export default function TeaInfo() {
  const { lang } = useLanguage();
  const s = localStrings[lang];

  const [teas, setTeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [origin, setOrigin] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    async function fetchTeas() {
      try {
        setLoading(true);
        const data = await teaService.getAllTeas();
        const sortedData = data.sort((a, b) => 
          a.name[lang].localeCompare(b.name[lang])
        );
        setTeas(sortedData);
      } catch (err) {
        setError(s.error);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeas();
  }, [lang, s.error]);

  const filteredTeas = teas.filter(tea => {
    const teaName = tea.name[lang] || "";
    const teaDesc = tea.description?.[lang] || "";

    const matchesSearch =
      teaName.toLowerCase().includes(search.toLowerCase()) ||
      teaDesc.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category ? (tea.tea_categories?.name === category) : true;
    const matchesOrigin = origin ? (tea.origin[lang]?.toLowerCase().includes(origin.toLowerCase())) : true;
    
    const matchesTag = selectedTag 
      ? tea.tea_tags?.some(relation => relation.tag.name[lang] === selectedTag)
      : true;

    return matchesSearch && matchesCategory && matchesOrigin && matchesTag;
  });

  if (error) return <div className={`${styles.statusMessage} ${styles.error}`}>{error}</div>;

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{s.title}</h1>

      <div className={styles.toolbar}>
        <select className="filter-control" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">{s.categories}</option>
          <option value="Green">Green / Zöld</option>
          <option value="Black">Black / Fekete</option>
          <option value="Herbal">Herbal / Gyógytea</option>
        </select>

        <select className="filter-control" value={origin} onChange={e => setOrigin(e.target.value)}>
          <option value="">{s.origins}</option>
          <option value="china">China / Kína</option>
          <option value="japan">Japan / Japán</option>
          <option value="europe">Europe / Európa</option>
        </select>

        <select className="filter-control" value={selectedTag} onChange={e => setSelectedTag(e.target.value)}>
          <option value="">{s.tags}</option>
          <option value={lang === 'hu' ? 'Nyugtató' : 'Calming'}>Nyugtató / Calming</option>
          <option value={lang === 'hu' ? 'Energizáló' : 'Energizing'}>Energizáló / Energizing</option>
          <option value={lang === 'hu' ? 'Emésztést segítő' : 'Digestion'}>Emésztést segítő</option>
        </select>

        <input
          className="form-control"
          type="text"
          placeholder={s.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '320px', marginBottom: 0 }}
        />
      </div>

      <section className={styles.grid}>
        {loading ? (
          Array(6).fill(0).map((_, index) => (
            <TeaCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : filteredTeas.length > 0 ? (
          filteredTeas.map(tea => (
            <TeaCard key={tea.id} tea={tea} />
          ))
        ) : (
          <p className={styles.noResults}>{s.noResults}</p>
        )}
      </section>
    </section>
  );
}