import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';
import { supabase } from '../supabaseClient';
import { teaService } from '../services/teaService.js';
import styles from '../styles/AdminDashboard.module.css';
import StatsOverview from '../components/StatsOverview';
import InputGroup from '../components/InputGroup';
import TabNavigation from '../components/TabNavigation';

const teaFields = [
  { key: 'name.hu', label: 'Név (HU)' },
  { key: 'name.en', label: 'Név (EN)' },
  { key: 'category', label: 'Kategória' },
  { key: 'origin.hu', label: 'Származás (HU)' },
  { key: 'origin.en', label: 'Származás (EN)' },
  { key: 'description.hu', label: 'Leírás (HU)' },
  { key: 'description.en', label: 'Leírás (EN)' },
  { key: 'image_url', label: 'Kép URL' },
  { key: 'long_description.hu', label: 'Hosszú leírás (HU)' },
  { key: 'long_description.en', label: 'Hosszú leírás (EN)' },
  { key: 'history.hu', label: 'Történet (HU)' },
  { key: 'history.en', label: 'Történet (EN)' },
  { key: 'tags', label: 'Tagek' }
];

export default function AdminDashboard() {
  const [openTeaId, setOpenTeaId] = useState(null);
  const [showTeaModal, setShowTeaModal] = useState(false);
  const [activeTab, setActiveTab] = useState('teas');
  const [teas, setTeas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [teaEditId, setTeaEditId] = useState(null);
  const [teaEditValues, setTeaEditValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'teas') {
      fetchTeas();
      fetchCategories();
      fetchTags();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'tags') {
      fetchTags();
    }
  }, [activeTab]);

  async function fetchTeas() {
    const teasRaw = await teaService.getAllTeas();
    const teas = teasRaw.map(tea => ({
      ...tea,
      name: tea.name || {},
      origin: tea.origin || {},
      description: tea.description || {},
      long_description: tea.long_description || {},
      history: tea.history || {},
      tags: tea.tea_tags ? tea.tea_tags.map(tt => tt.tag) : []
    }));
    setTeas(teas);
  }

  async function fetchCategories() {
    const { data, error } = await supabase.from('tea_categories').select('*');
    if (!error) setCategories(data || []);
  }

  async function fetchTags() {
    const { data, error } = await supabase.from('tags').select('*');
    if (!error) setTags(data || []);
  }

  function handleTeaEdit(tea) {
    setTeaEditId(tea.id);
    setTeaEditValues({
      nameHu: tea.name?.hu || '',
      nameEn: tea.name?.en || '',
      category: tea.category_id || '',
      originHu: tea.origin?.hu || '',
      originEn: tea.origin?.en || '',
      descriptionHu: tea.description?.hu || '',
      descriptionEn: tea.description?.en || '',
      image_url: tea.image_url || '',
      longDescHu: tea.long_description?.hu || '',
      longDescEn: tea.long_description?.en || '',
      historyHu: tea.history?.hu || '',
      historyEn: tea.history?.en || '',
      tags: tea.tags?.map(t => String(t.id)) || []
    });
    setShowTeaModal(true);
  }

  function handleTeaEditChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const tagId = String(value);
      
      setTeaEditValues(prev => {
        let currentTags = prev.tags;
        if (currentTags === undefined) {
          const activeTeaId = teaEditId || openTeaId;
          const activeTea = teas.find(t => t.id === activeTeaId);
          currentTags = activeTea ? activeTea.tags.map(t => String(t.id)) : [];
        }

        const tagList = currentTags.map(String);
        let newTags;
        
        if (checked) {
          newTags = [...tagList, tagId].filter((v, i, arr) => arr.indexOf(v) === i);
        } else {
          newTags = tagList.filter(t => t !== tagId);
        }
        
        return {
          ...prev,
          tags: newTags
        };
      });
    } else {
      setTeaEditValues(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handleTeaEditSave() {
    setLoading(true);
    const updateObj = {
      name: { hu: teaEditValues.nameHu, en: teaEditValues.nameEn },
      category_id: teaEditValues.category,
      origin: { hu: teaEditValues.originHu, en: teaEditValues.originEn },
      description: { hu: teaEditValues.descriptionHu, en: teaEditValues.descriptionEn },
      image_url: teaEditValues.image_url,
      long_description: { hu: teaEditValues.longDescHu, en: teaEditValues.longDescEn },
      history: { hu: teaEditValues.historyHu, en: teaEditValues.historyEn }
    };
    await supabase.from('teas').update(updateObj).eq('id', teaEditId || openTeaId);
    
    // tagek frissítése külön
    // ...tagek update logika ide...
    
    setLoading(false);
    setTeaEditId(null);
    setOpenTeaId(null);
    setTeaEditValues({});
    setShowTeaModal(false);
    fetchTeas();
  }

  function handleTeaEditCancel() {
    setTeaEditId(null);
    setOpenTeaId(null);
    setTeaEditValues({});
    setShowTeaModal(false);
  }

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
          <section>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Név (HU)</th>
                  <th>Név (EN)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teas.map(tea => {
                  const isOpen = openTeaId === tea.id;
                  return (
                    <React.Fragment key={tea.id}>
                      <tr
                        className={isOpen ? styles.openRow : ''}
                        onClick={() => {
                            if (isOpen) {
                                setOpenTeaId(null);
                                setTeaEditValues({});
                            } else {
                                setOpenTeaId(tea.id);
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{tea.name?.hu}</td>
                        <td>{tea.name?.en}</td>
                        <td>
                          <button
                            className={styles.deleteButton}
                            title="Törlés"
                            onClick={e => e.stopPropagation()}
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className={styles.detailRow}>
                          <td colSpan={3}>
                            <div className={styles.teaEditFields}>
                              <div className={styles.editRowGroup}>
                                <InputGroup label="Név (HU)" value={teaEditValues.nameHu !== undefined ? teaEditValues.nameHu : tea.name?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'nameHu' }} />
                                <InputGroup label="Név (EN)" value={teaEditValues.nameEn !== undefined ? teaEditValues.nameEn : tea.name?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'nameEn' }} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                <label className={styles.label} htmlFor="category" style={{ marginBottom: '0.3em', textAlign: 'left', alignSelf: 'flex-start' }}>Kategória</label>
                                <select id="category" name="category" value={teaEditValues.category !== undefined ? teaEditValues.category : tea.category_id || ''} onChange={handleTeaEditChange} className={styles.adminInput} style={{ textAlign: 'left' }}>
                                  <option value="">Válassz kategóriát...</option>
                                  {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name?.hu || cat.name?.en}</option>
                                  ))}
                                </select>
                              </div>
                              <div className={styles.editRowGroup}>
                                <InputGroup label="Származás (HU)" value={teaEditValues.originHu !== undefined ? teaEditValues.originHu : tea.origin?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'originHu' }} />
                                <InputGroup label="Származás (EN)" value={teaEditValues.originEn !== undefined ? teaEditValues.originEn : tea.origin?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'originEn' }} />
                              </div>
                              <div className={styles.editRowGroup}>
                                <InputGroup label="Leírás (HU)" value={teaEditValues.descriptionHu !== undefined ? teaEditValues.descriptionHu : tea.description?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'descriptionHu' }} />
                                <InputGroup label="Leírás (EN)" value={teaEditValues.descriptionEn !== undefined ? teaEditValues.descriptionEn : tea.description?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'descriptionEn' }} />
                              </div>
                              <InputGroup label="Kép URL" value={teaEditValues.image_url !== undefined ? teaEditValues.image_url : tea.image_url || ''} onChange={handleTeaEditChange} inputProps={{ name: 'image_url' }} />
                              <div className={styles.editRowGroup}>
                                <InputGroup label="Hosszú leírás (HU)" value={teaEditValues.longDescHu !== undefined ? teaEditValues.longDescHu : tea.long_description?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'longDescHu' }} />
                                <InputGroup label="Hosszú leírás (EN)" value={teaEditValues.longDescEn !== undefined ? teaEditValues.longDescEn : tea.long_description?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'longDescEn' }} />
                              </div>
                              <div className={styles.editRowGroup}>
                                <InputGroup label="Történet (HU)" value={teaEditValues.historyHu !== undefined ? teaEditValues.historyHu : tea.history?.hu || ''} onChange={handleTeaEditChange} inputProps={{ name: 'historyHu' }} />
                                <InputGroup label="Történet (EN)" value={teaEditValues.historyEn !== undefined ? teaEditValues.historyEn : tea.history?.en || ''} onChange={handleTeaEditChange} inputProps={{ name: 'historyEn' }} />
                              </div>
                              <div className={styles.tagCheckboxList}>
                                <span>Tagek:</span>
                                {tags.map(tag => (
                                  <label key={tag.id} className={styles.tagCheckboxLabel}>
                                    <input
                                      type="checkbox"
                                      name="tags"
                                      value={String(tag.id)}
                                      checked={
                                        teaEditValues.tags !== undefined
                                          ? teaEditValues.tags.map(String).includes(String(tag.id))
                                          : (tea.tags || []).map(t => String(t.id)).includes(String(tag.id))
                                      }
                                      onChange={handleTeaEditChange}
                                    />
                                    {tag.name?.hu || tag.name?.en}
                                  </label>
                                ))}
                              </div>
                              <div className={styles.modalActions}>
                                <button className={styles.saveButton} onClick={handleTeaEditSave}><MdCheck /> Mentés</button>
                                <button className={styles.cancelButton} onClick={handleTeaEditCancel}><MdClose /> Mégse</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {showTeaModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h2>Tea szerkesztése</h2>
                  <InputGroup label="Név (HU)" value={teaEditValues.nameHu} onChange={handleTeaEditChange} inputProps={{ name: 'nameHu' }} />
                  <InputGroup label="Név (EN)" value={teaEditValues.nameEn} onChange={handleTeaEditChange} inputProps={{ name: 'nameEn' }} />
                  <select name="category" value={teaEditValues.category} onChange={handleTeaEditChange} className={styles.adminInput}>
                    <option value="">Válassz kategóriát...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name?.hu || cat.name?.en}</option>
                    ))}
                  </select>
                  <InputGroup label="Származás (HU)" value={teaEditValues.originHu} onChange={handleTeaEditChange} inputProps={{ name: 'originHu' }} />
                  <InputGroup label="Származás (EN)" value={teaEditValues.originEn} onChange={handleTeaEditChange} inputProps={{ name: 'originEn' }} />
                  <InputGroup label="Leírás (HU)" value={teaEditValues.descriptionHu} onChange={handleTeaEditChange} inputProps={{ name: 'descriptionHu' }} />
                  <InputGroup label="Leírás (EN)" value={teaEditValues.descriptionEn} onChange={handleTeaEditChange} inputProps={{ name: 'descriptionEn' }} />
                  <InputGroup label="Kép URL" value={teaEditValues.image_url} onChange={handleTeaEditChange} inputProps={{ name: 'image_url' }} />
                  <InputGroup label="Hosszú leírás (HU)" value={teaEditValues.longDescHu} onChange={handleTeaEditChange} inputProps={{ name: 'longDescHu' }} />
                  <InputGroup label="Hosszú leírás (EN)" value={teaEditValues.longDescEn} onChange={handleTeaEditChange} inputProps={{ name: 'longDescEn' }} />
                  <InputGroup label="Történet (HU)" value={teaEditValues.historyHu} onChange={handleTeaEditChange} inputProps={{ name: 'historyHu' }} />
                  <InputGroup label="Történet (EN)" value={teaEditValues.historyEn} onChange={handleTeaEditChange} inputProps={{ name: 'historyEn' }} />
                  <div className={styles.tagCheckboxList}>
                    <span>Tagek:</span>
                    {tags.map(tag => (
                      <label key={tag.id} className={styles.tagCheckboxLabel}>
                        <input
                          type="checkbox"
                          name="tags"
                          value={String(tag.id)}
                          checked={
                            teaEditValues.tags !== undefined
                              ? teaEditValues.tags.map(String).includes(String(tag.id))
                              : (teas.find(t => t.id === teaEditId)?.tags || []).map(t => String(t.id)).includes(String(tag.id))
                          }
                          onChange={handleTeaEditChange}
                        />
                        {tag.name?.hu || tag.name?.en}
                      </label>
                    ))}
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.saveButton} onClick={handleTeaEditSave}><MdCheck /> Mentés</button>
                    <button className={styles.cancelButton} onClick={handleTeaEditCancel}><MdClose /> Mégse</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* --- KATEGÓRIÁK TAB --- */}
        {activeTab === 'categories' && (
          <section>
            <h2>Kategóriák kezelése</h2>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Név (HU)</th>
                  <th>Név (EN)</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td>{cat.name?.hu}</td>
                    <td>{cat.name?.en}</td>
                    <td>
                      <button className={styles.editButton} title="Szerkesztés"><MdEdit /></button>
                      <button className={styles.deleteButton} title="Törlés"><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* --- CÍMKÉK TAB --- */}
        {activeTab === 'tags' && (
          <section>
            <h2>Címkék kezelése</h2>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Név (HU)</th>
                  <th>Név (EN)</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {tags.map(tag => (
                  <tr key={tag.id}>
                    <td>{tag.name?.hu}</td>
                    <td>{tag.name?.en}</td>
                    <td>
                      <button className={styles.editButton} title="Szerkesztés"><MdEdit /></button>
                      <button className={styles.deleteButton} title="Törlés"><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
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