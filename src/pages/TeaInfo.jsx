import { useState, useEffect } from 'react';
import { teaService } from '../services/teaService';
import { useLanguage } from '../context/LanguageContext'; // Beemeljük a nyelvkezelőt
import '../styles/App.css';

// 1. Helyi szótár a UI elemekhez (amit kértél, hogy itt legyen)
const localStrings = {
  hu: {
    title: "Teák felfedezése",
    loading: "Finom teák betöltése...",
    searchPlaceholder: "Keresés...",
    noResults: "Nem találtunk a szűrésnek megfelelő teát.",
    moreDetails: "Részletek",
    preparation: "Elkészítés",
    categories: "Összes kategória",
    origins: "Összes származási hely",
    caffeine: "Minden koffeinszint",
  },
  en: {
    title: "Explore Teas",
    loading: "Loading delicious teas...",
    searchPlaceholder: "Search teas...",
    noResults: "No teas found matching those filters.",
    moreDetails: "More details",
    preparation: "Preparation",
    categories: "All Categories",
    origins: "All Origins",
    caffeine: "All Caffeine Levels",
  }
};

export default function TeaInfo() {
  const { lang } = useLanguage(); // Aktuális nyelv lekérése (hu vagy en)
  const s = localStrings[lang];   // Segédváltozó a szövegekhez

  // --- State Management ---
  const [teas, setTeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [origin, setOrigin] = useState('');
  const [caffeine, setCaffeine] = useState('');

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchTeas() {
      try {
        setLoading(true);
        const data = await teaService.getAllTeas(); 
        setTeas(data);
      } catch (err) {
        setError(lang === 'hu' ? "Hiba történt a teák betöltésekor." : "Could not load teas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeas();
  }, [lang]); // Újratöltünk, ha nyelv váltás van (opcionális, de biztonságos)

  // --- Filtering Logic ---
  const filteredTeas = teas.filter(tea => {
    // A keresés most már az aktuális nyelven mentett JSONB mezőkben keres!
    const teaName = tea.name[lang] || "";
    const teaDesc = tea.description[lang] || "";

    const matchesSearch =
      teaName.toLowerCase().includes(search.toLowerCase()) ||
      teaDesc.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category ? (tea.category?.toLowerCase() === category.toLowerCase()) : true;
    const matchesOrigin = origin ? (tea.origin[lang]?.toLowerCase() === origin.toLowerCase()) : true;
    const matchesCaffeine = caffeine ? (tea.caffeine?.toLowerCase() === caffeine.toLowerCase()) : true;

    return matchesSearch && matchesCategory && matchesOrigin && matchesCaffeine;
  });

  // --- Render UI ---
  if (loading) return <div className="tea-loading">{s.loading}</div>;
  if (error) return <div className="tea-error">{error}</div>;

  return (
    <section>
      <h1 className="tea-title">{s.title}</h1>

      {/* Filter Toolbar */}
      <div className="tea-filters" style={filterContainerStyle}>
        <select 
          className="filter-control" 
          value={category} 
          onChange={e => setCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="">{s.categories}</option>
          <option value="green">Green</option>
          <option value="black">Black</option>
          <option value="herbal">Herbal</option>
          <option value="white">White</option>
          <option value="oolong">Oolong</option>
        </select>

        {/* Fontos: Itt az origin szűrő értékeit is érdemes lehet fixre venni, 
            vagy az adatbázisból dinamikusan építeni */}
        <select 
          className="filter-control" 
          value={origin} 
          onChange={e => setOrigin(e.target.value)}
          style={selectStyle}
        >
          <option value="">{s.origins}</option>
          <option value="China">China / Kína</option>
          <option value="Japan">Japan / Japán</option>
          <option value="Europe">Europe / Európa</option>
          <option value="Africa">Africa / Afrika</option>
        </select>

        <select 
          className="filter-control" 
          value={caffeine} 
          onChange={e => setCaffeine(e.target.value)}
          style={selectStyle}
        >
          <option value="">{s.caffeine}</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="none">None</option>
        </select>

        <input
          className="form-control"
          type="text"
          placeholder={s.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Results Grid */}
      <section className="tea-grid">
        {filteredTeas.length > 0 ? (
          filteredTeas.map(tea => (
            <article className="tea-card" key={tea.id}>
              {tea.image_url && (
                <img className="tea-image" src={tea.image_url} alt={tea.name[lang]} />
              )}
              <header className="tea-header">
                {/* JSONB adatok elérése [lang] kulccsal */}
                <h2 className="tea-name">{tea.name[lang]}</h2>
                <span className="tea-origin">{tea.origin[lang]}</span>
              </header>
              <p className="tea-description">{tea.description[lang]}</p>
              
              <div className="toolbar">
                <button className="button button-secondary">{s.moreDetails}</button>
                <button className="button button-primary">{s.preparation}</button>
              </div>
            </article>
          ))
        ) : (
          <p className="tea-no-results">{s.noResults}</p>
        )}
      </section>
    </section>
  );
}

// --- Styles ---
const filterContainerStyle = {
  display: 'flex',
  gap: 'var(--space-2)',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: 'var(--space-3)'
};

const selectStyle = {
  padding: 'var(--space-1)',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-md)',
  background: 'var(--color-bg-elevated)',
  color: 'var(--color-text)',
  minWidth: 140
};

const inputStyle = {
  ...selectStyle,
  maxWidth: 320,
  marginBottom: 0
};