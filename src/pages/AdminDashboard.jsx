import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';
import styles from '../styles/AdminDashboard.module.css';
import StatsOverview from '../components/StatsOverview';

const localStrings = {
  hu: { title: "Admin Vezérlőpult", tabTeas: "Teák", tabCategories: "Kategóriák", tabTags: "Címkék", tabRecipes: "Receptek", add: "Hozzáadás", nameHu: "Név (HU)", nameEn: "Név (EN)" },
  en: { title: "Admin Dashboard", tabTeas: "Teas", tabCategories: "Categories", tabTags: "Tags", tabRecipes: "Recipes", add: "Add New", nameHu: "Name (HU)", nameEn: "Name (EN)" }
};

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const s = localStrings[lang || 'hu'] || localStrings.hu;
  
  const [activeTab, setActiveTab] = useState('categories');
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ hu: '', en: '' }); // JSON szerkezetnek megfelelően
  const [loading, setLoading] = useState(false);

  const getTableName = (tab) => {
    return tab === 'categories' ? 'tea_categories' : 'tags';
  };

  const fetchItems = async () => {
    if (activeTab === 'teas' || activeTab === 'recipes') return;
    setLoading(true);
    const { data, error } = await supabase.from(getTableName(activeTab)).select('*');
    if (error) console.error("Hiba:", error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hu || !formData.en) return;

    setLoading(true);
    // Itt a trükk: a 'name' oszlopba küldjük a teljes objektumot
    const { error } = await supabase
      .from(getTableName(activeTab))
      .insert([{ name: { hu: formData.hu, en: formData.en } }]);

    if (!error) {
      setFormData({ hu: '', en: '' });
      fetchItems();
    } else {
      alert("Hiba: " + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törlöd?")) return;
    await supabase.from(getTableName(activeTab)).delete().eq('id', id);
    fetchItems();
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>{s.title}</h1>
      </header>

      <StatsOverview lang={lang} onCardClick={(tab) => setActiveTab(tab)} />

      <nav className={styles.tabs}>
        {['teas', 'categories', 'tags', 'recipes'].map((tab) => (
          <button 
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {s[`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`] || tab}
          </button>
        ))}
      </nav>

      <div className={styles.tabContent}>
        {(activeTab === 'categories' || activeTab === 'tags') && (
          <section>
            <form onSubmit={handleSubmit} className={styles.adminForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{s.nameHu}</label>
                <input 
                  className={styles.adminInput}
                  value={formData.hu}
                  onChange={e => setFormData({...formData, hu: e.target.value})}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{s.nameEn}</label>
                <input 
                  className={styles.adminInput}
                  value={formData.en}
                  onChange={e => setFormData({...formData, en: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "..." : s.add}
              </button>
            </form>

            <div className={styles.itemList}>
              {items.map(item => (
                <div key={item.id} className={styles.adminItemCard}>
                  <div className={styles.itemText}>
                    {/* Itt érjük el a JSON-t: item.name.hu és item.name.en */}
                    <span className={styles.huName}>{item.name?.hu || 'Nincs HU név'}</span>
                    <span className={styles.enName}>{item.name?.en || 'Nincs EN név'}</span>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>×</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}