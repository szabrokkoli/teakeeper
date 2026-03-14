import React, { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { supabase } from '../supabaseClient';
import styles from '../styles/AdminDashboard.module.css';
import StatsOverview from '../components/StatsOverview';
import TabNavigation from '../components/TabNavigation';
import AdminTeaManager from '../components/Admin/AdminTeaManager';
import AdminCategoryManager from '../components/Admin/AdminCategoryManager';
import AdminTagManager from '../components/Admin/AdminTagManager';

// ...existing code...

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('teas');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase.from('tea_categories').select('*');
    if (!error) setCategories(data || []);
  }

  async function fetchTags() {
    const { data, error } = await supabase.from('tags').select('*');
    if (!error) setTags(data || []);
  }

  // ...existing code...

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
        {/* --- TEÁK TAB --- */}
        {activeTab === 'teas' && (
          <AdminTeaManager categories={categories} tags={tags} />
        )}

        {/* --- KATEGÓRIÁK TAB --- */}
        {activeTab === 'categories' && (
          <AdminCategoryManager categories={categories} />
        )}

        {/* --- CÍMKÉK TAB --- */}
        {activeTab === 'tags' && (
          <AdminTagManager tags={tags} />
        )}

        {/* --- RECEPTEK TAB --- */}
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