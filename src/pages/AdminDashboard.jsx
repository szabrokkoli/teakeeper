import { useEffect, useState } from 'react';
import { teaService } from '../services/teaService';
import styles from '../styles/pages/AdminDashboard/AdminDashboard.module.css';
import StatsOverview from '../components/Admin/StatsOverview';
import TabNavigation from '../components/commons/TabNavigation';
import AdminTeaManager from '../components/Admin/AdminTeaManager';
import AdminCategoryManager from '../components/Admin/AdminCategoryManager';
import AdminTagManager from '../components/Admin/AdminTagManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('teas');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);


  useEffect(() => {

    async function fetchData() {
      try {
        const [cat, tag] = await Promise.all([
          teaService.getAllCategories(),
          teaService.getAllTags()
        ]);
        setCategories(cat);
        setTags(tag);
      } catch (e) {
        setCategories([]);
        setTags([]);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Admin Vezérlőpult</h1>
      </header>
      <StatsOverview lang={'hu'} onCardClick={tab => setActiveTab(tab)} />
      <TabNavigation
        tabs={[
          { key: 'teas', label: 'Teák' },
          { key: 'categories', label: 'Kategóriák' },
          { key: 'tags', label: 'Címkék' },
          { key: 'recipes', label: 'Receptek' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className={styles.tabContent}>
        
        {activeTab === 'teas' && (
          <AdminTeaManager categories={categories} tags={tags} />
        )}

        {activeTab === 'categories' && (
          <AdminCategoryManager categories={categories} />
        )}

        {activeTab === 'tags' && (
          <AdminTagManager tags={tags} />
        )}

        {activeTab === 'recipes' && (
          <section>
            <h2>Receptek kezelése</h2>
            <p>Itt kezelheted majd a recepteket.</p>
          </section>
        )}

      </div>
    </div>
  );
}