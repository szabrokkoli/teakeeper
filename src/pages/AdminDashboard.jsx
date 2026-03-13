import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../supabaseClient'; // Győződj meg róla, hogy az elérési út jó!
import styles from '../styles/AdminDashboard.module.css';

const localStrings = {
  hu: {
    title: "Admin Vezérlőpult",
    tabTeas: "Teák",
    tabCategories: "Kategóriák",
    tabTags: "Címkék",
    tabRecipes: "Receptek",
    add: "Hozzáadás",
    nameHu: "Név (Magyar)",
    nameEn: "Név (Angol)",
    loading: "Folyamatban...",
    success: "Sikeresen mentve!",
    error: "Hiba történt a mentéskor.",
    deleteConfirm: "Biztosan törlöd?"
  },
  en: {
    title: "Admin Dashboard",
    tabTeas: "Teas",
    tabCategories: "Categories",
    tabTags: "Tags",
    tabRecipes: "Recipes",
    add: "Add New",
    nameHu: "Name (Hungarian)",
    nameEn: "Name (English)",
    loading: "Loading...",
    success: "Saved successfully!",
    error: "Error while saving.",
    deleteConfirm: "Are you sure?"
  }
};

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const s = localStrings[lang];
  
  const [activeTab, setActiveTab] = useState('teas');
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name_hu: '', name_en: '' });
  const [loading, setLoading] = useState(false);

  // Adatok betöltése az aktuális fül alapján
  const fetchItems = async () => {
    if (activeTab === 'teas' || activeTab === 'recipes') return;
    
    const table = activeTab === 'categories' ? 'categories' : 'tags';
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  // Hozzáadás funkció
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_hu || !formData.name_en) return;

    setLoading(true);
    const table = activeTab === 'categories' ? 'categories' : 'tags';
    
    const { error } = await supabase
      .from(table)
      .insert([formData]);

    if (!error) {
      setFormData({ name_hu: '', name_en: '' });
      fetchItems();
    }
    setLoading(false);
  };

  // Törlés funkció
  const handleDelete = async (id) => {
    if (!window.confirm(s.deleteConfirm)) return;
    const table = activeTab === 'categories' ? 'categories' : 'tags';
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchItems();
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>{s.title}</h1>
      </header>

      <nav className={styles.tabs}>
        {['teas', 'categories', 'tags', 'recipes'].map((tab) => (
          <button 
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {s[`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`]}
          </button>
        ))}
      </nav>

      <div className={styles.tabContent}>
        {/* Kategóriák és Címkék Form (Ugyanazt a logikát használják) */}
        {(activeTab === 'categories' || activeTab === 'tags') && (
          <div className={styles.formContainer}>
            <h2>{activeTab === 'categories' ? s.tabCategories : s.tabTags}</h2>
            
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{s.nameHu}</label>
                <input 
                  type="text" 
                  className="input" 
                  value={formData.name_hu}
                  onChange={(e) => setFormData({...formData, name_hu: e.target.value})}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{s.nameEn}</label>
                <input 
                  type="text" 
                  className="input" 
                  value={formData.name_en}
                  onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="button button-primary" disabled={loading}>
                {loading ? s.loading : s.add}
              </button>
            </form>

            <div className={styles.itemList}>
              {items.map(item => (
                <div key={item.id} className={styles.adminItemCard}>
                  <div>
                    <strong>{item.name_hu}</strong> / <small>{item.name_en}</small>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teák és Receptek helyőrzője (maradt a tiéd) */}
        {activeTab === 'teas' && <div><h2>{s.tabTeas}</h2><p className="text-muted">Hamarosan...</p></div>}
        {activeTab === 'recipes' && <div><h2>{s.tabRecipes}</h2><p className="text-muted">Hamarosan...</p></div>}
      </div>
    </div>
  );
}