import { useState, useEffect } from 'react';
import { teaService } from '../services/teaService';
import { useLanguage } from '../context/LanguageContext';
import TeaCard from '../components/TeaInfo/TeaCard';
import TeaCardSkeleton from '../components/TeaInfo/TeaCardSkeleton';
import styles from '../styles/pages/TeaInfo/TeaInfo.module.css';
import FilterToolbar from '../components/commons/FilterToolbar';
import Modal from '../components/commons/Modal';
import { FaSearch, FaFilter } from 'react-icons/fa';

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
  const [showFilterModal, setShowFilterModal] = useState(false);
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

      <div className={styles.searchBar}>
        <input
          className={`${styles.searchInput} form-control`}
          type="text"
          placeholder={s.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className={styles.searchButton}
          onClick={() => {}}
          aria-label="Keresés"
        >
          <FaSearch size={22} />
        </button>
        <button
          className={styles.filterButton}
          onClick={() => setShowFilterModal(true)}
          aria-label="Szűrés"
        >
          <FaFilter size={22} />
        </button>
      </div>

      <Modal open={showFilterModal} onClose={() => setShowFilterModal(false)}>
        <FilterToolbar
          controls={[
            {
              type: 'select',
              value: category,
              onChange: e => setCategory(e.target.value),
              options: [
                { value: '', label: s.categories },
                { value: 'Green', label: 'Green / Zöld' },
                { value: 'Black', label: 'Black / Fekete' },
                { value: 'Herbal', label: 'Herbal / Gyógytea' }
              ]
            },
            {
              type: 'select',
              value: origin,
              onChange: e => setOrigin(e.target.value),
              options: [
                { value: '', label: s.origins },
                { value: 'china', label: 'China / Kína' },
                { value: 'japan', label: 'Japan / Japán' },
                { value: 'europe', label: 'Europe / Európa' }
              ]
            },
            {
              type: 'select',
              value: selectedTag,
              onChange: e => setSelectedTag(e.target.value),
              options: [
                { value: '', label: s.tags },
                { value: lang === 'hu' ? 'Nyugtató' : 'Calming', label: 'Nyugtató / Calming' },
                { value: lang === 'hu' ? 'Energizáló' : 'Energizing', label: 'Energizáló / Energizing' },
                { value: lang === 'hu' ? 'Emésztést segítő' : 'Digestion', label: 'Emésztést segítő' }
              ]
            }
          ]}
        />
      </Modal>

      <section className={styles.teaCardGrid}>
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